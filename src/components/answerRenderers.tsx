import clsx from 'clsx'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { AnswerSectionData } from '../content/types'

export const EMPTY_STATE = 'Нет данных'

export function getText(section: AnswerSectionData) {
  return section.body?.trim() ?? ''
}

export function normalizeItems(items?: string[]) {
  return (items ?? []).map((item) => item.trim()).filter(Boolean)
}

export function splitBodyLines(body?: string) {
  return (body ?? '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function getSectionItems(section: AnswerSectionData) {
  const listFromItems = normalizeItems(section.items)
  if (listFromItems.length > 0) {
    return listFromItems
  }

  return splitBodyLines(section.body)
}

export function renderText(section: AnswerSectionData, className?: string) {
  const text = getText(section) || EMPTY_STATE
  return <p className={clsx('whitespace-pre-line text-sm text-graphite/85 sm:text-base', className)}>{text}</p>
}

export function renderSteps(section: AnswerSectionData) {
  const steps = section.items && section.items.length > 0 ? normalizeItems(section.items) : splitBodyLines(section.body)
  if (steps.length === 0) {
    return renderText(section)
  }

  return (
    <ol className="space-y-2">
      {steps.map((step, index) => (
        <li key={`${step}-${index}`} className="flex items-start gap-3 text-sm text-graphite/85 sm:text-base">
          <span className="text-xs font-medium text-graphite/50">
            {index + 1}
          </span>
          <span className="whitespace-pre-line">{step}</span>
        </li>
      ))}
    </ol>
  )
}

export function renderDefinition(section: AnswerSectionData) {
  const pairs = (section.pairs ?? [])
    .map((pair) => ({
      term: pair.term.trim(),
      desc: pair.desc.trim(),
    }))
    .filter((pair) => pair.term || pair.desc)

  if (pairs.length === 0) {
    return renderText(section)
  }

  return (
    <dl className="divide-y divide-border/70">
      {pairs.map((pair, index) => (
        <div key={`${pair.term}-${index}`} className="grid gap-1 py-2 sm:grid-cols-[minmax(0,220px),1fr] sm:gap-3">
          <dt className="font-display text-base text-graphite/90 sm:text-lg">{pair.term || `Термин ${index + 1}`}</dt>
          <dd className="text-sm leading-relaxed text-graphite/85 sm:text-base">{pair.desc || EMPTY_STATE}</dd>
        </div>
      ))}
    </dl>
  )
}

export function renderChecklist(section: AnswerSectionData) {
  const items = getSectionItems(section)
  if (items.length === 0) {
    return renderText(section)
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-start gap-2.5 text-sm text-graphite/85 sm:text-base">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" aria-hidden="true" />
          <span className="whitespace-pre-line">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function renderPitfalls(section: AnswerSectionData) {
  const items = getSectionItems(section)
  if (items.length === 0) {
    return renderText(section)
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-start gap-2.5 text-sm text-graphite/85 sm:text-base">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" aria-hidden="true" />
          <span className="whitespace-pre-line">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function renderColumns(
  columns: { title: string; items: string[] }[],
  className: string,
  columnClassName: string,
  titleClassName: string,
) {
  return (
    <div className={className}>
      {columns.map((column, index) => (
        <section key={`${column.title}-${index}`} className={columnClassName}>
          <h4 className={titleClassName}>{column.title || `Колонка ${index + 1}`}</h4>
          {column.items.length > 0 ? (
            <ul className="space-y-2">
              {column.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`} className="text-sm leading-relaxed text-graphite/85 sm:text-base">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-graphite/70 sm:text-base">{EMPTY_STATE}</p>
          )}
        </section>
      ))}
    </div>
  )
}

export function renderDosDonts(section: AnswerSectionData) {
  const columns = (section.columns ?? [])
    .map((column) => ({
      title: column.title.trim(),
      items: normalizeItems(column.items),
    }))
    .filter((column) => column.title || column.items.length > 0)

  if (columns.length === 0) {
    return renderText(section)
  }

  return renderColumns(
    columns,
    'grid grid-cols-1 gap-3 md:grid-cols-2',
    'rounded-lg border border-border/70 bg-ivory/70 p-3.5',
    'mb-2 font-display text-lg text-graphite/90',
  )
}

export function renderCompare(section: AnswerSectionData) {
  const table = section.table
  const tableHeaders = normalizeItems(table?.headers)
  const tableRows = (table?.rows ?? []).map((row) => row.map((cell) => cell.trim()))

  if (tableHeaders.length > 0 && tableRows.length > 0) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse break-words text-left text-sm text-graphite/85 sm:text-base">
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  key={`${header}-${index}`}
                  scope="col"
                  className="border-b border-border/80 px-3 py-2 font-semibold text-graphite/80"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="align-top">
                {tableHeaders.map((_, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`} className="border-b border-border/60 px-3 py-2">
                    {row[colIndex] || EMPTY_STATE}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const columns = (section.columns ?? [])
    .map((column) => ({
      title: column.title.trim(),
      items: normalizeItems(column.items),
    }))
    .filter((column) => column.title || column.items.length > 0)

  if (columns.length > 0) {
    return renderColumns(
      columns,
      'grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3',
      'rounded-lg border border-border/70 bg-ivory/60 p-3.5',
      'mb-2 font-display text-lg text-graphite/90',
    )
  }

  return renderText(section)
}

export function renderMnemonic(section: AnswerSectionData) {
  const text = getText(section) || EMPTY_STATE
  return (
    <div className="space-y-3">
      <p className="whitespace-pre-line font-display text-lg leading-relaxed text-graphite/90 sm:text-xl">{text}</p>
    </div>
  )
}

export function renderReferences(section: AnswerSectionData) {
  const items = getSectionItems(section)
  if (items.length === 0) {
    return renderText(section, 'text-xs text-graphite/75 sm:text-sm')
  }

  return (
    <ul className="space-y-1.5 text-xs leading-relaxed text-graphite/75 sm:text-sm">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-2">
          <span aria-hidden="true" className="text-gold/70">
            -
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
