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
  Badge,
  Typography,
  useTheme,
} from "@mui/material";
import { MRT_Localization_PT } from "material-react-table/locales/pt";
import EmailIcon from "@mui/icons-material/Email";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import BusinessIcon from "@mui/icons-material/Business";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Supplier = {
  name: string;
  nif: string;
  email: string;
  telefone1: string;
  status: string;
  natureza: string;
  address: string;
  inicio: string;
  id: string;
  createdAt: any;
  descricao: string;
};

const SuppliersTable = ({ data }: { data: Supplier[] }) => {
  const router = useRouter();
  const theme = useTheme();
  const [supliersWithContracts, setSuppliersWithContracts] = useState<string[]>(
    []
  );

  // Fetch suppliers with contracts (mock data for now)
  // In a real application, you would fetch this data from Firebase
  useMemo(() => {
    // Mock data - in production this would be actual data
    if (data.length > 0) {
      const mockSupplierIds = data
        .slice(0, Math.floor(data.length / 2))
        .map((s) => s.id);
      setSuppliersWithContracts(mockSupplierIds);
    }
  }, [data]);

  // Status chip renderer
  const renderStatusChip = (status: string) => {
    let color: "success" | "error" | "warning" = "success";

    switch (status) {
      case "Activo":
        color = "success";
        break;
      case "Inactivo":
        color = "error";
        break;
      case "Suspenso":
        color = "warning";
        break;
      default:
        color = "success";
    }

    return (
      <Chip size="small" color={color} label={status} variant="outlined" />
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const columns = useMemo<MRT_ColumnDef<Supplier>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nome da Empresa",
        size: 200,
        Cell: ({ row }) => {
          const hasContracts = supliersWithContracts.includes(row.original.id);

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BusinessIcon color="primary" fontSize="small" />
              <Typography fontWeight={500}>{row.original.name}</Typography>
              {hasContracts && (
                <Tooltip title="Tem contratos ativos">
                  <Badge color="primary" variant="dot" />
                </Tooltip>
              )}
            </Box>
          );
        },
      },
      {
        accessorKey: "nif",
        header: "NIF",
        size: 120,
      },
      {
        accessorKey: "telefone1",
        header: "Telefone",
        size: 130,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Ligar">
              <IconButton
                size="small"
                href={`tel:${row.original.telefone1}`}
                sx={{ mr: 1 }}
              >
                <LocalPhoneIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
            {row.original.telefone1}
          </Box>
        ),
      },
      {
        accessorKey: "status",
        header: "Estado",
        size: 120,
        Cell: ({ cell }) => renderStatusChip(cell.getValue<string>()),
      },
      {
        accessorKey: "natureza",
        header: "Natureza",
        size: 180,
        Cell: ({ row }) => (
          <Tooltip title={row.original.natureza}>
            <Typography
              variant="body2"
              sx={{
                maxWidth: "180px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {row.original.natureza}
            </Typography>
          </Tooltip>
        ),
      },
      {
        accessorKey: "descricao",
        header: "Descrição",
        size: 180,
        Cell: ({ row }) => row.original.descricao,
      },
      {
        accessorKey: "inicio",
        header: "Início de Vínculo",
        size: 130,
        Cell: ({ row }) => formatDate(row.original.inicio),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 150,
        Cell: ({ row }) => (
          <Box
            component="a"
            href={`mailto:${row.original.email}`}
            sx={{
              color: theme.palette.primary.main,
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {row.original.email}
          </Box>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Cadastrado em",
        size: 130,
        Cell: ({ row }) => {
          const createdAt = row.original.createdAt;
          // Handle Firestore timestamps or date strings
          if (createdAt && typeof createdAt === "object" && createdAt.seconds) {
            return format(new Date(createdAt.seconds * 1000), "dd/MM/yyyy", {
              locale: ptBR,
            });
          } else if (createdAt) {
            return formatDate(createdAt);
          }
          return "N/A";
        },
      },
    ],
    [supliersWithContracts, theme]
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
        email: false,
        createdAt: false,
      },
      columnPinning: {
        left: ["name"],
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
      placeholder: "Pesquisar fornecedores...",
      InputLabelProps: {
        shrink: true,
      },
      sx: { minWidth: "300px" },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="subtitle2" color="primary">
          Total: {table.getFilteredRowModel().rows.length} fornecedores
        </Typography>
      </Box>
    ),
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem
        key="view"
        onClick={() => router.push(`/supplier/${row.original.id}/view`)}
        sx={{ color: theme.palette.info.main }}
      >
        <ListItemIcon>
          <VisibilityIcon fontSize="small" color="info" />
        </ListItemIcon>
        <ListItemText>Visualizar</ListItemText>
      </MenuItem>,
      <MenuItem
        key="add-contract"
        onClick={() =>
          router.push(
            `/contracts/create?supplierId=${row.original.id}&supplierName=${row.original.name}`
          )
        }
        sx={{ color: theme.palette.primary.main }}
      >
        <ListItemIcon>
          <DescriptionIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText>Adicionar contrato</ListItemText>
      </MenuItem>,
      <MenuItem
        key="view-contracts"
        onClick={() => router.push(`/contracts?supplierId=${row.original.id}`)}
        sx={{ color: theme.palette.secondary.main }}
      >
        <ListItemIcon>
          <AssignmentIcon fontSize="small" color="secondary" />
        </ListItemIcon>
        <ListItemText>Ver contratos</ListItemText>
      </MenuItem>,
      <MenuItem
        key="send-email"
        onClick={() => window.open(`mailto:${row.original.email}`)}
        sx={{ color: theme.palette.success.main }}
      >
        <ListItemIcon>
          <EmailIcon fontSize="small" color="success" />
        </ListItemIcon>
        <ListItemText>Enviar email</ListItemText>
      </MenuItem>,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default SuppliersTable;
