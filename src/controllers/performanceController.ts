// import { Request, Response } from "express";
// import { AccountPerformance } from "../models/performace";
// import mongoose from "mongoose";

// // Add Performance Data
// export const addPerformance = async (req: Request, res: Response) => {
//   try {
//     const { leadId, totalOrders, orderFrequency, performanceRating } = req.body;

//     // Required fields check
//     if (!leadId || totalOrders === undefined || orderFrequency === undefined || !performanceRating) {
//        res.status(400).json({ error: "All fields are required" });
//        return
//     }

//     // Type validation
//     if (typeof totalOrders !== 'number' || totalOrders < 0) {
//        res.status(400).json({ error: "Total orders must be a non-negative number" });
//        return
//     }
//     if (typeof orderFrequency !== 'number' || orderFrequency < 0) {
//        res.status(400).json({ error: "Order frequency must be a non-negative number" });
//        return
//     }

//     // Enum validation
//     const validRatings = ["High", "Medium", "Low"];
//     if (!validRatings.includes(performanceRating)) {
//        res.status(400).json({ error: "Invalid performance rating" });
//        return
//     }

//     // Lead existence check
//     if (!mongoose.Types.ObjectId.isValid(leadId)) {
//        res.status(400).json({ error: "Invalid lead ID format" });
//        return
//     }

//     const performance = new AccountPerformance({ leadId, totalOrders, orderFrequency, performanceRating });
//     await performance.save();
//     res.status(201).json({ message: "Performance data added successfully", performance });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get Performance by Lead
// export const getPerformanceByLead = async (req: Request, res: Response) => {
//   try {
//     const { leadId } = req.params;

//     // Lead existence check
//     if (!mongoose.Types.ObjectId.isValid(leadId)) {
//      res.status(400).json({ error: "Invalid lead ID format" });
//      return
//     }

//     const performance = await AccountPerformance.findOne({ leadId });
//     if (!performance) {
//        res.status(404).json({ message: "No performance records found for this lead" });
//        return
//     }

//     res.status(200).json(performance);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
