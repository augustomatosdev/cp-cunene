import React from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AddContract } from "./add-document";
import ContractsTable from "./documents-table";

const Page = async () => {
  const documents: any = [];
  const q = query(collection(db, "documents"), orderBy("createdAt", "desc"));
  const data = await getDocs(q);
  data.forEach((document) => {
    documents.push({ ...document.data(), id: document.id });
  });
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Todos os documentos</h1>
        <AddContract />
      </div>
      <div className="my-8">
        <ContractsTable data={documents} />
      </div>
    </div>
  );
};

export default Page;
