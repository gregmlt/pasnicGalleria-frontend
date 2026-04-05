"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { setUser } from "@/reducers/users";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Page de connexion.
 * Deux modes :
 * - Connexion Google (recommandé) — retourne un ID token vérifié côté backend
 * - Connexion email/mot de passe (comptes classiques)
 * Redirige vers /search si une session est déjà active.
 */
export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.users.token);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) router.push("/search");
  }, []);

  const handleAuthSuccess = (token, role) => {
    localStorage.setItem("pg_token", token);
    localStorage.setItem("pg_role", role);
    dispatch(setUser({ token, role }));
    router.push("/search");
  };

  // Connexion Google — envoie l'ID token au backend pour vérification
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/users/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.result) {
        handleAuthSuccess(data.token, data.role);
      } else {
        setError(data.message || "Connexion Google refusée");
      }
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  // Connexion email / mot de passe
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleEmailLogin();
  };

  const handleEmailLogin = async () => {
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
        handleAuthSuccess(data.token, data.role);
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

        <div className="text-center mb-10">
          <h1 className="text-4xl font-light text-white tracking-[0.2em] uppercase mb-2">
            Pasnic
          </h1>
          <p className="text-slate-400 text-sm tracking-widest uppercase">
            Galleria
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-xl font-light mb-8 text-center">
            Connexion
          </h2>

          {/* Bouton Google */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("La connexion Google a échoué")}
              theme="filled_blue"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="368"
              locale="fr"
            />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

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

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              onClick={handleEmailLogin}
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
