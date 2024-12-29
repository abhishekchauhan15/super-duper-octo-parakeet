import request from 'supertest';
import app from '../index';
import { Lead } from '../models/lead';
import { Order } from '../models/order';
import User from '../models/user';
import { Types, Document } from 'mongoose';

// Mock auth middleware
jest.mock('../middleware/auth', () => ({
  auth: (req: any, res: any, next: any) => {
    req.userId = new Types.ObjectId().toString();
    next();
  }
}));

describe('Performance Controller Tests', () => {
  let authToken: string;
  let leadId: string;

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'KAM'
  };

  beforeAll(async () => {
    // Register user
    await request(app)
      .post('/api/users/register')
      .send(testUser);

    // Login and get token
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    authToken = loginResponse.body.token;
  });

  beforeEach(async () => {
    await Lead.deleteMany({});
    await Order.deleteMany({});

    // Create test lead with proper typing
    const lead = await Lead.create({
      name: 'Test Restaurant',
      address: '123 Test St',
      type: 'Resturant',
      status: 'Qualified',
      callFrequency: 7,
      preferredTimezone: 'Asia/Kolkata'
    });

    leadId = (lead as Document).id;

    // Create some orders for the lead
    await Order.create({
      leadId: new Types.ObjectId(leadId),
      amount: 1000,
      name: 'Test Order 1',
      quantity: 5,
      status: 'DELIVERED',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
    });

    await Order.create({
      leadId: new Types.ObjectId(leadId),
      amount: 1500,
      name: 'Test Order 2',
      quantity: 7,
      status: 'DELIVERED',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    });

    // Create an underperforming lead (no orders)
    await Lead.create({
      name: 'Underperforming Restaurant',
      address: '456 Test St',
      type: 'Resturant',
      status: 'Qualified',
      callFrequency: 7,
      preferredTimezone: 'Asia/Kolkata'
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Order.deleteMany({});
  });

  describe('GET /api/performance - Get Well Performing Accounts', () => {
    it('should return well-performing accounts', async () => {
      const response = await request(app)
        .get('/api/performance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.wellPerformingAccounts.length).toBeGreaterThan(0);
      expect(response.body.wellPerformingAccounts[0].lead).toBeDefined();
    });

    it('should only include accounts with high order count', async () => {
      const response = await request(app)
        .get('/api/performance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.body.wellPerformingAccounts.every(
        (account: any) => account.orderCount >= parseInt(response.body.threshold)
      )).toBe(true);
    });

    it('should include necessary account details', async () => {
      const response = await request(app)
        .get('/api/performance')
        .set('Authorization', `Bearer ${authToken}`);

      const account = response.body.wellPerformingAccounts[0];
      expect(account.lead.name).toBeDefined();
      expect(account.lead.status).toBeDefined();
      expect(account.orderCount).toBeDefined();
    });
  });

  describe('GET /api/performance/underperforming - Get Underperforming Accounts', () => {
    it('should return underperforming accounts', async () => {
      const response = await request(app)
        .get('/api/performance/underperforming')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.underperformingAccounts).toBeDefined();
      expect(response.body.underperformingAccounts.length).toBeGreaterThan(0);
    });

    it('should only include accounts with low order count', async () => {
      const response = await request(app)
        .get('/api/performance/underperforming')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.body.underperformingAccounts.every(
        (account: any) => account.orderCount < account.expectedOrders
      )).toBe(true);
    });

    it('should include necessary account details', async () => {
      const response = await request(app)
        .get('/api/performance/underperforming')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.body.underperformingAccounts.length).toBeGreaterThan(0);
      const account = response.body.underperformingAccounts[0];
      expect(account.lead.name).toBeDefined();
      expect(account.lead.status).toBeDefined();
      expect(account.orderCount).toBeDefined();
      expect(account.expectedOrders).toBeDefined();
    });
  });

  describe('GET /api/performance/patterns/:leadId - Get Ordering Patterns', () => {
    it('should return ordering patterns for a valid lead', async () => {
      const response = await request(app)
        .get(`/api/performance/patterns/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.totalOrders).toBeDefined();
      expect(response.body.averageOrderInterval).toBeDefined();
    });

    it('should return 404 for non-existent lead', async () => {
      const fakeId = new Types.ObjectId().toString();
      const response = await request(app)
        .get(`/api/performance/patterns/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Lead not found');
    });

    it('should include pattern analysis data', async () => {
      const response = await request(app)
        .get(`/api/performance/patterns/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.body.totalOrders).toBe(2);
      expect(typeof response.body.averageOrderInterval).toBe('number');
      expect(response.body.orderDates).toHaveLength(2);
    });
  });
}); 