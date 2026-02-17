import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LessonData } from '../content/types'

interface PrevNextNavProps {
  prev?: LessonData
  next?: LessonData
  topicSlug: string
}

export function PrevNextNav({ prev, next, topicSlug }: PrevNextNavProps) {
  return (
    <nav className="mt-16 grid gap-3 border-t border-border/80 pt-6 sm:grid-cols-2 sm:gap-4" aria-label="Навигация по урокам">
      {prev ? (
        <Link
          to={`/topic/${topicSlug}/lesson/${prev.slug}`}
          className="focus-ring group flex items-center gap-3 rounded-xl border border-border/60 bg-ivory/60 px-4 py-3 text-sm text-graphite/85 backdrop-blur-[2px] transition-all hover:border-gold/50"
        >
          <ArrowLeft className="h-4 w-4 text-gold/80" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-xs uppercase tracking-[0.12em] text-graphite/70">Предыдущий</span>
            <span className="font-medium">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          to={`/topic/${topicSlug}/lesson/${next.slug}`}
          className="focus-ring group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-ivory/60 px-4 py-3 text-sm text-graphite/85 backdrop-blur-[2px] transition-all hover:border-gold/50"
        >
          <span className="min-w-0">
            <span className="block text-xs uppercase tracking-[0.12em] text-graphite/70">Следующий</span>
            <span className="font-medium">{next.title}</span>
          </span>
          <ArrowRight className="h-4 w-4 text-gold/80" aria-hidden="true" />
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  )
}
