import { z } from 'zod';
import { nonFutureDatetime } from '../utils/datetime.js';
// -- Enums --
export const TaskStatusSchema = z.enum(['pending', 'completed', 'deleted']);
// -- Fields --
const _id = z.uuid({ error: 'Invalid ID format' });
const text = z
    .string()
    .trim()
    .min(4, { error: 'Task must be at least 4 characters long' });
const important = z.boolean();
const urgent = z.boolean();
// -- Schemas --
// (UI only) Form inputs when creating a task
export const TaskInputSchema = z.object({
    text,
    important,
    urgent,
});
// Full task record, source of truth for DB and sync
export const TaskSchema = TaskInputSchema.extend({
    _id,
    status: TaskStatusSchema.default('pending'),
    completedAt: nonFutureDatetime.nullable(),
    createdAt: nonFutureDatetime,
    updatedAt: nonFutureDatetime,
});
// (UI only) User can only edit text — all other updates are internal operations
export const UpdateTaskTextSchema = TaskSchema.pick({
    _id: true,
    text: true,
    updatedAt: true,
});
export const UpdateTaskSchema = TaskSchema.omit({
    _id: true,
    createdAt: true,
}).partial({
    text: true,
    important: true,
    urgent: true,
    status: true,
    completedAt: true,
});
export const TaskIdParamSchema = z.object({
    id: TaskSchema.shape._id
});
