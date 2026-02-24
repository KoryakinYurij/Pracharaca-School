import React from 'react';
import clsx from 'clsx';

// -----------------------------------------------------------------------------
// Component: StepTimeline
// -----------------------------------------------------------------------------
export interface StepItem {
  title?: string;
  content: React.ReactNode;
}

export interface StepTimelineProps {
  steps: StepItem[];
  className?: string;
}

export const StepTimeline: React.FC<StepTimelineProps> = ({ steps, className }) => {
  return (
    <div className={clsx('relative pl-8 border-l-2 border-border/50 ml-4 space-y-12', className)}>
      {steps.map((step, index) => (
        <div key={index} className="relative group">
          {/* Marker */}
          <div className="absolute -left-[2.25rem] top-0 w-4 h-4 rounded-full border-2 border-gold bg-ivory group-hover:bg-gold transition-colors duration-300" />

          {/* Card */}
          <div className="bg-ivory shadow-card rounded-xl2 p-8 relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
            {/* Background Number */}
            <div className="absolute top-0 right-4 text-[6rem] leading-none font-display font-bold text-graphite opacity-5 select-none pointer-events-none">
              {index + 1}
            </div>

            {step.title && (
              <h4 className="font-display text-xl text-gold mb-4 relative z-10">
                {step.title}
              </h4>
            )}
            <div className="font-body text-graphite/90 relative z-10 leading-relaxed">
              {step.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: VisualFormula
// -----------------------------------------------------------------------------
export interface FormulaPart {
  text: string;
  caption?: string;
}

export interface VisualFormulaProps {
  parts: FormulaPart[];
  className?: string;
}

export const VisualFormula: React.FC<VisualFormulaProps> = ({ parts, className }) => {
  return (
    <div className={clsx('flex flex-wrap items-end justify-center gap-4 md:gap-8 py-8', className)}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <div className="text-center group">
            <div className="font-display text-4xl md:text-5xl text-gold mb-2">
              {part.text}
            </div>
            {part.caption && (
              <div className="font-body text-xs uppercase tracking-widest text-graphite/60 border-t border-border pt-2 mt-2">
                {part.caption}
              </div>
            )}
          </div>
          {index < parts.length - 1 && (
            <div className="font-display text-2xl text-graphite/30 pb-8 md:pb-10 select-none">
              +
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: MetricDashboard
// -----------------------------------------------------------------------------
export interface MetricItem {
  value: string | number;
  unit?: string;
  label: string;
}

export interface MetricDashboardProps {
  metrics: MetricItem[];
  className?: string;
}

export const MetricDashboard: React.FC<MetricDashboardProps> = ({ metrics, className }) => {
  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {metrics.map((metric, index) => (
        <div key={index} className="bg-ivory shadow-card rounded-xl2 p-8 text-center transition-shadow duration-300 border border-transparent hover:border-gold/20">
          <div className="font-display text-5xl md:text-6xl text-graphite mb-2">
            {metric.value}
          </div>
          {metric.unit && (
            <div className="font-body text-sm uppercase tracking-widest text-gold font-bold mb-4">
              {metric.unit}
            </div>
          )}
          <div className="font-body text-graphite/80 leading-relaxed border-t border-border pt-4">
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
};
