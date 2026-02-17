import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useState } from 'react'

export function BackToTop() {
  const { scrollY } = useScroll()
  const [isVisible, setIsVisible] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  })

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="focus-ring fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-ivory shadow-soft transition-colors hover:border-gold/60 hover:text-gold-dark text-gold-dark/80 sm:bottom-8 sm:right-8"
          aria-label="Вернуться к началу"
          type="button"
        >
          <ArrowUp className="h-6 w-6" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
