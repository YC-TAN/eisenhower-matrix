import { taskRepository } from '../repositories/taskRepository';
import { Task, UpdateTask } from '@todo-matrix/shared';
import { NotFoundError } from '../utils/errors';

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    return taskRepository.findAll();
  },

  getTaskById: async (id: string): Promise<Task> => {
    const task = await taskRepository.findById(id);
    if (!task) throw new NotFoundError('Task');
    return task;
  },

  createTask: async (input: Task): Promise<Task> => {
    const task: Task = {
      ...input
    };
    return taskRepository.create(task);
  },

  updateTask: async (id: string, data: UpdateTask): Promise<Task> => {
    const task = await taskRepository.update(id, data);
    if (!task) throw new NotFoundError('Task');
    return task;
  },

  deleteTask: async (id: string): Promise<Task> => {
    const task = await taskRepository.remove(id);
    if (!task) throw new NotFoundError('Task');
    return task;
  },
};