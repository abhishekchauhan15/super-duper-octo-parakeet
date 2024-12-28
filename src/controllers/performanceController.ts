import { Request, Response } from 'express';
import { Order, IOrder } from '../models/order';
import { Lead } from '../models/lead';
import { Types } from 'mongoose';

export const getAccountPerformance = async (req: Request, res: Response) => {
  try {
    const { leadId } = req.params;
    const timeframe = req.query.timeframe || '30'; // Default to 30 days

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeframe as string));

    const orders = await Order.find({
      leadId: new Types.ObjectId(leadId),
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const totalOrders = orders.length;
    const totalValue = orders.reduce((sum: number, order: IOrder) => sum + order.amount, 0);
    const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;

    res.json({
      totalOrders,
      totalValue,
      averageOrderValue,
      timeframe
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching account performance' });
  }
};

export const getOrderingPatterns = async (req: Request, res: Response) => {
  try {
    const { leadId } = req.params;
    const timeframe = req.query.timeframe || '90'; // Default to 90 days

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeframe as string));

    const orders = await Order.find({
      leadId: new Types.ObjectId(leadId),
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });

    // Calculate ordering patterns
    const orderDates = orders.map((order: IOrder) => order.createdAt);
    const intervals: number[] = [];
    for (let i = 1; i < orderDates.length; i++) {
      const diff = orderDates[i].getTime() - orderDates[i-1].getTime();
      intervals.push(diff / (1000 * 60 * 60 * 24)); // Convert to days
    }

    const averageInterval = intervals.length > 0 
      ? intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length 
      : 0;

    res.json({
      totalOrders: orders.length,
      averageOrderInterval: averageInterval,
      orderDates,
      timeframe
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ordering patterns' });
  }
};

export const getUnderperformingAccounts = async (req: Request, res: Response) => {
  try {
    const timeframe = req.query.timeframe || '30'; // Default to 30 days
    const threshold = req.query.threshold || '1'; // Minimum expected orders per month

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeframe as string));

    // Get all leads
    const leads = await Lead.find();
    const underperformingAccounts = [];

    for (const lead of leads) {
      const orders = await Order.find({
        leadId: lead._id,
        createdAt: { $gte: startDate, $lte: endDate }
      });

      const orderCount = orders.length;
      const expectedOrders = (parseInt(timeframe as string) / 30) * parseInt(threshold as string);

      if (orderCount < expectedOrders) {
        underperformingAccounts.push({
          lead: {
            _id: lead._id,
            name: lead.name,
            status: lead.status
          },
          orderCount,
          expectedOrders,
          lastOrderDate: orders.length > 0 ? orders[orders.length - 1].createdAt : null
        });
      }
    }

    res.json({
      underperformingAccounts,
      timeframe,
      threshold
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching underperforming accounts' });
  }
};

