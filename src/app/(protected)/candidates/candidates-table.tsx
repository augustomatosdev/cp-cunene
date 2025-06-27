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
  IconButton,
  Tooltip,
  Box,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { MRT_Localization_PT } from "material-react-table/locales/pt";
import EmailIcon from "@mui/icons-material/Email";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import PendingIcon from "@mui/icons-material/Pending";
import LanguageIcon from "@mui/icons-material/Language";
import DescriptionIcon from "@mui/icons-material/Description";
import InventoryIcon from "@mui/icons-material/Inventory";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Candidate = {
  id: string;
  companyName: string;
  nif: string;
  email: string;
  phone: string;
  address: string;
  sector: string;
  description: string;
  products: string;
  contactPerson: string;
  contactTitle: string;
  website?: string;
  status: "Pendente" | "Aprovado" | "Rejeitado" | "Em Análise";
  createdAt: any;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
};

const CandidatesTable = ({ data }: { data: Candidate[] }) => {
  const router = useRouter();
  const theme = useTheme();

  // Dialog states
  const [descriptionDialog, setDescriptionDialog] = useState({
    open: false,
    companyName: "",
    description: "",
  });

  const [productsDialog, setProductsDialog] = useState({
    open: false,
    companyName: "",
    products: "",
  });

  // Status chip renderer
  const renderStatusChip = (status: string) => {
    let color: "default" | "success" | "error" | "warning" | "info" = "default";
    let icon = null;

    switch (status) {
      case "Aprovado":
        color = "success";
        icon = <CheckCircleIcon fontSize="small" />;
        break;
      case "Rejeitado":
        color = "error";
        icon = <CancelIcon fontSize="small" />;
        break;
      case "Em Análise":
        color = "warning";
        icon = <PendingIcon fontSize="small" />;
        break;
      case "Pendente":
      default:
        color = "info";
        icon = <PendingIcon fontSize="small" />;
    }

    return (
      <Chip
        size="small"
        color={color}
        label={status}
        variant="outlined"
        icon={icon}
      />
    );
  };

  const formatDate = (dateString: string | any) => {
    if (!dateString) return "N/A";
    try {
      // Handle Firestore timestamps
      if (typeof dateString === "object" && dateString.seconds) {
        return format(new Date(dateString.seconds * 1000), "dd/MM/yyyy", {
          locale: ptBR,
        });
      }
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const handleOpenDescriptionDialog = (
    companyName: string,
    description: string
  ) => {
    setDescriptionDialog({
      open: true,
      companyName,
      description,
    });
  };

  const handleOpenProductsDialog = (companyName: string, products: string) => {
    setProductsDialog({
      open: true,
      companyName,
      products,
    });
  };

  const columns = useMemo<MRT_ColumnDef<Candidate>[]>(
    () => [
      {
        accessorKey: "companyName",
        header: "Nome da Empresa",
        minSize: 180,
        maxSize: 250,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon color="primary" fontSize="small" />
            <Box>
              <Typography variant="body2" fontWeight={500} noWrap>
                {row.original.companyName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {row.original.sector}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: "nif",
        header: "NIF",
        minSize: 100,
        maxSize: 120,
      },
      {
        accessorKey: "contactPerson",
        header: "Contacto",
        minSize: 150,
        maxSize: 200,
        Cell: ({ row }) => (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon fontSize="small" color="secondary" />
              <Typography variant="body2" fontWeight={500} noWrap>
                {row.original.contactPerson}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" noWrap>
              {row.original.contactTitle}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "phone",
        header: "Telefone",
        minSize: 120,
        maxSize: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Ligar">
              <IconButton
                size="small"
                href={`tel:${row.original.phone}`}
                sx={{ mr: 1 }}
              >
                <LocalPhoneIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" noWrap>
              {row.original.phone}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        minSize: 150,
        maxSize: 200,
        Cell: ({ row }) => (
          <Tooltip title={row.original.email}>
            <Box
              component="a"
              href={`mailto:${row.original.email}`}
              sx={{
                color: theme.palette.primary.main,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
                maxWidth: "180px",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {row.original.email}
            </Box>
          </Tooltip>
        ),
      },
      {
        accessorKey: "description",
        header: "Descrição",
        minSize: 100,
        maxSize: 120,
        Cell: ({ row }) => (
          <Tooltip title="Ver descrição da empresa">
            <IconButton
              size="small"
              onClick={() =>
                handleOpenDescriptionDialog(
                  row.original.companyName,
                  row.original.description
                )
              }
              color="info"
            >
              <DescriptionIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
      {
        accessorKey: "products",
        header: "Produtos",
        minSize: 100,
        maxSize: 120,
        Cell: ({ row }) => (
          <Tooltip title="Ver produtos/serviços">
            <IconButton
              size="small"
              onClick={() =>
                handleOpenProductsDialog(
                  row.original.companyName,
                  row.original.products
                )
              }
              color="success"
            >
              <InventoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Data de Candidatura",
        minSize: 120,
        maxSize: 150,
        Cell: ({ row }) => (
          <Typography variant="body2">
            {formatDate(row.original.createdAt)}
          </Typography>
        ),
      },
    ],
    [theme]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    localization: MRT_Localization_PT,
    layoutMode: "semantic",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 120,
      },
    },
    initialState: {
      density: "compact",
      columnVisibility: {
        website: false,
      },
      columnPinning: {
        left: ["companyName"],
        right: ["mrt-row-actions"],
      },
      sorting: [
        {
          id: "createdAt",
          desc: true, // Most recent first
        },
      ],
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
        maxHeight: "70vh",
      },
    },
    muiTableProps: {
      sx: {
        tableLayout: "fixed",
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
      placeholder: "Pesquisar candidaturas...",
      InputLabelProps: {
        shrink: true,
      },
      sx: { minWidth: "300px" },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="subtitle2" color="primary">
          Total: {table.getFilteredRowModel().rows.length} candidaturas
        </Typography>
        {/* Status summary */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {["Pendente", "Em Análise", "Aprovado", "Rejeitado"].map((status) => {
            const count = data.filter(
              (candidate) => candidate.status === status
            ).length;
            if (count === 0) return null;
            return (
              <Chip
                key={status}
                size="small"
                label={`${status}: ${count}`}
                variant="outlined"
                color={
                  status === "Aprovado"
                    ? "success"
                    : status === "Rejeitado"
                    ? "error"
                    : status === "Em Análise"
                    ? "warning"
                    : "info"
                }
              />
            );
          })}
        </Box>
      </Box>
    ),
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem
        key="view"
        onClick={() => router.push(`/candidates/${row.original.id}/view`)}
        sx={{ color: theme.palette.info.main }}
      >
        <ListItemIcon>
          <VisibilityIcon fontSize="small" color="info" />
        </ListItemIcon>
        <ListItemText>Ver Detalhes</ListItemText>
      </MenuItem>,
      <MenuItem
        key="approve"
        onClick={() => {
          // Implement approval logic
          console.log("Approve candidate:", row.original.id);
        }}
        sx={{ color: theme.palette.success.main }}
        disabled={row.original.status === "Aprovado"}
      >
        <ListItemIcon>
          <CheckCircleIcon fontSize="small" color="success" />
        </ListItemIcon>
        <ListItemText>Aprovar</ListItemText>
      </MenuItem>,
      <MenuItem
        key="reject"
        onClick={() => {
          // Implement rejection logic
          console.log("Reject candidate:", row.original.id);
        }}
        sx={{ color: theme.palette.error.main }}
        disabled={row.original.status === "Rejeitado"}
      >
        <ListItemIcon>
          <CancelIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Rejeitar</ListItemText>
      </MenuItem>,
      <MenuItem
        key="contact"
        onClick={() => window.open(`mailto:${row.original.email}`)}
        sx={{ color: theme.palette.primary.main }}
      >
        <ListItemIcon>
          <EmailIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText>Contactar</ListItemText>
      </MenuItem>,
    ],
  });

  return (
    <>
      <MaterialReactTable table={table} />

      {/* Description Dialog */}
      <Dialog
        open={descriptionDialog.open}
        onClose={() =>
          setDescriptionDialog({
            open: false,
            companyName: "",
            description: "",
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DescriptionIcon color="info" />
          Descrição da Empresa - {descriptionDialog.companyName}
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
          >
            {descriptionDialog.description || "Nenhuma descrição fornecida."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDescriptionDialog({
                open: false,
                companyName: "",
                description: "",
              })
            }
            variant="contained"
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Products Dialog */}
      <Dialog
        open={productsDialog.open}
        onClose={() =>
          setProductsDialog({ open: false, companyName: "", products: "" })
        }
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InventoryIcon color="success" />
          Produtos/Serviços - {productsDialog.companyName}
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
          >
            {productsDialog.products ||
              "Nenhum produto ou serviço especificado."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setProductsDialog({ open: false, companyName: "", products: "" })
            }
            variant="contained"
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CandidatesTable;
