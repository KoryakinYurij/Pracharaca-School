import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LessonData } from '../content/types'
import { pluralizeRu } from '../utils/pluralize'

interface LessonCardProps {
  lesson: LessonData
  topicSlug: string
}

export function LessonCard({ lesson, topicSlug }: LessonCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const cardStateClasses = prefersReducedMotion
    ? 'hover:border-gold/60 hover:shadow-card focus-visible:border-gold/60 focus-visible:shadow-card'
    : 'transition-[border-color,box-shadow] duration-200 hover:border-gold/60 hover:shadow-card focus-visible:border-gold/60 focus-visible:shadow-card'
  const iconStateClasses = prefersReducedMotion
    ? ''
    : 'transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:scale-[1.04] group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:scale-[1.04]'

  return (
    <motion.article whileHover={prefersReducedMotion ? undefined : { y: -3 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/topic/${topicSlug}/lesson/${lesson.slug}`}
        className={clsx('focus-ring noble-card group block p-6 sm:p-7', cardStateClasses)}
      >
        <span className="mb-2 block text-sm font-semibold text-gold-dark">
          {String(lesson.order).padStart(2, '0')}
        </span>

        <div className="flex min-w-0 items-start justify-between gap-4">
          <h2 className="display-card-title-rhythm min-w-0 break-words font-display text-2xl text-graphite">{lesson.title}</h2>
          <ArrowUpRight
            aria-hidden="true"
            className={clsx('mt-1 h-5 w-5 shrink-0 text-gold/65', iconStateClasses)}
          />
        </div>

        {lesson.intro ? <p className="mt-4 text-base text-graphite/75">{lesson.intro}</p> : null}

        <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-graphite/70">{pluralizeRu(lesson.cards.length, ['карточка', 'карточки', 'карточек'])}</p>
      </Link>
    </motion.article>
  )
}
