"use client";
import { db } from "@/lib/firebase";
import { TextField, Button, MenuItem } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const [formData, setFormData] = useState({
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

  // Regular field change handler
  const handleChange = (e: any, index?: number) => {
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
  };

  // Separate handler for select fields
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Add a new document in the "suppliers" collection
      await addDoc(collection(db, "suppliers"), {
        ...formData,
        createdAt: new Date(), // Timestamp
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        nif: "",
        provincia: "",
        telefone1: "",
        telefone2: "",
        email: "",
        inicio: "",
        tipo: "",
        descricao: "",
        address: "",
        status: "Activo",
        registro: "",
        natureza: "",
        socios: [
          { responsavel: "", telefoneResponsavel: "", cargoResponsavel: "" },
        ],
      });

      alert("Fornecedor cadastrado com sucesso!");
    } catch (err) {
      setError("Erro ao cadastrar o fornecedor. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      <p className="font-semibold text-sm text-zinc-600">
        1. Dados da empresa:
      </p>
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
      />

      {/* Updated Select Field for Natureza */}
      <TextField
        size="small"
        select
        label="Natureza juridica"
        name="natureza"
        value={formData.natureza}
        onChange={handleSelectChange}
        fullWidth
        margin="normal"
        variant="outlined"
        required
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
      />
      <p className="font-semibold text-sm text-zinc-600 mt-4">
        2. Localização e contactos:
      </p>

      {/* Endereço Fields */}
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
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Contact Fields */}
        <TextField
          size="small"
          label="Telefone 1"
          name="telefone1"
          value={formData.telefone1}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          size="small"
          label="Telefone 2"
          name="telefone2"
          value={formData.telefone2}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
      </div>

      <p className="font-semibold text-sm text-zinc-600 mt-4">
        3. Quadro societário:
      </p>

      {formData.socios.map((socio, index) => (
        <div key={index} className="mb-4">
          <TextField
            size="small"
            label="Nome do sócio"
            name="responsavel"
            value={socio.responsavel}
            onChange={(e) => handleChange(e, index)}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              size="small"
              label="Telefone"
              name="telefoneResponsavel"
              value={socio.telefoneResponsavel}
              onChange={(e) => handleChange(e, index)}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              size="small"
              label="Cargo do socio"
              name="cargoResponsavel"
              value={socio.cargoResponsavel}
              onChange={(e) => handleChange(e, index)}
              margin="normal"
              variant="outlined"
              required
            />
          </div>
        </div>
      ))}

      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        color="primary"
        onClick={handleAddSocio}
        size="small"
      >
        Adicionar Sócio
      </Button>

      <p className="font-semibold text-sm text-zinc-600 mt-4">
        4. Outras informações:
      </p>
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
      />

      {/* Tipo Field */}
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
      >
        <MenuItem value="">Selecione uma opção</MenuItem>
        {tipos.map((tipo) => (
          <MenuItem key={tipo} value={tipo}>
            {tipo}
          </MenuItem>
        ))}
      </TextField>

      {/* Status Field */}
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

      {/* Descrição Field */}
      <TextField
        size="small"
        label="Descrição da empresa produtos ou serviços"
        name="descricao"
        value={formData.descricao}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
        multiline
        rows={4}
        required
      />

      {/* Buttons */}
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
        <Button onClick={handleSubmit} disabled={loading} variant="contained">
          Cadastrar
        </Button>
      </div>
    </form>
  );
};

export default Form;
