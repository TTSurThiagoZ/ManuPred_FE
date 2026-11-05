// Store do usuário logado (Zustand) — usada por todas as telas.
// fetchMe carrega o /me, login salva o token e logout limpa a sessão.

import { create } from 'zustand'
import { api } from '../utils/api'
import { authService } from '../shared/services/authService'

// Mensagem amigável a partir do erro do Axios
const mensagemErro = (err) => err.response?.data?.message || err.message || 'Erro desconhecido'

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  // Retorna o usuário ou lança o erro (a Splash usa isso para decidir entre a tela inicial e o /login)
  fetchMe: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get('/api/v1/users/me')
      set({ user: response.data, loading: false })
      return response.data
    } catch (err) {
      set({ user: null, error: mensagemErro(err), loading: false })
      throw err
    }
  },

  // Login com e-mail e senha: salva o token e já carrega o /me
  login: async ({ email, password }) => {
    set({ loading: true, error: null })
    try {
      const { token } = await authService.login({ email, password })
      localStorage.setItem('token', token)
      return await get().fetchMe()
    } catch (err) {
      localStorage.removeItem('token')
      set({ error: mensagemErro(err), loading: false })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, error: null })
  },
}))
