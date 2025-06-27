"use client";
import { useMemo } from "react";
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
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { MRT_Localization_PT } from "material-react-table/locales/pt";
import { useRouter } from "next/navigation";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FolderIcon from "@mui/icons-material/Folder";
import BusinessIcon from "@mui/icons-material/Business";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Document = {
  id: string;
  reference: string;
  title: string;
  description: string;
  startDate: string;
  supplier?: string | null;
  supplierId?: string | null;
  folder?: string | null;
  folderId?: string | null;
  office?: string | null;
  fileUrls: Array<{
    name: string;
    url: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

const downloadFiles = (fileUrls: Document["fileUrls"]) => {
  if (!fileUrls || fileUrls.length === 0) {
    console.warn("No files to download");
    return;
  }

  fileUrls.forEach((file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name || "document";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  } catch (error) {
    return dateString;
  }
};

const DocumentsTable = ({ data }: { data: Document[] }) => {
  const router = useRouter();
  const theme = useTheme();

  const columns = useMemo<MRT_ColumnDef<Document>[]>(
    () => [
      {
        accessorKey: "reference",
        header: "Referência",
        minSize: 100,
        maxSize: 140,
        Cell: ({ row }) => (
          <Typography variant="body2" fontWeight={500}>
            {row.original.reference}
          </Typography>
        ),
      },
      {
        accessorKey: "title",
        header: "Título",
        minSize: 200,
        maxSize: 350,
        grow: true,
        Cell: ({ row }) => (
          <Box>
            <Typography variant="body2" fontWeight={500} noWrap>
              {row.original.title}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.2,
              }}
            >
              {row.original.description}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "supplier",
        header: "Fornecedor",
        minSize: 150,
        maxSize: 220,
        Cell: ({ row }) => {
          if (!row.original.supplier) {
            return (
              <Chip
                size="small"
                label="Documento Geral"
                variant="outlined"
                color="default"
              />
            );
          }
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BusinessIcon fontSize="small" color="primary" />
              <Typography variant="body2" noWrap>
                {row.original.supplier}
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "office",
        header: "Origem / Destinatário",
        minSize: 120,
        maxSize: 180,
        Cell: ({ row }) => {
          if (!row.original.office) {
            return (
              <Typography variant="body2" color="text.secondary">
                -
              </Typography>
            );
          }
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ApartmentIcon fontSize="small" color="secondary" />
              <Typography variant="body2" noWrap>
                {row.original.office}
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "folder",
        header: "Pasta",
        minSize: 100,
        maxSize: 150,
        Cell: ({ row }) => {
          if (!row.original.folder) {
            return (
              <Typography variant="body2" color="text.secondary">
                -
              </Typography>
            );
          }
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FolderIcon fontSize="small" color="warning" />
              <Typography variant="body2" noWrap>
                {row.original.folder}
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "fileUrls",
        header: "Anexos",
        minSize: 80,
        maxSize: 120,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AttachFileIcon fontSize="small" color="info" />
            <Chip
              size="small"
              label={`${row.original.fileUrls?.length || 0}`}
              variant="outlined"
              color="info"
            />
          </Box>
        ),
      },
      {
        accessorKey: "startDate",
        header: "Data de Emissão",
        minSize: 100,
        maxSize: 130,
        Cell: ({ row }) => (
          <Typography variant="body2">
            {formatDate(row.original.startDate)}
          </Typography>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Criado em",
        minSize: 100,
        maxSize: 130,
        Cell: ({ row }) => (
          <Typography variant="body2" color="text.secondary">
            {formatDate(row.original.createdAt)}
          </Typography>
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
    layoutMode: "semantic", // Use semantic layout for better column distribution
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 100, // Fixed width for actions
      },
    },
    initialState: {
      density: "compact",
      columnVisibility: {
        createdAt: false,
        // office column is now visible by default
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
        maxHeight: "70vh", // Limit height for better scrolling
      },
    },
    muiTableProps: {
      sx: {
        tableLayout: "fixed", // Fixed table layout for consistent column widths
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
      placeholder: "Pesquisar documentos...",
      InputLabelProps: {
        shrink: true,
      },
      sx: { minWidth: "300px" },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="subtitle2" color="primary">
          Total: {table.getFilteredRowModel().rows.length} documentos
        </Typography>
      </Box>
    ),
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem
        key="download"
        onClick={() => downloadFiles(row.original.fileUrls)}
        sx={{ color: theme.palette.success.main }}
      >
        <ListItemIcon>
          <DownloadIcon fontSize="small" color="success" />
        </ListItemIcon>
        <ListItemText>
          Baixar{" "}
          {row.original.fileUrls?.length === 1 ? "ficheiro" : "ficheiros"}
        </ListItemText>
      </MenuItem>,
      ...(row.original.supplier && row.original.supplierId
        ? [
            <MenuItem
              key="view-supplier"
              onClick={() =>
                router.push(`/supplier/${row.original.supplierId}/view`)
              }
              sx={{ color: theme.palette.primary.main }}
            >
              <ListItemIcon>
                <BusinessIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>Ver fornecedor</ListItemText>
            </MenuItem>,
          ]
        : []),
      <MenuItem
        key="edit"
        onClick={() => router.push(`/document/${row.original.id}/update`)}
        sx={{ color: theme.palette.warning.main }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" color="warning" />
        </ListItemIcon>
        <ListItemText>Editar documento</ListItemText>
      </MenuItem>,
      <MenuItem
        key="delete"
        onClick={() => {
          if (
            window.confirm("Tem certeza que deseja eliminar este documento?")
          ) {
            console.info("Delete document:", row.original.id);
            // Implement delete functionality
          }
        }}
        sx={{ color: theme.palette.error.main }}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Eliminar documento</ListItemText>
      </MenuItem>,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default DocumentsTable;
