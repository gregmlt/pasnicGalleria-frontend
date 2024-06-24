"use client";
import React from "react";
import ArtDetails from "../../components/Art/ArtDetails";

export default function artPage(params) {
  const id = params.params.articleId;

  return <ArtDetails ID={id} />;
}
