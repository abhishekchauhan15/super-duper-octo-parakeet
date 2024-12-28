import axios from 'axios';
import { CreateLeadData, UpdateLeadData, Lead, CallPlanningLead } from '../types/lead';
import { getAuthToken } from '../utils/auth';
import { config } from '../config';

const API_URL = `${config.apiBaseUrl}/leads`;

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
    return response.data;
  },

  getAllLeads: async (): Promise<Lead[]> => {
    const response = await api.get('');
    return response.data;
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const response = await api.get(`/${id}`);
    return response.data;
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

  getTodayCallPlanning: async (): Promise<CallPlanningLead[]> => {
    const response = await api.get('/call-planning/today');
    return response.data;
  }
}; 