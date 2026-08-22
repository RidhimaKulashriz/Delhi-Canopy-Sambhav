/**
 * DelhiCanopy TrustOps: X-Tech command-center extension.
 * Decision quality is demonstrated through repeatable evidence, challenge, approval, and audit steps.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
  RefreshCw,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { FloatingAIAssistant } from "@/components/ai/FloatingAIAssistant";
import { Navigation } from "@/components/layout/Navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

type EvidenceKey = "custody" | "access" | "survival" | "care";
type ChallengeKey = "utilities" | "maintenance";

type GateState = {
  evidence: Record<EvidenceKey, string>;
  challenges: Record<ChallengeKey, boolean>;
  reviewer: string;
  approved: boolean;
  events: { at: string; text: string; tone: "info" | "pass" | "risk" }[];
};

const decisions = [
  { id: "shahdara", title: "Shahdara North multi-row heat & dust buffer", type: "Planting strategy", location: "Shahdara North · East Delhi", impact: "210 proposed tree starts · transport-edge exposure", route: "/planting-space-finder", routeLabel: "Open planting candidate" },
  { id: "karol", title: "Karol Bagh micro-grove intervention", type: "Planting strategy", location: "Karol Bagh · Central Delhi", impact: "High heat and green-deficit signal · utility-sensitive", route: "/planting-space-finder", routeLabel: "Open planting candidate" },
  { id: "narela", title: "Narela ward canopy recovery strategy", type: "AI planner recommendation", location: "Narela · North Delhi", impact: "Ward-level intervention plan · model-assisted", route: "/ai-planner", routeLabel: "Open AI Planner" },
] as const;

const evidenceFields: { key: EvidenceKey; label: string; prompt: string }[] = [
  { key: "custody", label: "Custodian & authority", prompt: "Name the agency/custodian, dated record, and reference number." },
  { key: "access", label: "Conflict & access scan", prompt: "Record utilities, service clearance, public access, and verification method." },
  { key: "survival", label: "Survival conditions", prompt: "Record soil, drainage, water source, site date, and field observation." },
  { key: "care", label: "Protection & aftercare", prompt: "Name the accountable owner, monitoring schedule, and protection plan." },
];

const demoEvidence: Record<EvidenceKey, string> = {
  custody: "Shahdara North buffer inspected on 22/08/2026. MCD horticulture officer identified as custodian; memo MCD-HORT-2026-114 and boundary map photo were recorded. Field team verified custody with the site officer.",
  access: "Shahdara North transport edge was walked and marked on 22/08/2026. Utility survey photo UTL-24 and service map were reviewed with the agency engineer. Pedestrian clearance and maintenance access were measured and confirmed.",
  survival: "Shahdara North soil, drainage and water point were observed on 22/08/2026 during field inspection. Survey SOIL-SHN-08 records permeable ground, drainage condition and a water source verified by horticulture staff.",
  care: "MCD horticulture cell confirmed the protection and watering owner on 22/08/2026. Maintenance memo MCD-MNT-46 assigns guards, weekly watering and 90-day survival monitoring; field team verified the responsible officer.",
};

const makeGate = (): GateState => ({
  evidence: { custody: "", access: "", survival: "", care: "" },
  challenges: { utilities: false, maintenance: false },
  reviewer: "",
  approved: false,
  events: [{ at: new Date().toISOString(), text: "Gate opened — decision held for repeatable evidence review.", tone: "info" }],
});

const evidenceScore = (note: string) => {
  const value = note.toLowerCase();
  const checks = [
    note.trim().length >= 80,
    /20\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(value),
    /photo|map|memo|record|reference|survey|file|report/.test(value),
    /mcd|dda|ndmc|pwd|agency|officer|engineer|custodian|owner/.test(value),
    /verified|inspected|walked|measured|checked|confirmed|observed/.test(value),
  ];
  return checks.filter(Boolean).length * 20;
};

export default function TrustOps() {
  const [selectedId, setSelectedId] = useState<(typeof decisions)[number]["id"]>("shahdara");
  const [gates, setGates] = useState<Record<string, GateState>>(() => {
    try {
      return JSON.parse(localStorage.getItem("delhi-canopy-trustops-gates") || "{}");
    } catch {
      return {};
    }
  });

  const decision = decisions.find((item) => item.id === selectedId) ?? decisions[0];
  const gate = gates[decision.id] ?? makeGate();
  const scores = useMemo(() => evidenceFields.map((field) => ({ ...field, score: evidenceScore(gate.evidence[field.key]) })), [gate.evidence]);
  const credibleCount = scores.filter((item) => item.score >= 80).length;
  const resolvedCount = Object.values(gate.challenges).filter(Boolean).length;
  const reviewerReady = gate.reviewer.trim().length > 2;
  const finalizable = credibleCount === evidenceFields.length && resolvedCount === 2 && reviewerReady;
  const readiness = Math.round((credibleCount / 4) * 55 + (resolvedCount / 2) * 25 + (reviewerReady ? 20 : 0));

  useEffect(() => {
    localStorage.setItem("delhi-canopy-trustops-gates", JSON.stringify(gates));
  }, [gates]);

  const updateGate = (transform: (current: GateState) => GateState) => {
    setGates((current) => ({ ...current, [decision.id]: transform(current[decision.id] ?? makeGate()) }));
  };

  const withEvent = (current: GateState, text: string, tone: "info" | "pass" | "risk") => ({
    ...current,
    events: [{ at: new Date().toISOString(), text, tone }, ...current.events].slice(0, 8),
  });

  const loadDemo = () => {
    updateGate((current) => withEvent({ ...current, evidence: demoEvidence, challenges: { utilities: true, maintenance: true }, reviewer: "DelhiCanopy Review Cell", approved: false }, "Demonstration evidence packet loaded; red-team risks resolved with traceable records.", "pass"));
    toast.success("Demo-ready quality packet loaded");
  };

  const resetGate = () => {
    updateGate(() => makeGate());
    toast.info("Gate reset — decision is held for quality review again");
  };

  const approve = () => {
    if (!finalizable) {
      toast.error("Add credible evidence, resolve each challenge, and name a reviewer first");
      return;
    }
    updateGate((current) => withEvent({ ...current, approved: true }, `Approved for accountable field review by ${current.reviewer}.`, "pass"));
    toast.success("Decision released for accountable field review");
  };

  const copyReceipt = async () => {
    const receipt = {
      system: "DelhiCanopy TrustOps",
      decision: decision.title,
      readiness,
      credibleEvidence: `${credibleCount}/4`,
      resolvedChallenges: `${resolvedCount}/2`,
      reviewer: gate.reviewer || "Not assigned",
      status: gate.approved ? "approved_for_field_review" : finalizable ? "ready_for_reviewer" : "quality_held",
      generatedAt: new Date().toISOString(),
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
      toast.success("Audit receipt copied");
    } catch {
      toast.info("Audit receipt prepared; clipboard is unavailable in this browser");
    }
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navigation />
      <main className="px-4 pb-12 pt-20">
        <div className="container mx-auto max-w-[1600px]">
          <motion.section initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-7 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card/70 to-secondary/10 p-5 lg:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 text-[10px] font-tech text-secondary"><Fingerprint className="h-3.5 w-3.5" /> ROUND 2 · REPEATABLE QUALITY GATE</div>
                <h1 className="font-display text-3xl font-bold tracking-wide lg:text-4xl"><span className="text-glow-cyan">TRUST</span><span className="text-muted-foreground">OPS</span> QUALITY COMMAND</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A high-impact climate recommendation cannot move to field action until its evidence is credible, red-team risks are resolved, and an accountable reviewer is named. Every run creates a reproducible audit receipt.</p>
                <div className="mt-4 grid gap-2 text-left sm:grid-cols-3">
                  <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2"><p className="text-[9px] font-tech text-warning">01 · PROVE THE HOLD</p><p className="mt-1 text-[10px] text-muted-foreground">An incomplete decision remains blocked at 0/100.</p></div>
                  <div className="rounded-lg border border-secondary/30 bg-secondary/5 px-3 py-2"><p className="text-[9px] font-tech text-secondary">02 · REPLAY THE CHECK</p><p className="mt-1 text-[10px] text-muted-foreground">Load the deterministic packet to show all required gates.</p></div>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2"><p className="text-[9px] font-tech text-primary">03 · EXPORT PROOF</p><p className="mt-1 text-[10px] text-muted-foreground">Approve only with accountability, then copy the receipt.</p></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={loadDemo} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-display font-semibold text-primary-foreground hover:brightness-110"><BrainCircuit className="h-4 w-4" /> LOAD WINNING DEMO</button>
                <button onClick={resetGate} className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card/60 px-4 py-2.5 text-xs font-display font-semibold text-foreground hover:border-secondary/50"><RefreshCw className="h-4 w-4" /> RESET GATE</button>
              </div>
            </div>
          </motion.section>

          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.35fr_0.85fr]">
            <GlassCard className="h-fit p-4 xl:sticky xl:top-20">
              <div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-tech text-muted-foreground">DECISION QUEUE</p><h2 className="font-display font-semibold">High-impact work</h2></div><LockKeyhole className="h-4 w-4 text-secondary" /></div>
              <div className="space-y-3">
                {decisions.map((item) => {
                  const active = item.id === decision.id;
                  const itemGate = gates[item.id];
                  return <button key={item.id} onClick={() => setSelectedId(item.id)} className={cn("w-full rounded-xl border p-3 text-left transition-all", active ? "border-primary/60 bg-primary/10 shadow-[0_0_18px_hsl(var(--primary)/0.12)]" : "border-border/50 bg-card/30 hover:border-secondary/50")}><p className="text-[10px] font-tech text-secondary">{item.type.toUpperCase()}</p><p className="mt-1 font-display text-sm font-semibold">{item.title}</p><p className="mt-1 text-[10px] text-muted-foreground">{item.location}</p><div className="mt-3 flex items-center justify-between gap-2"><span className="text-[10px] text-muted-foreground">{item.impact}</span><span className={cn("rounded-full px-2 py-1 text-[9px] font-tech", itemGate?.approved ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning")}>{itemGate?.approved ? "REVIEW READY" : "QUALITY HELD"}</span></div></button>;
                })}
              </div>
            </GlassCard>

            <div className="space-y-5">
              <GlassCard className="overflow-hidden">
                <div className="border-b border-border/40 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><p className="text-[10px] font-tech text-secondary">ACTIVE GATE RUN</p><h2 className="mt-1 font-display text-xl font-bold">{decision.title}</h2><p className="mt-1 text-sm text-muted-foreground">{decision.location} · {decision.impact}</p></div>
                    <div className={cn("rounded-xl border px-4 py-3 text-right", finalizable ? "border-primary/40 bg-primary/10" : "border-warning/40 bg-warning/10")}><p className="text-[10px] font-tech text-muted-foreground">READINESS SCORE</p><p className={cn("font-display text-3xl font-bold", finalizable ? "text-primary" : "text-warning")}>{readiness}<span className="text-sm text-muted-foreground">/100</span></p></div>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className={cn("h-full transition-all duration-500", finalizable ? "bg-primary" : "bg-warning")} style={{ width: `${readiness}%` }} /></div>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-center gap-2"><ScanSearch className="h-4 w-4 text-secondary" /><div><p className="text-[10px] font-tech text-muted-foreground">STAGE 1–3 · EVIDENCE & CREDIBILITY</p><h3 className="font-display font-semibold">Explainable credibility engine</h3></div></div>
                  {scores.map((field) => <div key={field.key} className={cn("rounded-xl border p-4", field.score >= 80 ? "border-primary/40 bg-primary/5" : "border-border/60 bg-card/30")}><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-display text-sm font-semibold">{field.label}</p><p className="mt-1 text-[10px] text-muted-foreground">{field.prompt}</p></div><span className={cn("rounded-full border px-2 py-1 text-[9px] font-tech", field.score >= 80 ? "border-primary/40 bg-primary/10 text-primary" : field.score >= 40 ? "border-secondary/40 bg-secondary/10 text-secondary" : "border-warning/40 bg-warning/10 text-warning")}>{field.score >= 80 ? "CREDIBLE" : field.score >= 40 ? "REVIEW REQUIRED" : "ADD DETAIL"} · {field.score}/100</span></div><textarea value={gate.evidence[field.key]} onChange={(event) => updateGate((current) => ({ ...current, evidence: { ...current.evidence, [field.key]: event.target.value }, approved: false }))} placeholder="Enter field evidence..." className="mt-3 min-h-20 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none" /></div>)}
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-warning" /><div><p className="text-[10px] font-tech text-muted-foreground">STAGE 4 · RED-TEAM CHALLENGE</p><h3 className="font-display font-semibold">Try to stop the recommendation</h3></div></div>
                <div className="mt-4 space-y-3">
                  {(["utilities", "maintenance"] as ChallengeKey[]).map((key) => {
                    const resolved = gate.challenges[key];
                    const copy = key === "utilities" ? ["Hidden utility conflict", "Could underground services invalidate planting geometry?"] : ["Aftercare gap", "Is a named party accountable after the planting event?"];
                    return <div key={key} className={cn("rounded-lg border p-3", resolved ? "border-primary/40 bg-primary/5" : "border-warning/40 bg-warning/5")}><div className="flex items-start justify-between gap-3"><div><p className="font-display text-sm font-semibold">{copy[0]}</p><p className="mt-1 text-xs text-muted-foreground">{copy[1]}</p></div><button onClick={() => updateGate((current) => withEvent({ ...current, approved: false, challenges: { ...current.challenges, [key]: !current.challenges[key] } }, `${copy[0]} ${resolved ? "reopened" : "resolved"}.`, resolved ? "risk" : "pass"))} className={cn("shrink-0 rounded-md border px-2 py-1 text-[9px] font-tech", resolved ? "border-primary/40 text-primary" : "border-warning/40 text-warning")}>{resolved ? "RESOLVED" : "BLOCKING"}</button></div></div>;
                  })}
                </div>
              </GlassCard>
            </div>

            <GlassCard className="h-fit p-5 xl:sticky xl:top-20">
              <div className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-primary" /><div><p className="text-[10px] font-tech text-muted-foreground">STAGE 5–6 · ACCOUNTABILITY</p><h2 className="font-display font-semibold">Decision release</h2></div></div>
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-border/50 bg-card/30 p-4"><p className="text-[10px] font-tech text-muted-foreground">QUALITY CONDITIONS</p><div className="mt-3 space-y-2 text-xs">{[{ label: "Credible mandatory evidence", pass: credibleCount === 4, value: `${credibleCount}/4` }, { label: "Red-team challenges resolved", pass: resolvedCount === 2, value: `${resolvedCount}/2` }, { label: "Named accountable reviewer", pass: reviewerReady, value: reviewerReady ? "ASSIGNED" : "MISSING" }].map((item) => <div key={item.label} className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-muted-foreground">{item.pass ? <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> : <XCircle className="h-3.5 w-3.5 text-warning" />}{item.label}</span><span className={item.pass ? "text-primary" : "text-warning"}>{item.value}</span></div>)}</div></div>
                <div><label className="text-[10px] font-tech text-muted-foreground">ACCOUNTABLE REVIEWER</label><input value={gate.reviewer} onChange={(event) => updateGate((current) => ({ ...current, reviewer: event.target.value, approved: false }))} placeholder="Name / review cell" className="mt-2 w-full rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none" /></div>
                <button onClick={approve} disabled={!finalizable || gate.approved} className={cn("flex w-full items-center justify-center gap-2 rounded-lg px-3 py-3 text-xs font-display font-semibold", finalizable && !gate.approved ? "bg-primary text-primary-foreground hover:brightness-110" : "cursor-not-allowed bg-muted text-muted-foreground")}><ShieldCheck className="h-4 w-4" />{gate.approved ? "RELEASED FOR FIELD REVIEW" : "APPROVE FIELD REVIEW"}</button>
                <button onClick={copyReceipt} className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/70 bg-card/50 px-3 py-3 text-xs font-display font-semibold text-foreground hover:border-secondary/50"><Copy className="h-4 w-4" /> COPY AUDIT RECEIPT</button>
                <Link to={decision.route} className="flex w-full items-center justify-center gap-2 rounded-lg border border-secondary/40 bg-secondary/10 px-3 py-3 text-xs font-display font-semibold text-secondary hover:bg-secondary/15"><FileCheck2 className="h-4 w-4" /> {decision.routeLabel}<ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
              <div className="mt-5 border-t border-border/40 pt-4"><p className="text-[10px] font-tech text-muted-foreground">AUDIT TIMELINE</p><div className="mt-3 space-y-3">{gate.events.map((event, index) => <div key={`${event.at}-${index}`} className="flex gap-3"><span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", event.tone === "pass" ? "bg-primary" : event.tone === "risk" ? "bg-warning" : "bg-secondary")} /><div><p className="text-[10px] leading-relaxed text-muted-foreground">{event.text}</p><p className="mt-1 text-[9px] font-tech text-muted-foreground/60">{new Date(event.at).toLocaleTimeString()}</p></div></div>)}</div></div>
            </GlassCard>
          </div>
        </div>
      </main>
      <FloatingAIAssistant />
    </div>
  );
}
