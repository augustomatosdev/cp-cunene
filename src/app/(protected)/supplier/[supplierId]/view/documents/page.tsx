import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ContractsTable from "@/app/(protected)/contracts/contracts-table";

const Page = async ({ params }: { params: { supplierId: string } }) => {
  const documents: any = [];
  const q = query(
    collection(db, "documents"),
    where("supplierId", "==", params.supplierId),
    orderBy("createdAt", "desc")
  );
  const data = await getDocs(q);
  data.forEach((document) => {
    documents.push({ ...document.data(), id: document.id });
  });
  return (
    <div>
      <div className="mb-4 flex justify-between">
        <p className="font-bold">CONTRATOS</p>
        <Button
          LinkComponent={Link}
          href={`/create/contract?supplierId=${params.supplierId}`}
          startIcon={<AddIcon />}
          variant="contained"
        >
          Adicionar contrato
        </Button>
      </div>
      <ContractsTable data={documents} />
    </div>
  );
};

export default Page;
