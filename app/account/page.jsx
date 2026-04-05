"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Page paramètres du compte.
 * Permet de modifier son email et son mot de passe.
 * Les comptes Google ne peuvent pas changer leur email (géré par Google).
 */
export default function AccountPage() {
  const router = useRouter();
  const { token } = useSelector((state) => state.users);

  const [userInfo, setUserInfo] = useState(null);

  // Formulaire email
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMsg, setEmailMsg] = useState({ type: "", text: "" });

  // Formulaire mot de passe
  const [lastPassword, setLastPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  const getToken = () => token || (typeof window !== "undefined" ? localStorage.getItem("pg_token") : "");

  useEffect(() => {
    const t = getToken();
    if (!t) { router.push("/"); return; }

    fetch(`${BACKEND_URL}/users/me`, {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((r) => r.json())
      .then((data) => { if (data.result) setUserInfo(data); })
      .catch(() => {});
  }, [token]);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailMsg({ type: "", text: "" });
    try {
      const res = await fetch(`${BACKEND_URL}/users/me/email`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ newEmail, password: emailPassword }),
      });
      const data = await res.json();
      if (data.result) {
        setEmailMsg({ type: "success", text: "Email modifié. Reconnectez-vous avec votre nouvel email." });
        setNewEmail(""); setEmailPassword("");
      } else {
        setEmailMsg({ type: "error", text: data.message });
      }
    } catch {
      setEmailMsg({ type: "error", text: "Erreur de connexion au serveur" });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Les mots de passe ne correspondent pas" });
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/users/me/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ lastPassword, newPassword }),
      });
      const data = await res.json();
      if (data.result) {
        setPasswordMsg({ type: "success", text: "Mot de passe modifié avec succès" });
        setLastPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "error", text: data.message });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Erreur de connexion au serveur" });
    }
  };

  const isGoogleAccount = userInfo && !userInfo.email?.includes("@") === false &&
    userInfo.email?.endsWith("gmail.com");

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-10">
      <div className="max-w-lg mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-light text-white tracking-wide">Paramètres du compte</h1>
          {userInfo && (
            <p className="text-slate-400 text-sm mt-1">{userInfo.email}
              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                userInfo.role === "superadmin" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" :
                userInfo.role === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                "bg-slate-600/50 text-slate-300 border border-slate-500/30"
              }`}>
                {userInfo.role === "superadmin" ? "Super Admin" : userInfo.role === "admin" ? "Admin" : "Utilisateur"}
              </span>
            </p>
          )}
        </div>

        {/* Modifier l'email */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-6">
          <h2 className="text-white font-medium mb-1">Adresse email</h2>
          <p className="text-slate-400 text-sm mb-5">
            Modifiez votre adresse de connexion. Votre mot de passe actuel est requis.
          </p>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Nouvel email</label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-400"
                placeholder="nouveau@email.com" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Mot de passe actuel</label>
              <input type="password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-400"
                placeholder="••••••••" />
            </div>
            {emailMsg.text && (
              <p className={`text-sm rounded-lg px-3 py-2 ${
                emailMsg.type === "success"
                  ? "text-green-400 bg-green-500/10 border border-green-500/20"
                  : "text-red-400 bg-red-500/10 border border-red-500/20"
              }`}>{emailMsg.text}</p>
            )}
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              Modifier l'email
            </button>
          </form>
        </div>

        {/* Modifier le mot de passe */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-white font-medium mb-1">Mot de passe</h2>
          <p className="text-slate-400 text-sm mb-5">
            8 caractères minimum, avec majuscule, chiffre et caractère spécial.
          </p>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Mot de passe actuel</label>
              <input type="password" value={lastPassword} onChange={(e) => setLastPassword(e.target.value)} required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-400"
                placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Nouveau mot de passe</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-400"
                placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Confirmer</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-400"
                placeholder="••••••••" />
            </div>
            {passwordMsg.text && (
              <p className={`text-sm rounded-lg px-3 py-2 ${
                passwordMsg.type === "success"
                  ? "text-green-400 bg-green-500/10 border border-green-500/20"
                  : "text-red-400 bg-red-500/10 border border-red-500/20"
              }`}>{passwordMsg.text}</p>
            )}
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              Modifier le mot de passe
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
