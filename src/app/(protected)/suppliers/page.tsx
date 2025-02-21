import React from "react";
import SuppliersTable from "./suppliers-tablet";
import { AddSupplier } from "./add-supplier";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Page = async () => {
  const suppliers: any = [];
  const q = query(collection(db, "suppliers"), orderBy("createdAt", "desc"));
  const data = await getDocs(q);
  data.forEach((supplier) => {
    suppliers.push({ ...supplier.data(), id: supplier.id });
  });

  console.log({ suppliers });
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Todos os fornecedores</h1>
        <AddSupplier />
      </div>
      <div className="my-8">
        <SuppliersTable data={suppliers} />
      </div>
    </div>
  );
};

export default Page;
