export interface Lead {
  _id: string;
  name: string;
  address: string;
  status: string;
  type?: string;
  callFrequency?: number;
  preferredTimezone?: string;
  lastInteractionDate?: Date;
  pointsOfContact?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadData {
  name: string;
  address: string;
  status: string;
  type?: string;
  callFrequency?: number;
  preferredTimezone?: string;
}

export interface UpdateLeadData {
  name?: string;
  address?: string;
  status?: string;
  type?: string;
  callFrequency?: number;
  preferredTimezone?: string;
  lastInteractionDate?: Date;
  pointsOfContact?: string[];
}

export interface CallPlanningLead extends Lead {
  daysSinceLastCall: number;
  nextCallDue: Date;
} 