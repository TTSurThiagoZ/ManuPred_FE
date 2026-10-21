import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { key: "usuarios", label: "Usuários", icon: "group", path: "/admin/usuarios" },
  { key: "chamados", label: "Todos os chamados", icon: "list_alt", path: "/admin/chamados" },
  { key: "tipos-locais", label: "Tipos & locais", icon: "sell", path: null },
  { key: "setores", label: "Setores", icon: "apartment", path: null },
  { key: "sla", label: "SLA", icon: "timer", path: null },
  { key: "relatorios", label: "Relatórios", icon: "bar_chart", path: null },
  { key: "auditoria", label: "Auditoria", icon: "policy", path: null },
];

export default function AdminTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 flex-wrap">
      {TABS.map((tab) => {
        const active = tab.path === location.pathname;
        return (
          <button
            key={tab.key}
            disabled={!tab.path}
            onClick={() => tab.path && navigate(tab.path)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-body text-sm transition-colors ${
              active
                ? "bg-charcoal text-white"
                : tab.path
                ? "bg-white text-stone border border-stone/15 hover:bg-cream"
                : "bg-white/50 text-stone/40 border border-stone/10 cursor-not-allowed"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}