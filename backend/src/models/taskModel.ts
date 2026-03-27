import { Schema, model } from 'mongoose';
import { Task, TaskStatusSchema } from '@todo-matrix/shared';

const TaskSchema = new Schema<Task>({
  _id: { type: String, required: true, unique: true }, // UUID generated from frontend to support offline first architecture
  text: { type: String, required: true, minlength: 4 },
  important: { type: Boolean, required: true },
  urgent: { type: Boolean, required: true },
  status: { type: String, enum: TaskStatusSchema.options, default: 'pending' },
  completedAt: { type: Date },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
}, { _id: false, versionKey: false }); // Not using Mongoose generated id

export default model<Task>('Task', TaskSchema);