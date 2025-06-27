"use client";
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { ListItemIcon, ListItemText, MenuItem, Chip } from "@mui/material";
import { MRT_Localization_PT } from "material-react-table/locales/pt";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
const UsersTable = ({ data }: { data: User[] }) => {
  const router = useRouter();

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nome",
        size: 200,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 250,
      },
      {
        accessorKey: "role",
        header: "Função",
        size: 120,
        Cell: ({ cell }) => {
          const role = cell.getValue<string>();
          return (
            <Chip
              label={role === "admin" ? "Administrador" : "Usuário"}
              color={role === "admin" ? "primary" : "default"}
              size="small"
            />
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Estado",
        size: 100,
        Cell: ({ cell }) => {
          const isActive = cell.getValue<boolean>();
          return (
            <Chip
              label={isActive ? "Ativo" : "Inativo"}
              color={isActive ? "success" : "error"}
              size="small"
            />
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Data de Criação",
        size: 150,
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue<string>());
          return date.toLocaleDateString("pt-AO");
        },
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
        createdAt: false,
      },
    },
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem
        key="view"
        onClick={() => router.push(`/users/${row.original.id}/view`)}
      >
        <ListItemIcon>
          <VisibilityIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Visualizar usuário</ListItemText>
      </MenuItem>,
      <MenuItem
        key="edit"
        onClick={() => router.push(`/users/${row.original.id}/edit`)}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Editar usuário</ListItemText>
      </MenuItem>,
      <MenuItem
        key="toggle-status"
        onClick={() => console.info("Toggle status for user:", row.original.id)}
      >
        <ListItemIcon>
          {row.original.isActive ? (
            <BlockIcon fontSize="small" />
          ) : (
            <CheckIcon fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText>
          {row.original.isActive ? "Desativar usuário" : "Ativar usuário"}
        </ListItemText>
      </MenuItem>,
      <MenuItem
        key="delete"
        onClick={() => console.info("Delete user:", row.original.id)}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Eliminar usuário</ListItemText>
      </MenuItem>,
    ],
  });

  return <MaterialReactTable table={table} />;
};

export default UsersTable;
