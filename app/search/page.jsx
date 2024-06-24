"use client";
import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import CardsContainer from "../components/Results/CardsContainer";
import ListContainer from "../components/Results/ListContainer";

export default function Search() {
  const [gridView, setGridView] = useState(false);

  return (
    <div className="min-h-screen">
      <h1 className="text-center uppercase m-8 text-[#1876D1] font-bold text-2xl  ">
        Pasnic Galleria
      </h1>
      <SearchBar />
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
      {gridView ? <CardsContainer /> : <ListContainer />}
    </div>
  );
}
