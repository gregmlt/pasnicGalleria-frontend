"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CardsContainer from "../components/Results/CardsContainer";
import ListContainer from "../components/Results/ListContainer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const STATUT_OPTIONS = ["À Vendre", "A garder", "A jeter", "Trop beau"];

export default function Search() {
  const [gridView, setGridView] = useState(false);
  const [query, setQuery] = useState("");
  const [oeuvres, setOeuvres] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sélection multiple
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [bulkStatusTarget, setBulkStatusTarget] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const token = useSelector((state) => state.users.token);
  const role = useSelector((state) => state.users.role);
  const router = useRouter();

  const getToken = () => token || (typeof window !== "undefined" ? localStorage.getItem("pg_token") : "");
  const getRole = () => role || (typeof window !== "undefined" ? localStorage.getItem("pg_role") : "");

  useEffect(() => {
    if (!token) {
      const stored = typeof window !== "undefined" ? localStorage.getItem("pg_token") : null;
      if (!stored) router.push("/");
    }
  }, [token]);

  const fetchOeuvres = () => {
    const t = getToken();
    if (!t) return;
    setLoading(true);
    fetch(`${BACKEND_URL}/articles/get/all`, {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setOeuvres(data.oeuvres);
          setFilteredData(data.oeuvres);
        } else {
          setError("Impossible de charger les oeuvres");
        }
      })
      .catch(() => setError("Erreur de connexion au serveur"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOeuvres(); }, [token]);

  // Recherche live — tous les champs
  useEffect(() => {
    if (!query.trim()) { setFilteredData(oeuvres); return; }
    const q = query.toLowerCase().trim();
    const result = oeuvres.filter((item) => {
      const searchable = [
        item.ID,
        item.titre,
        item.artiste?.nom,
        item.edition,
        item.dimension,
        item.statut,
        item.prix,
        item.notes,
        item.year?.toString(),
      ]
        .filter(Boolean)
        .map((v) => v.toString().toLowerCase());
      return searchable.some((v) => v.includes(q));
    });
    setFilteredData(result);
  }, [query, oeuvres]);

  // --- Sélection ---
  const handleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (filteredData.every((o) => selectedIds.has(o._id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map((o) => o._id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setBulkAction("");
    setBulkStatusTarget("");
  };

  // --- Actions bulk ---
  const handleBulkStatusChange = async () => {
    if (!bulkStatusTarget || selectedIds.size === 0) return;
    setBulkLoading(true);
    const t = getToken();
    try {
      await Promise.all(
        [...selectedIds].map((id) =>
          fetch(`${BACKEND_URL}/articles/put/${id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${t}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ statut: bulkStatusTarget }),
          })
        )
      );
      await fetchOeuvres();
      clearSelection();
    } catch {
      alert("Erreur lors de la mise à jour");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setBulkLoading(true);
    const t = getToken();
    try {
      await Promise.all(
        [...selectedIds].map((id) =>
          fetch(`${BACKEND_URL}/articles/delete/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${t}` },
          })
        )
      );
      await fetchOeuvres();
      clearSelection();
      setShowBulkDeleteConfirm(false);
    } catch {
      alert("Erreur lors de la suppression");
    } finally {
      setBulkLoading(false);
    }
  };

  const selectionMode = selectedIds.size > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barre de recherche */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd"/>
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par artiste, titre, ID, statut..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>

          {/* Toggle vue */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button onClick={() => setGridView(false)} title="Vue liste"
              className={`p-2 rounded-md transition-all duration-200 ${!gridView ? "bg-white shadow text-blue-600" : "text-slate-400 hover:text-slate-600"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd"/>
              </svg>
            </button>
            <button onClick={() => setGridView(true)} title="Vue grille"
              className={`p-2 rounded-md transition-all duration-200 ${gridView ? "bg-white shadow text-blue-600" : "text-slate-400 hover:text-slate-600"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>

          {/* Bouton Ajouter (admin only) */}
          {["admin", "superadmin"].includes(getRole()) && (
            <button
              onClick={() => router.push("/newArticle")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 whitespace-nowrap shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
              </svg>
              <span className="hidden sm:inline">Ajouter une oeuvre</span>
              <span className="sm:hidden">Ajouter</span>
            </button>
          )}
        </div>
      </div>

      {/* Barre d'actions bulk */}
      {selectionMode && ["admin", "superadmin"].includes(getRole()) && (
        <div className="bg-blue-600 text-white px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium">
              {selectedIds.size} sélectionnée{selectedIds.size > 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              {/* Changement de statut */}
              <div className="flex items-center gap-2">
                <select
                  value={bulkStatusTarget}
                  onChange={(e) => setBulkStatusTarget(e.target.value)}
                  className="text-sm bg-blue-500 border border-blue-400 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="">Changer le statut...</option>
                  {STATUT_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {bulkStatusTarget && (
                  <button
                    onClick={handleBulkStatusChange}
                    disabled={bulkLoading}
                    className="text-sm bg-white text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors"
                  >
                    {bulkLoading ? "..." : "Appliquer"}
                  </button>
                )}
              </div>

              {/* Supprimer */}
              <button
                onClick={() => setShowBulkDeleteConfirm(true)}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 text-sm bg-red-500 hover:bg-red-400 px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.712Z" clipRule="evenodd"/>
                </svg>
                Supprimer
              </button>
            </div>

            {/* Désélectionner */}
            <button onClick={clearSelection} className="text-sm text-blue-200 hover:text-white ml-auto transition-colors">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <div className="w-10 h-10 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"/>
            <p className="text-sm">Chargement de la collection...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-red-500 font-medium mb-2">{error}</p>
            <p className="text-slate-400 text-sm">Vérifiez que le serveur est démarré</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-4 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <p className="font-medium">{query ? "Aucun résultat pour cette recherche" : "Aucune oeuvre dans la collection"}</p>
            {query && <button onClick={() => setQuery("")} className="mt-3 text-blue-500 text-sm hover:underline">Effacer la recherche</button>}
          </div>
        ) : (
          <>
            <p className="text-slate-400 text-sm mb-4">
              {filteredData.length} {filteredData.length === 1 ? "oeuvre" : "oeuvres"}
              {query && ` pour "${query}"`}
              {selectionMode && <span className="ml-2 text-blue-500">· {selectedIds.size} sélectionnée{selectedIds.size > 1 ? "s" : ""}</span>}
            </p>
            {gridView ? (
              <CardsContainer
                data={filteredData}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                selectionMode={selectionMode}
              />
            ) : (
              <ListContainer
                data={filteredData}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
              />
            )}
          </>
        )}
      </div>

      {/* Modal confirmation suppression bulk */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-600">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Supprimer {selectedIds.size} oeuvre{selectedIds.size > 1 ? "s" : ""} ?</h3>
                <p className="text-sm text-slate-500 mt-0.5">Cette action est irréversible.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowBulkDeleteConfirm(false)} disabled={bulkLoading}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium">
                Annuler
              </button>
              <button onClick={handleBulkDelete} disabled={bulkLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-white text-sm font-medium disabled:opacity-50">
                {bulkLoading ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
