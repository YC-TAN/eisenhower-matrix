import { env } from './config/env';
import { logger, toError } from "./utils/logger";
import { connectDB } from './config/db';
import app from './app';

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