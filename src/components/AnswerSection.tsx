import clsx from 'clsx'
import { memo } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  BadgeInfo,
  BookText,
  CheckCircle2,
  Lightbulb,
  Quote,
  ScrollText,
} from 'lucide-react'
import type { AnswerKind, AnswerSectionData } from '../content/types'
import {
  EMPTY_STATE,
  getText,
  renderChecklist,
  renderCompare,
  renderDefinition,
  renderDosDonts,
  renderMnemonic,
  renderPitfalls,
  renderReferences,
  renderSteps,
  renderText,
} from './answerRenderers'

interface AnswerSectionProps {
  section: AnswerSectionData
}

interface SectionMeta {
  label: string
  icon: LucideIcon
  cardClassName: string
}

const sectionMeta: Record<AnswerKind, SectionMeta> = {
  summary: {
    label: 'Выжимка',
    icon: Lightbulb,
    cardClassName: 'border-gold/50',
  },
  details: {
    label: 'Детали',
    icon: ScrollText,
    cardClassName: 'border-border/80',
  },
  steps: {
    label: 'Шаги',
    icon: CheckCircle2,
    cardClassName: 'border-border/80',
  },
  example: {
    label: 'Пример',
    icon: BookText,
    cardClassName: 'border-gold/35',
  },
  note: {
    label: 'Заметка',
    icon: BadgeInfo,
    cardClassName: 'border-border/60',
  },
  warning: {
    label: 'Важно',
    icon: AlertTriangle,
    cardClassName: 'border-amber-600/50',
  },
  quote: {
    label: 'Цитата',
    icon: Quote,
    cardClassName: 'border-gold/50',
  },
  definition: {
    label: 'Определения',
    icon: BookText,
    cardClassName: 'border-border/80',
  },
  checklist: {
    label: 'Чеклист',
    icon: CheckCircle2,
    cardClassName: 'border-border/60',
  },
  pitfalls: {
    label: 'Частые ошибки',
    icon: AlertTriangle,
    cardClassName: 'border-amber-600/50',
  },
  dosdonts: {
    label: 'Делай / Не делай',
    icon: BadgeInfo,
    cardClassName: 'border-border/80',
  },
  compare: {
    label: 'Сравнение',
    icon: ScrollText,
    cardClassName: 'border-border/80',
  },
  mnemonic: {
    label: 'Запоминалка',
    icon: Lightbulb,
    cardClassName: 'border-gold/50',
  },
  references: {
    label: 'Источники',
    icon: BookText,
    cardClassName: 'border-border/50',
  },
}

function renderBodyByKind(section: AnswerSectionData) {
  switch (section.kind) {
    case 'steps':
      return renderSteps(section)
    case 'quote':
      return (
        <blockquote className="whitespace-pre-line border-l-2 border-gold/60 pl-4 font-display text-lg leading-relaxed text-graphite/85 sm:text-xl">
          {getText(section) || EMPTY_STATE}
        </blockquote>
      )
    case 'definition':
      return renderDefinition(section)
    case 'checklist':
      return renderChecklist(section)
    case 'pitfalls':
      return renderPitfalls(section)
    case 'dosdonts':
      return renderDosDonts(section)
    case 'compare':
      return renderCompare(section)
    case 'mnemonic':
      return renderMnemonic(section)
    case 'references':
      return renderReferences(section)
    default:
      return renderText(section)
  }
}

export const AnswerSection = memo(function AnswerSection({ section }: AnswerSectionProps) {
  const meta = sectionMeta[section.kind]
  const Icon = meta.icon
  const iconColor = (section.kind === 'warning' || section.kind === 'pitfalls') ? 'text-amber-700/70' : 'text-gold/80'

  return (
    <section className={clsx('border-l-2 py-2 pl-4 sm:py-3 sm:pl-5', meta.cardClassName)}>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-graphite/60">
        <Icon className={clsx('h-4 w-4', iconColor)} aria-hidden="true" />
        <span>{section.title ?? meta.label}</span>
      </div>
      {renderBodyByKind(section)}
    </section>
  )
})
