import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DividerOrnament } from '../components/DividerOrnament'
import { PrevNextNav } from '../components/PrevNextNav'
import { QACard } from '../components/QACard'
import { getAdjacentLessons, getLessonBySlug } from '../content/loader'
import { t } from '../locales'

export function LessonPage() {
  const prefersReducedMotion = useReducedMotion()
  const { slug = '', lessonSlug = '' } = useParams()
  const lesson = getLessonBySlug(slug, lessonSlug)

  if (!lesson) {
    return (
      <div className="noble-card p-8 text-center sm:p-10">
        <h1 className="font-display text-3xl text-graphite">{t('lesson.notFound')}</h1>
        <p className="mt-3 text-graphite/75">{t('lesson.notFoundHint')}</p>
        <Link
          to="/"
          className="focus-ring mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/45 bg-gold/10 px-5 py-2 text-sm font-medium text-gold-dark"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('lesson.backToTopics')}
        </Link>
      </div>
    )
  }

  const { prev, next } = getAdjacentLessons(slug, lesson.slug)

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="sticky top-3 z-20 w-fit sm:top-4">
        <Link
          to={`/topic/${slug}`}
          className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-border/90 bg-ivory/80 px-4 py-2 text-sm font-medium text-graphite/85 shadow-soft backdrop-blur-sm transition-colors hover:border-gold/60 hover:text-graphite"
        >
          <ArrowLeft className="h-4 w-4 text-gold/80" aria-hidden="true" />
          {t('lesson.backToLessons')}
        </Link>
      </div>

      <div className="rounded-2xl bg-ivory/80 px-5 pb-6 pt-5 backdrop-blur-sm sm:px-8 sm:pb-8 sm:pt-6">
        <header className="space-y-3 sm:space-y-4">
          <span className="inline-flex items-center rounded-full border border-gold/35 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">
            {t('lesson.lessonLabel')} {String(lesson.order).padStart(2, '0')}
          </span>

          <h1 className="display-heading-rhythm font-display text-4xl sm:text-5xl">{lesson.title}</h1>
          {lesson.intro ? <p className="max-w-3xl text-base text-graphite/80 sm:text-lg">{lesson.intro}</p> : null}
        </header>
      </div>

      <DividerOrnament />

      <section className="space-y-4 sm:space-y-5" aria-label={t('lesson.cardsAriaLabel')}>
        {lesson.cards.map((card, index) => (
          <motion.div
            key={`${card.q}-${index}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={prefersReducedMotion ? undefined : { once: true, amount: 0.2 }}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                  duration: 0.62,
                  ease: [0.22, 1, 0.36, 1],
                }
            }
          >
            <QACard card={card} index={index} />
          </motion.div>
        ))}
      </section>

      <PrevNextNav prev={prev} next={next} topicSlug={slug} />
    </div>
  )
}
