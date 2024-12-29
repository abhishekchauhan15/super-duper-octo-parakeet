import axios from 'axios';
import { Order, CreateOrderData } from '../types/order';
import { getAuthToken } from '../utils/auth';
import { config } from '../config';

const API_URL = `${config.apiBaseUrl}/orders`;

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

export const orderService = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post('', data);
    return response.data.order;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get('');
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  getOrdersByLeadId: async (leadId: string): Promise<Order[]> => {
    const response = await api.get(`/lead/${leadId}`);
    return response.data;
  }
}; 