import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
        staggerChildren: 0.04,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section aria-label="Темы" className="mx-auto max-w-7xl space-y-5 px-4 py-12 sm:px-6 lg:px-8">
      {import.meta.env.DEV && (
        <div className="mb-4">
          <Link
            to="/kitchen-sink"
            data-testid="dev-kitchen-link"
            className="inline-flex items-center gap-2 rounded-md bg-graphite/10 px-3 py-1.5 text-xs font-medium text-graphite/70 transition-colors hover:bg-graphite/20 hover:text-graphite"
          >
            <span>🔧 DEV: Kitchen Sink Demo</span>
          </Link>
        </div>
      )}

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
