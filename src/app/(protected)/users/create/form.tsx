"use client";
import { Button, MenuItem, TextField } from "@mui/material";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Define types
interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const roles = ["admin", "user"];

export const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email deve ter um formato válido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!formData.role) {
      newErrors.role = "Função é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      // Add user document to Firestore
      const userData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password, // Note: In production, hash the password before storing
        role: formData.role,
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      console.log({ userData });

      await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      await addDoc(collection(db, "users"), userData);

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
      });

      toast.success("Usuário criado com sucesso!");
    } catch (error) {
      console.error("Error creating user: ", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar usuário"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="font-semibold text-sm text-zinc-600">Dados do usuário:</p>

      <TextField
        size="small"
        label="Nome completo"
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
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
        required
        error={!!errors.email}
        helperText={errors.email}
      />

      <TextField
        size="small"
        label="Senha"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
        required
        error={!!errors.password}
        helperText={errors.password}
      />

      <TextField
        size="small"
        select
        label="Função"
        name="role"
        value={formData.role}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
        required
        error={!!errors.role}
        helperText={errors.role}
      >
        <MenuItem value="">Selecione uma função</MenuItem>
        {roles.map((role, index) => (
          <MenuItem key={index} value={role}>
            {role === "admin" ? "Administrador" : "Usuário"}
          </MenuItem>
        ))}
      </TextField>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          type="button"
          LinkComponent={Link}
          href="/users"
          color="error"
          variant="outlined"
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting}
        >
          {submitting ? "Criando..." : "Criar Usuário"}
        </Button>
      </div>
    </form>
  );
};
