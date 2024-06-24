"use client";
import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function Input({ label }) {
  return (
    <div>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="outlined-basic" label={label} variant="outlined" />
      </Box>
    </div>
  );
}
