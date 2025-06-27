"use client";
import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, Badge, styled } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Custom styled Tab for better appearance
const StyledTab = styled(Tab)<{
  component?: React.ElementType;
  href?: string;
  disabled?: boolean;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "top" | "bottom" | "start" | "end";
}>(({ theme }) => ({
  minHeight: 64,
  fontSize: "0.875rem",
  fontWeight: 500,
  textTransform: "none",
  "&.Mui-selected": {
    fontWeight: 600,
  },
}));

export default function SupplierTabs({ supplierId }: { supplierId: string }) {
  const pathname = usePathname();
  const [contractsCount, setContractsCount] = useState(0);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Define the tab paths in the same order as the tabs
  const tabPaths = [
    `/supplier/${supplierId}/view`,
    `/supplier/${supplierId}/view/contracts`,
    `/supplier/${supplierId}/view/documents`,
    `/supplier/${supplierId}/view/notifications`,
  ];

  // Set the active tab based on the URL
  const activeTab =
    tabPaths.indexOf(pathname) >= 0 ? tabPaths.indexOf(pathname) : 0;
  const [value, setValue] = React.useState(activeTab);

  // Fetch counts for badges
  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        // Fetch contracts count
        const contractsQuery = query(
          collection(db, "contracts"),
          where("supplierId", "==", supplierId)
        );
        const contractsSnapshot = await getDocs(contractsQuery);
        setContractsCount(contractsSnapshot.size);

        // Fetch documents count - assuming you have a documents collection
        const documentsQuery = query(
          collection(db, "documents"),
          where("supplierId", "==", supplierId)
        );
        try {
          const documentsSnapshot = await getDocs(documentsQuery);
          setDocumentsCount(documentsSnapshot.size);
        } catch (error) {
          // If documents collection doesn't exist yet
          setDocumentsCount(0);
        }

        // Fetch notifications count - assuming you have a notifications collection
        const notificationsQuery = query(
          collection(db, "notifications"),
          where("supplierId", "==", supplierId),
          where("read", "==", false)
        );
        try {
          const notificationsSnapshot = await getDocs(notificationsQuery);
          setNotificationsCount(notificationsSnapshot.size);
        } catch (error) {
          // If notifications collection doesn't exist yet
          setNotificationsCount(0);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [supplierId]);

  useEffect(() => {
    setValue(activeTab);
  }, [pathname, activeTab]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="supplier tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTabs-indicator": {
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          },
        }}
      >
        <StyledTab
          component={Link}
          href={`/supplier/${supplierId}/view`}
          label="Visão geral"
          icon={<VisibilityIcon />}
          iconPosition="start"
        />
        <StyledTab
          component={Link}
          href={`/supplier/${supplierId}/view/contracts`}
          label={
            contractsCount > 0 && !loading ? (
              <Badge
                badgeContent={contractsCount}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "10px",
                    height: "16px",
                    minWidth: "16px",
                  },
                }}
              >
                Contratos
              </Badge>
            ) : (
              "Contratos"
            )
          }
          icon={<DescriptionIcon />}
          iconPosition="start"
          disabled={loading}
        />
        <StyledTab
          component={Link}
          href={`/supplier/${supplierId}/view/documents`}
          label={
            documentsCount > 0 && !loading ? (
              <Badge
                badgeContent={documentsCount}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "10px",
                    height: "16px",
                    minWidth: "16px",
                  },
                }}
              >
                Documentos
              </Badge>
            ) : (
              "Documentos"
            )
          }
          icon={<FolderIcon />}
          iconPosition="start"
          disabled={loading}
        />
        <StyledTab
          component={Link}
          href={`/supplier/${supplierId}/view/notifications`}
          label={
            notificationsCount > 0 && !loading ? (
              <Badge
                badgeContent={notificationsCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "10px",
                    height: "16px",
                    minWidth: "16px",
                  },
                }}
              >
                Notificações
              </Badge>
            ) : (
              "Notificações"
            )
          }
          icon={<NotificationsIcon />}
          iconPosition="start"
          disabled={loading}
        />
      </Tabs>
    </Box>
  );
}
