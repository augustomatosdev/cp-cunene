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

type Supplier = {
  status: string;
  reference: string;
  fileUrls: string[];
  startDate: string;
  endDate: string;
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
const DocumentsTable = ({ data }: { data: Supplier[] }) => {
  console.log({ data });
  const columns = useMemo<MRT_ColumnDef<Supplier>[]>(
    () => [
      {
        accessorKey: "reference",
        header: "Referência",
        size: 100,
      },
      {
        accessorKey: "office",
        header: "Entidade",
        size: 200,
      },
      {
        accessorKey: "description",
        header: "Descrição",
        size: 200,
      },
      {
        accessorKey: "folder",
        header: "Pasta",
        size: 200,
      },
      {
        accessorKey: "documentDate",
        header: "Data do documento",
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
      <MenuItem key="add-notification" onClick={() => console.info("Delete")}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Editar contrato</ListItemText>
      </MenuItem>,
      <MenuItem key="add-notification" onClick={() => console.info("Delete")}>
        <ListItemIcon>
          <CheckIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Marcar concluido</ListItemText>
      </MenuItem>,
      <MenuItem key="send-email" onClick={() => console.info("Delete")}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Eliminar contrato</ListItemText>
      </MenuItem>,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default DocumentsTable;
