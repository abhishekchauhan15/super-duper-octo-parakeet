import { Request, Response } from "express";
import { Lead } from "../models/lead";
import moment from 'moment';

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, address, status, callFrequency, preferredTimezone } = req.body;

    if (!name || !address || !status || callFrequency === undefined) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Calculate nextCallDate based on callFrequency (in days)
    const nextCallDate = moment().add(callFrequency, 'days').toDate();

    const lead = new Lead({ 
      name, 
      address, 
      status, 
      callFrequency, 
      preferredTimezone,
      nextCallDate, 
      lastInteractionDate: new Date()
    });
    
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


export const getLeadStatusById = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("pointsOfContact");
    if (!lead) {
       res.status(404).json({ message: "Lead not found" });
       return 
    }
    res.status(200).json({lead});
} catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const { name, address, type, status, callFrequency, lastInteractionDate, pointsOfContact } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    // If callFrequency is being updated, recalculate nextCallDate
    if (callFrequency !== undefined && callFrequency !== lead.callFrequency) {
      // If there's a lastInteractionDate, calculate from that, otherwise use current date
      const baseDate = lead.lastInteractionDate || new Date();
      req.body.nextCallDate = moment(baseDate).add(callFrequency, 'days').toDate();
    }

    // Update the lead with all provided fields
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Lead updated successfully", lead: updatedLead });
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

export const getLeadsRequiringCallsToday = async (req: Request, res: Response) => {
    try {
        const today = moment().startOf('day');
        const leads = await Lead.find({
            nextCallDate: { $lte: today.toDate() }
        }).populate("pointsOfContact");

        res.status(200).json(leads);
    } catch (error: any) {
        res.status(500).json({ error: "Error fetching leads requiring calls", message: error.message });
    }
};
