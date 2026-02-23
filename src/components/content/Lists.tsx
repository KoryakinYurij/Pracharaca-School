import React from 'react';
import clsx from 'clsx';

// -----------------------------------------------------------------------------
// Component: GoldDotList
// -----------------------------------------------------------------------------
export interface GoldDotListProps {
  items: React.ReactNode[];
  className?: string;
}

export const GoldDotList: React.FC<GoldDotListProps> = ({ items, className }) => {
  return (
    <ul className={clsx('space-y-4 font-body text-lg text-graphite', className)}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="mr-3 text-gold text-2xl leading-none mt-1 select-none">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

// -----------------------------------------------------------------------------
// Component: BadgeList
// -----------------------------------------------------------------------------
export interface BadgeListProps {
  items: React.ReactNode[];
  className?: string;
}

export const BadgeList: React.FC<BadgeListProps> = ({ items, className }) => {
  return (
    <ol className={clsx('space-y-6', className)}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-graphite text-ivory font-body font-bold text-sm">
            {index + 1}
          </div>
          <div className="pt-1 font-body text-lg text-graphite leading-relaxed">
            {item}
          </div>
        </li>
      ))}
    </ol>
  );
};

// -----------------------------------------------------------------------------
// Component: GlossaryList
// -----------------------------------------------------------------------------
export interface GlossaryItem {
  term: string;
  definition: React.ReactNode;
}

export interface GlossaryListProps {
  items: GlossaryItem[];
  className?: string;
}

export const GlossaryList: React.FC<GlossaryListProps> = ({ items, className }) => {
  return (
    <dl className={clsx('space-y-4', className)}>
      {items.map((item, index) => (
        <div key={index} className="bg-ivory shadow-card rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <dt className="font-display text-xl text-gold mb-2 font-semibold">
            {item.term}
          </dt>
          <dd className="font-body text-graphite/80 leading-relaxed">
            {item.definition}
          </dd>
        </div>
      ))}
    </dl>
  );
};
