import { Schema, model } from 'mongoose';
import { type Task, TaskStatusSchema } from '@todo-matrix/shared';

const TaskSchema = new Schema<Task>({
  // UUID will be generated at frontend to support offline
  _id: { type: String, required: true }, 
  text: { type: String, required: true, minlength: 4 },
  important: { type: Boolean, required: true },
  urgent: { type: Boolean, required: true },
  status: { type: String, enum: TaskStatusSchema.options, default: 'pending' },
  completedAt: { type: Date },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
}, { _id: false, versionKey: false }); // Not using Mongoose generated id

export default model<Task>('Task', TaskSchema);