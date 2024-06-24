import React, { useState, useEffect } from "react";
import data from "../../../data/data.json";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";

export default function ArtDetails({ ID }) {
  const [artWork, setArtWork] = useState(null);
  const [content, setContent] = useState([]);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const foundArtWork = data.find((e) => e.Id_oeuvre === ID);
    setArtWork(foundArtWork);
  }, [ID]);

  const handleEdit = () => {
    setEditable(true);
  };

  useEffect(() => {
    if (artWork) {
      const newContent = [];
      for (const prop in artWork) {
        newContent.push(
          <TextField
            key={prop} // Ajout d'une clé unique pour chaque champ de texte
            id={prop}
            label={prop}
            defaultValue={artWork[prop]}
            variant="standard"
            fullWidth // Ajout de fullWidth pour une meilleure présentation
            margin="normal" // Ajout d'un margin pour un espacement approprié
            disabled={!editable}
          />
        );
      }
      setContent(newContent);
    }
  }, [artWork, editable]);

  if (!artWork) {
    return <div>Oeuvre non trouvée</div>;
  }

  return (
    <div className="w-[80%] mx-auto mt-[20px]">
      <p className="underline cursor-pointer">
        <KeyboardArrowLeftIcon fontSize="small" />
        Retour
      </p>
      <div className="grid grid-cols-2 mt-[40px] gap-4">
        <div className="place-self-auto flex h–[100%]">
          <img
            className="max-w-full h-auto object-contain"
            src={`../${artWork.src}`}
            alt={artWork.Titre}
          />
        </div>
        <div>
          <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">
              <div className="flex justify-end mr-[15px] cursor-pointer">
                <EditIcon sx={{ mt: "20px" }} onClick={handleEdit} />
              </div>
              <CardContent>{content}</CardContent>
              {editable && (
                <CardActions>
                  <Button size="small" onClick={() => setEditable(false)}>
                    Annuler
                  </Button>
                  <Button size="small">Enregistrer</Button>
                </CardActions>
              )}
            </Card>
          </Box>
        </div>
      </div>
    </div>
  );
}
