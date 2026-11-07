// Abas do topo das telas do admin (Todos os Chamados / Usuários).
// Usado em /todoschamados e /usuarios. Abas sem path ainda não existem e ficam desabilitadas.

import { useLocation, useNavigate } from 'react-router-dom';

const ABAS = [
  { key: 'chamados', label: 'Todos os chamados', icon: 'list_alt', path: '/todoschamados' },
  { key: 'usuarios', label: 'Usuários', icon: 'group', path: '/usuarios' },
  { key: 'tipos-locais', label: 'Tipos & locais', icon: 'sell', path: null },
  { key: 'setores', label: 'Setores', icon: 'apartment', path: null },
  { key: 'sla', label: 'SLA', icon: 'timer', path: null },
  { key: 'relatorios', label: 'Relatórios', icon: 'bar_chart', path: null },
];

export default function AbasAdmin() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 flex-wrap">
      {ABAS.map((aba) => {
        const ativa = aba.path === location.pathname;
        return (
          <button
            key={aba.key}
            disabled={!aba.path}
            title={aba.path ? aba.label : 'Em breve'}
            onClick={() => aba.path && navigate(aba.path)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-body text-sm transition-colors ${
              ativa
                ? 'bg-[#F39400] text-[#241F1A] font-semibold'
                : aba.path
                ? 'bg-[#1C1814] text-white/60 border border-white/10 hover:bg-white/5 cursor-pointer'
                : 'bg-transparent text-white/25 border border-white/5 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{aba.icon}</span>
            {aba.label}
          </button>
        );
      })}
    </div>
  );
}
