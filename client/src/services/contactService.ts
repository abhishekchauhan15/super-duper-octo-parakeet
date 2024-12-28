import axios from 'axios';
import { Contact, CreateContactData } from '../types/contact';
import { getAuthToken } from '../utils/auth';
import { config } from '../config';

const API_URL = `${config.apiBaseUrl}/contacts`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const contactService = {
  addContact: async (data: CreateContactData): Promise<void> => {
    const response = await api.post('', data);
    return response.data;
  },

  getContactsForLead: async (leadId: string): Promise<Contact[]> => {
    const response = await api.get(`/${leadId}`);
    return response.data;
  }
}; 