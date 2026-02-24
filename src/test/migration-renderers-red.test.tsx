import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnswerSection } from '../components/AnswerSection'
import type { AnswerSectionData } from '../content/types'

function makeSection(overrides: Partial<AnswerSectionData>): AnswerSectionData {
  return {
    kind: 'summary',
    title: 'Суть',
    body: 'Базовый текст секции',
    migration: {
      rendererOrder: ['new', 'legacy'],
      isKnownKind: true,
    },
    ...overrides,
  }
}

describe('migration renderer behavior', () => {
  it('renders summary sections through new callout renderer when order is new -> legacy', () => {
    const section = makeSection({
      body: 'Эта секция должна идти через новый callout-рендерер.',
      migration: {
        target: 'callout',
        rendererOrder: ['new', 'legacy'],
        isKnownKind: true,
      },
    })

    render(<AnswerSection section={section} />)

    const bodyText = screen.getByText('Эта секция должна идти через новый callout-рендерер.')
    expect(bodyText.closest('div.rounded-r-lg')).toBeInTheDocument()
  })

  it('keeps fallback rendering active when kind has no new renderer implementation', () => {
    const section = makeSection({
      kind: 'details',
      title: 'Детали',
      body: 'Этот блок должен рендериться через legacy fallback.',
      migration: {
        rendererOrder: ['new', 'legacy'],
        isKnownKind: true,
      },
    })

    render(<AnswerSection section={section} />)

    const fallbackText = screen.getByText('Этот блок должен рендериться через legacy fallback.')
    expect(fallbackText.tagName.toLowerCase()).toBe('p')
    expect(fallbackText.closest('div.rounded-r-lg')).not.toBeInTheDocument()
  })

  it('supports mixed migrated and fallback sections in one answer without dropping either path', () => {
    const migratedSummary = makeSection({
      kind: 'summary',
      title: 'Новая секция',
      body: 'Новый путь: callout',
      migration: {
        rendererOrder: ['new', 'legacy'],
        isKnownKind: true,
      },
    })

    const legacyCompare = makeSection({
      kind: 'compare',
      title: 'Старый путь',
      table: {
        headers: ['Подход', 'Итог'],
        rows: [['Legacy', 'Стабильно']],
      },
      migration: {
        rendererOrder: ['legacy'],
        isKnownKind: true,
      },
    })

    render(
      <>
        <AnswerSection section={migratedSummary} />
        <AnswerSection section={legacyCompare} />
      </>,
    )

    const migratedText = screen.getByText('Новый путь: callout')
    expect(migratedText.closest('div.rounded-r-lg')).toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Подход' })).toBeInTheDocument()
    expect(screen.getByText('Legacy')).toBeInTheDocument()
  })
})
