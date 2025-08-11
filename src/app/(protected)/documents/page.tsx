"use client";
import React from "react";
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
import { useDocuments, getDocumentsStats } from "@/hooks/useDocuments";

// Loading state component
const LoadingState = ({
  folderId,
  folderName,
}: {
  folderId?: string | null;
  folderName?: string | null;
}) => (
  <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 2 }}>
    {/* Breadcrumbs skeleton - only show if we have folder info */}
    {folderId && folderName && (
      <Skeleton variant="text" width={400} height={24} sx={{ mb: 3 }} />
    )}

    {/* Header skeleton */}
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Box>
        <Skeleton variant="text" width={300} height={48} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
          <Skeleton variant="text" width={200} height={20} />
          {folderId && folderName && (
            <Skeleton variant="rounded" width={120} height={24} />
          )}
        </Box>
      </Box>
      <Skeleton variant="rectangular" width={150} height={40} />
    </Box>

    {/* Table skeleton */}
    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
      <CircularProgress size={60} />
    </Box>
  </Box>
);

const Page = () => {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folder");
  const folderName = searchParams.get("folderName");

  const {
    data: documents = [],
    isLoading,
    isError,
    error,
  } = useDocuments(folderId);

  // Get document stats
  const stats = getDocumentsStats(documents);

  // Loading state
  if (isLoading) {
    return <LoadingState folderId={folderId} folderName={folderName} />;
  }

  // Error state
  if (isError) {
    return (
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 2 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar documentos: {error?.message || "Erro desconhecido"}
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

            {/* Additional stats chips - only show when not filtering by folder */}
            {!folderId && stats.uniqueFoldersCount > 0 && (
              <>
                <Chip
                  icon={<FolderIcon />}
                  label={`${stats.uniqueFoldersCount} pasta(s)`}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`${stats.uniqueSuppliersCount} fornecedor(es)`}
                  color="info"
                  variant="outlined"
                  size="small"
                />
              </>
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
        <ContractsTable data={documents as any} />
      </Box>
    </Box>
  );
};

export default Page;
