'use client';

import React from 'react';

export type CardVariant = 'cream' | 'pink' | 'purple' | 'amber' | 'dark' | 'glass';

export interface CandyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverEffect?: boolean;
}

export const CandyCard: React.FC<CandyCardProps> = ({
  variant = 'cream',
  hoverEffect = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'relative rounded-3xl transition-all duration-200 select-none';

  const variantClasses: Record<CardVariant, string> = {
    cream:
      'bg-[#fffbf5]/95 border-2 border-pink-200/80 shadow-[0_6px_24px_rgba(69,26,3,0.08)] text-[#451a03]',
    pink:
      'bg-pink-50/90 border-2 border-pink-200 shadow-[0_6px_24px_rgba(236,72,153,0.12)] text-pink-950',
    purple:
      'bg-purple-50/90 border-2 border-purple-200 shadow-[0_6px_24px_rgba(168,85,247,0.12)] text-purple-950',
    amber:
      'bg-amber-50/90 border-2 border-amber-200 shadow-[0_6px_24px_rgba(245,158,11,0.12)] text-amber-950',
    dark:
      'bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-md text-white',
    glass:
      'bg-white/80 backdrop-blur-md border-2 border-pink-200/70 shadow-[0_8px_32px_rgba(219,39,119,0.12)] text-[#451a03]',
  };

  const hoverClass = hoverEffect
    ? 'hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(69,26,3,0.14)]'
    : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
