"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Paper,
  LinearProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Building2,
  File,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  ChevronRight,
  Ban,
} from "lucide-react";
import {
  collection,
  query,
  getDocs,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    activeSuppliers: 0,
    totalContracts: 0,
    activeContracts: 0,
    pendingContracts: 0,
    completedContracts: 0,
    totalValue: 0,
    recentContracts: [],
    monthlyStats: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch suppliers stats
        const suppliersSnapshot = await getDocs(collection(db, "suppliers"));
        const activeSuppliers = suppliersSnapshot.docs.filter(
          (doc) => doc.data().status === "Activo"
        ).length;

        // Fetch contracts stats
        const contractsSnapshot = await getDocs(collection(db, "contracts"));
        const contracts = contractsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate contract stats
        const activeContracts = contracts.filter(
          (contract: any) => contract.status === "Em andamento"
        ).length;
        const completedContracts = contracts.filter(
          (contract: any) => contract.status === "Concluido"
        ).length;
        const totalValue = contracts.reduce(
          (sum: number, contract: any) =>
            sum + parseFloat(contract.amount || 0),
          0
        );

        // Get recent contracts
        const recentContractsQuery = query(
          collection(db, "contracts"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const recentContractsSnapshot = await getDocs(recentContractsQuery);
        const recentContracts = recentContractsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update state
        setStats({
          totalSuppliers: suppliersSnapshot.size,
          activeSuppliers,
          totalContracts: contracts.length,
          activeContracts,
          pendingContracts: activeContracts,
          completedContracts,
          totalValue,
          recentContracts: recentContracts as any,
          monthlyStats: generateMonthlyStats(contracts) as any,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const generateMonthlyStats = (contracts: any) => {
    // Group contracts by month and calculate totals
    const monthlyData = contracts.reduce((acc: any, contract: any) => {
      const date = new Date(contract.startDate);
      const month = date.toLocaleString("pt-BR", { month: "short" });

      if (!acc[month]) {
        acc[month] = {
          month,
          count: 0,
          value: 0,
        };
      }

      acc[month].count += 1;
      acc[month].value += parseFloat(contract.amount || 0);

      return acc;
    }, {});

    return Object.values(monthlyData);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full bg-${color}-50`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="flex-1">
            <Typography variant="h6" className="text-gray-900 font-semibold">
              {value}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {title}
            </Typography>
          </div>
        </div>
        {subtitle && (
          <Typography variant="caption" className="block mt-2 text-gray-500">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-4">
        <LinearProgress className="rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Typography variant="h4" className="text-gray-900 font-semibold">
            Dashboard
          </Typography>
        </div>
        <Button
          variant="contained"
          className="bg-red-900 hover:bg-red-800"
          startIcon={<File className="h-5 w-5" />}
          LinkComponent={Link}
          href="/contracts/create"
        >
          Novo Contrato
        </Button>
      </div>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Building2}
            title="Total de Fornecedores"
            value={stats.totalSuppliers}
            subtitle={`${stats.activeSuppliers} fornecedores ativos`}
            color="blue"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={File}
            title="Contratos Ativos"
            value={stats.activeContracts}
            subtitle={`${stats.totalContracts} contratos no total`}
            color="green"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Clock}
            title="Contratos Pendentes"
            value={stats.pendingContracts}
            color="yellow"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TrendingUp}
            title="Valor Total"
            value={`${stats.totalValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "AOA",
            })}`}
            color="purple"
          />
        </Grid>
      </Grid>

      {/* Charts and Tables */}
      <Grid container spacing={3}>
        {/* Monthly Stats Chart */}
        <Grid item xs={12} md={8}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Contratos por Mês
            </Typography>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#800706" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>

        {/* Recent Contracts */}
        <Grid item xs={12} md={4}>
          <Paper className="p-4">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6">Contratos Recentes</Typography>
              <Button endIcon={<ChevronRight className="h-4 w-4" />}>
                Ver todos
              </Button>
            </div>
            <div className="space-y-4">
              {stats.recentContracts.map((contract: any) => (
                <div
                  key={contract.id}
                  className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div
                    className={`p-2 rounded-full ${
                      contract.status === "Em andamento"
                        ? "bg-yellow-50 text-yellow-600"
                        : contract.status === "Concluido"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {contract.status === "Em andamento" ? (
                      <Clock className="h-5 w-5" />
                    ) : contract.status === "Concluido" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Ban className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography noWrap className="font-medium text-gray-900">
                      {contract.reference}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      {contract.supplier}
                    </Typography>
                  </div>
                  <Typography variant="body2" className="text-gray-500">
                    {new Date(contract.startDate).toLocaleDateString("pt-BR")}
                  </Typography>
                </div>
              ))}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
