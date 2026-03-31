import express, {Request, Response} from 'express';

import taskRouter from './routes/taskRoutes';
import { logger } from './utils/logger';
import { errorMiddleware, unknownEndpoint } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.get('/', (_req: Request, res: Response<string>) => {
    logger.info("Someone pinged!");
    res.send('Hello!');
});

app.use('/api/task', taskRouter);

app.use(unknownEndpoint);
app.use(errorMiddleware);

export default app;