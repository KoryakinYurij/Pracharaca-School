## 2026-02-13T17:05:36.599Z Task: initialization
- Plan selected: topics-page-redesign.

## 2026-02-14 Task: Create feature branch
- Branch feature/multi-topic-homepage created from HEAD to keep current working tree changes.

## Directory-per-Topic Layout
- Selected `content/topics/krasivyi-konspekt/` as the first topic directory.
- Added `slug` and `order` fields to `meta.json` to facilitate topic listing and sorting.

## 2026-02-14 Task 3: Loader API design
- All 5 exported functions take `topicSlug` as first param for scoped lookup — consistent API surface.
- Used `Map<string, TopicData>` and `Map<string, LessonData[]>` for O(1) slug-based lookups.
- `isTopicData` guard validates `slug`, `order`, `title`, `subtitle`, `description` — mirrors JSON shape without `lessonCount` (computed, not from JSON).
- Old API (`getTopic()`, `getLessons()`, single-param `getLessonBySlug`/`getAdjacentLessons`) fully removed — no backward compat layer.

## 2026-02-14 Task 5: TopicPage dynamic routing
- Refactored `TopicPage` to use `useParams` for `slug`.
- Uses `getTopicBySlug` and `getLessonsForTopic` for dynamic fetching.
- Added "Not Found" state similar to LessonPage for missing topics.

## 2026-02-14 Task 6: Nested route structure
- URL scheme: `/` → listing, `/topic/:slug` → topic, `/topic/:slug/lesson/:lessonSlug` → lesson.
- `topicSlug` passed as prop to `LessonCard` and `PrevNextNav` (not via useParams) — these components don't own their route context.
- LessonPage back link points to `/topic/${slug}` (parent topic), not `/` (home).
- "Урок не найден" back link points to `/` since no valid topic context exists in error state.

## 2026-02-14 Task 7: Documentation Finalization
- Finalized content structure documentation: `content/topics/[slug]/meta.json` and `content/topics/[slug]/lessons/[order]-[slug].json`.
- Confirmed `slug` and `order` as mandatory fields in `meta.json` for sorting and routing.
