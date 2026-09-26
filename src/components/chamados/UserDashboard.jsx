import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../layout/AppShell";
import { goToNovoChamado } from "../../utils/navigation";

const STATUS_META = {
  aberto: { label: "Em aberto", badge: "bg-amber-100 text-amber-700" },
  andamento: { label: "Em andamento", badge: "bg-blue-100 text-blue-700" },
  externa: { label: "Aguard. externa", badge: "bg-purple-100 text-purple-700" },
  concluido: { label: "Concluído", badge: "bg-emerald-100 text-emerald-700" },
  finalizada: { label: "Finalizada", badge: "bg-slate-100 text-slate-600" },
  rejeitada: { label: "Rejeitada", badge: "bg-red-100 text-red-700" },
};

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "aberto", label: "Abertos" },
  { key: "andamento", label: "Em andamento" },
  { key: "concluido", label: "Concluídos" },
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

  const handleNovoChamado = () => goToNovoChamado(navigate);

  return (
    <AppShell onLogout={onLogout}>
      <div className="flex flex-col w-full px-8 md:px-16 py-12 gap-10 max-w-6xl mx-auto">
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
              {f.label} <span className="opacity-60">({counts[f.key]})</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleTickets.map((t) => {
            const meta = STATUS_META[t.status] ?? STATUS_META.aberto;
            const done = isDone(t);
            return (
              <article
                key={t.id}
                className={`bg-white rounded-2xl border border-stone/10 p-6 flex flex-col gap-4 transition-all ${
                  done ? "opacity-70 hover:opacity-100" : "shadow-sm hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${meta.badge}`}>
                    {meta.label}
                  </span>
                  <span className="font-body text-xs text-stone/70 shrink-0">{t.dataAbertura}</span>
                </div>

                <div>
                  <h2 className={`font-serif text-lg text-charcoal leading-snug mb-1 ${done ? "line-through decoration-stone/40" : ""}`}>
                    {t.titulo}
                  </h2>
                  <p className="font-body text-sm text-stone line-clamp-2">{t.descricao}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-stone/10">
                  <span className="font-body text-xs text-stone bg-cream rounded-full px-3 py-1">
                    🔧 {t.tipo}
                  </span>
                  <span className="font-body text-xs text-stone bg-cream rounded-full px-3 py-1">
                    📍 {t.local}
                  </span>
                </div>

                <p className="font-body text-[11px] text-stone/60">
                  #{t.id} · aberto por {t.abertoPor}
                </p>
              </article>
            );
          })}

          {visibleTickets.length === 0 && (
            <div className="col-span-full border border-dashed border-stone/20 rounded-2xl p-12 text-center bg-white/50">
              <p className="font-body text-sm text-stone">Nenhum chamado nesse filtro.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}