"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const STATUT_OPTIONS = ["À Vendre", "A garder", "A jeter", "Trop beau"];

export default function NewArticle() {
  const router = useRouter();
  const token = useSelector((state) => state.users.token) || (typeof window !== "undefined" ? localStorage.getItem("pg_token") : "");
  const role = useSelector((state) => state.users.role) || (typeof window !== "undefined" ? localStorage.getItem("pg_role") : "");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [artiste, setArtiste] = useState("");
  const [titre, setTitre] = useState("");
  const [dimension, setDimension] = useState("");
  const [statut, setStatut] = useState("");
  const [edition, setEdition] = useState("");
  const [prix, setPrix] = useState("");
  const [notes, setNotes] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) router.push("/");
    else if (role && !["admin", "superadmin"].includes(role)) router.push("/search");
  }, [token, role]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!artiste.trim()) {
      setError("Le nom de l'artiste est obligatoire");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("artiste", artiste.trim());
    formData.append("titre", titre.trim());
    formData.append("dimension", dimension.trim());
    formData.append("statut", statut);
    formData.append("edition", edition.trim());
    formData.append("prix", prix.trim());
    formData.append("notes", notes.trim());
    if (year) formData.append("year", year);

    try {
      const response = await fetch(`${BACKEND_URL}/articles/post/newarticle/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (result.result) {
        setSuccess(true);
        setTimeout(() => router.push("/search"), 1500);
      } else {
        setError(result.message || "Erreur lors de l'enregistrement");
      }
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center max-w-sm">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-7 h-7 text-emerald-600"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-slate-900 font-semibold text-lg">
            Oeuvre enregistrée !
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Redirection vers la collection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* En-tête */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm transition-colors duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                clipRule="evenodd"
              />
            </svg>
            Retour
          </button>
          <h1 className="text-slate-900 font-semibold">Ajouter une oeuvre</h1>
        </div>
      </div>

      {/* Formulaire */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Upload image */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Image
            </label>
            <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white rounded-2xl cursor-pointer transition-colors duration-200 overflow-hidden min-h-[200px]">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-64 object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 py-10 text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <p className="text-sm font-medium">Cliquer pour ajouter une photo</p>
                  <p className="text-xs">PNG, JPG, JPEG</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {imagePreview && (
              <button
                onClick={() => { setImage(null); setImagePreview(null); }}
                className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Supprimer l'image
              </button>
            )}
          </div>

          {/* Artiste */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Artiste <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={artiste}
              onChange={(e) => setArtiste(e.target.value)}
              placeholder="Nom de l'artiste"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
            />
          </div>

          {/* Titre */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Titre
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre de l'oeuvre"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Statut
            </label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
            >
              <option value="">— Choisir —</option>
              {STATUT_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Edition */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Edition
            </label>
            <input
              type="text"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
              placeholder="Original, Multiple..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
            />
          </div>

          {/* Dimension */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Dimension
            </label>
            <input
              type="text"
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              placeholder="ex: 120 x 80"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
            />
          </div>

          {/* Année */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Année
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="ex: 2020"
              min="1800"
              max={new Date().getFullYear()}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
            />
          </div>

          {/* Prix */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Prix (€)
            </label>
            <input
              type="text"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              placeholder="ex: 1500"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Notes
              <span className="normal-case font-normal text-slate-300 ml-2">
                ({notes.length}/500)
              </span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => {
                if (e.target.value.length <= 500) setNotes(e.target.value);
              }}
              rows={3}
              placeholder="Commentaires, provenance, état..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Bouton submit */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.push("/search")}
            className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors duration-150"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-colors duration-200 shadow-sm"
          >
            {loading ? "Enregistrement..." : "Enregistrer l'oeuvre"}
          </button>
        </div>
      </div>
    </div>
  );
}
