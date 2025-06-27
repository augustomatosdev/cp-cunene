"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Box,
  Typography,
  Breadcrumbs,
  Chip,
  Grid,
  Card,
  CardContent,
  Skeleton,
  CircularProgress,
  Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import BusinessIcon from "@mui/icons-material/Business";
import EuroIcon from "@mui/icons-material/Euro";
import Link from "next/link";
import ContractsTable from "./contracts-table";
import { AddContract } from "./add-contract";

// Define contract type
interface Contract {
  id: string;
  supplier: string;
  supplierId: string;
  reference: string;
  description: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
  object: string;
  fileUrls?: Array<{ name: string; url: string }>;
  createdAt: any;
  updatedAt: any;
}

// Utility to get contract stats
const getContractStats = (contracts: Contract[]) => {
  const stats = {
    total: contracts.length,
    emAndamento: 0,
    concluido: 0,
    cancelado: 0,
    totalValue: 0,
    activeContracts: 0,
    uniqueSuppliers: new Set(),
  };

  const currentDate = new Date();

  contracts.forEach((contract: Contract) => {
    // Count by status
    if (contract.status === "Em andamento") stats.emAndamento++;
    else if (contract.status === "Concluido") stats.concluido++;
    else if (contract.status === "Cancelado") stats.cancelado++;

    // Calculate total value
    if (contract.amount && typeof contract.amount === "number") {
      stats.totalValue += contract.amount;
    }

    // Count active contracts (not ended and not cancelled)
    const endDate = new Date(contract.endDate);
    if (contract.status !== "Cancelado" && endDate >= currentDate) {
      stats.activeContracts++;
    }

    // Count unique suppliers
    if (contract.supplierId) {
      stats.uniqueSuppliers.add(contract.supplierId);
    }
  });

  return {
    ...stats,
    uniqueSuppliersCount: stats.uniqueSuppliers.size,
  };
};

const Page: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "contracts"),
          orderBy("createdAt", "desc")
        );
        const data = await getDocs(q);
        const contractsList: Contract[] = [];

        data.forEach((contract) => {
          contractsList.push({
            ...contract.data(),
            id: contract.id,
          } as Contract);
        });

        setContracts(contractsList);
      } catch (err) {
        console.error("Error fetching contracts:", err);
        setError("Erro ao carregar contratos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // Get contract stats
  const stats = getContractStats(contracts);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 2 }}>
        {/* Breadcrumbs skeleton */}
        <Skeleton variant="text" width={300} height={32} sx={{ mb: 3 }} />

        {/* Header skeleton */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Skeleton variant="text" width={200} height={48} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>

        {/* Dashboard cards skeleton */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{ mx: "auto", mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width={60}
                    height={32}
                    sx={{ mx: "auto" }}
                  />
                  <Skeleton
                    variant="text"
                    width={120}
                    height={20}
                    sx={{ mx: "auto" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional stats skeleton */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2].map((item) => (
            <Grid item xs={12} sm={6} md={6} key={item}>
              <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{ mx: "auto", mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width={100}
                    height={32}
                    sx={{ mx: "auto" }}
                  />
                  <Skeleton
                    variant="text"
                    width={150}
                    height={20}
                    sx={{ mx: "auto" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Chips skeleton */}
        <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Skeleton variant="text" width={150} height={24} />
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} variant="rounded" width={120} height={32} />
          ))}
        </Box>

        {/* Table skeleton */}
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", p: 2 }}>
        <Alert
          severity="error"
          variant="filled"
          sx={{ borderRadius: 2, mb: 3 }}
        >
          <Typography variant="h6">Erro ao carregar contratos</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
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
          <DescriptionIcon sx={{ mr: 0.5 }} fontSize="small" />
          Contratos
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
          Contratos
        </Typography>
        <AddContract />
      </Box>

      {/* Additional Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
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
              <EuroIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {formatCurrency(stats.totalValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Valor Total dos Contratos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
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
              <BusinessIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="secondary.main" fontWeight="bold">
                {stats.uniqueSuppliersCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fornecedores Únicos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Contract Status Distribution */}
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
          Distribuição por estado:
        </Typography>

        <Chip
          icon={<HourglassEmptyIcon />}
          label={`Em andamento: ${stats.emAndamento}`}
          color="warning"
          variant="outlined"
        />

        <Chip
          icon={<CheckCircleIcon />}
          label={`Concluídos: ${stats.concluido}`}
          color="success"
          variant="outlined"
        />

        <Chip
          icon={<CancelIcon />}
          label={`Cancelados: ${stats.cancelado}`}
          color="error"
          variant="outlined"
        />

        <Chip
          icon={<AssignmentIcon />}
          label={`Contratos ativos: ${stats.activeContracts}`}
          color="info"
          variant="outlined"
        />
      </Box>

      {/* Table */}
      <ContractsTable data={contracts} />
    </Box>
  );
};

export default Page;
