import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface GiantQuoteProps {
  children: ReactNode
  author?: string
  className?: string
}

export function GiantQuote({ children, author, className }: GiantQuoteProps) {
  return (
    <div className={clsx('relative overflow-hidden px-6 py-12 text-center', className)}>
      <div
        className="absolute left-1/2 top-0 select-none font-display text-[10rem] leading-none text-gold opacity-20 -translate-x-1/2"
        aria-hidden="true"
      >
        “
      </div>

      <blockquote className="relative z-10 mx-auto max-w-3xl">
        <div className="font-body text-2xl italic leading-relaxed text-graphite md:text-3xl">
          {children}
        </div>
        {author && (
          <footer className="mt-6 font-display text-lg tracking-wide text-gold">— {author}</footer>
        )}
      </blockquote>
    </div>
  )
}

export interface ConceptCardProps {
  title: string
  children: ReactNode
  className?: string
}

export function ConceptCard({ title, children, className }: ConceptCardProps) {
  return (
    <div className={clsx('mx-auto max-w-3xl rounded-xl2 bg-ivory p-8 text-center shadow-card md:p-12', className)}>
      <h3 className="mb-6 font-display text-3xl text-graphite">{title}</h3>
      <div className="font-body text-lg leading-relaxed text-graphite/90">{children}</div>
    </div>
  )
}

export interface PrincipleBlockProps {
  children: ReactNode
  icon?: ReactNode
  className?: string
}

export function PrincipleBlock({ children, icon, className }: PrincipleBlockProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-r-lg border-l-4 border-gold bg-panel p-6 md:p-8',
        className,
      )}
    >
      {icon && (
        <div aria-hidden="true" className="pointer-events-none absolute right-2 top-2 h-24 w-24 text-gold opacity-10 [&>svg]:h-full [&>svg]:w-full">
          {icon}
        </div>
      )}

      <div className="relative z-10 font-body pr-12 text-xl italic leading-relaxed text-graphite">
        {children}
      </div>
    </div>
  )
}
