"use client";
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { MRT_Localization_PT } from "material-react-table/locales/pt";
import EmailIcon from "@mui/icons-material/Email";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";
import NotificationsIcon from "@mui/icons-material/Notifications";

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
};

//nested data is ok, see accessorKeys in ColumnDef below
const SuppliersTable = ({ data }: { data: Supplier[] }) => {
  const router = useRouter();
  const columns = useMemo<MRT_ColumnDef<Supplier>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nome da Empresa",
        size: 150,
      },
      {
        accessorKey: "nif",
        header: "NIF",
        size: 120,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 150,
      },
      {
        accessorKey: "telefone1",
        header: "Telefone principal",
        size: 130,
      },
      {
        accessorKey: "status",
        header: "Estado",
        size: 100,
      },
      {
        accessorKey: "address",
        header: "Endereço",
        size: 200,
      },
      {
        accessorKey: "descricao",
        header: "Descrição",
        size: 200,
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
        key="view"
        onClick={() => router.push(`/supplier/${row.original.id}/view`)}
      >
        <ListItemIcon>
          <VisibilityIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Visualizar</ListItemText>
      </MenuItem>,
      <MenuItem
        key="add-contract"
        onClick={() =>
          router.push(`/create/contract?supplierId=${row.original.id}`)
        }
      >
        <ListItemIcon>
          <DescriptionIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Adicionar contrato</ListItemText>
      </MenuItem>,
      <MenuItem key="add-notification" onClick={() => console.info("Delete")}>
        <ListItemIcon>
          <NotificationsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Adicionar notificação</ListItemText>
      </MenuItem>,
      <MenuItem key="send-email" onClick={() => console.info("Delete")}>
        <ListItemIcon>
          <EmailIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Enviar email</ListItemText>
      </MenuItem>,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default SuppliersTable;
