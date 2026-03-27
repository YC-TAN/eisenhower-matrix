import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  MONGO_URI: z.string({ error: 'MONGO_URI is required' }).min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error('Invalid environment variables:');
  logger.error(parsed.error.flatten().fieldErrors);
  process.exit(1);  // fail fast — don't start with bad config
}

export const env = parsed.data;