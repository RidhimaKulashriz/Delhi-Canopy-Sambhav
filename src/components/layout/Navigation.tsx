import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TreeDeciduous,
  Thermometer,
  AlertOctagon,
  Brain,
  FileText,
  Building2,
  HelpCircle,
  ChevronDown,
  Satellite,
  Activity,
  MapPinned
} from "lucide-react";

const navItems = [
  { path: '/', label: 'Command Center', icon: LayoutDashboard },
  { path: '/green-intelligence', label: 'Green Intelligence', icon: TreeDeciduous },
  { path: '/heat-stress', label: 'Heat Stress', icon: Thermometer },
  { path: '/tree-loss', label: 'Tree Loss Detection', icon: AlertOctagon },
  { path: '/ai-planner', label: 'AI Planner', icon: Brain },
  { path: '/planting-space-finder', label: 'Planting Spaces', icon: MapPinned },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/governance', label: 'Governance', icon: Building2 },
  { path: '/how-it-works', label: 'How It Works', icon: HelpCircle },
];

export function Navigation() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-transparent pointer-events-none" />
      
      <nav className="relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
                  <Satellite className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold tracking-wider text-glow">
                  DelhiCanopy
                </span>
                <span className="text-[10px] text-muted-foreground font-tech tracking-widest uppercase">
                  AI Command Center
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      "hover:bg-primary/10 group",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{item.label}</span>
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-border/50">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping" />
                </div>
                <span className="text-xs font-tech text-muted-foreground">LIVE</span>
                <Activity className="w-3 h-3 text-primary" />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="lg:hidden p-2 rounded-lg hover:bg-card/50 transition-colors"
              >
                <ChevronDown className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="py-4 space-y-1 border-t border-border/50">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsExpanded(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                      isActive 
                        ? "bg-primary/10 text-primary nav-active" 
                        : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}
