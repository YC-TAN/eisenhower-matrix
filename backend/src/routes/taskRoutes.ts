import { Router, type Request, type Response } from 'express';

import { taskService } from '../services/taskService.js';
import { 
  type Task, 
  UpdateTaskSchema, 
  TaskSchema, 
  TaskIdParamSchema, 
  type TaskIdParam 
} from '@todo-matrix/shared';
import type { ErrorResponse } from '../types/api.js';

const router = Router();

router.get('/', async (_req, res: Response<Task[]>) => {
  const tasks = await taskService.getAllTasks();
  res.status(200).json(tasks);
});

router.get('/:id', async (
  req: Request<TaskIdParam>, 
  res: Response<Task | ErrorResponse>
) => {
  const { id } = TaskIdParamSchema.parse(req.params);
  const task = await taskService.getTaskById(id);
  res.status(200).json(task);
});

router.post('/', async (
  req: Request<unknown, unknown, Task>, 
  res: Response<Task | ErrorResponse>
) => {
  const newTask = TaskSchema.parse(req.body);
  const savedTask = await taskService.createTask(newTask);
  res.status(201).json(savedTask);
});

router.put('/:id', async (
  req: Request<TaskIdParam>, 
  res: Response<Task | ErrorResponse>
) => {
  const { id } = TaskIdParamSchema.parse(req.params);
  const update = UpdateTaskSchema.parse(req.body);
  const updatedTask = await taskService.updateTask(id, update);
  res.status(200).json(updatedTask);
});

router.delete('/:id', async (
  req: Request<TaskIdParam>, 
  res: Response<Task | ErrorResponse>
) => {
  const { id } = TaskIdParamSchema.parse(req.params);
  await taskService.deleteTask(id);
  res.status(204).end();
});

export default router;