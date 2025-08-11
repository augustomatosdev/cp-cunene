"use client";
import React from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Chip,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import CancelIcon from "@mui/icons-material/Cancel";
import SuppliersTable from "./suppliers-tablet";
import AddSupplier from "./add-supplier";
import { useSuppliers, getSupplierStats } from "@/hooks/useSuppliers";

// Loading skeleton for stats cards
const StatsCardSkeleton = () => (
  <Card
    elevation={2}
    sx={{
      borderRadius: 2,
      height: "100%",
    }}
  >
    <CardContent sx={{ textAlign: "center", p: 2 }}>
      <Skeleton
        variant="circular"
        width={40}
        height={40}
        sx={{ mx: "auto", mb: 1 }}
      />
      <Skeleton variant="text" width={60} height={40} sx={{ mx: "auto" }} />
      <Skeleton variant="text" width="80%" height={20} sx={{ mx: "auto" }} />
    </CardContent>
  </Card>
);

const Page = () => {
  const { data: suppliers = [], isLoading, isError, error } = useSuppliers();

  // Get suppliers stats only when data is available
  const stats =
    suppliers.length > 0
      ? getSupplierStats(suppliers)
      : {
          total: 0,
          active: 0,
          inactive: 0,
          suspended: 0,
          services: 0,
          products: 0,
        };

  // Error state
  if (isError) {
    return (
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 2 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar fornecedores: {error?.message || "Erro desconhecido"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 2 }}>
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
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
          }}
          color="text.primary"
        >
          <BusinessIcon sx={{ mr: 0.5 }} fontSize="small" />
          Fornecedores
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
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
          Fornecedores
        </Typography>
        <AddSupplier />
      </Box>

      {/* Dashboard Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <StatsCardSkeleton />
          ) : (
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 2 }}>
                <BusinessIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="text.primary" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Fornecedores
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <StatsCardSkeleton />
          ) : (
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 2 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {stats.active}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fornecedores Activos
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <StatsCardSkeleton />
          ) : (
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 2 }}>
                <PauseCircleFilledIcon
                  color="warning"
                  sx={{ fontSize: 40, mb: 1 }}
                />
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {stats.suspended}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fornecedores Suspensos
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {isLoading ? (
            <StatsCardSkeleton />
          ) : (
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 2 }}>
                <CancelIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  {stats.inactive}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fornecedores Inactivos
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Supplier Type Distribution */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="body1" fontWeight={500}>
          Distribuição por tipo:
        </Typography>

        {isLoading ? (
          <>
            <Skeleton
              variant="rectangular"
              width={120}
              height={32}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width={120}
              height={32}
              sx={{ borderRadius: 2 }}
            />
          </>
        ) : (
          <>
            <Chip
              icon={<DescriptionIcon />}
              label={`Serviços: ${stats.services}`}
              color="primary"
              variant="outlined"
            />

            <Chip
              icon={<BusinessIcon />}
              label={`Produtos: ${stats.products}`}
              color="secondary"
              variant="outlined"
            />
          </>
        )}
      </Box>

      {/* Table */}
      {isLoading ? (
        <Box sx={{ mt: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Box>
      ) : (
        <SuppliersTable data={suppliers as any} />
      )}
    </Box>
  );
};

export default Page;
