// "use client";
// import * as React from "react";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Box from "@mui/material/Box";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function SupplierTabs({ supplierId }: { supplierId: string }) {
//   const pathname = usePathname();

//   // Define the tab paths in the same order as the tabs
//   const tabPaths = [
//     `/supplier/${supplierId}/view`,
//     `/supplier/${supplierId}/view/supplies`,
//     `/supplier/${supplierId}/view/contracts`,
//     `/supplier/${supplierId}/view/documents`,
//     `/supplier/${supplierId}/view/notifications`,
//   ];

//   // Set the active tab based on the URL
//   const activeTab = tabPaths.indexOf(pathname);
//   const [value, setValue] = React.useState(activeTab);

//   React.useEffect(() => {
//     setValue(activeTab);
//   }, [pathname, activeTab]);

//   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//     setValue(newValue);
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//         <Tabs
//           value={value}
//           onChange={handleChange}
//           aria-label="basic tabs example"
//         >
//           <Tab
//             LinkComponent={Link}
//             href={`/supplier/${supplierId}/view`}
//             label="Visão geral"
//           />
//           <Tab
//             LinkComponent={Link}
//             href={`/supplier/${supplierId}/view/supplies`}
//             label="Fornecimentos"
//           />
//           <Tab
//             LinkComponent={Link}
//             href={`/supplier/${supplierId}/view/contracts`}
//             label="Contratos"
//           />
//           <Tab
//             LinkComponent={Link}
//             href={`/supplier/${supplierId}/view/documents`}
//             label="Documentos"
//           />
//           <Tab
//             LinkComponent={Link}
//             href={`/supplier/${supplierId}/view/notifications`}
//             label="Notificações"
//           />
//         </Tabs>
//       </Box>
//     </Box>
//   );
// }

import React from "react";

const Page = () => {
  return <div>Page</div>;
};

export default Page;
