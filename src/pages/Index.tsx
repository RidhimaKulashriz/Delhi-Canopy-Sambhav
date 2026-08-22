import { motion } from "framer-motion";
import { Navigation } from "@/components/layout/Navigation";
import { KPICard } from "@/components/ui/KPICard";
import { SatelliteMapView } from "@/components/map/SatelliteMapView";
import { AIInsightPanelLive } from "@/components/dashboard/AIInsightPanelLive";
import { AlertsFeed } from "@/components/dashboard/AlertsFeed";
import { WardRankingTableLive } from "@/components/dashboard/WardRankingTableLive";
import { ClimateTrendChartLive } from "@/components/charts/ClimateTrendChartLive";
import { FloatingAIAssistant } from "@/components/ai/FloatingAIAssistant";
import { ChartErrorBoundary } from "@/components/ui/ChartErrorBoundary";
import { useDashboardData } from "@/hooks/useDashboardData";
import { kpiData as fallbackKpis } from "@/data/mockData";
import { Satellite, Radio, Cpu, Signal, Database, RefreshCw, Loader2, Shield, RadioTower, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { 
    kpis, 
    isLoading, 
    isSeeded, 
    dataMode,
    error, 
    initializeDatabase,
    refresh 
  } = useDashboardData();

  // Use API data if available, otherwise fall back to mock data
  const displayKpis = kpis.length > 0 ? kpis : fallbackKpis;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navigation />
      
      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-[1600px]">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/30">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping" />
                    </div>
                    <span className="text-[10px] font-tech text-primary uppercase tracking-wider">
                      {isLoading ? "Syncing..." : dataMode === "live" ? "System Online" : dataMode === "local-preview" ? "Preview Ready" : "Data Unavailable"}
                    </span>
                  </div>
                  <span className="text-[10px] font-tech text-muted-foreground">
                    • {dataMode === "live" ? "Connected data active" : dataMode === "local-preview" ? "Local preview packet active" : "No data packet available"}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2 tracking-wide">
                  <span className="text-glow">COMMAND</span>{" "}
                  <span className="text-muted-foreground">CENTER</span>
                </h1>
                <p className="text-sm text-muted-foreground font-tech max-w-xl">
                  AI-powered urban green intelligence dashboard monitoring Delhi's vegetation, heat stress, and climate risk in real-time.
                </p>
              </div>

              {/* System Status */}
              <div className="flex items-center gap-3 flex-wrap">
                {!isSeeded && !isLoading && dataMode === "unavailable" && (
                  <Button
                    onClick={initializeDatabase}
                    className="gap-2 bg-primary/20 border border-primary/30 hover:bg-primary/30"
                    variant="outline"
                  >
                    <Database className="w-4 h-4" />
                    Initialize AI System
                  </Button>
                )}
                {isSeeded && (
                  <Button
                    onClick={refresh}
                    disabled={isLoading}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                )}
                {[
                  { icon: Satellite, label: 'SAT', status: isSeeded ? 'active' : 'standby' },
                  { icon: Radio, label: 'FEED', status: isSeeded ? 'active' : 'standby' },
                  { icon: Cpu, label: 'AI', status: 'active' },
                  { icon: Signal, label: 'NET', status: 'active' },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-border/50"
                  >
                    <item.icon className={`w-4 h-4 ${item.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-[10px] font-tech text-muted-foreground">{item.label}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Database Initialization Banner */}
          {!isSeeded && !isLoading && dataMode === "unavailable" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-secondary/10 border border-secondary/30"
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-sm font-medium text-foreground">AI System Initialization Required</p>
                  <p className="text-xs text-muted-foreground">
                    Click "Initialize AI System" to seed the database with Delhi ward data, NDVI scores, heat indices, and AI-generated insights.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30"
            >
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {displayKpis.map((kpi, index) => (
              <KPICard key={kpi.label} {...kpi} delay={index} />
            ))}
          </div>

          {/* Related field-instrument companion */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="mb-6 overflow-hidden rounded-xl border border-primary/30 bg-card/50"
            aria-labelledby="drift-companion-title"
          >
            <div className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <RadioTower className="h-4 w-4" />
                  <span className="font-tech text-[10px] uppercase tracking-[0.2em]">Field Instrument Companion</span>
                </div>
                <h2 id="drift-companion-title" className="font-display text-xl font-bold tracking-wide text-foreground">
                  DELHICANOPY <span className="text-primary">DRIFT</span>
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  Explore the separate buildable, pole-mounted air-quality field node for street-level PM1, PM2.5, PM10, and NO₂ demonstration channels, mounting guidance, 3D model, firmware, and build kit.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  DRIFT is an independent field-instrument prototype. Its demo telemetry does not automatically become live data in this dashboard.
                </p>
              </div>
              <Button asChild className="shrink-0 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <a href="https://delhicanopydrift.vercel.app/" target="_blank" rel="noreferrer">
                  Open DELHICANOPY DRIFT
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.section>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Map - Takes 2 columns */}
            <div className="lg:col-span-2 h-[500px]">
              <ChartErrorBoundary componentName="Satellite Map" fallbackHeight="h-[500px]">
                <SatelliteMapView />
              </ChartErrorBoundary>
            </div>

            {/* AI Insight Panel */}
            <div className="h-[500px]">
              <AIInsightPanelLive />
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Alerts Feed */}
            <div className="lg:col-span-1">
              <AlertsFeed />
            </div>

            {/* Chart */}
            <div className="lg:col-span-2">
              <ChartErrorBoundary componentName="Climate Chart" fallbackHeight="h-[300px]">
                <ClimateTrendChartLive />
              </ChartErrorBoundary>
            </div>
          </div>

          {/* Ward Ranking Table */}
          <WardRankingTableLive />

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8 p-4 rounded-lg bg-card/30 border border-border/30 text-center"
          >
            <p className="text-xs text-muted-foreground font-tech">
              <span className="text-primary">⚠</span> This is an AI-powered MVP using {dataMode === "live" ? "connected project datasets" : dataMode === "local-preview" ? "a local demonstration packet" : "a limited interface state"} to demonstrate how urban green intelligence workflows would function in real deployments.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
};

export default Index;
