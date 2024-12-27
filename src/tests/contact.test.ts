import request from 'supertest';
import app from '../index'; 
import  User from '../models/user'; 
import mongoose from "mongoose";

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

describe('Contact API', () => {
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

  // Test for adding a contact
  describe('POST /api/contacts', () => {
    it('should add a new contact', async () => {
      const newContact = {
        leadId: new mongoose.Types.ObjectId(),
        name: 'John Doe',
        role: 'Owner',
        phoneNumber: '1234567890',
        email: 'john.doe@example.com',
      };

      const response = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`) // Set the token for authorization
        .send(newContact);
        
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'John Doe');
    });
  });

  // Test for getting contacts for a lead
  describe('GET /api/contacts/:leadId', () => {
    it('should fetch contacts for a specific lead', async () => {
      const leadId = new mongoose.Types.ObjectId(); // Use a valid leadId

      // First, add a contact for the lead
      await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`) // Set the token for authorization
        .send({
          leadId: leadId,
          name: 'Jane Doe',
          role: 'Manager',
          phoneNumber: '0987654321',
          email: 'jane.doe@example.com',
        });

      const response = await request(app).get(`/api/contacts/${leadId}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
