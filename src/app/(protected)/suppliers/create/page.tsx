import React from "react";
import Form from "./form";
import Instructions from "./instructions";
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Container,
  Grid,
  Alert,
  AlertTitle,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

const Page = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
          <AddCircleIcon sx={{ mr: 0.5 }} fontSize="small" />
          Novo Fornecedor
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Link href="/suppliers" passHref style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "primary.main",
              mr: 2,
              "&:hover": { opacity: 0.8 },
            }}
          >
            <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" fontWeight={500}>
              Voltar
            </Typography>
          </Box>
        </Link>

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
              width: "80px",
              height: "4px",
              backgroundColor: "primary.main",
              borderRadius: "2px",
            },
          }}
        >
          Registrar Novo Fornecedor
        </Typography>
      </Box>

      {/* Alert */}
      <Alert severity="info" variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
        <AlertTitle>Informação importante</AlertTitle>
        Os fornecedores cadastrados poderão ser vinculados a contratos e
        projetos no sistema. Certifique-se de preencher todos os dados
        corretamente.
      </Alert>

      {/* Form and Instructions */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Form />
        </Grid>
        <Grid item xs={12} md={4}>
          <Instructions />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Page;
