import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedSats } from '../Satellites/satellites.model';

export const MONGOOSE_CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

export const getMemoryServer = (): MongoMemoryServer => {
  const mongoServer = new MongoMemoryServer();
  return mongoServer;
};

export const connectDb = async (uri: string): Promise<typeof mongoose> => {
  mongoose.connection.once('open', () => {
    console.log(`\nMongoDB successfully connected to ${uri}\n`);
  });
  return await mongoose.connect(uri, MONGOOSE_CONFIG);
};

export const initDatabase = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    await connectDb(await getMemoryServer().getUri());
    await seedSats();
  } else {
    const mongoUri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${
      process.env.HOST || 'localhost'
    }:${process.env.MONGO_PORT}/${process.env.MONGO_SERVER}?authSource=admin`;
    await connectDb(mongoUri);
  }
};
