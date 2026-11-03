import { create } from 'zustand'
import { api } from '../utils/api'

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchMe: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get('/api/v1/users/me')
      set({ user: response.data, loading: false })
    } catch (err) {
      set({ 
        error: err.response?.data?.message || err.message || 'Erro desconhecido', 
        loading: false 
      })
    }
  },

  logout: () => set({ user: null, error: null }),
}))