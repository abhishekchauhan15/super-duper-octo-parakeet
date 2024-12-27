import mongoose, { Schema, Document } from "mongoose";

// Lead Interface
interface ILead extends Document {
  name: string;
  address: string;
  type:"Resturant | Dabha",
  status: "New" | "Contacted" | "Qualified" | "Closed";
  callFrequency: number; // In days
  lastCalledDate: Date | null;
  pointsOfContact: mongoose.Types.ObjectId[]; // Array of references to POCs
  createdAt: Date;
  updatedAt: Date;
}

// Lead Schema
const LeadSchema: Schema = new Schema<ILead>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, enum: ["Resturant", "Dabha"], required: true },
  status: { type: String, enum: ["New", "Contacted", "Qualified", "Closed"], required: true },
  callFrequency: { type: Number, required: true },
  lastCalledDate: { type: Date, default: null },
  pointsOfContact: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Lead = mongoose.model<ILead>("Lead", LeadSchema);
export type { ILead };
