"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function newArticle() {
  const [image, setImage] = useState(null);
  const [artiste, setArtiste] = useState("");
  const [titre, setTitre] = useState("");
  const [dimension, setDimension] = useState("");
  const [statut, setStatut] = useState("");
  const [edition, setEdition] = useState("");
  const [prix, setPrix] = useState("");
  const [notes, setNotes] = useState("");

  const handleNotesChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setNotes(value);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("artiste", artiste.toLowerCase());
    formData.append("titre", titre.toLowerCase());
    formData.append("dimension", dimension.toLowerCase());
    formData.append("statut", statut.toLowerCase());
    formData.append("edition", edition.toLowerCase());
    formData.append("prix", prix.toLowerCase());
    formData.append("notes", notes.toLowerCase());

    try {
      const response = await fetch(
        "http://localhost:3000/articles/post/newarticle/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload article");
      }

      const result = await response.json();
      console.log("Article uploaded successfully", result);
    } catch (error) {
      console.error("Error uploading article:", error);
    }
  };

  return (
    <Box sx={{ minWidth: 275 }}>
      <div className="flex w-[60%] items-center flex-col mx-auto mt-[20px] ">
        <Card className="w-[100%] px-[20px]">
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <label className="block text-[#666666] text-sm mb-[10px]">
              Image
            </label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="ID"
              defaultValue="Généré automatiquement"
              variant="standard"
              margin="normal"
              disabled
              fullWidth
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Artiste"
              defaultValue=""
              variant="standard"
              margin="normal"
              fullWidth
              onChange={(e) => setArtiste(e.target.value)}
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Titre"
              defaultValue=""
              variant="standard"
              margin="normal"
              fullWidth
              onChange={(e) => setTitre(e.target.value)}
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Dimension"
              placeholder="exemple : 120 x 80"
              variant="standard"
              margin="normal"
              fullWidth
              onChange={(e) => setDimension(e.target.value)}
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Statut"
              placeholder="A vendre"
              variant="standard"
              margin="normal"
              fullWidth
              onChange={(e) => setStatut(e.target.value)}
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Edition"
              defaultValue=""
              variant="standard"
              margin="normal"
              fullWidth
              onChange={(e) => setEdition(e.target.value)}
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Prix"
              defaultValue=""
              variant="standard"
              margin="normal"
              fullWidth
              onChange={(e) => setPrix(e.target.value)}
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Notes"
              placeholder="Commentaire (limite 500 caractères)"
              variant="standard"
              multiline
              margin="normal"
              fullWidth
              onChange={(e) => handleNotesChange(e)}
              value={notes}
            />
          </CardContent>
          <CardActions className="pl-[0]">
            <Button size="small" className="pl-[0]" onClick={handleSubmit}>
              Enregistrer
            </Button>
          </CardActions>
        </Card>
      </div>
    </Box>
  );
}
