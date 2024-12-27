import request from 'supertest';
import app from '../index';
import User  from '../models/user';
import mongoose from 'mongoose';
import { AccountPerformance } from '../models/performace';

let token: string;

// Function to log in a user and retrieve a token
const loginUser = async () => {
  const response = await request(app)
    .post('/api/users/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123',
    });
  return response.body.token;
};

describe('Performance API', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'KAM',
      });
    token = await loginUser();
  });

  beforeEach(async () => {
    await AccountPerformance.deleteMany({});
  });

  // Test for adding performance data
  describe('POST /api/performance', () => {
    it('should add new performance data', async () => {
      const performanceData = {
        leadId: new mongoose.Types.ObjectId(),
        totalOrders: 10,
        orderFrequency: 5,
        performanceRating: 'High',
      };

      const response = await request(app)
        .post('/api/performance')
        .set('Authorization', `Bearer ${token}`) // Set the token for authorization
        .send(performanceData);
        
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('totalOrders', 10);
    });
  });

  // Test for getting performance by lead ID
  describe('GET /performance/:leadId', () => {
    it('should fetch performance data for a specific lead', async () => {
      const leadId = new mongoose.Types.ObjectId(); // Use a valid leadId

      // First, add performance data for the lead
      await request(app)
        .post('/api/performance')
        .set('Authorization', `Bearer ${token}`) // Set the token for authorization
        .send({
          leadId: leadId,
          totalOrders: 15,
          orderFrequency: 3,
          performanceRating: 'Medium',
        });

      const response = await request(app).get(`/api/performance/${leadId}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalOrders', 15);
    });
  });
}); 