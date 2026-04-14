import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TaskEditForm from './TaskEditForm';

const mockOnSave = vi.fn();
const mockOnCancel = vi.fn();

function renderEditForm(initialText = 'Valid initial text') {
  return render(
    <TaskEditForm
      initialText={initialText}
      onSave={mockOnSave}
      onCancel={mockOnCancel}
    />
  );
}

describe('TaskEditForm', () => {
  it('should render with initialText pre-filled in the input', () => {
    renderEditForm('My task');
    expect(screen.getByRole('textbox')).toHaveValue('My task');
  });

  it('should focus the input on mount', () => {
    renderEditForm();
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('should show info hint when there is no validation error', () => {
    renderEditForm('Valid task text');
    expect(screen.getByText(/press/i)).toBeInTheDocument();
  });

  it('should show an error and hide the hint when text becomes invalid', async () => {
    
    const user = userEvent.setup();
    renderEditForm();

    await user.clear(screen.getByRole('textbox'))
    await user.keyboard('{Enter}')

    expect(screen.queryByText(/press/i)).not.toBeInTheDocument();

    const errorEl = document.querySelector('.error');
    expect(errorEl).toBeInTheDocument();
  });

  it('should call onSave with trimmed text on Enter when valid', async () => {
    const user = userEvent.setup();
    renderEditForm();

    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), '  Updated task   {Enter}')
    
    expect(mockOnSave).toHaveBeenCalledWith('Updated task');
  });

  it('should not call onSave on Enter when text is invalid', async () => {
    const user = userEvent.setup();
    renderEditForm();

    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), '     {Enter}')

    const errorEl = document.querySelector('.error');
    expect(errorEl).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should call onCancel on Escape key', async () => {
    const user = userEvent.setup();
    renderEditForm();

    await user.keyboard('{Escape}')

    expect(mockOnCancel).toHaveBeenCalled();
  });
});