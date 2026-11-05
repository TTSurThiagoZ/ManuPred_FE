// Painel de Chamados (Kanban) — rota: /painel (TECNICO_ROLE)
// Mostra os chamados da API em colunas por status. Arrastar um card para outra coluna muda o status.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../shared/components/Layout";
import { useUserStore } from "../../store/user";
import { solicitacaoService } from "../../shared/services/solicitacaoService";
import {
  getStatusMeta,
  getPrioridadeMeta,
  formatarData,
  codigoCurto,
  nomeTecnico,
  idTecnico,
  tituloChamado,
  iniciais,
} from "../../utils/chamados";

// Colunas do Kanban na ordem do fluxo (enums da API)
const COLUMNS = ["ABERTO", "EM_ANDAMENTO", "AGUARDANDO_ASSISTENCIA_EXTERNA", "CONCLUIDO", "FINALIZADA", "REJEITADA"];

export default function PainelPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user); // Técnico logado

  const [tickets, setTickets] = useState([]);
  const [erro, setErro] = useState("");
  const [acaoErro, setAcaoErro] = useState("");
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [justMovedId, setJustMovedId] = useState(null);

  async function carregarChamados() {
    setErro("");
    try {
      const data = await solicitacaoService.search({ page: 0, size: 200, sort: "dataAbertura,desc" });
      setTickets(data.content || []);
    } catch (error) {
      console.error("Erro ao carregar o painel:", error);
      setErro(error.response?.data?.message || error.message || "Erro desconhecido");
    }
  }

  useEffect(() => {
    carregarChamados();
  }, []);

  // O card é "meu" quando o técnico responsável é o usuário logado
  const ehMeu = (t) => idTecnico(t) === user?.id || nomeTecnico(t) === user?.nome;

  // Move o card na hora e desfaz se a API der erro
  const moverPara = async (id, novoStatus) => {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket || ticket.status === novoStatus) return;

    const anterior = tickets;
    setAcaoErro("");
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: novoStatus } : t)));
    setJustMovedId(id);

    try {
      // Pegou um chamado sem técnico -> atribui para si mesmo
      if (novoStatus === "EM_ANDAMENTO" && !idTecnico(ticket) && !nomeTecnico(ticket) && user?.id) {
        await solicitacaoService.atribuirTecnico(id, user.id);
      }
      const atualizado = await solicitacaoService.atualizarStatus(id, novoStatus);
      if (atualizado) setTickets((prev) => prev.map((t) => (t.id === id ? atualizado : t)));
    } catch (error) {
      console.error("Erro ao mover o chamado:", error);
      setTickets(anterior);
      setAcaoErro(error.response?.data?.message || error.message || "Não foi possível mover o chamado.");
    }
  };

  const assumirChamado = (id) => moverPara(id, "EM_ANDAMENTO");
  const concluirChamado = (id) => moverPara(id, "CONCLUIDO");

  const handleDrop = (colKey) => {
    if (draggedId) moverPara(draggedId, colKey);
    setDraggedId(null);
    setDragOverCol(null);
  };

  return (
    <Layout>
      <div className="flex flex-col w-full px-8 py-10 gap-6">
        <div>
          <h1 className="font-serif text-4xl text-white mb-2">Painel de Chamados</h1>
          <p className="font-body text-sm text-white/50">
            Arraste um card para outra coluna para mudar o status — inclusive para reabrir um concluído.
          </p>
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

        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((colKey) => {
            const colTickets = tickets.filter((t) => t.status === colKey);
            const isOver = dragOverCol === colKey;
            return (
              <div
                key={colKey}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverCol(colKey);
                }}
                onDragLeave={() => setDragOverCol((c) => (c === colKey ? null : c))}
                onDrop={() => handleDrop(colKey)}
                className={`min-w-[280px] w-[280px] shrink-0 flex flex-col gap-3 rounded-2xl p-2 transition-all duration-200 ${
                  isOver ? "bg-[#F39400]/10 ring-2 ring-[#F39400]/50 scale-[1.02]" : ""
                }`}
              >
                <div className="flex items-center justify-between px-1">
                  <h2 className="font-body text-sm font-semibold text-white">{getStatusMeta(colKey).label}</h2>
                  <span className="font-body text-xs text-white/60 bg-[#1C1814] border border-white/10 rounded-full w-6 h-6 flex items-center justify-center">
                    {colTickets.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 min-h-[60px]">
                  {colTickets.map((t) => {
                    const meu = ehMeu(t);
                    const sendoArrastado = draggedId === t.id;
                    const acabouDeChegar = justMovedId === t.id;
                    const responsavel = nomeTecnico(t);
                    const prioridade = getPrioridadeMeta(t.prioridade);
                    return (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={() => setDraggedId(t.id)}
                        onDragEnd={() => {
                          setDraggedId(null);
                          setDragOverCol(null);
                        }}
                        onDoubleClick={() => navigate(`/chamados/${t.id}`)}
                        onAnimationEnd={() => setJustMovedId((cur) => (cur === t.id ? null : cur))}
                        className={`bg-[#1C1814] rounded-2xl p-4 border select-none transition-all duration-150 ${
                          sendoArrastado
                            ? "opacity-40 scale-95 border-dashed border-white/30 cursor-grabbing"
                            : `cursor-grab hover:-translate-y-0.5 ${meu ? "border-[#F39400]/50" : "border-white/10"}`
                        } ${acabouDeChegar ? "animate-[cardDrop_0.4s_ease-out]" : ""}`}
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                          <span className="font-body text-xs text-white/40">#{codigoCurto(t.id)}</span>
                          {prioridade && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${prioridade.badge}`}>
                              {prioridade.label}
                            </span>
                          )}
                        </div>
                        <p className="font-body text-sm font-semibold text-white leading-snug mb-2">{tituloChamado(t)}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {t.tipo && (
                            <span className="font-body text-[11px] text-white/60 bg-white/5 rounded-full px-2 py-0.5">{t.tipo}</span>
                          )}
                          {t.localizacaoProblema && (
                            <span className="font-body text-[11px] text-white/60 bg-white/5 rounded-full px-2 py-0.5">📍 {t.localizacaoProblema}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-body text-[11px] text-white/40">{formatarData(t.dataAbertura)}</span>
                          <span
                            title={responsavel ?? "Sem responsável"}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              meu ? "bg-[#F39400] text-[#241F1A]" : "bg-white/10 text-white/60"
                            }`}
                          >
                            {iniciais(responsavel)}
                          </span>
                        </div>

                        {colKey === "ABERTO" && (
                          <button
                            onClick={() => assumirChamado(t.id)}
                            className="w-full mt-3 font-body text-xs font-semibold text-[#241F1A] bg-[#F39400] rounded-full py-1.5 hover:bg-[#F39400]/90 transition-colors cursor-pointer"
                          >
                            Assumir chamado
                          </button>
                        )}

                        {colKey === "EM_ANDAMENTO" && meu && (
                          <button
                            onClick={() => concluirChamado(t.id)}
                            className="w-full mt-3 font-body text-xs font-semibold text-emerald-200 bg-emerald-500/15 border border-emerald-400/20 rounded-full py-1.5 hover:bg-emerald-500/25 transition-colors cursor-pointer"
                          >
                            Marcar como concluído
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {colTickets.length === 0 && (
                    <div className="border border-dashed border-white/10 rounded-2xl p-4 text-center">
                      <p className="font-body text-xs text-white/30">Vazio</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="font-body text-xs text-white/30">Dica: dê dois cliques num card para abrir os detalhes.</p>
      </div>
    </Layout>
  );
}
