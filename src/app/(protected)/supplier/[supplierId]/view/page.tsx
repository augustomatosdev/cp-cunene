import React from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BadgeIcon from "@mui/icons-material/Badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Page = async ({ params }: { params: { supplierId: string } }) => {
  // Fetch supplier data with error handling
  let supplier;
  try {
    const data = await getDoc(doc(db, "suppliers", params.supplierId));

    if (!data.exists()) {
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
        </Box>
      );
    }

    supplier = data.data();
  } catch (error) {
    console.error("Error fetching supplier:", error);
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
      </Box>
    );
  }

  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Status chip renderer
  const renderStatusChip = (status: string) => {
    if (!status) return null;

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
      <Chip size="small" color={color} label={status} variant="outlined" />
    );
  };

  // Field component for consistent formatting
  const InfoField = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string | React.ReactNode;
    icon: React.ReactNode;
  }) => (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {icon}
        {label}
      </Typography>
      <Typography
        variant="body1"
        color="text.primary"
        sx={{
          pl: icon ? 3 : 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          wordBreak: "break-word",
        }}
      >
        {value || "N/A"}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: "100%", pb: 4 }}>
      {/* Overview Card */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(to right, #f5f7fa, #ffffff)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <DescriptionIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Sobre a empresa
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" paragraph>
          {supplier.descricao || "Nenhuma descrição disponível."}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {supplier.tipo && (
            <Chip
              label={`Tipo: ${supplier.tipo}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {supplier.status && renderStatusChip(supplier.status)}
          {supplier.inicio && (
            <Chip
              label={`Início: ${formatDate(supplier.inicio)}`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
        </Box>
      </Paper>

      {/* Company Data Card */}
      <Card
        variant="outlined"
        sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
          }}
        >
          <BusinessIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="medium">
            Dados gerais da empresa
          </Typography>
        </Box>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <InfoField
                label="Nome da empresa"
                value={supplier.name}
                icon={<BusinessIcon fontSize="small" color="primary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoField
                label="NIF"
                value={supplier.nif}
                icon={<BadgeIcon fontSize="small" color="primary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoField
                label="Data de Abertura"
                value={formatDate(supplier.registro)}
                icon={<CalendarTodayIcon fontSize="small" color="primary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InfoField
                label="Estado"
                value={renderStatusChip(supplier.status)}
                icon={null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <InfoField
                label="Natureza jurídica"
                value={supplier.natureza}
                icon={<AccountBalanceIcon fontSize="small" color="primary" />}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Address and Contacts Card */}
      <Card
        variant="outlined"
        sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            display: "flex",
            alignItems: "center",
          }}
        >
          <LocationOnIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="medium">
            Endereço e contactos
          </Typography>
        </Box>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoField
                label="Endereço"
                value={supplier.address}
                icon={<LocationOnIcon fontSize="small" color="secondary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoField
                label="Telefone Principal"
                value={
                  <Box
                    component="a"
                    href={`tel:${supplier.telefone1}`}
                    sx={{
                      color: "text.primary",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {supplier.telefone1}
                  </Box>
                }
                icon={<LocalPhoneIcon fontSize="small" color="secondary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InfoField
                label="Telefone Alternativo"
                value={
                  supplier.telefone2 ? (
                    <Box
                      component="a"
                      href={`tel:${supplier.telefone2}`}
                      sx={{
                        color: "text.primary",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {supplier.telefone2}
                    </Box>
                  ) : (
                    "N/A"
                  )
                }
                icon={<LocalPhoneIcon fontSize="small" color="secondary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <InfoField
                label="E-mail"
                value={
                  <Box
                    component="a"
                    href={`mailto:${supplier.email}`}
                    sx={{
                      color: "text.primary",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {supplier.email}
                  </Box>
                }
                icon={<EmailIcon fontSize="small" color="secondary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <InfoField
                label="Site"
                value={
                  supplier.site ? (
                    <Box
                      component="a"
                      href={
                        supplier.site.startsWith("http")
                          ? supplier.site
                          : `https://${supplier.site}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "text.primary",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {supplier.site}
                    </Box>
                  ) : (
                    "N/A"
                  )
                }
                icon={<LanguageIcon fontSize="small" color="secondary" />}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Shareholders Card */}
      <Card variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            px: 3,
            py: 2,
            bgcolor: "info.main",
            color: "info.contrastText",
            display: "flex",
            alignItems: "center",
          }}
        >
          <PeopleIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="medium">
            Quadro societário
          </Typography>
        </Box>
        <CardContent>
          {supplier.socios && supplier.socios.length > 0 ? (
            supplier.socios.map((socio: any, index: number) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: index < supplier.socios.length - 1 ? 2 : 0,
                  borderRadius: 1.5,
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: 1,
                    borderColor: "info.light",
                  },
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <InfoField
                      label="Nome"
                      value={socio.responsavel}
                      icon={<PeopleIcon fontSize="small" color="info" />}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InfoField
                      label="Cargo"
                      value={socio.cargoResponsavel}
                      icon={<BadgeIcon fontSize="small" color="info" />}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InfoField
                      label="Telefone"
                      value={
                        <Box
                          component="a"
                          href={`tel:${socio.telefoneResponsavel}`}
                          sx={{
                            color: "text.primary",
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {socio.telefoneResponsavel}
                        </Box>
                      }
                      icon={<LocalPhoneIcon fontSize="small" color="info" />}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))
          ) : (
            <Alert
              severity="info"
              variant="outlined"
              sx={{ borderRadius: 1.5 }}
            >
              Nenhum sócio cadastrado para este fornecedor.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Page;
