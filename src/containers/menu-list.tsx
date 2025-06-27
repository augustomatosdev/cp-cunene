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
  Box,
} from "@mui/material";
import {
  Home as HomeIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  ExitToApp as LogOutIcon,
  Folder as FolderIcon,
  ExpandLess as ChevronUpIcon,
  ExpandMore as ChevronDownIcon,
  Add as PlusIcon,
  People as UsersIcon,
  HowToReg as CandidatesIcon,
} from "@mui/icons-material";
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
    name: "Início",
    url: "/",
    icon: <HomeIcon />,
  },
  {
    name: "Fornecedores",
    url: "/suppliers",
    icon: <BusinessIcon />,
  },
  {
    name: "Contratos",
    url: "/contracts",
    icon: <AssignmentIcon />,
  },
  {
    name: "Documentos",
    url: "/documents",
    icon: <DescriptionIcon />,
  },
  {
    name: "Candidaturas",
    url: "/candidates",
    icon: <CandidatesIcon />,
  },
  {
    name: "Utilizadores",
    url: "/users",
    icon: <UsersIcon />,
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
      sx={{
        borderRadius: 2,
        my: 0.5,
        backgroundColor: activeItem === item.url ? "primary.50" : "transparent",
        color: activeItem === item.url ? "primary.main" : "text.primary",
        "&:hover": {
          backgroundColor: activeItem === item.url ? "primary.100" : "grey.50",
        },
      }}
    >
      <ListItemIcon
        sx={{
          color: activeItem === item.url ? "primary.main" : "text.secondary",
          minWidth: 40,
        }}
      >
        {item.icon}
      </ListItemIcon>
      <ListItemText>
        <Typography
          variant="body2"
          sx={{
            fontWeight: activeItem === item.url ? 600 : 400,
            color: activeItem === item.url ? "primary.main" : "text.primary",
          }}
        >
          {item.name}
        </Typography>
      </ListItemText>
      {item.badge && (
        <Badge badgeContent={item.badge} color="error" sx={{ ml: 1 }} />
      )}
    </ListItemButton>
  );

  return (
    <div className="flex flex-col h-full">
      <AddFolderDialog open={open} setOpen={setOpen} />
      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item, index) => {
          if (
            item.name === "Utilizadores" &&
            user?.email !== "admin@dcpcunene.ao"
          ) {
            return null;
          }
          return <MenuItem key={index} item={item} />;
        })}

        <Divider sx={{ my: 2 }} />

        {/* Folders Section */}
        <ListItemButton
          onClick={handleFoldersClick}
          sx={{
            borderRadius: 2,
            my: 0.5,
            backgroundColor: foldersOpen ? "primary.50" : "transparent",
            color: foldersOpen ? "primary.main" : "text.primary",
            "&:hover": {
              backgroundColor: foldersOpen ? "primary.100" : "grey.50",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: foldersOpen ? "primary.main" : "text.secondary",
              minWidth: 40,
            }}
          >
            <FolderIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography
              variant="body2"
              sx={{
                fontWeight: foldersOpen ? 600 : 400,
                color: foldersOpen ? "primary.main" : "text.primary",
              }}
            >
              Pastas
            </Typography>
          </ListItemText>
          {foldersOpen ? (
            <ChevronUpIcon sx={{ color: "text.secondary" }} />
          ) : (
            <ChevronDownIcon sx={{ color: "text.secondary" }} />
          )}
        </ListItemButton>

        <Collapse in={foldersOpen} timeout="auto" unmountOnExit>
          <List component="div" sx={{ pl: 2 }}>
            {folders.map((folder) => (
              <ListItemButton
                key={folder.id}
                component={Link}
                href={`/documents?folder=${folder.id}`}
                sx={{
                  borderRadius: 2,
                  my: 0.5,
                  "&:hover": {
                    backgroundColor: "grey.50",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FolderIcon sx={{ fontSize: 20, color: "warning.main" }} />
                </ListItemIcon>
                <ListItemText>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      {folder.name}
                    </Typography>
                  </Box>
                </ListItemText>
              </ListItemButton>
            ))}

            {folders.length === 0 && (
              <ListItem>
                <ListItemText>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ pl: 1 }}
                  >
                    Nenhuma pasta criada
                  </Typography>
                </ListItemText>
              </ListItem>
            )}
          </List>
        </Collapse>
      </List>

      {/* Sign Out Button */}
      <List sx={{ p: 1 }}>
        <ListItemButton
          onClick={() => signOut()}
          sx={{
            borderRadius: 2,
            backgroundColor: "error.50",
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.100",
            },
          }}
        >
          <ListItemIcon sx={{ color: "error.main", minWidth: 40 }}>
            <LogOutIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "error.main" }}
            >
              Sair
            </Typography>
          </ListItemText>
        </ListItemButton>
      </List>
    </div>
  );
};

export default MenuList;
