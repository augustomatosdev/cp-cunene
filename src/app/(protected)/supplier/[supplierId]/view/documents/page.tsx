import React from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  Chip,
  Alert,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import Link from "next/link";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DocumentsTable from "./documents-table";

const Page = async ({ params }: { params: { supplierId: string } }) => {
  // Fetch documents with improved error handling
  let documents: any[] = [];
  let errorMessage = null;

  try {
    const q = query(
      collection(db, "documents"),
      where("supplierId", "==", params.supplierId),
      orderBy("createdAt", "desc")
    );
    const data = await getDocs(q);
    data.forEach((document) => {
      documents.push({ ...document.data(), id: document.id });
    });
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    // Check if it's a "collection does not exist" error or another type
    if (error.code === "firestore/not-found") {
      // This is normal when the collection doesn't exist yet
      documents = [];
    } else {
      errorMessage = "Erro ao carregar documentos. Por favor, tente novamente.";
    }
  }

  // Get document types if any
  const documentTypes = Array.from(
    new Set(documents.map((doc) => doc.type).filter(Boolean))
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: "linear-gradient(to right, #f5f7fa, #ffffff)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FolderIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold">
              Documentos
            </Typography>
          </Box>

          <Button
            component={Link}
            href={`/documents/create?supplierId=${params.supplierId}`}
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
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
            Adicionar documento
          </Button>
        </Box>

        {/* Statistics row */}
        {documents.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Chip
              label={`Total: ${documents.length}`}
              color="default"
              variant="outlined"
              icon={<FolderIcon />}
            />
            {documentTypes.map((type, index) => (
              <Chip
                key={index}
                label={`${type}: ${
                  documents.filter((doc) => doc.type === type).length
                }`}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Paper>

      {/* Error message if needed */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Table or empty state */}
      {documents.length === 0 && !errorMessage ? (
        <Paper
          elevation={1}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <FolderIcon sx={{ fontSize: 48, color: "action.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum documento encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Este fornecedor ainda não possui documentos registrados no sistema.
          </Typography>
          <Button
            component={Link}
            href={`/documents/upload?supplierId=${params.supplierId}`}
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
          >
            Adicionar primeiro documento
          </Button>
        </Paper>
      ) : (
        <DocumentsTable data={documents} />
      )}
    </Box>
  );
};

export default Page;
