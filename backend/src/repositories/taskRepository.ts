import { BaseRepository } from './baseRepository';
import TaskModel from '../models/taskModel';
import { Task } from '@todo-matrix/shared';

class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super(TaskModel);
  }

  // Task _id uses UUID (client-generated for offline support).
  // Overrides findById() to use findOne({ _id }) for UUID compatibility.
  async findById(id: string): Promise<Task | null> {
    return this.model.findOne({ _id: id }).lean<Task>();
  }
}

export const taskRepository = new TaskRepository();