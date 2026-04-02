import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';

import TaskModel from '../src/models/taskModel';
import { Task } from '@todo-matrix/shared';
import { seedTasks, SeedTasks } from './helper';

test.describe('Task API', () => {

    const BASE_URL: string = '/api/tasks';
    let tasks: SeedTasks;

    test.beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI!);
    });

    test.afterAll(async () => {
        await mongoose.connection.close();
    });

    test.describe('GET /', () => {
        test('should return "Hello!"', async ({request}) => {
            const res = await request.get('/');
            
            await expect(res).toBeOK();
            expect(res.status()).toBe(200);

            const text = await res.text();
            expect(text).toBe('Hello!');

        });
    });

    test.describe('GET /api/tasks', () => {

        test.describe('when no tasks exist', () => {
            test.beforeEach(async () => {
                await TaskModel.deleteMany({});
            });

            test('should return empty array when no tasks exist', async ({request}) => {
                const res = await request.get(BASE_URL);

                await expect(res).toBeOK();
                expect(res.status()).toBe(200);

                const body = await res.json() as Task[];
                expect(Array.isArray(body)).toBeTruthy();
                expect(body).toHaveLength(0);
            });
        });

        test.describe('when there are some tasks', () => {
            
            test.beforeAll(async () => {
                tasks = await seedTasks();
            });

            test.afterAll(async () => {
                await TaskModel.deleteMany({});
            });

            test('should return all tasks when there are tasks', async ({ request }) => {
                const res = await request.get(BASE_URL);
                await expect(res).toBeOK();
                expect(res.status()).toBe(200);
                const body = await res.json() as Task[];
                expect(Array.isArray(body)).toBeTruthy();
                expect(body).toHaveLength(4);
            });

            test('should return task with correct shape', async ({ request }) => {
                const res = await request.get(BASE_URL);
                const body = await res.json() as Task[];
                const task = body[0];

                expect(task).toMatchObject({
                    _id: expect.any(String),
                    text: expect.any(String),
                    important: expect.any(Boolean),
                    urgent: expect.any(Boolean),
                    status: expect.stringMatching(/^(pending|completed|deleted)$/),
                    completedAt: null,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                });
            });

        });
    });

    test.describe('GET /api/tasks/:id', () => {
        test.beforeAll(async () => {
            tasks = await seedTasks();
        });

        test.afterAll(async () => {
            await TaskModel.deleteMany({});
        }); 

        test('should return task by id', async ({ request }) => {
            const res = await request.get(`${BASE_URL}/${tasks.doFirst._id}`);
            await expect(res).toBeOK();
            expect(res.status()).toBe(200);
            const body = await res.json() as Task;

            expect(body).toMatchObject({
                _id: tasks.doFirst._id,
                text: tasks.doFirst.text,
                important: tasks.doFirst.important,
                urgent: tasks.doFirst.urgent,
                status: tasks.doFirst.status,
                completedAt: tasks.doFirst.completedAt,
                createdAt: tasks.doFirst.createdAt.toISOString(),
                updatedAt: tasks.doFirst.updatedAt.toISOString()
            });        
        });

        test('should return 404 for non-existent id', async ({ request }) => {
            const res = await request.get(`${BASE_URL}/${crypto.randomUUID()}`);
            expect(res.status()).toBe(404);
        });

        test('should return 400 when id is invalid', async({request}) => {
            const invalidId = "invalid";
            const res = await request.get(`${BASE_URL}/${invalidId}`);
            expect(res.status()).toBe(400);
        });
    });
});