import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface HeroBannerProps {
  title: string
  overline?: string
  children?: ReactNode
  backgroundImage?: string
  className?: string
}

export function HeroBanner({
  title,
  overline,
  children,
  backgroundImage,
  className,
}: HeroBannerProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl2 bg-graphite p-12 text-center md:p-16',
        className,
      )}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <div className="relative z-10 mx-auto max-w-4xl">
        {overline && (
          <div className="mb-6 font-body text-sm font-semibold uppercase tracking-widest text-gold">
            {overline}
          </div>
        )}
        <h1 className="mb-8 font-display text-4xl leading-tight text-ivory md:text-6xl">
          {title}
        </h1>
        {children && (
          <div className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-ivory/80 md:text-xl">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export interface IconBackgroundCardProps {
  icon: ReactNode
  children: ReactNode
  className?: string
}

export function IconBackgroundCard({ icon, children, className }: IconBackgroundCardProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl2 bg-ivory p-8 shadow-card md:p-12',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 text-gold opacity-5 [&>svg]:h-full [&>svg]:w-full"
      >
        {icon}
      </div>

      <div className="relative z-10 font-body leading-relaxed text-graphite">{children}</div>
    </div>
  )
}

export interface QAPillProps {
  question: string
  answer: string
  className?: string
}

export function QAPill({ question, answer, className }: QAPillProps) {
  return (
    <div
      className={clsx(
        'inline-flex cursor-default items-center gap-3 rounded-full border border-border/50 bg-panel px-5 py-2 shadow-sm transition-colors hover:border-gold/50',
        className,
      )}
    >
      <span className="font-display text-sm font-semibold text-graphite">{question}</span>
      <span aria-hidden="true" className="h-4 w-px bg-border/50" />
      <span className="font-body text-sm text-graphite/80">{answer}</span>
    </div>
  )
}
