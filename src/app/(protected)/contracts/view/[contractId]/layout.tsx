// import React from "react";
// import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// // import SupplierTabs from "./tabs";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import Link from "next/link";

// const Layout = async ({
//   children,
//   params,
// }: {
//   params: Promise<{ contractId: string }>; // Updated type to reflect Promise
//   children: React.ReactNode;
// }) => {
//   const { contractId } = await params;
//   const data = await getDoc(doc(db, "contracts", contractId));

//   if (!data.exists) {
//     return (
//       <div>
//         <h1>Contrato nao encontrado!</h1>
//       </div>
//     );
//   }
//   const contract: any = data.data();
//   return (
//     <div className="max-w-screen-lg mx-auto">
//       <div>
//         <div className="flex items-center ">
//           <DescriptionOutlinedIcon fontSize="large" />
//           <p className="font-extrabold text-2xl ml-4">{contract.reference}</p>
//         </div>
//         <div className="my-2">
//           <Link href={`/`}>
//             <span className="font-bold">Empresa:</span>{" "}
//             <span className="underline text-blue-500">{contract.supplier}</span>
//           </Link>
//         </div>
//       </div>
//       <div className="mb-4">
//         {/* <SupplierTabs supplierId={params.supplierId} /> */}
//       </div>
//       {children}
//     </div>
//   );
// };

// export default Layout;

import React from "react";

const Layout = () => {
  return <div>Layout</div>;
};

export default Layout;
