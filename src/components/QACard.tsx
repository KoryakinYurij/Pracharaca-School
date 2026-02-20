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
    <article
      className={clsx(
        'noble-card overflow-hidden transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        isOpen && 'border-gold/45 bg-panel/85 shadow-card',
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          'focus-ring flex w-full items-start gap-4 px-5 py-5 text-left transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-5 sm:px-6 sm:py-6',
          isOpen && 'bg-panel/40',
        )}
      >
        <span
          className={clsx(
            'mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-border/80 px-2 text-[0.7rem] font-semibold tracking-[0.18em] text-gold-dark/70 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            isOpen && 'border-gold/45 bg-gold/10 text-gold-dark',
          )}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="flex-1 font-display text-xl leading-tight text-graphite sm:text-2xl">{card.q}</span>

        <ChevronDown
          className={clsx(
            'mt-1 h-5 w-5 shrink-0 text-gold/70 transition-transform duration-300 motion-reduce:transition-none',
            isOpen && 'rotate-180 text-gold-dark/80',
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
          <div
            className={clsx(
              'space-y-3 border-t border-border/70 px-5 py-5 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transform-none motion-reduce:transition-none sm:px-6 sm:py-6',
              isOpen ? 'translate-y-0' : 'translate-y-2',
            )}
          >
            {card.a.map((section, sectionIndex) => (
              <AnswerSection key={`${section.kind}-${sectionIndex}`} section={section} />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
