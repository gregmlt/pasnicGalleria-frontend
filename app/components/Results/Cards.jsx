import React from "react";
import { useRouter } from "next/navigation";

/** Styles Tailwind associés à chaque valeur de statut */
const STATUS_STYLES = {
  "À Vendre": "bg-emerald-100 text-emerald-700",
  "A garder": "bg-blue-100 text-blue-700",
  "A jeter":  "bg-red-100 text-red-700",
  "Trop beau":"bg-purple-100 text-purple-700",
};

/**
 * Carte d'une oeuvre en vue grille.
 *
 * Comportement au clic :
 * - Si selectionMode est actif → sélectionne/désélectionne
 * - Sinon → navigue vers la page de détail
 *
 * @param {object}   oeuvre        - Document oeuvre (depuis l'API)
 * @param {boolean}  selected      - Si true, la carte est mise en surbrillance
 * @param {function} onSelect      - Callback appelé avec l'_id MongoDB
 * @param {boolean}  selectionMode - Indique si une sélection multiple est en cours
 */
export default function Cards({ oeuvre, selected, onSelect, selectionMode }) {
  const router = useRouter();
  const { ID, _id, artiste, titre, dimension, statut, prix, image, year } = oeuvre;

  // Utilise l'ID lisible en priorité, l'ObjectId MongoDB en fallback
  // (pour les anciennes oeuvres sans ID généré)
  const routeId = ID || _id;
  const artisteNom = artiste?.nom || "—";
  const statusStyle = STATUS_STYLES[statut] || "bg-slate-100 text-slate-600";

  const handleClick = () => {
    if (selectionMode) {
      onSelect(_id);
    } else {
      router.push(`/search/${routeId}`);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm hover:shadow-md border overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 flex flex-col relative ${
        selected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-100"
      }`}
      onClick={handleClick}
    >
      {/* Bouton de sélection — visible au hover ou si déjà sélectionné */}
      <div
        className={`absolute top-2 left-2 z-10 transition-opacity duration-150 ${
          selectionMode || selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => { e.stopPropagation(); onSelect?.(_id); }}
      >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected ? "bg-blue-500 border-blue-500" : "bg-white/80 border-slate-300"
        }`}>
          {selected && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-white">
              <path fillRule="evenodd" d="M10.22 2.97a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 0 1 1.06-1.06L4.25 7.94l4.97-4.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd"/>
            </svg>
          )}
        </div>
      </div>

      {/* Image de l'oeuvre */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden group">
        {image ? (
          <img src={image} alt={titre} className="w-full h-full object-cover" />
        ) : (
          // Placeholder si pas d'image
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.83.83a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd"/>
            </svg>
          </div>
        )}
        {/* Badge statut */}
        {statut && (
          <span className={`absolute top-2 right-2 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle}`}>
            {statut}
          </span>
        )}
      </div>

      {/* Informations textuelles */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-slate-900 font-semibold text-sm truncate capitalize">
              {titre || "Sans titre"}
            </p>
            <p className="text-slate-500 text-xs capitalize mt-0.5">
              {artisteNom}{year ? `, ${year}` : ""}
            </p>
          </div>
          {/* ID en monospace discret */}
          <span className="text-xs text-slate-400 font-mono whitespace-nowrap">{ID}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{dimension || "—"}</span>
          {prix && <span className="font-medium text-slate-600">{prix} €</span>}
        </div>
      </div>
    </div>
  );
}
