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

type Supplier = {
  id: string;
  status: string;
  supplierId: string;
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
const ContractsTable = ({ data }: { data: Supplier[] }) => {
  const router = useRouter();
  const columns = useMemo<MRT_ColumnDef<Supplier>[]>(
    () => [
      {
        accessorKey: "reference",
        header: "Referência",
        size: 120,
      },
      {
        accessorKey: "supplier",
        header: "Fornecedor",
        size: 200,
      },
      {
        accessorKey: "object",
        header: "Objecto",
        size: 200,
      },
      {
        accessorKey: "description",
        header: "Observações",
        size: 200,
      },
      {
        accessorKey: "amount",
        header: "Valor",
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Estado",
        size: 100,
      },
      {
        accessorKey: "startDate",
        header: "Data de inicio",
        size: 100,
      },
      {
        accessorKey: "endDate",
        header: "Data de termino",
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
    initialState: {
      columnVisibility: {
        startDate: false,
        endDate: false,
        description: false,
      },
    },
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem
        key="view"
        onClick={() => router.push(`/supplier/${row.original.supplierId}/view`)}
      >
        <ListItemIcon>
          <VisibilityIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Visualizar fornecedor</ListItemText>
      </MenuItem>,
      <MenuItem
        key="download-contract"
        onClick={() => downloadFiles(row.original.fileUrls)}
      >
        <ListItemIcon>
          <DownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Baixar cópia do contrato</ListItemText>
      </MenuItem>,
      <MenuItem key="edit" onClick={() => console.info("Delete")}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Editar contrato</ListItemText>
      </MenuItem>,
      <MenuItem key="check" onClick={() => console.info("Delete")}>
        <ListItemIcon>
          <CheckIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Marcar como terminado</ListItemText>
      </MenuItem>,
      <MenuItem key="delete" onClick={() => console.info("Delete")}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Eliminar contrato</ListItemText>
      </MenuItem>,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default ContractsTable;
