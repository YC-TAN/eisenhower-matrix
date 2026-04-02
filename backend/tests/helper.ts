import { Task } from "@todo-matrix/shared";
import TaskModel from '../src/models/taskModel';

export interface SeedTasks {
    doFirst: Task;
    delegate: Task;
    schedule: Task;
    eliminate: Task;
}

export function createTaskData(overrides: Partial<Task> = {}): Task {
  const now = new Date();
  return {
    _id: crypto.randomUUID(),
    text: 'Buy milk',
    important: false,
    urgent: false,
    status: 'pending' as const,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function initialData(): SeedTasks {
  return {
    doFirst: createTaskData({ text: 'Book hotel', important: true, urgent: true }),
    delegate: createTaskData({ text: 'Read Rednote', urgent: true }),
    schedule: createTaskData({ text: 'Call mum', important: true}),
    eliminate: createTaskData({ text: 'Trim plant'}),
  };
}

export async function seedTasks(): Promise<SeedTasks> {
    await TaskModel.deleteMany({});
    const data = initialData();
    await TaskModel.insertMany(Object.values(data));
    return data;
}