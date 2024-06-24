import React from "react";
import Cards from "./Cards";
import data from "../../../data/data.json";

export default function ResultsContainer() {
  const content = data.map((e) => {
    return (
      <Cards
        key={e.Id_oeuvre}
        src={e.src}
        Id_oeuvre={e.Id_oeuvre}
        Artiste={e.Artiste}
        Titre={e.Titre}
        Dimension={e.Dimension}
        Statut={e.Statut}
        Edition={e.Edition}
        Prix={e.Prix}
      />
    );
  });

  return (
    <div className=" flex flex-wrap gap-4 mt-[30px] justify-center w-[85%] mx-auto">
      {content}
    </div>
  );
}
