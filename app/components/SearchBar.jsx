import React, { useState } from "react";
import Button from "@mui/material/Button";
import SortIcon from "@mui/icons-material/Sort";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const search = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  return (
    <div className="w-[90%] flex flex-row justify-center mx-auto gap-4">
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" startIcon={<SortIcon />}>
          Filtrer
        </Button>
      </Stack>
      <input
        type="text"
        className=" placeholder-gray-400 text-gray-900 p-4 place-content-center rounded-md w-[60%] border-2 border-[#1876D1]"
        placeholder="Search"
        onChange={search}
        value={query}
      />
      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Fab color="primary" aria-label="add">
          <AddIcon onClick={() => router.push("/newArticle")} />
        </Fab>
      </Box>
    </div>
  );
}
