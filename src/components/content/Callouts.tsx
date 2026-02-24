import React from 'react';
import clsx from 'clsx';
import { AlertCircle, Lightbulb, Info } from 'lucide-react'; // Default icons if none passed or needed

// -----------------------------------------------------------------------------
// Component: Callout
// -----------------------------------------------------------------------------
export type CalloutType = 'important' | 'warning' | 'insight';

export interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Callout: React.FC<CalloutProps> = ({ type, title, children, icon, className }) => {
  const styles = {
    important: 'bg-graphite text-ivory border-l-4 border-gold',
    warning: 'bg-panel text-graphite border-l-4 border-[#9c4221]',
    insight: 'bg-panel text-graphite border-l-4 border-gold',
  };

  const DefaultIcon = {
    important: Info,
    warning: AlertCircle,
    insight: Lightbulb,
  }[type];

  const iconColor = {
    important: 'text-gold',
    warning: 'text-[#9c4221]',
    insight: 'text-gold',
  }[type];

  return (
    <div className={clsx('p-6 rounded-r-lg shadow-sm my-6 flex gap-4', styles[type], className)}>
      <div className={clsx('flex-shrink-0 pt-1', iconColor)}>
        {icon || <DefaultIcon className="w-6 h-6" />}
      </div>
      <div className="flex-1">
        {title && (
          <h4 className={clsx('font-display font-bold text-lg mb-2', type === 'important' ? 'text-gold' : 'text-graphite')}>
            {title}
          </h4>
        )}
        <div className={clsx('font-body leading-relaxed', type === 'important' ? 'text-ivory/90' : 'text-graphite/90')}>
          {children}
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: MetaphorBlock
// -----------------------------------------------------------------------------
export interface MetaphorBlockProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const MetaphorBlock: React.FC<MetaphorBlockProps> = ({ icon, children, className }) => {
  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center bg-ivory shadow-card rounded-xl2 p-8 my-8', className)}>
      <div className="flex justify-center md:justify-start">
        <div className="w-24 h-24 text-graphite/80 [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-1">
          {icon}
        </div>
      </div>
      <div className="font-display italic text-xl text-graphite leading-relaxed text-center md:text-left border-l-0 md:border-l-2 md:border-gold/30 md:pl-6">
        {children}
      </div>
    </div>
  );
};
