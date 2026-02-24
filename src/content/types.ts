export type AnswerKind =
  | 'summary'
  | 'details'
  | 'steps'
  | 'example'
  | 'note'
  | 'warning'
  | 'quote'
  | 'definition'
  | 'checklist'
  | 'pitfalls'
  | 'dosdonts'
  | 'compare'
  | 'mnemonic'
  | 'references'

export interface AnswerPairData {
  term: string
  desc: string
}

export interface AnswerColumnData {
  title: string
  items: string[]
}

export interface AnswerTableData {
  headers: string[]
  rows: string[][]
}

export type MigrationRendererEngine = 'new' | 'legacy'

export type MigrationDeprecationStatus = 'active' | 'overlap-legacy'

export interface AnswerSectionMigrationMetadata {
  target?: string
  rendererOrder?: readonly MigrationRendererEngine[]
  isKnownKind?: boolean
  deprecationStatus?: MigrationDeprecationStatus
  legacyPattern?: string
  wave?: string
  note?: string
}

export interface AnswerSectionData {
  kind: AnswerKind
  title?: string
  body?: string
  items?: string[]
  pairs?: AnswerPairData[]
  columns?: AnswerColumnData[]
  table?: AnswerTableData
  variant?: string
  visualHint?: string
  author?: string
  migration?: AnswerSectionMigrationMetadata
}

export interface QACardData {
  q: string
  a: AnswerSectionData[]
}

export interface LessonData {
  slug: string
  order: number
  title: string
  intro?: string
  cards: QACardData[]
}

export interface TopicData {
  slug: string
  order: number
  title: string
  subtitle: string
  description: string
  lessonCount?: number
}
