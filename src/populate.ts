import mongoose from 'mongoose';
import User  from './models/user';
import dotenv from "dotenv";
import { Lead } from './models/lead';
import { Interaction } from './models/interaction';
import { Order } from './models/order';
import connectDB from "./db";

const seedDatabase = async () => {
  try {
    // Connect to the database
    dotenv.config();
    connectDB();


    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Interaction.deleteMany({});
    await Order.deleteMany({});

    // Create mock users
    const user1 = await User.create({
      name: 'Test User 1',
      email: 'testuser1@example.com',
      password: 'password123',
      role: 'KAM',
    });

    const user2 = await User.create({
      name: 'Test User 2',
      email: 'testuser2@example.com',
      password: 'password123',
      role: 'KAM',
    });

    // Create mock leads
    const lead1 = await Lead.create({
      name: 'Lead 1',
      address: '123 Lead St',
      type: 'Resturant',
      status: 'New',
      callFrequency: 7,
      preferredTimezone: 'America/New_York',
    });

    const lead2 = await Lead.create({
      name: 'Lead 2',
      address: '456 Lead Ave',
      type: 'Dabha',
      status: 'Contacted',
      callFrequency: 14,
      preferredTimezone: 'America/Los_Angeles',
    });

    // Create mock interactions
    await Interaction.create({
      leadId: lead1._id,
      userId: user1._id,
      type: 'Call',
      notes: 'Initial contact made.',
      duration: 15,
    });

    await Interaction.create({
      leadId: lead2._id,
      userId: user2._id,
      type: 'Email',
      notes: 'Follow-up email sent.',
      duration: 5,
    });

    // Create mock orders
    await Order.create({
      leadId: lead1._id,
      amount: 100,
      status: 'DELIVERED',
      name: 'Order 1',
      quantity: 2,
      price: 50,
      deliveryDate: new Date(),
    });

    await Order.create({
      leadId: lead2._id,
      amount: 200,
      status: 'PENDING',
      name: 'Order 2',
      quantity: 4,
      price: 50,
      deliveryDate: new Date(),
    });

    console.log('Mock data populated successfully!');
  } catch (error) {
    console.error('Error populating mock data:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();