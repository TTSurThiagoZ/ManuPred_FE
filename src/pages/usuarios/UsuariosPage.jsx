// Usuários — rota: /usuarios (ADMIN_ROLE)
// Lista as contas cadastradas na API e permite remover (menos a própria conta).

import { useEffect, useState } from "react";

import Layout from "../../shared/components/Layout";
import AbasAdmin from "../../shared/components/AbasAdmin";
import { useUserStore } from "../../store/user";
import { userService } from "../../shared/services/userService";
import { getPerfil } from "../../utils/perfis";
import { formatarData, iniciais } from "../../utils/chamados";

const thClass = "font-body text-xs font-semibold text-white/50 uppercase tracking-wide px-5 py-3";

export default function UsuariosPage() {
  const me = useUserStore((state) => state.user); // Admin logado
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acaoErro, setAcaoErro] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      setUsers(await userService.findAll());
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setError(err.response?.data?.message || err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remover o usuário "${name}"?`)) return;
    setAcaoErro("");
    setDeletingId(id);
    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Erro ao remover usuário:", err);
      setAcaoErro(`Não foi possível remover: ${err.response?.data?.message || err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col w-full px-8 md:px-16 py-12 gap-8 max-w-6xl mx-auto">
        <div>
          <h1 className="font-serif text-4xl text-white mb-2">Usuários</h1>
          <p className="font-body text-sm text-white/50">Contas cadastradas no sistema.</p>
        </div>

        <AbasAdmin />

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-400/20 rounded-2xl px-5 py-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-red-300 text-[18px] mt-0.5">error</span>
            <div>
              <p className="font-body text-sm text-red-200 font-semibold mb-1">Não foi possível carregar os usuários</p>
              <p className="font-body text-xs text-red-300/80 mb-3">{error}</p>
              <button
                onClick={loadUsers}
                className="font-body text-xs font-semibold text-red-200 border border-red-400/30 rounded-full px-3 py-1.5 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                Tentar de novo
              </button>
            </div>
          </div>
        )}

        {acaoErro && (
          <div className="p-4 bg-red-500/10 border border-red-400/20 text-red-300 rounded-2xl text-sm font-body">
            {acaoErro}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-[#1C1814] rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className={thClass}>Nome</th>
                  <th className={thClass}>E-mail</th>
                  <th className={thClass}>Perfil</th>
                  <th className={thClass}>Cadastrado em</th>
                  <th className={thClass}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const nome = u.nome ?? u.name;
                  const souEu = u.id === me?.id;
                  return (
                    <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-body text-[11px] font-bold text-white/70">
                            {iniciais(nome)}
                          </span>
                          <span className="font-body text-sm text-white font-medium">
                            {nome} {souEu && <span className="text-xs text-white/40">(você)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-body text-sm text-white/60">{u.email}</td>
                      <td className="px-5 py-4 font-body text-sm text-white/60">{u.role ? getPerfil(u.role).label : "—"}</td>
                      <td className="px-5 py-4 font-body text-sm text-white/60">{formatarData(u.createdAt)}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(u.id, nome)}
                          disabled={souEu || deletingId === u.id}
                          title={souEu ? "Você não pode remover a própria conta" : "Remover"}
                          className="font-body text-xs font-semibold text-red-300 border border-red-400/25 rounded-full px-3 py-1.5 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {deletingId === u.id ? "Removendo..." : "Remover"}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center font-body text-sm text-white/50">
                      Nenhum usuário cadastrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
