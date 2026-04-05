"use client";
import ArtDetails from "../../components/Art/ArtDetails";

/**
 * Page de détail d'une oeuvre.
 * L'identifiant [articleId] peut être :
 * - un ID lisible (ex: "ALLI_0001")
 * - un ObjectId MongoDB (pour les oeuvres sans ID généré)
 *
 * Le composant ArtDetails gère l'affichage, l'édition et la suppression.
 */
export default function ArtPage({ params }) {
  return <ArtDetails ID={params.articleId} />;
}
