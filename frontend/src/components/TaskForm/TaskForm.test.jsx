import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../testSetup';
import TaskForm from './index.jsx';
import { TASKS_LS_KEY } from '../../hooks/useTasks';

const mockSetNotification = vi.fn();
vi.mock('../../stores/useNotification', () => ({
  useNotificationActions: () => ({ setNotification: mockSetNotification }),
}));

function getStored() {
  return JSON.parse(localStorage.getItem(TASKS_LS_KEY) ?? '[]');
}

function renderForm() {
  localStorage.setItem(TASKS_LS_KEY, JSON.stringify([]));
  return render(<TaskForm />);
}

describe('TaskForm initial render', () => {
  it('should render the text input field', () => {
    renderForm();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render the Add button', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('should render the Important checkbox', () => {
    renderForm();
    expect(screen.getByRole('checkbox', { name: /important/i })).toBeInTheDocument();
  });

  it('should render the Urgent checkbox', () => {
    renderForm();
    expect(screen.getByRole('checkbox', { name: /urgent/i })).toBeInTheDocument();
  });

  it('should start with an empty text input', () => {
    renderForm();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('should start with both checkboxes unchecked', () => {
    renderForm();
    expect(screen.getByRole('checkbox', { name: /important/i })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /urgent/i })).not.toBeChecked();
  });
});

describe('TaskForm quadrant preview', () => {
  it('should not show the preview when no checkbox is checked', () => {
    renderForm();
    expect(screen.queryByText(/Q1|Q2|Q3|Q4/)).not.toBeInTheDocument();
  });

  it('should show Q1 · Do First when both urgent and important are checked', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('checkbox', { name: /urgent/i }));
    await user.click(screen.getByRole('checkbox', { name: /important/i }));

    expect(screen.getByText(/Q1 · Do First/)).toBeInTheDocument();
  });

  it('should show Q2 · Schedule when only important is checked', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('checkbox', { name: /important/i }));

    expect(screen.getByText(/Q2 · Schedule/)).toBeInTheDocument();
  });

  it('should show Q3 · Delegate when only urgent is checked', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('checkbox', { name: /urgent/i }));

    expect(screen.getByText(/Q3 · Delegate/)).toBeInTheDocument();
  });
});

describe('TaskForm validation', () => {
  it('should show an error when submitted with an empty input', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });

  it('should show an error when submitted with a whitespace-only input', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByRole('textbox'), '   ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should set aria-invalid on the input when there is an error', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should clear the error when the user starts typing after a failed submit', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox'), 'A');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should not add a task to localStorage when validation fails', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(getStored()).toHaveLength(0);
  });
});

describe('TaskForm successful submission', () => {
  it('should add the task to localStorage on valid submit', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByRole('textbox'), 'Buy milk');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      const stored = getStored();
      expect(stored).toHaveLength(1);
      expect(stored[0].text).toBe('Buy milk');
    });
  });

  it('should trim whitespace from the task text before saving', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByRole('textbox'), '  Buy milk  ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(getStored()[0].text).toBe('Buy milk');
    });
  });

  it('should save the correct urgent and important flags', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByRole('textbox'), 'Urgent task');
    await user.click(screen.getByLabelText(/urgent/i));
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      const stored = getStored();
      expect(stored[0].urgent).toBe(true);
      expect(stored[0].important).toBe(false);
    });
  });

  it('should reset the text input after a successful submit', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByRole('textbox'), 'Buy milk');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  it('should uncheck both checkboxes after a successful submit', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByRole('textbox'), 'Buy milk');
    await user.click(screen.getByLabelText(/urgent/i));
    await user.click(screen.getByLabelText(/important/i));
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /urgent/i })).not.toBeChecked();
      expect(screen.getByRole('checkbox', { name: /important/i })).not.toBeChecked();
    });
  });

  it('should fire a success notification after a valid submit', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByRole('textbox'), 'Buy milk');
    await user.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(mockSetNotification).toHaveBeenCalledWith({
        message: "New Task 'Buy milk' added",
        type: 'success',
      });
    });
  });

  it('should not fire a notification when validation fails', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockSetNotification).not.toHaveBeenCalled();
  });
});