import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    let mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      // Only allow in-memory Mongo for non-production environments
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          'MONGODB_URI is not set in production. Please configure the environment variable.'
        );
      }
      // Fallback to shared in-memory MongoDB for local development on fixed port
      const fixedPort = 27018;
      const dbName = 'kube-credential';
      mongoURI = `mongodb://127.0.0.1:${fixedPort}/${dbName}`;
      try {
        memoryServer = await MongoMemoryServer.create({
          instance: { port: fixedPort, dbName }
        });
        console.warn(
          `MONGODB_URI not set. Started in-memory MongoDB on port ${fixedPort} for development.`
        );
      } catch (e) {
        console.warn(
          `MONGODB_URI not set. Using existing in-memory MongoDB at ${mongoURI}.`
        );
      }
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
      maxPoolSize: 10,
      minPoolSize: 1,
      heartbeatFrequencyMS: 10000
    } as any);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error: unknown) => {
  console.error('MongoDB error:', error);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
  }
  process.exit(0);
});
