export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  _id: string;
  leadId: string;
  amount: number;
  status: OrderStatus;
  name: string;
  quantity: number;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderData {
  leadId: string;
  amount: number;
  status: OrderStatus;
  name: string;
  quantity: number;
  deliveryDate?: string;
} 