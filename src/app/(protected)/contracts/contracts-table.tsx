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
  Avatar,
} from "@mui/material";
import { MRT_Localization_PT } from "material-react-table/locales/pt";
import EmailIcon from "@mui/icons-material/Email";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BusinessIcon from "@mui/icons-material/Business";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EuroIcon from "@mui/icons-material/Euro";
import { format, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-toastify";

type Contract = {
  id: string;
  supplier: string;
  supplierId: string;
  reference: string;
  description: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
  object: string;
  fileUrls?: Array<{ name: string; url: string }>;
  createdAt: any;
  updatedAt: any;
};

const ContractsTable = ({ data }: { data: Contract[] }) => {
  const router = useRouter();
  const theme = useTheme();

  // Status chip renderer
  const renderStatusChip = (status: string) => {
    let color: "success" | "error" | "warning" = "warning";

    switch (status) {
      case "Em andamento":
        color = "warning";
        break;
      case "Concluido":
        color = "success";
        break;
      case "Cancelado":
        color = "error";
        break;
      default:
        color = "warning";
    }

    return (
      <Chip size="small" color={color} label={status} variant="outlined" />
    );
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Check if contract is expiring soon (within 30 days)
  const isExpiringSoon = (endDate: string) => {
    if (!endDate) return false;
    const today = new Date();
    const contractEnd = new Date(endDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return (
      isAfter(contractEnd, today) && isBefore(contractEnd, thirtyDaysFromNow)
    );
  };

  // Check if contract is overdue
  const isOverdue = (endDate: string, status: string) => {
    if (!endDate || status === "Concluido" || status === "Cancelado")
      return false;
    const today = new Date();
    const contractEnd = new Date(endDate);
    return isBefore(contractEnd, today);
  };

  const columns = useMemo<MRT_ColumnDef<Contract>[]>(
    () => [
      {
        accessorKey: "reference",
        header: "Referência",
        size: 150,
        Cell: ({ row }) => {
          const isExpiring = isExpiringSoon(row.original.endDate);
          const overdue = isOverdue(row.original.endDate, row.original.status);

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DescriptionIcon color="primary" fontSize="small" />
              <Typography fontWeight={500}>{row.original.reference}</Typography>
              {isExpiring && (
                <Tooltip title="Expira em breve">
                  <Badge color="warning" variant="dot" />
                </Tooltip>
              )}
              {overdue && (
                <Tooltip title="Contrato vencido">
                  <Badge color="error" variant="dot" />
                </Tooltip>
              )}
            </Box>
          );
        },
      },
      {
        accessorKey: "supplier",
        header: "Fornecedor",
        size: 200,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}
            >
              {row.original.supplier
                ? row.original.supplier.charAt(0).toUpperCase()
                : "S"}
            </Avatar>
            <Box>
              <Typography fontWeight={500} variant="body2">
                {row.original.supplier}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {row.original.supplierId?.substring(0, 8)}...
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: "object",
        header: "Objeto do Contrato",
        size: 250,
        Cell: ({ row }) => (
          <Tooltip title={row.original.object}>
            <Typography
              variant="body2"
              sx={{
                maxWidth: "250px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {row.original.object}
            </Typography>
          </Tooltip>
        ),
      },
      {
        accessorKey: "amount",
        header: "Valor",
        size: 130,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EuroIcon fontSize="small" color="success" />
            <Typography fontWeight={500} color="success.main">
              {formatCurrency(row.original.amount)}
            </Typography>
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
        accessorKey: "startDate",
        header: "Data de Início",
        size: 120,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon fontSize="small" color="info" />
            {formatDate(row.original.startDate)}
          </Box>
        ),
      },
      {
        accessorKey: "endDate",
        header: "Data de Término",
        size: 120,
        Cell: ({ row }) => {
          const isExpiring = isExpiringSoon(row.original.endDate);
          const overdue = isOverdue(row.original.endDate, row.original.status);

          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon
                fontSize="small"
                color={overdue ? "error" : isExpiring ? "warning" : "info"}
              />
              <Typography
                color={
                  overdue
                    ? "error.main"
                    : isExpiring
                    ? "warning.main"
                    : "inherit"
                }
                fontWeight={overdue || isExpiring ? 500 : 400}
              >
                {formatDate(row.original.endDate)}
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "fileUrls",
        header: "Anexos",
        size: 100,
        Cell: ({ row }) => {
          const fileCount = row.original.fileUrls?.length || 0;
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AttachFileIcon
                fontSize="small"
                color={fileCount > 0 ? "primary" : "disabled"}
              />
              <Typography variant="body2">{fileCount}</Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Observações",
        size: 200,
        Cell: ({ row }) => (
          <Tooltip title={row.original.description}>
            <Typography
              variant="body2"
              sx={{
                maxWidth: "200px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {row.original.description}
            </Typography>
          </Tooltip>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Criado em",
        size: 120,
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
    [theme]
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
        createdAt: false,
        fileUrls: false,
      },
      columnPinning: {
        left: ["reference"],
        right: ["mrt-row-actions"],
      },
      sorting: [
        {
          id: "createdAt",
          desc: true,
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
        key="edit"
        onClick={() => router.push(`/contract/${row.original.id}/update`)}
        sx={{ color: theme.palette.primary.main }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText>Editar</ListItemText>
      </MenuItem>,
      <MenuItem
        key="view-supplier"
        onClick={() => router.push(`/supplier/${row.original.supplierId}/view`)}
        sx={{ color: theme.palette.secondary.main }}
      >
        <ListItemIcon>
          <BusinessIcon fontSize="small" color="secondary" />
        </ListItemIcon>
        <ListItemText>Ver fornecedor</ListItemText>
      </MenuItem>,
      ...(row.original.fileUrls && row.original.fileUrls.length > 0
        ? [
            <MenuItem
              key="view-files"
              onClick={() => {
                // Open files in new tabs or show file viewer
                row.original.fileUrls?.forEach((file) => {
                  window.open(file.url, "_blank");
                });
              }}
              sx={{ color: theme.palette.success.main }}
            >
              <ListItemIcon>
                <AttachFileIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Ver anexos</ListItemText>
            </MenuItem>,
          ]
        : []),
      <MenuItem
        key="delete"
        onClick={() => {
          // Add delete confirmation logic here
          if (confirm("Tem certeza que deseja excluir este contrato?")) {
            // Add delete logic here
            deleteDoc(doc(db, "contracts", row.original.id));
            toast.success("Contrato excluído com sucesso!");
            router.push("/contracts");
          }
        }}
        sx={{ color: theme.palette.error.main }}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Excluir</ListItemText>
      </MenuItem>,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default ContractsTable;
