import { Request, Response } from "express";
import { Lead } from "../models/lead";

export const createLead = async (req: Request, res: Response) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ message: "Lead created successfully", lead });
} catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find().populate("pointsOfContact");
    res.status(200).json(leads);
} catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("pointsOfContact");
    if (!lead) {
       res.status(404).json({ message: "Lead not found" });
       return 
    }
    res.status(200).json(lead);
} catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!lead) {
       res.status(404).json({ message: "Lead not found" });
       return 
    }
    res.status(200).json({ message: "Lead updated successfully", lead });
} catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
       res.status(404).json({ message: "Lead not found" });
       return;
    }
    res.status(200).json({ message: "Lead deleted successfully" });
} catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
