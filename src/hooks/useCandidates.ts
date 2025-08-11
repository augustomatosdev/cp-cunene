// src/hooks/useCandidates.ts
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define candidate type
export interface Candidate {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  nif?: string;
  address?: string;
  status: "Pendente" | "Aprovado" | "Rejeitado";
  submittedAt: any;
  reviewedAt?: any;
  reviewedBy?: string;
  documents?: Array<{ name: string; url: string }>;
  createdAt: any;
  updatedAt?: any;
  [key: string]: any; // For other candidate properties
}

// Fetch candidates function
const fetchCandidates = async (): Promise<Candidate[]> => {
  const candidates: Candidate[] = [];

  try {
    const q = query(collection(db, "candidates"), orderBy("createdAt", "desc"));
    const data = await getDocs(q);

    data.forEach((doc) => {
      candidates.push({
        id: doc.id,
        ...doc.data(),
      } as Candidate);
    });

    return candidates;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw new Error("Failed to fetch candidates");
  }
};

// Utility to get candidates stats
export const getCandidatesStats = (candidates: Candidate[]) => {
  const stats = {
    total: candidates.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    recentSubmissions: 0, // Last 7 days
  };

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  candidates.forEach((candidate: Candidate) => {
    // Count by status
    if (candidate.status === "Pendente") stats.pending++;
    else if (candidate.status === "Aprovado") stats.approved++;
    else if (candidate.status === "Rejeitado") stats.rejected++;

    // Count recent submissions
    const submittedDate =
      candidate.submittedAt?.toDate() || candidate.createdAt?.toDate();
    if (submittedDate && submittedDate >= sevenDaysAgo) {
      stats.recentSubmissions++;
    }
  });

  return stats;
};

// React Query hook for candidates
export const useCandidates = () => {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: fetchCandidates,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
