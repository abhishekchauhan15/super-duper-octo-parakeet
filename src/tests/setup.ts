import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../db';
import { Server } from 'http';
import app from '../index';

let mongo: MongoMemoryServer;
let server: Server;

beforeAll(async () => {

  await mongoose.connection.close();

  // Create new in-memory database
  mongo = await MongoMemoryServer.create();
  
  process.env.MONGO_URI = mongo.getUri();
  
  await connectDB();
  
  // Store server instance
  return new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      resolve();
    });
  });
});

// Clear data between tests
beforeEach(async () => {
  if (!mongoose.connection.db) {
    throw new Error('Database not connected');
  }
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  }
  await mongoose.connection.close();
  await mongo.stop();
});

// Mock auth middleware for testing
export const mockAuthMiddleware = () => {
  return (req: any, res: any, next: any) => next();
}; 