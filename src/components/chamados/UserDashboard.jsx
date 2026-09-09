import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../layout/AppShell";

const STATUS_META = {
  aberto: { label: "ABERTO", dotClass: "bg-error" },
  andamento: { label: "ANDAMENTO", dotClass: "bg-primary animate-pulse" },
  externa: { label: "AGUARD. EXTERNA", dotClass: "bg-tertiary" },
  concluido: { label: "CONCLUÍDO", dotClass: "border border-on-surface-variant bg-transparent" },
  finalizada: { label: "FINALIZADA", dotClass: "bg-on-surface-variant" },
  rejeitada: { label: "REJEITADA", dotClass: "bg-error" },
};

const FILTERS = [
  { key: "todos", label: "TODOS" },
  { key: "aberto", label: "ABERTOS" },
  { key: "andamento", label: "EM ANDAMENTO" },
  { key: "concluido", label: "CONCLUÍDOS" },
];

export default function UserDashboard({ tickets, onLogout }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("todos");

  const isDone = (t) => t.status === "concluido" || t.status === "finalizada";

  const counts = {
    todos: tickets.length,
    aberto: tickets.filter((t) => t.status === "aberto").length,
    andamento: tickets.filter((t) => t.status === "andamento").length,
    concluido: tickets.filter(isDone).length,
  };

  const visibleTickets =
    filter === "todos" ? tickets : filter === "concluido" ? tickets.filter(isDone) : tickets.filter((t) => t.status === filter);

  const handleNovoChamado = () => {
    sessionStorage.setItem("navegacaoInterna", "1");
    navigate("/chamados/novo");
  };

  return (
    <AppShell onLogout={onLogout}>
      <div className="flex flex-col w-full px-8 md:px-16 py-12 gap-10">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 w-full border-b border-outline-variant pb-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface uppercase tracking-tight">
              Meus Chamados
            </h1>
            <p className="font-body text-sm text-on-surface-variant max-w-2xl">
              Painel de acompanhamento e histórico de requisições de manutenção.
            </p>
          </div>
          <button
            onClick={handleNovoChamado}
            className="bg-primary text-on-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0px_#3d2b1f] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#3d2b1f] transition-all flex items-center gap-2 w-fit"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nova Requisição
          </button>
        </div>

        <div className="flex gap-4 items-center flex-wrap">
          <span className="font-mono text-xs text-on-surface-variant uppercase">Filtrar:</span>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 font-mono text-xs border transition-colors ${
                  filter === f.key
                    ? "bg-surface-container-high border-outline-variant text-on-surface shadow-[2px_2px_0px_rgba(61,43,31,0.2)]"
                    : "bg-surface border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {f.label} ({counts[f.key]})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTickets.map((t) => {
            const meta = STATUS_META[t.status] ?? STATUS_META.aberto;
            const done = isDone(t);
            return (
              <article
                key={t.id}
                className={`relative border p-6 flex flex-col gap-5 transition-all duration-300 ${
                  done
                    ? "bg-surface-container-low border-outline-variant/30 opacity-75 hover:opacity-100"
                    : "bg-surface-container-lowest border-outline-variant/50 shadow-[4px_4px_0px_rgba(61,43,31,0.05)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(61,43,31,0.08)]"
                }`}
              >
                <div className="flex justify-between items-start border-b border-outline-variant/30 pb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${meta.dotClass}`} />
                    <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest">
                      [ {meta.label} ]
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-on-surface-variant/70">{t.dataAbertura}</span>
                </div>

                <div className="flex flex-col gap-2 flex-grow">
                  <h2
                    className={`font-display text-lg font-semibold uppercase leading-tight line-clamp-2 ${
                      done ? "text-on-surface/80 line-through decoration-outline-variant" : "text-on-surface"
                    }`}
                  >
                    {t.titulo}
                  </h2>
                  <p className={`font-body text-sm line-clamp-3 ${done ? "text-on-surface-variant/80" : "text-on-surface-variant"}`}>
                    {t.descricao}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-on-surface-variant/70 uppercase">Tipo</span>
                    <span className="font-mono text-xs text-on-surface truncate">{t.tipo}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-mono text-[10px] text-on-surface-variant/70 uppercase">Local</span>
                    <span className="font-mono text-xs text-on-surface truncate">{t.local}</span>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 opacity-30 pointer-events-none">
                  <span className="font-mono text-xs text-on-surface-variant tracking-tighter">ID.#{t.id}</span>
                </div>
              </article>
            );
          })}

          {visibleTickets.length === 0 && (
            <div className="col-span-full border border-dashed border-outline-variant p-10 text-center">
              <p className="font-body text-sm text-on-surface-variant">Nenhum chamado nesse filtro.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}