import { Request, Response } from "express";
import { Interaction } from "../models/interaction";
import moment from "moment-timezone";

// Add Interaction
export const addInteraction = async (req: Request, res: Response) => {
  try {
    const { nextCallDate, perferedTimezone, leadId, type, details } = req.body;

    // Validate required fields
    if (!leadId || !type || !details || !nextCallDate || !perferedTimezone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate timezone format
    if (!moment.tz.zone(perferedTimezone)) {
      return res.status(400).json({ error: "Invalid timezone" });
    }

    const utcNextCallDate = moment.tz(nextCallDate, perferedTimezone).utc().toDate();

    const interaction = new Interaction({
      perferedTimezone, leadId, type, details,
      nextCallDate: utcNextCallDate
    });
    await interaction.save();
    res.status(201).json(interaction);
  } catch (error: any) {
    res.status(500).json({ error: "Error adding interaction", message: error.message });
  }
};

// Get Interactions by Lead
export const getInteractionsByLead = async (req: Request, res: Response) => {
  try {
    const { leadId } = req.params;

    // Validate leadId
    if (!leadId) {
      return res.status(400).json({ error: "leadId is required" });
    }

    const interactions = await Interaction.find({ leadId });
    res.status(200).json(interactions);
  } catch (error: any) {
    res.status(500).json({ error: "Error fetching interactions", message: error.message });
  }
};
