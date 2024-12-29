import mongoose, { Schema, Document } from "mongoose";
import moment from 'moment-timezone';

// Lead Interface
interface ILead extends Document {
  name: string;
  address: string;
  type: string;
  status: "New" | "Contacted" | "Qualified" | "Closed";
  callFrequency: number; // In days
  lastInteractionDate: Date | null;
  preferredTimezone: string;
  nextCallDate: Date;
  pointsOfContact: mongoose.Types.ObjectId[]; // Array of references to POCs
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Lead Schema
const LeadSchema: Schema = new Schema<ILead>({
  name: { 
    type: String, 
    required: true, 
    minlength: 1,
    maxlength: 100
  },
  address: { 
    type: String, 
    required: true, 
    minlength: 1,
    maxlength: 200
  },
  type: { 
    type: String, 
    enum: ["Resturant", "Dabha"], 
    default: "Resturant", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["New", "Contacted", "Qualified", "Closed"], 
    required: true,
    validate: {
      validator: function(value: string) {
        return ["New", "Contacted", "Qualified", "Closed"].includes(value);
      },
      message: props => `${props.value} is not a valid status!`
    }
  },
  callFrequency: { 
    type: Number, 
    required: true, 
    min: 1,
    max: 365
  },
  lastInteractionDate: { 
    type: Date, 
    default: null 
  },
  nextCallDate: { 
    type: Date, 
    required: false,   
    validate: {
      validator: (v: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: props => `Next call date must be today or in the future!`
    }
  },
  preferredTimezone: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value: string) {
        return moment.tz.zone(value) !== null;
      },
      message: props => `${props.value} is not a valid timezone!`
    }
  },
  pointsOfContact: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Contact" 
  }],
  lastOrderDate: {
    type: Date
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

// Add indexes for efficient querying
LeadSchema.index({ status: 1, nextCallDate: 1 });

export const Lead = mongoose.model<ILead>("Lead", LeadSchema);
export type { ILead };
