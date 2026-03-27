import {z} from 'zod';
import { nonFutureDatetime } from '../utils/datetime';

// -- Enums --
export const TaskStatusSchema = z.enum(['pending', 'completed', 'deleted'])

// -- Fields --

const _id = z.string().uuid({ message: 'Invalid ID format' })
const text = z
  .string()
  .trim()
  .min(4, { message: 'Task must be at least 4 characters long' })
const important = z.boolean()
const urgent = z.boolean()

// -- Schemas --
// User form input when creating a task
export const TaskInputSchema = z.object({
  text,
  important,
  urgent,
})

// Full task record, source of truth for DB and sync
export const TaskSchema = TaskInputSchema.extend({
    _id,
  status: TaskStatusSchema.default('pending'),
  completedAt: nonFutureDatetime.nullable(),
  createdAt: nonFutureDatetime,
    updatedAt: nonFutureDatetime,
});

// User can only edit text — all other updates are internal operations
export const UpdateTaskSchema = TaskSchema.pick({
  _id: true,
  text: true,
  updatedAt: true,
})

// -- Types --
export type TaskStatus = z.infer<typeof TaskStatusSchema>
export type TaskInput = z.infer<typeof TaskInputSchema>
export type Task = z.infer<typeof TaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;