import { Request, Response } from "express";
import { Lead } from "../models/lead";
import moment from 'moment';

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, address, status , callFrequency , preferredTimezone} = req.body;

    if (!name || !address  || !status || callFrequency === undefined) {
       res.status(400).json({ error: "All fields are required" });
       return
    }

    const lead = new Lead({ name, address,status, callFrequency, preferredTimezone});
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
    res.status(200).json({status: lead.status});
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
      return
    }

    if (name) lead.name = name;

    if (address) lead.address = address;

    if (type) {
      const validTypes = ["Resturant", "Dabha"];
      if (!validTypes.includes(type)) {
         res.status(400).json({ error: "Invalid type" });
        return
      }
      lead.type = type;
    }

    if (status) {
      const validStatuses = ["New", "Contacted", "Qualified", "Closed"];
      if (!validStatuses.includes(status)) {
         res.status(400).json({ error: "Invalid status" });
        return
      }
      lead.status = status;
    }

    if (callFrequency !== undefined) {
      if (typeof callFrequency !== 'number' || callFrequency <= 0) {
        res.status(400).json({ error: "Call frequency must be a positive number" });
        return
      }
      lead.callFrequency = callFrequency;
    }

    if (lastInteractionDate) {
      if (isNaN(new Date(lastInteractionDate).getTime())) {
         res.status(400).json({ error: "Invalid last called date" });
        return
      }
      lead.lastInteractionDate = lastInteractionDate;
    }
    if (pointsOfContact) lead.pointsOfContact = pointsOfContact;

    lead.updatedAt = new Date();
    await lead.save();
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

export const getLeadsRequiringCallsToday = async (req: Request, res: Response) => {
    try {
        const today = moment().startOf('day');
        const leads = await Lead.find({
            nextCallDate: { $lte: today.toDate() }
        });

        res.status(200).json(leads);
    } catch (error: any) {
        res.status(500).json({ error: "Error fetching leads requiring calls", message: error.message });
    }
};
