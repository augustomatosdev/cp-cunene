"use client";
import { Button, IconButton, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/AddBoxOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Link from "next/link";
import { AddFolderDialog } from "@/app/components/add-folder-dialog";

// Define types
interface FolderOption {
  label: string;
  id: number;
}

interface FormData {
  folder: FolderOption | null;
  reference: string;
  office: string;
  description: string;
  documentDate: string;
  files: File[];
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
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("supplierId");

  const [formData, setFormData] = useState<FormData>({
    folder: null,
    office: "",
    reference: "",
    description: "",
    documentDate: "",
    files: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [folders, setFolders] = useState<FolderOption[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const foldersCollection = collection(db, "folders");
      const folderDocs: any = await getDocs(foldersCollection);
      const folderList = folderDocs.docs.map((doc: any) => ({
        label: doc.data().label,
        id: doc.id,
      })) as FolderOption[];
      setFolders(folderList);
    };

    fetchFolders();
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
    newValue: FolderOption | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      folder: newValue,
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
    if (!formData.documentDate) newErrors.startDate = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setUploading(true);

    try {
      const fileUrls = await Promise.all(
        formData.files.map(async (file) => {
          const fileRef = ref(storage, `documents/${file.name}`);
          await uploadBytes(fileRef, file);
          return getDownloadURL(fileRef);
        })
      );

      const documentData = {
        supplier: supplierId,
        folderId: formData.folder?.id,
        folder: formData.folder?.label,
        office: formData.office,
        reference: formData.reference,
        description: formData.description,
        documentDate: formData.documentDate,
        fileUrls,
      };

      await addDoc(collection(db, "documents"), documentData);

      setFormData({
        folder: null,
        office: "",
        reference: "",
        description: "",
        documentDate: "",
        files: [],
      });

      alert("Documento enviado com sucesso!");
    } catch (error) {
      console.error("Error submitting document: ", error);
      alert("Failed to submit the document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="font-semibold text-sm text-zinc-600">Selecionar pasta:</p>
      <div className="flex items-center">
        <Autocomplete
          disablePortal
          size="small"
          options={folders}
          value={formData.folder}
          fullWidth
          onChange={handleSelectChange}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Nome da pasta"
              error={!!errors.folder}
              helperText={errors.folder}
            />
          )}
        />
      </div>

      <p className="font-semibold text-sm text-zinc-600 mt-4">
        Informações do documento:
      </p>
      <TextField
        size="small"
        label="Destinatário / Origem"
        name="office"
        value={formData.office}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
        required
        error={!!errors.office}
        helperText={errors.office}
      />
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
      <TextField
        size="small"
        label="Data do documento"
        name="documentDate"
        type="date"
        value={formData.documentDate}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
        error={!!errors.documentDate}
        helperText={errors.documentDate}
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
          href={`/`}
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
