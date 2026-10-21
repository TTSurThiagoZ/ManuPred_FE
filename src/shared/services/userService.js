import { api } from "../../utils/api";

export const userService = {
  // GET /api/v1/users/me
  getMe: async () => {
    const response = await api.get('/api/v1/users/me');
    return response.data; // UserMeDTO: { email, nome }
  },

  // GET /api/v1/users
  findAll: async () => {
    const response = await api.get('/api/v1/users');
    return response.data; // UserResponseDTO[]
  },

  // GET /api/v1/users/{id}
  findById: async (id) => {
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data; // UserResponseDTO
  },

  // POST /api/v1/users
  createUser: async (userData) => {
    // userData: { name, email, password, firebaseUid }
    const response = await api.post('/api/v1/users', userData);
    return response.data; // UserResponseDTO
  },

  // DELETE /api/v1/users/{id}
  deleteUser: async (id) => {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  },
};