import express from "express";
import { addInteraction, getInteractionsByLead } from "../controllers/interactionController";

const router = express.Router();

router.post("/", addInteraction);
router.get("/:leadId", getInteractionsByLead);

export default router;
