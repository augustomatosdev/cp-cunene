// src/hooks/useContracts.ts
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define contract type
export interface Contract {
  id: string;
  supplier: string;
  supplierId: string;
  reference: string;
  description: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
  object: string;
  fileUrls?: Array<{ name: string; url: string }>;
  createdAt: any;
  updatedAt: any;
}

// Fetch contracts function
const fetchContracts = async (): Promise<Contract[]> => {
  const contracts: Contract[] = [];

  try {
    const q = query(collection(db, "contracts"), orderBy("createdAt", "desc"));
    const data = await getDocs(q);

    data.forEach((contract) => {
      contracts.push({
        ...contract.data(),
        id: contract.id,
      } as Contract);
    });

    return contracts;
  } catch (error) {
    console.error("Error fetching contracts:", error);
    throw new Error("Failed to fetch contracts");
  }
};

// Utility to get contract stats
export const getContractStats = (contracts: Contract[]) => {
  const stats = {
    total: contracts.length,
    emAndamento: 0,
    concluido: 0,
    cancelado: 0,
    totalValue: 0,
    activeContracts: 0,
    uniqueSuppliers: new Set<string>(),
  };

  const currentDate = new Date();

  contracts.forEach((contract: Contract) => {
    // Count by status
    if (contract.status === "Em andamento") stats.emAndamento++;
    else if (contract.status === "Concluido") stats.concluido++;
    else if (contract.status === "Cancelado") stats.cancelado++;

    // Calculate total value
    if (contract.amount && typeof contract.amount === "number") {
      stats.totalValue += contract.amount;
    }

    // Count active contracts (not ended and not cancelled)
    const endDate = new Date(contract.endDate);
    if (contract.status !== "Cancelado" && endDate >= currentDate) {
      stats.activeContracts++;
    }

    // Count unique suppliers
    if (contract.supplierId) {
      stats.uniqueSuppliers.add(contract.supplierId);
    }
  });

  return {
    ...stats,
    uniqueSuppliersCount: stats.uniqueSuppliers.size,
  };
};

// Currency formatter utility
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// React Query hook for contracts
export const useContracts = () => {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
