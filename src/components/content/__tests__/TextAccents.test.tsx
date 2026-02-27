import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GiantQuote, PrincipleBlock, ConceptCard } from '../TextAccents'

describe('GiantQuote', () => {
  it('renders children text', () => {
    render(<GiantQuote>A famous quote</GiantQuote>)
    expect(screen.getByText('A famous quote')).toBeInTheDocument()
  })

  it('renders optional author', () => {
    render(<GiantQuote author="Famous Author">Quote content</GiantQuote>)
    expect(screen.getByText('— Famous Author')).toBeInTheDocument()
  })
})

describe('PrincipleBlock', () => {
  it('renders children text with styling', () => {
    render(<PrincipleBlock>Principle text</PrincipleBlock>)
    expect(screen.getByText('Principle text')).toBeInTheDocument()
  })

  it('renders icon if provided', () => {
    // We can pass a dummy element as icon
    render(<PrincipleBlock icon={<span data-testid="test-icon" />}>Text</PrincipleBlock>)
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })
})

describe('ConceptCard', () => {
  it('renders title and children', () => {
    render(<ConceptCard title="Concept Title">Concept Body</ConceptCard>)
    expect(screen.getByText('Concept Title')).toBeInTheDocument()
    expect(screen.getByText('Concept Body')).toBeInTheDocument()
  })
})
