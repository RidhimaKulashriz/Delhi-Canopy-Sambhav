/**
 * DelhiCanopy X-Tech extension: additive planting-space finder and quality gate.
 * Preserves the existing dashboard language while treating recommendations as field-screening candidates, not permits.
 */
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ClipboardCheck, Copy, Droplets, MapPinned, Navigation2, ShieldCheck, Sprout, TreeDeciduous, Wrench } from "lucide-react";
import { toast } from "sonner";
import { FloatingAIAssistant } from "@/components/ai/FloatingAIAssistant";
import { Navigation } from "@/components/layout/Navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import {
  assessEvidenceCredibility,
  credibilityGateStatus,
  EvidenceAssessment,
  gateStatus,
  plantingSites,
  qualityGate,
  siteScore,
} from "@/lib/plantingDecision";

const implementationStages = [
  { icon: MapPinned, title: "1. Confirm the space", detail: "Walk the candidate boundary, identify the land custodian, and record access constraints." },
  { icon: Wrench, title: "2. Clear conflicts", detail: "Mark underground and overhead utilities, sightlines, pedestrian movement, and maintenance access." },
  { icon: Droplets, title: "3. Prepare survival conditions", detail: "Check soil, drainage, water source, protection, and replacement planting responsibility." },
  { icon: Sprout, title: "4. Match the planting design", detail: "Choose site-appropriate species and form only after the field and custodian checks are complete." },
];

const statusCopy = {
  ready_for_field_check: { label: "FIELD CHECK READY", tone: "text-primary border-primary/40 bg-primary/10" },
  needs_land_confirmation: { label: "LAND CONFIRMATION NEEDED", tone: "text-warning border-warning/40 bg-warning/10" },
  needs_utility_check: { label: "UTILITY CHECK NEEDED", tone: "text-destructive border-destructive/40 bg-destructive/10" },
};

