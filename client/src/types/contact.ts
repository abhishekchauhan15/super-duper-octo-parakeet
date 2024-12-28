export interface Contact {
  _id: string;
  leadId: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
}

export interface CreateContactData {
  leadId: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
} 