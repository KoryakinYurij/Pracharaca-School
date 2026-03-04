import clsx from 'clsx'
import { memo } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  BadgeInfo,
  BookText,
  CheckCircle2,
  Clock,
  Lightbulb,
  Quote,
  ScrollText,
} from 'lucide-react'
import type { AnswerKind, AnswerSectionData } from '../content/types'
import { t } from '../locales'
import {
  renderSectionBody,
} from './answerRenderers'
import { ErrorBoundary } from './ErrorBoundary'

interface AnswerSectionProps {
  section: AnswerSectionData
}

interface SectionMeta {
  label: string
  icon: LucideIcon
  cardClassName: string
  isLegacyOnly: boolean
}

const sectionMeta: Record<AnswerKind, SectionMeta> = {
  // New-rendered kinds (use rich inner components with their own styling)
  summary: {
    label: t('section.summary'),
    icon: Lightbulb,
    cardClassName: 'border-gold/20',
    isLegacyOnly: false,
  },
  details: {
    label: t('section.details'),
    icon: ScrollText,
    cardClassName: 'border-border/60',
    isLegacyOnly: true,
  },
  steps: {
    label: t('section.steps'),
    icon: CheckCircle2,
    cardClassName: 'border-border/60',
    isLegacyOnly: false,
  },
  example: {
    label: t('section.example'),
    icon: BookText,
    cardClassName: 'border-gold/20',
    isLegacyOnly: false,
  },
  note: {
    label: t('section.note'),
    icon: BadgeInfo,
    cardClassName: 'border-border/40',
    isLegacyOnly: false,
  },
  warning: {
    label: t('section.warning'),
    icon: AlertTriangle,
    cardClassName: 'border-amber-600/30',
    isLegacyOnly: false,
  },
  quote: {
    label: t('section.quote'),
    icon: Quote,
    cardClassName: 'border-gold/20',
    isLegacyOnly: false,
  },
  definition: {
    label: t('section.definition'),
    icon: BookText,
    cardClassName: 'border-gold/20',
    isLegacyOnly: false,
  },
  checklist: {
    label: t('section.checklist'),
    icon: CheckCircle2,
    cardClassName: 'border-border/40',
    isLegacyOnly: false,
  },
  pitfalls: {
    label: t('section.pitfalls'),
    icon: AlertTriangle,
    cardClassName: 'border-amber-600/30',
    isLegacyOnly: false,
  },
  dosdonts: {
    label: t('section.dosdonts'),
    icon: BadgeInfo,
    cardClassName: 'border-border/60',
    isLegacyOnly: true,
  },
  compare: {
    label: t('section.compare'),
    icon: ScrollText,
    cardClassName: 'border-border/60',
    isLegacyOnly: true,
  },
  mnemonic: {
    label: t('section.mnemonic'),
    icon: Lightbulb,
    cardClassName: 'border-gold/20',
    isLegacyOnly: false,
  },
  references: {
    label: t('section.references'),
    icon: BookText,
    cardClassName: 'border-border/30',
    isLegacyOnly: false,
  },
}

export const AnswerSection = memo(function AnswerSection({ section }: AnswerSectionProps) {
  const meta = sectionMeta[section.kind]
  const Icon = meta.icon
  const iconColor = (section.kind === 'warning' || section.kind === 'pitfalls') ? 'text-amber-700/60' : 'text-gold/60'
  const isLegacy = meta.isLegacyOnly

  return (
    <section className={clsx('border-l-2 py-2 pl-4 sm:py-3 sm:pl-5', meta.cardClassName)}>
      <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-graphite/60">
        <Icon className={clsx('h-4 w-4', iconColor)} aria-hidden="true" />
        <span>{section.title ?? meta.label}</span>
        {isLegacy && (
          <>
            <Clock className="ml-1 h-3 w-3 text-graphite/40" aria-hidden="true" />
            <span className="sr-only">Legacy format</span>
          </>
        )}
      </h4>
      <ErrorBoundary variant="inline">
        {renderSectionBody(section)}
      </ErrorBoundary>
    </section>
  )
})
