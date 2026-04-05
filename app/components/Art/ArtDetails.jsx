"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/** Valeurs possibles pour le champ statut */
const STATUT_OPTIONS = ["À Vendre", "A garder", "A jeter", "Trop beau"];

/** Styles Tailwind du badge de statut */
const STATUS_STYLES = {
  "À Vendre": "bg-emerald-100 text-emerald-700",
  "A garder": "bg-blue-100 text-blue-700",
  "A jeter":  "bg-red-100 text-red-700",
  "Trop beau":"bg-purple-100 text-purple-700",
};

/**
 * Page de détail d'une oeuvre.
 *
 * Fonctionnalités :
 * - Affichage de l'image en grand format
 * - Mode édition inline (admin uniquement) avec mise à jour via API
 * - Remplacement d'image avec prévisualisation
 * - Suppression avec modale de confirmation (admin uniquement)
 *
 * @param {string} ID - ID de l'oeuvre (lisible ou ObjectId MongoDB)
 */
export default function ArtDetails({ ID }) {
  const router = useRouter();

  // Lecture token/role depuis Redux avec fallback localStorage (après refresh)
  const token = useSelector((s) => s.users.token) || localStorage.getItem("pg_token");
  const role  = useSelector((s) => s.users.role)  || localStorage.getItem("pg_role");

  const [oeuvre, setOeuvre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // État du mode édition
  const [editable, setEditable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newImage, setNewImage] = useState(null);       // Fichier image à uploader
  const [imagePreview, setImagePreview] = useState(null); // URL temporaire pour la prévisualisation

  // État de la suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Valeurs du formulaire d'édition (séparées de l'oeuvre pour permettre l'annulation)
  const [form, setForm] = useState({
    titre: "", edition: "", dimension: "", prix: "", notes: "", statut: "", year: "",
  });

  // Chargement initial de l'oeuvre
  useEffect(() => {
    if (!token) { router.push("/"); return; }

    fetch(`${BACKEND_URL}/articles/get/${ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.result) {
          setOeuvre(data.oeuvre);
          // Pré-remplir le formulaire avec les valeurs actuelles
          setForm({
            titre:     data.oeuvre.titre     || "",
            edition:   data.oeuvre.edition   || "",
            dimension: data.oeuvre.dimension || "",
            prix:      data.oeuvre.prix      || "",
            notes:     data.oeuvre.notes     || "",
            statut:    data.oeuvre.statut    || "",
            year:      data.oeuvre.year?.toString() || "",
          });
        } else {
          setError("Oeuvre introuvable");
        }
      })
      .catch(() => setError("Erreur de connexion"))
      .finally(() => setLoading(false));
  }, [ID, token]);

  // Prévisualisation locale de la nouvelle image avant upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Envoi des modifications au backend
  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (newImage) formData.append("image", newImage);

      const res = await fetch(`${BACKEND_URL}/articles/put/${ID}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (data.result) {
        setOeuvre(data.oeuvre);
        setEditable(false);
        setNewImage(null);
        setImagePreview(null);
      } else {
        alert("Erreur lors de la sauvegarde");
      }
    } catch {
      alert("Erreur de connexion");
    } finally {
      setSaving(false);
    }
  };

  // Suppression de l'oeuvre puis retour à la collection
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/articles/delete/${ID}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.result) {
        router.push("/search");
      } else {
        alert("Erreur lors de la suppression");
        setShowDeleteConfirm(false);
      }
    } catch {
      alert("Erreur de connexion");
    } finally {
      setDeleting(false);
    }
  };

  // Annule l'édition et restaure les valeurs d'origine
  const handleCancel = () => {
    setEditable(false);
    setNewImage(null);
    setImagePreview(null);
    if (oeuvre) {
      setForm({
        titre: oeuvre.titre || "", edition: oeuvre.edition || "",
        dimension: oeuvre.dimension || "", prix: oeuvre.prix || "",
        notes: oeuvre.notes || "", statut: oeuvre.statut || "",
        year: oeuvre.year?.toString() || "",
      });
    }
  };

  // --- Rendu conditionnel ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-sm">Chargement...</p>
      </div>
    );
  }

  if (error || !oeuvre) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-red-500 font-medium mb-4">{error || "Oeuvre introuvable"}</p>
        <button onClick={() => router.push("/search")} className="text-blue-500 hover:underline text-sm">
          Retour à la collection
        </button>
      </div>
    );
  }

  const currentImage = imagePreview || oeuvre.image;
  const statusStyle = STATUS_STYLES[oeuvre.statut] || "bg-slate-100 text-slate-600";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Barre de navigation */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd"/>
            </svg>
            Retour à la collection
          </button>
        </div>
      </div>

      {/* Contenu principal — deux colonnes sur desktop */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ---- Colonne gauche : image ---- */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden aspect-square flex items-center justify-center">
              {currentImage ? (
                <img src={currentImage} alt={oeuvre.titre} className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mb-2">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.83.83a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd"/>
                  </svg>
                  <p className="text-sm">Aucune image</p>
                </div>
              )}
            </div>

            {/* Bouton de remplacement d'image (mode édition) */}
            {editable && (
              <label className="flex items-center gap-3 bg-white border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 cursor-pointer transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
                </svg>
                <span className="text-sm text-slate-500">
                  {newImage ? newImage.name : "Changer l'image..."}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* ---- Colonne droite : informations ---- */}
          <div className="space-y-4">

            {/* En-tête : titre, artiste, bouton édition */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  {editable ? (
                    <input
                      value={form.titre}
                      onChange={(e) => setForm({ ...form, titre: e.target.value })}
                      className="text-2xl font-bold text-slate-900 bg-transparent border-b-2 border-blue-400 focus:outline-none w-full capitalize"
                      placeholder="Titre de l'oeuvre"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-slate-900 capitalize">
                      {oeuvre.titre || "Sans titre"}
                    </h1>
                  )}
                  <p className="text-slate-500 mt-1 capitalize">
                    {oeuvre.artiste?.nom || "Artiste inconnu"}
                    {oeuvre.year ? `, ${oeuvre.year}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {oeuvre.statut && !editable && (
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusStyle}`}>
                      {oeuvre.statut}
                    </span>
                  )}
                  {/* Bouton édition — admins uniquement */}
                  {role === "admin" && !editable && (
                    <button
                      onClick={() => setEditable(true)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150"
                      title="Modifier"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"/>
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                {oeuvre.ID}
              </span>
            </div>

            {/* Champs éditables */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <FieldRow label="Statut"    type="select" options={STATUT_OPTIONS} editable={editable} value={form.statut}    onChange={(v) => setForm({ ...form, statut: v })} />
              <FieldRow label="Dimension" editable={editable} value={form.dimension} onChange={(v) => setForm({ ...form, dimension: v })} placeholder="ex: 120 x 80" />
              <FieldRow label="Edition"   editable={editable} value={form.edition}   onChange={(v) => setForm({ ...form, edition: v })} />
              <FieldRow label="Année"     type="number" editable={editable} value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="ex: 2020" />
              <FieldRow label="Prix"      editable={editable} value={form.prix}      onChange={(v) => setForm({ ...form, prix: v })} suffix="€" />

              {/* Notes : textarea en édition, texte simple sinon */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Notes</p>
                {editable ? (
                  <textarea
                    value={form.notes}
                    onChange={(e) => { if (e.target.value.length <= 500) setForm({ ...form, notes: e.target.value }); }}
                    rows={3} maxLength={500}
                    className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Notes sur l'oeuvre..."
                  />
                ) : (
                  <p className="text-sm text-slate-700">
                    {form.notes || <span className="text-slate-400">—</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Boutons Annuler / Enregistrer (mode édition) */}
            {editable && (
              <div className="flex gap-3">
                <button onClick={handleCancel} disabled={saving}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors disabled:opacity-50">
                  Annuler
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            )}

            {/* Bouton Supprimer — admins uniquement, hors mode édition */}
            {role === "admin" && !editable && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd"/>
                </svg>
                Supprimer cette oeuvre
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modale de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-600">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Supprimer cette oeuvre ?</h3>
                <p className="text-sm text-slate-500 mt-0.5">Cette action est irréversible.</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 mb-5 text-sm text-slate-600">
              <span className="font-medium capitalize">{oeuvre.titre || "Sans titre"}</span>
              {" — "}
              <span className="capitalize">{oeuvre.artiste?.nom}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium">
                Annuler
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-white text-sm font-medium disabled:opacity-50">
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPOSANT INTERNE : ligne de champ éditable
// =============================================================================

/**
 * Affiche un champ sous forme label + valeur en lecture,
 * ou label + input/select en mode édition.
 *
 * @param {string}   label       - Libellé du champ
 * @param {boolean}  editable    - Si true, affiche le contrôle de saisie
 * @param {string}   value       - Valeur courante
 * @param {function} onChange    - Callback de mise à jour
 * @param {string}   type        - "text" | "number" | "select"
 * @param {string[]} options     - Options disponibles pour type="select"
 * @param {string}   suffix      - Suffixe affiché après la valeur (ex: "€")
 * @param {string}   placeholder - Placeholder de l'input
 */
function FieldRow({ label, editable, value, onChange, type = "text", options, suffix, placeholder }) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 flex-shrink-0">
        {label}
      </p>
      {editable ? (
        type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Choisir —</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <div className="flex-1 flex items-center gap-1">
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {suffix && <span className="text-sm text-slate-400">{suffix}</span>}
          </div>
        )
      ) : (
        <p className="text-sm text-slate-700 flex-1">
          {value ? <>{value}{suffix && ` ${suffix}`}</> : <span className="text-slate-400">—</span>}
        </p>
      )}
    </div>
  );
}
