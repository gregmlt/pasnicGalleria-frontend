import React, { useState } from "react";
import ListElement from "./ListElement";
import data from "../../../data/data.json";

export default function ListContainer() {
  const content = data.map((e) => {
    return (
      <ListElement
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
    <div className="pt-[20px]">
      <table className="w-[80%] mx-auto table-auto  ">
        <caption className="caption-top pb-[20px] text-xs">
          {data.length} oeuvres trouvées
        </caption>
        <thead className="border-b-[25px] border-transparent">
          <tr className="text-left">
            <th>
              <input type="checkbox" id="scales" name="scales" />
            </th>
            <th className="">Oeuvre</th>
            <th>ID</th>
            <th>Artiste</th>
            <th>Titre de l'oeuvre</th>
            <th>Dimension</th>
            <th>Statut</th>
            <th>Edition</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody className="">{content}</tbody>
      </table>
    </div>
  );
}
