// src/hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define user type
export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt: any;
  [key: string]: any; // For other user properties
}

// Fetch users function
const fetchUsers = async (): Promise<User[]> => {
  const users: User[] = [];

  try {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const data = await getDocs(q);

    data.forEach((user) => {
      users.push({ ...user.data(), id: user.id } as User);
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

// React Query hook for users
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
