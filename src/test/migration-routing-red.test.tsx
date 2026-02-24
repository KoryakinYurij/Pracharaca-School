import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import App from '../App'
import { TopicPage } from '../pages/TopicPage'

function renderTopicPage(path = '/topic/krasivyi-konspekt') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/topic/:slug" element={<TopicPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('migration routing behavior', () => {
  it('shows DEV-only kitchen-sink entry on the topics listing page in development', () => {
    window.history.pushState({}, '', '/')
    render(<App />)

    const devKitchenLink = screen.getByTestId('dev-kitchen-link')
    expect(devKitchenLink).toBeInTheDocument()
    expect(devKitchenLink).toHaveAttribute('href', '/kitchen-sink')
  })

  it('shows explicit back navigation from topic page to topics listing', () => {
    renderTopicPage()

    const backLink = screen.getByRole('link', { name: /к темам/i })
    expect(backLink).toHaveAttribute('href', '/')
    expect(backLink).toHaveAttribute('data-testid', 'topic-back-to-topics')
  })

  it('keeps recovery navigation in unknown topic state', () => {
    renderTopicPage('/topic/unknown-slug')

    expect(screen.getByRole('heading', { name: 'Тема не найдена' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /на главную/i })).toHaveAttribute('href', '/')
  })
})
