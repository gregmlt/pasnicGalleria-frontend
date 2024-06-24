import React, { useState } from "react";
import Input from "../Input";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p className="text-[#1876D1] uppercase text-2xl mb-4">Welcome Girls</p>
      <Input
        label={"Email"}
        className=""
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label={"Password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Box sx={{ "& button": { m: 1 } }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/search")}
        >
          Connexion
        </Button>
      </Box>
    </div>
  );
}
