"use client";
import {
  Button,
  MenuItem,
  TextField,
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Chip,
  Alert,
  Skeleton,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Autocomplete from "@mui/material/Autocomplete";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

// Define types
interface SupplierOption {
  label: string;
  id: string;
}

interface FormData {
  supplierId: string;
  supplierName: string;
  reference: string;
  description: string;
  startDate: string;
  endDate: string;
  amount: string;
  status: string;
  files: File[];
  object: string;
}

const statuses = ["Em andamento", "Concluido", "Cancelado"];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const Form: React.FC = () => {
  const session = useSession();
  const user = session.data?.user;
  const searchParams = useSearchParams();
  const supplierIdFromUrl = searchParams.get("supplierId");

  const [formData, setFormData] = useState<FormData>({
    supplierId: "",
    supplierName: "",
    reference: "",
    description: "",
    startDate: "",
    endDate: "",
    amount: "",
    status: "",
    files: [],
    object: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierOption | null>(null);
  const [loadingSupplier, setLoadingSupplier] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingSupplier(true);

        // Always fetch all suppliers for the autocomplete
        const suppliersCollection = collection(db, "suppliers");
        const supplierDocs = await getDocs(suppliersCollection);
        const supplierList = supplierDocs.docs.map((doc) => ({
          label: doc.data().name,
          id: doc.id,
        }));
        setSuppliers(supplierList);

        // If supplierId exists in URL, fetch the specific supplier data
        if (supplierIdFromUrl) {
          const supplierDoc = await getDoc(
            doc(db, "suppliers", supplierIdFromUrl)
          );

          if (supplierDoc.exists()) {
            const supplierData = supplierDoc.data();
            const preSelectedSupplier = {
              id: supplierIdFromUrl,
              label: supplierData.name,
            };

            // Set both the form data and selected supplier state
            setFormData((prev) => ({
              ...prev,
              supplierId: supplierIdFromUrl,
              supplierName: supplierData.name,
            }));

            setSelectedSupplier(preSelectedSupplier);
          } else {
            toast.error("Fornecedor não encontrado");
          }
        }
      } catch (error) {
        toast.error("Erro ao carregar fornecedores");
        console.error(error);
      } finally {
        setLoadingSupplier(false);
      }
    };

    fetchData();
  }, [supplierIdFromUrl]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSupplierChange = (
    event: React.SyntheticEvent,
    newValue: SupplierOption | null
  ) => {
    setSelectedSupplier(newValue);

    // Update form data with supplier info
    setFormData((prevData) => ({
      ...prevData,
      supplierId: newValue?.id || "",
      supplierName: newValue?.label || "",
    }));

    // Clear supplier error when selection is made
    if (errors.supplier) {
      setErrors((prev) => ({
        ...prev,
        supplier: "",
      }));
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setFormData((prevData) => ({
      ...prevData,
      files: files ? Array.from(files) : [],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Validate supplier - must have both ID and name
    if (!formData.supplierId || !formData.supplierName) {
      newErrors.supplier = "Por favor selecione um fornecedor";
    }

    if (!formData.reference) newErrors.reference = "Campo obrigatório";
    if (!formData.description) newErrors.description = "Campo obrigatório";
    if (!formData.startDate) newErrors.startDate = "Campo obrigatório";
    if (!formData.endDate) newErrors.endDate = "Campo obrigatório";
    if (!formData.object) newErrors.object = "Campo obrigatório";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Deve ser um número positivo";
    if (!formData.status) newErrors.status = "Campo obrigatório";

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate =
          "Data de término deve ser posterior à data de início";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setUploading(true);

    try {
      // Upload files to Firebase Storage
      const fileUrls = await Promise.all(
        formData.files.map(async (file) => {
          const timestamp = Date.now();
          const fileName = `${timestamp}_${file.name}`;
          const fileRef = ref(storage, `contracts/${fileName}`);
          await uploadBytes(fileRef, file);
          return {
            name: file.name,
            url: await getDownloadURL(fileRef),
          };
        })
      );

      // Prepare contract data
      const contractData = {
        supplier: formData.supplierName,
        supplierId: formData.supplierId,
        reference: formData.reference,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        amount: parseFloat(formData.amount),
        status: formData.status,
        object: formData.object,
        fileUrls, // Stores the URLs and names of uploaded files
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user?.email,
      };

      await addDoc(collection(db, "contracts"), contractData);

      // Reset form after successful submission (but keep supplier if from URL)
      setFormData({
        supplierId: supplierIdFromUrl || "",
        supplierName: selectedSupplier?.label || "",
        reference: "",
        description: "",
        startDate: "",
        endDate: "",
        amount: "",
        status: "",
        files: [],
        object: "",
      });

      // If no URL supplier, also reset the selected supplier
      if (!supplierIdFromUrl) {
        setSelectedSupplier(null);
      }

      toast.success("Contrato criado com sucesso!");
    } catch (error) {
      console.error("Error submitting contract: ", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar contrato"
      );
    } finally {
      setUploading(false);
    }
  };

  // Show loading state while fetching supplier data
  if (loadingSupplier && supplierIdFromUrl) {
    return (
      <Box sx={{ maxWidth: "1000px", mx: "auto", p: { xs: 2, md: 3 } }}>
        <Paper elevation={2} sx={{ mb: 3, borderRadius: 2, p: 3 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} height={24} sx={{ mt: 1 }} />
        </Paper>
        <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
          <Skeleton variant="rectangular" height={400} />
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1000px", mx: "auto", p: { xs: 2, md: 3 } }}>
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <DescriptionIcon
              sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
            />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Novo Contrato
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preencha os dados do contrato abaixo
              </Typography>
            </Box>
          </Box>

          {/* Show selected supplier if coming from URL */}
          {supplierIdFromUrl && selectedSupplier && (
            <Box sx={{ mt: 2 }}>
              <Chip
                icon={<BusinessIcon />}
                label={`Fornecedor: ${selectedSupplier.label}`}
                color="primary"
                variant="outlined"
                size="medium"
              />
            </Box>
          )}
        </Box>
      </Paper>

      {/* Form */}
      <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* Supplier Selection - only show if not pre-selected from URL */}
          {!supplierIdFromUrl && (
            <>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <BusinessIcon sx={{ mr: 1 }} />
                Fornecedor
              </Typography>
              <Autocomplete
                disablePortal
                size="small"
                options={suppliers}
                value={selectedSupplier}
                onChange={handleSupplierChange}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Nome da empresa ou designação comercial"
                    error={!!errors.supplier}
                    helperText={errors.supplier}
                    required
                  />
                )}
                sx={{ mb: 3 }}
              />
              <Divider sx={{ my: 3 }} />
            </>
          )}

          {/* Contract Data */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <DescriptionIcon sx={{ mr: 1 }} />
            Dados do Contrato
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                label="Nº ou Referência do contrato"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                error={!!errors.reference}
                helperText={errors.reference}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                select
                label="Estado"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                error={!!errors.status}
                helperText={errors.status}
              >
                <MenuItem value="">Selecione uma opção</MenuItem>
                {statuses.map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <TextField
            size="small"
            label="Objecto do contrato"
            name="object"
            value={formData.object}
            onChange={handleChange}
            fullWidth
            rows={2}
            multiline
            margin="normal"
            variant="outlined"
            required
            error={!!errors.object}
            helperText={errors.object}
          />

          <TextField
            size="small"
            label="Observações"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            rows={3}
            multiline
            margin="normal"
            variant="outlined"
            required
            error={!!errors.description}
            helperText={errors.description}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                size="small"
                label="Data de início"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
                error={!!errors.startDate}
                helperText={errors.startDate}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                size="small"
                label="Data de término"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
                error={!!errors.endDate}
                helperText={errors.endDate}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                size="small"
                label="Valor financeiro (AOA)"
                name="amount"
                type="number"
                inputProps={{ min: "0", step: "0.01" }}
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                error={!!errors.amount}
                helperText={errors.amount}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* File Upload */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <AttachFileIcon sx={{ mr: 1 }} />
            Anexos
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              size="medium"
            >
              Anexar ficheiros
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </Button>
            {formData.files.length > 0 && (
              <Chip
                label={`${formData.files.length} ficheiro(s) selecionado(s)`}
                color="success"
                variant="outlined"
                size="small"
              />
            )}
          </Box>

          {/* Show selected files */}
          {formData.files.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ficheiros selecionados:
              </Typography>
              {formData.files.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Form Actions */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              component={Link}
              href="/contracts"
              variant="outlined"
              color="error"
              size="large"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={uploading}
            >
              {uploading ? "Criando contrato..." : "Criar Contrato"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
