import { taskRepository } from '../repositories/taskRepository';
import { Task, UpdateTask } from '@todo-matrix/shared';

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    return taskRepository.findAll();
  },

  getTaskById: async (id: string): Promise<Task | null> => {
    return taskRepository.findById(id);
  },

  createTask: async (input: Task): Promise<Task> => {
    const task: Task = {
      ...input
    };
    return taskRepository.create(task);
  },

  updateTask: async (id: string, data: UpdateTask): Promise<Task | null> => {
    return taskRepository.update(id, data);
  },

  deleteTask: async (id: string): Promise<Task | null> => {
    return taskRepository.remove(id);
  },
};