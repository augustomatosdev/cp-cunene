"use client";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Link from "next/link";
import { Collapse } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LogoutIcon from "@mui/icons-material/Logout";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { signOut } from "next-auth/react";

interface FolderOption {
  label: string;
  id: number;
}
const menuItems = [
  { name: "Inicio", url: "/", icon: <DashboardOutlinedIcon /> },
  { name: "Fornecedores", url: "/suppliers", icon: <StoreOutlinedIcon /> },
  { name: "Procedimentos", url: "/", icon: <FormatListNumberedOutlinedIcon /> },
  {
    name: "Contratos",
    url: "/contracts",
    icon: <DescriptionOutlinedIcon />,
  },
  { name: "Entregas", url: "/", icon: <LocalShippingOutlinedIcon /> },
  { name: "Notificações", url: "/", icon: <NotificationsNoneOutlinedIcon /> },
  { name: "Definições", url: "/", icon: <SettingsOutlinedIcon /> },
];

export const MenuList = () => {
  const [open, setOpen] = React.useState(false);
  const [folders, setFolders] = React.useState<FolderOption[]>([]);

  React.useEffect(() => {
    const fetchFolders = async () => {
      const foldersCollection = collection(db, "folders");
      const folderDocs: any = await getDocs(foldersCollection);
      const folderList = folderDocs.docs.map((doc: any) => ({
        label: doc.data().label,
        id: doc.id,
      })) as FolderOption[];
      setFolders(folderList);
    };

    fetchFolders();
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List>
      {menuItems.map((el, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton LinkComponent={Link} href={el.url}>
            <ListItemIcon>{el.icon}</ListItemIcon>
            <ListItemText primary={el.name} />
          </ListItemButton>
        </ListItem>
      ))}
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <FolderOpenIcon />
        </ListItemIcon>
        <ListItemText primary="Pastas" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {folders.map((el) => (
            <ListItemButton key={el.id} sx={{ pl: 4 }}>
              <ListItemIcon>
                <FolderOpenIcon />
              </ListItemIcon>
              <ListItemText primary={el.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
      <ListItemButton onClick={() => signOut()}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Sair" />
      </ListItemButton>
    </List>
  );
};
