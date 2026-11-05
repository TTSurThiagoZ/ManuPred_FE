// Layout das telas internas: menu lateral com os itens da role + topo com o nome do usuário e "Sair".
// Usado por todas as telas depois do login.

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/user';
import { getPerfil } from '../../utils/perfis';
import { iniciais } from '../../utils/chamados';
import { ativarNotificacoes } from '../../firebase';

// Para pedir a permissão de notificação só uma vez por carregamento do site
let notificacoesAtivadas = false;

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [showMenu, setShowMenu] = useState(false);

  const perfil = getPerfil(user?.role);

  // Depois do login, ativa as notificações push do Firebase
  useEffect(() => {
    if (!user || notificacoesAtivadas) return;
    notificacoesAtivadas = true;
    ativarNotificacoes();
  }, [user]);

  const handleSair = () => {
    setShowMenu(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#241F1A] font-body text-white/80">
      {/* Menu lateral */}
      <aside className="fixed left-0 top-0 h-full w-20 bg-[#1C1814] border-r border-white/10 z-50 flex flex-col items-center py-6">
        <img src="/kipper-logo.svg" alt="Kipper" className="w-9 h-9 mb-8" />

        <nav className="flex flex-col gap-3 w-full px-3">
          {perfil.menu.map((item) => (
            <button
              key={item.label}
              title={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-center w-full py-3 rounded-2xl transition-all cursor-pointer ${
                item.path === location.pathname
                  ? 'bg-[#F39400] text-[#241F1A] shadow-md shadow-[#F39400]/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleSair}
          title="Sair"
          className="mt-auto flex items-center justify-center w-12 py-3 rounded-2xl text-white/40 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </aside>

      <div className="pl-20">
        {/* Topo */}
        <header className="fixed top-0 left-20 right-0 h-16 bg-[#1C1814]/90 backdrop-blur-md border-b border-white/10 z-40 flex items-center justify-between px-8">
          <span className="font-serif text-lg text-white">Gestão de Manutenção</span>

          <div className="flex items-center gap-4 relative">
            <div className="text-right hidden sm:block">
              <p className="font-body text-sm font-semibold text-white">{user?.nome ?? 'Usuário'}</p>
              <p className="font-body text-xs text-white/50">{perfil.label}</p>
            </div>

            <button
              onClick={() => setShowMenu((v) => !v)}
              title="Minha conta"
              className="w-9 h-9 rounded-full bg-linear-to-br from-[#F39400] to-[#843B0F] flex items-center justify-center shadow-sm cursor-pointer font-body text-xs font-bold text-white"
            >
              {iniciais(user?.nome)}
            </button>

            {showMenu && (
              <div className="absolute top-12 right-0 w-56 bg-[#1C1814] rounded-2xl border border-white/10 shadow-xl shadow-black/40 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="font-body text-sm font-semibold text-white">{user?.nome}</p>
                  <p className="font-body text-xs text-white/50 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleSair}
                  className="w-full text-left px-4 py-3 font-body text-sm text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
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
