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
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export function AddFolderDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { data: session } = useSession();

  const user: any = session?.user;

  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleAddFolder = async () => {
    if (!name) {
      alert("Seleccione um nome para sua pasta.");
      return;
    }
    setLoading(true);

    try {
      //check if folder already exists
      const folderRef = await getDoc(doc(db, "folders", name));
      if (folderRef.exists()) {
        toast.error("Já existe uma pasta com esse nome.");
        return;
      }
      await addDoc(collection(db, "folders"), {
        name,
        createdAt: new Date(),
        createdBy: user?.email,
      });
      setLoading(false);
      toast.success("Pasta criada com sucesso!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar pasta.");
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Nome da pasta"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={loading} onClick={handleAddFolder}>
            {loading ? "Criando..." : "Criar pasta"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
