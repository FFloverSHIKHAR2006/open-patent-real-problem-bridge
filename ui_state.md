# UI / UX Evolution State

## UX Plan
- **Flow & Orientation**:
  - Global header is heavy; needs a minimal, sleek navbar with logo mark, title, live status indicator, and theme/contrast toggle.
  - Tab navigation currently uses unstyled emoji icons; replace with crisp Lucide icons and an elegant segmented control / underline indicator.
  - Long result view requires a sticky section jump-nav (Problem, Solution Architecture, Expected Outcomes, Traceability, Sources, Alternatives) to avoid disorientation.
- **Problem Input & Discovery (Search View)**:
  - Example selector pills are detached; convert into interactive, curated "Quick Presets" chips with category tags and instant preview.
  - Operational Constraints drawer currently uses raw text symbols (`▶`, `▼`); convert to a smooth animated disclosure panel with active constraint summary badges.
  - Add `Ctrl+Enter` / `Cmd+Enter` keyboard submission shortcut and character/focus state indicators.
- **Solution & Synthesis Presentation**:
  - Add interactive component expansion (collapsible cards for technical components) to reduce cognitive overload while preserving deep technical details.
  - Convert Evidence Traceability pipeline from static string row into an interactive step flow with hoverable lineage connections (Problem -> Mechanism -> Source -> Component -> Outcome).
  - Add copy-to-clipboard for component recipes, patent IDs, and JSON export.
  - Filterable sources section (Patents vs Papers) with active count badges and instant search/keyword filter.
- **Cross-Section Interactivity**:
  - Demand Signals Board: Add a "Test Against Patents" 1-click action button on each demand card that automatically seeds the Problem Bridge Search and switches tabs.
  - Reverse Prior-Art Validator: Provide sample scenario buttons and structured visual novelty badges.
  - Evidence Provenance Graph: Add interactive node inspection with active-node detail drawer.

## Design System
- **Spacing Scale**:
  - Base unit: 4px
  - Tokens: `--space-2xs: 4px`, `--space-xs: 8px`, `--space-sm: 12px`, `--space-md: 16px`, `--space-lg: 24px`, `--space-xl: 32px`, `--space-2xl: 48px`
  - Container: Max-width `1200px` centered with fluid `16px`-`24px` inline gutter
- **Type Scale & Hierarchy**:
  - Headings: `Outfit`, tracking `-0.02em`, weights `600` / `700`
  - Body: `Inter`, tracking `-0.01em`, weights `400` / `500`, line-height `1.55`
  - Monospace: `JetBrains Mono`, tabular numbers for patent IDs, scores, and code
  - Scale: `--text-2xs: 0.6875rem` (11px), `--text-xs: 0.75rem` (12px), `--text-sm: 0.8125rem` (13px), `--text-base: 0.9375rem` (15px), `--text-md: 1.0625rem` (17px), `--text-lg: 1.25rem` (20px), `--text-xl: 1.5rem` (24px), `--text-2xl: 1.875rem` (30px)
- **Color Palette & Contrast (Obsidian Minimal)**:
  - Canvas Base: `#080c14` (deep obsidian)
  - Card Surfaces: `rgba(13, 20, 34, 0.82)` with `backdrop-filter: blur(16px)`
  - Card Hover Surface: `rgba(18, 28, 48, 0.9)`
  - Hairline Borders: `rgba(255, 255, 255, 0.08)` resting; `rgba(6, 182, 212, 0.35)` active focus
  - Typography contrast: `#f8fafc` (Primary text, 15:1 contrast), `#94a3b8` (Secondary, 6.5:1 contrast), `#64748b` (Tertiary/Meta, 4.5:1 contrast)
  - Semantic Accents:
    - Primary Action / Tech: `#06b6d4` (Cyan) + `rgba(6, 182, 212, 0.12)` pill bg
    - Grounded / Verified: `#10b981` (Emerald) + `rgba(16, 185, 129, 0.12)` pill bg
    - Prior-Art / Patent: `#a855f7` (Purple) + `rgba(168, 85, 247, 0.12)` pill bg
    - Warning / Overlap: `#f59e0b` (Amber) + `rgba(245, 158, 11, 0.12)` pill bg
    - Conflict / Error: `#f43f5e` (Rose) + `rgba(244, 63, 94, 0.12)` pill bg
