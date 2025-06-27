"use client";
import { Button, Tooltip, Box } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

export const AddSupplier = () => {
  return (
    <Box>
      <Tooltip title="Adicionar novo fornecedor ao sistema" arrow>
        <Button
          component={Link}
          href="/suppliers/create"
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          size="medium"
          sx={{
            borderRadius: "8px",
            fontWeight: 500,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          Adicionar fornecedor
        </Button>
      </Tooltip>
    </Box>
  );
};

export default AddSupplier;
