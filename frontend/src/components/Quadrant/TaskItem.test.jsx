import { render, screen, act, fireEvent } from '../../../testSetup';
import userEvent from '@testing-library/user-event';
import { TASKS_LS_KEY } from '../../hooks/useTasks';
import TaskItem from './TaskItem';

const BASE_TASK = {
  id: 'task-abc',
  text: 'Test task item',
  urgent: true,
  important: false,
  status: 'pending',
  createdAt: new Date().toISOString(),
  completedAt: null,
  deletedAt: null,
};

const mockOnEdit = vi.fn();
const mockOnCancelEdit = vi.fn();

function renderItem(props = {}, task = BASE_TASK) {
  localStorage.setItem(TASKS_LS_KEY, JSON.stringify([task]));
  return render(
    <TaskItem
      task={task}
      isEditing={false}
      onEdit={mockOnEdit}
      onCancelEdit={mockOnCancelEdit}
      {...props}
    />
  );
}

function getStored() {
  return JSON.parse(localStorage.getItem(TASKS_LS_KEY) ?? '[]');
}

describe('TaskItem', () => {

  it('should render the task text', () => {
    renderItem();
    expect(screen.getByText(/Test task item/)).toBeInTheDocument();
  });

  it('should render TaskEditForm when isEditing is true', () => {
    renderItem({ isEditing: true });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue(BASE_TASK.text);
  });

  it('should call onEdit when task text is clicked', async () => {
    const user = userEvent.setup();
    renderItem()
    await user.click(screen.getByText(/Test task item/));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should not call onEdit when task text is clicked while busy', async () => {
    const user = userEvent.setup();
    renderItem();

    await user.click(screen.getByRole('button', { name: /mark task as complete/i }));
    await user.click(screen.getByText(/Test task item/i));
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it('should show undo button and hide action buttons after clicking complete', async () => {
    const user = userEvent.setup();
    renderItem()

    await user.click(screen.getByRole('button', { name: /mark task as complete/i }));
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /mark task as complete/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete task/i })).not.toBeInTheDocument();
  });

  it('should show undo button and hide action buttons after clicking delete', async () => {
    const user = userEvent.setup();
    renderItem()

    await user.click(screen.getByRole('button', { name: /delete task/i }));
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /mark task as complete/i })).not.toBeInTheDocument();
  });

  it('should restore action buttons and hide undo after clicking undo', async () => {
    const user = userEvent.setup();
    renderItem()

    await user.click(screen.getByRole('button', { name: /mark task as complete/i }));
    await user.click(screen.getByRole('button', { name: /undo/i }));
    expect(screen.queryByRole('button', { name: /undo/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mark task as complete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete task/i })).toBeInTheDocument();
  });

  it('should set status to completed in localStorage after UNDO_DELAY', () => {
    vi.useFakeTimers();
    renderItem();
    fireEvent.click(screen.getByRole('button', { name: /mark task as complete/i }));
    act(() => vi.advanceTimersByTime(4000));
    const task = getStored().find(t => t.id === BASE_TASK.id);
    expect(task.status).toBe('completed');
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should set status to deleted in localStorage after UNDO_DELAY', () => {
    vi.useFakeTimers();
    renderItem()

    fireEvent.click(screen.getByRole('button', { name: /delete task/i }));
    act(() => vi.advanceTimersByTime(4000));
    const task = getStored().find(t => t.id === BASE_TASK.id);
    expect(task.status).toBe('deleted');
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should not change status in localStorage if undo is clicked before UNDO_DELAY', () => {
    vi.useFakeTimers();
    renderItem()

    fireEvent.click(screen.getByRole('button', { name: /mark task as complete/i }));
    fireEvent.click(screen.getByRole('button', { name: /undo/i }));

    act(() => vi.advanceTimersByTime(4000));
    const task = getStored().find(t => t.id === BASE_TASK.id);
    expect(task.status).toBe('pending');
    expect(screen.queryByRole('button', { name: /undo/i })).not.toBeInTheDocument();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should call onCancelEdit and update text in localStorage when edit is saved', async () => {
    const user = userEvent.setup();
    renderItem({ isEditing: true });

    const input = screen.getByRole('textbox');

    await user.clear(input)
    await user.type(input, 'New text{Enter}')

    expect(mockOnCancelEdit).toHaveBeenCalledTimes(1);
    const task = getStored().find(t => t.id === BASE_TASK.id);
    expect(task.text).toBe('New text');
  });

  it('should call onCancelEdit without updating localStorage when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderItem({ isEditing: true });

    await user.keyboard('{Escape}')
    expect(mockOnCancelEdit).toHaveBeenCalledTimes(1);
    const task = getStored().find(t => t.id === BASE_TASK.id);
    expect(task.text).toBe(BASE_TASK.text);
  });
});