import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GreenIntelligence from "./pages/GreenIntelligence";
import HeatStress from "./pages/HeatStress";
import TreeLossDetection from "./pages/TreeLossDetection";
import AIPlanner from "./pages/AIPlanner";
import PlantingSpaceFinder from "./pages/PlantingSpaceFinder";
import Reports from "./pages/Reports";
import Governance from "./pages/Governance";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/green-intelligence" element={<GreenIntelligence />} />
          <Route path="/heat-stress" element={<HeatStress />} />
          <Route path="/tree-loss" element={<TreeLossDetection />} />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/planting-space-finder" element={<PlantingSpaceFinder />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
