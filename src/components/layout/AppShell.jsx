import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { icon: "dashboard", label: "Meus Chamados", path: "/home" },
  { icon: "add_box", label: "Novo Chamado", path: "/chamados/novo" },
  { divider: true },
  { icon: "engineering", label: "Dashboard Técnico", path: null },
  { icon: "view_kanban", label: "Kanban", path: null },
  { icon: "task_alt", label: "Concluídos", path: null },
  { divider: true },
  { icon: "admin_panel_settings", label: "Dashboard Admin", path: null },
  { icon: "group", label: "Usuários", path: null },
  { icon: "monitoring", label: "Relatórios", path: null },
];

export default function AppShell({ children, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body text-on-surface">
      <aside className="fixed left-0 top-0 h-full w-20 bg-surface-container-lowest border-r border-outline-variant z-50 flex flex-col items-center py-6">
        <nav className="flex flex-col gap-4 w-full px-2">
          {NAV_ITEMS.map((item, i) =>
            item.divider ? (
              <div key={i} className="h-px w-8 bg-outline-variant mx-auto my-2" />
            ) : (
              <button
                key={item.label}
                title={item.label}
                disabled={!item.path}
                onClick={() => item.path && navigate(item.path)}
                className={`flex items-center justify-center w-full py-4 rounded-lg transition-all ${
                  item.path === location.pathname
                    ? "bg-primary-container text-on-primary-container shadow-[4px_4px_0px_#775a19]"
                    : item.path
                    ? "text-on-surface-variant hover:bg-surface-container cursor-pointer"
                    : "text-on-surface-variant/30 cursor-not-allowed"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
              </button>
            )
          )}
        </nav>
      </aside>

      <div className="pl-20">
        <header className="fixed top-0 left-20 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-primary/20 z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <img src="/kipper-logo.svg" alt="Kipper" className="h-8 w-8" />
            <div className="h-6 w-px bg-primary/20" />
            <span className="font-display text-lg font-semibold tracking-tight text-on-surface uppercase">
              Gestão de Manutenção
            </span>
          </div>

          <div className="flex items-center gap-6 relative">
            <div className="text-right hidden sm:block">
              <p className="font-mono text-[10px] text-on-surface-variant">SESSÃO ATIVA</p>
              <p className="font-body text-sm font-semibold text-primary">Ana Souza</p>
            </div>

            <button
              onClick={() => setShowMenu((v) => !v)}
              title="Minha conta"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[2px_2px_0px_#30312e] cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </button>

            {showMenu && (
              <div className="absolute top-11 right-0 w-48 bg-surface-container-lowest border border-outline-variant shadow-lg z-50">
                <div className="px-4 py-3 border-b border-outline-variant">
                  <p className="font-body text-sm font-semibold text-on-surface">Ana Souza</p>
                  <p className="font-mono text-[10px] text-on-surface-variant">Usuário comum</p>
                </div>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-3 font-body text-sm text-error hover:bg-error-container/30 transition-colors"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="relative pt-16 min-h-screen">{children}</main>
      </div>
    </div>
  );
}