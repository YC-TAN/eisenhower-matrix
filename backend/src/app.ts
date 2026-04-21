import express, {type Request, type Response} from 'express';

import taskRouter from './routes/taskRoutes.js';
import { logger } from './utils/logger.js';
import { errorMiddleware, unknownEndpoint } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/', (_req: Request, res: Response<string>) => {
    logger.info("Someone pinged!");
    res.send('Hello!');
});

app.use('/api/tasks', taskRouter);

app.use(unknownEndpoint);
app.use(errorMiddleware);

export default app;