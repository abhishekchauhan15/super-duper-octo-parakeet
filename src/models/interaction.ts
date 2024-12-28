import mongoose, { Schema, Document } from 'mongoose';


// Interaction Interface
interface IInteraction extends Document {
    leadId: mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;
    type: "Call" | "Order";
    frequency: number; // In days
    details: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Interaction Schema
  const InteractionSchema: Schema = new Schema<IInteraction>({
    leadId: { 
      type: Schema.Types.ObjectId, 
      ref: "Lead", 
      required: true 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
      },
    type: { 
      type: String, 
      enum: ["Call", "Order"], 
      required: true 
    },
    details: { 
      type: String, 
      required: true, 
      minlength: 1, 
      maxlength: 500 
    },
  
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    },
  });
  
  export const Interaction = mongoose.model<IInteraction>("Interaction", InteractionSchema);
  