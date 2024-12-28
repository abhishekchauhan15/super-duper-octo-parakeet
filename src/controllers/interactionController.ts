import { Request, Response } from "express";
import { Interaction } from "../models/interaction";
import { Lead } from "../models/lead";
import moment from "moment-timezone";

export const addInteraction = async (req: Request, res: Response) => {
  try {
    const { leadId, nextCallDate, notes, duration } = req.body;

    const userId = req.userId;

    if (!leadId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Fetch the lead to get preferredTimezone
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

    // If nextCallDate is provided, update the lead's nextCallDate
    if (nextCallDate) {
      const utcNextCallDate = moment.tz(nextCallDate, preferredTimezone).utc().toDate();
      lead.nextCallDate = utcNextCallDate; 
      await lead.save(); 
    }

    await interaction.save();
    res.status(201).json({message: "Interaction updated successfully"});
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

    const interactions = await Interaction.find({ leadId });
    res.status(200).json(interactions);
  } catch (error: any) {
    res.status(500).json({ error: "Error fetching interactions", message: error.message });
  }
};
