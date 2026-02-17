import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DividerOrnament } from '../components/DividerOrnament'
import { PrevNextNav } from '../components/PrevNextNav'
import { QACard } from '../components/QACard'
import { getAdjacentLessons, getLessonBySlug } from '../content/loader'

export function LessonPage() {
  const { slug = '', lessonSlug = '' } = useParams()
  const lesson = getLessonBySlug(slug, lessonSlug)

  if (!lesson) {
    return (
      <div className="noble-card p-8 text-center sm:p-10">
        <h1 className="font-display text-3xl text-graphite">Урок не найден</h1>
        <p className="mt-3 text-graphite/75">Проверьте ссылку или вернитесь к списку уроков.</p>
        <Link
          to="/"
          className="focus-ring mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/45 bg-gold/10 px-5 py-2 text-sm font-medium text-gold-dark"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          К темам
        </Link>
      </div>
    )
  }

  const { prev, next } = getAdjacentLessons(slug, lesson.slug)

  return (
    <>
      <div className="rounded-2xl bg-ivory/80 px-5 py-6 backdrop-blur-sm sm:px-8 sm:py-8">
        <Link
          to={`/topic/${slug}`}
          className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-border/90 bg-ivory/80 px-4 py-2 text-sm text-graphite/80 backdrop-blur-[2px] transition-colors hover:border-gold/60 hover:text-graphite"
        >
          <ArrowLeft className="h-4 w-4 text-gold/80" aria-hidden="true" />
          К урокам
        </Link>

        <header className="mt-6 space-y-4 sm:mt-8">
          <span className="inline-flex items-center rounded-full border border-gold/35 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">
            Урок {String(lesson.order).padStart(2, '0')}
          </span>

          <h1 className="font-display text-4xl leading-tight sm:text-5xl">{lesson.title}</h1>
          {lesson.intro ? <p className="max-w-3xl text-graphite/80 sm:text-lg">{lesson.intro}</p> : null}
        </header>
      </div>

      <DividerOrnament />

      <section className="space-y-4 sm:space-y-5" aria-label="Карточки вопрос-ответ">
        {lesson.cards.map((card, index) => (
          <QACard key={`${card.q}-${index}`} card={card} index={index} />
        ))}
      </section>

      <PrevNextNav prev={prev} next={next} topicSlug={slug} />
    </>
  )
}
