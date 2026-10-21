import { useEffect, useState } from "react";
import AppShell from "../layout/AppShell";
import AdminTabs from "./AdminTabs";
import { getAllUsers, deleteUser } from "../../services/userService";

export default function AdminUsuarios({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    setError(null);
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remover o usuário "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(`Não foi possível remover: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell onLogout={onLogout} userName="Fernanda Costa" userRole="Administradora">
      <div className="flex flex-col w-full px-8 md:px-16 py-12 gap-8 max-w-6xl mx-auto">
        <div>
          <h1 className="font-serif text-4xl text-charcoal mb-2">Usuários</h1>
          <p className="font-body text-sm text-stone">Contas cadastradas no sistema.</p>
        </div>

        <AdminTabs />

        {loading && (
          <div className="bg-white rounded-2xl border border-stone/10 p-12 text-center">
            <p className="font-body text-sm text-stone">Carregando usuários...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600 text-[18px] mt-0.5">error</span>
            <div>
              <p className="font-body text-sm text-red-800 font-semibold mb-1">Não foi possível carregar os usuários</p>
              <p className="font-body text-xs text-red-700 mb-3">{error}</p>
              <button
                onClick={loadUsers}
                className="font-body text-xs font-semibold text-red-700 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-100 transition-colors"
              >
                Tentar de novo
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-2xl border border-stone/10 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone/10 bg-cream/40">
                  <th className="font-body text-xs font-semibold text-stone uppercase tracking-wide px-5 py-3">Nome</th>
                  <th className="font-body text-xs font-semibold text-stone uppercase tracking-wide px-5 py-3">E-mail</th>
                  <th className="font-body text-xs font-semibold text-stone uppercase tracking-wide px-5 py-3">Cadastrado em</th>
                  <th className="font-body text-xs font-semibold text-stone uppercase tracking-wide px-5 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-stone/10 last:border-0 hover:bg-cream/30 transition-colors">
                    <td className="px-5 py-4 font-body text-sm text-charcoal font-medium">{u.name}</td>
                    <td className="px-5 py-4 font-body text-sm text-stone">{u.email}</td>
                    <td className="px-5 py-4 font-body text-sm text-stone">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        disabled={deletingId === u.id}
                        className="font-body text-xs font-semibold text-red-600 border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        {deletingId === u.id ? "Removendo..." : "Remover"}
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center font-body text-sm text-stone">
                      Nenhum usuário cadastrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}