- **Motion & Micro-Interaction Rules**:
  - Interactive Speed: `140ms ease-out` on hover, active click, and color shifts
  - Smooth Reveal: `200ms cubic-bezier(0.16, 1, 0.3, 1)` for accordions and modal popovers
  - Hover Elevation: Subtle `transform: translateY(-1px)` and subtle hairline border glow (`box-shadow: 0 0 0 1px rgba(6, 182, 212, 0.25), 0 8px 24px -4px rgba(0, 0, 0, 0.45)`)
  - Focus Ring: Clean `outline: 2px solid rgba(6, 182, 212, 0.65)` with `outline-offset: 2px`
  - Zero heavy decorative gradients; only clean radial backdrop illumination and crisp structural borders

## Implementation Log
- `frontend/src/index.css`: Implemented Obsidian Minimal design tokens, type scale, hairline borders, sticky jump-nav, and micro-interaction classes.
- `frontend/src/App.jsx`: Refined header bar, segmented tab navigation with Lucide icons, live corpus status badge, and demand signal 1-click seeding.
- `frontend/src/components/ProblemInputForm.jsx`: Added interactive scenario preset chips, animated operational constraints drawer with summary badges, and Ctrl+Enter keyboard submission.
- `frontend/src/components/SolutionResultView.jsx`: Added sticky section jump-nav bar, collapsible component cards with copy-to-clipboard, filterable source citations with instant search, and crisp lineage step connectors.
- `frontend/src/components/DemandSignalBoard.jsx`: Added 1-click "Test Against Patents" cross-section workflow and sector filtering chips.
- `frontend/src/components/EvidenceGraphViewer.jsx`: Created interactive 2-column node inspector linking natural-language problem to deep patent claim disclosures.
- `frontend/src/components/ReverseSearchForm.jsx`: Added preset prototype idea chips, structured novelty differentiator badges, and direct patent overlap warnings.
- `frontend/src/components/PrototypeRecipeModal.jsx`: Modernized dialog with Escape-key dismiss, clean BOM matrix table, and export options.
- `frontend/src/components/MechanismMatchCard.jsx`: Replaced legacy badge classes with Design System tokens, Lucide icons, and confidence meters.
- `frontend/src/components/ApiExplorer.jsx`: Styled REST endpoint contracts with 1-click sample payload copying and color-coded method badges.
- `frontend/src/components/ProblemInputForm.jsx`: Added 1-click "Clear" query reset action to quickly wipe fields for a custom problem input.
- `frontend/src/components/SolutionResultView.jsx`: Integrated dynamic IntersectionObserver scroll tracking for real-time section highlight in sticky jump nav.

## Round 2 Fixes
- Problem Input Form: Add a "Clear / Custom Query" reset action alongside the presets so users can clear inputs in one click without manual backspacing.
- Result View Jump Navigation: Enhance sticky jump nav with IntersectionObserver or active scroll tracking so the active section pill updates automatically as the user scrolls.

## Round 2 Design Specifications
- Reset Action: Minimal ghost chip with `RotateCcw` micro-icon, border `var(--border-hairline)`, transitions to `--accent-rose` tint on hover when fields are dirty.
- Dynamic Jump Nav Indicator: Active pill receives `background: var(--accent-cyan-subtle)`, text `var(--accent-cyan-light)`, border `1px solid var(--accent-cyan-border)`, and subtle elevation box shadow.

## Architect Verification
- **Goal Confirmation**: Goal successfully achieved.
  - **Interactive**: Live scenario chips, clear query actions, collapsible fabrication constraints, dynamic IntersectionObserver scroll jump navigation, expandable solution components, copy-to-clipboard actions, live source search, and 1-click cross-tab problem seeding.
  - **Elegant**: Restrained Obsidian palette (`#080c14`), 1px crisp hairline borders, glassmorphic surface depth, and clean semantic badge accents.
  - **Stylized**: Custom typography scale (`Outfit`, `Inter`, `JetBrains Mono`), unified Lucide iconography across tabs and cards, and step flow indicators.
  - **Minimal**: Zero visual clutter or heavy decorative gradients; high-contrast WCAG AA+ readability and disciplined 4px spacing.
- **Loop Status**: Complete (Terminated after Round 2 with all success criteria satisfied).

