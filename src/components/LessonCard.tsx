import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LessonData } from '../content/types'

interface LessonCardProps {
  lesson: LessonData
  topicSlug: string
}

export function LessonCard({ lesson, topicSlug }: LessonCardProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article whileHover={prefersReducedMotion ? undefined : { y: -3 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/topic/${topicSlug}/lesson/${lesson.slug}`}
        className="focus-ring noble-card group block p-6 transition-shadow hover:shadow-card sm:p-7"
      >
        <span className="mb-2 block text-sm font-semibold text-gold-dark">
          {String(lesson.order).padStart(2, '0')}
        </span>

        <div className="flex min-w-0 items-start justify-between gap-4">
          <h2 className="min-w-0 break-words font-display text-2xl leading-tight text-graphite">{lesson.title}</h2>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 h-5 w-5 shrink-0 text-gold/65 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>

        {lesson.intro ? <p className="mt-4 text-sm text-graphite/75 sm:text-base">{lesson.intro}</p> : null}

        <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-graphite/70">{lesson.cards.length} карточек</p>
      </Link>
    </motion.article>
  )
}
