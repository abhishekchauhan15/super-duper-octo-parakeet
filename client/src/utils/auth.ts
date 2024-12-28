import Cookies from 'js-cookie';
import axios from 'axios';

export const setAuthToken = (token: string) => {
  Cookies.set('auth_token', token, { expires: 7 }); // Token expires in 7 days
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getAuthToken = () => {
  return Cookies.get('auth_token');
};

export const removeAuthToken = () => {
  Cookies.remove('auth_token');
  delete axios.defaults.headers.common['Authorization'];
};

// Initialize axios with token if it exists
const token = getAuthToken();
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} 