"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import CardsContainer from "../components/Results/CardsContainer";
import ListContainer from "../components/Results/ListContainer";
import data from "../../data/data.json";

export default function Search() {
  const [gridView, setGridView] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const keys = [
    "Id_oeuvre",
    "Artiste",
    "Titre",
    "Dimension",
    "Statut",
    "Edition",
    "Prix",
  ];

  // Fonction qui met à jour la query en fonction des éléments saisis
  const searchValue = (q) => {
    setQuery(q);
  };

  // Fonction qui cherche la query dans la data
  const search = () => {
    const result = data.filter((item) =>
      keys.some((key) => item[key]?.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredData(result);
  };

  // Effet qui permet d'envoyer la data en fonction de la donnée mis dans la barre de recherche
  useEffect(() => {
    search();
  }, [query]);

  return (
    <div className="min-h-screen">
      <h1 className="text-center uppercase m-8 text-[#1876D1] font-bold text-2xl  ">
        Pasnic Galleria
      </h1>
      <SearchBar query={searchValue} />
      <div className="ml-[10.5%] mt-[50px]  w-[100px] flex flex-row items-center ">
        <FormatListBulletedIcon
          className=" shadow-lg hover:shadow-2xl cursor-pointer transform hover:scale-[1.01] transition-transform duration-500 bg-white shadow-lg text-[1.8rem] border border-[#93BAE9] "
          color="primary"
          size="medium"
          onClick={() => setGridView(false)}
        />
        <GridViewIcon
          className="ml-[5px]  shadow-lg hover:shadow-2xl cursor-pointer transform hover:scale-[1.01] transition-transform duration-500 bg-white shadow-lg text-[1.8rem] border border-[#93BAE9]  "
          color="primary"
          onClick={() => setGridView(true)}
        />
      </div>
      {gridView ? (
        <CardsContainer data={filteredData} />
      ) : (
        <ListContainer data={filteredData} />
      )}
    </div>
  );
}
