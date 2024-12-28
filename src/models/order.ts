import mongoose, { Document, Schema } from 'mongoose';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface IOrder extends Document {
  leadId: Schema.Types.ObjectId;
  amount: number;
  status: OrderStatus;
  name: string;
  quantity: number;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  leadId: {
    type: Schema.Types.ObjectId,
    ref: 'Lead',
    required: [true, 'Lead is required']
  },
  amount: {
    type: Number,
    required: [true, 'Order amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
  deliveryDate: Date
}, {
  timestamps: true
});

orderSchema.index({ leadId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);