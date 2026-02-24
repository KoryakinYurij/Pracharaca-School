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
import {
  renderSectionBody,
} from './answerRenderers'

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
    label: 'Выжимка',
    icon: Lightbulb,
    cardClassName: 'border-gold/20',
    isLegacyOnly: false,
  },
  details: {
    label: 'Детали',
    icon: ScrollText,
    cardClassName: 'border-border/60',
    isLegacyOnly: true,
  },
  steps: {
    label: 'Шаги',
    icon: CheckCircle2,
    cardClassName: 'border-border/60',
    isLegacyOnly: false,
  },
  example: {
    label: 'Пример',
    icon: BookText,
    cardClassName: 'border-gold/20',
    isLegacyOnly: false,
  },
  note: {
    label: 'Заметка',
    icon: BadgeInfo,
    cardClassName: 'border-border/40',
    isLegacyOnly: false,
  },
  warning: {
    label: 'Важно',
    icon: AlertTriangle,
    cardClassName: 'border-amber-600/30',
    isLegacyOnly: false,
  },
  quote: {
    label: 'Цитата',
    icon: Quote,
    cardClassName: 'border-gold/20',
    isLegacyOnly: false,
  },
  definition: {
    label: 'Определения',
    icon: BookText,
    cardClassName: 'border-gold/20',
    isLegacyOnly: false,
  },
  checklist: {
    label: 'Чеклист',
    icon: CheckCircle2,
    cardClassName: 'border-border/40',
    isLegacyOnly: false,
  },
  pitfalls: {
    label: 'Частые ошибки',
    icon: AlertTriangle,
    cardClassName: 'border-amber-600/30',
    isLegacyOnly: false,
  },
  dosdonts: {
    label: 'Делай / Не делай',
    icon: BadgeInfo,
    cardClassName: 'border-border/60',
    isLegacyOnly: true,
  },
  compare: {
    label: 'Сравнение',
    icon: ScrollText,
    cardClassName: 'border-border/60',
    isLegacyOnly: true,
  },
  mnemonic: {
    label: 'Запоминалка',
    icon: Lightbulb,
    cardClassName: 'border-gold/20',
    isLegacyOnly: false,
  },
  references: {
    label: 'Источники',
    icon: BookText,
    cardClassName: 'border-border/30',
    isLegacyOnly: false,
  },
}

export const AnswerSection = memo(function AnswerSection({ section }: AnswerSectionProps) {
  const meta = sectionMeta[section.kind]
  const Icon = meta.icon
  const iconColor = (section.kind === 'warning' || section.kind === 'pitfalls') ? 'text-amber-700/60' : 'text-gold/60'
  const isLegacy = section.migration?.rendererOrder?.[0] === 'legacy' || 
    (!section.migration && meta.isLegacyOnly)

  return (
    <section className={clsx('border-l-2 py-2 pl-4 sm:py-3 sm:pl-5', meta.cardClassName)}>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-graphite/60">
        <Icon className={clsx('h-4 w-4', iconColor)} aria-hidden="true" />
        <span>{section.title ?? meta.label}</span>
        {isLegacy && (
          <Clock className="ml-1 h-3 w-3 text-graphite/40" aria-label="Fallback rendering" />
        )}
      </div>
      {renderSectionBody(section)}
    </section>
  )
})
