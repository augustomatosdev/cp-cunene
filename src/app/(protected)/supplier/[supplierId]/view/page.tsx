// import React from "react";
// import { Divider } from "@mui/material";
// import { doc, getDoc, getDocs } from "firebase/firestore";
// import { db } from "@/lib/firebase";

// const Page = async ({
//   params,
//   children,
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
//       <div className="border rounded-md p-6">
//         <p>
//           <span className="font-bold">Sobre a empresa: </span>
//           <span className="text-zinc-500">{supplier.descricao}</span>
//         </p>
//         <div className="my-4">
//           <p className="font-bold my-2">Dados gerais da empresa</p>
//           <Divider />
//           <div className="grid grid-cols-2 my-4 gap-4">
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">
//                 Nome da empresa ou designação comercial
//               </p>
//               <p className="text-zinc-500">{supplier.name}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">NIF</p>
//               <p className="text-zinc-500">{supplier.nif}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">
//                 Data de Abertura
//               </p>
//               <p className="text-zinc-500">{supplier.registro}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">Estado</p>
//               <p className="text-zinc-500">{supplier.status}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">
//                 Natureza jurídica
//               </p>
//               <p className="text-zinc-500">{supplier.natureza}</p>
//             </div>
//           </div>
//         </div>
//         <div className="my-4">
//           <p className="font-bold my-2">Endereço e contactos</p>
//           <Divider />
//           <div className="grid grid-cols-2 my-4 gap-4">
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">Endereço</p>
//               <p className="text-zinc-500">{supplier.address}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">Telefone</p>
//               <p className="text-zinc-500">{supplier.telefone1}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">
//                 Telefone Alternativo
//               </p>
//               <p className="text-zinc-500">{supplier.telefone2}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">Site</p>
//               <p className="text-zinc-500">{supplier.site}</p>
//             </div>
//             <div>
//               <p className="font-bold text-zinc-600 text-sm">E-mail</p>
//               <p className="text-zinc-500">{supplier.email}</p>
//             </div>
//           </div>
//         </div>
//         <div className="my-4">
//           <p className="font-bold my-2">Quadro societário</p>
//           <Divider />
//           {supplier.socios.map((el: any, index: number) => (
//             <div key={index} className="grid grid-cols-3 my-4 gap-4">
//               <div>
//                 <p className="font-bold text-zinc-600 text-sm">Nome</p>
//                 <p className="text-zinc-500">{el.responsavel}</p>
//               </div>
//               <div>
//                 <p className="font-bold text-zinc-600 text-sm">Cargo</p>
//                 <p className="text-zinc-500">{el.cargoResponsavel}</p>
//               </div>
//               <div>
//                 <p className="font-bold text-zinc-600 text-sm">
//                   Data de entrada
//                 </p>
//                 <p className="text-zinc-500">{el.telefoneResponsavel}</p>
//               </div>
//             </div>
//           ))}
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
