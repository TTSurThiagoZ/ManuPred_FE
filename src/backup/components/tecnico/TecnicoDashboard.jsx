import { useState } from "react";
import AppShell from "../layout/AppShell";

const TECNICO_LOGADO = "Carlos Lima";

const COLUMNS = [
  { key: "aberto", label: "Em aberto" },
  { key: "andamento", label: "Em andamento" },
  { key: "externa", label: "Aguard. externa" },
  { key: "concluido", label: "Concluída" },
  { key: "finalizada", label: "Finalizada" },
  { key: "rejeitada", label: "Rejeitada" },
];

const INITIAL_TICKETS = [
  { id: "0513", titulo: "Lâmpada queimada no corredor", status: "aberto", tipo: "Elétrico", local: "Corredor B", data: "Aberto hoje", responsavel: null, abertoPor: "João Reis" },
  { id: "0512", titulo: "Vazamento no encanamento do banheiro", status: "aberto", tipo: "Hidráulico", local: "Sala 12", data: "12/08/2026", responsavel: null, abertoPor: "Ana Souza" },
  { id: "0509", titulo: "Ar-condicionado não gela", status: "andamento", tipo: "Ar-cond.", local: "Sala 22", data: "Atribuído", responsavel: "Carlos Lima", abertoPor: "Beatriz Alves", urgente: true },
  { id: "0498", titulo: "Elevador com ruído estranho", status: "externa", tipo: "Elétrico", local: "Bloco A", data: "Aguardando técnico externo", responsavel: "Renata Silva", abertoPor: "Marcos Paiva" },
  { id: "0490", titulo: "Troca de fechadura da sala 8", status: "concluido", tipo: "Outro", local: "Sala 8", data: "Aguard. validação", responsavel: "Carlos Lima", abertoPor: "Juliana Reis" },
  { id: "0485", titulo: "Pintura da parede do refeitório", status: "finalizada", tipo: "Outro", local: "Refeitório", data: "Finalizado", responsavel: "Marcos Paiva", abertoPor: "Ana Souza" },
  { id: "0480", titulo: "Solicitação duplicada", status: "rejeitada", tipo: "Outro", local: "Sala 5", data: "Motivo: duplicado", responsavel: "Carlos Lima", abertoPor: "Pedro Costa" },
];

function iniciais(nome) {
  if (!nome) return "—";
  return nome.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function TecnicoDashboard({ onLogout }) {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [justMovedId, setJustMovedId] = useState(null);

  const moverPara = (id, novoStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        let responsavel = t.responsavel;
        if (novoStatus === "andamento" && !responsavel) responsavel = TECNICO_LOGADO;
        if (novoStatus === "aberto") responsavel = null;
        return { ...t, status: novoStatus, responsavel };
      })
    );
    setJustMovedId(id);
  };

  const assumirChamado = (id) => moverPara(id, "andamento");
  const concluirChamado = (id) => moverPara(id, "concluido");

  const handleDrop = (colKey) => {
    if (draggedId) moverPara(draggedId, colKey);
    setDraggedId(null);
    setDragOverCol(null);
  };

  return (
    <AppShell onLogout={onLogout} userName={TECNICO_LOGADO} userRole="Técnico">
      <div className="flex flex-col w-full px-8 py-10 gap-6">
        <div>
          <h1 className="font-serif text-4xl text-charcoal mb-2">Painel de Chamados</h1>
          <p className="font-body text-sm text-stone">
            Arraste um card pra outra coluna pra mudar o status — inclusive pra voltar um concluído.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colTickets = tickets.filter((t) => t.status === col.key);
            const isOver = dragOverCol === col.key;
            return (
              <div
                key={col.key}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverCol(col.key);
                }}
                onDragLeave={() => setDragOverCol((c) => (c === col.key ? null : c))}
                onDrop={() => handleDrop(col.key)}
                className={`min-w-[280px] w-[280px] shrink-0 flex flex-col gap-3 rounded-2xl p-2 transition-all duration-200 ${
                  isOver ? "bg-amber-100/60 ring-2 ring-amber-300 scale-[1.02]" : ""
                }`}
              >
                <div className="flex items-center justify-between px-1">
                  <h2 className="font-body text-sm font-semibold text-charcoal">{col.label}</h2>
                  <span className="font-body text-xs text-stone bg-white border border-stone/15 rounded-full w-6 h-6 flex items-center justify-center">
                    {colTickets.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 min-h-[60px]">
                  {colTickets.map((t) => {
                    const meu = t.responsavel === TECNICO_LOGADO;
                    const sendoArrastado = draggedId === t.id;
                    const acabouDeChegar = justMovedId === t.id;
                    return (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={() => setDraggedId(t.id)}
                        onDragEnd={() => {
                          setDraggedId(null);
                          setDragOverCol(null);
                        }}
                        onAnimationEnd={() => setJustMovedId((cur) => (cur === t.id ? null : cur))}
                        className={`bg-white rounded-2xl p-4 border select-none ${
                          sendoArrastado
                            ? "opacity-40 scale-95 border-dashed border-stone/40 shadow-none cursor-grabbing"
                            : `opacity-100 scale-100 shadow-sm cursor-grab hover:-translate-y-0.5 hover:shadow-md ${
                                meu ? "border-amber-300 ring-1 ring-amber-200" : "border-stone/10"
                              }`
                        } transition-all duration-150 ${acabouDeChegar ? "animate-[cardDrop_0.4s_ease-out]" : ""}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="font-body text-xs text-stone">#{t.id}</span>
                          {t.urgente && <span className="material-symbols-outlined text-red-500 text-[14px]">warning</span>}
                        </div>
                        <p className="font-body text-sm font-semibold text-charcoal leading-snug mb-2">{t.titulo}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className="font-body text-[11px] text-stone bg-cream rounded-full px-2 py-0.5">{t.tipo}</span>
                          <span className="font-body text-[11px] text-stone bg-cream rounded-full px-2 py-0.5">📍 {t.local}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-body text-[11px] text-stone/70">{t.data}</span>
                          <span
                            title={t.responsavel ?? "Sem responsável"}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              meu ? "bg-amber-600 text-white" : "bg-stone/15 text-stone"
                            }`}
                          >
                            {iniciais(t.responsavel)}
                          </span>
                        </div>

                        {col.key === "aberto" && (
                          <button
                            onClick={() => assumirChamado(t.id)}
                            className="w-full mt-3 font-body text-xs font-semibold text-white bg-amber-600 rounded-full py-1.5 hover:bg-amber-700 transition-colors"
                          >
                            Assumir chamado
                          </button>
                        )}

                        {col.key === "andamento" && meu && (
                          <button
                            onClick={() => concluirChamado(t.id)}
                            className="w-full mt-3 font-body text-xs font-semibold text-white bg-emerald-600 rounded-full py-1.5 hover:bg-emerald-700 transition-colors"
                          >
                            Marcar como concluída
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {colTickets.length === 0 && (
                    <div className="border border-dashed border-stone/20 rounded-2xl p-4 text-center">
                      <p className="font-body text-xs text-stone/60">Vazio</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}