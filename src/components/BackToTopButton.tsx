import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useState } from 'react'

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsVisible(latest > 400)
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="focus-ring fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-ivory/80 text-gold-dark shadow-soft backdrop-blur-[2px] transition-colors hover:bg-gold/10 sm:bottom-10 sm:right-10"
          aria-label="Вернуться наверх"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
