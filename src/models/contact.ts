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
  name: { 
    type: String, 
    required: true, 
    minlength: 1, 
    maxlength: 100
  },
  role: { 
    type: String, 
    enum: ["Owner", "Manager"], 
    required: true 
  },
  phoneNumber: { 
    type: String, 
    required: true, 
    validate: { 
      validator: (v: string) => /^\+?[1-9]\d{1,14}$/.test(v), 
      message: props => `${props.value} is not a valid phone number!` 
    },
    minlength: 10,
    maxlength: 15
  },
  email: { 
    type: String, 
    required: true, 
    validate: { 
      validator: (v: string) => /^\S+@\S+\.\S+$/.test(v), 
      message: props => `${props.value} is not a valid email!` 
    },
    maxlength: 100
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

export const Contact = mongoose.model<IContact>("Contact", ContactSchema);
export type { IContact };
