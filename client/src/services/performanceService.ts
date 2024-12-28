import axios from 'axios';
import { getAuthToken } from '../utils/auth';
import { config } from '../config';
import { WellPerformingResponse, OrderingPattern, UnderperformingResponse } from '../types/performance';

const API_URL = `${config.apiBaseUrl}/performance`;

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

export const performanceService = {
  getWellPerformingAccounts: async (timeframe?: string, threshold?: string): Promise<WellPerformingResponse> => {
    const params = new URLSearchParams();
    if (timeframe) params.append('timeframe', timeframe);
    if (threshold) params.append('threshold', threshold);
    
    const response = await api.get(`?${params.toString()}`);
    return response.data;
  },

  getOrderingPatterns: async (leadId: string, timeframe?: string): Promise<OrderingPattern> => {
    const params = new URLSearchParams();
    if (timeframe) params.append('timeframe', timeframe);
    
    const response = await api.get(`/patterns/${leadId}?${params.toString()}`);
    return response.data;
  },

  getUnderperformingAccounts: async (timeframe?: string, threshold?: string): Promise<UnderperformingResponse> => {
    const params = new URLSearchParams();
    if (timeframe) params.append('timeframe', timeframe);
    if (threshold) params.append('threshold', threshold);
    
    const response = await api.get(`/underperforming?${params.toString()}`);
    return response.data;
  }
}; 