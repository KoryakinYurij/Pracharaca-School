import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import * as matchers from 'vitest-axe/matchers'
import { axe } from 'vitest-axe'

// Import components to test
import { AnswerSection } from '../components/AnswerSection'
import {
  GoldDotList,
  BadgeList,
  GlossaryList,
  Callout,
  StepTimeline,
  PrincipleBlock,
  GiantQuote,
} from '../components/content'

// Extend expect with vitest-axe matchers
expect.extend(matchers)

describe('a11y audit', () => {
  it('AnswerSection has no a11y violations', async () => {
    // Provide a minimal valid section prop
    const section = { kind: 'summary' as const, body: 'Test body text' }
    const { container } = render(<AnswerSection section={section} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('GoldDotList has no a11y violations', async () => {
    const { container } = render(<GoldDotList items={['Item 1', 'Item 2']} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('BadgeList has no a11y violations', async () => {
    const { container } = render(<BadgeList items={['Step 1', 'Step 2']} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('GlossaryList has no a11y violations', async () => {
    const items = [{ term: 'Term', definition: 'Def' }]
    const { container } = render(<GlossaryList items={items} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Callout (all types) has no a11y violations', async () => {
    const { container: c1 } = render(
      <Callout type="insight" title="Insight">
        Content
      </Callout>
    )
    expect(await axe(c1)).toHaveNoViolations()

    const { container: c2 } = render(
      <Callout type="important" title="Important">
        Content
      </Callout>
    )
    expect(await axe(c2)).toHaveNoViolations()

    const { container: c3 } = render(
      <Callout type="warning" title="Warning">
        Content
      </Callout>
    )
    expect(await axe(c3)).toHaveNoViolations()
  })

  it('StepTimeline has no a11y violations', async () => {
    const steps = [
      { title: 'Step 1', content: 'Content 1' },
      { title: 'Step 2', content: 'Content 2' },
    ]
    const { container } = render(<StepTimeline steps={steps} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('PrincipleBlock has no a11y violations', async () => {
    const { container } = render(<PrincipleBlock>Principle text</PrincipleBlock>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('GiantQuote has no a11y violations', async () => {
    const { container } = render(
      <GiantQuote author="Author">Quote text</GiantQuote>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
