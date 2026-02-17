import { motion, useReducedMotion } from 'framer-motion'
import { TopicCard } from '../components/TopicCard'
import { getTopics } from '../content/loader'

export function TopicsListingPage() {
  const prefersReducedMotion = useReducedMotion()
  const topics = getTopics().map((t) => ({
    ...t,
    lessonCount: t.lessonCount ?? 0,
  }))

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section aria-label="Темы" className="mx-auto max-w-7xl space-y-5 px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite/70">Темы</p>

      <motion.ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        variants={prefersReducedMotion ? undefined : container}
        initial="hidden"
        animate="show"
        role="list"
      >
        {topics.map((topic) => (
          <motion.li key={topic.slug} variants={item}>
            <TopicCard topic={topic} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
