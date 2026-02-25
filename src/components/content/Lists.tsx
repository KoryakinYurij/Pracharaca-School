import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface GoldDotListProps {
  items: ReactNode[]
  className?: string
}

export function GoldDotList({ items, className }: GoldDotListProps) {
  return (
    <ul role="list" className={clsx('space-y-4 font-body text-lg text-graphite', className)}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span aria-hidden="true" className="mt-1 mr-3 select-none text-2xl leading-none text-gold">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export interface BadgeListProps {
  items: ReactNode[]
  className?: string
}

export function BadgeList({ items, className }: BadgeListProps) {
  return (
    <ol role="list" className={clsx('space-y-6', className)}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-4">
          <div
            aria-hidden="true"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-graphite font-body text-sm font-bold text-ivory"
          >
            {index + 1}
          </div>
          <div className="font-body pt-1 text-lg leading-relaxed text-graphite">{item}</div>
        </li>
      ))}
    </ol>
  )
}

export interface GlossaryItem {
  term: string
  definition: ReactNode
}

export interface GlossaryListProps {
  items: GlossaryItem[]
  className?: string
}

export function GlossaryList({ items, className }: GlossaryListProps) {
  return (
    <dl className={clsx('space-y-4', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-lg bg-ivory p-6 shadow-card transition-shadow duration-300 hover:shadow-lg"
        >
          <dt className="mb-2 font-display text-xl font-semibold text-gold">{item.term}</dt>
          <dd className="font-body leading-relaxed text-graphite/80">{item.definition}</dd>
        </div>
      ))}
    </dl>
  )
}
