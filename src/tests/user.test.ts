import request from 'supertest';
import app from '../index';
import User from '../models/user';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('User API Tests', () => {
  const validUserData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
    role: 'KAM'
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/register - User Registration', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should hash the password before saving', async () => {
      await request(app)
        .post('/api/users/register')
        .send(validUserData);

      const user = await User.findOne({ email: validUserData.email });
      expect(user?.password).not.toBe(validUserData.password);
      const isMatch = await bcryptjs.compare(validUserData.password, user?.password || '');
      expect(isMatch).toBe(true);
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          ...validUserData,
          email: 'invalid-email'
        });

      expect(response.status).toBe(400);
    });

    it('should fail with weak password', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          ...validUserData,
          password: '123'
        });

      expect(response.status).toBe(400);
    });

    it('should fail with duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/users/register')
        .send(validUserData);

      // Second registration with same email
      const response = await request(app)
        .post('/api/users/register')
        .send(validUserData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email already in use');
    });
  });

  describe('POST /api/users/login - User Login', () => {
    beforeEach(async () => {
      // Create a user before each login test
      await request(app)
        .post('/api/users/register')
        .send(validUserData);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: validUserData.email,
          password: validUserData.password
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.message).toBe('Login successful');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: validUserData.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: validUserData.password
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    // it('should generate valid JWT token', async () => {
    //   const response = await request(app)
    //     .post('/api/users/login')
    //     .send({
    //       email: validUserData.email,
    //       password: validUserData.password
    //     });

    //   const token = response.body.token;
    //   expect(token).toBeDefined();

    //   // Verify the token can be decoded
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    //   expect(decoded.userId).toBeDefined();

    //   // Verify the decoded user ID matches a real user
    //   const user = await User.findById(decoded.userId);
    //   expect(user).toBeDefined();
    //   expect(user?.email).toBe(validUserData.email);
    // });
  });
}); 