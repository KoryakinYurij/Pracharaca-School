# Baseline Audit Decisions
- Used global Playwright via custom script `capture_screenshots.cjs` to ensure interactions (click, focus) are captured.
- Used `chromium` instead of `chrome` to avoid missing binary errors in the environment.
- Task 2 (Color Contrast): Added `gold-dark` (126 107 62) to improve contrast for text and focus rings, keeping the original `gold` for backgrounds and borders.
- Updated text colors in badges and metadata to meet WCAG AA standards.
- Task 4 (Touch Targets): Standardized touch targets to `min-h-11` (44px) to meet accessibility guidelines without increasing visual clutter.
- Task 4 (Overflow): Used `min-w-0` and `break-words` on text containers in flex layouts to ensure robust responsive behavior.
- Decided to return `readonly` arrays from `getLessons` to prevent accidental mutations by consumers.
- Used a noble aesthetic for ErrorBoundary to match the overall app design (gold accents, ivory background, Playfair Display heading).
