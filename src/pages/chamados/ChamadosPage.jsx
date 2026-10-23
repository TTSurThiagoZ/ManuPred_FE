import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { solicitacaoService } from '../../shared/services/solicitacaoService';
import { STATUS_META } from '../../utils/chamados';

// Filtros mapeados conforme os Enums retornados pela API
const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "ABERTO", label: "Abertos" },
  { key: "EM_ANDAMENTO", label: "Em andamento" },
  { key: "CONCLUIDO", label: "Concluídos" },
];

// Helper para verificar se o chamado foi finalizado/concluído
const isDone = (status) =>
  status === "CONCLUIDO" ||
  status === "FINALIZADA" ||
  status === "REJEITADA" ||
  status === "CANCELADO";

export default function ChamadosPage({ onLogout }) {
  const navigate = useNavigate();
  const [chamados, setChamados] = useState([]);
  const [filter, setFilter] = useState("todos");

  // Carrega os chamados da API ao montar o componente
  useEffect(() => {
    async function carregarChamados() {
      try {
        // A requisição aciona automaticamente o interceptor e exibe o modal Lottie
        const data = await solicitacaoService.search({ page: 0, size: 50 });
        setChamados(data.content || []);
      } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
      }
    }

    carregarChamados();
  }, []);

  // Contagem dinâmica dos cards baseada no status vindo da API
  const counts = {
    todos: chamados.length,
    ABERTO: chamados.filter((t) => t.status === "ABERTO").length,
    EM_ANDAMENTO: chamados.filter((t) => t.status === "EM_ANDAMENTO" || t.status === "AGUARDANDO_ASSISTENCIA_EXTERNA").length,
    CONCLUIDO: chamados.filter((t) => isDone(t.status)).length,
  };

  // Filtragem dos chamados visíveis
  const visibleTickets = chamados.filter((t) => {
    if (filter === "todos") return true;
    if (filter === "CONCLUIDO") return isDone(t.status);
    if (filter === "EM_ANDAMENTO") return t.status === "EM_ANDAMENTO" || t.status === "AGUARDANDO_ASSISTENCIA_EXTERNA";
    return t.status === filter;
  });

  const handleNovoChamado = () => {
  
      navigate('/chamados/novo');
    
  };

  // Formatação amigável para a data de abertura (ISO -> pt-BR)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
      <div className="flex flex-col w-full px-8 md:px-16 py-12 gap-10 max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 w-full">
          <div>
            <h1 className="font-serif text-4xl text-charcoal mb-2">Meus Chamados</h1>
            <p className="font-body text-sm text-stone">
              Acompanhe o andamento das suas solicitações de manutenção.
            </p>
          </div>
          <button
            onClick={handleNovoChamado}
            className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-body font-semibold text-sm shadow-sm hover:bg-amber-700 transition-colors flex items-center gap-2 w-fit"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nova Requisição
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full font-body text-sm transition-colors ${
                filter === f.key
                  ? "bg-charcoal text-white"
                  : "bg-white text-stone border border-stone/15 hover:bg-cream"
              }`}
            >
              {f.label} <span className="opacity-60">({counts[f.key] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* Grid de Cards dos Chamados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleTickets.map((t) => {
            // Mapeia metadados de status com fallback seguro
            const meta = STATUS_META[t.status] || STATUS_META[t.status?.toLowerCase()] || {
              label: t.status,
              badge: "bg-gray-100 text-gray-700",
            };
            const done = isDone(t.status);

            return (
              <article
                key={t.id}
                onClick={() => navigate(`/chamados/${t.id}`)}
                className={`bg-white rounded-2xl border border-stone/10 p-6 flex flex-col gap-4 transition-all cursor-pointer ${
                  done ? "opacity-70 hover:opacity-100" : "shadow-sm hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${meta.badge}`}>
                    {meta.label}
                  </span>
                  <span className="font-body text-xs text-stone/70 shrink-0">
                    {formatDate(t.dataAbertura)}
                  </span>
                </div>

                <div>
                  <h2 className={`font-serif text-lg text-charcoal leading-snug mb-1 ${done ? "line-through decoration-stone/40" : ""}`}>
                    {t.titulo || t.descricao}
                  </h2>
                  <p className="font-body text-sm text-stone line-clamp-2">{t.descricao}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-stone/10">
                  {t.tipo && (
                    <span className="font-body text-xs text-stone bg-cream rounded-full px-3 py-1">
                      🔧 {t.tipo}
                    </span>
                  )}
                  {t.localizacaoProblema && (
                    <span className="font-body text-xs text-stone bg-cream rounded-full px-3 py-1">
                      📍 {t.localizacaoProblema}
                    </span>
                  )}
                </div>

                <p className="font-body text-[11px] text-stone/60">
                  #{t.id ? t.id.substring(0, 8) : ''} · aberto por {t.usuarioSolicitanteNome || "Solicitante"}
                </p>
              </article>
            );
          })}

          {/* Estado Vazio */}
          {visibleTickets.length === 0 && (
            <div className="col-span-full border border-dashed border-stone/20 rounded-2xl p-12 text-center bg-white/50">
              <p className="font-body text-sm text-stone">Nenhum chamado encontrado para este filtro.</p>
            </div>
          )}
        </div>
      </div>
  );
}