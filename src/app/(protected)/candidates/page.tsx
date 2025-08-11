"use client";
import React from "react";
import {
  CircularProgress,
  Box,
  Alert,
  Typography,
  Skeleton,
  Grid,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import CandidatesTable from "./candidates-table";
import { useCandidates, getCandidatesStats } from "@/hooks/useCandidates";

// Loading skeleton for stats cards
const StatsCardSkeleton = () => (
  <Card className="h-full">
    <CardContent className="text-center p-4">
      <Skeleton
        variant="circular"
        width={40}
        height={40}
        className="mx-auto mb-2"
      />
      <Skeleton variant="text" width={60} height={32} className="mx-auto" />
      <Skeleton variant="text" width="80%" height={20} className="mx-auto" />
    </CardContent>
  </Card>
);

// Full loading state component
const LoadingState = () => (
  <div className="max-w-7xl mx-auto p-6">
    {/* Header skeleton */}
    <div className="mb-6">
      <Skeleton variant="text" width={350} height={40} className="mb-2" />
      <Skeleton variant="text" width={500} height={24} />
    </div>

    {/* Stats cards skeleton */}
    <Grid container spacing={3} className="mb-6">
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <StatsCardSkeleton />
        </Grid>
      ))}
    </Grid>

    {/* Table loading */}
    <div className="bg-white rounded-lg shadow-sm">
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
  </div>
);

const Page = () => {
  const { data: candidates = [], isLoading, isError, error } = useCandidates();

  // Get candidates stats
  const stats =
    candidates.length > 0
      ? getCandidatesStats(candidates)
      : {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          recentSubmissions: 0,
        };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Alert severity="error" variant="filled" className="mb-6 rounded-lg">
          <Typography variant="h6">Erro ao carregar candidaturas</Typography>
          <Typography variant="body2">
            {error?.message || "Erro desconhecido"}
          </Typography>
        </Alert>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Candidaturas de Empresas
          </h1>
          <p className="text-gray-600 mt-2">
            Gerir candidaturas de empresas para fornecedores do Governo
            Provincial do Cunene
          </p>
        </div>
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <CandidatesTable data={candidates as any} />
      </div>
    </div>
  );
};

export default Page;
