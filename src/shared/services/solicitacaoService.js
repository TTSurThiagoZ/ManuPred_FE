import { api } from "../../utils/api";


export const solicitacaoService = {
  /**
   * GET /api/v1/solicitacoes/search
   * Busca e filtra chamados com paginação
   * @param {Object} params - Parâmetros de filtro e paginação (page, size, sort, status, prioridade, etc.)
   */
  search: async (params = {}) => {
    const response = await api.get('/api/v1/solicitacoes/search', { params });
    return response.data; // PageSolicitacaoResponseDTO
  },

  // GET /api/v1/solicitacoes/{id}
  buscarPorId: async (id) => {
    const response = await api.get(`/api/v1/solicitacoes/${id}`);
    return response.data; // SolicitacaoResponseDTO
  },

  /**
   * POST /api/v1/solicitacoes (multipart/form-data)
   * @param {Object} dados - { tipo, localizacaoProblema, descricao, numeroPatrimonio }
   * @param {File[]} anexos - Array de arquivos (opcional)
   */
  criar: async (dados, anexos = []) => {
    const formData = new FormData();
    
    // O backend espera o DTO de dados serializado como JSON dentro do Multipart
    formData.append(
      'dados',
      new Blob([JSON.stringify(dados)], { type: 'application/json' })
    );

    // Anexa os arquivos selecionados
    if (anexos && anexos.length > 0) {
      anexos.forEach((arquivo) => {
        formData.append('anexos', arquivo);
      });
    }

    const response = await api.post('/api/v1/solicitacoes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // SolicitacaoResponseDTO
  },

  // PATCH /api/v1/solicitacoes/{id}/status?status=...
  atualizarStatus: async (id, status) => {
    const response = await api.patch(`/api/v1/solicitacoes/${id}/status`, null, {
      params: { status },
    });
    return response.data; // SolicitacaoResponseDTO
  },

  // PATCH /api/v1/solicitacoes/{id}/prioridade?prioridade=...
  atualizarPrioridade: async (id, prioridade) => {
    const response = await api.patch(`/api/v1/solicitacoes/${id}/prioridade`, null, {
      params: { prioridade },
    });
    return response.data; // SolicitacaoResponseDTO
  },

  // PATCH /api/v1/solicitacoes/{id}/tecnico?tecnicoId=...
  atribuirTecnico: async (id, tecnicoId) => {
    const response = await api.patch(`/api/v1/solicitacoes/${id}/tecnico`, null, {
      params: { tecnicoId },
    });
    return response.data; // SolicitacaoResponseDTO
  },
};