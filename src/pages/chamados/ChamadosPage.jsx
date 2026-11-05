// Meus Chamados — rota: /chamados (USER_ROLE)
// Lista os chamados do usuário vindos da API, com filtro por status.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '../../shared/components/Layout';
import { solicitacaoService } from '../../shared/services/solicitacaoService';
import { getStatusMeta, isEncerrado, formatarData, codigoCurto, tituloChamado } from '../../utils/chamados';

// Filtros mapeados conforme os Enums retornados pela API
const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "ABERTO", label: "Abertos" },
  { key: "EM_ANDAMENTO", label: "Em andamento" },
  { key: "CONCLUIDO", label: "Concluídos" },
];

// "Em andamento" também inclui os que aguardam assistência externa
const emAndamento = (status) => status === "EM_ANDAMENTO" || status === "AGUARDANDO_ASSISTENCIA_EXTERNA";

export default function ChamadosPage() {
  const navigate = useNavigate();
  const [chamados, setChamados] = useState([]);
  const [filter, setFilter] = useState("todos");
  const [carregado, setCarregado] = useState(false);
  const [erro, setErro] = useState("");

  // Carrega os chamados da API ao montar o componente
  async function carregarChamados() {
    setErro("");
    try {
      // A requisição aciona automaticamente o interceptor e exibe o modal Lottie
      const data = await solicitacaoService.search({ page: 0, size: 50, sort: "dataAbertura,desc" });
      setChamados(data.content || []);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      setErro(error.response?.data?.message || error.message || "Erro desconhecido");
    } finally {
      setCarregado(true);
    }
  }

  useEffect(() => {
    carregarChamados();
  }, []);

  // Contagem dinâmica dos filtros baseada no status vindo da API
  const counts = {
    todos: chamados.length,
    ABERTO: chamados.filter((t) => t.status === "ABERTO").length,
    EM_ANDAMENTO: chamados.filter((t) => emAndamento(t.status)).length,
    CONCLUIDO: chamados.filter((t) => isEncerrado(t.status)).length,
  };

  // Filtragem dos chamados visíveis
  const visibleTickets = chamados.filter((t) => {
    if (filter === "todos") return true;
    if (filter === "CONCLUIDO") return isEncerrado(t.status);
    if (filter === "EM_ANDAMENTO") return emAndamento(t.status);
    return t.status === filter;
  });

  const handleNovoChamado = () => {
    navigate('/chamados/novo');
  };

  return (
    <Layout>
      <div className="flex flex-col w-full px-8 md:px-16 py-12 gap-10 max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 w-full">
          <div>
            <h1 className="font-serif text-4xl text-white mb-2">Meus Chamados</h1>
            <p className="font-body text-sm text-white/50">
              Acompanhe o andamento das suas solicitações de manutenção.
            </p>
          </div>
          <button
            onClick={handleNovoChamado}
            className="bg-[#F39400] text-[#241F1A] px-6 py-3 rounded-2xl font-body font-semibold text-sm shadow-sm hover:bg-[#F39400]/90 transition-colors flex items-center gap-2 w-fit cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nova Requisição
          </button>
        </div>

        {/* Erro ao carregar */}
        {erro && (
          <div className="bg-red-500/10 border border-red-400/20 rounded-2xl px-5 py-4">
            <p className="font-body text-sm text-red-200 font-semibold mb-1">Não foi possível carregar os chamados</p>
            <p className="font-body text-xs text-red-300/80 mb-3">{erro}</p>
            <button
              onClick={carregarChamados}
              className="font-body text-xs font-semibold text-red-200 border border-red-400/30 rounded-full px-3 py-1.5 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full font-body text-sm transition-colors cursor-pointer ${
                filter === f.key
                  ? "bg-[#F39400] text-[#241F1A] font-semibold"
                  : "bg-[#1C1814] text-white/60 border border-white/10 hover:bg-white/5"
              }`}
            >
              {f.label} <span className="opacity-60">({counts[f.key] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* Grid de Cards dos Chamados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleTickets.map((t) => {
            const meta = getStatusMeta(t.status);
            const done = isEncerrado(t.status);

            return (
              <article
                key={t.id}
                onClick={() => navigate(`/chamados/${t.id}`)}
                className={`bg-[#1C1814] rounded-2xl border border-white/10 p-6 flex flex-col gap-4 transition-all cursor-pointer ${
                  done ? "opacity-60 hover:opacity-100" : "hover:border-[#F39400]/40 hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${meta.badge}`}>
                    {meta.label}
                  </span>
                  <span className="font-body text-xs text-white/40 shrink-0">
                    {formatarData(t.dataAbertura)}
                  </span>
                </div>

                <div>
                  <h2 className={`font-serif text-lg text-white leading-snug mb-1 ${done ? "line-through decoration-white/30" : ""}`}>
                    {tituloChamado(t)}
                  </h2>
                  <p className="font-body text-sm text-white/50 line-clamp-2">{t.descricao}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-white/10">
                  {t.tipo && (
                    <span className="font-body text-xs text-white/70 bg-white/5 rounded-full px-3 py-1">
                      🔧 {t.tipo}
                    </span>
                  )}
                  {t.localizacaoProblema && (
                    <span className="font-body text-xs text-white/70 bg-white/5 rounded-full px-3 py-1">
                      📍 {t.localizacaoProblema}
                    </span>
                  )}
                </div>

                <p className="font-body text-[11px] text-white/40">
                  #{codigoCurto(t.id)} · aberto por {t.usuarioSolicitanteNome || "Solicitante"}
                </p>
              </article>
            );
          })}

          {/* Estado Vazio */}
          {carregado && !erro && visibleTickets.length === 0 && (
            <div className="col-span-full border border-dashed border-white/15 rounded-2xl p-12 text-center">
              <p className="font-body text-sm text-white/50">Nenhum chamado encontrado para este filtro.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
