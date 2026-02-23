- 2026-02-20: TopicCard hover polish uses restrained border-color cue (`border-border/70` to `border-gold/30`) with existing soft shadow, avoiding heavy depth changes.
- 2026-02-20: Icon motion now combines the existing diagonal nudge with subtle `scale-105`, including `group-focus-visible` parity for keyboard users.
- 2026-02-20: Reduced-motion users get non-animated fallback by conditionally omitting transition and transform classes when `useReducedMotion()` is true.
- 2026-02-20: LessonCard now mirrors the same hover/focus contract as TopicCard polish by moving border/shadow cues onto the link container (`hover:` + `focus-visible:`) instead of content-specific nodes.
- 2026-02-20: LessonCard icon motion remains restrained by keeping the existing diagonal nudge and adding only a small scale boost (`scale-[1.04]`) with shared 200ms easing.
- 2026-02-20: Playwright checks for task 4 validated desktop hover affordance, touch navigation to lesson content, and reduced-motion fallback (icon transform remains unchanged under `reducedMotion: "reduce"`).
- 2026-02-20: Heading rhythm can be tightened without a typography overhaul by introducing small utility classes in `src/index.css` (`.display-heading-rhythm`, `.display-card-title-rhythm`) and replacing only `leading-tight` on key display headings/titles.
- 2026-02-20: Mobile readability floor is easiest to preserve by keeping `body` at an explicit `16px` base and using `text-base` for core card intro/description copy.
- 2026-02-20: Biome CSS diagnostics in this repo stay clean when Tailwind at-rules are explicitly ignored and `@apply` shorthand is replaced with equivalent plain CSS in shared utility classes.
- 2026-02-20: For long lesson scrolls, the back affordance stays reachable only when `sticky` is attached to a wrapper that spans the full lesson flow (`header + cards + prev/next`), not to the short header panel itself.
- 2026-02-20: Header readability after sticky extraction stays balanced with a dedicated title panel (`bg-ivory/80` + blur) and tighter internal rhythm (`space-y-3/4`, explicit intro `text-base`).
- 2026-02-20: Quick mobile overlap guard can be automated in Playwright by comparing bounding boxes (`К урокам` bottom + 8px <= `h1` top) before saving evidence screenshots.
- 2026-02-20: QACard reveal works best by keeping existing grid-template-rows animation and adding a matching 700ms translateY(8px -> 0) transition on the inner answer wrapper.
- 2026-02-20: Open-state emphasis stays noble when limited to subtle border/background/shadow shifts (gold-border tint + panel wash + card shadow) rather than adding extra decorative layers.
- 2026-02-20: Keyboard toggle verification can be captured with Playwright by pressing Enter and Space on the first accordion button and asserting aria-expanded state transitions in evidence JSON.
- 2026-02-20: Subtle Three.js parallax stays content-safe when applied to a shared root group with strict pointer clamp (`~0.038`) and eased interpolation, instead of per-shape large offsets.
- 2026-02-20: Reduced-motion integrity for decorative canvas can be verified by hashing two delayed screenshots under `reducedMotion: "reduce"`; matching hashes confirm an effectively static render.
- 2026-02-20: Lesson card scroll reveal stays lightweight by animating only outer card containers with `whileInView` (`opacity: 0 -> 1`, `y: 16 -> 0`, `once: true`, `amount: 0.2`) and keeping QACard internals untouched.
- 2026-02-20: Reduced-motion compatibility for viewport reveals is safest with `initial={false}` and no `whileInView`/`transition`, which yields static containers (`opacity: 1`, `transform: none`, `transitionDuration: 0s`) across long lessons.
18: - 2026-02-20: Route transition timing is already aligned with card motion: PageTransition uses 0.38s duration with cubic-bezier(0.22, 1, 0.36, 1) easing (exact match to QACard), fade + 10px y-shift on enter, -8px y-shift on exit.
19: - 2026-02-20: Reduced-motion route transition uses 0.15s duration with no y-shift, providing short non-disorienting fallback while maintaining the same easing curve for consistency.
20: - 2026-02-20: Navigation tested across all route types (home → topic → lesson), transitions remain smooth and subtle with coherent timing relative to card/accordion motion.
- 2026-02-20: QACard button accessible name includes the numeric badge prefix (e.g. "01"), so role queries are more stable with regex name matching than exact string equality.
- 2026-02-20: Reduced-motion fallback for TopicCard/LessonCard is deterministic in unit tests when `useReducedMotion()` is mocked and transition class presence/absence is asserted directly.
- 2026-02-20: Final F3 replay across 16 scenarios is mostly green (15/16); retaining per-scenario JSON with measured computed styles and viewport metrics makes edge-case failures reproducible.
