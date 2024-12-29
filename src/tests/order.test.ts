import request from 'supertest';
import app from '../index';
import { Order, IOrder } from '../models/order';
import { Lead } from '../models/lead';
import User from '../models/user';
import mongoose from 'mongoose';

// Mock auth middleware
jest.mock('../middleware/auth', () => ({
  auth: () => (req: any, res: any, next: any) => next()
}));

describe('Order API Tests', () => {
  let authToken: string;
  let leadId: mongoose.Types.ObjectId;

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'KAM'
  };

  const validLeadData = {
    name: 'Test Restaurant',
    address: '123 Test St',
    type: 'Resturant',
    status: 'Qualified',
    callFrequency: 7,
    preferredTimezone: 'Asia/Kolkata'
  };

  const validOrderData = {
    amount: 350,
    status: 'PENDING',
    name: 'Test Order',
    quantity: 2,
    deliveryDate: new Date()
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

    // Create a lead to associate with orders
    const leadResponse = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${authToken}`)
      .send(validLeadData);
    
    leadId = leadResponse.body.lead._id; // Store the lead ID for use in orders
  });

  beforeEach(async () => {
    await Order.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Order.deleteMany({});
  });

  describe('POST /api/orders - Create Order', () => {
    it('should create a new order with valid data', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validOrderData,
          leadId
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Order created successfully');
      expect(response.body.order.totalAmount).toBe(validOrderData.amount);
    });

    it('should fail to create an order without leadId', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validOrderData,
          leadId: undefined
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('All fields are required');
    });

    it('should fail to create an order with invalid amount', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validOrderData,
          amount: -100, // Invalid amount
          leadId
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Order amount is required');
    });

    it('should fail to create an order with invalid quantity', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validOrderData,
          quantity: 0, // Invalid quantity
          leadId
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Quantity must be at least 1');
    });
  });

  describe('GET /api/orders - Get All Orders', () => {
    beforeEach(async () => {
      await Order.create({
        ...validOrderData,
        leadId
      });
      await Order.create({
        ...validOrderData,
        name: 'Second Order',
        amount: 500,
        leadId
      });
    });

    it('should return all orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/orders/lead/:id - Get Orders by Lead ID', () => {
    beforeEach(async () => {
      await Order.create({
        ...validOrderData,
        leadId
      });
    });

    it('should return orders for a valid lead ID', async () => {
      const response = await request(app)
        .get(`/api/orders/lead/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe(validOrderData.name);
    });

    it('should return an empty array for a non-existent lead ID', async () => {
      const response = await request(app)
        .get('/api/orders/lead/507f1f77bcf86cd799439011') // Non-existent ID
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });
  });

  describe('PATCH /api/orders/:id - Update Order', () => {
    let orderId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const order: IOrder = await Order.create({
        ...validOrderData,
        leadId
      });
      orderId = order._id as mongoose.Types.ObjectId;
    });

    it('should update an order with valid data', async () => {
      const updateData = {
        status: 'CONFIRMED',
        amount: 400
      };

      const response = await request(app)
        .patch(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Order updated successfully');
      expect(response.body.order.status).toBe(updateData.status);
      expect(response.body.order.amount).toBe(updateData.amount);
    });

    it('should fail to update an order with invalid status', async () => {
      const response = await request(app)
        .patch(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'INVALID_STATUS' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid order status');
    });
  });

  describe('DELETE /api/orders/:id - Delete Order', () => {
    let orderId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const order = await Order.create({
        ...validOrderData,
        leadId
      }) as IOrder;
      orderId = order._id as mongoose.Types.ObjectId;
    });

    it('should delete an existing order', async () => {
      const response = await request(app)
        .delete(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Order deleted successfully');

      const deletedOrder = await Order.findById(orderId);
      expect(deletedOrder).toBeNull();
    });

    it('should return 404 for non-existent order ID', async () => {
      const response = await request(app)
        .delete('/api/orders/507f1f77bcf86cd799439011') // Non-existent ID
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Order not found');
    });
  });
}); 