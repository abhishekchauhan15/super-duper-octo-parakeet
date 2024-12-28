export interface Lead {
  _id: string;
  name: string;
  address: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
  type?: 'Resturant' | 'Dabha';
  callFrequency: number;
  preferredTimezone?: string;
  lastInteractionDate?: Date;
  nextCallDate?: Date;
  pointsOfContact?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadData {
  name: string;
  address: string;
  status: string;
  type?: string;
  callFrequency: number;
  preferredTimezone?: string;
}

export type UpdateLeadData = Partial<{
  name: string;
  address: string;
  status: string;
  type: string;
  callFrequency: number;
  preferredTimezone: string;
  lastInteractionDate: Date;
  pointsOfContact: string[];
}>; 