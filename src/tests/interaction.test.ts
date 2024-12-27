import request from 'supertest';
import app from '../index'; 
import User  from '../models/user'; 
import mongoose from 'mongoose';
import { Interaction } from '../models/interaction';

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

describe('Interaction API', () => {
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
    await Interaction.deleteMany({});
  });

  // Test for adding an interaction
  describe('POST /interactions', () => {
    it('should add a new interaction', async () => {
      const interactionData = {
        leadId: new mongoose.Types.ObjectId(),
        type: 'Call',
        nextCallDate: new Date(),
        frequency: 7,
        details: 'Follow up on the proposal',
        lastInteractionDate: new Date(),
      };

      const response = await request(app)
        .post('/api/interactions')
        .set('Authorization', `Bearer ${token}`)
        .send(interactionData);
        
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('type', 'Call');
    });
  });

  // Test for getting interactions by lead ID
  describe('GET /interactions/:leadId', () => {
    it('should fetch interactions for a specific lead', async () => {
      const leadId = new mongoose.Types.ObjectId(); // Use a valid leadId

      // First, add an interaction for the lead
      await request(app)
        .post('/api/interactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          leadId: leadId,
          type: 'Order',
          nextCallDate: new Date(),
          frequency: 14,
          details: 'Order placed successfully',
          lastInteractionDate: new Date(),
        });

      const response = await request(app).get(`/api/interactions/${leadId}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
}); 