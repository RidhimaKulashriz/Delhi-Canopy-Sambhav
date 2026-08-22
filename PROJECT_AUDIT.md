# Delhi-Canopy-Sambhav — additive MVP audit

The current X-Tech dashboard, map, navigation, heat, tree-loss, governance, reporting, and AI-planner routes must remain in place. The existing frontend builds successfully and the command-center interface renders in preview mode.

The main functional gap is offline/API resilience. The planner waits on Supabase-backed fetches and then receives empty arrays when the configured Edge Functions are unavailable, so its ward selector and plan-generation action are not usable without backend configuration. Existing mock data is already present in `src/data/mockData.ts`; the upgrade should use a clearly labelled local fallback when live data is unavailable, without removing the future Supabase path.

The new work will be additive: a planting-space finder will give screened candidate locations, implementation stages, and a repeatable content-quality gate. It must explain that recommendations are preliminary desktop screening and require land-owner, utilities, roadway, soil, and survival-plan approval before planting.

## Browser verification

The additive `/planting-space-finder` route renders inside the existing navigation and retains the X-Tech visual system. The candidate list, score display, custodian lead, implementation path, and checklist all render. An evidence item was toggled successfully and the gate updated from `0/5` to `1/5` required checks complete, confirming that the local persistence path works in preview mode.

The existing `/ai-planner` was also checked after the resilience update. It initially shows a loading state while attempting its live data path, then resolves to the local preview data with an active ward selector and an explicit connected-wards count. No existing planner screen was removed.

The planner’s generation action completes, but the connected response can return a formally successful yet unusable zero-tree plan. The application now validates plan output: when required trees, cooling, and CO₂ are all empty or zero, it uses the labelled local planning fallback rather than displaying a misleading plan. A browser run selected Narela and rendered the fallback result with 377 trees, 2.5°C estimated cooling, 490t estimated CO₂ offset, a ₹12.8L illustrative cost, and the required field-screen-to-monitoring timeline. The planner’s refresh flow also now filters zero-impact saved plans and falls back to the existing usable preview plans.

Validation status: the production build and the existing Vitest suite pass. The repository-wide lint command still reports pre-existing errors in unrelated UI, maps, reports, Supabase functions, and Tailwind configuration; no new lint violation was introduced by the additive planting feature or fallback repair.

The field-evidence gate is now stored per candidate space rather than globally. Browser validation retained the one existing Dwarka evidence check, then switched to the Shahdara North candidate and showed an independent `0/5` required-check state. This prevents field evidence recorded for one candidate from being misrepresented as readiness for another.

The Shahdara candidate’s `Copy field brief` control displayed a successful clipboard confirmation. The preserved Command Center route was then opened through the unchanged primary navigation and rendered its existing map layers, live-alert feed, risk ranking, climate analysis, and mock-data notice.
