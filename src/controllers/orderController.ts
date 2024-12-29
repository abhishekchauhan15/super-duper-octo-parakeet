import { Request, Response } from "express";
import { Order, OrderStatus, IOrder } from "../models/order";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { leadId, amount, status, name, quantity, deliveryDate } = req.body;

    // Basic field validation
    if (!leadId || !amount || !name || quantity === undefined) {
       res.status(400).json({ error: "All fields are required" });
       return;
    }

    // Amount validation
    if (amount < 0) {
       res.status(400).json({ error: "Order amount is required" });
       return;
    }

    // Quantity validation
    if (quantity < 1) {
       res.status(400).json({ error: "Quantity must be at least 1" });
       return;
    }

    const order = new Order({
      leadId,
      amount,
      status: status || OrderStatus.PENDING,
      name,
      quantity,
      deliveryDate,
    });

    await order.save();
    
    // Create response with totalAmount
    const orderResponse = {
      ...order.toObject(),
      totalAmount: order.amount
    };
    
    res.status(201).json({ message: "Order created successfully", order: orderResponse });
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

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, amount, name, quantity, deliveryDate } = req.body;

    // Validate status if provided
    if (status && !Object.values(OrderStatus).includes(status as OrderStatus)) {
       res.status(400).json({ error: "Invalid order status" });
       return;
    }

    const order = await Order.findById(id);
    if (!order) {
       res.status(404).json({ error: "Order not found" });
       return;
    }

    // Update fields if provided
    if (status) order.status = status as OrderStatus;
    if (amount !== undefined) order.amount = amount;
    if (name) order.name = name;
    if (quantity !== undefined) order.quantity = quantity;
    if (deliveryDate) order.deliveryDate = new Date(deliveryDate);

    await order.save();
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error: any) {
    res.status(500).json({ error: "Error updating order", message: error.message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
       res.status(404).json({ error: "Order not found" });
       return;
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Error deleting order", message: error.message });
  }
};