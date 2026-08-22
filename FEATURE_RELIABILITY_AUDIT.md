# DelhiCanopy Feature Reliability Audit

## Active audit status

This audit records reproducible browser checks against the local Vite preview. A feature is marked **working** only when its visible control produces the promised result under the app's local-preview fallback mode.

| Area | Observed state | Reproduction | Classification | Repair target |
| --- | --- | --- | --- | --- |
| Reports: Monthly Green Cover CSV | Fails | Open `/reports` and select **Export CSV** on Monthly Green Cover Analysis. The UI shows `No data available for this report. Please initialize the database first.` even though the page labels itself `Auto-Generated Analytics` and displays fallback counts. | Broken | Give reporting a deterministic local data packet and generate a valid CSV in both live and local-preview modes. |
| Reports: Generate New Report | No action | The card is presented as a clickable custom-analytics control but has no interactive handler. | Broken | Add a deterministic report-generation workflow with a visible ready state and export option. |
| Command Center | Partially working | The dashboard, map, layer controls, charts, and alert feed render with mock values, but the page simultaneously reports `Awaiting Init` and `Mock data mode` while the rest of the product presents actionable records. | Misleading state | Align the initialization status with the available fallback data and provide an explicit, working local-preview readiness state. |
| Green Intelligence | Working as a read-only analytics view | Zone statistics, green-cover chart, priority ranking, and AI vegetation summary render correctly using fallback data. The page has no primary interactive analysis action to test. | Working | Preserve during repair; include in regression verification. |
| Heat Stress Analyzer | Working as a read-only analytics view | Correlation chart, monthly heat trend, KPIs, and the heat-vulnerability ranking render correctly from fallback data. No primary heat-analysis action is exposed on this route. | Working | Preserve during repair; include in regression verification. |
| Tree Loss Detection | Working pending alert-selection check | Detection counters, two alert records, before/after comparison, and hotspot visualization render correctly. Alert rows are interactive and require a behavior check. | Pending interaction check | Verify alert selection updates the featured incident without breaking the view. |
| Tree Loss Detection: alert selection | Working | Selecting the Sadar Bazaar alert changed the comparison counter from `1 / 2` to `2 / 2` and updated the featured incident, location, and alert copy. | Working | Preserve during repair; include in regression verification. |
| AI Planner: ward selector | Fails presentation/readiness check | Existing fallback plan cards render, but the configuration selector remains labelled `Loading wards...` after the route loads, preventing a user from selecting a ward for a new strategy. | Broken | Ensure fallback wards populate the selector and retain a selectable value before enabling generation. |
| AI Planner: strategy generation | Working after data resolves | Selecting **Generate Strategy** made the fallback wards available, selected Narela, produced a new deterministic planting strategy, and showed a success notification. The initial loading label is a timing/readiness defect rather than a permanently broken generator. | Working with readiness defect | Repair the initial selector state; preserve deterministic plan generation. |
| Planting Space Finder: candidate selection | Working | Switching from Dwarka to Karol Bagh updated the selected candidate, score, risk framing, planting form, quantity, field brief, and source note. | Working | Preserve during repair; include in regression verification. |
| Planting Space Finder: Copy field brief | Working | Selecting **Copy field brief** produced the confirmation `Field brief copied to clipboard`. | Working | Preserve during repair; include in regression verification. |
| Planting Space Finder: evidence gate | Working | Selecting the land-custodian evidence record changed the state to `1/5 checks complete`, revealed its evidence note field, and kept the credibility threshold at `0/5 required records credible` until a traceable note is supplied. | Working | Preserve during repair; include in regression verification. |
| TrustOps Quality Command | Working | The default decision correctly held at `0/100`; **Load Winning Demo** deterministically populated four credible evidence records, resolved two red-team challenges, assigned the reviewer, and raised readiness to `100/100`. | Working | Preserve during repair; include in regression verification. |
| Governance Interface | Misleading and non-functional | The route explicitly identifies itself as a `Future Scope Module`, yet exposes a grievance form with a **Submit Grievance** control. Submitting an incomplete form produces no visible validation or explanation; there is no connected government submission. | Broken / future-scope conflict | Convert the form into a clear local draft workflow with validation, draft receipt, and explicit no-transmission language—or disable it until an actual authority integration exists. |
| How It Works | Working as an informational view | The architecture timeline and prototype boundary render correctly. | Working | Preserve during repair. |
| NotFound recovery | Working | An unknown URL renders a clear `404` state with a **Return to Home** link. | Working | Preserve during repair. |

## Audit boundaries

This review will cover all routes in `src/App.tsx`, their primary actions, client-side exports, browser print actions, map/data layers, and local fallback behavior. The app must preserve live-service preference while remaining usable when external services are unavailable.

## Repair verification in progress

| Area | Verified repair | Result |
| --- | --- | --- |
| Reports: Monthly Green Cover CSV | The Reports page now identifies `Local preview data`, supplies ten fallback ward records, and the browser confirms `Monthly Green Cover Analysis downloaded successfully!` after export. | **Pass** |
| Reports: Custom report | **Generate New Report** now produced a `Climate Decision Readiness Summary` card, and its **Export CSV** control confirmed a successful download. | **Pass** |
| AI Planner: ward readiness | The selector is ready immediately with a fallback ward and reports connected ward count once the local packet resolves. | **Pass** |
| AI Planner: View Full Plan | Selecting **View Full Plan** now opens a plan-detail brief including scope, timeline, land type, priority, budget, and species packet. | **Pass** |
| Governance: local draft validation | The repaired action now clearly rejects incomplete input with `Add both a location and a description before saving a local grievance draft.` | **Pass** |
| Governance: local draft receipt | A completed local-only demonstration draft generated a `DC-DRAFT` receipt and confirmed `No government system was contacted.` | **Pass** |
| Floating Canopy AI | The assistant opens from Governance and returns an analysis after a heat-stress quick action. When the remote chat endpoint is unavailable, the implementation now has a deterministic local-preview reply path. | **Pass** |
| Command Center: local-preview state | After the hook repair, a fresh visit settles to `Preview Ready · Local preview packet active` with working dashboard content and no misleading initialization prompt. | **Pass** |
| Command Center: View Full Analysis | The formerly decorative control now navigates to the relevant deep-dive route; the active vegetation insight opened Green Intelligence. | **Pass** |
| Command Center: individual alert action | Selecting an individual alert card did not leave the dashboard during this browser check, so this route-level behavior remains under review. | **Pending follow-up** |
| Command Center: View All Alerts | The primary **View All Alerts** control now opens the Tree Loss Detection route. | **Pass** |
| Reports: print packet | The print control builds a printable report and invokes the browser's native print flow. Automated browser control timed out while that native dialog was active, which is expected for an OS-managed print dialog; CSV export remains the fully automated evidence path. | **Manual browser print required** |
| Reports: downloaded artifact check | The browser created both `Monthly_Green_Cover_Analysis_2026-08-22.csv` and `Climate_Decision_Readiness_Summary_2026-08-22.csv`; the first contains the correct seven-column header and ten usable ward records. | **Pass** |
| Browser console regression | No console output was recorded after the repaired route, export, and control checks. | **Pass** |
| Command Center: DELHICANOPY DRIFT companion | The additive field-instrument card renders below the KPI row, explains its independent demo-data boundary, and its external action opens `https://delhicanopydrift.vercel.app/`. | **Pass** |
