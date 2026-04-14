import { render, screen } from '../../../testSetup';
import { TASKS_LS_KEY } from '../../hooks/useTasks';
import Quadrant from './index';

const config = {
    label: 'Do First',
    action: 'Tackle immediately',
    cssVarBg: '--color-q1-bg',
    cssVarBorder: '--color-q1-border',
    cssVarText: '--color-q1-text',
};

const TASKS = [
  {
    id: 'task-1',
    text: 'Urgent task',
    urgent: true,
    important: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    completedAt: null,
    deletedAt: null,
  },
  {
    id: 'task-2',
    text: 'Another task',
    urgent: true,
    important: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    completedAt: null,
    deletedAt: null,
  },
];

const mockOnEdit = vi.fn();
const mockOnCancelEdit = vi.fn();

function renderQuadrant(tasks = TASKS, editingTaskId = null) {
  localStorage.setItem(TASKS_LS_KEY, JSON.stringify(tasks));
  return render(
    <Quadrant
      config={config}
      tasks={tasks}
      editingTaskId={editingTaskId}
      onEdit={mockOnEdit}
      onCancelEdit={mockOnCancelEdit}
    />
  );
}

describe('Quadrant', () => {
  it('should render the quadrant label and action', () => {
    renderQuadrant();
    expect(screen.getByText('Do First')).toBeInTheDocument();
    expect(screen.getByText('Tackle immediately')).toBeInTheDocument();
  });

  it('should render the correct task count', () => {
    renderQuadrant();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render empty state when there are no tasks', () => {
    renderQuadrant([]);
    expect(screen.getByText(/no tasks here/i)).toBeInTheDocument();
  });

  it('should not render empty state when tasks exist', () => {
    renderQuadrant();
    expect(screen.queryByText(/no tasks here/i)).not.toBeInTheDocument();
  });

  it('should render all tasks', () => {
    renderQuadrant();
    expect(screen.getByText(/Urgent task/)).toBeInTheDocument();
    expect(screen.getByText(/Another task/)).toBeInTheDocument();
  });

  it('should put only the matching task into edit mode', () => {
    renderQuadrant(TASKS, 'task-1');
    expect(screen.getByRole('textbox')).toHaveValue('Urgent task');
    expect(screen.getByText(/Another task/)).toBeInTheDocument();
  });

  it('should render no inputs when editingTaskId is null', () => {
    renderQuadrant(TASKS, null);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});