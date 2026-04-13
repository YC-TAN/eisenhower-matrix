// Unit test
import { renderHook, act } from '@testing-library/react';
import { useTasks } from './useTasks';
import { vi, expect, it, describe } from 'vitest';

const LS_KEY = 'matrix_tasks';
 
function getStored() {
  return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
}

const createMockTask = () => {
  const timestamp = new Date().toISOString();
  
  return {
    id: '1',
    text: 'Initial',
    urgent: true,
    important: true,
    status: 'pending',
    updatedAt: timestamp,
    createdAt: timestamp,
    completedAt: null,
  };
};

function seedHook() {
    const seed = [createMockTask()];
    return renderHook(() => useTasks(seed));
  }

describe('useTasks Hook', () => {
  // initial data
  it('should initialize with initialData if localStorage is empty', () => {
    const initial = [createMockTask()];
    const { result } = renderHook(() => useTasks(initial));
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks).toEqual(initial);
  });

  // Add task

  it('should add a new task with correct default values', () => {
    const { result } = renderHook(() => useTasks());
    
    act(() => {
      result.current.addTask({ 
        text: 'New Task', 
        important: true, 
        urgent: true 
      });
    });

    const addedTask = result.current.tasks[0];
    expect(result.current.tasks).toHaveLength(1);
    expect(addedTask.text).toBe('New Task');
    expect(addedTask.urgent).toBe(true);
    expect(addedTask.important).toBe(true);
    expect(addedTask.status).toBe('pending');
    expect(addedTask.createdAt).toBeDefined();
    expect(addedTask.updatedAt).toBeDefined();
    expect(addedTask.completedAt).toBeNull();
    expect(addedTask.id).toBeDefined();
  });

  it('should persist the new task to localStorage', () => {
    const { result } = renderHook(() => useTasks());
 
    act(() => {
      result.current.addTask({ 
        text: 'Persist me', 
        urgent: false, 
        important: true 
      });
    });
 
    const stored = getStored();
    expect(stored).toHaveLength(1);
    expect(stored[0].text).toBe('Persist me');
  });
 
  it('should accumulate multiple tasks', () => {
    const { result } = renderHook(() => useTasks());
 
    act(() => {
      result.current.addTask({ text: 'Task A', urgent: true, important: true });
      result.current.addTask({ text: 'Task B', urgent: false, important: false });
    });
 
    expect(result.current.tasks).toHaveLength(2);
  });

  it('should not add a task if the text is empty or whitespace', () => {
    const {result} = seedHook();
    
    act(() => {
      result.current.addTask({ text: '   ', important: false, urgent: false });
    });

    expect(result.current.tasks).toHaveLength(1);
  });

  // Update task

  it('should update task text and properties', () => {
    const {result} = seedHook();

    act(() => {
      result.current.updateTask('1', { text: 'Updated Text' });
    });

    expect(result.current.tasks[0].text).toBe('Updated Text');
  });

  it('should set completedAt timestamp when status changes to completed', () => {
    const {result} = seedHook();

    // Toggle to completed
    act(() => {
      result.current.updateTask('1', { status: 'completed' });
    });
    expect(result.current.tasks[0].completedAt).not.toBeNull();
  });

  it('should clear completedAt when reverting from completed back to pending', () => {
    const {result} = seedHook();

    act(() => {
      result.current.updateTask('1', { status: 'completed' });
    });
    expect(result.current.tasks[0].completedAt).not.toBeNull();
 
    act(() => {
      result.current.updateTask('1', { status: 'pending' });
    });
 
    const task = result.current.tasks.find((t) => t.id === '1');
    expect(task.status).toBe('pending');
    expect(task.completedAt).toBeNull();
  });

  it('should only update text and updatedAt when update text', () => {
    const initial = [createMockTask()];
    const { result } = renderHook(() => useTasks(initial));
 
    act(() => {
      result.current.updateTask('1', { text: 'Updated text' });
    });
 
    const task = result.current.tasks.find((t) => t.id === '1');
    expect(task.text).toBe('Updated text');
    expect(task.important).toBe(true);
    expect(task.urgent).toBe(true);
    expect(task.status).toBe('pending');
    expect(task.completedAt).toBeNull();
    expect(task.createdAt).toEqual(initial[0].createdAt);
    expect(task.updatedAt).not.toBe(initial[0].updatedAt);
  });

  it('should persist the update to localStorage', () => {
    const { result } = seedHook();
 
    act(() => {
      result.current.updateTask('1', {
        important: false,
        urgent: false,
      });
    });
 
    const stored = getStored();
    const task = stored.find((t) => t.id === '1');
    expect(task.urgent).toBe(false);
    expect(task.important).toBe(false);
  });

  it('should delete a task by id', () => {
    const initial = [createMockTask()];
    const { result } = renderHook(() => useTasks(initial));

    act(() => {
      result.current.deleteTask('1');
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  it('should persist changes to localStorage', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask({ text: 'Persist Task' });
    });

    expect(setItemSpy).toHaveBeenCalled();
    const lastCallIndex = setItemSpy.mock.calls.length - 1;
    const savedData = JSON.parse(setItemSpy.mock.calls[lastCallIndex][1]);
    expect(savedData[0].text).toBe('Persist Task');
  });
});