export default function PlantingSpaceFinder() {
  const [selectedId, setSelectedId] = useState(plantingSites[0].id);
  const [checksBySite, setChecksBySite] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("delhi-canopy-quality-gates");
      if (saved) return JSON.parse(saved);
      const legacyChecks = JSON.parse(localStorage.getItem("delhi-canopy-quality-gate") || "[]") as string[];
      return legacyChecks.length > 0 ? { [plantingSites[0].id]: legacyChecks } : {};
    } catch { return {}; }
  });
  const [assessmentsBySite, setAssessmentsBySite] = useState<Record<string, Record<string, EvidenceAssessment>>>(() => {
    try {
      return JSON.parse(localStorage.getItem("delhi-canopy-evidence-credibility") || "{}");
    } catch {
      return {};
    }
  });
  const selected = plantingSites.find((site) => site.id === selectedId) ?? plantingSites[0];
  const checked = checksBySite[selected.id] ?? [];
  const assessments = assessmentsBySite[selected.id] ?? {};
  const status = gateStatus(checked);
  const credibility = credibilityGateStatus(checked, assessments);
  const ranking = useMemo(() => [...plantingSites].sort((a, b) => siteScore(b) - siteScore(a)), []);

  useEffect(() => {
    localStorage.setItem("delhi-canopy-quality-gates", JSON.stringify(checksBySite));
  }, [checksBySite]);

  useEffect(() => {
    localStorage.setItem("delhi-canopy-evidence-credibility", JSON.stringify(assessmentsBySite));
  }, [assessmentsBySite]);

  const toggle = (id: string) => setChecksBySite((current) => {
    const currentChecks = current[selected.id] ?? [];
    const updatedChecks = currentChecks.includes(id) ? currentChecks.filter((item) => item !== id) : [...currentChecks, id];
    return { ...current, [selected.id]: updatedChecks };
  });

  const updateEvidenceNote = (itemId: string, note: string) => {
    setAssessmentsBySite((current) => ({
      ...current,
      [selected.id]: {
        ...(current[selected.id] ?? {}),
        [itemId]: assessEvidenceCredibility(note, selected, qualityGate.find((item) => item.id === itemId)!),
      },
    }));
  };

  const copyBrief = async () => {
    const brief = `${selected.name}\nPriority score: ${siteScore(selected)}/100\nStatus: ${statusCopy[selected.status].label}\nRecommended form: ${selected.recommendedForm}\nField evidence: ${status.requiredComplete}/${status.requiredTotal} required checks complete.\nCredibility: ${credibility.credibleRequired}/${credibility.requiredTotal} required records credible.\nNext action: ${selected.ownershipLead}`;
    try {
      await navigator.clipboard.writeText(brief);
      toast.success("Field brief copied to clipboard");
    } catch {
      toast.info("Field brief prepared — copy is unavailable in this browser");
    }
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navigation />
      <main className="pt-20 pb-10 px-4">
        <div className="container mx-auto max-w-[1600px]">
          <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.45)]">
                <MapPinned className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold tracking-wide"><span className="text-glow-cyan">PLANTING</span> <span className="text-muted-foreground">SPACE FINDER</span></h1>
                <p className="text-xs text-muted-foreground font-tech">DESKTOP SCREENING • FIELD VERIFICATION REQUIRED • DELHI GREEN ACTION LOGIC</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-tech">
              <span className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-secondary">{plantingSites.length} candidate spaces</span>
              <span className="rounded-full border border-border/60 bg-card/50 px-3 py-1 text-muted-foreground">No recommendation is a planting permit</span>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">Evidence Credibility AI enabled</span>
            </div>
          </motion.div>

          <div className="grid xl:grid-cols-[0.9fr_1.25fr_0.95fr] gap-5">
            <GlassCard className="p-4 xl:sticky xl:top-20 h-fit">
              <div className="flex items-center justify-between mb-4">
                <div><p className="text-xs font-tech text-muted-foreground">PRIORITY QUEUE</p><h2 className="font-display font-semibold">Candidate Spaces</h2></div>
                <TreeDeciduous className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-3">
                {ranking.map((site) => {
                  const active = site.id === selected.id;
                  return <button key={site.id} onClick={() => setSelectedId(site.id)} className={cn("w-full rounded-xl border p-3 text-left transition-all", active ? "border-primary/60 bg-primary/10 shadow-[0_0_18px_hsl(var(--primary)/0.12)]" : "border-border/50 bg-card/30 hover:border-secondary/50 hover:bg-card/50")}>
                    <div className="flex items-start justify-between gap-2"><div><p className="font-display text-sm font-semibold leading-tight">{site.name}</p><p className="mt-1 text-[10px] font-tech text-muted-foreground">{site.ward.toUpperCase()} • {site.zone.toUpperCase()}</p></div><span className="text-lg font-display font-bold text-primary">{siteScore(site)}</span></div>
                    <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[9px] font-tech text-muted-foreground"><span>GREEN<br /><b className="text-foreground">{site.greenDeficit}</b></span><span>HEAT<br /><b className="text-foreground">{site.heatStress}</b></span><span>GROUND<br /><b className="text-foreground">{site.permeableGround}</b></span></div>
                  </button>;
                })}
              </div>
            </GlassCard>

            <div className="space-y-5">
              <GlassCard className="overflow-hidden">
                <div className="p-5 border-b border-border/40 flex flex-wrap items-start justify-between gap-3">
                  <div><p className="text-xs font-tech text-secondary">SELECTED CANDIDATE</p><h2 className="mt-1 text-xl font-display font-bold">{selected.name}</h2><p className="mt-1 text-sm text-muted-foreground">{selected.landContext}</p></div>
                  <span className={cn("rounded-full border px-3 py-1 text-[10px] font-tech", statusCopy[selected.status].tone)}>{statusCopy[selected.status].label}</span>
                </div>
                <div className="p-5 grid md:grid-cols-2 gap-5">
                  <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/40 to-card/10 p-4 min-h-52 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--primary))_0,transparent_28%),linear-gradient(135deg,transparent_49%,hsl(var(--secondary))_50%,transparent_51%)]" />
                    <div className="relative h-full flex flex-col justify-between"><div className="flex justify-between text-[10px] font-tech text-muted-foreground"><span>SITE ENVELOPE</span><span>{selected.coordinates[0].toFixed(4)}°N • {selected.coordinates[1].toFixed(4)}°E</span></div><div><div className="w-28 h-28 rounded-full border border-primary/50 bg-primary/15 mx-auto flex items-center justify-center shadow-[0_0_45px_hsl(var(--primary)/0.18)]"><span className="text-center font-display text-3xl text-primary">{siteScore(selected)}<small className="block text-[9px] text-muted-foreground font-tech">SCREEN SCORE</small></span></div></div><p className="text-[10px] font-tech text-muted-foreground">MODEL INPUTS: GREEN DEFICIT • HEAT • PERMEABLE GROUND • COMMUNITY NEED • UTILITY RISK</p></div>
                  </div>
                  <div className="space-y-4">
                    <div><p className="text-[10px] font-tech text-muted-foreground">PLANTING OPPORTUNITY</p><p className="mt-1 text-sm leading-relaxed">{selected.opportunity}</p></div>
                    <div><p className="text-[10px] font-tech text-muted-foreground">RECOMMENDED FORM</p><p className="mt-1 text-sm text-secondary">{selected.recommendedForm}</p></div>
                    <div className="grid grid-cols-2 gap-3"><div className="rounded-lg bg-card/40 border border-border/40 p-3"><p className="text-[10px] font-tech text-muted-foreground">TREE START</p><p className="font-display text-2xl text-primary">{selected.recommendedTrees}</p></div><div className="rounded-lg bg-card/40 border border-border/40 p-3"><p className="text-[10px] font-tech text-muted-foreground">UTILITY RISK</p><p className="font-display text-lg uppercase text-warning">{selected.utilityRisk}</p></div></div>
                  </div>
                </div>
                <div className="px-5 py-4 bg-card/25 border-t border-border/40 flex flex-wrap gap-3 items-center justify-between"><p className="text-xs text-muted-foreground"><b className="text-foreground">Custodian lead:</b> {selected.ownershipLead}</p><button onClick={copyBrief} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-display font-semibold text-primary-foreground hover:brightness-110"><Copy className="w-3.5 h-3.5" /> Copy field brief</button></div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4"><Navigation2 className="w-4 h-4 text-secondary" /><div><p className="text-xs font-tech text-muted-foreground">IMPLEMENTATION PATH</p><h3 className="font-display font-semibold">How to move from candidate to planting</h3></div></div>
                <div className="grid md:grid-cols-2 gap-3">{implementationStages.map(({ icon: Icon, title, detail }) => <div key={title} className="rounded-lg border border-border/50 bg-card/30 p-4"><Icon className="w-4 h-4 text-primary mb-3" /><h4 className="font-display text-sm font-semibold">{title}</h4><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></div>)}</div>
              </GlassCard>
            </div>

            <GlassCard className="p-5 h-fit">
              <div className="flex items-start gap-3"><div className={cn("mt-0.5 rounded-lg p-2", credibility.complete ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning")}><ClipboardCheck className="w-5 h-5" /></div><div><p className="text-xs font-tech text-muted-foreground">CONTENT QUALITY + CREDIBILITY GATE</p><h2 className="font-display font-semibold">Evidence before action</h2><p className="mt-1 text-xs text-muted-foreground">{status.requiredComplete}/{status.requiredTotal} checks complete • {credibility.credibleRequired}/{credibility.requiredTotal} required records credible</p></div></div>
              <div className="mt-5 space-y-3">{qualityGate.map((item) => {
                const done = checked.includes(item.id);
                const assessment = assessments[item.id];
                const verdictLabel = assessment?.verdict === "credible" ? "CREDIBLE" : assessment?.verdict === "review_required" ? "REVIEW REQUIRED" : "ADD DETAIL";
                const verdictTone = assessment?.verdict === "credible" ? "text-primary border-primary/40 bg-primary/10" : assessment?.verdict === "review_required" ? "text-secondary border-secondary/40 bg-secondary/10" : "text-warning border-warning/40 bg-warning/10";
                return <div key={item.id} className={cn("rounded-lg border p-3 transition-colors", done ? "border-primary/40 bg-primary/10" : "border-border/50 bg-card/25")}>
                  <button onClick={() => toggle(item.id)} className="w-full flex gap-3 text-left"><span className={cn("mt-0.5 h-5 w-5 shrink-0 rounded border flex items-center justify-center", done ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50")} >{done && <CheckCircle2 className="w-3.5 h-3.5" />}</span><span><span className="flex gap-1 items-center text-xs font-display font-semibold">{item.label}{item.required && <span className="text-destructive">*</span>}</span><span className="mt-1 block text-[10px] leading-relaxed text-muted-foreground">Evidence: {item.evidence}</span></span></button>
                  {done && <div className="mt-3 border-t border-border/40 pt-3"><p className="text-[10px] font-tech text-secondary">EVIDENCE CREDIBILITY AI</p><textarea value={assessment?.note ?? ""} onChange={(event) => updateEvidenceNote(item.id, event.target.value)} placeholder="Add a dated field note or document summary: location, source/custodian, record reference, and verification method." className="mt-2 min-h-20 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none" />{assessment && <div className="mt-2"><div className="flex items-center justify-between gap-2"><span className={cn("rounded-full border px-2 py-1 text-[9px] font-tech", verdictTone)}>{verdictLabel}</span><span className="font-display text-sm text-foreground">{assessment.score}/100</span></div><p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">{assessment.signals.join(" • ")}</p></div>}</div>}
                </div>;
              })}</div>
              <div className={cn("mt-5 rounded-lg border p-4", credibility.complete ? "border-primary/40 bg-primary/10" : "border-warning/40 bg-warning/10")}>
                {credibility.complete ? <><CheckCircle2 className="w-5 h-5 text-primary mb-2" /><p className="font-display text-sm font-semibold text-primary">Ready for accountable field review</p><p className="mt-1 text-xs text-muted-foreground">All mandatory evidence is present and scored credible. Obtain the custodian’s approval before planting.</p></> : <><AlertTriangle className="w-5 h-5 text-warning mb-2" /><p className="font-display text-sm font-semibold text-warning">Do not mark as approved yet</p><p className="mt-1 text-xs text-muted-foreground">Complete each required check and add sufficiently traceable evidence. The AI screens documentation signals, not legal permission.</p></>}
              </div>
              <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">Source note: {selected.source}</p>
            </GlassCard>
          </div>
        </div>
      </main>
      <FloatingAIAssistant />
    </div>
  );
}
