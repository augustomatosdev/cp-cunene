"use client";
import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  Chip,
  Tooltip,
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { MRT_Localization_PT } from "material-react-table/locales/pt";
import { useRouter } from "next/navigation";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArticleIcon from "@mui/icons-material/Article";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Contract = {
  id: string;
  status: string;
  reference: string;
  fileUrls: string[];
  startDate: string;
  endDate: string;
  amount: number;
  object: string;
  description: string;
  createdAt: any;
};

const ContractsTable = ({ data }: { data: Contract[] }) => {
  const router = useRouter();
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Download files function
  const downloadFiles = (fileUrls: string[]) => {
    if (!fileUrls || fileUrls.length === 0) {
      alert("Não há arquivos disponíveis para download.");
      return;
    }

    fileUrls.forEach((url: string) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = ""; // Specify a filename if you want, or let it use the default
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Handle contract status
  const handleContractStatus = (status: string) => {
    let color: "success" | "error" | "warning" | "default" = "default";

    switch (status?.toLowerCase()) {
      case "ativo":
      case "activo":
      case "active":
        color = "success";
        break;
      case "expirado":
      case "expired":
      case "inativo":
      case "inactive":
        color = "error";
        break;
      case "pendente":
      case "pending":
        color = "warning";
        break;
      default:
        color = "default";
    }

    return (
      <Chip
        size="small"
        color={color}
        label={status || "N/A"}
        variant="outlined"
      />
    );
  };

  // Mark contract as complete handler
  const handleMarkComplete = () => {
    if (!selectedContract) return;

    setIsLoading(true);
    // In a real app, you would update the contract status in Firebase here
    // Example:
    // const contractRef = doc(db, "contracts", selectedContract.id);
    // updateDoc(contractRef, { status: "Concluído" })
    //   .then(() => {
    //     // Success handling
    //   })
    //   .catch((error) => {
    //     // Error handling
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //     setCompleteDialogOpen(false);
    //   });

    // Mock update for demo
    setTimeout(() => {
      setIsLoading(false);
      setCompleteDialogOpen(false);
      alert("Contrato marcado como concluído com sucesso!");
    }, 1500);
  };

  // Delete contract handler
  const handleDelete = () => {
    if (!selectedContract) return;

    setIsLoading(true);
    // In a real app, you would delete the contract from Firebase here
    // Example:
    // const contractRef = doc(db, "contracts", selectedContract.id);
    // deleteDoc(contractRef)
    //   .then(() => {
    //     // Success handling
    //   })
    //   .catch((error) => {
    //     // Error handling
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //     setDeleteDialogOpen(false);
    //   });

    // Mock deletion for demo
    setTimeout(() => {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      alert("Contrato eliminado com sucesso!");
    }, 1500);
  };

  const columns = useMemo<MRT_ColumnDef<Contract>[]>(
    () => [
      {
        accessorKey: "reference",
        header: "Referência",
        size: 120,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ArticleIcon color="primary" fontSize="small" />
            <Typography fontWeight={500}>
              {row.original.reference || "N/A"}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "object",
        header: "Objecto",
        size: 200,
        Cell: ({ row }) => (
          <Tooltip title={row.original.object || "N/A"}>
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {row.original.object || "N/A"}
            </Typography>
          </Tooltip>
        ),
      },
      {
        accessorKey: "amount",
        header: "Valor",
        size: 120,
        Cell: ({ row }) => formatCurrency(row.original.amount),
      },
      {
        accessorKey: "status",
        header: "Estado",
        size: 100,
        Cell: ({ row }) => handleContractStatus(row.original.status),
      },
      {
        accessorKey: "startDate",
        header: "Data Início",
        size: 120,
        Cell: ({ row }) => formatDate(row.original.startDate),
      },
      {
        accessorKey: "endDate",
        header: "Data Fim",
        size: 120,
        Cell: ({ row }) => formatDate(row.original.endDate),
      },
      {
        accessorKey: "description",
        header: "Observações",
        size: 200,
        Cell: ({ row }) => (
          <Tooltip title={row.original.description || "N/A"}>
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {row.original.description || "N/A"}
            </Typography>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowActions: true,
    localization: MRT_Localization_PT,
    positionActionsColumn: "last",
    initialState: {
      density: "compact",
      columnVisibility: {
        description: false,
      },
      columnPinning: {
        left: ["reference"],
        right: ["mrt-row-actions"],
      },
    },
    muiTablePaperProps: {
      elevation: 2,
      sx: {
        borderRadius: "8px",
        overflow: "hidden",
      },
    },
    muiTableContainerProps: {
      sx: {
        boxShadow: "none",
      },
    },
    enableColumnResizing: true,
    enablePinning: true,
    enableStickyHeader: true,
    enableColumnFilterModes: true,
    enableFilters: true,
    enableFullScreenToggle: true,
    enableDensityToggle: true,
    enableHiding: true,
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
      placeholder: "Pesquisar contratos...",
      InputLabelProps: {
        shrink: true,
      },
      sx: { minWidth: "300px" },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="subtitle2" color="primary">
          Total: {table.getFilteredRowModel().rows.length} contratos
        </Typography>
      </Box>
    ),
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem
        key="view-contract"
        onClick={() => {
          // Open files in new tabs or show file viewer
          row.original.fileUrls?.forEach((file: any) => {
            window.open(file.url, "_blank");
          });
        }}
        disabled={!row.original.fileUrls || row.original.fileUrls.length === 0}
        sx={{ color: theme.palette.success.main }}
      >
        <ListItemIcon>
          <DownloadIcon fontSize="small" color="success" />
        </ListItemIcon>
        <ListItemText>Ver anexos</ListItemText>
      </MenuItem>,
      <MenuItem
        key="edit-contract"
        onClick={() => router.push(`/contract/${row.original.id}/update`)}
        sx={{ color: theme.palette.primary.main }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText>Editar contrato</ListItemText>
      </MenuItem>,
    ],
  });

  return (
    <>
      <MaterialReactTable table={table} />

      {/* Mark as complete confirmation dialog */}
      <Dialog
        open={completeDialogOpen}
        onClose={() => !isLoading && setCompleteDialogOpen(false)}
      >
        <DialogTitle>Marcar Contrato como Concluído</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja marcar o contrato{" "}
            <strong>{selectedContract?.reference}</strong> como concluído? Esta
            ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCompleteDialogOpen(false)}
            color="inherit"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleMarkComplete}
            color="primary"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CheckIcon />
              )
            }
          >
            {isLoading ? "Processando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isLoading && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Eliminar Contrato</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja eliminar o contrato{" "}
            <strong>{selectedContract?.reference}</strong>? Esta ação não pode
            ser desfeita e todos os dados associados serão perdidos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContractsTable;
