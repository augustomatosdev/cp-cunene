"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CircularProgress, Box } from "@mui/material";
import CandidatesTable from "./candidates-table";

const Page = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "candidates"),
          orderBy("createdAt", "desc")
        );
        const data = await getDocs(q);

        const candidatesData: any[] = [];
        data.forEach((doc) => {
          candidatesData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setCandidates(candidatesData);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Candidaturas de Empresas
        </h1>
        <p className="text-gray-600 mt-2">
          Gerir candidaturas de empresas para fornecedores do Governo Provincial
          do Cunene
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <CandidatesTable data={candidates} />
      </div>
    </div>
  );
};

export default Page;
