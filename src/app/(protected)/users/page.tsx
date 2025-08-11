"use client";
import React from "react";
import Link from "next/link";
import { Button, CircularProgress, Alert, Skeleton } from "@mui/material";
import { UserPlus } from "lucide-react";
import UsersTable from "./users-table";
import { useUsers } from "@/hooks/useUsers";
import { useSession } from "next-auth/react";
import { Loading } from "@/app/components/loading";

const Page = () => {
  const { data: session, status } = useSession() as any;
  const userRole = session?.user?.role;

  if (status === "loading") {
    return <Loading />;
  }

  if (userRole !== "super_admin") {
    return <div>Não tens permissão para ver esta página</div>;
  }

  const { data: users = [], isLoading, isError, error } = useUsers();

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between">
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="rectangular" width={180} height={36} />
        </div>
        <div className="my-8">
          <div className="flex justify-center py-8">
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Todos os utilizadores</h1>
          <Link href="/users/create">
            <Button
              variant="contained"
              color="primary"
              startIcon={<UserPlus />}
            >
              Adicionar utilizador
            </Button>
          </Link>
        </div>
        <div className="my-8">
          <Alert severity="error">
            Erro ao carregar utilizadores:{" "}
            {error?.message || "Erro desconhecido"}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Todos os utilizadores</h1>
        <Link href="/users/create">
          <Button variant="contained" color="primary" startIcon={<UserPlus />}>
            Adicionar utilizador
          </Button>
        </Link>
      </div>
      <div className="my-8">
        <UsersTable data={users as any} />
      </div>
    </div>
  );
};

export default Page;
