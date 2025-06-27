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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import Autocomplete from "@mui/material/Autocomplete";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

// Define types
interface SupplierOption {
  label: string;
  id: string;
}

interface ExistingFile {
  name: string;
  url: string;
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
  object: string;
  fileUrls?: ExistingFile[];
}

interface ContractData extends FormData {
  id: string;
  createdAt: any;
  updatedAt: any;
  createdBy?: string;
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
  const { contractId } = useParams();
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;

  const [formData, setFormData] = useState<FormData>({
    supplierId: "",
    supplierName: "",
    reference: "",
    description: "",
    startDate: "",
    endDate: "",
    amount: "",
    status: "",
    object: "",
    fileUrls: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierOption | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);

  // Fetch contract data
  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);

        if (!contractId) {
          toast.error("ID do contrato não encontrado");
          router.push("/contracts");
          return;
        }

        const contractDoc = await getDoc(
          doc(db, "contracts", contractId as string)
        );

        if (!contractDoc.exists()) {
          toast.error("Contrato não encontrado");
          router.push("/contracts");
          return;
        }

        const contractData: any = contractDoc.data() as ContractData;

        // Set form data
        setFormData({
          supplierId: contractData.supplierId || "",
          supplierName:
            contractData.supplierName || contractData.supplier || "",
          reference: contractData.reference || "",
          description: contractData.description || "",
          startDate: contractData.startDate || "",
          endDate: contractData.endDate || "",
          amount: contractData.amount?.toString() || "",
          status: contractData.status || "",
          object: contractData.object || "",
          fileUrls: contractData.fileUrls || [],
        });

        // Set existing files
        setExistingFiles(contractData.fileUrls || []);

        // Set selected supplier
        if (contractData.supplierId && contractData.supplierName) {
          setSelectedSupplier({
            id: contractData.supplierId,
            label: contractData.supplierName || contractData.supplier || "",
          });
        }
      } catch (error) {
        console.error("Error fetching contract:", error);
        toast.error("Erro ao carregar contrato");
        router.push("/contracts");
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [contractId, router]);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliersCollection = collection(db, "suppliers");
        const supplierDocs = await getDocs(suppliersCollection);
        const supplierList = supplierDocs.docs.map((doc) => ({
          label: doc.data().name,
          id: doc.id,
        }));
        setSuppliers(supplierList);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        toast.error("Erro ao carregar fornecedores");
      }
    };

    fetchSuppliers();
  }, []);

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

  const handleNewFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setNewFiles(files ? Array.from(files) : []);
  };

  const handleDeleteExistingFile = (fileUrl: string, fileName: string) => {
    // Remove from existing files display
    setExistingFiles((prev) => prev.filter((file) => file.url !== fileUrl));

    // Add to deletion queue
    setFilesToDelete((prev) => [...prev, fileUrl]);

    toast.info(`${fileName} será removido ao salvar`);
  };

  const handleDeleteNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
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
      // Upload new files to Firebase Storage
      const newFileUrls = await Promise.all(
        newFiles.map(async (file) => {
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

      // Delete files marked for deletion
      await Promise.all(
        filesToDelete.map(async (fileUrl) => {
          try {
            const fileRef = ref(storage, fileUrl);
            await deleteObject(fileRef);
          } catch (error) {
            console.warn("Error deleting file:", error);
            // Continue even if file deletion fails
          }
        })
      );

      // Combine existing files (not deleted) with new files
      const finalFileUrls = [...existingFiles, ...newFileUrls];

      // Prepare updated contract data
      const updatedContractData = {
        supplier: formData.supplierName,
        supplierName: formData.supplierName, // Keep both for compatibility
        supplierId: formData.supplierId,
        reference: formData.reference,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        amount: parseFloat(formData.amount),
        status: formData.status,
        object: formData.object,
        fileUrls: finalFileUrls,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email,
      };

      // Update document in Firestore
      await updateDoc(
        doc(db, "contracts", contractId as string),
        updatedContractData
      );

      toast.success("Contrato atualizado com sucesso!");
      router.push("/contracts");
    } catch (error) {
      console.error("Error updating contract: ", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar contrato"
      );
    } finally {
      setUploading(false);
    }
  };

  // Show loading state while fetching contract data
  if (loading) {
    return (
      <Box sx={{ maxWidth: "1000px", mx: "auto", p: { xs: 2, md: 3 } }}>
        <Paper elevation={2} sx={{ mb: 3, borderRadius: 2, p: 3 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} height={24} sx={{ mt: 1 }} />
        </Paper>
        <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
          <Skeleton variant="rectangular" height={600} />
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
            <EditIcon sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Editar Contrato
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Atualize os dados do contrato abaixo
              </Typography>
            </Box>
          </Box>

          {/* Show contract reference */}
          <Box sx={{ mt: 2 }}>
            <Chip
              icon={<DescriptionIcon />}
              label={`Referência: ${formData.reference}`}
              color="primary"
              variant="outlined"
              size="medium"
            />
          </Box>
        </Box>
      </Paper>

      {/* Form */}
      <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* Supplier Selection */}
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

          {/* File Management */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <AttachFileIcon sx={{ mr: 1 }} />
            Anexos
          </Typography>

          {/* Existing Files */}
          {existingFiles.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Arquivos existentes:
              </Typography>
              <List dense>
                {existingFiles.map((file, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={file.name}
                      secondary="Arquivo existente"
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="download"
                        onClick={() => window.open(file.url, "_blank")}
                        sx={{ mr: 1 }}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() =>
                          handleDeleteExistingFile(file.url, file.name)
                        }
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Add New Files */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              size="medium"
            >
              Adicionar novos ficheiros
              <VisuallyHiddenInput
                type="file"
                onChange={handleNewFileChange}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </Button>
            {newFiles.length > 0 && (
              <Chip
                label={`${newFiles.length} novo(s) ficheiro(s) selecionado(s)`}
                color="success"
                variant="outlined"
                size="small"
              />
            )}
          </Box>

          {/* Show new files to be uploaded */}
          {newFiles.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Novos ficheiros a serem adicionados:
              </Typography>
              <List dense>
                {newFiles.map((file, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={file.name}
                      secondary="Novo arquivo"
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteNewFile(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
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
              {uploading ? "Atualizando contrato..." : "Atualizar Contrato"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
