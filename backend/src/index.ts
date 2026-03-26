import express from "express";
import { env } from './config/env';
import { logger } from "./utils/logger";

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
    logger.info("Someone pinged !");
    res.send('Hello');
});

app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});