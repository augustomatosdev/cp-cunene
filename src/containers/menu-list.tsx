import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography,
  Badge,
} from "@mui/material";
import {
  Home,
  Store,
  FileText,
  Settings,
  LogOut,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { signOut, useSession } from "next-auth/react";
import { AddFolderDialog } from "@/app/components/add-folder-dialog";

interface FolderOption {
  name: string;
  id: string;
  documentsCount?: number;
}

interface MenuItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    name: "Inicio",
    url: "/",
    icon: <Home className="h-5 w-5" />,
  },

  {
    name: "Fornecedores",
    url: "/suppliers",
    icon: <Store className="h-5 w-5" />,
  },
  {
    name: "Contratos",
    url: "/contracts",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Documentos",
    url: "/documents",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: "Candidaturas",
    url: "/candidates",
    icon: <Store className="h-5 w-5" />,
  },
  {
    name: "Utilizadores",
    url: "/users",
    icon: <Users className="h-5 w-5" />,
  },
];

export const MenuList = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { data: session } = useSession();
  const user = session?.user;

  const [foldersOpen, setFoldersOpen] = useState(false);
  const [folders, setFolders] = useState<FolderOption[]>([]);
  const [activeItem, setActiveItem] = useState("/");

  useEffect(() => {
    // Set active item based on current path
    setActiveItem(window.location.pathname);

    // Real-time folders subscription
    const unsubscribe = onSnapshot(
      collection(db, "folders"),
      (snapshot) => {
        const folderList = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          documentsCount: doc.data().documentsCount || 0,
        }));
        setFolders(folderList);
      },
      (error) => {
        console.error("Error fetching folders:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleFoldersClick = () => {
    setFoldersOpen(!foldersOpen);
  };

  const MenuItem = ({ item }: { item: MenuItem }) => (
    <ListItemButton
      component={Link}
      href={item.url}
      className={`rounded-lg my-1 ${
        activeItem === item.url ? "bg-red-50 text-red-900" : "hover:bg-gray-50"
      }`}
    >
      <ListItemIcon className={activeItem === item.url ? "text-red-900" : ""}>
        {item.icon}
      </ListItemIcon>
      <ListItemText>
        <span className={activeItem === item.url ? "font-medium" : ""}>
          {item.name}
        </span>
      </ListItemText>
      {item.badge && (
        <Badge badgeContent={item.badge} color="error" className="ml-2" />
      )}
    </ListItemButton>
  );

  return (
    <div className="flex flex-col h-full">
      <AddFolderDialog open={open} setOpen={setOpen} />
      <List className="flex-1 px-2">
        {menuItems.map((item, index) => {
          if (
            item.name === "Utilizadores" &&
            user?.email !== "admin@dcpcunene.ao"
          ) {
            return null;
          }
          return <MenuItem key={index} item={item} />;
        })}

        <Divider />

        <ListItemButton
          onClick={handleFoldersClick}
          className={`rounded-lg my-1 ${
            foldersOpen ? "bg-red-50 text-red-900" : "hover:bg-gray-50"
          }`}
        >
          <ListItemIcon className={foldersOpen ? "text-red-900" : ""}>
            <FolderOpen className="h-5 w-5" />
          </ListItemIcon>
          <ListItemText>
            <span className={foldersOpen ? "font-medium" : ""}>Pastas</span>
          </ListItemText>
          {foldersOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </ListItemButton>

        <Collapse in={foldersOpen} timeout="auto" unmountOnExit>
          <List component="div" className="ml-4">
            {folders.map((folder) => (
              <ListItemButton
                key={folder.id}
                className="rounded-lg hover:bg-gray-50"
                component={Link}
                href={`/documents?folder=${folder.id}`}
              >
                <ListItemIcon className="text-sm">
                  <FolderOpen className="h-5 w-5" />
                </ListItemIcon>

                <ListItemText>
                  <div className="flex items-center justify-between text-sm">
                    <span>{folder.name}</span>
                  </div>
                </ListItemText>
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>

      <ListItemButton
        onClick={() => signOut()}
        className="m-2 rounded-lg hover:bg-red-50 text-red-900"
      >
        <ListItemIcon>
          <LogOut className="h-5 w-5 text-red-900" />
        </ListItemIcon>
        <ListItemText>
          <span className="font-medium">Sair</span>
        </ListItemText>
      </ListItemButton>
    </div>
  );
};

export default MenuList;
