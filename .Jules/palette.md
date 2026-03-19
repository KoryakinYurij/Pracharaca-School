# Palette’s Journal

- The `focus-ring` utility class is the project standard for ensuring consistent, accessible focus-visible states across interactive elements like buttons and links. Applied it to `ErrorBoundary` buttons and DEV kitchen sink link.

- **List Semantics:** When applying `list-none` (which strips default list styling) to `<ol>` or `<ul>` elements, add `role="list"` explicitly to preserve list semantics for some screen readers (like VoiceOver in Safari).
