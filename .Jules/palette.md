# Palette’s Journal

- The `focus-ring` utility class is the project standard for ensuring consistent, accessible focus-visible states across interactive elements like buttons and links. Applied it to `ErrorBoundary` buttons and DEV kitchen sink link.
- Abstract timeline visual structures (e.g., `StepTimeline`) must use native `<ol>` and `<li>` semantics instead of purely decorative `div`s to improve screen reader navigation. Additionally, large decorative background numbers or icons (e.g., in `StepTimeline` and `PrincipleBlock`) must include `aria-hidden="true"` to prevent confusing announcements.
