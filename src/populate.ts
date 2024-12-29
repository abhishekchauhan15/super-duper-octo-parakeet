import mongoose from 'mongoose';
import User from './models/user';
import dotenv from "dotenv";
import { Lead } from './models/lead';
import { Interaction } from './models/interaction';
import { Order } from './models/order';
import { Contact } from './models/contact';
import connectDB from "./db";
import moment from 'moment';

const seedDatabase = async () => {
  try {
    dotenv.config();
    await connectDB();

    await User.deleteMany({});
    await Lead.deleteMany({});
    await Interaction.deleteMany({});
    await Order.deleteMany({});
    await Contact.deleteMany({});

    // Create KAM users
    const kam1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.s@example.com',
      password: 'password123',
      role: 'KAM',
    });

    const kam2 = await User.create({
      name: 'Priya Patel',
      email: 'priya.p@example.com',
      password: 'password123',
      role: 'KAM',
    });

    // Create restaurant leads with varying statuses
    const restaurants = [
      {
        name: 'Spice Garden Restaurant',
        address: '123 MG Road, Bangalore',
        type: 'Resturant',
        status: 'Qualified',
        callFrequency: 7,
        preferredTimezone: 'Asia/Kolkata',
        lastInteractionDate: moment().subtract(5, 'days').toDate(),
        nextCallDate: moment().startOf('day').toDate()
      },
      {
        name: 'Royal Punjab Dhaba',
        address: '456 GT Road, Punjab',
        type: 'Dabha',
        status: 'New',
        callFrequency: 5,
        preferredTimezone: 'Asia/Kolkata',
        lastInteractionDate: null,
        nextCallDate: moment().startOf('day').toDate()
      },
      {
        name: 'Coastal Delights',
        address: '789 Beach Road, Mumbai',
        type: 'Resturant',
        status: 'Contacted',
        callFrequency: 14,
        preferredTimezone: 'Asia/Kolkata',
        lastInteractionDate: moment().subtract(10, 'days').toDate(),
        nextCallDate: moment().add(4, 'days').toDate()
      },
      {
        name: 'Mountain View Restaurant',
        address: '321 Mall Road, Shimla',
        type: 'Resturant',
        status: 'Closed',
        callFrequency: 30,
        preferredTimezone: 'Asia/Kolkata',
        lastInteractionDate: moment().subtract(30, 'days').toDate(),
        nextCallDate: moment().add(30, 'days').toDate()
      },
      {
        name: 'Delhi Street Food Corner',
        address: '789 Chandni Chowk, Delhi',
        type: 'Resturant',
        status: 'Qualified',
        callFrequency: 7,
        preferredTimezone: 'Asia/Kolkata',
        lastInteractionDate: moment().subtract(7, 'days').toDate(),
        nextCallDate: moment().startOf('day').toDate()
      },
      {
        name: 'South Indian Express',
        address: '45 Anna Salai, Chennai',
        type: 'Resturant',
        status: 'Contacted',
        callFrequency: 10,
        preferredTimezone: 'Asia/Kolkata',
        lastInteractionDate: moment().subtract(10, 'days').toDate(),
        nextCallDate: moment().startOf('day').toDate()
      }
    ];

    const createdLeads = await Promise.all(restaurants.map(restaurant => Lead.create(restaurant)));

    // Create contacts for each restaurant
    const contacts = [
      // Contacts for Spice Garden Restaurant
      {
        name: 'Amit Kumar',
        role: 'Owner',
        phoneNumber: '+919876543210',
        email: 'amit@spicegarden.com',
        leadId: createdLeads[0]._id,
        preferredContactTime: '10:00-18:00',
        notes: 'Primary decision maker, prefers communication via phone'
      },
      {
        name: 'Deepa Reddy',
        role: 'Manager',
        phoneNumber: '+919876543211',
        email: 'deepa@spicegarden.com',
        leadId: createdLeads[0]._id,
        preferredContactTime: '09:00-17:00',
        notes: 'Handles day-to-day operations and inventory'
      },
      // Contacts for Royal Punjab Dhaba
      {
        name: 'Gurpreet Singh',
        role: 'Owner',
        phoneNumber: '+919876543212',
        email: 'gurpreet@punjabdhaba.com',
        leadId: createdLeads[1]._id,
        preferredContactTime: '08:00-20:00',
        notes: 'Speaks Hindi and Punjabi, prefers early morning calls'
      },
      // Contacts for Coastal Delights
      {
        name: 'Pradeep Shetty',
        role: 'Owner',
        phoneNumber: '+919876543213',
        email: 'pradeep@coastaldelights.com',
        leadId: createdLeads[2]._id,
        preferredContactTime: '11:00-19:00',
        notes: 'Very particular about seafood quality'
      },
      {
        name: 'Maria D\'souza',
        role: 'Manager',
        phoneNumber: '+919876543214',
        email: 'maria@coastaldelights.com',
        leadId: createdLeads[2]._id,
        preferredContactTime: '09:00-17:00',
        notes: 'Handles all purchase orders and quality checks'
      },
      // Contacts for Mountain View Restaurant
      {
        name: 'Vikram Thakur',
        role: 'Owner',
        phoneNumber: '+919876543215',
        email: 'vikram@mountainview.com',
        leadId: createdLeads[3]._id,
        preferredContactTime: '10:00-18:00',
        notes: 'Interested in local produce and seasonal ingredients'
      },
      // Contacts for Delhi Street Food Corner
      {
        name: 'Rajesh Gupta',
        role: 'Owner',
        phoneNumber: '+919876543216',
        email: 'rajesh@delhifood.com',
        leadId: createdLeads[4]._id,
        preferredContactTime: '11:00-19:00',
        notes: 'Best time to call during off-peak hours (3-5 PM)'
      },
      {
        name: 'Suresh Kumar',
        role: 'Manager',
        phoneNumber: '+919876543217',
        email: 'suresh@delhifood.com',
        leadId: createdLeads[4]._id,
        preferredContactTime: '09:00-17:00',
        notes: 'Handles supplier relationships and inventory'
      },
      // Contacts for South Indian Express
      {
        name: 'Lakshmi Raman',
        role: 'Owner',
        phoneNumber: '+919876543218',
        email: 'lakshmi@southindian.com',
        leadId: createdLeads[5]._id,
        preferredContactTime: '10:00-18:00',
        notes: 'Prefers communication in Tamil or English'
      }
    ];

    const createdContacts = await Promise.all(contacts.map(contact => Contact.create(contact)));

    // Update leads with their contacts
    await Lead.findByIdAndUpdate(createdLeads[0]._id, {
      pointsOfContact: [createdContacts[0]._id, createdContacts[1]._id]
    });
    await Lead.findByIdAndUpdate(createdLeads[1]._id, {
      pointsOfContact: [createdContacts[2]._id]
    });
    await Lead.findByIdAndUpdate(createdLeads[2]._id, {
      pointsOfContact: [createdContacts[3]._id, createdContacts[4]._id]
    });
    await Lead.findByIdAndUpdate(createdLeads[3]._id, {
      pointsOfContact: [createdContacts[5]._id]
    });
    await Lead.findByIdAndUpdate(createdLeads[4]._id, {
      pointsOfContact: [createdContacts[6]._id, createdContacts[7]._id]
    });
    await Lead.findByIdAndUpdate(createdLeads[5]._id, {
      pointsOfContact: [createdContacts[8]._id]
    });

    // Create interactions with different types and outcomes
    const interactions = [
      {
        leadId: createdLeads[0]._id,
        userId: kam1._id,
        type: 'Call',
        notes: 'Initial meeting successful. Client interested in bulk orders for their restaurant chain. Discussed pricing and delivery schedules.',
        duration: 45,
        date: moment().subtract(5, 'days').toDate()
      },
      {
        leadId: createdLeads[0]._id,
        userId: kam1._id,
        type: 'Email',
        notes: 'Sent detailed product catalog and pricing structure. Client requested sample delivery for quality check.',
        duration: 15,
        date: moment().subtract(3, 'days').toDate()
      },
      {
        leadId: createdLeads[2]._id,
        userId: kam2._id,
        type: 'Call',
        notes: 'Follow-up call about last delivery. Client satisfied with quality but requested faster delivery times.',
        duration: 30,
        date: moment().subtract(10, 'days').toDate()
      }
    ];

    await Promise.all(interactions.map(interaction => Interaction.create(interaction)));

    // Create orders with various statuses and details
    const orders = [
      {
        leadId: createdLeads[0]._id,
        amount: 25000,
        status: 'DELIVERED',
        name: 'Bulk Spices Order',
        quantity: 50,
        deliveryDate: moment().subtract(15, 'days').toDate()
      },
      {
        leadId: createdLeads[0]._id,
        amount: 35000,
        status: 'PENDING',
        name: 'Monthly Grocery Supply',
        quantity: 75,
        deliveryDate: moment().add(5, 'days').toDate()
      },
      {
        leadId: createdLeads[2]._id,
        amount: 15000,
        status: 'CONFIRMED',
        name: 'Fresh Produce Order',
        quantity: 30,
        deliveryDate: moment().add(2, 'days').toDate()
      },
      {
        leadId: createdLeads[0]._id,
        amount: 45000,
        status: 'DELIVERED',
        name: 'Special Event Supply',
        quantity: 100,
        deliveryDate: moment().subtract(7, 'days').toDate()
      }
    ];

    await Promise.all(orders.map(order => Order.create(order)));

    console.log('Mock data populated successfully!');
    console.log(`Created ${restaurants.length} restaurants`);
    console.log(`Created ${contacts.length} contacts`);
    console.log(`Created ${interactions.length} interactions`);
    console.log(`Created ${orders.length} orders`);
    
  } catch (error) {
    console.error('Error populating mock data:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();