import { describe, expect, it } from 'vitest'
import {
  SAFE_TEXT_FALLBACK,
  adaptBody,
  adaptColumns,
  adaptGlossaryProps,
  adaptItems,
  adaptTable,
  adaptTimelineProps,
} from '../components/content/adapters'

describe('migration adapter utilities', () => {
  it('adapts body text with deterministic safe fallback', () => {
    expect(adaptBody({ body: '  Важная мысль  ' })).toBe('Важная мысль')
    expect(adaptBody({ body: '   ' })).toBe(SAFE_TEXT_FALLBACK)
    expect(adaptBody({ body: '   ' }, { safeFallback: false })).toBe('')
  })

  it('adapts item sources from items first, then body lines', () => {
    expect(adaptItems({ items: ['  Первый  ', ' ', 'Второй'], body: 'Игнор' })).toEqual(['Первый', 'Второй'])
    expect(adaptItems({ body: 'Строка 1\n\n Строка 2 ' }, { safeFallback: false })).toEqual(['Строка 1', 'Строка 2'])
    expect(adaptItems({ body: '' })).toEqual([SAFE_TEXT_FALLBACK])
    expect(adaptItems({ body: '' }, { safeFallback: false })).toEqual([])
  })

  it('adapts glossary props from pairs with title/definition fallbacks', () => {
    const glossary = adaptGlossaryProps(
      {
        pairs: [
          { term: '  Термин  ', desc: '  Описание  ' },
          { term: ' ', desc: 'Только описание' },
        ],
        body: '',
      },
      { safeFallback: false },
    )

    expect(glossary.items).toEqual([
      { term: 'Термин', definition: 'Описание' },
      { term: 'Термин 2', definition: 'Только описание' },
    ])

    expect(adaptGlossaryProps({ body: 'Резервный текст' }).items).toEqual([
      { term: 'Термин 1', definition: 'Резервный текст' },
    ])
  })

  it('adapts timeline props from item primitives', () => {
    expect(adaptTimelineProps({ items: ['Шаг A', 'Шаг B'] }, { safeFallback: false })).toEqual({
      steps: [{ content: 'Шаг A' }, { content: 'Шаг B' }],
    })
  })

  it('adapts column and table primitives with safe structural fallbacks', () => {
    expect(
      adaptColumns(
        {
          columns: [
            { title: '  Делай  ', items: ['  Проверяй  ', ''] },
            { title: ' ', items: ['Избегай'] },
          ],
          body: '',
        },
        { safeFallback: false },
      ),
    ).toEqual([
      { title: 'Делай', items: ['Проверяй'] },
      { title: 'Колонка 2', items: ['Избегай'] },
    ])

    expect(adaptColumns({ body: '' })).toEqual([{ title: 'Колонка 1', items: [SAFE_TEXT_FALLBACK] }])

    expect(
      adaptTable(
        {
          table: {
            headers: [' Критерий ', ' Оценка '],
            rows: [
              [' Скорость ', ' Быстро '],
              [' Надежность ', ' '],
            ],
          },
          body: '',
        },
        { safeFallback: false },
      ),
    ).toEqual({
      headers: ['Критерий', 'Оценка'],
      rows: [
        ['Скорость', 'Быстро'],
        ['Надежность', SAFE_TEXT_FALLBACK],
      ],
    })

    expect(adaptTable({ body: '' })).toEqual({ headers: ['Пункт'], rows: [[SAFE_TEXT_FALLBACK]] })
    expect(adaptTable({ table: { headers: [' '], rows: [[' ']] }, body: '' }, { safeFallback: false })).toBeNull()
  })
})
