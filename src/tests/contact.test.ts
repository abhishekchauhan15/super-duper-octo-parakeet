import request from 'supertest';
import app from '../index';
import { Contact } from '../models/contact';
import { Lead } from '../models/lead';
import User from '../models/user';
import mongoose from 'mongoose';

describe('Contact API Tests', () => {
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
    status: 'New',
    callFrequency: 7,
    preferredTimezone: 'Asia/Kolkata'
  };

  const validContactData = {
    name: 'John Doe',
    role: 'Manager',
    phoneNumber: '+1234567890',
    email: 'john@example.com'
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
    await Contact.deleteMany({});
    const lead = await Lead.create(validLeadData);
    leadId = lead.id
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Contact.deleteMany({});
  });

  describe('POST /api/contacts - Create Contact', () => {
    it('should create a contact with valid data', async () => {
      const response = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validContactData,
          leadId
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Contact added successfully');
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          leadId,
          name: 'John Doe'
        });

      expect(response.status).toBe(400);
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validContactData,
          leadId,
          email: 'invalid-email'
        });

      expect(response.status).toBe(500);
    });

    it('should fail with invalid phone number', async () => {
      const response = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validContactData,
          leadId,
          phoneNumber: '123' // Invalid phone number
        });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/contacts/:leadId - Get Contacts by Lead ID', () => {
    beforeEach(async () => {
      await Contact.create({
        ...validContactData,
        leadId
      });
      await Contact.create({
        ...validContactData,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phoneNumber: '+1987654321',
        leadId
      });
    });

    it('should return all contacts for a lead', async () => {
      const response = await request(app)
        .get(`/api/contacts/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it('should return 404 for lead with no contacts', async () => {
      const newLead = await Lead.create({
        ...validLeadData,
        name: 'New Lead'
      });

      const response = await request(app)
        .get(`/api/contacts/${newLead._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid lead ID format', async () => {
      const response = await request(app)
        .get('/api/contacts/invalid-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(500);
    });
  });
});
