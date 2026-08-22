import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  TreePine, 
  Thermometer, 
  ShieldAlert,
  Leaf,
  Clock,
  MapPin,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useAlerts } from "@/hooks/useDashboardData";
import { recentAlerts as fallbackAlerts } from "@/data/mockData";
import { format, parseISO } from "date-fns";

const alertIcons = {
  tree_loss: TreePine,
  heat_spike: Thermometer,
  risk_alert: ShieldAlert,
  plantation_needed: Leaf
};

const severityColors = {
  low: 'border-muted-foreground/30 bg-muted/20',
  medium: 'border-warning/30 bg-warning/10',
  high: 'border-warning/50 bg-warning/20',
  critical: 'border-destructive/50 bg-destructive/20 animate-border-glow'
};

const severityIconColors = {
  low: 'text-muted-foreground',
  medium: 'text-warning',
  high: 'text-warning',
  critical: 'text-destructive'
};

export function AlertsFeed() {
  const navigate = useNavigate();
  const { alerts: apiAlerts, isLoading } = useAlerts(20);
  
  // Transform API alerts to match expected format, fall back to mock data
  const alerts = apiAlerts.length > 0 
    ? apiAlerts.map(a => ({
        id: a.id,
        type: a.alert_type,
        severity: a.severity,
        ward: a.location_description || a.wards?.name || 'Unknown',
        message: a.message,
        timestamp: a.detected_at,
        coordinates: [28.6139, 77.209] as [number, number], // Default coordinates
      }))
    : fallbackAlerts;

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-5 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-destructive animate-spin" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-destructive" />
              )}
            </div>
            {!isLoading && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive animate-ping" />}
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold">LIVE ALERTS</h3>
            <p className="text-[10px] text-muted-foreground font-tech">
              {apiAlerts.length > 0 ? 'REAL-TIME FEED' : 'LAST 24 HOURS'}
            </p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-destructive/20 text-destructive border border-destructive/30">
          {criticalCount} CRITICAL
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {alerts.map((alert, index) => {
          const Icon = alertIcons[alert.type as keyof typeof alertIcons] || AlertTriangle;
          const formattedTime = format(parseISO(alert.timestamp), 'HH:mm');
          
          return (
            <motion.button
              key={alert.id}
              onClick={() => navigate("/tree-loss")}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "relative w-full p-3 rounded-lg border text-left transition-all duration-200 cursor-pointer",
                "hover:scale-[1.02] group",
                severityColors[alert.severity]
              )}
            >
              {/* Severity indicator line */}
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
                alert.severity === 'critical' ? 'bg-destructive' :
                alert.severity === 'high' ? 'bg-warning' :
                alert.severity === 'medium' ? 'bg-warning/70' : 'bg-muted-foreground'
              )} />

              <div className="flex items-start gap-3 pl-2">
                <div className={cn(
                  "p-1.5 rounded-md bg-card/50",
                  severityIconColors[alert.severity]
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                      alert.severity === 'critical' ? 'bg-destructive/30 text-destructive' :
                      alert.severity === 'high' ? 'bg-warning/30 text-warning' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-tech flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formattedTime}
                    </span>
                  </div>
                  
                  <p className="text-xs text-foreground/90 line-clamp-2 mb-1.5">
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="font-tech">{alert.ward}</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* View All Button */}
      <button onClick={() => navigate("/tree-loss")} className="w-full mt-4 py-2 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-200 text-xs font-medium text-muted-foreground hover:text-foreground">
        View All Alerts
      </button>
    </motion.div>
  );
}
