import type {
  AnswerColumnData,
  AnswerPairData,
  AnswerSectionData,
  AnswerTableData,
} from '../../content/types'
import type { StepTimelineProps } from './ComplexStructures'
import type { GlossaryListProps } from './Lists'
import { t } from '../../locales'

export const SAFE_TEXT_FALLBACK = t('fallback.noData')

export interface AdapterOptions {
  safeFallback?: boolean
}

export interface ComparisonColumn {
  title: string
  items: string[]
}

export interface ComparisonTable {
  headers: string[]
  rows: string[][]
}

const DEFAULT_OPTIONS: Required<AdapterOptions> = {
  safeFallback: true,
}

function resolveOptions(options?: AdapterOptions): Required<AdapterOptions> {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
  }
}

export function normalizeText(text?: string): string {
  return text?.trim() ?? ''
}

export function toSafeText(text?: string): string {
  const value = normalizeText(text)
  return value || SAFE_TEXT_FALLBACK
}

export function normalizeStringItems(items?: readonly string[]): string[] {
  return (items ?? []).map((item) => normalizeText(item)).filter(Boolean)
}

export function splitBodyLines(body?: string): string[] {
  return (body ?? '')
    .split(/\n+/)
    .map((item) => normalizeText(item))
    .filter(Boolean)
}

export function adaptBody(section: Pick<AnswerSectionData, 'body'>, options?: AdapterOptions): string {
  const text = normalizeText(section.body)
  if (text) {
    return text
  }

  if (resolveOptions(options).safeFallback) {
    return SAFE_TEXT_FALLBACK
  }

  return ''
}

export function adaptItems(section: Pick<AnswerSectionData, 'items' | 'body'>, options?: AdapterOptions): string[] {
  const fromItems = normalizeStringItems(section.items)
  const normalized = fromItems.length > 0 ? fromItems : splitBodyLines(section.body)
  if (normalized.length > 0) {
    return normalized
  }

  if (resolveOptions(options).safeFallback) {
    return [SAFE_TEXT_FALLBACK]
  }

  return []
}

export function normalizePairs(pairs?: AnswerPairData[]): AnswerPairData[] {
  if (!pairs) {
    return []
  }

  // Avoid chaining .map().filter() to prevent intermediate array allocations and redundant iterations
  const result: AnswerPairData[] = []
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i]
    const term = normalizeText(pair.term)
    const desc = normalizeText(pair.desc)

    if (term || desc) {
      result.push({ term, desc })
    }
  }

  return result
}

export function adaptGlossaryProps(
  section: Pick<AnswerSectionData, 'pairs' | 'body'>,
  options?: AdapterOptions,
): GlossaryListProps {
  const normalized = normalizePairs(section.pairs)
  if (normalized.length > 0) {
    return {
      items: normalized.map((pair, index) => ({
        term: pair.term || `${t('fallback.termN')} ${index + 1}`,
        definition: pair.desc || SAFE_TEXT_FALLBACK,
      })),
    }
  }

  if (!resolveOptions(options).safeFallback) {
    return { items: [] }
  }

  return {
    items: [
      {
        term: `${t('fallback.termN')} 1`,
        definition: toSafeText(section.body),
      },
    ],
  }
}

export function adaptTimelineProps(
  section: Pick<AnswerSectionData, 'items' | 'body'>,
  options?: AdapterOptions,
): StepTimelineProps {
  const steps = adaptItems(section, options).map((item): StepTimelineProps['steps'][number] => ({
    content: item,
  }))

  return { steps }
}

export function normalizeColumns(columns?: AnswerColumnData[]): ComparisonColumn[] {
  return (columns ?? [])
    .map((column) => ({
      title: normalizeText(column.title),
      items: normalizeStringItems(column.items),
    }))
    .filter((column) => column.title || column.items.length > 0)
}

export function adaptColumns(
  section: Pick<AnswerSectionData, 'columns' | 'body'>,
  options?: AdapterOptions,
): ComparisonColumn[] {
  const normalized = normalizeColumns(section.columns)
  if (normalized.length > 0) {
    return normalized.map((column, index) => ({
      title: column.title || `${t('fallback.columnN')} ${index + 1}`,
      items: column.items.length > 0 ? column.items : [SAFE_TEXT_FALLBACK],
    }))
  }

  if (!resolveOptions(options).safeFallback) {
    return []
  }

  return [
    {
      title: `${t('fallback.columnN')} 1`,
      items: [toSafeText(section.body)],
    },
  ]
}

function normalizeTableRows(rows: AnswerTableData['rows']): string[][] {
  // Avoid chaining .map().filter() to prevent intermediate array allocations and redundant iterations
  const result: string[][] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const newRow: string[] = []
    let hasContent = false

    for (let j = 0; j < row.length; j++) {
      const text = normalizeText(row[j])
      newRow.push(text)
      if (text) {
        hasContent = true
      }
    }

    if (hasContent) {
      result.push(newRow)
    }
  }

  return result
}

export function normalizeTable(table?: AnswerTableData): ComparisonTable | null {
  if (!table) {
    return null
  }

  const headers = normalizeStringItems(table.headers)
  const rows = normalizeTableRows(table.rows)
  if (headers.length === 0 || rows.length === 0) {
    return null
  }

  return {
    headers,
    rows: rows.map((row) => headers.map((_, index) => row[index] || SAFE_TEXT_FALLBACK)),
  }
}

export function adaptTable(
  section: Pick<AnswerSectionData, 'table' | 'body'>,
  options?: AdapterOptions,
): ComparisonTable | null {
  const normalized = normalizeTable(section.table)
  if (normalized) {
    return normalized
  }

  if (!resolveOptions(options).safeFallback) {
    return null
  }

  return {
    headers: [t('fallback.headerItem')],
    rows: [[toSafeText(section.body)]],
  }
}
