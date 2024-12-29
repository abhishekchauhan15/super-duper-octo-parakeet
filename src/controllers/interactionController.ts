import { Request, Response } from "express";
import { Interaction } from "../models/interaction";
import { Lead } from "../models/lead";
import moment from "moment-timezone";

export const addInteraction = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { leadId, nextCallDate, notes, duration } = req.body;
    const userId = req.userId;

    if (!leadId || !userId) {
       res.status(400).json({ error: "Missing required fields" });
       return;
    }

    // Fetch the lead to get preferredTimezone and callFrequency
    const lead = await Lead.findById(leadId);
    if (!lead) {
       res.status(404).json({ error: "Lead not found" });
       return;
    }

    const preferredTimezone = lead.preferredTimezone;

    // Create the interaction
    const interaction = new Interaction({
      userId, 
      leadId,
      type: "Call",
      notes,
      duration 
    });

    await interaction.save();

    // Calculate next call date based on call frequency
    // If nextCallDate is provided in the request, use that instead
    const calculatedNextCallDate = nextCallDate 
      ? moment.tz(nextCallDate, preferredTimezone).utc().toDate()
      : moment().add(lead.callFrequency, 'days').toDate();

    // Update the lead with new interaction date and next call date
    lead.lastInteractionDate = new Date();
    lead.nextCallDate = calculatedNextCallDate;
    await lead.save();

    res.status(201).json({
      message: "Interaction added successfully",
      nextCallDate: calculatedNextCallDate
    });
  } catch (error: any) {
    res.status(500).json({ error: "Error adding interaction", message: error.message });
  }
};

export const getInteractionsByLead = async (req: Request, res: Response) => {
  try {
    const { leadId } = req.params;

    if (!leadId) {
       res.status(400).json({ error: "leadId is required" });
       return;
    }

    const interactions = await Interaction.find({ leadId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
      
    res.status(200).json(interactions);
  } catch (error: any) {
    res.status(500).json({ error: "Error fetching interactions", message: error.message });
  }
};
