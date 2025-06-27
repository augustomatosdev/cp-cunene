"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Divider,
  Container,
  Alert,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Business as BusinessIcon,
  CheckCircle as CheckIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

const companySectors = [
  "Construção Civil",
  "Tecnologia da Informação",
  "Serviços de Consultoria",
  "Equipamentos e Máquinas",
  "Materiais de Escritório",
  "Serviços de Limpeza",
  "Segurança",
  "Alimentação e Catering",
  "Transporte e Logística",
  "Energia e Utilities",
  "Telecomunicações",
  "Serviços Financeiros",
  "Educação e Formação",
  "Saúde",
  "Agricultura",
  "Outros",
];

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    nif: "",
    email: "",
    phone: "",
    address: "",
    sector: "",
    description: "",
    products: "",
    contactPerson: "",
    contactTitle: "",
    website: "",
    acceptTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addDoc(collection(db, "candidates"), {
        ...formData,
        createdAt: new Date(),
      }).then(() => {
        setSubmitted(true);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{ p: 6, textAlign: "center", borderRadius: 3 }}
        >
          <CheckIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Candidatura Submetida com Sucesso!
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Obrigado por se candidatar para ser fornecedor do Governo Provincial
            do Cunene
          </Typography>
          <Typography variant="body1" paragraph>
            A sua candidatura foi recebida e será analisada pela nossa equipa
            técnica. Entraremos em contacto caso haja uma oportunidade de
            fornecimento adequada.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Hero Section */}
      <Box
        className="bg-gradient-to-br from-red-700 via-red-600 to-yellow-500"
        sx={{
          color: "white",
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Governo Provincial do Cunene
              </Typography>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Base de dados de fornecedores
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Registe a sua empresa na nossa base de dados e tenha acesso a
                oportunidades de negócio com o sector público
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <img
                src="/mapa_cunene.svg"
                alt="Governo Provincial do Cunene"
                className="w-full h-full object-cover"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Registration Form */}
      <Container maxWidth="md" sx={{ pb: 8, mt: 8 }}>
        <Paper elevation={4} sx={{ p: 6, borderRadius: 3 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Formulário de Candidatura
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Preencha os dados da sua empresa para iniciar o processo de
              registo
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* Company Information */}
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", mb: 3 }}
            >
              <BusinessIcon sx={{ mr: 1, color: "primary.main" }} />
              Informações da Empresa
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Nome da Empresa"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="NIF"
                  name="nif"
                  value={formData.nif}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email da Empresa"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Endereço"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <LocationIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Sector de Actividade"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  required
                  variant="outlined"
                >
                  {companySectors.map((sector) => (
                    <MenuItem key={sector} value={sector}>
                      {sector}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website (Opcional)"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="https://www.exemplo.co.ao"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Contact Person */}
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", mb: 3 }}
            >
              <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
              Pessoa de Contacto
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Nome da Pessoa de Contacto"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Cargo/Função"
                  name="contactTitle"
                  value={formData.contactTitle}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Business Description */}
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", mb: 3 }}
            >
              <DescriptionIcon sx={{ mr: 1, color: "primary.main" }} />
              Descrição da Actividade
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição da Empresa"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Descreva brevemente a actividade principal da sua empresa..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Produtos/Serviços Oferecidos"
                  name="products"
                  value={formData.products}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Liste os principais produtos ou serviços que a sua empresa oferece..."
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Terms and Conditions */}
            <FormControlLabel
              control={
                <Checkbox
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
              }
              label="Autorizo o Governo Provincial do Cunene a utilizar os dados fornecidos para fins de registo como fornecedor"
            />

            {/* Submit Button */}
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!formData.acceptTerms}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                }}
              >
                Submeter Candidatura
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>

      {/* Footer Info */}
      <Box sx={{ bgcolor: "grey.900", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Governo Provincial do Cunene
              </Typography>
              <Typography variant="body2" paragraph>
                Departamento de Contratação Pública
                <br />
                Ondjiva, Província do Cunene
                <br />
                República de Angola
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Page;
