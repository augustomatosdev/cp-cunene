// src/hooks/useSuppliers.ts
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Supplier {
  id: string;
  name: string;
  status: "Activo" | "Inactivo" | "Suspenso";
  tipo: "Serviço" | "Produto";
  createdAt: any;
  [key: string]: any; // For other supplier properties
}

// Fetch suppliers function
const fetchSuppliers = async (): Promise<Supplier[]> => {
  const suppliers: Supplier[] = [];

  try {
    const q = query(collection(db, "suppliers"), orderBy("createdAt", "desc"));
    const data = await getDocs(q);

    data.forEach((supplier) => {
      suppliers.push({ ...supplier.data(), id: supplier.id } as Supplier);
    });

    return suppliers;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw new Error("Failed to fetch suppliers");
  }
};

// Utility to get supplier stats
export const getSupplierStats = (suppliers: Supplier[]) => {
  const stats = {
    total: suppliers.length,
    active: 0,
    inactive: 0,
    suspended: 0,
    services: 0,
    products: 0,
  };

  suppliers.forEach((supplier: Supplier) => {
    // Count by status
    if (supplier.status === "Activo") stats.active++;
    else if (supplier.status === "Inactivo") stats.inactive++;
    else if (supplier.status === "Suspenso") stats.suspended++;

    // Count by type
    if (supplier.tipo === "Serviço") stats.services++;
    else if (supplier.tipo === "Produto") stats.products++;
  });

  return stats;
};

// React Query hook for suppliers
export const useSuppliers = () => {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
