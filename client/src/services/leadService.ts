import axios from 'axios';
import { CreateLeadData, UpdateLeadData, Lead } from '../types/lead';
import { getAuthToken } from '../utils/auth';

const API_URL = 'http://localhost:3000/api/leads';

// Configure axios with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const leadService = {
  createLead: async (data: CreateLeadData): Promise<Lead> => {
    const response = await api.post('', data);
    return response.data.lead;
  },

  getAllLeads: async (): Promise<Lead[]> => {
    const response = await api.get('');
    return response.data;
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const response = await api.get(`/${id}`);
    return response.data.lead;
  },

  getLeadStatus: async (id: string): Promise<string> => {
    const response = await api.get(`/${id}`);
    return response.data.status;
  },

  updateLead: async (id: string, data: UpdateLeadData): Promise<Lead> => {
    const response = await api.patch(`/${id}`, data);
    return response.data.lead;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
  },

  getLeadsRequiringCallsToday: async (): Promise<Lead[]> => {
    const response = await api.get('/call-planning/today');
    return response.data;
  }
}; 