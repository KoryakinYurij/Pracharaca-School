## 2024-05-22 - Accordion Accessibility Pattern
**Learning:** The `QACard` component uses `aria-controls` but the content panel lacks `role="region"` and `aria-labelledby`. This breaks the accessible relationship for some screen readers.
**Action:** When working on accordions in this codebase, ensure the content panel is a region and labeled by the trigger button.
