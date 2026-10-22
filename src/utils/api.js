import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.5.36.34:8080',
});

// Interceptor de Requisição: Injeta o Token JWT imediatamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      // Compatibilidade com Axios v1+ e versões anteriores
      if (config.headers.set) {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta: Trata expiração de sessão (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);