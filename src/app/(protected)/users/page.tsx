import React from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Button } from "@mui/material";
import { UserPlus } from "lucide-react";
import UsersTable from "./users-table";
// import { AddContract } from "./add-contract";
// import ContractsTable from "./contracts-table";

const Page = async () => {
  const users: any = [];
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  const data = await getDocs(q);
  data.forEach((user) => {
    users.push({ ...user.data(), id: user.id });
  });
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
        <UsersTable data={users} />
      </div>
    </div>
  );
};

export default Page;
