"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/reducers/users";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Page de connexion.
 * - Redirige automatiquement vers /search si un token est déjà présent (session active)
 * - Après connexion : sauvegarde token + rôle dans Redux et localStorage
 */
export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.users.token);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirection si déjà connecté
  useEffect(() => {
    if (token) router.push("/search");
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleClick();
  };

  const handleClick = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/users/get/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.result) {
        // Persistance de la session pour survie au refresh
        localStorage.setItem("pg_token", data.token);
        localStorage.setItem("pg_role", data.role);
        dispatch(setUser({ token: data.token, role: data.role }));
        router.push("/search");
      } else {
        setError(data.message || "Identifiants incorrects");
      }
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">

        {/* En-tête */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light text-white tracking-[0.2em] uppercase mb-2">
            Pasnic
          </h1>
          <p className="text-slate-400 text-sm tracking-widest uppercase">
            Galleria
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-xl font-light mb-8 text-center">
            Connexion
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="votre@email.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              onClick={handleClick}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors duration-200 tracking-wide"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
