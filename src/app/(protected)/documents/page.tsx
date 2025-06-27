"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AddContract } from "./add-document";
import ContractsTable from "./documents-table";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Skeleton,
  Alert,
  Chip,
  Breadcrumbs,
  CircularProgress,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";

const Page = () => {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folder");
  const folderName = searchParams.get("folderName");

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        let q;

        if (folderId) {
          // Filter by folder if folderId is provided
          q = query(
            collection(db, "documents"),
            where("folderId", "==", folderId),
            orderBy("createdAt", "desc")
          );
        } else {
          // Get all documents if no folder filter
          q = query(collection(db, "documents"), orderBy("createdAt", "desc"));
        }

        const data = await getDocs(q);
        const documentsData: any[] = [];

        data.forEach((document) => {
          documentsData.push({
            ...document.data(),
            id: document.id,
          });
        });

        setDocuments(documentsData);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Erro ao carregar documentos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [folderId]); // Re-fetch when folderId changes

  // Loading state
  if (loading) {
    return (
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 2 }}>
        {/* Header skeleton */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>

        {/* Breadcrumbs skeleton */}
        <Skeleton variant="text" width={400} height={24} sx={{ mb: 2 }} />

        {/* Table skeleton */}
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 2 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Documentos
          </Typography>
          <AddContract />
        </Box>
      </Box>
    );
  }

  // Determine page title based on filter
  const pageTitle =
    folderId && folderName
      ? `Documentos - ${folderName}`
      : "Todos os Documentos";

  const documentCount = documents.length;

  return (
    <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 2 }}>
      {/* Breadcrumbs */}
      {folderId && folderName && (
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ mb: 3, color: "text.secondary" }}
        >
          <Link
            href="/"
            passHref
            style={{
              display: "flex",
              alignItems: "center",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Início
          </Link>
          <Link
            href="/documents"
            passHref
            style={{
              display: "flex",
              alignItems: "center",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <DescriptionIcon sx={{ mr: 0.5 }} fontSize="small" />
            Documentos
          </Link>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
            }}
            color="text.primary"
          >
            <FolderIcon sx={{ mr: 0.5 }} fontSize="small" />
            {folderName}
          </Typography>
        </Breadcrumbs>
      )}

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "text.primary",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-8px",
                left: 0,
                width: "60px",
                height: "4px",
                backgroundColor: "primary.main",
                borderRadius: "2px",
              },
            }}
          >
            {pageTitle}
          </Typography>

          {/* Filter indicator and document count */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {documentCount} documento(s) encontrado(s)
            </Typography>

            {folderId && folderName && (
              <Chip
                icon={<FolderIcon />}
                label={`Pasta: ${folderName}`}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </Box>

        <AddContract />
      </Box>

      {/* No documents message */}
      {documentCount === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {folderId
            ? `Nenhum documento encontrado na pasta "${folderName}".`
            : "Nenhum documento encontrado."}
        </Alert>
      )}

      {/* Documents Table */}
      <Box sx={{ mb: 4 }}>
        <ContractsTable data={documents} />
      </Box>
    </Box>
  );
};

export default Page;
