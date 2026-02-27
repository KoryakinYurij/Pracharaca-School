import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  StepTimeline,
  VisualFormula,
  MetricDashboard,
} from '../ComplexStructures'

describe('StepTimeline', () => {
  it('renders steps with title and content', () => {
    const steps = [
      { title: 'Step 1', content: 'Content 1' },
      { title: 'Step 2', content: 'Content 2' },
    ]
    render(<StepTimeline steps={steps} />)

    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.getByText('Step 2')).toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('renders with empty steps array', () => {
    const { container } = render(<StepTimeline steps={[]} />)
    // Should render the container but no steps
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.queryByText('Step 1')).not.toBeInTheDocument()
  })
})

describe('VisualFormula', () => {
  it('renders parts with text and captions', () => {
    const parts = [
      { text: 'A', caption: 'Part A' },
      { text: 'B', caption: 'Part B' },
    ]
    render(<VisualFormula parts={parts} />)

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('Part A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('Part B')).toBeInTheDocument()
    // It also renders a + sign between parts
    expect(screen.getByText('+')).toBeInTheDocument()
  })
})

describe('MetricDashboard', () => {
  it('renders metric value and label', () => {
    const metrics = [
      { value: '100', label: 'Metric 1', unit: 'kg' },
      { value: 200, label: 'Metric 2' },
    ]
    render(<MetricDashboard metrics={metrics} />)

    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('Metric 1')).toBeInTheDocument()
    expect(screen.getByText('kg')).toBeInTheDocument()

    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('Metric 2')).toBeInTheDocument()
  })
})
