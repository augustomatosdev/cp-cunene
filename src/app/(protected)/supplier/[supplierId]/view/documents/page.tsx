import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DocumentsTable from "./documents-table";

const Page = async ({ params }: { params: { supplierId: string } }) => {
  const contracts: any = [];
  const q = query(
    collection(db, "documents"),
    where("supplier", "==", params.supplierId),
    orderBy("documentDate", "desc")
  );
  const data = await getDocs(q);
  data.forEach((contract) => {
    contracts.push({ ...contract.data(), id: contract.id });
  });
  console.log({ supplierId: params.supplierId, contracts });
  return (
    <div>
      <div className="mb-4 flex justify-between">
        <p className="font-bold">DOCUMENTOS DO FORNECEDOR</p>
        <Button
          LinkComponent={Link}
          href={`/create/document?supplierId=${params.supplierId}`}
          startIcon={<AddIcon />}
          variant="contained"
        >
          Adicionar Documento
        </Button>
      </div>
      <DocumentsTable data={contracts} />
    </div>
  );
};

export default Page;
