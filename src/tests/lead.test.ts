import request from "supertest";
import app from "../index";
import { Lead } from "../models/lead";
import User from '../models/user';
import mongoose from 'mongoose';

let token: string;

const loginUser = async () => {
  const response = await request(app)
    .post('/api/users/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123',
    });
  return response.body.token;
};

describe("Lead API", () => {
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
    await Lead.deleteMany({});
  });

  it("should create a new lead", async () => {
    const leadData = {
      name: "Test Lead",
      address: "123 Test St",
      type: "Resturant",
      status: "New",
      callFrequency: 7,
      lastCalledDate: null,
      pointsOfContact: [],
    };

    const response = await request(app)
      .post("/api/leads")
      .set('Authorization', `Bearer ${token}`)
      .send(leadData);
      
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Lead created successfully");
    expect(response.body.lead.name).toBe(leadData.name);
  });

  it("should get all leads", async () => {
    await Lead.create({
      name: "Test Lead 1",
      address: "123 Test St",
      type: "Resturant",
      status: "New",
      callFrequency: 7,
      lastCalledDate: null,
      pointsOfContact: [],
    });

    const response = await request(app)
      .get("/api/leads")
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it("should get a lead by ID", async () => {
    const lead = await Lead.create({
      name: "Test Lead 2",
      address: "456 Test Ave",
      type: "Dabha",
      status: "Contacted",
      callFrequency: 5,
      lastCalledDate: null,
      pointsOfContact: [],
    });

    const response = await request(app)
      .get(`/api/leads/${lead._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(lead.name);
  });

  it("should update a lead", async () => {
    const lead = await Lead.create({
      name: "Test Lead 3",
      address: "789 Test Blvd",
      type: "Resturant",
      status: "Qualified",
      callFrequency: 10,
      lastCalledDate: null,
      pointsOfContact: [],
    });

    const updatedData = { status: "Closed" };
    const response = await request(app)
      .put(`/api/leads/${lead._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
      
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Lead updated successfully");
    expect(response.body.lead.status).toBe(updatedData.status);
  });

  it("should delete a lead", async () => {
    const lead = await Lead.create({
      name: "Test Lead 4",
      address: "321 Test Rd",
      type: "Dabha",
      status: "New",
      callFrequency: 3,
      lastCalledDate: null,
      pointsOfContact: [],
    });

    const response = await request(app)
      .delete(`/api/leads/${lead._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Lead deleted successfully");
  });
});