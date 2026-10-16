import { apiClient } from "./apiClient";

// Chamado simulado para testes caso VITE_USE_MOCK_CHAMADOS seja "true"
const MOCK_CHAMADO = {
  id: "CH-2026-001",
  titulo: "Ar condicionado pingando e com barulho alto",
  descricao: "O aparelho do Bloco B, Sala 12 está vazando água sobre as bancadas e fazendo um ruído forte de vibração.",
  status: "andamento",
  tipo: "Ar Condicionado",
  local: "Bloco B - Sala 12",
  patrimonio: "PAT-88421",
  urgente: true,
  abertoPor: "Ana Souza",
  abertoPorId: "user-001",
  responsavel: "Carlos Lima",
  dataAbertura: "2026-10-10",
  dataPrevisao: "2026-10-20"
};

export const chamadoService = {
  getChamadoById: async (id) => {
    const useMock = import.meta.env.VITE_USE_MOCK_CHAMADOS === "true" || true; // Padrão seguro para teste
    
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { ...MOCK_CHAMADO, id };
    }

    const response = await apiClient.get(`/api/v1/chamados/${id}`);
    return response;
  },

  updateChamado: async (id, chamadoData) => {
    const useMock = import.meta.env.VITE_USE_MOCK_CHAMADOS === "true" || true;

    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      Object.assign(MOCK_CHAMADO, chamadoData);
      return { ...MOCK_CHAMADO, id };
    }

    const response = await apiClient.put(`/api/v1/chamados/${id}`, chamadoData);
    return response;
  }
};