import { act, render, screen } from '@testing-library/react'
import { useReducedMotion } from 'framer-motion'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LessonCard } from './LessonCard'
import { QACard } from './QACard'
import { TopicCard } from './TopicCard'

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')

  return {
    ...actual,
    useReducedMotion: vi.fn(),
  }
})

const mockedUseReducedMotion = vi.mocked(useReducedMotion)

const userEvent = {
  setup() {
    return {
      async click(element: HTMLElement) {
        await act(async () => {
          element.focus()
          element.click()
        })
      },
    }
  },
}

function getIconClassName(container: HTMLElement) {
  return container.querySelector('svg')?.getAttribute('class') ?? ''
}

describe('QACard', () => {
  const card = {
    q: 'Что такое аккордеон в интерфейсе?',
    a: [
      {
        kind: 'summary' as const,
        body: 'Аккордеон показывает ответ по запросу пользователя.',
      },
    ],
  }

  function renderCard() {
    render(<QACard card={card} index={0} />)
    const toggleButton = screen.getByRole('button', { name: /аккордеон в интерфейсе/i })
    const contentId = toggleButton.getAttribute('aria-controls')

    if (!contentId) {
      throw new Error('QACard button is missing aria-controls')
    }

    const contentRegion = document.getElementById(contentId)

    if (!contentRegion) {
      throw new Error(`QACard content with id ${contentId} was not rendered`)
    }

    return { toggleButton, contentRegion }
  }

  it('renders closed state with aria-expanded false', () => {
    const { toggleButton, contentRegion } = renderCard()

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(contentRegion).toHaveAttribute('data-open', 'false')
    expect(contentRegion.querySelector('.space-y-3')).toHaveClass('translate-y-2')
  })

  it('toggles to open state with aria-expanded true', async () => {
    const user = userEvent.setup()
    const { toggleButton, contentRegion } = renderCard()

    await user.click(toggleButton)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
    expect(contentRegion).toHaveAttribute('data-open', 'true')
  })

  it('shows answer content markers after toggle', async () => {
    const user = userEvent.setup()
    const { toggleButton, contentRegion } = renderCard()

    await user.click(toggleButton)

    expect(screen.getByText('Аккордеон показывает ответ по запросу пользователя.')).toBeInTheDocument()
    expect(contentRegion.querySelector('.space-y-3')).toHaveClass('translate-y-0')
  })
})

describe('TopicCard interaction states', () => {
  const topic = {
    slug: 'ui-history',
    order: 1,
    title: 'История интерфейсов',
    subtitle: 'Первые шаги',
    description: 'Как появились карточки и аккордеоны.',
    lessonCount: 4,
  }

  it('keeps transition classes when reduced-motion is not requested', () => {
    mockedUseReducedMotion.mockReturnValue(false)

    render(
      <MemoryRouter>
        <TopicCard topic={topic} />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /История интерфейсов/i })

    expect(link.getAttribute('class')).toContain('transition-[border-color,box-shadow]')
    expect(getIconClassName(link)).toContain('transition-transform')
  })

  it('uses reduced-motion fallback by removing transition classes', () => {
    mockedUseReducedMotion.mockReturnValue(true)

    render(
      <MemoryRouter>
        <TopicCard topic={topic} />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /История интерфейсов/i })

    expect(link.getAttribute('class')).not.toContain('transition-[border-color,box-shadow]')
    expect(getIconClassName(link)).not.toContain('transition-transform')
  })
})

describe('LessonCard interaction states', () => {
  const lesson = {
    slug: 'motion-basics',
    order: 1,
    title: 'Базовая анимация',
    intro: 'Краткий обзор эффектов для карточек.',
    cards: [
      {
        q: 'Тестовый вопрос',
        a: [
          {
            kind: 'summary' as const,
            body: 'Тестовый ответ',
          },
        ],
      },
    ],
  }

  beforeEach(() => {
    mockedUseReducedMotion.mockReturnValue(false)
  })

  it('keeps hover/focus transition classes when motion is allowed', () => {
    render(
      <MemoryRouter>
        <LessonCard lesson={lesson} topicSlug="ui-history" />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /Базовая анимация/i })

    expect(link.getAttribute('class')).toContain('transition-[border-color,box-shadow]')
    expect(getIconClassName(link)).toContain('transition-transform')
  })

  it('removes transition classes when reduced motion is preferred', () => {
    mockedUseReducedMotion.mockReturnValue(true)

    render(
      <MemoryRouter>
        <LessonCard lesson={lesson} topicSlug="ui-history" />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /Базовая анимация/i })

    expect(link.getAttribute('class')).not.toContain('transition-[border-color,box-shadow]')
    expect(getIconClassName(link)).not.toContain('transition-transform')
  })
})
