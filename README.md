# DelhiCanopy

## Urban Green Intelligence and Climate Decision Support

DelhiCanopy is a React-based urban climate intelligence prototype for exploring green-cover conditions, heat stress, tree-loss alerts, planting recommendations, and decision-quality controls in a single operational interface. It is designed to help planners, environmental teams, and reviewers move from environmental signals to documented next actions without presenting a prototype output as an official permit, municipal instruction, or ground-truth finding.

The application combines a visual command center with route-level analytical views, planting-space screening, evidence credibility controls, and TrustOps: a repeatable quality gate for climate and planting decisions. It runs as a Vite single-page application and remains usable in a deterministic local-preview mode when connected services are unavailable.

> **Prototype boundary:** DelhiCanopy is a decision-support prototype. Local-preview records, model-style insights, and screening recommendations are demonstrative. They require field verification, relevant authority review, and applicable permissions before operational use.

## What Is Implemented

The current MVP contains a working set of connected decision workflows rather than static screens. The table below distinguishes the major capabilities from their intended operational role.

| Capability | Current behavior | Important boundary |
| --- | --- | --- |
| Command Center | Renders climate, green-cover, alert, map, and decision-summary views; supports direct handoff to detailed analysis routes. | Local preview data is clearly labelled when connected data is unavailable. |
| Green Intelligence | Presents ward-level green-cover metrics, priority views, charts, and vegetation-oriented analysis. | It is an analytical view, not a satellite-data validation service. |
| Heat Stress | Presents heat-risk indicators, ranking, and climate-trend views. | Values in preview mode are demonstration data. |
| Tree Loss Detection | Shows tree-loss alerts, before/after comparison state, hotspots, and selectable alert records. | Alerts require investigation; they are not enforcement determinations. |
| AI Planner | Produces deterministic planting-strategy packets, exposes a usable ward selector, and opens a full implementation brief. | Planning outputs do not replace a site survey or land approval. |
| Planting Space Finder | Ranks preliminary candidate spaces, maintains per-site evidence checks, calculates credibility readiness, and copies field briefs. | A screening result is not a planting permit or land-allocation decision. |
| TrustOps Quality Command | Holds a decision until evidence, credibility, red-team challenges, reviewer assignment, approval, and an audit receipt are complete. | It evaluates workflow completeness, not legal compliance or model truth. |
| Reports | Generates built-in and custom local reports, creates downloadable CSV files, and provides a browser-print flow. | Printing uses the browser's native print dialog and must be completed manually. |
| Governance | Validates and stores a local grievance draft with a visible receipt. | The prototype does not transmit grievances to a government system. |
| Canopy AI assistant | Provides connected-service responses when available and deterministic local-preview responses otherwise. | Local-preview replies are demonstrative and clearly identified. |
| DELHICANOPY DRIFT companion | Links from the Command Center to a separate buildable pole-mounted air-quality field-instrument prototype. | DRIFT demonstration telemetry does not automatically feed this dashboard. |

## Application Routes

Every route is reachable from the persistent application navigation. The command center includes additional contextual handoffs to the relevant detailed routes.

| Route | Purpose |
| --- | --- |
| `/` | Command Center with map, metrics, insights, alert feed, and cross-route actions. |
| `/green-intelligence` | Green-cover intelligence and vegetation-priority analysis. |
| `/heat-stress` | Heat stress, vulnerability, and trend analysis. |
| `/tree-loss` | Tree-loss alerts, incident comparison, and hotspot visualization. |
| `/ai-planner` | Ward-specific planting strategy generation and implementation briefs. |
| `/planting-space-finder` | Candidate planting-space screening, evidence checks, credibility readiness, and field-brief copy. |
| `/trustops` | Repeatable decision-quality gate with evidence, review, release, reset, and audit receipt states. |
| `/reports` | CSV exports, report print packets, and custom report generation. |
| `/governance` | Local-only, validated grievance-draft workflow. |
| `/how-it-works` | Product explanation, architecture framing, and prototype boundaries. |

## TrustOps: Repeatable Decision Quality Gate

TrustOps is the Round 2 quality-control workflow. It makes the state of an important climate or planting decision inspectable before it is presented as ready for field review. The gate is deterministic, interactive, and persists per decision in browser storage for repeatable demonstrations.

| Stage | Gate behavior | Demonstrable output |
| --- | --- | --- |
| Decision selection | Selects a tracked climate or planting decision. | A decision-specific quality state. |
| Evidence capture | Tracks required evidence records and credibility notes. | Credibility score and missing-evidence signal. |
| Red-team challenge | Requires utility, maintenance, or implementation objections to be resolved. | Challenge status with documented resolution. |
| Accountable review | Assigns a named reviewer before release. | Reviewer-ready state. |
| Release control | Prevents approval until the required readiness conditions are met. | Held or approved decision state. |
| Audit receipt | Generates a portable decision receipt after release. | Copyable audit artifact and timeline. |

