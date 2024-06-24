import React from "react";

export default function Cards({
  src,
  Id_oeuvre,
  Artiste,
  Titre,
  Dimension,
  Statut,
  Edition,
  Prix,
}) {
  return (
    <div className="flex flex-col bg-white shadow-lg hover:shadow-2xl rounded-lg p-4 cursor-pointer transform hover:scale-[1.01] transition-transform duration-500 w-[30%]">
      <div className="h-44 object-cover rounded-t-lg mx-auto">
        <img
          src={src}
          className="w-full h-full   "
          alt={`${Titre} by ${Artiste}`}
        />
      </div>

      <div className="pt-4 pb-2">
        <p>
          <span className="text-base font-medium">ID : </span>
          <span className="text-sm font-light">{Id_oeuvre}</span>
        </p>
        <p>
          <span className="text-base font-medium">Artiste : </span>
          <span className="text-sm font-light">{Artiste}</span>
        </p>
        <p>
          <span className="text-base font-medium">Titre de l'oeuvre : </span>{" "}
          <span className="text-sm font-light">{Titre}</span>
        </p>
        <p>
          <span className="text-base font-medium">Dimension : </span>{" "}
          <span className="text-sm font-light">{Dimension}</span>
        </p>
        <p>
          <span className="text-base font-medium">Statut : </span>{" "}
          <span className="text-sm font-light">{Statut}</span>
        </p>
        <p>
          <span className="text-base font-medium">Edition : </span>{" "}
          <span className="text-sm font-light">{Edition}</span>
        </p>
        <p>
          <span className="text-base font-medium">Prix : </span>{" "}
          <span className="text-sm font-light">{Prix} €</span>
        </p>
      </div>
    </div>
  );
}
