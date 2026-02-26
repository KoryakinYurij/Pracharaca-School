import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnswerSection } from '../components/AnswerSection'
import type { AnswerSectionData } from '../content/types'

function makeSection(overrides: Partial<AnswerSectionData>): AnswerSectionData {
  return {
    kind: 'summary',
    title: 'Суть',
    body: 'Базовый текст секции',
    ...overrides,
  }
}

describe('renderer routing (post-migration)', () => {
  it('renders summary sections through new callout renderer', () => {
    const section = makeSection({
      body: 'Эта секция должна идти через новый callout-рендерер.',
    })

    render(<AnswerSection section={section} />)

    const bodyText = screen.getByText('Эта секция должна идти через новый callout-рендерер.')
    expect(bodyText.closest('div.rounded-r-lg')).toBeInTheDocument()
  })

  it('renders details kind through new text renderer path', () => {
    const section = makeSection({
      kind: 'details',
      title: 'Детали',
      body: 'Этот блок должен рендериться как текст через новый путь.',
    })

    render(<AnswerSection section={section} />)

    const text = screen.getByText('Этот блок должен рендериться как текст через новый путь.')
    expect(text.tagName.toLowerCase()).toBe('p')
  })

  it('supports both new-rendered and legacy-rendered sections side by side', () => {
    const summarySection = makeSection({
      kind: 'summary',
      title: 'Новая секция',
      body: 'Новый путь: callout',
    })

    const compareSection = makeSection({
      kind: 'compare',
      title: 'Старый путь',
      table: {
        headers: ['Подход', 'Итог'],
        rows: [['Legacy', 'Стабильно']],
      },
    })

    render(
      <>
        <AnswerSection section={summarySection} />
        <AnswerSection section={compareSection} />
      </>,
    )

    const migratedText = screen.getByText('Новый путь: callout')
    expect(migratedText.closest('div.rounded-r-lg')).toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: 'Подход' })).toBeInTheDocument()
    expect(screen.getByText('Legacy')).toBeInTheDocument()
  })
})
