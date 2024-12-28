import mongoose, { Schema, Document } from 'mongoose';

// Interaction Interface
interface IInteraction extends Document {
    leadId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    type: "Call" | "Email";
    notes: string;
    date: Date;
    duration:number,
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
        enum: ["Call", "Email"], 
        default: "Call",
        required: true 
    },
    duration: { 
        type: Number, 
        required: false
    },
    notes: { 
        type: String, 
        required: false, 
        minlength: 1, 
        maxlength: 500 
    },
    date: { 
        type: Date, 
        default: Date.now
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Add index for efficient querying
InteractionSchema.index({ leadId: 1, createdAt: -1 });
InteractionSchema.index({ userId: 1, createdAt: -1 });

export const Interaction = mongoose.model<IInteraction>("Interaction", InteractionSchema);
export type { IInteraction };
  