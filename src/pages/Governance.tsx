import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/layout/Navigation";
import { FloatingAIAssistant } from "@/components/ai/FloatingAIAssistant";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Building2, 
  Shield,
  FileCheck,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const grievances = [
  { id: 1, title: 'Illegal Tree Felling - Rohini Sector 7', status: 'investigating', priority: 'high', date: '2024-01-14' },
  { id: 2, title: 'Heat Hazard - Karol Bagh Market', status: 'action_taken', priority: 'critical', date: '2024-01-12' },
  { id: 3, title: 'Green Space Encroachment - Dwarka', status: 'pending', priority: 'medium', date: '2024-01-15' },
  { id: 4, title: 'Plantation Request - South Extension', status: 'completed', priority: 'low', date: '2024-01-10' },
];

const statusColors = {
  pending: 'bg-warning/20 text-warning border-warning/30',
  investigating: 'bg-secondary/20 text-secondary border-secondary/30',
  action_taken: 'bg-primary/20 text-primary border-primary/30',
  completed: 'bg-primary/20 text-primary border-primary/30',
};

const statusLabels = {
  pending: 'Pending',
  investigating: 'Investigating',
  action_taken: 'Action Taken',
  completed: 'Completed',
};

const Governance = () => {
  const [issueType, setIssueType] = useState("Illegal Tree Felling");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [draftReceipt, setDraftReceipt] = useState<string | null>(null);

  const handleSaveDraft = () => {
    if (!location.trim() || !description.trim()) {
      toast.error("Add both a location and a description before saving a local grievance draft.");
      return;
    }
    const receipt = `DC-DRAFT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(location.trim().length + description.trim().length).padStart(3, "0")}`;
    setDraftReceipt(receipt);
    toast.success("Local grievance draft saved. No government system was contacted.");
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navigation />
      
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-[1400px]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning to-warning/50 flex items-center justify-center shadow-[0_0_20px_hsl(var(--warning)/0.5)]">
                <Building2 className="w-5 h-5 text-warning-foreground" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold tracking-wide">
                  <span className="text-warning">GOVERNANCE</span>{" "}
                  <span className="text-muted-foreground">INTERFACE</span>
                </h1>
                <p className="text-xs text-muted-foreground font-tech">
                  Evidence-Backed Grievances • Authority Routing • Action Tracking
                </p>
              </div>
            </div>
          </motion.div>

          {/* Coming Soon Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <GlassCard className="p-6 glow-border text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/30 mb-4">
                <Clock className="w-4 h-4 text-warning animate-pulse" />
                <span className="text-sm font-tech text-warning">LOCAL DRAFT MODE</span>
              </div>
              <h2 className="text-xl font-display font-bold mb-2">Evidence-ready grievance drafting</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Save a structured local draft with a receipt for a team handoff. This prototype does not transmit grievances to a government system or create an official case.
              </p>
            </GlassCard>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Grievances', value: '156', icon: FileCheck, color: 'text-primary' },
              { label: 'In Progress', value: '23', icon: Clock, color: 'text-warning' },
              { label: 'Resolved', value: '128', icon: CheckCircle2, color: 'text-primary' },
              { label: 'Authorities Linked', value: '12', icon: Users, color: 'text-secondary' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                  <span className="text-xs text-muted-foreground font-tech uppercase">{stat.label}</span>
                </div>
                <span className={cn("text-2xl font-display font-bold", stat.color)}>{stat.value}</span>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Grievance Submission */}
            <GlassCard className="p-5 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-display font-semibold">SUBMIT GRIEVANCE</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-tech text-muted-foreground uppercase">Issue Type</label>
                  <select value={issueType} onChange={(event) => setIssueType(event.target.value)} className="w-full px-3 py-2 rounded-lg bg-card/50 border border-border/50 text-sm focus:border-primary/30 focus:outline-none">
                    <option>Illegal Tree Felling</option>
                    <option>Heat Hazard</option>
                    <option>Green Space Violation</option>
                    <option>Plantation Request</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-tech text-muted-foreground uppercase">Location</label>
                  <input 
                    type="text" 
                    placeholder="Enter ward/area"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-card/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:border-primary/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-tech text-muted-foreground uppercase">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe the issue..."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-card/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:border-primary/30 focus:outline-none resize-none"
                  />
                </div>

                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">AI Evidence Attached</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    A local evidence reference is included in this draft. Confirm official channels and evidence requirements before submitting externally.
                  </p>
                </div>

                <button onClick={handleSaveDraft} className="w-full py-3 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-medium text-sm transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Save Local Draft
                </button>
                {draftReceipt && <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground"><p className="font-tech text-primary">DRAFT RECEIPT · {draftReceipt}</p><p className="mt-1">{issueType} · {location}. Stored only in this browser session; no authority was contacted.</p></div>}
              </div>
            </GlassCard>

            {/* Grievance Tracker */}
            <GlassCard className="p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-secondary" />
                  <h3 className="text-sm font-display font-semibold">EXAMPLE WORKFLOW TRACKER</h3>
                </div>
                <span className="text-xs text-muted-foreground font-tech">{grievances.length} Example records</span>
              </div>

              <div className="space-y-3">
                {grievances.map((grievance, idx) => (
                  <motion.div
                    key={grievance.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-lg bg-card/30 border border-border/30 hover:border-border transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium group-hover:text-primary transition-colors">
                          {grievance.title}
                        </h4>
                        <p className="text-xs text-muted-foreground font-tech">
                          Filed: {grievance.date}
                        </p>
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase border",
                        statusColors[grievance.status as keyof typeof statusColors]
                      )}>
                        {statusLabels[grievance.status as keyof typeof statusLabels]}
                      </span>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-1 mt-3">
                      {['Filed', 'Reviewed', 'Assigned', 'Action', 'Closed'].map((step, i) => {
                        const stepIndex = ['pending', 'investigating', 'action_taken', 'action_taken', 'completed'].indexOf(grievance.status);
                        const isCompleted = i <= stepIndex;
                        const isCurrent = i === stepIndex;
                        
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className={cn(
                              "w-full h-1 rounded-full",
                              isCompleted ? 'bg-primary' : 'bg-muted',
                              isCurrent && 'animate-pulse'
                            )} />
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Authority Pipeline */}
          <GlassCard className="p-5 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-display font-semibold">AUTHORITY ROUTING PIPELINE</h3>
            </div>
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
              {[
                { name: 'DelhiCanopy AI', role: 'Detection' },
                { name: 'MCD Office', role: 'Review' },
                { name: 'Forest Dept', role: 'Assessment' },
                { name: 'District Admin', role: 'Action' },
                { name: 'Public Portal', role: 'Transparency' },
              ].map((auth, idx) => (
                <div key={auth.name} className="flex items-center gap-3 flex-shrink-0">
                  <div className="p-3 rounded-lg bg-card/50 border border-border/30 text-center min-w-[120px]">
                    <p className="text-sm font-medium">{auth.name}</p>
                    <p className="text-[10px] text-muted-foreground font-tech">{auth.role}</p>
                  </div>
                  {idx < 4 && (
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>

      <FloatingAIAssistant />
    </div>
  );
};

export default Governance;
