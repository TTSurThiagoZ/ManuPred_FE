// Perfis de acesso (roles vindas do /api/v1/users/me): nome, tela inicial e menu lateral de cada um.
// Usado pelo Layout (menu), pela RotaProtegida e pelas telas de login/splash.

export const USUARIO = "USER_ROLE";
export const TECNICO = "TECNICO_ROLE";
export const ADMIN = "ADMIN_ROLE";

export const PERFIS = {
  [USUARIO]: {
    label: "Usuário",
    telaInicial: "/chamados",
    menu: [
      { icon: "dashboard", label: "Meus Chamados", path: "/chamados" },
      { icon: "add_box", label: "Novo Chamado", path: "/chamados/novo" },
    ],
  },
  [TECNICO]: {
    label: "Técnico",
    telaInicial: "/painel",
    menu: [
      { icon: "view_kanban", label: "Painel de Chamados", path: "/painel" },
      { icon: "task_alt", label: "Finalizados", path: "/finalizados" },
    ],
  },
  [ADMIN]: {
    label: "Administrador",
    telaInicial: "/todoschamados",
    menu: [
      { icon: "admin_panel_settings", label: "Todos os Chamados", path: "/todoschamados" },
      { icon: "group", label: "Usuários", path: "/usuarios" },
      { icon: "add_box", label: "Novo Chamado", path: "/chamados/novo" },
    ],
  },
};

// Se a role vier vazia ou desconhecida, trata como usuário comum
export function getPerfil(role) {
  return PERFIS[role] ?? PERFIS[USUARIO];
}
