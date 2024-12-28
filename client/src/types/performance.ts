export interface PerformingLead {
  lead: {
    _id: string;
    name: string;
    status: string;
  };
  orderCount: number;
}

export interface WellPerformingResponse {
  wellPerformingAccounts: PerformingLead[];
  timeframe: string;
  threshold: string;
}

export interface OrderingPattern {
  totalOrders: number;
  averageOrderInterval: number;
  orderDates: Date[];
  timeframe: string;
}

export interface UnderperformingLead extends PerformingLead {
  expectedOrders: number;
  lastOrderDate: Date | null;
}

export interface UnderperformingResponse {
  underperformingAccounts: UnderperformingLead[];
  timeframe: string;
  threshold: string;
} 