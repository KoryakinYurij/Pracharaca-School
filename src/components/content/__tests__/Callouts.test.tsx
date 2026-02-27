import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Callout } from '../Callouts'

describe('Callout', () => {
  it('renders insight type correctly', () => {
    render(
      <Callout type="insight" title="Insight Title">
        Insight Content
      </Callout>
    )
    expect(screen.getByText('Insight Title')).toBeInTheDocument()
    expect(screen.getByText('Insight Content')).toBeInTheDocument()
    // Insight uses specific styles (border-gold bg-panel)
    // We can check for a class or just that it renders without error.
    // The instructions say "Test Callout renders with type".
  })

  it('renders important type correctly', () => {
    render(
      <Callout type="important" title="Important Title">
        Important Content
      </Callout>
    )
    expect(screen.getByText('Important Title')).toBeInTheDocument()
    expect(screen.getByText('Important Content')).toBeInTheDocument()
  })

  it('renders warning type correctly', () => {
    render(
      <Callout type="warning" title="Warning Title">
        Warning Content
      </Callout>
    )
    expect(screen.getByText('Warning Title')).toBeInTheDocument()
    expect(screen.getByText('Warning Content')).toBeInTheDocument()
  })

  it('renders children text', () => {
    render(<Callout type="insight">Just content</Callout>)
    expect(screen.getByText('Just content')).toBeInTheDocument()
  })

  it('applies optional className', () => {
    const { container } = render(
      <Callout type="insight" className="custom-class">
        Content
      </Callout>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
