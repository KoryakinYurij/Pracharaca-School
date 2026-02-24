import React from 'react';
import { BookOpen, Feather, Scale } from 'lucide-react';
import {
  HeroBanner,
  IconBackgroundCard,
  QAPill,
  GiantQuote,
  ConceptCard,
  PrincipleBlock,
  GoldDotList,
  BadgeList,
  GlossaryList,
  Callout,
  MetaphorBlock,
  StepTimeline,
  VisualFormula,
  MetricDashboard,
} from '../components/content';

export const ContentKitchenSink: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-24">

      {/* ---------------------------------------------------------------------- */}
      {/* Section: Decorative / Hero */}
      {/* ---------------------------------------------------------------------- */}
      <section className="space-y-8">
        <h2 className="font-display text-2xl text-gold border-b border-border pb-2">
          0. Hero & Decorative
        </h2>

        <HeroBanner
          title="The Noble Design System"
          overline="Visual Philosophy"
        >
          An exploration of typography, spacing, and elegance in digital education content.
        </HeroBanner>

        <div className="flex flex-wrap gap-4">
          <QAPill question="Style" answer="Minimalist" />
          <QAPill question="Tone" answer="Academic" />
          <QAPill question="Font" answer="Playfair Display" />
        </div>

        <IconBackgroundCard icon={<Feather />}>
          <h3 className="font-display text-2xl mb-4">Background Icon Card</h3>
          <p>
            This card features a large, subtle icon in the background. It adds visual interest
            without distracting from the content. The layout remains clean, with ample whitespace
            to ensure readability and focus.
          </p>
        </IconBackgroundCard>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* Section: Text & Accents */}
      {/* ---------------------------------------------------------------------- */}
      <section className="space-y-8">
        <h2 className="font-display text-2xl text-gold border-b border-border pb-2">
          1. Text & Accents
        </h2>

        <GiantQuote author="Antoine de Saint-Exupéry">
          Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.
        </GiantQuote>

        <ConceptCard title="Minimalism">
          <p>
            Minimalism is not a lack of something. It’s simply the perfect amount of something.
            In our design system, we use negative space as an active element, allowing the content
            to breathe and the user to focus.
          </p>
        </ConceptCard>

        <PrincipleBlock icon={<Scale />}>
          <strong>The Principle of Balance:</strong> visual weight must be distributed
          evenly across the layout. Use gold accents sparingly to guide the eye without overwhelming it.
        </PrincipleBlock>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* Section: Lists */}
      {/* ---------------------------------------------------------------------- */}
      <section className="space-y-8">
        <h2 className="font-display text-2xl text-gold border-b border-border pb-2">
          2. Lists & Enumeration
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-display text-xl mb-4">Gold Dot List</h3>
            <GoldDotList items={[
              "Prioritize content over chrome.",
              "Use consistent spacing scales.",
              "Select typography that complements the message.",
              "Ensure accessibility is never an afterthought."
            ]} />
          </div>

          <div>
            <h3 className="font-display text-xl mb-4">Badge List</h3>
            <BadgeList items={[
              "Analyze the user's intent.",
              "Sketch the initial structure.",
              "Refine the visual hierarchy.",
              "Polish the interactions."
            ]} />
          </div>
        </div>

        <h3 className="font-display text-xl mt-8 mb-4">Glossary List</h3>
        <GlossaryList items={[
          { term: "Kerning", definition: "The spacing between individual characters in a font." },
          { term: "Leading", definition: "The vertical distance between lines of text." },
          { term: "Tracking", definition: "The uniform spacing between all characters in a block of text." }
        ]} />
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* Section: Callouts */}
      {/* ---------------------------------------------------------------------- */}
      <section className="space-y-8">
        <h2 className="font-display text-2xl text-gold border-b border-border pb-2">
          3. Callouts & Metaphors
        </h2>

        <Callout type="insight" title="Design Insight">
          Good design is obvious. Great design is transparent. When the interface disappears,
          the user is left alone with the content.
        </Callout>

        <Callout type="warning" title="Cautionary Note">
          Avoid using system fonts for headings. Our brand identity relies heavily on the
          distinction provided by <em>Playfair Display</em>.
        </Callout>

        <Callout type="important" title="Critical Requirement">
          All components must pass WCAG 2.1 AA standards for contrast and keyboard navigation.
        </Callout>

        <MetaphorBlock icon={<BookOpen />}>
          Think of the interface as a quiet library. The architecture (layout) is grand but silent,
          providing the perfect environment for the books (content) to be the center of attention.
        </MetaphorBlock>
      </section>

      {/* ---------------------------------------------------------------------- */}
      {/* Section: Complex Structures */}
      {/* ---------------------------------------------------------------------- */}
      <section className="space-y-8">
        <h2 className="font-display text-2xl text-gold border-b border-border pb-2">
          4. Complex Structures
        </h2>

        <VisualFormula parts={[
          { text: "Form", caption: "Structure" },
          { text: "Function", caption: "Utility" },
          { text: "Beauty", caption: "Aesthetics" }
        ]} />

        <MetricDashboard metrics={[
          { value: "1.618", unit: "Ratio", label: "The Golden Ratio used in layout proportions." },
          { value: "98", unit: "Score", label: "Lighthouse accessibility score target." },
          { value: "400ms", unit: "Time", label: "Maximum animation duration for transitions." }
        ]} />

        <h3 className="font-display text-xl mt-12 mb-6">Process Timeline</h3>
        <StepTimeline steps={[
          {
            title: "Discovery",
            content: "Understanding the problem space and user needs through research and interviews."
          },
          {
            title: "Definition",
            content: "Synthesizing insights to define the core value proposition and feature set."
          },
          {
            title: "Development",
            content: "Iterative implementation of the solution with constant feedback loops."
          }
        ]} />
      </section>

      <div className="h-24" /> {/* Spacer */}
    </div>
  );
};

export default ContentKitchenSink;
