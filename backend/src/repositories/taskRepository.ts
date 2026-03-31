import { BaseRepository } from './baseRepository';
import TaskModel from '../models/taskModel';
import { Task } from '@todo-matrix/shared';

class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super(TaskModel);
  }
}

export const taskRepository = new TaskRepository();