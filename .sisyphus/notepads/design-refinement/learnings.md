- Removed global card wrapper from Layout.tsx to expose Three.js background.
- Wrapped specific sections in TopicPage and LessonPage with backdrop containers to maintain readability.
- Verified visual changes with Playwright screenshots.

## Badge Simplification
- **Pattern**: Removed circle containers from secondary/tertiary numbers to reduce visual noise.
- **Hierarchy**:
  - Page/Context labels: Gold pill (kept)
  - Lesson order: Plain text, semi-bold gold
  - QA card number: Plain text, semi-bold gold/70
  - List step number: Plain text, medium graphite/50
- **Rationale**: Reserve the "badge" visual language for high-level context indicators only. Numbers in lists/cards are structural, not metadata labels.
