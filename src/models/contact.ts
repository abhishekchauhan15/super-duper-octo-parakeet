import mongoose, { Schema, Document } from "mongoose";

// Contact Interface
interface IContact extends Document {
  leadId: mongoose.Types.ObjectId;
  name: string;
  role: "Owner" | "Manager";
  phoneNumber: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Contact Schema
const ContactSchema: Schema = new Schema<IContact>({
  leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["Owner", "Manager"], required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Contact = mongoose.model<IContact>("Contact", ContactSchema);
export type { IContact };
