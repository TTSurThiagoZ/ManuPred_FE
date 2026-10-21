import { api } from "../../utils/api";


export const authService = {
  // POST /api/v1/auth/login
  login: async (credentials) => {
    // credentials: { email, password }
    const response = await api.post('/api/v1/auth/login', credentials);
    return response.data; // TokenResponseDTO: { token }
  },

  // POST /api/v1/auth/register
  register: async (userData) => {
    // userData: { nome, email, password, fcmToken }
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  },

  // POST /api/v1/users/auth/firebase
  loginWithFirebase: async (token) => {
    const response = await api.post('/api/v1/users/auth/firebase', { token });
    return response.data; // TokenResponseDTO: { token }
  },
};