import request from 'supertest';
import app from '../index';
import { Lead, ILead } from '../models/lead';
import { Interaction } from '../models/interaction';
import User from '../models/user';
import moment from 'moment';
import { Types, Document } from 'mongoose';

// Mock auth middleware
jest.mock('../middleware/auth', () => ({
  auth: (req: any, res: any, next: any) => {
    req.userId = new Types.ObjectId().toString();
    next();
  }
}));

describe('Interaction API Tests', () => {
  let authToken: string;
  let leadId: string;
  let userId: string;

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

  const validInteractionData = {
    notes: 'Test interaction',
    duration: 30,
    type: 'Call'
  };

  beforeAll(async () => {
    // Register user
    const registerResponse = await request(app)
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
    userId = new Types.ObjectId().toString();
  });

  beforeEach(async () => {
    // Clear existing data
    await Lead.deleteMany({});
    await Interaction.deleteMany({});
    const lead = (await Lead.create(validLeadData)) as Document;
    leadId = lead.id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Interaction.deleteMany({});
  });

  describe('POST /api/interactions - Create Interaction', () => {
    it('should create an interaction with valid data', async () => {
      const response = await request(app)
        .post('/api/interactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validInteractionData,
          leadId: leadId.toString()
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Interaction added successfully');
      expect(response.body.nextCallDate).toBeDefined();
    });

    it('should fail with missing leadId', async () => {
      const response = await request(app)
        .post('/api/interactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validInteractionData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should fail with invalid leadId', async () => {
      const response = await request(app)
        .post('/api/interactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validInteractionData,
          leadId: new Types.ObjectId().toString()
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Lead not found');
    });

    it('should update lead lastInteractionDate and nextCallDate', async () => {
      const response = await request(app)
        .post('/api/interactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validInteractionData,
          leadId: leadId.toString()
        });

      const updatedLead = await Lead.findById(leadId);
      expect(updatedLead?.lastInteractionDate).toBeDefined();
      expect(updatedLead?.nextCallDate).toBeDefined();

      const expectedNextCallDate = moment().add(validLeadData.callFrequency, 'days').startOf('day');
      const actualNextCallDate = moment(updatedLead?.nextCallDate).startOf('day');
      expect(actualNextCallDate.isSame(expectedNextCallDate)).toBe(true);
    });

    it('should use provided nextCallDate if specified', async () => {
      const customNextCallDate = moment().add(14, 'days').toDate();
      const response = await request(app)
        .post('/api/interactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validInteractionData,
          leadId: leadId.toString(),
          nextCallDate: customNextCallDate
        });

      const updatedLead = await Lead.findById(leadId);
      const actualNextCallDate = moment(updatedLead?.nextCallDate).startOf('day');
      const expectedNextCallDate = moment(customNextCallDate).startOf('day');
      expect(actualNextCallDate.isSame(expectedNextCallDate)).toBe(true);
    });
  });

  describe('GET /api/interactions/:leadId - Get Interactions by Lead ID', () => {
    beforeEach(async () => {
      // Create multiple interactions for the lead
      await Interaction.create({
        leadId,
        userId,
        type: 'Call',
        notes: 'First interaction',
        duration: 30
      });
      await Interaction.create({
        leadId,
        userId,
        type: 'Call',
        notes: 'Second interaction',
        duration: 45
      });
    });

    it('should return all interactions for a lead', async () => {
      const response = await request(app)
        .get(`/api/interactions/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });

    it('should return empty array for lead with no interactions', async () => {
      const newLead = await Lead.create({
        ...validLeadData,
        name: 'New Lead'
      });

      const response = await request(app)
        .get(`/api/interactions/${newLead._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should include all required fields in interaction response', async () => {
      const response = await request(app)
        .get(`/api/interactions/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      const interaction = response.body[0];
      expect(interaction.leadId).toBeDefined();
      expect(interaction.userId).toBeDefined();
      expect(interaction.type).toBe('Call');
      expect(interaction.notes).toBeDefined();
      expect(interaction.duration).toBeDefined();
      expect(interaction.createdAt).toBeDefined();
    });
  });
}); 