import axios from 'axios';
import { Interaction, CreateInteractionData } from '../types/interaction';
import { getAuthToken } from '../utils/auth';
import { config } from '../config';

const API_URL = `${config.apiBaseUrl}/interactions`;

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

export const interactionService = {
  addInteraction: async (data: CreateInteractionData): Promise<void> => {
    const response = await api.post('', data);
    return response.data;
  },

  getInteractionsByLead: async (leadId: string): Promise<Interaction[]> => {
    const response = await api.get(`/${leadId}`);
    return response.data;
  }
}; 