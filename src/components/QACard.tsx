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

  return (
    <article className="noble-card overflow-hidden">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((prev) => !prev)}
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
      </h3>

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
