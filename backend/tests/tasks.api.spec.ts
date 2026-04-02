import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';

import TaskModel from '../src/models/taskModel';
import { Task } from '@todo-matrix/shared';
import { seedTasks, SeedTasks } from './helper';
import { beforeEach } from 'node:test';

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

            test('should return all tasks successfully', async ({ request }) => {
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

        test('should return 400 for invalid id', async({request}) => {
            const invalidId = "invalid";
            const res = await request.get(`${BASE_URL}/${invalidId}`);
            expect(res.status()).toBe(400);
        });
    });

    test.describe('POST /api/tasks', () => {
        test.afterAll(async () => {
            await TaskModel.deleteMany({});
        }); 

        test.beforeEach(async () => {
            await TaskModel.deleteMany({});
        });

        const newTask = {
            _id: crypto.randomUUID(),
            text: "create new task",
            important: true,
            urgent: false,
            status: 'pending',
            completedAt: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        test('should create new task', async ({request}) => {
            const res = await request.post(BASE_URL, {data: newTask});

            await expect(res).toBeOK();
            expect(res.status()).toBe(201);

            const body = await res.json() as Task;
            expect(body).toHaveProperty('_id');
            expect(body).toHaveProperty('text', newTask.text);
            expect(body).toHaveProperty('status', newTask.status);
            expect(body).toHaveProperty('urgent', newTask.urgent);
            expect(body).toHaveProperty('important', newTask.important);
            expect(body).toHaveProperty('createdAt', newTask.createdAt.toISOString());
            expect(body).toHaveProperty('completedAt', newTask.completedAt);
            expect(body).toHaveProperty('updatedAt', newTask.updatedAt.toISOString());
        });

        test('should return 400 when text is too short', async ({request}) => {
            const text = "123";
            const res = await request.post(BASE_URL, {data: {...newTask, text}});
            expect(res.status()).toBe(400);
        });

        test('should return 400 when text is missing', async ({request}) => {
            const { text, ...task} = newTask;
            const res = await request.post(BASE_URL, {data: task});
            expect(res.status()).toBe(400);
        });

        test('should return 400 when important is missing', async ({request}) => {
            const { important, ...task} = newTask;
            const res = await request.post(BASE_URL, {data: task});
            expect(res.status()).toBe(400);
        });

        test('should return 400 when urgent is missing', async ({request}) => {
            const { urgent, ...task} = newTask;
            const res = await request.post(BASE_URL, {data: task});
            expect(res.status()).toBe(400);
        });

        test('should return 400 when id is invalid', async ({request}) => {
            const res = await request.post(BASE_URL, {data: {...newTask, _id: "invalid"}});
            expect(res.status()).toBe(400);
        });

        test('should return 400 when status is invalid', async ({request}) => {
            const res = await request.post(BASE_URL, {data: {...newTask, status: "invalid"}});
            expect(res.status()).toBe(400);
        });

        test('should return 400 when createdAt is in the future', async ({ request }) => {
            const future = new Date(Date.now() + 1000 * 60 * 60);
            const res = await request.post(BASE_URL, { data: { ...newTask, createdAt: future } });
            expect(res.status()).toBe(400);
        });

        test('should return 400 when updatedAt is in the future', async ({ request }) => {
            const future = new Date(Date.now() + 1000 * 60 * 60);
            const res = await request.post(BASE_URL, { data: { ...newTask, updatedAt: future } });
            expect(res.status()).toBe(400);
        });
    });

    test.describe('PUT /api/tasks/:id', () => { 

        test.beforeEach(async () => {
            tasks = await seedTasks();
        });

        test.afterEach(async () => {
            await TaskModel.deleteMany({});
        });

        test('should update text', async({request}) => {
            const update = {
                text: "update",
                updatedAt: new Date(),
            };

            const res = await request.put(
                `${BASE_URL}/${tasks.doFirst._id}`, 
                {data: update}
            );

            await expect(res).toBeOK();
            expect(res.status()).toBe(200);

            const body = await res.json() as Task;
            expect(body._id).toBe(tasks.doFirst._id);
            expect(body.text).toBe(update.text);
            expect(body.updatedAt).toBe(update.updatedAt.toISOString());
            expect(body.important).toBe(tasks.doFirst.important);
            expect(new Date(body.updatedAt).getTime()).toBeGreaterThan(
                new Date(tasks.doFirst.updatedAt).getTime()
            );
        });

        test('should update important', async ({ request }) => {
            const update = { important: !tasks.doFirst.important, updatedAt: new Date() };
            const res = await request.put(`${BASE_URL}/${tasks.doFirst._id}`, { data: update });
            await expect(res).toBeOK();
            const body = await res.json() as Task;
            expect(body.important).toBe(update.important);
        });

        test('should update urgent', async ({ request }) => {
            const update = { urgent: !tasks.doFirst.urgent, updatedAt: new Date() };
            const res = await request.put(`${BASE_URL}/${tasks.doFirst._id}`, { data: update });
            await expect(res).toBeOK();
            const body = await res.json() as Task;
            expect(body.urgent).toBe(update.urgent);
        });

        test('should update status', async ({ request }) => {
            const update = { status: 'completed', updatedAt: new Date() };
            const res = await request.put(`${BASE_URL}/${tasks.doFirst._id}`, { data: update });
            await expect(res).toBeOK();
            const body = await res.json() as Task;
            expect(body.status).toBe(update.status);
        });

        test('should return 404 when id does not exist', async ({ request }) => {
            const res = await request.put(
                `${BASE_URL}/${crypto.randomUUID()}`, 
                { data: { text: 'update', updatedAt: new Date() } }
            );
            expect(res.status()).toBe(404);
        });

        test('should return 400 when id is invalid', async ({ request }) => {
            const res = await request.put(
                `${BASE_URL}/${"invalid"}`, 
                { data: { text: 'update', updatedAt: new Date() } }
            );
            expect(res.status()).toBe(400);
        });

        test('should return 400 when updatedAt is in the future', async ({ request }) => {
            const future = new Date(Date.now() + 1000 * 60 * 60);
            const res = await request.put(
                `${BASE_URL}/${tasks.doFirst._id}`, 
                { data: { text: 'update', updatedAt: future } }
            );
            expect(res.status()).toBe(400);
        });

        test('should return 400 when updatedAt is missing', async ({ request }) => {
            const res = await request.put(
                `${BASE_URL}/${tasks.doFirst._id}`, 
                { data: { text: 'update' } }
            );
            expect(res.status()).toBe(400);
        });

        test('should return 400 when status is invalid', async ({ request }) => {
            const update = { status: 'i am invalid', updatedAt: new Date() };
            const res = await request.put(`${BASE_URL}/${tasks.doFirst._id}`, { data: update });
            expect(res.status()).toBe(400);
        });

        test('should return 400 when text is too short', async ({ request }) => {
            const update = { text: '123', updatedAt: new Date() };
            const res = await request.put(`${BASE_URL}/${tasks.doFirst._id}`, { data: update });
            expect(res.status()).toBe(400);
        });

    });
});