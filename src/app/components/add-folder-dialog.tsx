"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/AddBoxOutlined";
import { IconButton } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function AddFolderDialog({
  folders,
  formData,
  setFolders,
}: {
  folders: any;
  formData: any;
  setFolders: any;
}) {
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleAddFolder = async () => {
    // Check if folder already exists
    const folderExists = folders.some(
      (folder: any) => folder.label === formData.folder?.label
    );
    if (folderExists) {
      alert("Já existe uma pasta com esse nome.");
      return;
    }

    if (!label) {
      alert("Seleccione um nome para sua pasta.");
      return;
    }

    setLoading(true);

    const folderRef = await addDoc(collection(db, "folders"), { label });

    // Update folders state to include the new folder
    setFolders((prevFolders: any) => [
      ...prevFolders,
      { label: label, id: folderRef.id },
    ]);

    setLoading(true);

    alert("Pasta criada com sucesso!");
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton color="primary" onClick={handleClickOpen}>
        <AddIcon fontSize="large" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Criar nova pasta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Crie uma pasta para organizar seus documentos.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            label="Nome da pasta"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleAddFolder}>Criar pasta</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
