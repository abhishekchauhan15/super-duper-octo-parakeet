export interface Interaction {
  _id: string;
  userId: string;
  leadId: string;
  type: string;
  notes?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInteractionData {
  leadId: string;
  nextCallDate?: string;
  notes?: string;
  duration?: number;
} 