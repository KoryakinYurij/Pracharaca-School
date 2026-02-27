import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GoldDotList, BadgeList, GlossaryList } from '../Lists'

describe('GoldDotList', () => {
  it('renders list items', () => {
    const items = ['Item 1', 'Item 2']
    render(<GoldDotList items={items} />)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('renders correctly with empty array', () => {
    const { container } = render(<GoldDotList items={[]} />)
    expect(container.firstChild).toBeInTheDocument()
    // It should just be an empty ul or similar
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })
})

describe('BadgeList', () => {
  it('renders numbered items', () => {
    const items = ['Step One', 'Step Two']
    render(<BadgeList items={items} />)
    expect(screen.getByText('Step One')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Step Two')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})

describe('GlossaryList', () => {
  it('renders term/definition pairs', () => {
    const items = [
      { term: 'Term A', definition: 'Def A' },
      { term: 'Term B', definition: 'Def B' },
    ]
    render(<GlossaryList items={items} />)
    expect(screen.getByText('Term A')).toBeInTheDocument()
    expect(screen.getByText('Def A')).toBeInTheDocument()
    expect(screen.getByText('Term B')).toBeInTheDocument()
    expect(screen.getByText('Def B')).toBeInTheDocument()
  })
})
