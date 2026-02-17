import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DividerOrnament } from '../components/DividerOrnament'
import { Header } from '../components/Header'
import { LessonCard } from '../components/LessonCard'
import { getLessonsForTopic, getTopicBySlug } from '../content/loader'

export function TopicPage() {
  const prefersReducedMotion = useReducedMotion()
  const { slug } = useParams()

  const topic = slug ? getTopicBySlug(slug) : undefined
  const lessons = slug ? getLessonsForTopic(slug) : []

  if (!topic) {
    return (
      <div className="noble-card p-8 text-center sm:p-10">
        <h1 className="font-display text-3xl text-graphite">Тема не найдена</h1>
        <p className="mt-3 text-graphite/75">Проверьте ссылку или вернитесь на главную.</p>
        <Link
          to="/"
          className="focus-ring mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/45 bg-gold/10 px-5 py-2 text-sm font-medium text-gold-dark"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          На главную
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-2xl bg-ivory/80 px-5 py-6 backdrop-blur-sm sm:px-8 sm:py-8">
        <Header subtitle={topic.subtitle} title={topic.title} description={topic.description} />
        <DividerOrnament />
      </div>

      <section aria-label="Список уроков" className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite/70">Уроки</p>

        <motion.div
          className="grid gap-4 sm:gap-5"
          initial="hidden"
          animate="show"
          variants={
            prefersReducedMotion
              ? undefined
              : {
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06 } },
                }
          }
        >
          {lessons.map((lesson) => (
            <motion.div
              key={lesson.slug}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.35 }}
            >
              <LessonCard lesson={lesson} topicSlug={slug!} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  )
}
