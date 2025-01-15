import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ContractsTable from "./contracts-table";

const Page = async ({ params }: { params: { supplierId: string } }) => {
  const contracts: any = [];
  const q = query(
    collection(db, "contracts"),
    where("supplierId", "==", params.supplierId),
    orderBy("endDate", "desc")
  );
  const data = await getDocs(q);
  data.forEach((contract) => {
    contracts.push({ ...contract.data(), id: contract.id });
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
      <ContractsTable data={contracts} />
    </div>
  );
};

export default Page;
