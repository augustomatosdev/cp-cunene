// import React from "react";
// import { Button, Divider } from "@mui/material";
// import { doc, getDoc, getDocs } from "firebase/firestore";
// import { db } from "@/lib/firebase";

// const Page = async ({
//   params,
//   children,
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
//       <div className="border rounded-md p-6">
//         <div className="my-4">
//           <div className="grid grid-cols-2 my-4 gap-4">
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">
//                 Objecto do contrato
//               </p>
//               <p className="text-zinc-500">{contract.object}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">Observações</p>
//               <p className="text-zinc-500">{contract.description}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">
//                 Valor do contrato
//               </p>
//               <p className="text-zinc-500">{contract.amount}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">Estado</p>
//               <p className="text-zinc-500">{contract.status}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">Data de inicio</p>
//               <p className="text-zinc-500">{contract.startDate}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">
//                 Data de encerramento
//               </p>
//               <p className="text-zinc-500">{contract.endDate}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

import React from "react";

const Page = () => {
  return <div>Page</div>;
};

export default Page;
