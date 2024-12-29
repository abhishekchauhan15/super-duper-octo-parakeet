import request from "supertest";
import app from "../index";
import { Lead, ILead } from "../models/lead";
import User from "../models/user";
import moment from 'moment';
import mongoose from 'mongoose';

describe('Lead API Tests', () => {
  let authToken: string;
  
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
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Lead.deleteMany({});
  });

  describe('POST /api/leads - Create Lead', () => {
    it('should create a lead with valid data', async () => {
      const response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validLeadData);

      expect(response.status).toBe(201);
      expect(response.body.lead.name).toBe(validLeadData.name);
      expect(response.body.lead.nextCallDate).toBeDefined();
    });

    it('should fail with invalid status', async () => {
      const response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validLeadData,
          status: 'Invalid'
        });

      expect(response.status).toBe(400);
    });

    it('should fail with invalid timezone', async () => {
      const response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validLeadData,
          preferredTimezone: 'Invalid/Zone'
        });

      expect(response.status).toBe(400);
    });

    it('should fail with invalid call frequency', async () => {
      const response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validLeadData,
          callFrequency: 0
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/leads - Get All Leads', () => {
    beforeEach(async () => {
      await Lead.create(validLeadData);
      await Lead.create({
        ...validLeadData,
        name: 'Second Restaurant'
      });
    });

    it('should return all leads', async () => {
      const response = await request(app)
        .get('/api/leads')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/leads/:id - Get Lead by ID', () => {
    let leadId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const lead = await Lead.create(validLeadData);
      leadId = lead.id;
    });

    it('should return lead by valid ID', async () => {
      const response = await request(app)
        .get(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.lead.name).toBe(validLeadData.name);
    });

    it('should return 404 for non-existent ID', async () => {
      const response = await request(app)
        .get('/api/leads/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/leads/:id - Update Lead', () => {
    let leadId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const lead = await Lead.create(validLeadData);
      leadId = lead.id;
    });

    it('should update lead with valid data', async () => {
      const updateData = {
        name: 'Updated Restaurant',
        status: 'Qualified'
      };

      const response = await request(app)
        .patch(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.lead.name).toBe(updateData.name);
      expect(response.body.lead.status).toBe(updateData.status);
    });

    it('should fail with invalid status update', async () => {
      const response = await request(app)
        .patch(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'Invalid' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/leads/:id - Delete Lead', () => {
    let leadId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const lead = await Lead.create(validLeadData);
      leadId = lead.id;
    });

    it('should delete existing lead', async () => {
      const response = await request(app)
        .delete(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      const lead = await Lead.findById(leadId);
      expect(lead).toBeNull();
    });
  });

  describe('GET /api/leads/call-planning/today - Get Leads Requiring Calls', () => {
    beforeEach(async () => {
      // Create a lead that needs to be called today
      await Lead.create({
        ...validLeadData,
        nextCallDate: moment().startOf('day').toDate(), // Set nextCallDate to start of today
        lastInteractionDate: moment().subtract(7, 'days').toDate()
      });

      // Create a lead that doesn't need to be called today
      await Lead.create({
        ...validLeadData,
        name: 'Future Call Lead',
        nextCallDate: moment().add(1, 'day').toDate(),
        lastInteractionDate: moment().toDate()
      });
    });

    it('should return only leads requiring calls today', async () => {
      const response = await request(app)
        .get('/api/leads/call-planning/today')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe(validLeadData.name);
      expect(moment(response.body[0].nextCallDate).isSame(moment().startOf('day'), 'day')).toBe(true);
    });
  });
});