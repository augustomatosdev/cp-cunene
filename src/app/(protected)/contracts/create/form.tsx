"use client";
import { Button, MenuItem, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Autocomplete, {
  AutocompleteChangeReason,
} from "@mui/material/Autocomplete";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Link from "next/link";

// Define types
interface SupplierOption {
  label: string;
  id: number;
}

interface FormData {
  supplier: SupplierOption | null;
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
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("supplierId");
  const supplierName = searchParams.get("supplierName");

  const [formData, setFormData] = useState<FormData>({
    supplier: null,
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

  useEffect(() => {
    const fetchSuppliers = async () => {
      const suppliersCollection = collection(db, "suppliers");
      const supplierDocs: any = await getDocs(suppliersCollection);
      const supplierList = supplierDocs.docs.map((doc: any) => ({
        label: doc.data().name,
        id: doc.id,
      })) as SupplierOption[];
      setSuppliers(supplierList);
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
    if (!formData.endDate) newErrors.endDate = "Required";
    if (!formData.object) newErrors.object = "Required";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Must be a positive number";
    if (!formData.status) newErrors.status = "Required";
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
      const contractData = {
        supplier:
          supplierName || (formData.supplier ? formData.supplier.label : null),
        supplierId:
          supplierId || (formData.supplier ? formData.supplier.id : null),
        reference: formData.reference,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        amount: formData.amount,
        status: formData.status,
        object: formData.object,
        fileUrls, // Stores the URLs of uploaded files
      };

      await addDoc(collection(db, "contracts"), contractData);

      // Reset form after successful submission
      setFormData({
        supplier: null,
        reference: "",
        description: "",
        startDate: "",
        endDate: "",
        amount: "",
        status: "",
        files: [],
        object: "",
      });

      alert("Contrato enviado com sucesso!");
    } catch (error) {
      console.error("Error submitting contract: ", error);
      alert("Failed to submit the contract. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {!supplierId && (
        <>
          <p className="font-semibold text-sm text-zinc-600">
            Selecionar fornecedor:
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
        Dados do contrato:
      </p>
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
        label="Data de inicio"
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
      <TextField
        size="small"
        label="Valor financeiro do contrato"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
        required
        error={!!errors.amount}
        helperText={errors.amount}
      />
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
