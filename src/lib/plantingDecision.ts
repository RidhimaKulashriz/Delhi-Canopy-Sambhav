/**
 * DelhiCanopy X-Tech extension: preliminary tree-planting space screening.
 * Recommendations are explicitly field-verification candidates, never permits.
 */

export type SiteStatus = "ready_for_field_check" | "needs_land_confirmation" | "needs_utility_check";

export interface PlantingSite {
  id: string;
  name: string;
  ward: string;
  zone: string;
  coordinates: [number, number];
  landContext: string;
  ownershipLead: string;
  opportunity: string;
  greenDeficit: number;
  heatStress: number;
  permeableGround: number;
  communityNeed: number;
  utilityRisk: "low" | "medium" | "high";
  recommendedTrees: number;
  recommendedForm: string;
  status: SiteStatus;
  source: string;
}

export interface QualityGateItem {
  id: string;
  label: string;
  evidence: string;
  required: boolean;
}

export type CredibilityVerdict = "needs_detail" | "review_required" | "credible";

export interface EvidenceAssessment {
  note: string;
  score: number;
  verdict: CredibilityVerdict;
  signals: string[];
  assessedAt: string;
}

export const plantingSites: PlantingSite[] = [
  {
    id: "dwarka-sector-12",
    name: "Dwarka Sector 12 public-edge candidate",
    ward: "Dwarka",
    zone: "South-West Delhi",
    coordinates: [28.5921, 77.046],
    landContext: "Open verge and neighbourhood-edge planting opportunity",
    ownershipLead: "Confirm land custodian with DDA / local civic horticulture office",
    opportunity: "Connect fragmented shade cover along a high-footfall public edge",
    greenDeficit: 64,
    heatStress: 78,
    permeableGround: 71,
    communityNeed: 74,
    utilityRisk: "medium",
    recommendedTrees: 140,
    recommendedForm: "Layered native shade corridor with guarded planting bays",
    status: "needs_utility_check",
    source: "Existing MVP mock green-deficit alert; field verification required",
  },
  {
    id: "karol-bagh-edge",
    name: "Karol Bagh civic-edge candidate",
    ward: "Karol Bagh",
    zone: "Central Delhi",
    coordinates: [28.6519, 77.1886],
    landContext: "Dense mixed-use street edge with limited planting pockets",
    ownershipLead: "Confirm road-owning agency, footpath width and underground services",
    opportunity: "Prioritize small-canopy species and protected micro-bays over mass planting",
    greenDeficit: 91,
    heatStress: 94,
    permeableGround: 38,
    communityNeed: 92,
    utilityRisk: "high",
    recommendedTrees: 48,
    recommendedForm: "Micro-groves and modular tree pits after utility clearance",
    status: "needs_land_confirmation",
    source: "Existing MVP tree-loss / heat-risk signal; field verification required",
  },
  {
    id: "shahdara-buffer",
    name: "Shahdara North buffer candidate",
    ward: "Shahdara North",
    zone: "East Delhi",
    coordinates: [28.6823, 77.2878],
    landContext: "Industrial / transport-edge buffer opportunity",
    ownershipLead: "Confirm buffer ownership and pollution-tolerant planting design with agency",
    opportunity: "Build a multi-row dust and heat buffer where continuous soil is available",
    greenDeficit: 82,
    heatStress: 89,
    permeableGround: 68,
    communityNeed: 78,
    utilityRisk: "low",
    recommendedTrees: 210,
    recommendedForm: "Native multi-tier buffer with shrubs, trees and maintenance access",
    status: "ready_for_field_check",
    source: "Existing MVP heat-vulnerability signal; field verification required",
  },
  {
    id: "central-delhi-institutional",
    name: "Central Delhi institutional-verge candidate",
    ward: "Central Delhi",
    zone: "New Delhi",
    coordinates: [28.6315, 77.2167],
    landContext: "Heat-stressed institutional / public-realm verge candidate",
    ownershipLead: "Confirm institution / public-works custodian and irrigation availability",
    opportunity: "Create shaded walking links with rainfall-friendly planting beds",
    greenDeficit: 88,
    heatStress: 91,
    permeableGround: 59,
    communityNeed: 86,
    utilityRisk: "medium",
    recommendedTrees: 96,
    recommendedForm: "Shade avenue with soil-volume upgrades and water-harvesting detail",
    status: "needs_land_confirmation",
    source: "Existing MVP heat-spike signal; field verification required",
  },
];

