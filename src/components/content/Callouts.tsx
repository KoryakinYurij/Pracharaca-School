import { AlertCircle, Info, Lightbulb } from 'lucide-react'
import clsx from 'clsx'
import type { ReactNode } from 'react'

export type CalloutType = 'important' | 'warning' | 'insight'

export interface CalloutProps {
  type: CalloutType
  title?: string
  children: ReactNode
  icon?: ReactNode
  className?: string
}

export function Callout({ type, title, children, icon, className }: CalloutProps) {
  const styles = {
    important: 'border-l-4 border-gold bg-graphite text-ivory',
    warning: 'border-l-4 border-[#9c4221] bg-panel text-graphite',
    insight: 'border-l-4 border-gold bg-panel text-graphite',
  }

  const labels = {
    important: 'Важно',
    warning: 'Предупреждение',
    insight: 'На заметку',
  }[type]

  const DefaultIcon = {
    important: Info,
    warning: AlertCircle,
    insight: Lightbulb,
  }[type]

  const iconColor = {
    important: 'text-gold',
    warning: 'text-[#9c4221]',
    insight: 'text-gold',
  }[type]

  return (
    <div className={clsx('my-6 flex gap-4 rounded-r-lg p-6 shadow-sm', styles[type], className)}>
      <div className={clsx('flex-shrink-0 pt-1', iconColor)} aria-hidden="true">
        {icon || <DefaultIcon className="h-6 w-6" />}
      </div>
      <div className="flex-1">
        <span className="sr-only">{labels}:</span>
        {title && (
          <h4
            className={clsx(
              'mb-2 font-display text-lg font-bold',
              type === 'important' ? 'text-gold' : 'text-graphite',
            )}
          >
            {title}
          </h4>
        )}
        <div
          className={clsx(
            'font-body leading-relaxed',
            type === 'important' ? 'text-ivory/90' : 'text-graphite/90',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export interface MetaphorBlockProps {
  icon: ReactNode
  children: ReactNode
  className?: string
}

export function MetaphorBlock({ icon, children, className }: MetaphorBlockProps) {
  return (
    <div
      className={clsx(
        'my-8 grid grid-cols-1 items-center gap-6 rounded-xl2 bg-ivory p-8 shadow-card md:grid-cols-[auto_1fr]',
        className,
      )}
    >
      <div className="flex justify-center md:justify-start" aria-hidden="true">
        <div className="h-24 w-24 text-graphite/80 [&>svg]:h-full [&>svg]:w-full [&>svg]:stroke-1">
          {icon}
        </div>
      </div>
      <div className="border-l-0 border-gold/30 font-display italic leading-relaxed text-center text-xl text-graphite md:border-l-2 md:border-l-gold/30 md:pl-6 md:text-left">
        {children}
      </div>
    </div>
  )
}
