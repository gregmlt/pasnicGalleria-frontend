import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function newArticle() {
  return (
    <Box sx={{ minWidth: 275 }}>
      <div className="flex w-[60%] items-center flex-col mx-auto mt-[20px] ">
        <Card className="w-[100%] px-[20px]">
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Image"
              defaultValue=""
              fullWidth
              variant="standard"
              margin="normal" // Ajout d'un margin pour un espacement approprié
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="ID"
              defaultValue="Généré automatiquement"
              variant="standard"
              margin="normal" // Ajout d'un margin pour un espacement approprié
              disabled="true"
              fullWidth
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Artiste"
              defaultValue=""
              variant="standard"
              margin="normal" // Ajout d'un margin pour un espacement approprié
              fullWidth
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Titre"
              defaultValue=""
              variant="standard"
              margin="normal" // Ajout d'un margin pour un espacement approprié
              fullWidth
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Dimension"
              defaultValue="ex : 120 x 80"
              variant="standard"
              margin="normal" // Ajout d'un margin pour un espacement approprié
              fullWidth
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Statut"
              defaultValue="A vendre"
              variant="standard"
              margin="normal" // Ajout d'un margin pour un espacement approprié
              fullWidth
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Edition"
              defaultValue=""
              variant="standard"
              margin="normal" // Ajout d'un margin pour un espacement approprié
              fullWidth
            />
          </CardContent>
          <CardContent className="w-[100%] p-[2px] mt-[10px]">
            <TextField
              label="Prix"
              defaultValue=""
              variant="standard"
              margin="normal" // Ajout d'un margin pour un espacement approprié
              fullWidth
            />
          </CardContent>
          <CardActions className="pl-[0]">
            <Button size="small" className="pl-[0]">
              Enregistrer
            </Button>
          </CardActions>
        </Card>
      </div>
    </Box>
  );
}
