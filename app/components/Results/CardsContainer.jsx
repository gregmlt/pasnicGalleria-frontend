import React from "react";
import Cards from "./Cards";

/**
 * Grille responsive de cartes d'oeuvres.
 * Adapte le nombre de colonnes selon la taille d'écran :
 * 1 col (mobile) → 2 col (sm) → 3 col (lg) → 4 col (xl)
 *
 * @param {object[]} data - Tableau d'oeuvres à afficher
 * @param {Set<string>} selectedIds - IDs des oeuvres sélectionnées
 * @param {function} onSelect - Callback appelé avec l'_id lors d'un clic de sélection
 * @param {boolean} selectionMode - Si true, le clic sur une carte sélectionne au lieu de naviguer
 */
export default function CardsContainer({ data, selectedIds, onSelect, selectionMode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {data.map((oeuvre) => (
        <Cards
          key={oeuvre._id || oeuvre.ID}
          oeuvre={oeuvre}
          selected={selectedIds?.has(oeuvre._id)}
          onSelect={onSelect}
          selectionMode={selectionMode}
        />
      ))}
    </div>
  );
}
