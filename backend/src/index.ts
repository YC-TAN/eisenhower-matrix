import { env } from './config/env.js';
import { logger, toError } from "./utils/logger.js";
import { connectDB } from './config/db.js';
import app from './app.js';

const start = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error: unknown) {
    logger.error('Failed to start server', toError(error));
    process.exit(1);
  }
};

void start();