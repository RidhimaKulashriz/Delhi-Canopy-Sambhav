import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAIInsights } from "@/hooks/useDashboardData";
import { aiInsights as fallbackInsights } from "@/data/mockData";
import { 
  Brain, 
  ChevronRight, 
  Sparkles, 
  AlertTriangle,
  TrendingUp,
  Target,
  Zap,
  Loader2,
  RefreshCw
} from "lucide-react";

export function AIInsightPanelLive() {
  const navigate = useNavigate();
  const { insights, isLoading, error, refresh } = useAIInsights();
  const [currentInsight, setCurrentInsight] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Use API insights if available, otherwise fallback
  const displayInsights = insights.length > 0 ? insights : fallbackInsights;

  useEffect(() => {
    const insight = displayInsights[currentInsight];
    if (!insight) return;
    
    let charIndex = 0;
    setDisplayedText("");
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (charIndex < insight.insight.length) {
        setDisplayedText(insight.insight.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 15);

    return () => clearInterval(typingInterval);
  }, [currentInsight, displayInsights]);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % displayInsights.length);
    }, 10000);

    return () => clearInterval(cycleInterval);
  }, [displayInsights.length]);

  const insight = displayInsights[currentInsight];
  if (!insight) return null;

  const priorityColors = {
    low: 'text-muted-foreground',
    medium: 'text-warning',
    high: 'text-destructive'
  };

  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'Heat Analysis': AlertTriangle,
    'Trend Prediction': TrendingUp,
    'Resource Optimization': Target,
    'Pattern Detection': Zap,
    'Vegetation': Target,
    'Climate Risk': AlertTriangle,
  };

  const CategoryIcon = categoryIcons[insight.category] || Brain;
  const analysisRoute = insight.category.includes("Heat") || insight.category.includes("Climate") ? "/heat-stress" : "/green-intelligence";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card glow-border p-5 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3"
            >
              <Sparkles className="w-3 h-3 text-secondary" />
            </motion.div>
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold text-glow">AI INSIGHT</h3>
            <p className="text-[10px] text-muted-foreground font-tech">
              {insights.length > 0 ? 'LIVE NEURAL ANALYSIS' : 'NEURAL ANALYSIS'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
          <button
            onClick={refresh}
            className="p-1 rounded hover:bg-card/50 transition-colors"
            title="Refresh insights"
          >
            <RefreshCw className="w-3 h-3 text-muted-foreground hover:text-primary" />
          </button>
          <div className="flex items-center gap-1">
            {displayInsights.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentInsight(idx)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-200",
                  idx === currentInsight 
                    ? "bg-primary w-4 shadow-[0_0_10px_hsl(var(--primary))]" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 rounded bg-destructive/10 border border-destructive/30">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* Insight Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentInsight}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
              "bg-card border border-border/50",
              priorityColors[insight.priority]
            )}>
              <CategoryIcon className="w-3 h-3" />
              <span className="font-tech">{insight.category}</span>
            </div>
            {insight.actionRequired && (
              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/30 animate-pulse">
                ACTION REQUIRED
              </span>
            )}
          </div>

          {/* Insight Text */}
          <div className="min-h-[80px]">
            <p className="text-sm text-foreground/90 leading-relaxed font-body">
              {displayedText}
              {isTyping && <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />}
            </p>
          </div>

          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-tech">AI Confidence Level</span>
              <span className="font-display font-bold text-primary">{insight.confidence}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${insight.confidence}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary progress-glow"
              />
            </div>
          </div>

          {/* Action Button */}
          <button onClick={() => navigate(analysisRoute)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-all duration-200 group">
            <span className="text-xs font-medium text-primary">View Full Analysis</span>
            <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
