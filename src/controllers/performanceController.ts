import { Request, Response } from "express";
import { AccountPerformance } from "../models/performace";

// Add Performance Data
export const addPerformance = async (req: Request, res: Response) => {
  try {
    const performance = new AccountPerformance(req.body);
    await performance.save();
    res.status(201).json(performance);
  } catch (error:any) {
    res.status(500).json({ error: "Error adding performance", message: error.message });
  }
};

// Get Performance by Lead
export const getPerformanceByLead = async (req: Request, res: Response) => {
  try {
    const performance = await AccountPerformance.findOne({ leadId: req.params.leadId });
    res.status(200).json(performance);
} catch (error:any) {
    res.status(500).json({ error: "Error fetching performance", message: error.message });
  }
};
