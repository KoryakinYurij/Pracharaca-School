import React from 'react';
import clsx from 'clsx';

// -----------------------------------------------------------------------------
// Component: GiantQuote
// -----------------------------------------------------------------------------
export interface GiantQuoteProps {
  children: React.ReactNode;
  author?: string;
  className?: string;
}

export const GiantQuote: React.FC<GiantQuoteProps> = ({ children, author, className }) => {
  return (
    <div className={clsx('relative py-12 px-6 text-center overflow-hidden', className)}>
      {/* Decorative Quote Mark */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 select-none font-display text-[10rem] leading-none text-gold opacity-20"
        aria-hidden="true"
      >
        “
      </div>

      {/* Content */}
      <blockquote className="relative z-10 mx-auto max-w-3xl">
        <div className="font-body text-2xl italic leading-relaxed text-graphite md:text-3xl">
          {children}
        </div>
        {author && (
          <footer className="mt-6 font-display text-lg tracking-wide text-gold">
            — {author}
          </footer>
        )}
      </blockquote>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: ConceptCard
// -----------------------------------------------------------------------------
export interface ConceptCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ title, children, className }) => {
  return (
    <div className={clsx(
      'bg-ivory shadow-card rounded-xl2 p-8 md:p-12 text-center mx-auto max-w-3xl',
      className
    )}>
      <h3 className="font-display text-3xl text-graphite mb-6">
        {title}
      </h3>
      <div className="font-body text-lg leading-relaxed text-graphite/90">
        {children}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: PrincipleBlock
// -----------------------------------------------------------------------------
export interface PrincipleBlockProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const PrincipleBlock: React.FC<PrincipleBlockProps> = ({ children, icon, className }) => {
  return (
    <div className={clsx(
      'relative bg-panel border-l-4 border-gold p-6 md:p-8 overflow-hidden rounded-r-lg',
      className
    )}>
      {/* Decorative Icon */}
      {icon && (
        <div className="absolute top-2 right-2 text-gold opacity-10 w-24 h-24 pointer-events-none [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 font-body text-xl italic text-graphite leading-relaxed pr-12">
        {children}
      </div>
    </div>
  );
};
