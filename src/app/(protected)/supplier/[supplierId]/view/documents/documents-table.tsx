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
  Avatar,
} from "@mui/material";
import { MRT_Localization_PT } from "material-react-table/locales/pt";
import { useRouter } from "next/navigation";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Document = {
  id: string;
  reference: string;
  fileUrls: string[];
  office: string;
  description: string;
  folder: string;
  documentDate: string;
  createdAt: any;
  type?: string;
  fileType?: string;
  fileName?: string;
};

const DocumentsTable = ({ data }: { data: Document[] }) => {
  const router = useRouter();
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  // Download files function
  const downloadFiles = (fileUrls: Document["fileUrls"]) => {
    if (!fileUrls || fileUrls.length === 0) {
      console.warn("No files to download");
      return;
    }

    fileUrls.forEach((file: any) => {
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

  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Get icon based on file type
  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileIcon color="primary" />;

    const lowerType = fileType.toLowerCase();

    if (lowerType.includes("pdf")) {
      return <PictureAsPdfIcon color="error" />;
    } else if (
      lowerType.includes("image") ||
      lowerType.includes("jpg") ||
      lowerType.includes("png") ||
      lowerType.includes("jpeg")
    ) {
      return <ImageIcon color="success" />;
    } else if (lowerType.includes("doc") || lowerType.includes("word")) {
      return <DescriptionIcon color="primary" />;
    } else if (lowerType.includes("txt") || lowerType.includes("text")) {
      return <TextSnippetIcon color="secondary" />;
    } else {
      return <FileIcon color="primary" />;
    }
  };

  // File preview handler
  const handlePreview = (url: string) => {
    if (!url) {
      alert("Não há arquivo disponível para visualizar.");
      return;
    }

    setPreviewUrl(url);
    setPreviewDialogOpen(true);
  };

  // Delete document handler
  const handleDelete = () => {
    if (!selectedDocument) return;

    setIsLoading(true);
    // In a real app, you would delete the document from Firebase here
    // Example:
    // const documentRef = doc(db, "documents", selectedDocument.id);
    // deleteDoc(documentRef)
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
      alert("Documento eliminado com sucesso!");
    }, 1500);
  };

  const columns = useMemo<MRT_ColumnDef<Document>[]>(
    () => [
      {
        accessorKey: "reference",
        header: "Referência",
        size: 120,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {getFileIcon(row.original.fileType)}
            <Typography fontWeight={500}>
              {row.original.reference || row.original.fileName || "N/A"}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "office",
        header: "Entidade",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon fontSize="small" color="primary" />
            <Typography>{row.original.office || "N/A"}</Typography>
          </Box>
        ),
      },
      {
        accessorKey: "description",
        header: "Descrição",
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
      {
        accessorKey: "folder",
        header: "Pasta",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FolderIcon fontSize="small" color="warning" />
            <Typography>{row.original.folder || "Geral"}</Typography>
          </Box>
        ),
      },
      {
        accessorKey: "documentDate",
        header: "Data do documento",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon fontSize="small" color="secondary" />
            <Typography>{formatDate(row.original.documentDate)}</Typography>
          </Box>
        ),
      },
      {
        accessorKey: "type",
        header: "Tipo",
        size: 120,
        Cell: ({ row }) => (
          <Chip
            size="small"
            label={row.original.type || "Documento"}
            color="primary"
            variant="outlined"
          />
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
        type: false,
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
        key="download-document"
        onClick={() => downloadFiles(row.original.fileUrls)}
        disabled={!row.original.fileUrls || row.original.fileUrls.length === 0}
        sx={{ color: theme.palette.success.main }}
      >
        <ListItemIcon>
          <DownloadIcon fontSize="small" color="success" />
        </ListItemIcon>
        <ListItemText>Baixar documento</ListItemText>
      </MenuItem>,
      <MenuItem
        key="edit-document"
        onClick={() => router.push(`/documents/edit/${row.original.id}`)}
        sx={{ color: theme.palette.primary.main }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText>Editar documento</ListItemText>
      </MenuItem>,
    ],
  });

  return (
    <>
      <MaterialReactTable table={table} />

      {/* Document preview dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Visualização do Documento
          <IconButton
            aria-label="close"
            onClick={() => setPreviewDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <DeleteIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {previewUrl.toLowerCase().includes(".pdf") ? (
            <iframe
              src={`${previewUrl}#toolbar=0`}
              width="100%"
              height="600px"
              style={{ border: "none" }}
            />
          ) : previewUrl.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) ? (
            <Box sx={{ textAlign: "center", p: 2 }}>
              <img
                src={previewUrl}
                alt="Document preview"
                style={{ maxWidth: "100%", maxHeight: "600px" }}
              />
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="body1" gutterBottom>
                Visualização não disponível para este tipo de documento.
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => window.open(previewUrl, "_blank")}
                sx={{ mt: 2 }}
              >
                Baixar para visualizar
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isLoading && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Eliminar Documento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja eliminar o documento{" "}
            <strong>
              {selectedDocument?.reference || selectedDocument?.fileName}
            </strong>
            ? Esta ação não pode ser desfeita e todos os dados associados serão
            perdidos.
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

export default DocumentsTable;
