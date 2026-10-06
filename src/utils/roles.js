export const ROLES = {
  usuario: {
    label: "Usuário comum",
    homePath: "/chamados",
    nav: [
      { icon: "dashboard", label: "Meus Chamados", path: "/chamados" },
      { icon: "add_box", label: "Novo Chamado", path: "/chamados/novo" },
    ],
  },
  tecnico: {
    label: "Técnico",
    homePath: "/tecnico",
    nav: [
      { icon: "view_kanban", label: "Painel de Chamados", path: "/tecnico" },
      { icon: "task_alt", label: "Finalizados", path: "/tecnico/finalizados" },
    ],
  },
  admin: {
    label: "Administrador (TI)",
    homePath: "/admin/chamados",
    nav: [
      { icon: "admin_panel_settings", label: "Todos os Chamados", path: "/admin/chamados" },
      { icon: "group", label: "Usuários", path: "/admin/usuarios" },
      { icon: "monitoring", label: "Relatórios", path: null },
    ],
  },
};

export function getStoredRole() {
  return localStorage.getItem("userRole");
}

export function setStoredRole(role) {
  localStorage.setItem("userRole", role);
}