import { useState, useEffect, useCallback } from "react";
import {
  fetchWards,
  fetchAlerts,
  fetchKPIs,
  fetchInsights,
  fetchClimateTrends,
  fetchPlantationPlans,
  checkDatabaseStatus,
  seedDatabase,
  type Ward,
  type Alert,
  type KPI,
  type AIInsight,
  type ClimateTrend,
  type PlantationPlan,
} from "@/services/canopyAPI";

// ============================================
// DASHBOARD DATA HOOK
// Fetches all data needed for the main dashboard
// ============================================

interface DashboardData {
  wards: Ward[];
  alerts: Alert[];
  kpis: KPI[];
  insights: AIInsight[];
  climateTrends: ClimateTrend[];
  plantationPlans: PlantationPlan[];
  isLoading: boolean;
  isSeeded: boolean;
  dataMode: "live" | "local-preview" | "unavailable";
  error: string | null;
}

export function useDashboardData(): DashboardData & {
  refresh: () => Promise<void>;
  initializeDatabase: () => Promise<boolean>;
} {
  const [data, setData] = useState<DashboardData>({
    wards: [],
    alerts: [],
    kpis: [],
    insights: [],
    climateTrends: [],
    plantationPlans: [],
    isLoading: true,
    isSeeded: false,
    dataMode: "unavailable",
    error: null,
  });

  const checkAndFetchData = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if database is seeded
      const status = await checkDatabaseStatus();
      const isLocalPreview = status.counts?.mode === "local-preview" || !status.seeded;

      // Fetch all data in parallel
      const [wards, alerts, kpis, insights, climateTrends, plantationPlans] = await Promise.all([
        fetchWards(),
        fetchAlerts(20),
        fetchKPIs(),
        fetchInsights(),
        fetchClimateTrends(12),
        fetchPlantationPlans(10),
      ]);

      setData({
        wards,
        alerts,
        kpis,
        insights,
        climateTrends,
        plantationPlans,
        isLoading: false,
        // A complete fallback packet is actionable for preview mode even when the
        // external seed-status endpoint reports no database records.
        isSeeded: true,
        dataMode: isLocalPreview ? "local-preview" : "live",
        error: null,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        dataMode: "unavailable",
        error: error instanceof Error ? error.message : "Failed to load data",
      }));
    }
  }, []);

  const initializeDatabase = useCallback(async (): Promise<boolean> => {
    setData((prev) => ({ ...prev, isLoading: true }));
    
    try {
      const result = await seedDatabase();
      if (result.success) {
        await checkAndFetchData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error initializing database:", error);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to initialize database",
      }));
      return false;
    }
  }, [checkAndFetchData]);

  useEffect(() => {
    checkAndFetchData();
  }, [checkAndFetchData]);

  return {
    ...data,
    refresh: checkAndFetchData,
    initializeDatabase,
  };
}

// ============================================
// WARDS DATA HOOK
// ============================================

export function useWards() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWards();
      setWards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch wards");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { wards, isLoading, error, refresh };
}

// ============================================
// ALERTS HOOK
// ============================================

export function useAlerts(limit = 20, severity?: string) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAlerts(limit, severity);
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch alerts");
    } finally {
      setIsLoading(false);
    }
  }, [limit, severity]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { alerts, isLoading, error, refresh };
}

// ============================================
// KPIs HOOK
// ============================================

export function useKPIs() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchKPIs();
      setKpis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch KPIs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { kpis, isLoading, error, refresh };
}

// ============================================
// AI INSIGHTS HOOK
// ============================================

export function useAIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchInsights();
      setInsights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch insights");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { insights, isLoading, error, refresh };
}

// ============================================
// CLIMATE TRENDS HOOK
// ============================================

export function useClimateTrends(months = 12) {
  const [trends, setTrends] = useState<ClimateTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchClimateTrends(months);
      setTrends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trends");
    } finally {
      setIsLoading(false);
    }
  }, [months]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { trends, isLoading, error, refresh };
}

// ============================================
// PLANTATION PLANS HOOK
// ============================================

export function usePlantationPlans(limit = 20) {
  const [plans, setPlans] = useState<PlantationPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPlantationPlans(limit);
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch plans");
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { plans, isLoading, error, refresh };
}
