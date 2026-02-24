import { describe, expect, it } from 'vitest'
import { MIGRATION_MAP, resolveMigrationStrategy } from '../content/migrationMap'
import type { AnswerKind } from '../content/types'

const ANSWER_KINDS: AnswerKind[] = [
  'summary',
  'details',
  'steps',
  'example',
  'note',
  'warning',
  'quote',
  'definition',
  'checklist',
  'pitfalls',
  'dosdonts',
  'compare',
  'mnemonic',
  'references',
]

describe('migration map coverage', () => {
  it('covers every supported answer kind', () => {
    expect(Object.keys(MIGRATION_MAP).sort()).toEqual([...ANSWER_KINDS].sort())
  })

  it('resolves known kinds as new-then-legacy compatibility', () => {
    for (const kind of ANSWER_KINDS) {
      expect(resolveMigrationStrategy(kind)).toMatchObject({
        kind,
        isKnownKind: true,
        rendererOrder: ['new', 'legacy'],
      })
    }
  })

  it('resolves unknown kinds to legacy-only fallback strategy', () => {
    expect(resolveMigrationStrategy('experimental-kind')).toMatchObject({
      kind: 'experimental-kind',
      isKnownKind: false,
      rendererOrder: ['legacy'],
      target: 'paragraph',
    })
  })
})