For a concise demonstration sequence, use **Load Winning Demo** on `/trustops`, show the transition to `100/100`, approve the field review, copy the receipt, then reset the decision to show that the gate holds it again. See [TrustOps demonstration guidance](./TRUSTOPS_DEMO.md) and the [Round 2 demo script](./ROUND2_DEMO_SCRIPT.md).

## Data Modes and Reliability Design

DelhiCanopy is designed to prefer connected data while remaining demonstrable without an active backend. The UI labels the active mode so a reviewer can distinguish a connected response from a local-preview packet.

| Mode | When it is used | What the application does |
| --- | --- | --- |
| `live` | Connected status and data queries succeed. | Uses the connected service response. |
| `local-preview` | Connected services are unavailable, unseeded, or incomplete. | Uses deterministic local records for dashboard, reporting, planning, and assistant workflows. |
| `unavailable` | Neither a usable connected response nor a complete fallback packet is available. | Surfaces an unavailable state instead of inventing a successful result. |

The local-preview mode supports practical demonstrations of the command center, reports, AI planner, assistant, planting workflows, and TrustOps. It is not a claim that the local data represents current field conditions. The reproducible audit findings are maintained in [FEATURE_RELIABILITY_AUDIT.md](./FEATURE_RELIABILITY_AUDIT.md).

## Reports and Exports

The Reports route supports a built-in set of environmental and planning report types. Each report exports a real CSV file using the available connected data or the local-preview packet. The custom-report action creates a ready report card that uses the same export path.

| Report function | Expected result |
| --- | --- |
| Built-in CSV export | Downloads a structured CSV file for the selected report type. |
| Custom report | Creates a local `Climate Decision Readiness Summary` packet and enables its CSV export. |
| Print report | Opens a print-ready browser flow; completion occurs in the browser or operating-system print dialog. |

The reliability audit confirmed both CSV generation and downloaded artifact contents in local-preview mode. Do not treat a CSV export as an official government report without appropriate data provenance and review.

## Related Field Instrument: DELHICANOPY DRIFT

