import type { LessonData, TopicData } from './types'

function isLessonData(data: unknown): data is LessonData {
  if (typeof data !== 'object' || data === null) return false
  const d = data as Record<string, unknown>
  return (
    typeof d.slug === 'string' &&
    typeof d.order === 'number' &&
    typeof d.title === 'string' &&
    Array.isArray(d.cards)
  )
}

function isTopicData(data: unknown): data is TopicData {
  if (typeof data !== 'object' || data === null) return false
  const d = data as Record<string, unknown>
  return (
    typeof d.slug === 'string' &&
    typeof d.order === 'number' &&
    typeof d.title === 'string' &&
    typeof d.subtitle === 'string' &&
    typeof d.description === 'string'
  )
}

const topicModules = import.meta.glob<{ default: TopicData }>(
  '/content/topics/*/meta.json',
  { eager: true },
)

const lessonModules = import.meta.glob<{ default: LessonData }>(
  '/content/topics/*/lessons/*.json',
  { eager: true },
)

/** Extract topic slug from a glob-matched path, e.g.
 *  "/content/topics/krasivyi-konspekt/meta.json" → "krasivyi-konspekt"
 *  "/content/topics/krasivyi-konspekt/lessons/01-noble-basics.json" → "krasivyi-konspekt"
 */
function extractTopicSlug(filePath: string): string {
  const parts = filePath.split('/')
  const topicsIdx = parts.indexOf('topics')
  if (topicsIdx === -1 || topicsIdx + 1 >= parts.length) {
    throw new Error(`Невозможно извлечь slug темы из пути: ${filePath}`)
  }
  return parts[topicsIdx + 1]
}

const topicsBySlug = new Map<string, TopicData>()

for (const [path, mod] of Object.entries(topicModules)) {
  const data = mod.default
  if (!isTopicData(data)) {
    throw new Error(
      `Ошибка валидации данных темы в файле: ${path}. Обязательные поля: slug (string), order (number), title (string), subtitle (string), description (string).`,
    )
  }
  topicsBySlug.set(extractTopicSlug(path), data)
}

const lessonsByTopic = new Map<string, LessonData[]>()

for (const [path, mod] of Object.entries(lessonModules)) {
  const data = mod.default
  if (!isLessonData(data)) {
    throw new Error(
      `Ошибка валидации данных урока в файле: ${path}. Обязательные поля: slug (string), order (number), title (string), cards (array).`,
    )
  }
  const topicSlug = extractTopicSlug(path)
  const list = lessonsByTopic.get(topicSlug) ?? []
  list.push(data)
  lessonsByTopic.set(topicSlug, list)
}

for (const lessons of lessonsByTopic.values()) {
  lessons.sort((a, b) => a.order - b.order)
}

for (const [slug, topic] of topicsBySlug.entries()) {
  topic.lessonCount = lessonsByTopic.get(slug)?.length ?? 0
}

const sortedTopics: TopicData[] = [...topicsBySlug.values()].sort(
  (a, b) => a.order - b.order,
)

/** All topics sorted by `order`, with `lessonCount` populated. */
export function getTopics(): TopicData[] {
  return [...sortedTopics]
}

/** Find a single topic by its slug. */
export function getTopicBySlug(slug: string): TopicData | undefined {
  return topicsBySlug.get(slug)
}

/** All lessons for a given topic, sorted by `order`. */
export function getLessonsForTopic(topicSlug: string): LessonData[] {
  return [...(lessonsByTopic.get(topicSlug) ?? [])]
}

/** Find a single lesson within a topic. */
export function getLessonBySlug(
  topicSlug: string,
  lessonSlug: string,
): LessonData | undefined {
  return lessonsByTopic.get(topicSlug)?.find((l) => l.slug === lessonSlug)
}

/** Get previous / next lessons relative to a given lesson within a topic. */
export function getAdjacentLessons(
  topicSlug: string,
  lessonSlug: string,
): { prev?: LessonData; next?: LessonData } {
  const lessons = lessonsByTopic.get(topicSlug)
  if (!lessons) return {}

  const idx = lessons.findIndex((l) => l.slug === lessonSlug)
  if (idx === -1) return {}

  return {
    prev: lessons[idx - 1],
    next: lessons[idx + 1],
  }
}
