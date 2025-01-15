import React from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AddContract } from "./add-contract";
import ContractsTable from "./contracts-table";

const Page = async () => {
  const contracts: any = [];
  const q = query(collection(db, "contracts"));
  const data = await getDocs(q);
  data.forEach((supplier) => {
    contracts.push({ ...supplier.data(), id: supplier.id });
  });
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Todos os contratos</h1>
        <AddContract />
      </div>
      <div className="my-8">
        <ContractsTable data={contracts} />
      </div>
    </div>
  );
};

export default Page;