export const qualityGate: QualityGateItem[] = [
  { id: "land", label: "Land custodian identified", evidence: "Written confirmation from the land-owning or greening agency", required: true },
  { id: "utilities", label: "Utility and access conflict checked", evidence: "Marked services, visibility, access, and pedestrian-clearance check", required: true },
  { id: "soil", label: "Soil and water condition checked", evidence: "Field soil observation, drainage note, and watering source", required: true },
  { id: "species", label: "Species and planting form matched to site", evidence: "Native / site-appropriate list with mature-size rationale", required: true },
  { id: "protection", label: "Protection and maintenance owner assigned", evidence: "Guarding, watering, replacement and survival-monitoring commitment", required: true },
  { id: "community", label: "Local access and community benefit reviewed", evidence: "Stakeholder note covering shade need, access and nuisance risk", required: false },
];

export function siteScore(site: PlantingSite): number {
  const utilityScore = site.utilityRisk === "low" ? 100 : site.utilityRisk === "medium" ? 62 : 28;
  return Math.round(
    site.greenDeficit * 0.28 +
      site.heatStress * 0.28 +
      site.permeableGround * 0.2 +
      site.communityNeed * 0.14 +
      utilityScore * 0.1,
  );
}

export function gateStatus(completedIds: string[]) {
  const required = qualityGate.filter((item) => item.required);
  const complete = required.every((item) => completedIds.includes(item.id));
  return {
    complete,
    requiredComplete: required.filter((item) => completedIds.includes(item.id)).length,
    requiredTotal: required.length,
  };
}

export function assessEvidenceCredibility(note: string, site: PlantingSite, item: QualityGateItem): EvidenceAssessment {
  const normalized = note.trim().toLowerCase();
  const signals: string[] = [];
  let score = 0;

  if (normalized.length >= 40) {
    score += 20;
    signals.push("Sufficient field detail recorded");
  } else {
    signals.push("Add a fuller field observation or document summary");
  }

  const siteTerms = `${site.name} ${site.ward} ${site.zone}`.toLowerCase().split(/\s+/).filter((term) => term.length > 3);
  if (siteTerms.some((term) => normalized.includes(term))) {
    score += 15;
    signals.push("Candidate location context identified");
  } else {
    signals.push("Name the candidate location or ward");
  }

  if (/\b(20\d{2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\b/.test(normalized)) {
    score += 15;
    signals.push("Dated observation included");
  } else {
    signals.push("Add the inspection or document date");
  }

  if (/\b(photo|image|letter|permit|file|record|reference|case|memo|map|survey|report|ticket|id)\b/.test(normalized)) {
    score += 18;
    signals.push("Traceable supporting record referenced");
  } else {
    signals.push("Reference a photo, record, file number, map, or survey");
  }

  if (/\b(dda|mcd|ndmc|forest|horticulture|pwp|pwd|utility|agency|officer|engineer|custodian|owner)\b/.test(normalized)) {
    score += 18;
    signals.push("Accountable source or custodian identified");
  } else {
    signals.push("Name the agency, custodian, or responsible professional");
  }

  if (/\b(verified|walked|inspected|measured|checked|marked|confirmed|surveyed|observed)\b/.test(normalized)) {
    score += 14;
    signals.push("Verification method stated");
  } else {
    signals.push("State how the evidence was verified");
  }

  const verdict: CredibilityVerdict = score >= 70 ? "credible" : score >= 45 ? "review_required" : "needs_detail";
  return { note: note.trim(), score, verdict, signals, assessedAt: new Date().toISOString() };
}

export function credibilityGateStatus(completedIds: string[], assessments: Record<string, EvidenceAssessment>) {
  const required = qualityGate.filter((item) => item.required);
  const credibleRequired = required.filter((item) =>
    completedIds.includes(item.id) && assessments[item.id]?.verdict === "credible"
  );

  return {
    complete: credibleRequired.length === required.length,
    credibleRequired: credibleRequired.length,
    requiredTotal: required.length,
  };
}
