"use client";
import React from "react";
import Person3Icon from "@mui/icons-material/Person3";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <div className="my-[10px] flex items-center justify-between w-[80%] mx-auto items-center ">
            <img
              className="h-[90px] cursor-pointer"
              src="./images/Logo.png"
              alt=""
              onClick={() => router.push("/search")}
            />
            <Person3Icon fontSize="large" className="cursor-pointer" />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
