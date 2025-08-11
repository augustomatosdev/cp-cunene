// src/hooks/useDocuments.ts
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define document type
export interface Document {
  id: string;
  title: string;
  description: string;
  reference: string;
  supplierId: string;
  supplierName: string;
  folderId?: string;
  folderName?: string;
  office: string;
  fileUrls?: Array<{ name: string; url: string }>;
  createdAt: any;
  updatedAt: any;
  [key: string]: any; // For other document properties
}

// Fetch documents function with optional folder filter
const fetchDocuments = async (
  folderId?: string | null
): Promise<Document[]> => {
  const documents: Document[] = [];

  try {
    let q;

    if (folderId) {
      // Filter by folder if folderId is provided
      q = query(
        collection(db, "documents"),
        where("folderId", "==", folderId),
        orderBy("createdAt", "desc")
      );
    } else {
      // Get all documents if no folder filter
      q = query(collection(db, "documents"), orderBy("createdAt", "desc"));
    }

    const data = await getDocs(q);

    data.forEach((document) => {
      documents.push({
        ...document.data(),
        id: document.id,
      } as Document);
    });

    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Failed to fetch documents");
  }
};

// React Query hook for documents with optional folder filtering
export const useDocuments = (folderId?: string | null) => {
  return useQuery({
    queryKey: ["documents", folderId], // Include folderId in query key for proper caching
    queryFn: () => fetchDocuments(folderId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Utility to get documents stats
export const getDocumentsStats = (documents: Document[]) => {
  const stats = {
    total: documents.length,
    uniqueFolders: new Set<string>(),
    uniqueSuppliers: new Set<string>(),
    uniqueOffices: new Set<string>(),
  };

  documents.forEach((document: Document) => {
    // Count unique folders
    if (document.folderId) {
      stats.uniqueFolders.add(document.folderId);
    }

    // Count unique suppliers
    if (document.supplierId) {
      stats.uniqueSuppliers.add(document.supplierId);
    }

    // Count unique offices
    if (document.office) {
      stats.uniqueOffices.add(document.office);
    }
  });

  return {
    ...stats,
    uniqueFoldersCount: stats.uniqueFolders.size,
    uniqueSuppliersCount: stats.uniqueSuppliers.size,
    uniqueOfficesCount: stats.uniqueOffices.size,
  };
};
