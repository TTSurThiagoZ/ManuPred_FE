// Todos os Chamados — rota: /todoschamados (ADMIN_ROLE)
// Tabela com todos os chamados da API, filtro por status/prioridade, paginação e ações de reatribuir/cancelar.

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../shared/components/Layout";
import AbasAdmin from "../../shared/components/AbasAdmin";
import { solicitacaoService } from "../../shared/services/solicitacaoService";
import {
  STATUS_META,
  PRIORIDADE_META,
  getStatusMeta,
  getPrioridadeMeta,
  formatarData,
  codigoCurto,
  nomeTecnico,
  tituloChamado,
} from "../../utils/chamados";

const PAGE_SIZE = 20;

const fieldClass =
  "w-full sm:w-56 py-3 px-4 bg-[#1C1814] border border-white/10 rounded-2xl font-body text-sm text-white outline-none transition focus:border-[#F39400] focus:ring-4 focus:ring-[#F39400]/10 [&>option]:bg-[#1C1814]";
const thClass = "font-body text-xs font-semibold text-white/50 uppercase tracking-wide px-5 py-3";

export default function TodosChamadosPage() {
  const navigate = useNavigate();
  const [pagina, setPagina] = useState(null); // PageSolicitacaoResponseDTO
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [erro, setErro] = useState("");
  const [acaoErro, setAcaoErro] = useState("");

  // Filtros e paginação vão como query params do /search
  const carregarChamados = useCallback(async () => {
    setErro("");
    try {
      const params = { page, size: PAGE_SIZE, sort: "dataAbertura,desc" };
      if (status) params.status = status;
      if (prioridade) params.prioridade = prioridade;
      setPagina(await solicitacaoService.search(params));
    } catch (error) {
      console.error("Erro ao carregar os chamados:", error);
      setErro(error.response?.data?.message || error.message || "Erro desconhecido");
    }
  }, [page, status, prioridade]);

  useEffect(() => {
    carregarChamados();
  }, [carregarChamados]);

  const cancelarChamado = async (chamado) => {
    if (!window.confirm(`Cancelar o chamado "${tituloChamado(chamado)}"?`)) return;
    setAcaoErro("");
    try {
      await solicitacaoService.atualizarStatus(chamado.id, "CANCELADO");
      await carregarChamados();
    } catch (error) {
      console.error("Erro ao cancelar o chamado:", error);
      setAcaoErro(error.response?.data?.message || error.message || "Não foi possível cancelar o chamado.");
    }
  };

  const chamados = pagina?.content ?? [];
  const totalPages = pagina?.totalPages ?? 1;

  return (
    <Layout>
      <div className="flex flex-col w-full px-8 md:px-16 py-12 gap-8 max-w-6xl mx-auto">
        <div>
          <h1 className="font-serif text-4xl text-white mb-2">Todos os Chamados</h1>
          <p className="font-body text-sm text-white/50">
            Visão geral de todos os chamados do sistema, de qualquer setor ou funcionário.
          </p>
        </div>

        <AbasAdmin />

        <div className="bg-[#F39400]/10 border border-[#F39400]/20 rounded-2xl px-5 py-3.5 flex items-start gap-3">
          <span className="material-symbols-outlined text-[#F39400] text-[18px] mt-0.5">info</span>
          <p className="font-body text-sm text-white/80">
            Como administrador, você pode reatribuir ou cancelar qualquer chamado do sistema.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className={fieldClass}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Todos os status</option>
            {Object.entries(STATUS_META).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
          </select>
          <select
            className={fieldClass}
            value={prioridade}
            onChange={(e) => {
              setPrioridade(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Todas as prioridades</option>
            {Object.entries(PRIORIDADE_META).map(([key, p]) => <option key={key} value={key}>{p.label}</option>)}
          </select>
        </div>

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

        {acaoErro && (
          <div className="p-4 bg-red-500/10 border border-red-400/20 text-red-300 rounded-2xl text-sm font-body">
            {acaoErro}
          </div>
        )}

        <div className="bg-[#1C1814] rounded-2xl border border-white/10 overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className={thClass}>Código</th>
                <th className={thClass}>Título</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Prioridade</th>
                <th className={thClass}>Atribuído a</th>
                <th className={thClass}>Abertura</th>
                <th className={thClass}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {chamados.map((c) => {
                const meta = getStatusMeta(c.status);
                const prioridadeMeta = getPrioridadeMeta(c.prioridade);
                const bloqueado = c.status === "CANCELADO" || c.status === "FINALIZADA";
                return (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/chamados/${c.id}`)}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4 font-body text-sm text-white/50">#{codigoCurto(c.id)}</td>
                    <td className="px-5 py-4 font-body text-sm text-white">
                      {tituloChamado(c)}
                      <span className="block text-xs text-white/40">{c.usuarioSolicitanteNome}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${meta.badge}`}>{meta.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      {prioridadeMeta ? (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${prioridadeMeta.badge}`}>{prioridadeMeta.label}</span>
                      ) : (
                        <span className="font-body text-sm text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-body text-sm text-white/60">{nomeTecnico(c) ?? "—"}</td>
                    <td className="px-5 py-4 font-body text-sm text-white/60">{formatarData(c.dataAbertura)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {/* Reatribuir abre o detalhe, onde o admin escolhe o técnico */}
                        <button
                          disabled={bloqueado}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/chamados/${c.id}`);
                          }}
                          className="font-body text-xs font-semibold text-white/70 border border-white/15 rounded-full px-3 py-1.5 hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Reatribuir
                        </button>
                        <button
                          disabled={bloqueado}
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelarChamado(c);
                          }}
                          className="font-body text-xs font-semibold text-red-300 border border-red-400/25 rounded-full px-3 py-1.5 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {pagina && chamados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center font-body text-sm text-white/50">
                    Nenhum chamado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 font-body text-sm text-white/60">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <span>Página {page + 1} de {totalPages}</span>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
