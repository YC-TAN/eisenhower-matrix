import {connect} from 'mongoose';

import {env} from './env.js';
import {logger} from '../utils/logger.js';

export const connectDB = async () => {
  await connect(env.MONGO_URI, { family: 4 });
  logger.info('Connected to MongoDB');
};
