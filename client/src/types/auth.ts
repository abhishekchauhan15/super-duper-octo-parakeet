export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  error?: string;
} 