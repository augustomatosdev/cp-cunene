"use client";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Chip,
  Alert,
  Skeleton,
  MenuItem,
} from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FolderIcon from "@mui/icons-material/Folder";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DeleteIcon from "@mui/icons-material/Delete";
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

interface FolderOption {
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
  files: File[];
  title: string;
  folderId: string;
  folderName: string;
  office: string;
  existingFiles: ExistingFile[];
}

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
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;
  const { data: session } = useSession();
  const user: any = session?.user;

  const [formData, setFormData] = useState<FormData>({
    supplierId: "",
    supplierName: "",
    reference: "",
    description: "",
    startDate: "",
    files: [],
    title: "",
    folderId: "",
    folderName: "",
    office: "",
    existingFiles: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [folders, setFolders] = useState<FolderOption[]>([]);
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierOption | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderOption | null>(
    null
  );
  const [loadingData, setLoadingData] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState<ExistingFile[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);

        // Fetch document data
        const documentDoc = await getDoc(doc(db, "documents", documentId));
        if (!documentDoc.exists()) {
          toast.error("Documento não encontrado");
          return;
        }

        const documentData = documentDoc.data();

        // Fetch all suppliers for the autocomplete
        const suppliersCollection = collection(db, "suppliers");
        const supplierDocs = await getDocs(suppliersCollection);
        const supplierList = supplierDocs.docs.map((doc) => ({
          label: doc.data().name,
          id: doc.id,
        }));
        setSuppliers(supplierList);

        // Fetch all folders for the autocomplete
        const foldersCollection = collection(db, "folders");
        const folderDocs = await getDocs(foldersCollection);
        const folderList = folderDocs.docs.map((doc) => ({
          label: doc.data().name,
          id: doc.id,
        }));
        setFolders(folderList);

        // Set form data from document
        setFormData({
          supplierId: documentData.supplierId || "",
          supplierName: documentData.supplier || "",
          reference: documentData.reference || "",
          description: documentData.description || "",
          startDate: documentData.startDate || "",
          files: [],
          title: documentData.title || "",
          folderId: documentData.folderId || "",
          folderName: documentData.folder || "",
          office: documentData.office || "",
          existingFiles: documentData.fileUrls || [],
        });

        // Set selected supplier if exists
        if (documentData.supplierId && documentData.supplier) {
          const supplier = {
            id: documentData.supplierId,
            label: documentData.supplier,
          };
          setSelectedSupplier(supplier);
        }

        // Set selected folder if exists
        if (documentData.folderId && documentData.folder) {
          const folder = {
            id: documentData.folderId,
            label: documentData.folder,
          };
          setSelectedFolder(folder);
        }
      } catch (error) {
        toast.error("Erro ao carregar dados do documento");
        console.error(error);
      } finally {
        setLoadingData(false);
      }
    };

    if (documentId) {
      fetchData();
    }
  }, [documentId]);

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

  const handleFolderChange = (
    event: React.SyntheticEvent,
    newValue: FolderOption | null
  ) => {
    setSelectedFolder(newValue);

    // Update form data with folder info
    setFormData((prevData) => ({
      ...prevData,
      folderId: newValue?.id || "",
      folderName: newValue?.label || "",
    }));

    // Clear folder error when selection is made
    if (errors.folder) {
      setErrors((prev) => ({
        ...prev,
        folder: "",
      }));
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setFormData((prevData) => ({
      ...prevData,
      files: files ? Array.from(files) : [],
    }));

    // Clear file error when files are selected
    if (errors.files) {
      setErrors((prev) => ({
        ...prev,
        files: "",
      }));
    }
  };

  const handleRemoveExistingFile = (fileToRemove: ExistingFile) => {
    // Add to files to delete
    setFilesToDelete((prev) => [...prev, fileToRemove]);

    // Remove from existing files
    setFormData((prev) => ({
      ...prev,
      existingFiles: prev.existingFiles.filter(
        (file) => file.url !== fileToRemove.url
      ),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Basic required fields
    if (!formData.reference) newErrors.reference = "Campo obrigatório";
    if (!formData.title) newErrors.title = "Campo obrigatório";
    if (!formData.description) newErrors.description = "Campo obrigatório";
    if (!formData.startDate) newErrors.startDate = "Campo obrigatório";

    // Validate that at least one file exists (existing or new)
    if (formData.existingFiles.length === 0 && formData.files.length === 0) {
      newErrors.files = "Por favor mantenha ou adicione pelo menos um ficheiro";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setUploading(true);

    try {
      // Delete files marked for deletion
      await Promise.all(
        filesToDelete.map(async (file) => {
          try {
            const fileRef = ref(storage, file.url);
            await deleteObject(fileRef);
          } catch (error) {
            console.warn("Error deleting file:", error);
          }
        })
      );

      // Upload new files to Firebase Storage
      const newFileUrls = await Promise.all(
        formData.files.map(async (file) => {
          const timestamp = Date.now();
          const fileName = `${timestamp}_${file.name}`;
          const fileRef = ref(storage, `documents/${fileName}`);
          await uploadBytes(fileRef, file);
          return {
            name: file.name,
            url: await getDownloadURL(fileRef),
          };
        })
      );

      // Combine existing files (not deleted) with new files
      const allFileUrls = [...formData.existingFiles, ...newFileUrls];

      // Prepare document data for update
      const updateData = {
        // Supplier info (optional)
        supplier: formData.supplierName || null,
        supplierId: formData.supplierId || null,

        // Folder info (optional)
        folder: formData.folderName || null,
        folderId: formData.folderId || null,

        // Office info (optional)
        office: formData.office || null,

        // Required fields
        reference: formData.reference,
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        fileUrls: allFileUrls, // Updated file list

        // Update metadata
        updatedBy: user?.email,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "documents", documentId), updateData);

      toast.success("Documento actualizado com sucesso!");
      router.push(`/documents`);
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao actualizar documento"
      );
    } finally {
      setUploading(false);
    }
  };

  // Show loading state while fetching data
  if (loadingData) {
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
                Actualizar Documento
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Modifique os dados do documento abaixo
              </Typography>
            </Box>
          </Box>

          {/* Show selected supplier if exists */}
          {selectedSupplier && (
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
          {/* Document Data */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <DescriptionIcon sx={{ mr: 1 }} />
            Dados do Documento
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                label="Nº ou Referência do documento"
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
                label="Data de emissão"
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
          </Grid>

          <TextField
            size="small"
            label="Título do documento"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            error={!!errors.title}
            helperText={errors.title}
          />

          <TextField
            size="small"
            label="Descrição do documento"
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

          <Divider sx={{ my: 3 }} />

          {/* Optional Fields Section */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <ApartmentIcon sx={{ mr: 1 }} />
            Informações Adicionais (Opcional)
          </Typography>

          {/* Office Field */}
          <TextField
            size="small"
            label="Destinatário / Origem"
            name="office"
            value={formData.office}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            placeholder="Ex: Gabinete Jurídico, Departamento de Recursos Humanos etc..."
            helperText="Especifique o departamento ou escritório relacionado ao documento"
          />

          <Grid container spacing={2}>
            {/* Supplier Selection */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mt: 2, mb: 1 }}
              >
                <BusinessIcon sx={{ mr: 1, fontSize: 20 }} />
                Fornecedor (Opcional)
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
                    label="Nome da empresa"
                    error={!!errors.supplier}
                    helperText={errors.supplier}
                    placeholder="Selecione um fornecedor..."
                  />
                )}
              />
            </Grid>

            {/* Folder Selection */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mt: 2, mb: 1 }}
              >
                <FolderIcon sx={{ mr: 1, fontSize: 20 }} />
                Pasta (Opcional)
              </Typography>
              <Autocomplete
                disablePortal
                size="small"
                options={folders}
                value={selectedFolder}
                onChange={handleFolderChange}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nome da pasta"
                    error={!!errors.folder}
                    helperText={errors.folder}
                    placeholder="Selecione uma pasta..."
                  />
                )}
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
            Gestão de Anexos
          </Typography>

          {/* Existing Files */}
          {formData.existingFiles.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Ficheiros Actuais:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.existingFiles.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    variant="outlined"
                    color="primary"
                    size="small"
                    onDelete={() => handleRemoveExistingFile(file)}
                    deleteIcon={<DeleteIcon />}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Add New Files */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              size="medium"
              color={errors.files ? "error" : "primary"}
            >
              Adicionar novos ficheiros
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
              />
            </Button>
            {formData.files.length > 0 && (
              <Chip
                label={`${formData.files.length} novo(s) ficheiro(s) selecionado(s)`}
                color="success"
                variant="outlined"
                size="small"
              />
            )}
          </Box>

          {/* File validation error */}
          {errors.files && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.files}
            </Alert>
          )}

          {/* Show new files to be added */}
          {formData.files.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Novos ficheiros a adicionar:
              </Typography>
              {formData.files.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  variant="outlined"
                  color="success"
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
              href="/documents"
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
              {uploading ? "Actualizando documento..." : "Actualizar Documento"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
