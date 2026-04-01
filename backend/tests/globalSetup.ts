import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

async function globalSetup() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('globalSetup must only run in test environment');
  }

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set in .env.test');

  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}

export default globalSetup;