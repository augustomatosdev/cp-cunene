"use client";
import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

export const AddContract = () => {
  return (
    <div>
      <Button
        LinkComponent={Link}
        href="/contracts/create"
        startIcon={<AddIcon />}
        variant="contained"
      >
        Novo contrato
      </Button>
    </div>
  );
};
