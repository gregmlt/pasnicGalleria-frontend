import React from "react";
import ListElement from "./ListElement";

/**
 * Tableau complet de la collection en vue liste.
 * Gère la case "tout sélectionner" dans l'en-tête.
 * Les colonnes se masquent progressivement sur mobile (responsive).
 *
 * @param {object[]}  data        - Tableau d'oeuvres à afficher
 * @param {Set}       selectedIds - Set des _id sélectionnés
 * @param {function}  onSelect    - Sélectionne/désélectionne une oeuvre par _id
 * @param {function}  onSelectAll - Bascule sélection totale / désélection totale
 */
export default function ListContainer({ data, selectedIds, onSelect, onSelectAll }) {
  const allSelected = data.length > 0 && data.every((o) => selectedIds?.has(o._id));
  const someSelected = data.some((o) => selectedIds?.has(o._id));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">

              {/* Case "tout sélectionner" */}
              <th className="py-3 pl-4 pr-2 w-8">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                    allSelected
                      ? "bg-blue-500 border-blue-500"
                      : someSelected
                      ? "bg-blue-200 border-blue-400"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                  onClick={() => onSelectAll?.()}
                >
                  {(allSelected || someSelected) && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="currentColor" className="w-2.5 h-2.5 text-white">
                      {allSelected
                        ? <path fillRule="evenodd" d="M10.22 2.97a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 0 1 1.06-1.06L4.25 7.94l4.97-4.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd"/>
                        : <path d="M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      }
                    </svg>
                  )}
                </div>
              </th>

              <th className="py-3 pl-0 pr-3 w-14"></th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Oeuvre</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Dimension</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Statut</th>
              <th className="py-3 px-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Edition</th>
              <th className="py-3 px-3 pr-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Prix</th>
            </tr>
          </thead>
          <tbody>
            {data.map((oeuvre) => (
              <ListElement
                key={oeuvre._id || oeuvre.ID}
                oeuvre={oeuvre}
                selected={selectedIds?.has(oeuvre._id)}
                onSelect={onSelect}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
