import express from "express";
import {
  createLead,
  getAllLeads,
  getLeadStatusById,
  updateLead,
  deleteLead,
  getLeadsRequiringCallsToday,
}from "../controllers/leadController";

const router = express.Router();

router.post("/", createLead);
router.get("/", getAllLeads);
router.get("/:id", getLeadStatusById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.get("/call-planning/today", getLeadsRequiringCallsToday);

export default router;
