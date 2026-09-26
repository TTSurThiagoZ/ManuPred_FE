import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { goToNovoChamado } from "../../utils/navigation";

const NAV_ITEMS = [
  { icon: "dashboard", label: "Meus Chamados", path: "/chamados" },
  { icon: "add_box", label: "Novo Chamado", path: "/chamados/novo" },
  { divider: true },
  { icon: "engineering", label: "Dashboard Técnico", path: null },
  { icon: "view_kanban", label: "Kanban", path: null },
  { icon: "task_alt", label: "Concluídos", path: null },
  { divider: true },
  { icon: "admin_panel_settings", label: "Dashboard Admin", path: "/admin/chamados" },
  { icon: "group", label: "Usuários", path: "/admin/usuarios" },
  { icon: "monitoring", label: "Relatórios", path: null },
];

export default function AppShell({ children, onLogout, userName = "Ana Souza", userRole = "Usuário comum" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleNavClick = (path) => {
    if (!path) return;
    if (path === "/chamados/novo") {
      goToNovoChamado(navigate);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-body text-charcoal">
      <aside className="fixed left-0 top-0 h-full w-20 bg-white border-r border-stone/15 z-50 flex flex-col items-center py-6">
        <img src="/kipper-logo.svg" alt="Kipper" className="w-8 h-8 mb-6" />
        <nav className="flex flex-col gap-3 w-full px-3">
          {NAV_ITEMS.map((item, i) =>
            item.divider ? (
              <div key={i} className="h-px w-8 bg-stone/15 mx-auto my-2" />
            ) : (
              <button
                key={item.label}
                title={item.label}
                disabled={!item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center justify-center w-full py-3 rounded-2xl transition-all ${
                  item.path === location.pathname
                    ? "bg-amber-600 text-white shadow-md"
                    : item.path
                    ? "text-stone hover:bg-cream cursor-pointer"
                    : "text-stone/30 cursor-not-allowed"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </button>
            )
          )}
        </nav>
      </aside>

      <div className="pl-20">
        <header className="fixed top-0 left-20 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-stone/15 z-40 flex items-center justify-between px-8">
          <span className="font-serif text-lg text-charcoal">Gestão de Manutenção</span>

          <div className="flex items-center gap-4 relative">
            <div className="text-right hidden sm:block">
              <p className="font-body text-sm font-semibold text-charcoal">{userName}</p>
              <p className="font-body text-xs text-stone">{userRole}</p>
            </div>

            <button
              onClick={() => setShowMenu((v) => !v)}
              title="Minha conta"
              className="w-9 h-9 rounded-full bg-linear-to-br from-amber-500 to-amber-800 flex items-center justify-center shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </button>

            {showMenu && (
              <div className="absolute top-12 right-0 w-48 bg-white rounded-2xl border border-stone/15 shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone/10">
                  <p className="font-body text-sm font-semibold text-charcoal">{userName}</p>
                  <p className="font-body text-xs text-stone">{userRole}</p>
                </div>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-3 font-body text-sm text-red-600 hover:bg-red-50 transition-colors"
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