[DELHICANOPY DRIFT](https://delhicanopydrift.vercel.app/) is a related public field-instrument prototype linked from the DelhiCanopy Command Center. It presents a buildable, pole-mounted air-quality node with a clamp-based enclosure, a USB-first build path, firmware and hardware-kit references, mounting guidance, a Tinkercad model, and a visible demonstration telemetry interface.

| Field-instrument element | DELHICANOPY DRIFT scope |
| --- | --- |
| Environmental channels | PM1, PM2.5, PM10, and NO₂ demonstration channels. |
| Field form factor | Pole-mounted node with a two-clamp cradle design. |
| Build workflow | Hardware package, ESP32 firmware, circuit simulator, mounting protocol, and 3D-model handoff. |
| Demonstration display | Street-visible OLED and LED-bar concept with simulated telemetry. |

The two sites are intentionally separate. DelhiCanopy provides the climate-intelligence and decision workflow; DRIFT presents the physical field-node concept and build documentation. DRIFT is currently presented in demonstration mode, and its displayed telemetry does not automatically become a live data source in DelhiCanopy. Any real deployment requires sensor calibration, safe electrical design, site approval, communications security, and validated ingestion before it can inform operational decisions.

## Technology Stack

DelhiCanopy uses the following implemented stack.

| Layer | Technology |
| --- | --- |
| Frontend | React 18, TypeScript, Vite 5 |
| Routing | React Router DOM |
| UI | Tailwind CSS, Radix UI primitives, shadcn-style components, Lucide icons, Sonner |
| State and data | TanStack React Query, browser localStorage for selected deterministic workflows |
| Mapping | Leaflet and React Leaflet |
| Charts and motion | Recharts and Framer Motion |
| Optional connected data | Supabase client integration |
| Testing | Vitest and Testing Library |

## Architecture

```text
Connected data services                  Local preview packet
          |                                         |
          +-----------------+-----------------------+
                            |
                   Data and resilience hooks
                            |
                  React route-level workflows
                            |
     Command Center | Analysis | Planning | Reports | TrustOps
                            |
       Reviewer, planner, or field-team next action
```

The application intentionally keeps the fallback behavior within the client workflow. Connected services remain preferred, but an unavailable service should not reduce the MVP to an empty or misleading screen.

## Local Development

### Prerequisites

Install a current LTS version of Node.js and npm. A Supabase project is optional for local-preview development; it is required only if you want the application to use connected Supabase data.

### Quick start

```bash
git clone https://github.com/RidhimaKulashriz/Delhi-Canopy-Sambhav.git
cd Delhi-Canopy-Sambhav
npm install
npm run dev
```

Vite prints the local development URL in the terminal, commonly `http://localhost:5173`.

### Optional connected-service configuration

Create a local `.env` file only when connecting Supabase or another supported service. Do not commit secrets.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:3001
```

Without these values, the application remains usable through the documented local-preview path where applicable.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Creates a production build in `dist/`. |
| `npm run build:dev` | Builds in development mode. |
| `npm run preview` | Serves the production build locally. |
| `npm run test` | Runs the Vitest suite once. |
| `npm run test:watch` | Runs Vitest in watch mode. |
| `npm run lint` | Runs ESLint across the project. |

## Validation Workflow

Run the following before a release or demonstration update.

```bash
npm run build
npm run test
```

For user-facing checks, open the routes listed above and verify the following actions:

| Workflow | Minimum check |
| --- | --- |
| Reports | Export a built-in CSV, generate a custom report, then export it. |
| AI Planner | Confirm the ward selector is available, generate a strategy, and open **View Full Plan**. |
| Planting Space Finder | Switch candidates, complete evidence checks, and copy a field brief. |
| TrustOps | Run the demo packet, approve only after readiness reaches `100/100`, copy the audit receipt, then reset. |
| Governance | Verify empty input is rejected; save a non-sensitive local draft and inspect its receipt. |
| Command Center | Use **View Full Analysis** and **View All Alerts** to confirm route handoffs. |

The most recent route and interaction audit is available in [FEATURE_RELIABILITY_AUDIT.md](./FEATURE_RELIABILITY_AUDIT.md).

## Deployment

DelhiCanopy builds as a static Vite application.

```bash
npm run build
```

Deploy the resulting `dist/` directory on a static-hosting provider such as Vercel, Netlify, or another provider configured for single-page application fallback routing. Add environment variables in the hosting provider only if using connected services. The project should remain operational in local-preview mode when those optional services are unavailable.

## Project Structure

```text
Delhi-Canopy-Sambhav/
├── public/                         Static application assets
├── src/
│   ├── components/                  Reusable interface, dashboard, map, chart, and AI components
│   ├── data/                        Deterministic local-preview records and constants
│   ├── hooks/                       Data loading, resilience, and interaction hooks
│   ├── integrations/                External service integration modules
│   ├── lib/                         Shared utilities and decision helpers
│   ├── pages/                       Route-level product workflows
│   ├── services/                    API and data-service layer
│   └── App.tsx                      Route registration
├── supabase/                        Optional Supabase configuration and functions
├── FEATURE_RELIABILITY_AUDIT.md     Reproducible feature-audit record
├── PLANTING_DECISION_SOURCES.md     Planting-screening sources and boundaries
├── ROUND2_DEMO_SCRIPT.md            Short quality-gate demonstration script
└── TRUSTOPS_DEMO.md                 TrustOps workflow documentation
```

## Safety, Data, and Decision Boundaries

DelhiCanopy is intended to support discussion, prioritization, and review. It does not issue permits, allocate municipal land, submit government grievances, confirm unlawful activity, or validate a production AI model. Tree-loss alerts, planting candidates, credibility scores, environmental trends, and local-preview outputs must be reviewed with appropriate source data, field visits, competent professionals, and the relevant authorities.

The planting-screening workflow is explicitly documented as preliminary in [PLANTING_DECISION_SOURCES.md](./PLANTING_DECISION_SOURCES.md). The TrustOps workflow similarly measures readiness of the documented process rather than legal compliance or field truth.

## Contribution Guidance

Keep changes additive and preserve existing routes, working interactions, local-preview behavior, and the X-Tech visual treatment. New claims about environmental data, permissions, enforcement, or public authority action should include an appropriate provenance and safety boundary. For user-visible workflow changes, add or update a reproducible validation note in the reliability audit.

## Reference Documents

| Document | Purpose |
| --- | --- |
| [FEATURE_RELIABILITY_AUDIT.md](./FEATURE_RELIABILITY_AUDIT.md) | Records reproducible route, interaction, export, and fallback checks. |
| [TRUSTOPS_DEMO.md](./TRUSTOPS_DEMO.md) | Explains the repeatable TrustOps decision-quality workflow. |
| [ROUND2_DEMO_SCRIPT.md](./ROUND2_DEMO_SCRIPT.md) | Provides a concise judge-facing demonstration sequence. |
| [PLANTING_DECISION_SOURCES.md](./PLANTING_DECISION_SOURCES.md) | Defines the planting-screening sources, evidence requirements, and non-permit boundary. |
| [PROJECT_AUDIT.md](./PROJECT_AUDIT.md) | Tracks preservation and validation context for additive MVP changes. |
