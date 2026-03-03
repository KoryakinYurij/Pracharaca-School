import { describe, expect, it } from 'vitest'
import * as adapters from '../adapters'
import { SAFE_TEXT_FALLBACK } from '../adapters'

describe('adapters', () => {
  describe('normalizeText', () => {
    it('trims whitespace', () => {
      expect(adapters.normalizeText('  hello  ')).toBe('hello')
    })

    it('returns empty string for undefined', () => {
      expect(adapters.normalizeText(undefined)).toBe('')
    })

    it('returns empty string for whitespace only', () => {
      expect(adapters.normalizeText('   ')).toBe('')
    })
  })

  describe('toSafeText', () => {
    it('returns the text if valid', () => {
      expect(adapters.toSafeText('  hello  ')).toBe('hello')
    })

    it('returns SAFE_TEXT_FALLBACK if empty', () => {
      expect(adapters.toSafeText('   ')).toBe(SAFE_TEXT_FALLBACK)
    })

    it('returns SAFE_TEXT_FALLBACK if undefined', () => {
      expect(adapters.toSafeText(undefined)).toBe(SAFE_TEXT_FALLBACK)
    })
  })

  describe('normalizeStringItems', () => {
    it('trims and filters items', () => {
      expect(adapters.normalizeStringItems([' a ', ' ', 'b'])).toEqual(['a', 'b'])
    })

    it('returns empty array for undefined', () => {
      expect(adapters.normalizeStringItems(undefined)).toEqual([])
    })
  })

  describe('splitBodyLines', () => {
    it('splits by newlines and normalizes', () => {
      expect(adapters.splitBodyLines('line 1\n\nline 2')).toEqual(['line 1', 'line 2'])
    })

    it('returns empty array for empty input', () => {
      expect(adapters.splitBodyLines('')).toEqual([])
    })
  })

  describe('adaptBody', () => {
    it('returns normalized body if present', () => {
      expect(adapters.adaptBody({ body: ' test ' })).toBe('test')
    })

    it('returns SAFE_TEXT_FALLBACK if empty and safeFallback is true', () => {
      expect(adapters.adaptBody({ body: '' })).toBe(SAFE_TEXT_FALLBACK)
    })

    it('returns empty string if empty and safeFallback is false', () => {
      expect(adapters.adaptBody({ body: '' }, { safeFallback: false })).toBe('')
    })
  })

  describe('adaptItems', () => {
    it('returns normalized items if present', () => {
      expect(adapters.adaptItems({ items: [' a ', ' '] })).toEqual(['a'])
    })

    it('falls back to body lines if items are missing', () => {
      expect(adapters.adaptItems({ body: 'line 1\nline 2' })).toEqual(['line 1', 'line 2'])
    })

    it('returns [SAFE_TEXT_FALLBACK] if both empty and safeFallback is true', () => {
      expect(adapters.adaptItems({ items: [], body: '' })).toEqual([SAFE_TEXT_FALLBACK])
    })

    it('returns [] if both empty and safeFallback is false', () => {
      expect(adapters.adaptItems({ items: [], body: '' }, { safeFallback: false })).toEqual([])
    })
  })

  describe('normalizePairs', () => {
    it('normalizes pairs and filters empty ones', () => {
      expect(
        adapters.normalizePairs([
          { term: ' a ', desc: ' b ' },
          { term: ' ', desc: '' },
        ]),
      ).toEqual([{ term: 'a', desc: 'b' }])
    })
  })

  describe('adaptGlossaryProps', () => {
    it('maps pairs to glossary items', () => {
      const props = adapters.adaptGlossaryProps({ pairs: [{ term: 'a', desc: 'b' }] })
      expect(props.items).toEqual([{ term: 'a', definition: 'b' }])
    })

    it('provides fallbacks for partial pairs', () => {
      const props = adapters.adaptGlossaryProps({ pairs: [{ term: 'a', desc: '' }] })
      expect(props.items[0].definition).toBe(SAFE_TEXT_FALLBACK)
    })

    it('falls back to body if no pairs and safeFallback is true', () => {
      const props = adapters.adaptGlossaryProps({ body: 'test body' })
      expect(props.items[0].definition).toBe('test body')
    })
  })

  describe('adaptTimelineProps', () => {
    it('maps items to timeline steps', () => {
      const props = adapters.adaptTimelineProps({ items: ['step 1'] })
      expect(props.steps).toEqual([{ content: 'step 1' }])
    })
  })

  describe('normalizeColumns', () => {
    it('normalizes columns and filters empty ones', () => {
      expect(
        adapters.normalizeColumns([
          { title: ' t1 ', items: [' i1 '] },
          { title: ' ', items: [] },
        ]),
      ).toEqual([{ title: 't1', items: ['i1'] }])
    })
  })

  describe('adaptColumns', () => {
    it('maps columns and handles missing titles', () => {
      const props = adapters.adaptColumns({ columns: [{ title: '', items: ['i1'] }] })
      expect(props[0].title).toContain('1')
      expect(props[0].items).toEqual(['i1'])
    })

    it('falls back to body if no columns and safeFallback is true', () => {
      const props = adapters.adaptColumns({ body: 'body content' })
      expect(props[0].items).toEqual(['body content'])
    })
  })

  describe('normalizeTable', () => {
    it('normalizes table and fills missing cells with fallback', () => {
      const table = {
        headers: [' h1 ', ' h2 '],
        rows: [[' r1c1 ', ' '], [' ']],
      }
      const normalized = adapters.normalizeTable(table)
      expect(normalized?.headers).toEqual(['h1', 'h2'])
      expect(normalized?.rows[0]).toEqual(['r1c1', SAFE_TEXT_FALLBACK])
    })

    it('returns null if no data', () => {
      expect(adapters.normalizeTable({ headers: [], rows: [] })).toBeNull()
    })
  })

  describe('adaptTable', () => {
    it('returns normalized table if present', () => {
      const table = { headers: ['h1'], rows: [['r1']] }
      expect(adapters.adaptTable({ table }))?.toEqual(table)
    })

    it('falls back to body if no table and safeFallback is true', () => {
      const result = adapters.adaptTable({ body: 'body text' })
      expect(result?.headers).toEqual([expect.any(String)])
      expect(result?.rows[0]).toEqual(['body text'])
    })
  })
})
