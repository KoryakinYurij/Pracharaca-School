import React from 'react'
import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface StepItem {
  title?: string
  content: ReactNode
}

export interface StepTimelineProps {
  steps: StepItem[]
  className?: string
}

export function StepTimeline({ steps, className }: StepTimelineProps) {
  return (
    <ol role="list" className={clsx('relative ml-4 space-y-12 border-l-2 border-border/50 pl-8', className)}>
      {steps.map((step, index) => (
        <li key={step.title || `step-${index}`} className="relative group">
          <div className="absolute -left-[2.25rem] top-0 h-4 w-4 rounded-full border-2 border-gold bg-ivory transition-colors duration-300 group-hover:bg-gold" />

          <div className="relative overflow-hidden rounded-xl2 bg-ivory p-8 shadow-card transition-transform duration-300 hover:-translate-y-1">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-0 select-none text-[6rem] font-display font-bold leading-none text-graphite opacity-5"
            >
              {index + 1}
            </div>

            {step.title && (
              <h4 className="relative z-10 mb-4 font-display text-xl text-gold">{step.title}</h4>
            )}
            <div className="relative z-10 font-body leading-relaxed text-graphite/90">{step.content}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}

export interface FormulaPart {
  text: string
  caption?: string
}

export interface VisualFormulaProps {
  parts: FormulaPart[]
  className?: string
}

export function VisualFormula({ parts, className }: VisualFormulaProps) {
  return (
    <div className={clsx('flex flex-wrap items-end justify-center gap-4 py-8 md:gap-8', className)}>
      {parts.map((part, index) => (
        <React.Fragment key={`${part.text}-${index}`}>
          <div className="text-center group">
            <div className="font-display text-4xl text-gold md:text-5xl">{part.text}</div>
            {part.caption && (
              <div className="mt-2 border-t border-border pt-2 font-body text-xs uppercase tracking-widest text-graphite/60">
                {part.caption}
              </div>
            )}
          </div>
          {index < parts.length - 1 && (
            <div className="select-none pb-8 font-display text-2xl text-graphite/30 md:pb-10">+</div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export interface MetricItem {
  value: string | number
  unit?: string
  label: string
}

export interface MetricDashboardProps {
  metrics: MetricItem[]
  className?: string
}

export function MetricDashboard({ metrics, className }: MetricDashboardProps) {
  return (
    <div className={clsx('grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      {metrics.map((metric) => (
        <div
          key={`${metric.label}-${metric.value}`}
          className="rounded-xl2 border border-transparent bg-ivory p-8 text-center shadow-card transition-shadow duration-300 hover:border-gold/20"
        >
          <div className="font-display text-5xl text-graphite md:text-6xl">{metric.value}</div>
          {metric.unit && (
            <div className="mb-4 font-body text-sm font-bold uppercase tracking-widest text-gold">
              {metric.unit}
            </div>
          )}
          <div className="border-t border-border pt-4 font-body leading-relaxed text-graphite/80">
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  )
}
