import express from "express";
import { addPerformance, getPerformanceByLead } from "../controllers/performanceController";

const router = express.Router();

router.post("/", addPerformance);
router.get("/:leadId", getPerformanceByLead);

export default router;
