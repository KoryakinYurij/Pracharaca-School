import React from 'react';
import clsx from 'clsx';

// -----------------------------------------------------------------------------
// Component: HeroBanner
// -----------------------------------------------------------------------------
export interface HeroBannerProps {
  title: string;
  overline?: string;
  children?: React.ReactNode;
  backgroundImage?: string;
  className?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  overline,
  children,
  backgroundImage,
  className
}) => {
  return (
    <div className={clsx(
      'relative bg-graphite rounded-xl2 p-12 md:p-16 text-center overflow-hidden',
      className
    )}>
      {/* Optional Background Pattern/Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <div className="relative z-10 max-w-4xl mx-auto">
        {overline && (
          <div className="font-body text-sm font-semibold uppercase tracking-widest text-gold mb-6">
            {overline}
          </div>
        )}
        <h1 className="font-display text-4xl md:text-6xl text-ivory mb-8 leading-tight">
          {title}
        </h1>
        {children && (
          <div className="font-body text-lg md:text-xl text-ivory/80 leading-relaxed max-w-2xl mx-auto">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: IconBackgroundCard
// -----------------------------------------------------------------------------
export interface IconBackgroundCardProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const IconBackgroundCard: React.FC<IconBackgroundCardProps> = ({ icon, children, className }) => {
  return (
    <div className={clsx(
      'relative bg-ivory shadow-card rounded-xl2 p-8 md:p-12 overflow-hidden',
      className
    )}>
      {/* Background Icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 text-gold opacity-5 pointer-events-none [&>svg]:w-full [&>svg]:h-full">
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10 font-body text-graphite leading-relaxed">
        {children}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: QAPill
// -----------------------------------------------------------------------------
export interface QAPillProps {
  question: string;
  answer: string;
  className?: string;
}

export const QAPill: React.FC<QAPillProps> = ({ question, answer, className }) => {
  return (
    <div className={clsx(
      'inline-flex items-center gap-3 rounded-full px-5 py-2 bg-panel border border-border/50 shadow-sm hover:border-gold/50 transition-colors cursor-default',
      className
    )}>
      <span className="font-display font-semibold text-graphite text-sm">
        {question}
      </span>
      <span className="w-px h-4 bg-border/50" aria-hidden="true" />
      <span className="font-body text-graphite/80 text-sm">
        {answer}
      </span>
    </div>
  );
};
