"use client";
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { MRT_Localization_PT } from "material-react-table/locales/pt";
import { useRouter } from "next/navigation";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";

type Document = {
  id: string;
  status: string;
  supplierId: string;
  reference: string;
  fileUrls: string[];
  startDate: string;
  description: string;
  supplier: string;
};

const downloadFiles = (fileUrls: any) => {
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

//nested data is ok, see accessorKeys in ColumnDef below
const ContractsTable = ({ data }: { data: Document[] }) => {
  const router = useRouter();
  const columns = useMemo<MRT_ColumnDef<Document>[]>(
    () => [
      {
        accessorKey: "reference",
        header: "Referência",
        size: 120,
      },
      {
        accessorKey: "title",
        header: "Título",
        size: 200,
      },
      {
        accessorKey: "supplier",
        header: "Fornecedor",
        size: 200,
      },

      {
        accessorKey: "description",
        header: "Descrição",
        size: 200,
      },
      {
        accessorKey: "startDate",
        header: "Data de emissão",
        size: 100,
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
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem
        key="download-contract"
        onClick={() => downloadFiles(row.original.fileUrls)}
      >
        <ListItemIcon>
          <DownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Baixar documento</ListItemText>
      </MenuItem>,
      <MenuItem key="edit" onClick={() => console.info("Delete")}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Editar documento</ListItemText>
      </MenuItem>,
      <MenuItem key="delete" onClick={() => console.info("Delete")}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Eliminar documento</ListItemText>
      </MenuItem>,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default ContractsTable;
