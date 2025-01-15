import React from "react";
import { DataCounter } from "./counter";
import { Alerts } from "./alerts";
import StoreIcon from "@mui/icons-material/Store";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import GroupsIcon from "@mui/icons-material/Groups";
import DescriptionIcon from "@mui/icons-material/Description";

const metrics = [
  {
    link: "/totals",
    title: "Fornecedores",
    total: 20,
    weektotal: 10,
    color: "#2563eb", // Background color
    textColor: "#ffffff", // White text for contrast
    icon: <StoreIcon fontSize="large" />,
  },
  {
    link: "/totals",
    title: "Contratos",
    total: 20,
    weektotal: 10,
    color: "#f59e0b", // Background color
    textColor: "#1f2937", // Dark gray text for contrast
    icon: <DescriptionIcon fontSize="large" />,
  },
  {
    link: "/totals",
    title: "Procedimentos",
    total: 20,
    weektotal: 10,
    color: "#10b981", // Background color
    textColor: "#ffffff", // White text for contrast
    icon: <FormatListNumberedIcon fontSize="large" />,
  },
  {
    link: "/totals",
    title: "Utilizadores",
    total: 20,
    weektotal: 10,
    color: "#8b5cf6", // Background color
    textColor: "#ffffff", // White text for contrast
    icon: <GroupsIcon fontSize="large" />,
  },
];

const Page = () => {
  return (
    <div>
      <div className="mb-4">
        <Alerts />
      </div>
      <div className="grid lg:grid-cols-4 gap-4">
        {metrics.map((el, index) => (
          <DataCounter
            key={index}
            counter={{
              link: "/totals",
              title: el.title,
              total: 5,
              weekTotal: 10,
              color: el.color,
              textColor: el.textColor,
              icon: el.icon,
            }}
          />
        ))}
        <div className="my-8 max-w-screen-lg mx-auto border-2">
          <h1>Notifications</h1>
        </div>
      </div>
    </div>
  );
};

export default Page;
