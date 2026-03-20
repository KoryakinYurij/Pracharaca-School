import type { LessonData, TopicData } from '../content/types'
import { useParams } from 'react-router-dom'

/** Typed hook for topic routes. Returns the topic slug or undefined. */
export function useTopicSlug(): string | undefined {
  const { slug } = useParams<{ slug: string }>()
  return slug
}

/** Typed hook for lesson routes. Returns topic and lesson slugs. */
export function useLessonSlugs(): { topicSlug: string | undefined; lessonSlug: string | undefined } {
  const { slug = '', lessonSlug = '' } = useParams<{ slug?: string; lessonSlug?: string }>()
  return { topicSlug: slug || undefined, lessonSlug: lessonSlug || undefined }
}

/** Type guard to check if data is TopicData */
export function isTopicData(data: unknown): data is TopicData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'slug' in data &&
    'title' in data &&
    'order' in data
  )
}

/** Type guard to check if data is LessonData */
export function isLessonData(data: unknown): data is LessonData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'slug' in data &&
    'title' in data &&
    'order' in data &&
    'cards' in data
  )
}
