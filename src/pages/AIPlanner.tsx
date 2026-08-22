// X-Tech interaction note: preserve the existing command-center hierarchy and neon telemetry language; functional fallbacks must not alter its visual system.
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/layout/Navigation";
import { FloatingAIAssistant } from "@/components/ai/FloatingAIAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { useWards, usePlantationPlans } from "@/hooks/useDashboardData";
import { generatePlantationPlan, fetchPlantationPlans } from "@/services/canopyAPI";
import { 
  Brain, 
  Sparkles,
  MapPin,
  TreeDeciduous,
  Thermometer,
  Leaf,
  Zap,
  ChevronRight,
  Settings2,
  Loader2,
  RefreshCw,
  Clock,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { wardData } from "@/data/mockData";

interface PlanResult {
  ward: string;
  priority: string;
  requiredTrees: number;
  heatReduction: number;
  carbonOffset: number;
  urgencyIndex: number;
  landType: string;
  estimatedCost: string;
  timeline?: string;
  species?: string[];
  reasoning?: string;
}

const localPlannerWards = wardData.map((ward) => ({
  id: `ward-${ward.id}`,
  name: ward.name,
  zone: "Delhi",
}));

const AIPlanner = () => {
  const { wards, isLoading: wardsLoading } = useWards();
  const { plans: existingPlans, isLoading: plansLoading, refresh: refreshPlans } = usePlantationPlans(10);
  
  const [selectedWard, setSelectedWard] = useState<string>(localPlannerWards[0]?.id ?? "");
  const [landType, setLandType] = useState("mixed_urban");
  const [density, setDensity] = useState([65]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<PlanResult | null>(null);
  const [allPlans, setAllPlans] = useState<PlanResult[]>([]);
  const [focusedPlan, setFocusedPlan] = useState<PlanResult | null>(null);
  const plannerWards = wards.length > 0 ? wards : localPlannerWards;

  // Set initial ward when wards load
  useEffect(() => {
    if (plannerWards.length > 0 && !selectedWard) {
      setSelectedWard(plannerWards[0].id);
    }
  }, [plannerWards, selectedWard]);

  // Transform existing plans from API
  useEffect(() => {
    if (existingPlans.length > 0) {
      setAllPlans(existingPlans);
    }
  }, [existingPlans]);

  const handleAnalyze = async () => {
    if (!selectedWard) {
      toast.error("Please select a ward");
      return;
    }

    setIsCalculating(true);
    
    try {
      const selectedWardRecord = plannerWards.find((ward) => ward.id === selectedWard);
      const result = await generatePlantationPlan(selectedWard, {
        landType,
        urbanDensity: density[0],
        wardName: selectedWardRecord?.name,
      });

      if (result && result.plan) {
        const newPlan: PlanResult = {
          ward: result.ward.name,
          priority: result.plan.priorityScore > 80 ? "CRITICAL" : result.plan.priorityScore > 60 ? "HIGH" : "MEDIUM",
          requiredTrees: result.plan.requiredTrees,
          heatReduction: result.plan.estimatedHeatReduction,
          carbonOffset: result.plan.estimatedCO2Offset,
          urgencyIndex: result.plan.priorityScore,
          landType: landType.replace("_", " ").toUpperCase(),
          estimatedCost: `₹${(result.plan.estimatedCost / 100000).toFixed(1)}L`,
          timeline: result.plan.implementationTimeline,
          species: result.plan.recommendedSpecies,
          reasoning: result.plan.reasoning,
        };

        setGeneratedPlan(newPlan);
        setFocusedPlan(newPlan);
        setAllPlans(prev => [newPlan, ...prev.filter(p => p.ward !== newPlan.ward)]);
        toast.success("AI Strategy Generated Successfully!");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleViewFullPlan = (plan: PlanResult) => {
    setFocusedPlan(plan);
    toast.success(`${plan.ward} plan detail opened.`);
  };

  const displayPlans = allPlans.length > 0 ? allPlans.slice(0, 5) : [
    {
      ward: "Karol Bagh",
      priority: "CRITICAL",
      requiredTrees: 340,
      heatReduction: 2.1,
      carbonOffset: 480,
      urgencyIndex: 91,
      landType: "Mixed Urban",
      estimatedCost: "₹12.5L"
    },
    {
      ward: "Shahdara North",
      priority: "CRITICAL",
      requiredTrees: 520,
      heatReduction: 3.2,
      carbonOffset: 720,
      urgencyIndex: 96,
      landType: "Industrial",
      estimatedCost: "₹18.2L"
    },
    {
      ward: "Central Delhi",
      priority: "HIGH",
      requiredTrees: 280,
      heatReduction: 1.8,
      carbonOffset: 390,
      urgencyIndex: 87,
      landType: "Commercial",
      estimatedCost: "₹9.8L"
    },
  ];

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navigation />
      
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-[1600px]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-[0_0_20px_hsl(var(--secondary)/0.5)]">
                  <Brain className="w-5 h-5 text-secondary-foreground" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold tracking-wide">
                  <span className="text-glow-cyan">AI</span>{" "}
                  <span className="text-muted-foreground">PLANTATION PLANNER</span>
                </h1>
                <p className="text-xs text-muted-foreground font-tech">
                  Neural Strategy Engine • Multi-Agent Analysis • {plannerWards.length} Wards Connected
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <GlassCard className="p-6 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Settings2 className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-display font-semibold">CONFIGURATION</h3>
              </div>

              <div className="space-y-6">
                {/* Ward Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-tech text-muted-foreground uppercase tracking-wider">
                    Select Ward / Area
                  </label>
                  <Select value={selectedWard} onValueChange={setSelectedWard}>
                    <SelectTrigger className="bg-card/50 border-border/50">
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border max-h-60">
                      {plannerWards.map((ward) => (
                        <SelectItem key={ward.id} value={ward.id}>
                          {ward.name} ({ward.zone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Land Type */}
                <div className="space-y-2">
                  <label className="text-xs font-tech text-muted-foreground uppercase tracking-wider">
                    Land Type
                  </label>
                  <Select value={landType} onValueChange={setLandType}>
                    <SelectTrigger className="bg-card/50 border-border/50">
                      <SelectValue placeholder="Select land type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="mixed_urban">Mixed Urban</SelectItem>
                      <SelectItem value="green_zone">Green Zone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Urban Density */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-tech text-muted-foreground uppercase tracking-wider">
                      Urban Density
                    </label>
                    <span className="text-xs font-display font-bold text-secondary">{density[0]}%</span>
                  </div>
                  <Slider
                    value={density}
                    onValueChange={setDensity}
                    max={100}
                    step={5}
                    className="[&>span:first-child]:bg-muted [&>span:first-child>span]:bg-secondary"
                  />
                </div>

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={isCalculating || !selectedWard}
                  className={cn(
                    "w-full py-3 rounded-lg font-display font-semibold text-sm uppercase tracking-wider",
                    "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
                    "shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
                    "hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300",
                    "flex items-center justify-center gap-2",
                    (isCalculating || !selectedWard) && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Generate Strategy</span>
                    </>
                  )}
                </button>

                {/* Refresh Plans Button */}
                <button
                  onClick={refreshPlans}
                  disabled={plansLoading}
                  className="w-full py-2 rounded-lg font-medium text-xs uppercase tracking-wider
                    bg-card/50 text-muted-foreground border border-border/50
                    hover:bg-card hover:text-foreground transition-all duration-200
                    flex items-center justify-center gap-2"
                >
                  {plansLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  <span>Refresh Existing Plans</span>
                </button>
              </div>
            </GlassCard>

            {/* Output Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Generated Plan (if any) */}
              {generatedPlan && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4"
                >
                  <GlassCard className="p-6 glow-border border-secondary/30">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      <span className="text-sm font-display font-semibold text-secondary">NEWLY GENERATED STRATEGY</span>
                    </div>
                    
                    {generatedPlan.reasoning && (
                      <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20 mb-4">
                        <p className="text-sm text-foreground/80 leading-relaxed">{generatedPlan.reasoning}</p>
                      </div>
                    )}

                    {generatedPlan.species && generatedPlan.species.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs text-muted-foreground">Recommended Species:</span>
                        {generatedPlan.species.map((species, idx) => (
                          <span key={idx} className="px-2 py-1 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/30">
                            {species}
                          </span>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )}

              {focusedPlan && (
                <GlassCard className="p-5 border-primary/30 bg-primary/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-tech text-primary">PLAN DETAIL · LOCAL OR CONNECTED PACKET</p>
                      <h3 className="mt-1 font-display text-lg font-bold">{focusedPlan.ward} implementation brief</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{focusedPlan.reasoning ?? `Prioritise ${focusedPlan.requiredTrees} starts across verified planting pockets, then track survival and heat reduction outcomes.`}</p>
                    </div>
                    <button onClick={() => setFocusedPlan(null)} className="text-xs font-tech text-muted-foreground hover:text-primary">CLOSE</button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground md:grid-cols-4">
                    <span><b className="text-foreground">Timeline:</b> {focusedPlan.timeline ?? "Field screen → monsoon planting → survival monitoring"}</span>
                    <span><b className="text-foreground">Land type:</b> {focusedPlan.landType}</span>
                    <span><b className="text-foreground">Priority:</b> {focusedPlan.priority}</span>
                    <span><b className="text-foreground">Budget:</b> {focusedPlan.estimatedCost}</span>
                  </div>
                  {focusedPlan.species && focusedPlan.species.length > 0 && <p className="mt-3 text-xs text-muted-foreground"><b className="text-foreground">Species packet:</b> {focusedPlan.species.join(", ")}</p>}
                </GlassCard>
              )}

              {/* AI Recommendations */}
              {displayPlans.map((rec, idx) => (
                <motion.div
                  key={`${rec.ward}-${idx}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <GlassCard 
                    className={cn(
                      "p-6",
                      rec.priority === 'CRITICAL' && "glow-border border-destructive/30"
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          rec.priority === 'CRITICAL' 
                            ? 'bg-destructive/20' 
                            : 'bg-warning/20'
                        )}>
                          <MapPin className={cn(
                            "w-5 h-5",
                            rec.priority === 'CRITICAL' ? 'text-destructive' : 'text-warning'
                          )} />
                        </div>
                        <div>
                          <h3 className="text-lg font-display font-bold">{rec.ward}</h3>
                          <p className="text-xs text-muted-foreground font-tech">{rec.landType} Zone</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {rec.timeline && (
                          <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-secondary/10 text-secondary border border-secondary/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {rec.timeline}
                          </span>
                        )}
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold uppercase",
                          rec.priority === 'CRITICAL' 
                            ? 'bg-destructive/20 text-destructive border border-destructive/30 animate-pulse'
                            : rec.priority === 'HIGH'
                            ? 'bg-warning/20 text-warning border border-warning/30'
                            : 'bg-primary/20 text-primary border border-primary/30'
                        )}>
                          {rec.priority} PRIORITY
                        </span>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-card/30 border border-border/30">
                        <div className="flex items-center gap-2 mb-1">
                          <TreeDeciduous className="w-3 h-3 text-primary" />
                          <span className="text-[10px] text-muted-foreground font-tech uppercase">Trees Required</span>
                        </div>
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xl font-display font-bold text-primary"
                        >
                          {rec.requiredTrees}
                        </motion.span>
                      </div>
                      <div className="p-3 rounded-lg bg-card/30 border border-border/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Thermometer className="w-3 h-3 text-secondary" />
                          <span className="text-[10px] text-muted-foreground font-tech uppercase">Heat Reduction</span>
                        </div>
                        <span className="text-xl font-display font-bold text-secondary">
                          -{rec.heatReduction}°C
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-card/30 border border-border/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Leaf className="w-3 h-3 text-primary" />
                          <span className="text-[10px] text-muted-foreground font-tech uppercase">CO₂ Offset</span>
                        </div>
                        <span className="text-xl font-display font-bold text-foreground">
                          +{rec.carbonOffset}t
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-card/30 border border-border/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-3 h-3 text-warning" />
                          <span className="text-[10px] text-muted-foreground font-tech uppercase">Urgency</span>
                        </div>
                        <span className={cn(
                          "text-xl font-display font-bold",
                          rec.urgencyIndex > 90 ? 'text-destructive' : 'text-warning'
                        )}>
                          {rec.urgencyIndex}/100
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <span className="text-sm text-muted-foreground font-tech">
                        Estimated Cost: <span className="text-foreground font-bold">{rec.estimatedCost}</span>
                      </span>
                      <button onClick={() => handleViewFullPlan(rec)} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                        View Full Plan
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <FloatingAIAssistant />
    </div>
  );
};

export default AIPlanner;
