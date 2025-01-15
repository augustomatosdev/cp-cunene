// import React from "react";
// import StoreIcon from "@mui/icons-material/Store";
// import SupplierTabs from "./tabs";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";

// const Layout = async ({
//   children,
//   params,
// }: {
//   params: { supplierId: string };
//   children: React.ReactNode;
// }) => {
//   const data = await getDoc(doc(db, "suppliers", params.supplierId));

//   if (!data.exists) {
//     return (
//       <div>
//         <h1>Fornecedor nao encontrado!</h1>
//       </div>
//     );
//   }
//   const supplier: any = data.data();
//   return (
//     <div className="max-w-screen-lg mx-auto">
//       <div>
//         <div className="flex items-center ">
//           <StoreIcon fontSize="large" />
//           <p className="font-extrabold text-2xl ml-4">{supplier.name}</p>
//         </div>
//         <p className="my-2">NIF: {supplier.nif}</p>
//       </div>
//       <div className="mb-4">
//         <SupplierTabs supplierId={params.supplierId} />
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
