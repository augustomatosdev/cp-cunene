"use client";
import { db } from "@/lib/firebase";
import {
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Divider,
  Box,
  Grid,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import InfoIcon from "@mui/icons-material/Info";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Add interfaces for the form data and socio
interface Socio {
  responsavel: string;
  telefoneResponsavel: string;
  cargoResponsavel: string;
}

interface FormData {
  name: string;
  nif: string;
  provincia: string;
  telefone1: string;
  telefone2: string;
  email: string;
  inicio: string;
  tipo: string;
  descricao: string;
  status: string;
  address: string;
  registro: string;
  natureza: string;
  socios: Socio[];
}

interface FormErrors {
  [key: string]: string | null;
}

const Form = () => {
  const session = useSession();
  const user = session.data?.user;
  const { supplierId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});

  const [supplier, setSupplier] = useState<FormData | null>(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      const docRef = doc(db, "suppliers", supplierId as string);
      const docSnap = await getDoc(docRef);
      setSupplier(docSnap.data() as FormData);
    };
    fetchSupplier();
  }, [supplierId]);

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    }
  }, [supplier]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    nif: "",
    provincia: "",
    telefone1: "",
    telefone2: "",
    email: "",
    inicio: "",
    tipo: "",
    descricao: "",
    status: "Activo",
    address: "",
    registro: "",
    natureza: "",
    socios: [
      { responsavel: "", telefoneResponsavel: "", cargoResponsavel: "" },
    ],
  });

  const tipos = ["Produto", "Serviço"];
  const statuses = ["Activo", "Inactivo", "Suspenso"];
  const naturezas = [
    "Empresário em Nome Individual",
    "Sociedade Unipessoal por Quotas",
    "Sociedade por Quotas",
  ];

  // Form steps
  const steps = [
    { label: "Dados da empresa", icon: <BusinessIcon /> },
    { label: "Localização e contactos", icon: <LocationOnIcon /> },
    { label: "Quadro societário", icon: <PeopleIcon /> },
    { label: "Outras informações", icon: <InfoIcon /> },
  ];

  // Input validation
  const validateStep = (step: number): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {};

    if (step === 0) {
      if (!formData.name) {
        newErrors.name = "Nome da empresa é obrigatório";
        isValid = false;
      }
      if (!formData.nif) {
        newErrors.nif = "NIF é obrigatório";
        isValid = false;
      } else if (!/^\d+$/.test(formData.nif)) {
        newErrors.nif = "NIF deve conter apenas números";
        isValid = false;
      }
      if (!formData.natureza) {
        newErrors.natureza = "Natureza jurídica é obrigatória";
        isValid = false;
      }
      if (!formData.registro) {
        newErrors.registro = "Data de abertura é obrigatória";
        isValid = false;
      }
    } else if (step === 1) {
      if (!formData.address) {
        newErrors.address = "Endereço é obrigatório";
        isValid = false;
      }
      if (!formData.email) {
        newErrors.email = "Email é obrigatório";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email inválido";
        isValid = false;
      }
      if (!formData.telefone1) {
        newErrors.telefone1 = "Telefone 1 é obrigatório";
        isValid = false;
      }
    } else if (step === 2) {
      let sociosValid = true;
      formData.socios.forEach((socio, index) => {
        if (!socio.responsavel) {
          newErrors[`socio${index}responsavel`] = "Nome do sócio é obrigatório";
          sociosValid = false;
        }
        if (!socio.telefoneResponsavel) {
          newErrors[`socio${index}telefone`] = "Telefone é obrigatório";
          sociosValid = false;
        }
        if (!socio.cargoResponsavel) {
          newErrors[`socio${index}cargo`] = "Cargo é obrigatório";
          sociosValid = false;
        }
      });
      isValid = sociosValid;
    } else if (step === 3) {
      if (!formData.inicio) {
        newErrors.inicio = "Início do vínculo é obrigatório";
        isValid = false;
      }
      if (!formData.tipo) {
        newErrors.tipo = "Tipo é obrigatório";
        isValid = false;
      }
      if (!formData.descricao) {
        newErrors.descricao = "Descrição é obrigatória";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Regular field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedSocios = formData.socios.map((socio, i) => {
        if (i === index) {
          return { ...socio, [name]: value };
        }
        return socio;
      });

      setFormData((prev) => ({
        ...prev,
        socios: updatedSocios,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Separate handler for select fields
  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleAddSocio = () => {
    setFormData((prev) => ({
      ...prev,
      socios: [
        ...prev.socios,
        { responsavel: "", telefoneResponsavel: "", cargoResponsavel: "" },
      ],
    }));
  };

  const handleRemoveSocio = (index: number) => {
    if (formData.socios.length > 1) {
      setFormData((prev) => ({
        ...prev,
        socios: prev.socios.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async () => {
    // Validate final step
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      // Add a new document in the "suppliers" collection with server timestamp
      await updateDoc(doc(db, "suppliers", supplierId as string), {
        ...formData,
        createdAt: new Date().toISOString(), // Using server timestamp for better consistency
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email,
      });

      toast.success("Fornecedor actualizado com sucesso!");

      // Redirect to suppliers list after successful submission
      setTimeout(() => {
        router.push(`/supplier/${supplierId}/view`);
      }, 1500);
    } catch (err) {
      console.error("Error adding supplier:", err);
      toast.error(
        "Erro ao actualizar o fornecedor. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Render form content based on active step
  const renderStepContent = (step: number): JSX.Element | null => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography
              variant="subtitle1"
              color="primary"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <BusinessIcon sx={{ mr: 1 }} />
              Dados da empresa
            </Typography>

            <TextField
              size="small"
              label="Nome da empresa ou designação comercial"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              size="small"
              label="NIF"
              name="nif"
              value={formData.nif}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!!errors.nif}
              helperText={errors.nif}
            />

            <TextField
              size="small"
              select
              label="Natureza jurídica"
              name="natureza"
              value={formData.natureza}
              onChange={handleSelectChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!!errors.natureza}
              helperText={errors.natureza}
            >
              <MenuItem value="">Selecione uma opção</MenuItem>
              {naturezas.map((natureza) => (
                <MenuItem key={natureza} value={natureza}>
                  {natureza}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              label="Data de abertura"
              name="registro"
              type="date"
              value={formData.registro}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.registro}
              helperText={errors.registro}
            />
          </>
        );
      case 1:
        return (
          <>
            <Typography
              variant="subtitle1"
              color="primary"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <LocationOnIcon sx={{ mr: 1 }} />
              Localização e contactos
            </Typography>

            <TextField
              size="small"
              label="Endereço"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!!errors.address}
              helperText={errors.address}
            />

            <TextField
              size="small"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => window.open(`mailto:${formData.email}`)}
                      disabled={!formData.email}
                    >
                      <InfoIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.email}
              helperText={errors.email}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  label="Telefone 1"
                  name="telefone1"
                  value={formData.telefone1}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.telefone1}
                  helperText={errors.telefone1}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  label="Telefone 2"
                  name="telefone2"
                  value={formData.telefone2}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            <Typography
              variant="subtitle1"
              color="primary"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <PeopleIcon sx={{ mr: 1 }} />
              Quadro societário
            </Typography>

            {formData.socios.map((socio, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{ mb: 3, p: 2, position: "relative" }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Sócio {index + 1}
                </Typography>

                {formData.socios.length > 1 && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveSocio(index)}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}

                <TextField
                  size="small"
                  label="Nome do sócio"
                  name="responsavel"
                  value={socio.responsavel}
                  onChange={(e) =>
                    handleChange(
                      e as React.ChangeEvent<HTMLInputElement>,
                      index
                    )
                  }
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  error={!!errors[`socio${index}responsavel`]}
                  helperText={errors[`socio${index}responsavel`]}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      size="small"
                      label="Telefone"
                      name="telefoneResponsavel"
                      value={socio.telefoneResponsavel}
                      onChange={(e) =>
                        handleChange(
                          e as React.ChangeEvent<HTMLInputElement>,
                          index
                        )
                      }
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      required
                      error={!!errors[`socio${index}telefone`]}
                      helperText={errors[`socio${index}telefone`]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      size="small"
                      label="Cargo do sócio"
                      name="cargoResponsavel"
                      value={socio.cargoResponsavel}
                      onChange={(e) =>
                        handleChange(
                          e as React.ChangeEvent<HTMLInputElement>,
                          index
                        )
                      }
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      required
                      error={!!errors[`socio${index}cargo`]}
                      helperText={errors[`socio${index}cargo`]}
                    />
                  </Grid>
                </Grid>
              </Card>
            ))}

            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              color="primary"
              onClick={handleAddSocio}
              size="small"
              sx={{ mt: 1 }}
            >
              Adicionar Sócio
            </Button>
          </>
        );
      case 3:
        return (
          <>
            <Typography
              variant="subtitle1"
              color="primary"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <InfoIcon sx={{ mr: 1 }} />
              Outras informações
            </Typography>

            <TextField
              size="small"
              label="Início do vínculo"
              name="inicio"
              type="date"
              value={formData.inicio}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.inicio}
              helperText={errors.inicio}
            />

            <TextField
              size="small"
              select
              label="Tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleSelectChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={!!errors.tipo}
              helperText={errors.tipo}
            >
              <MenuItem value="">Selecione uma opção</MenuItem>
              {tipos.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              select
              label="Estado"
              name="status"
              value={formData.status}
              onChange={handleSelectChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              label="Descrição da empresa, produtos ou serviços"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
              required
              error={!!errors.descricao}
              helperText={errors.descricao}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconProps={{
                icon:
                  index === activeStep ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {step.icon}
                    </Box>
                  ) : (
                    index + 1
                  ),
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2, mb: 4 }}>{renderStepContent(activeStep)}</Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Voltar
        </Button>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            LinkComponent={Link}
            href="/suppliers"
            color="error"
            variant="outlined"
          >
            Cancelar
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              variant="contained"
              color="primary"
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          ) : (
            <Button onClick={handleNext} variant="contained" color="primary">
              Próximo
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default Form;