## Round 3 — FSLab AI Governance & Enterprise Theme Transformation
- **UX Architect Plan**:
  - Transform overall aesthetic from dark obsidian to the luminous, high-clarity enterprise aesthetic of FSLab (`#F8FAFC` canvas, pure `#FFFFFF` cards, `#0F172A` high-contrast typography).
  - Adopt FSLab's architectural balance: clean light modular cards punctuated by a rich dark charcoal `#0F172A` social-proof / verification ticker band.
  - Header: Adopt bold uppercase tech brand identity (`BRIDGE.LAB` with electric blue accent), refined segmented pill tabs, and high-impact dark CTA.
  - Problem Form & Results: Transform into razor-sharp enterprise governance modules with crisp tabular metrics, clean hairline borders, and zero muddy gradients.

## FSLab Design System Specification
- **Palette**:
  - Canvas: `#F8FAFC` (ultra-clean cool slate)
  - Cards & Containers: `#FFFFFF` with 1px border `#E2E8F0`
  - Elevated Cards / Modals: `#FFFFFF` with shadow `0 4px 20px -2px rgba(15, 23, 42, 0.08)`
  - Contrast Strip: `#0F172A` (charcoal black) with white/slate text for authoritative metric tickers
  - Text Primary: `#0F172A` (deep obsidian slate, -0.025em tracking)
  - Text Secondary: `#475569` (cool neutral slate)
  - Text Tertiary: `#94A3B8`
  - Accent Primary: Electric Royal Blue `#2563EB` (selection, active tabs, focus ring)
  - Accent Verified: Emerald `#16A34A` (patent grounded metrics, positive delta)
  - Accent Warning: Amber `#D97706`
  - Accent Overlap: Crimson `#E11D48`
- **Buttons & Controls**:
  - Primary Button: Solid Charcoal `#0F172A`, text `#FFFFFF`, hover `#1E293B`, rounded-sm (8px)
  - Secondary Button: `#FFFFFF` surface, border `#E2E8F0`, text `#0F172A`, hover `#F8FAFC`
  - Preset Chips: `#F1F5F9` background, border `#E2E8F0`, text `#334155`, active `#EFF6FF` with `#2563EB` border
  - Form Inputs: `#FFFFFF` surface, 1px `#CBD5E1` border, text `#0F172A`, focus `#2563EB` with `0 0 0 3px rgba(37, 99, 235, 0.12)`
- **Typography**:
  - Headings: `Plus Jakarta Sans` / `Outfit`, weights 600 & 700, tight tracking
  - Body: `Inter`, weights 400 & 500, clean line-height 1.55
  - Monospace: `JetBrains Mono` for patent numbers, scores, and code

## Phase 3 — Frontend Implementation (FSLab AI Governance Transformation)
- **Design Tokens & Theme Architecture (`frontend/src/index.css`)**:
  - Replaced dark obsidian theme with FSLab light enterprise design system.
  - Set background canvas to `#F8FAFC` with subtle 32px grid pattern.
  - Configured pure white cards (`#FFFFFF`) with 1px hairline borders (`#E2E8F0`) and soft shadows (`0 1px 3px rgba(15, 23, 42, 0.05)`).
  - Integrated `Plus Jakarta Sans` for crisp geometric headings and `Inter` for clean body typography.
  - Implemented solid charcoal black (`#0F172A`) primary buttons and electric royal blue (`#2563EB`) accent pills and active indicators.
- **Component Upgrades**:
  - `App.jsx`: Styled FSLab `BRIDGE .LAB` brand bar with electric blue dot, high-contrast dark charcoal provenance ticker bar, and segmented tab navigation.
  - `ProblemInputForm.jsx`: Converted to white card with light preset chips, styled input controls, and black primary action button.
  - `SolutionResultView.jsx`: Transformed hero badge, 7 jump sections, component cards with toggleable BOM/materials spec, evidence traceability flow, and verified citation cards to clean white surfaces.
  - `EvidenceGraphViewer.jsx`: Styled root operational node and interactive lineage inspector with light cards and mono claim blocks.
  - `ReverseSearchForm.jsx`: Implemented light prior-art overlap cards with emerald, rose, and blue status highlights.
  - `DemandSignalBoard.jsx`: Rebuilt as light white cards with blue opportunity metrics and sector pills.
  - `PrototypeRecipeModal.jsx`: Upgraded modal backdrop and container to luminous white card with clean BOM table.
  - `ApiExplorer.jsx`: Styled developer REST endpoints with blue badges and light mono payload pre-containers.
- **Verification**:
  - `npm run build`: Zero errors.
  - Browser verification via `browser_subagent`: All pages, flows, and interactive components verified against the live UI8 FSLab reference design.















