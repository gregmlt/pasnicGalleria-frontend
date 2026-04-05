"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Page de gestion des utilisateurs — réservée aux admins.
 * Permet de :
 * - Voir tous les utilisateurs avec leur rôle
 * - Passer un utilisateur en admin ou le rétrograder en user
 * - Supprimer un compte
 * - Créer un nouveau compte email/mot de passe
 */
export default function UsersAdminPage() {
  const router = useRouter();
  const { token, role } = useSelector((state) => state.users);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Formulaire création de compte
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  // Modal confirmation suppression
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!token) { router.push("/"); return; }
    if (role && role !== "superadmin") { router.push("/search"); return; }
    if (role === "superadmin") fetchUsers();
  }, [token, role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.result) setUsers(data.users);
      else setError(data.message);
    } catch {
      setError("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${BACKEND_URL}/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.result) {
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: data.user.role } : u)));
      } else {
        setError(data.message);
      }
    } catch {
      setError("Erreur lors du changement de rôle");
    }
  };

  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.result) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setDeleteTarget(null);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Erreur lors de la suppression");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    try {
      const res = await fetch(`${BACKEND_URL}/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: newEmail, password: newPassword, role: newRole }),
      });
      const data = await res.json();
      if (data.result) {
        setCreateSuccess(`Compte créé : ${data.email} (${data.role})`);
        setNewEmail(""); setNewPassword(""); setNewRole("user");
        fetchUsers();
      } else {
        setCreateError(data.message);
      }
    } catch {
      setCreateError("Erreur lors de la création du compte");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-light text-white tracking-wide">Gestion des utilisateurs</h1>
            <p className="text-slate-400 text-sm mt-1">Modifiez les rôles et gérez les accès</p>
          </div>
          <button
            onClick={() => setShowCreateForm((v) => !v)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
            </svg>
            Nouveau compte
          </button>
        </div>

        {/* Formulaire création */}
        {showCreateForm && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 mb-6">
            <h2 className="text-white font-medium mb-4">Créer un compte email/mot de passe</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Email</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                    placeholder="email@exemple.com" />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Rôle</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400">
                    <option value="user">Utilisateur (lecture seule)</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Mot de passe</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                  placeholder="8+ car., majuscule, chiffre, caractère spécial" />
              </div>
              {createError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{createError}</p>}
              {createSuccess && <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">{createSuccess}</p>}
              <div className="flex gap-3">
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                  Créer le compte
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-white text-sm px-5 py-2 rounded-lg transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Liste des utilisateurs */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-slate-400 text-center py-12">Aucun utilisateur trouvé</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 text-xs uppercase tracking-wider px-6 py-4">Email</th>
                  <th className="text-left text-slate-400 text-xs uppercase tracking-wider px-6 py-4">Rôle</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-white text-sm">{user.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-slate-600/50 text-slate-300 border border-slate-500/30"
                      }`}>
                        {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.role === "user" ? (
                          <button onClick={() => handleRoleChange(user._id, "admin")}
                            className="text-xs text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400/50 px-3 py-1 rounded-lg transition-colors">
                            Passer admin
                          </button>
                        ) : (
                          <button onClick={() => handleRoleChange(user._id, "user")}
                            className="text-xs text-slate-400 hover:text-slate-300 border border-slate-600 hover:border-slate-500 px-3 py-1 rounded-lg transition-colors">
                            Rétrograder
                          </button>
                        )}
                        <button onClick={() => setDeleteTarget(user)}
                          className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 px-3 py-1 rounded-lg transition-colors">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-slate-600 text-xs text-center mt-6">
          Les comptes créés via Google Sign-In apparaissent ici après leur première connexion.
        </p>
      </div>

      {/* Modal suppression */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-white font-medium mb-2">Supprimer ce compte ?</h3>
            <p className="text-slate-400 text-sm mb-6">
              <span className="text-white">{deleteTarget.email}</span> sera définitivement supprimé.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteTarget._id)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                Supprimer
              </button>
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm py-2.5 rounded-lg transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
