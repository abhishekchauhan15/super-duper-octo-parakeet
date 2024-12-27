import request from 'supertest';
import app from "../index";
import User from '../models/user';
import mongoose from 'mongoose';

describe('User Routes', () => {
  beforeAll(async () => {
    // Clear the database before tests
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Close the database connection after tests
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'KAM',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.user).toHaveProperty('email', 'testuser@example.com');
  });

  it('should login an existing user', async () => {
    // First, register a user
    await request(app)
    .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'KAM',
      });

    // Now, attempt to login
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body).toHaveProperty('token');
  });

  it('should return 404 for non-existing user on login', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  it('should return 401 for invalid credentials', async () => {
    // First, register a user
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'KAM',
      });

    // Now, attempt to login with wrong password
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });
}); 