import express from "express";
import mongoose from "mongoose";
import { env } from './config/env';
import { logger, toError } from "./utils/logger";

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
    logger.info("Someone pinged !");
    res.send('Hello');
});

const connectDB = async () => {
  await mongoose.connect(env.MONGO_URI, { family: 4 });
  logger.info('Connected to MongoDB');
};

const start = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server', toError(error));
    process.exit(1);
  }
};

void start();