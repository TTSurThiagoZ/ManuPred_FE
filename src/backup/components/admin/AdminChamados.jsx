import AppShell from "../layout/AppShell";
import AdminTabs from "./AdminTabs";

const ADMIN_TABS = [
  { key: "usuarios", label: "Usuários", icon: "group", path: null },
  { key: "chamados", label: "Todos os chamados", icon: "list_alt", path: "/admin/chamados" },
  { key: "tipos-locais", label: "Tipos & locais", icon: "sell", path: null },
  { key: "setores", label: "Setores", icon: "apartment", path: null },
  { key: "sla", label: "SLA", icon: "timer", path: null },
  { key: "relatorios", label: "Relatórios", icon: "bar_chart", path: null },
  { key: "auditoria", label: "Auditoria", icon: "policy", path: null },
];

const STATUS_META = {
  aberto: { label: "Em aberto", badge: "bg-amber-100 text-amber-700" },
  andamento: { label: "Em andamento", badge: "bg-blue-100 text-blue-700" },
  externa: { label: "Aguard. externa", badge: "bg-purple-100 text-purple-700" },
  concluido: { label: "Concluído", badge: "bg-emerald-100 text-emerald-700" },
  finalizada: { label: "Finalizada", badge: "bg-slate-100 text-slate-600" },
  rejeitada: { label: "Rejeitada", badge: "bg-red-100 text-red-700" },
};

const CHAMADOS = [
  { id: "0513", titulo: "Lâmpada queimada no corredor", status: "aberto", atribuido: null, setor: "Bloco B", urgente: false },
  { id: "0509", titulo: "Ar-condicionado não gela", status: "andamento", atribuido: "Carlos Lima", setor: "Bloco A", urgente: true },
  { id: "0498", titulo: "Elevador com ruído estranho", status: "externa", atribuido: "Renata Silva", setor: "Bloco A", urgente: false },
  { id: "0485", titulo: "Pintura da parede do refeitório", status: "finalizada", atribuido: "Marcos Paiva", setor: "Refeitório", urgente: false },
];

export default function AdminChamados({ onLogout }) {
  return (
    <AppShell onLogout={onLogout} userName="Fernanda Costa" userRole="Administradora">
      <div className="flex flex-col w-full px-8 md:px-16 py-12 gap-8 max-w-6xl mx-auto">
        <div>
          <h1 className="font-serif text-4xl text-charcoal mb-2">Todos os Chamados</h1>
          <p className="font-body text-sm text-stone">
            Visão geral de todos os chamados do sistema, de qualquer setor ou funcionário.
          </p>
        </div>

        <AdminTabs />

        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-700 text-[18px] mt-0.5">info</span>
          <p className="font-body text-sm text-amber-900">
            Como administrador, você pode reatribuir ou cancelar qualquer chamado do sistema, mesmo sem ser supervisor do setor responsável.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone/10 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone/10 bg-cream/40">
                <th className="font-body text-xs font-semibold text-stone uppercase tracking-wide px-5 py-3">ID</th>
                <th className="font-body text-xs font-semibold text-stone uppercase tracking-wide px-5 py-3">Título</th>
                <th className="font-body text-xs font-semibold text-stone uppercase tracking-wide px-5 py-3">Status</th>
                <th className="font-body text-xs font-semibold text-stone uppercase tracking-wide px-5 py-3">Atribuído a</th>
                <th className="font-body text-xs font-semibold text-stone uppercase tracking-wide px-5 py-3">Setor</th>
                <th className="font-body text-xs font-semibold text-stone uppercase tracking-wide px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {CHAMADOS.map((c) => {
                const meta = STATUS_META[c.status] ?? STATUS_META.aberto;
                return (
                  <tr key={c.id} className="border-b border-stone/10 last:border-0 hover:bg-cream/30 transition-colors">
                    <td className="px-5 py-4 font-body text-sm text-stone">
                      <span className="flex items-center gap-1.5">
                        #{c.id}
                        {c.urgente && <span className="material-symbols-outlined text-red-500 text-[16px]">warning</span>}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-body text-sm text-charcoal">{c.titulo}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${meta.badge}`}>{meta.label}</span>
                    </td>
                    <td className="px-5 py-4 font-body text-sm text-stone">{c.atribuido ?? "—"}</td>
                    <td className="px-5 py-4 font-body text-sm text-stone">{c.setor}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          disabled={c.status === "finalizada"}
                          className="font-body text-xs font-semibold text-stone border border-stone/20 rounded-full px-3 py-1.5 hover:bg-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Reatribuir
                        </button>
                        <button className="font-body text-xs font-semibold text-red-600 border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors">
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}