import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import type { QACardData } from '../content/types'
import { AnswerSection } from './AnswerSection'

interface QACardProps {
  card: QACardData
  index: number
}

export function QACard({ card, index }: QACardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const contentId = useId()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const key = e.key
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return

    e.preventDefault()

    const trigger = e.currentTarget
    const container = trigger.closest('section')
    if (!container) return

    const triggers = Array.from(container.querySelectorAll<HTMLButtonElement>('button[data-qa-trigger]'))
    const currentIndex = triggers.indexOf(trigger)

    if (currentIndex === -1) return

    let nextIndex = currentIndex

    switch (key) {
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % triggers.length
        break
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = triggers.length - 1
        break
    }

    triggers[nextIndex]?.focus()
  }

  return (
    <article className="noble-card overflow-hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        data-qa-trigger
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className="focus-ring flex w-full items-start gap-4 px-5 py-5 text-left sm:gap-5 sm:px-6 sm:py-6"
      >
        <span className="text-sm font-semibold text-gold-dark/70">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="flex-1 font-display text-xl leading-tight text-graphite sm:text-2xl">{card.q}</span>

        <ChevronDown
          className={clsx(
            'mt-1 h-5 w-5 shrink-0 text-gold/70 transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id={contentId}
        className="accordion-content"
        data-open={isOpen}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-border/70 px-5 py-5 sm:px-6 sm:py-6">
            {card.a.map((section, sectionIndex) => (
              <AnswerSection key={`${section.kind}-${sectionIndex}`} section={section} />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
