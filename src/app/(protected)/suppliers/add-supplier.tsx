"use client";
import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { uploadSupplier } from "@/app/utils/mock-suppliers";

export const AddSupplier = () => {
  return (
    <div>
      <Button
        LinkComponent={Link}
        href="/suppliers/create"
        // onClick={() => uploadSupplier()}
        startIcon={<AddIcon />}
        variant="contained"
      >
        Adicionar fornecedor
      </Button>
    </div>
  );
};
