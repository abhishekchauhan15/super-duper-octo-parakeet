import { Request, Response } from "express";
import { Interaction } from "../models/interaction";

// Add Interaction
export const addInteraction = async (req: Request, res: Response) => {
  try {
    const interaction = new Interaction(req.body);
    await interaction.save();
    res.status(201).json(interaction);
} catch (error:any) {
    res.status(500).json({ error: "Error adding interaction", message: error.message });
  }
};

// Get Interactions by Lead
export const getInteractionsByLead = async (req: Request, res: Response) => {
  try {
    const interactions = await Interaction.find({ leadId: req.params.leadId });
    res.status(200).json(interactions);
} catch (error:any) {
    res.status(500).json({ error: "Error fetching interactions", message: error.message });
  }
};
