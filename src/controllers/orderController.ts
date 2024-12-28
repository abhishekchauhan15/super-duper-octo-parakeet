import { Request, Response } from "express";
import { Order } from "../models/order";


export const createOrder = async (req: Request, res: Response) => {
  try {
    const { leadId, amount, status, name, quantity, deliveryDate } = req.body;

    if (!leadId || !amount || !status || !name || quantity === undefined) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const order = new Order({
      leadId,
      amount,
      status,
      name,
      quantity,
      deliveryDate,
    });

    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error: any) {
    res.status(500).json({ error: "Error creating order", message: error.message });
  }
};


export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("leadId");
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: "Error fetching orders", message: error.message });
  }
};


export const getOrdersByLeadId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const orders = await Order.find({ leadId: id }).populate("leadId");
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ error: "Error fetching orders", message: error.message });
    }
};