import type { LessonData, TopicData } from './types'
import { LessonDataSchema, TopicDataSchema } from './schemas'
import { t } from '../locales'

const topicModules = import.meta.glob<{ default: TopicData }>(
  '/content/topics/*/meta.json',
  { eager: false },
)

const lessonModules = import.meta.glob<{ default: LessonData }>(
  '/content/topics/*/lessons/*.json',
  { eager: false },
)

/** Extract topic slug from a glob-matched path, e.g.
 *  "/content/topics/krasivyi-konspekt/meta.json" → "krasivyi-konspekt"
 *  "/content/topics/krasivyi-konspekt/lessons/01-noble-basics.json" → "krasivyi-konspekt"
 */
function extractTopicSlug(filePath: string): string {
  const parts = filePath.split('/')
  const topicsIdx = parts.indexOf('topics')
  if (topicsIdx === -1 || topicsIdx + 1 >= parts.length) {
    throw new Error(`${t('loader.cantExtractSlug')}: ${filePath}`)
  }
  return parts[topicsIdx + 1]
}

// Cache for loaded data
let topicsBySlug: Map<string, TopicData> | null = null
let lessonsByTopic: Map<string, LessonData[]> | null = null
let loadPromise: Promise<void> | null = null

/** Initialize content data by loading all JSON files */
async function ensureLoaded(): Promise<void> {
  if (topicsBySlug && lessonsByTopic) return
  
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    topicsBySlug = new Map<string, TopicData>()
    lessonsByTopic = new Map<string, LessonData[]>()

    // Load topic metadata
    for (const [path, mod] of Object.entries(topicModules)) {
      const module = await mod()
      const result = TopicDataSchema.safeParse(module.default)
      if (!result.success) {
        const issues = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n')
        throw new Error(`${t('loader.topicValidationError')}: ${path}\n${issues}`)
      }
      topicsBySlug.set(extractTopicSlug(path), result.data)
    }

    // Load lesson data
    for (const [path, mod] of Object.entries(lessonModules)) {
      const module = await mod()
      const result = LessonDataSchema.safeParse(module.default)
      if (!result.success) {
        const issues = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n')
        throw new Error(`${t('loader.lessonValidationError')}: ${path}\n${issues}`)
      }
      const topicSlug = extractTopicSlug(path)
      const list = lessonsByTopic.get(topicSlug) ?? []
      list.push(result.data)
      lessonsByTopic.set(topicSlug, list)
    }

    // Sort lessons within each topic
    for (const lessons of lessonsByTopic.values()) {
      lessons.sort((a, b) => a.order - b.order)
    }

    // Populate lessonCount for topics
    for (const [slug, topic] of topicsBySlug.entries()) {
      topic.lessonCount = lessonsByTopic.get(slug)?.length ?? 0
    }
  })()

  return loadPromise
}

/** All topics sorted by `order`, with `lessonCount` populated. */
export async function getTopics(): Promise<TopicData[]> {
  await ensureLoaded()
  return [...(topicsBySlug!.values())].sort((a, b) => a.order - b.order)
}

/** Find a single topic by its slug. */
export async function getTopicBySlug(slug: string): Promise<TopicData | undefined> {
  await ensureLoaded()
  return topicsBySlug!.get(slug)
}

/** All lessons for a given topic, sorted by `order`. */
export async function getLessonsForTopic(topicSlug: string): Promise<LessonData[]> {
  await ensureLoaded()
  return [...(lessonsByTopic!.get(topicSlug) ?? [])]
}

/** Find a single lesson within a topic. */
export async function getLessonBySlug(
  topicSlug: string,
  lessonSlug: string,
): Promise<LessonData | undefined> {
  await ensureLoaded()
  return lessonsByTopic!.get(topicSlug)?.find((l) => l.slug === lessonSlug)
}

/** Get previous / next lessons relative to a given lesson within a topic. */
export async function getAdjacentLessons(
  topicSlug: string,
  lessonSlug: string,
): Promise<{ prev?: LessonData; next?: LessonData }> {
  await ensureLoaded()
  const lessons = lessonsByTopic!.get(topicSlug)
  if (!lessons) return {}

  const idx = lessons.findIndex((l) => l.slug === lessonSlug)
  if (idx === -1) return {}

  return {
    prev: lessons[idx - 1],
    next: lessons[idx + 1],
  }
}
