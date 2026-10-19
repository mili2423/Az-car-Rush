'use client';

import React from 'react';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'warning'
  | 'success'
  | 'neutral'
  | 'dark';

export interface CandyBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

export const CandyBadge: React.FC<CandyBadgeProps> = ({
  variant = 'primary',
  icon,
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center font-black rounded-full select-none shadow-2xs border uppercase tracking-wider shrink-0 transition-transform';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  const variantClasses: Record<BadgeVariant, string> = {
    primary:
      'bg-pink-100/90 text-pink-700 border-pink-300',
    secondary:
      'bg-purple-100/90 text-purple-700 border-purple-300',
    accent:
      'bg-sky-100/90 text-sky-700 border-sky-300',
    warning:
      'bg-amber-100/90 text-amber-800 border-amber-300',
    success:
      'bg-emerald-100/90 text-emerald-700 border-emerald-300',
    neutral:
      'bg-white/90 text-stone-700 border-stone-200',
    dark:
      'bg-slate-900 text-white border-slate-700',
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
