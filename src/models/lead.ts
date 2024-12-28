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
  performanceRating: "High" | "Medium" | "Low";
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
      validator: (v: Date) => v > new Date(),
      message: props => `Next call date must be in the future!`
    }
  },
  performanceRating: { 
    type: String, 
    enum: ["High", "Medium", "Low"], 
    required: false 
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
LeadSchema.index({ performanceRating: 1 });
LeadSchema.index({ priorityScore: -1 });

export const Lead = mongoose.model<ILead>("Lead", LeadSchema);
export type { ILead };
