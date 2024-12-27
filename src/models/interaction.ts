import mongoose, { Schema, Document } from 'mongoose';


// Interaction Interface
interface IInteraction extends Document {
    leadId: mongoose.Types.ObjectId;
    type: "Call" | "Order";
    nextCallDate: Date;
    frequency: number; // In days
    details: string;
    lastInteractionDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Interaction Schema
  const InteractionSchema: Schema = new Schema<IInteraction>({
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    type: { type: String, enum: ["Call", "Order"], required: true },
    details: { type: String, required: true },
    lastInteractionDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  export const Interaction = mongoose.model<IInteraction>("Interaction", InteractionSchema);
  