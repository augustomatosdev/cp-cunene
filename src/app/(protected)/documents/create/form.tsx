"use client";
import { Button, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Autocomplete from "@mui/material/Autocomplete";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Link from "next/link";
import { toast } from "react-toastify";

// Define types
interface SupplierOption {
  label: string;
  id: string;
}

interface FormData {
  supplier: SupplierOption | null;
  reference: string;
  description: string;
  startDate: string;
  files: File[];
  title: string;
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
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("supplierId");
  const supplierName = searchParams.get("supplierName");

  const [formData, setFormData] = useState<FormData>({
    supplier:
      supplierId && supplierName
        ? {
            id: supplierId,
            label: supplierName,
          }
        : null,
    reference: "",
    description: "",
    startDate: "",
    files: [],
    title: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        if (!supplierId && !supplierName) {
          const suppliersCollection = collection(db, "suppliers");
          const supplierDocs = await getDocs(suppliersCollection);
          const supplierList = supplierDocs.docs.map((doc) => ({
            label: doc.data().name,
            id: doc.id,
          }));
          setSuppliers(supplierList);
        }

        // If supplierId exists, set the initial supplier
        if (supplierId && supplierName) {
          setFormData((prev) => ({
            ...prev,
            supplier: {
              id: supplierId,
              label: supplierName,
            },
          }));
        }
      } catch (error) {
        toast.error("Error fetching suppliers");
        console.error(error);
      }
    };

    fetchSuppliers();
  }, [supplierId, supplierName]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    event: React.SyntheticEvent,
    newValue: SupplierOption | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      supplier: newValue,
    }));
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
    if (!formData.reference) newErrors.reference = "Required";
    if (!formData.description) newErrors.description = "Required";
    if (!formData.startDate) newErrors.startDate = "Required";
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
          const fileRef = ref(storage, `contracts/${file.name}`);
          await uploadBytes(fileRef, file);
          return getDownloadURL(fileRef);
        })
      );

      // Add document to Firestore
      const documentData = {
        supplier: supplierName || formData.supplier?.label,
        supplierId: supplierId || formData.supplier?.id,
        reference: formData.reference,
        description: formData.description,
        startDate: formData.startDate,
        fileUrls, // Stores the URLs of uploaded files
        createdAt: new Date().toISOString(),
        title: formData.title,
      };

      console.log({ documentData });

      if (!documentData.supplier || !documentData.supplierId) {
        throw new Error("Supplier information is required");
      }

      await addDoc(collection(db, "documents"), documentData);

      // Reset form after successful submission
      setFormData({
        supplier: null,
        reference: "",
        description: "",
        startDate: "",
        files: [],
        title: "",
      });

      toast.success("Documento enviado com sucesso!");
    } catch (error) {
      console.error("Error submitting contract: ", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar contrato"
      );
    } finally {
      setUploading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {!supplierId && (
        <>
          <p className="font-semibold text-sm text-zinc-600">
            Selecionar fornecedor relacionado:
          </p>
          <Autocomplete
            disablePortal
            size="small"
            options={suppliers}
            value={formData.supplier}
            onChange={handleSelectChange}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                label="Nome da empresa ou designação comercial"
                error={!!errors.supplier}
                helperText={errors.supplier}
              />
            )}
          />
        </>
      )}
      <p className="font-semibold text-sm text-zinc-600 mt-4">
        Dados do documento:
      </p>
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
        rows={2}
        multiline
        margin="normal"
        variant="outlined"
        required
        error={!!errors.description}
        helperText={errors.description}
      />
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
      <div className="mt-2 flex items-center">
        <Button
          component="label"
          role={undefined}
          variant="outlined"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Anexar ficheiro
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </Button>
        {formData.files.length > 0 && (
          <p className="text-xs text-zinc-600 font-bold ml-4">
            Documento adicionado!
          </p>
        )}
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button
          type="button"
          LinkComponent={Link}
          href={`/contracts`}
          color="error"
          variant="outlined"
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="mt-4"
          disabled={uploading}
        >
          {uploading ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </form>
  );
};
