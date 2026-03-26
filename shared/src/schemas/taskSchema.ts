import {z} from 'zod';
import { nonFutureDatetime } from '../utils/datetime';

// -- Enums --
export const TaskStatus = z.enum(['pending', 'completed', 'deleted'])

// -- Reusable fields --

const idField = z.string().uuid({ message: 'Invalid ID format' })
const taskTextField = z.string().min(4, { message: 'Task must be at least 4 characters long' })

// -- Schemas --
// User form input when creating a task
export const TaskInputSchema = z.object({
  text: taskTextField,
  important: z.boolean(),
  urgent: z.boolean(),
})

// Full task record, source of truth for DB and sync
export const TaskSchema = TaskInputSchema.extend({
    id: idField,
  status: TaskStatus.default('pending'),
  completedAt: nonFutureDatetime.nullable(),
  createdAt: nonFutureDatetime,
    updatedAt: nonFutureDatetime,
});

// User can only edit text — all other updates are internal operations
export const UpdateTaskSchema = z.object({
  id: idField,
  text: taskTextField,
  updatedAt: nonFutureDatetime,
})

// -- Types --
export type TaskStatus = z.infer<typeof TaskStatus>
export type TaskInput = z.infer<typeof TaskInputSchema>
export type Task = z.infer<typeof TaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;