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
 * Ligne d'une oeuvre dans le tableau (vue liste).
 * La checkbox stoppe la propagation du clic pour ne pas naviguer lors d'une sélection.
 * Certaines colonnes sont masquées sur petit écran (hidden md: / hidden lg:).
 *
 * @param {object}   oeuvre   - Document oeuvre (depuis l'API)
 * @param {boolean}  selected - Si true, la ligne est mise en surbrillance
 * @param {function} onSelect - Callback appelé avec l'_id MongoDB
 */
export default function ListElement({ oeuvre, selected, onSelect }) {
  const router = useRouter();
  const { ID, _id, artiste, titre, dimension, statut, edition, prix, image, year } = oeuvre;

  // Fallback sur l'ObjectId pour les oeuvres sans ID généré
  const routeId = ID || _id;
  const artisteNom = artiste?.nom || "—";
  const statusStyle = STATUS_STYLES[statut] || "bg-slate-100 text-slate-600";

  return (
    <tr
      className={`border-b border-slate-100 cursor-pointer transition-colors duration-150 group ${
        selected ? "bg-blue-50 hover:bg-blue-50" : "hover:bg-slate-50"
      }`}
      onClick={() => router.push(`/search/${routeId}`)}
    >
      {/* Checkbox de sélection — clic indépendant de la navigation */}
      <td
        className="py-3 pl-4 pr-2 w-8"
        onClick={(e) => { e.stopPropagation(); onSelect?.(_id); }}
      >
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          selected ? "bg-blue-500 border-blue-500" : "border-slate-300 group-hover:border-slate-400"
        }`}>
          {selected && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="currentColor" className="w-2.5 h-2.5 text-white">
              <path fillRule="evenodd" d="M10.22 2.97a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 0 1 1.06-1.06L4.25 7.94l4.97-4.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd"/>
            </svg>
          )}
        </div>
      </td>

      {/* Miniature image */}
      <td className="py-3 pl-0 pr-3 w-14">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
          {image ? (
            <img src={image} alt={titre} className="w-full h-full object-cover" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-300">
              <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.83.83a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd"/>
            </svg>
          )}
        </div>
      </td>

      {/* ID */}
      <td className="py-3 px-3 text-xs font-mono text-slate-400 whitespace-nowrap">{ID}</td>

      {/* Titre + Artiste */}
      <td className="py-3 px-3 min-w-0">
        <p className="text-sm font-medium text-slate-800 capitalize truncate">{titre || "Sans titre"}</p>
        <p className="text-xs text-slate-400 capitalize mt-0.5">
          {artisteNom}{year ? `, ${year}` : ""}
        </p>
      </td>

      {/* Dimension — masquée sur mobile */}
      <td className="py-3 px-3 text-sm text-slate-500 whitespace-nowrap hidden md:table-cell">
        {dimension || "—"}
      </td>

      {/* Statut — masqué sur très petit écran */}
      <td className="py-3 px-3 hidden sm:table-cell">
        {statut && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyle}`}>
            {statut}
          </span>
        )}
      </td>

      {/* Edition — masquée sur écran moyen */}
      <td className="py-3 px-3 text-sm text-slate-500 hidden lg:table-cell capitalize">{edition || "—"}</td>

      {/* Prix */}
      <td className="py-3 px-3 pr-4 text-sm font-medium text-slate-700 whitespace-nowrap text-right">
        {prix ? `${prix} €` : "—"}
      </td>
    </tr>
  );
}
