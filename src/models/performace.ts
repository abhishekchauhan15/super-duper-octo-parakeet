import mongoose, { Schema, Document } from 'mongoose';

// Account Performance Interface
interface IAccountPerformance extends Document {
    leadId: mongoose.Types.ObjectId;
    totalOrders: number;
    orderFrequency: number; // Orders per month
    performanceRating: "High" | "Medium" | "Low";
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Account Performance Schema
  const AccountPerformanceSchema: Schema = new Schema<IAccountPerformance>({
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    totalOrders: { type: Number, required: true },
    orderFrequency: { type: Number, required: true },
    performanceRating: { type: String, enum: ["High", "Medium", "Low"], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  export const AccountPerformance = mongoose.model<IAccountPerformance>("AccountPerformance", AccountPerformanceSchema);
  