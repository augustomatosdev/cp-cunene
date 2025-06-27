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
import DescriptionIcon from "@mui/icons-material/Description";
import Link from "next/link";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ContractsTable from "./contracts-table";

const Page = async ({ params }: { params: { supplierId: string } }) => {
  // Fetch contracts with improved error handling
  let contracts: any[] = [];
  let errorMessage = null;

  try {
    const q = query(
      collection(db, "contracts"),
      where("supplierId", "==", params.supplierId),
      orderBy("createdAt", "desc")
    );
    const data = await getDocs(q);
    data.forEach((contract) => {
      contracts.push({ ...contract.data(), id: contract.id });
    });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    errorMessage = "Erro ao carregar contratos. Por favor, tente novamente.";
  }

  // Get summary stats
  const activeContracts = contracts.filter((c) => c.status === "Activo").length;
  const expiredContracts = contracts.filter(
    (c) => c.status === "Expirado"
  ).length;
  const pendingContracts = contracts.filter(
    (c) => c.status === "Pendente"
  ).length;

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
            <DescriptionIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold">
              Contratos
            </Typography>
          </Box>

          <Button
            component={Link}
            href={`/contracts/create?supplierId=${params.supplierId}`}
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
            Adicionar contrato
          </Button>
        </Box>

        {/* Statistics row */}
        {contracts.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Chip
              label={`Total: ${contracts.length}`}
              color="default"
              variant="outlined"
              icon={<DescriptionIcon />}
            />
            {activeContracts > 0 && (
              <Chip
                label={`Ativos: ${activeContracts}`}
                color="success"
                variant="outlined"
              />
            )}
            {expiredContracts > 0 && (
              <Chip
                label={`Expirados: ${expiredContracts}`}
                color="error"
                variant="outlined"
              />
            )}
            {pendingContracts > 0 && (
              <Chip
                label={`Pendentes: ${pendingContracts}`}
                color="warning"
                variant="outlined"
              />
            )}
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
      {contracts.length === 0 && !errorMessage ? (
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
          <DescriptionIcon
            sx={{ fontSize: 48, color: "action.disabled", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum contrato encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Este fornecedor ainda não possui contratos registrados no sistema.
          </Typography>
          <Button
            component={Link}
            href={`/contracts/create?supplierId=${params.supplierId}`}
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
          >
            Adicionar primeiro contrato
          </Button>
        </Paper>
      ) : (
        <ContractsTable data={contracts} />
      )}
    </Box>
  );
};

export default Page;
