"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Chip,
  Paper,
  Skeleton,
  Divider,
  Button,
  Avatar,
  Alert,
  CircularProgress,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SupplierTabs from "./tabs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Supplier {
  name: string;
  status: string;
  nif: string;
  tipo?: string;
  email?: string;
  telefone1?: string;
  address?: string;
}

const Layout = ({
  children,
  params,
}: {
  params: { supplierId: string };
  children: React.ReactNode;
}) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoading(true);
        const data = await getDoc(doc(db, "suppliers", params.supplierId));

        if (!data.exists()) {
          setError("not_found");
          return;
        }

        setSupplier(data.data() as Supplier);
      } catch (err) {
        console.error("Error fetching supplier:", err);
        setError("fetch_error");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [params.supplierId]);

  // Status chip renderer
  const renderStatusChip = (status: string) => {
    let color: "success" | "error" | "warning" = "success";

    switch (status) {
      case "Activo":
        color = "success";
        break;
      case "Inactivo":
        color = "error";
        break;
      case "Suspenso":
        color = "warning";
        break;
      default:
        color = "success";
    }

    return (
      <Chip
        size="small"
        color={color}
        label={status}
        variant="outlined"
        sx={{ ml: 2 }}
      />
    );
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, md: 3 } }}>
        {/* Breadcrumbs skeleton */}
        <Skeleton variant="text" width={300} height={32} sx={{ mb: 3 }} />

        {/* Header skeleton */}
        <Paper
          elevation={2}
          sx={{
            mb: 3,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 3,
              background: "linear-gradient(to right, #f3f4f6, #ffffff)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Skeleton
                  variant="circular"
                  width={60}
                  height={60}
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Skeleton variant="text" width={200} height={40} />
                  <Skeleton
                    variant="text"
                    width={150}
                    height={24}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
              <Skeleton variant="rectangular" width={80} height={32} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={200} height={20} />
            </Box>
          </Box>
          <Divider />
          <Skeleton variant="rectangular" height={48} />
        </Paper>

        {/* Content loading */}
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Error states
  if (error === "not_found") {
    return (
      <Box sx={{ maxWidth: "800px", mx: "auto", p: 3 }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{ borderRadius: 2, mb: 3 }}
        >
          <Typography variant="h6">Fornecedor não encontrado!</Typography>
          <Typography variant="body2">
            O fornecedor solicitado não existe ou foi removido.
          </Typography>
        </Alert>
        <Button
          component={Link}
          href="/suppliers"
          startIcon={<ArrowBackIcon />}
          variant="contained"
        >
          Voltar para lista de fornecedores
        </Button>
      </Box>
    );
  }

  if (error === "fetch_error") {
    return (
      <Box sx={{ maxWidth: "800px", mx: "auto", p: 3 }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{ borderRadius: 2, mb: 3 }}
        >
          <Typography variant="h6">
            Erro ao carregar dados do fornecedor
          </Typography>
          <Typography variant="body2">
            Ocorreu um erro ao tentar carregar os dados. Por favor, tente
            novamente.
          </Typography>
        </Alert>
        <Button
          component={Link}
          href="/suppliers"
          startIcon={<ArrowBackIcon />}
          variant="contained"
        >
          Voltar para lista de fornecedores
        </Button>
      </Box>
    );
  }

  // Render main content
  if (!supplier) return null;

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, md: 3 } }}>
      {/* Breadcrumbs */}
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
          href="/suppliers"
          passHref
          style={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <BusinessIcon sx={{ mr: 0.5 }} fontSize="small" />
          Fornecedores
        </Link>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
          }}
          color="text.primary"
        >
          <StoreIcon sx={{ mr: 0.5 }} fontSize="small" />
          {supplier.name}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            background: "linear-gradient(to right, #f3f4f6, #ffffff)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "primary.main",
                  mr: 2,
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                {supplier.name ? supplier.name.charAt(0).toUpperCase() : "S"}
              </Avatar>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" sx={{ mr: 1 }}>
                    {supplier.name}
                  </Typography>
                  {renderStatusChip(supplier.status)}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`NIF: ${supplier.nif}`}
                    icon={<ContentCopyIcon fontSize="small" />}
                    sx={{ mr: 1 }}
                    onClick={() => {
                      navigator.clipboard.writeText(supplier.nif);
                    }}
                  />
                  {supplier.tipo && (
                    <Chip
                      size="small"
                      color="primary"
                      variant="outlined"
                      label={supplier.tipo}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              component={Link}
              href={`/supplier/${params.supplierId}/update`}
              size="small"
            >
              Editar
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            {supplier.email && (
              <Button
                variant="text"
                size="small"
                href={`mailto:${supplier.email}`}
                sx={{ textTransform: "none" }}
              >
                {supplier.email}
              </Button>
            )}

            {supplier.telefone1 && (
              <Button
                variant="text"
                size="small"
                href={`tel:${supplier.telefone1}`}
                sx={{ textTransform: "none" }}
              >
                {supplier.telefone1}
              </Button>
            )}

            {supplier.address && (
              <Typography variant="body2" color="text.secondary">
                {supplier.address}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Tabs */}
        <SupplierTabs supplierId={params.supplierId} />
      </Paper>

      {/* Content */}
      {children}
    </Box>
  );
};

export default Layout;
