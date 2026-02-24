import clsx from 'clsx'
import type { ReactNode } from 'react'
import type { AnswerSectionData } from '../content/types'
import { resolveMigrationStrategy } from '../content/migrationMap'
import {
  BadgeList,
  Callout,
  GiantQuote,
  GlossaryList,
  GoldDotList,
  PrincipleBlock,
  adaptBody,
  adaptGlossaryProps,
  adaptItems,
} from './content'

export const EMPTY_STATE = 'Нет данных'

export function getText(section: AnswerSectionData) {
  return section.body?.trim() ?? ''
}

export function normalizeItems(items?: string[]) {
  return (items ?? []).map((item) => item.trim()).filter(Boolean)
}

export function renderText(section: AnswerSectionData, className?: string) {
  const text = getText(section) || EMPTY_STATE
  return <p className={clsx('whitespace-pre-line text-sm text-graphite/85 sm:text-base', className)}>{text}</p>
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
        <section key={`${column.title}-${column.items.join('|')}`} className={columnClassName}>
          <h4 className={titleClassName}>{column.title || `Колонка ${index + 1}`}</h4>
          {column.items.length > 0 ? (
            <ul className="space-y-2">
              {column.items.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-graphite/85 sm:text-base">
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
  const safeRows = tableRows.map((row) =>
    tableHeaders.map((header, colIndex) => ({
      header,
      value: row[colIndex] || EMPTY_STATE,
    })),
  )

  if (tableHeaders.length > 0 && tableRows.length > 0) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse break-words text-left text-sm text-graphite/85 sm:text-base">
          <thead>
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="border-b border-border/80 px-3 py-2 font-semibold text-graphite/80"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeRows.map((row) => (
              <tr key={row.map((cell) => `${cell.header}:${cell.value}`).join('|')} className="align-top">
                {row.map((cell) => (
                  <td key={`${cell.header}-${cell.value}`} className="border-b border-border/60 px-3 py-2">
                    {cell.value}
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

function renderCallout(section: AnswerSectionData, type: 'insight' | 'important' | 'warning') {
  const text = adaptBody(section)
  return (
    <Callout type={type} className="my-0 p-4 sm:p-5">
      <p className="whitespace-pre-line text-sm leading-relaxed sm:text-base">{text}</p>
    </Callout>
  )
}

function renderNewChecklist(section: AnswerSectionData) {
  const items = adaptItems(section)
  return <GoldDotList items={items} className="space-y-2 text-base text-graphite/85" />
}

function renderNewDefinition(section: AnswerSectionData) {
  const glossaryProps = adaptGlossaryProps(section)
  return <GlossaryList {...glossaryProps} className="space-y-3" />
}

function renderNewSteps(section: AnswerSectionData) {
  const items = adaptItems(section)
  return <BadgeList items={items} className="space-y-4" />
}

function renderNewPitfalls(section: AnswerSectionData) {
  const items = adaptItems(section)
  return (
    <Callout type="warning" className="my-0 p-4 sm:p-5">
      <GoldDotList items={items} className="space-y-2 text-base text-graphite/85" />
    </Callout>
  )
}

function renderNewMnemonic(section: AnswerSectionData) {
  return <PrincipleBlock>{adaptBody(section)}</PrincipleBlock>
}

function renderNewReferences(section: AnswerSectionData) {
  const items = adaptItems(section)
  return <GoldDotList items={items} className="space-y-2 text-sm text-graphite/75" />
}

function renderNewQuote(section: AnswerSectionData) {
  return <GiantQuote author={section.author}>{adaptBody(section)}</GiantQuote>
}

function renderNewByKind(section: AnswerSectionData): ReactNode | null {
  switch (section.kind) {
    case 'summary':
      return renderCallout(section, 'insight')
    case 'example':
      return renderCallout(section, 'important')
    case 'note':
      return renderCallout(section, 'insight')
    case 'warning':
      return renderCallout(section, 'warning')
    case 'steps':
      return renderNewSteps(section)
    case 'quote':
      return renderNewQuote(section)
    case 'definition':
      return renderNewDefinition(section)
    case 'checklist':
      return renderNewChecklist(section)
    case 'pitfalls':
      return renderNewPitfalls(section)
    case 'mnemonic':
      return renderNewMnemonic(section)
    case 'references':
      return renderNewReferences(section)
    default:
      return null
  }
}

export function renderLegacyByKind(section: AnswerSectionData): ReactNode {
  switch (section.kind) {
    case 'dosdonts':
      return renderDosDonts(section)
    case 'compare':
      return renderCompare(section)
    default:
      return renderText(section)
  }
}

export function renderSectionBody(section: AnswerSectionData): ReactNode {
  const order = section.migration?.rendererOrder ?? resolveMigrationStrategy(section.kind).rendererOrder
  for (const renderer of order) {
    if (renderer === 'new') {
      const content = renderNewByKind(section)
      if (content) {
        return content
      }
      continue
    }

    if (renderer === 'legacy') {
      return renderLegacyByKind(section)
    }
  }

  return renderLegacyByKind(section)
}
