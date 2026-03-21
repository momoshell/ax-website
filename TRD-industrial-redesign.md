# Technical Requirements Document: Industrial Design Transformation

## Problem Statement

The current A&X Labs website has a generic dark-mode SaaS aesthetic (Inter font, blue accents, rounded corners, soft gradients) that doesn't align with the company's industrial engineering positioning. The user wants to transform the site to match the technical/data-sheet aesthetic of IP Axis Industrial Studio — a high-contrast, grid-based, monospace-only design language that conveys precision and technical credibility.

**Why now**: The current design dilutes the brand's industrial engineering identity. The target aesthetic will differentiate A&X Labs from typical AI consultancies and reinforce their positioning as hardware-integrated AI specialists.

**Impact of not doing this**: Continued brand confusion, missed differentiation opportunity, website doesn't match the technical sophistication of the actual work.

---

## Goals (Priority Order)

| Priority | Goal | Done When |
|----------|------|-----------|
| P0 | Achieve pure B&W color scheme with visible grid overlay | No blue (#3b82f6) remains anywhere; 50px grid visible on all sections |
| P0 | Implement monospace typography throughout | All text uses Space Mono or JetBrains Mono; ALL CAPS with wide tracking |
| P0 | Add slash-prefixed section headings | Hero, Services, About, Contact all display as /HERO, /SERVICES, /ABOUT, /CONTACT |
| P1 | Create technical footer with live clock/barcode | Footer displays: date, time (live updating), barcode, company data |
| P1 | Add coordinate markers to layout | Grid coordinates (A,B,C... 1,2,3...) visible at viewport edges |
| P1 | Implement barcode component | Reusable SVG barcode generator for company name |
| P2 | Sharpen all corners (0px radius) | No rounded corners anywhere on site |
| P2 | Update preloader to match new aesthetic | Glitch effect remains but styled in B&W monospace |

---

## Phases

### Phase 1: Foundation — Color & Typography System

**Objective**: Replace the entire visual foundation (colors, fonts) with the industrial system.

**Dependencies**: None

**Parallel Group**: All changes to CSS/config files can happen simultaneously — they're independent.

**Files**:
- `tailwind.config.js` — Update color palette (remove accent, pure B&W), font stack
- `src/app.css` — Update CSS custom properties, add custom utility classes for industrial patterns
- `src/lib/components/Header.svelte` — Update to use new font utilities
- `src/lib/components/NavLink.svelte` — Update styling

**Delegation**: @coder (frontend-specialist for CSS/config changes)

**Acceptance Criteria**:
- [ ] Running `npm run dev` shows site with pure black background (#000000)
- [ ] All text renders in monospace font
- [ ] Navigation links are ALL CAPS with wide letter-spacing
- [ ] Custom utility classes exist: `.tech-heading`, `.tech-label`, `.tech-border`
- [ ] **Blue color removal complete** (all instances of #3b82f6 replaced):
  - [ ] `tailwind.config.js`: accent color removed or changed to white
  - [ ] `src/app.css` line 10: `--color-accent: #3b82f6` → `--color-accent: #ffffff` or removed
  - [ ] `src/app.css` line 56: scrollbar hover uses white/gray instead of accent
  - [ ] `src/app.css` line 61: selection background uses white/gray
  - [ ] `src/app.css` line 67: focus-visible outline uses white
  - [ ] `src/app.css` line 91: `.glow-accent` class removed or uses white glow
  - [ ] `src/app.css` line 96: broken `hsl(var(--accent))` reference fixed
- [ ] Font loading strategy implemented: JetBrains Mono via Google Fonts with `swap` display

**Risks**:
- Risk: Removing accent color breaks hover states that rely on it
  - Mitigation: Replace with white (`#ffffff`) or high-contrast gray for hover states
- Risk: Monospace fonts change layout dimensions (cards break, text overflows)
  - Mitigation: Audit all sections after font change, adjust padding/sizing as needed

**Rollback Plan**: Git revert on the commit. Keep a backup branch of current design.

---

### Phase 2: Layout Infrastructure — Grid Overlay & Coordinate System

**Objective**: Create the core layout components that provide the technical aesthetic (grid overlay, coordinate markers, technical layout wrapper).

**Dependencies**: Phase 1 (requires font/color system to be in place)

**Parallel Group**: All three components can be built in parallel — they only combine in the final integration step.
- @coder creates GridOverlay
- @coder creates CoordinateMarkers
- @coder creates TechnicalLayout

**Files**:
- `src/lib/components/GridOverlay.svelte` — CSS-based 50px grid lines
- `src/lib/components/CoordinateMarkers.svelte` — A,B,C labels at left edge, 1,2,3 at top
- `src/lib/components/TechnicalLayout.svelte` — Wrapper combining above + positioning
- `src/routes/+layout.svelte` — Integrate TechnicalLayout

**Delegation**: @coder (frontend-specialist)

**Acceptance Criteria**:
- [ ] 50px grid visible across entire viewport
- [ ] Grid coordinates (A, B, C...) visible along left edge of viewport
- [ ] Grid coordinates (1, 2, 3...) visible along top edge of viewport
- [ ] Grid persists across all page navigation
- [ ] Grid does not block interaction with content (pointer-events: none)
- [ ] Custom utility class `.tech-grid-bg` created in `app.css` for grid background pattern

**Risks**:
- Risk: Grid overlay impacts performance on mobile
  - Mitigation: Use CSS `linear-gradient` (GPU accelerated), test on mobile device
- Risk: Coordinate markers overlap with content on small screens
  - Mitigation: Hide coordinates on mobile breakpoint (`hidden md:block`)

**Rollback Plan**: Remove TechnicalLayout from +layout.svelte to revert to grid-free state.

---

### Phase 3: Shared Components — Barcode, SlashHeading, TechnicalFooter

**Objective**: Create reusable, well-architected components for the industrial design language following component design best practices.

**Dependencies**: Phase 1 (typography system)

**Parallel Group**: All three components are independent and can be built in parallel, with component design guidance.

**Files**:
- `src/lib/components/SlashHeading.svelte` — Renders "/SERVICES" from "SERVICES" input
- `src/lib/components/Barcode.svelte` — SVG barcode generator (Code128 or Code39)
- `src/lib/components/TechnicalFooter.svelte` — Multi-column footer with live clock, date, barcode

**Delegation**: @coder (frontend-specialist) for implementation, with @web-component-design skill loaded for architecture guidance

**Component Design Principles** (via web-component-design skill):
- Single responsibility: Each component does one thing well
- Composition via props: `text`, `value`, `class` overrides
- Accessible by default: ARIA attributes, semantic HTML
- Forward refs: Allow parent access where needed
- Memoization: Use Svelte 5 runes for derived state

**Acceptance Criteria**:
- [ ] `<SlashHeading text="SERVICES" />` renders as "/SERVICES" with styling
- [ ] `<Barcode value="A&X LABS" />` renders scannable SVG barcode
- [ ] `<TechnicalFooter />` displays: date (DD/MM/YYYY), time (HH:MM:SS, live), barcode, trademark, company info
- [ ] Time updates every second without page reload
- [ ] All components use monospace, ALL CAPS styling

**Risks**:
- Risk: Barcode generation is complex/heavy
  - Mitigation: Use lightweight SVG path generation, no external libraries if possible
- Risk: Live clock causes excessive re-renders
  - Mitigation: Use `setInterval` at 1-second granularity (not per-frame), update only time display

**Testing Strategy**: @test-engineer writes unit tests **during** Phase 3 implementation (TDD approach — tests written alongside components, not after). Tests cover: Barcode SVG generation logic, TechnicalFooter time formatting, SlashHeading rendering.

**Rollback Plan**: Remove component imports from sections that use them.

---

### Phase 4: Section Redesign — Hero, Services, About, Contact

**Objective**: Redesign all four main sections to use the new industrial components and styling.

**Dependencies**: Phase 1 (fonts/colors), Phase 2 (grid layout), Phase 3 (shared components)

**Parallel Group**: All four sections can be redesigned simultaneously — they're independent.

**Files**:
- `src/lib/sections/Hero.svelte` — Update layout, add slash prefix, remove CTA button styling
- `src/lib/sections/Services.svelte` — Transform cards to data-sheet list format
- `src/lib/sections/About.svelte` — Add technical profile layout, founder info
- `src/lib/sections/Contact.svelte` — Transform to form-interface style
- `src/lib/components/Section.svelte` — Update wrapper to use tech-grid-bg

**Delegation**: @coder (frontend-specialist) — can parallelize across 4 subtasks if using worktrees

**Acceptance Criteria**:
- [ ] Hero displays "/A&X LABS" with barcode below
- [ ] Services displays "/SERVICES" with numbered list [01], [02], [03], [04]
- [ ] About displays "/ABOUT" with technical data block (date, time, barcode)
- [ ] Contact displays "/CONTACT" with form-input style layout
- [ ] All sections have 0px border radius on all elements
- [ ] No rounded buttons remain anywhere

**Risks**:
- Risk: Content doesn't fit new layout (text overflow, cramped spacing)
  - Mitigation: Review each section after implementation, adjust spacing constants
- Risk: Mobile layout breaks with technical grid
  - Mitigation: Responsive design — simplify grid on mobile, hide coordinates

**Rollback Plan**: Git revert on section files (keep backups).

---

### Phase 5: Preloader & Polish

**Objective**: Update the preloader to match the industrial aesthetic and add final polish.

**Dependencies**: Phase 1 (color system) — can run in parallel with Phases 2, 3, and 4

**Parallel Group**: Preloader changes are independent of layout/components/sections.

**Files**:
- `src/lib/components/Preloader.svelte` — Update to B&W, add grid crosshair effect
- `src/lib/animations/glitch.ts` — No changes needed (glitch effect works with new colors)

**Delegation**: @coder (frontend-specialist)

**Acceptance Criteria**:
- [ ] Preloader uses pure B&W color scheme
- [ ] Glitch text uses monospace font
- [ ] Optional: Add "SYSTEM INITIALIZING..." text with progress percentage
- [ ] Preloader transition remains smooth (500ms fade)

**Risks**:
- Risk: Preloader styling breaks with new font (text overflow)
  - Mitigation: Test preloader at all viewport sizes

**Rollback Plan**: Keep backup of original Preloader.svelte.

---

### Phase 5.5: Design Review Checkpoints

**Objective**: Visually validate each phase against the IP Axis reference design using web-design-reviewer.

**Dependencies**: Each checkpoint runs after its respective phase completes

**Parallel Group**: N/A — runs serially after each phase

**Checkpoints**:

| Checkpoint | After Phase | What to Review |
|------------|-------------|----------------|
| DR-1 | Phase 1 (Foundation) | Color purity (no blue), font rendering, spacing consistency |
| DR-2 | Phase 2 (Layout) | Grid visibility, coordinate markers positioning, no overlaps |
| DR-3 | Phase 3 (Components) | SlashHeading styling, Barcode readability, Footer layout |
| DR-4 | Phase 4 (Sections) | Section layouts match reference, consistent spacing, responsive behavior |
| DR-5 | Phase 5 (Preloader) | Preloader matches industrial aesthetic, smooth transition |

**Delegation**: @web-design-reviewer (runs development server at `http://localhost:5173`, captures screenshots, compares against reference images)

**Acceptance Criteria per Checkpoint**:
- [ ] Screenshots captured at 1920x1080, 768x1024, 375x812 viewports
- [ ] Visual comparison shows alignment with industrial aesthetic
- [ ] No layout overflows or overlaps detected
- [ ] Color contrast passes accessibility (4.5:1 minimum)
- [ ] Responsive behavior acceptable (grid hidden on mobile, text readable)
- [ ] **Web Interface Guidelines compliance**: Checked against Vercel's Web Interface Guidelines (contrast, spacing, interaction states, typography hierarchy)

**Risks**:
- Risk: Visual issues discovered late require rework
  - Mitigation: Early checkpoints catch issues before they compound
- Risk: Reference design is subjective
  - Mitigation: User has final approval on visual direction

---

### Phase 6: Final Validation & Testing

**Objective**: Complete verification including build, code review, and automated testing.

**Dependencies**: All previous phases + all design review checkpoints complete

**Parallel Group**: 
- @build-agent runs type checks and build
- @code-reviewer reviews for anti-patterns and accessibility
- @test-engineer runs visual regression tests
- @web-design-reviewer does final visual sweep

**Files**: All modified files

**Delegation**: @build-agent, @code-reviewer, @test-engineer, @web-design-reviewer

**Acceptance Criteria**:
- [ ] `npm run build` completes without errors
- [ ] `npm run check` (TypeScript) passes
- [ ] No console errors in browser
- [ ] Site is accessible (keyboard navigation works, sufficient color contrast)
- [ ] Site renders correctly on mobile (grid hidden, text readable)
- [ ] All goals from table are verified complete
- [ ] **Final design approval**: Screenshots match user expectations

**Risks**:
- Risk: Build fails due to new components
  - Mitigation: Fix type errors, ensure all imports are correct
- Risk: Accessibility issues (low readability with ALL CAPS monospace)
  - Mitigation: Add `text-transform: uppercase` in CSS (not content), verify screen reader experience

---

## Cross-Cutting Concerns

### Error Handling
- **Component failures**: If Barcode or TechnicalFooter fails, component should render fallback text (e.g., "A&X LABS" instead of broken barcode)
- **Time sync**: If live clock fails, display static time from build
- **Grid performance**: If grid causes jank on low-end devices, provide media query to disable it

### Accessibility
- **ALL CAPS issue**: Use `text-transform: uppercase` in CSS, not in content — screen readers need proper casing
- **Monospace readability**: Increase line-height for body text to compensate (1.8 instead of 1.6)
- **Grid overlay**: Ensure `pointer-events: none` so it doesn't block clicks
- **High contrast**: Pure B&W actually improves accessibility for low vision users
- **Reduced motion**: Respect `prefers-reduced-motion` — disable glitch effects, use instant transitions

### Testing Strategy
1. **Unit tests**: @test-engineer writes tests for Barcode component (SVG generation logic)
2. **Visual regression**: Use Playwright for automated screenshot testing at breakpoints: 1920x1080 (desktop), 768x1024 (tablet), 375x812 (mobile)
3. **Accessibility audit**: Lighthouse accessibility score ≥ 90
4. **Cross-browser**: Test in Chrome, Firefox, Safari, Edge

### Rollback Plan (Global)
1. All changes are on a feature branch `feature/industrial-redesign`
2. Main branch remains untouched until final merge
3. If critical issues found post-merge: `git revert` the merge commit
4. Keep `backup/pre-redesign` branch with original design

---

## Delegation Summary

| Phase | Agent + Skills | Scope | Parallel? |
|-------|----------------|-------|-----------|
| 1: Foundation | @coder | CSS, Tailwind config, Header, NavLink | Yes (files are independent) |
| 1.5: DR-1 | @web-design-reviewer + @web-design-guidelines | Visual validation of colors/fonts | After Phase 1 |
| 2: Layout | @coder + @web-component-design | GridOverlay, CoordinateMarkers, TechnicalLayout, +layout | No (depends on Phase 1) |
| 2.5: DR-2 | @web-design-reviewer + @web-design-guidelines | Visual validation of grid/coordinates | After Phase 2 |
| 3: Components | @coder + @web-component-design | SlashHeading, Barcode, TechnicalFooter | Yes (parallel within phase) |
| 3.5: DR-3 | @web-design-reviewer + @web-design-guidelines | Visual validation of components | After Phase 3 |
| 4: Sections | @coder (×4) + @web-component-design | Hero, Services, About, Contact | Yes (worktree parallelization) |
| 4.5: DR-4 | @web-design-reviewer + @web-design-guidelines | Visual validation of all sections | After Phase 4 |
| 5: Preloader | @coder | Preloader.svelte | Yes (parallel with Phase 4) |
| 5.5: DR-5 | @web-design-reviewer + @web-design-guidelines | Visual validation of preloader | After Phase 5 |
| 6: Validation | @build-agent, @code-reviewer, @test-engineer, @web-design-reviewer | Type check, review, tests, final visual sweep | Yes (parallel agents) |

---

## Active Skills

### 1. web-component-design
**When invoked**: Throughout implementation (Phases 2, 3, 4)
**Purpose**: Ensure components follow best practices for:
- Single responsibility and composition
- Accessible markup and ARIA attributes
- Props API design (variants, sizes, class overrides)
- Svelte 5 runes patterns for reactivity
- Error handling and edge cases

### 2. web-design-reviewer
**When invoked**: Design review checkpoints (DR-1 through DR-5, Phase 6)
**Purpose**: Visual validation via:
- Screenshots at multiple viewports
- Layout issue detection (overflows, overlaps)
- Responsive behavior verification
- Comparison against IP Axis reference aesthetic

### 3. web-design-guidelines
**When invoked**: Design review checkpoints (DR-1 through DR-5)
**Purpose**: Compliance checking against:
- Vercel Web Interface Guidelines
- Color contrast ratios
- Typography hierarchy
- Interaction states and feedback
- Spacing consistency

---

## Appendix: Visual Reference

### Target Aesthetic Elements

**Color**: Pure black (#000000) background, pure white (#ffffff) text, no other colors

**Typography**: 
- Font: JetBrains Mono (primary — already in Tailwind config) + Space Mono (fallback via Google Fonts)
- Loading: Google Fonts with `&display=swap` for performance
- Fallback: `Consolas, Monaco, 'Courier New', monospace`
- Case: ALL CAPS (applied via CSS `text-transform: uppercase`, not in content)
- Tracking: `letter-spacing: 0.15em` for UI, `0.2em` for headings
- Weight: 700 (bold) for headings, 400 for body
- Line-height: 1.8 for body text (increased from 1.6 for monospace readability)

**Grid**: 
- 50px grid lines
- Color: `rgba(255,255,255,0.03)`
- Visible across entire viewport

**Sections**:
- Hero: `/A&X LABS` with barcode, system status text
- Services: `/SERVICES` with [01], [02], [03], [04] numbered list
- About: `/ABOUT` with founder info, technical data block
- Contact: `/CONTACT` with form-style inputs, external link arrows (↗)

**Footer**:
- 5-column grid layout
- Columns: Trademark/Barcode, Company Info, Date, Time, Description
- Live updating clock (HH:MM:SS)
- Current date (DD/MM/YYYY)

### Anti-Patterns to Avoid
- No blue accents (was #3b82f6)
- No rounded corners (was 2px radius)
- No gradients (was soft gradients on Hero)
- No Chinese characters (user explicitly excluded these)

### Assumptions Verified
- **Content files**: Markdown content (`src/lib/content/*.md`) contains only text — no styling changes needed. Content will adapt to new CSS automatically.
- **MetaTags/StructuredData**: SEO components only contain meta information — no visual changes needed for industrial aesthetic.
- **Existing font stack**: Tailwind config already has JetBrains Mono — Phase 1 will use this and add Space Mono via Google Fonts as fallback.
