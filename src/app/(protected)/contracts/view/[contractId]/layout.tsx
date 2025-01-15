import React from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import SupplierTabs from "./tabs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

const Layout = async ({
  children,
  params,
}: {
  params: { contractId: string };
  children: React.ReactNode;
}) => {
  const data = await getDoc(doc(db, "contracts", params.contractId));

  if (!data.exists) {
    return (
      <div>
        <h1>Contrato nao encontrado!</h1>
      </div>
    );
  }
  const contract: any = data.data();
  return (
    <div className="max-w-screen-lg mx-auto">
      <div>
        <div className="flex items-center ">
          <DescriptionOutlinedIcon fontSize="large" />
          <p className="font-extrabold text-2xl ml-4">{contract.reference}</p>
        </div>
        <div className="my-2">
          <Link href={`/`}>
            <span className="font-bold">Empresa:</span>{" "}
            <span className="underline text-blue-500">{contract.supplier}</span>
          </Link>
        </div>
      </div>
      <div className="mb-4">
        {/* <SupplierTabs supplierId={params.supplierId} /> */}
      </div>
      {children}
    </div>
  );
};

export default Layout;
