'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'warning' | 'danger' | 'neutral' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface CandyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const CandyButton: React.FC<CandyButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  // Base classes with transition, rounded pill, font
  const baseClasses =
    'relative inline-flex items-center justify-center font-black select-none transition-all duration-150 rounded-full focus:outline-hidden disabled:opacity-45 disabled:pointer-events-none disabled:shadow-none';

  // Variant classes (thick buttons with solid bottom shadows)
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white border-2 border-pink-200/70 shadow-[0_4px_0_#9d174d,0_8px_20px_rgba(219,39,119,0.35)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#9d174d]',
    secondary:
      'bg-purple-100 hover:bg-purple-200/90 text-purple-950 border-2 border-purple-300 shadow-[0_4px_0_#a855f7] active:translate-y-0.5 active:shadow-[0_1px_0_#a855f7]',
    accent:
      'bg-sky-100 hover:bg-sky-200/90 text-sky-950 border-2 border-sky-300 shadow-[0_4px_0_#38bdf8] active:translate-y-0.5 active:shadow-[0_1px_0_#38bdf8]',
    warning:
      'bg-amber-100 hover:bg-amber-200/90 text-amber-950 border-2 border-amber-300 shadow-[0_4px_0_#f59e0b] active:translate-y-0.5 active:shadow-[0_1px_0_#f59e0b]',
    danger:
      'bg-gradient-to-r from-rose-500 to-red-600 text-white border-2 border-rose-300 shadow-[0_4px_0_#9f1239] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#9f1239]',
    neutral:
      'bg-white hover:bg-stone-50 text-stone-700 border-2 border-stone-200 shadow-[0_3px_0_#d6d3d1] active:translate-y-0.5 active:shadow-[0_1px_0_#d6d3d1]',
    ghost:
      'bg-transparent hover:bg-pink-100/60 text-stone-600 hover:text-pink-700 border-2 border-transparent shadow-none active:scale-95',
  };

  // Size classes (alrededor de 44px de alto mínimo ergonómico)
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-xs py-2 px-4 gap-2 min-h-[44px]',
    md: 'text-sm py-2.5 px-5 gap-2.5 min-h-[48px]',
    lg: 'text-base sm:text-lg py-3.5 px-7 gap-3 min-h-[56px]',
    icon: 'p-2.5 w-11 h-11 min-w-[44px] min-h-[44px] aspect-square',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.(e);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        props.onPointerDown?.(e);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        props.onMouseDown?.(e);
      }}
    >
      {/* Gloss overlay for primary & danger buttons */}
      {(variant === 'primary' || variant === 'danger') && (
        <div className="absolute inset-x-2 top-0.5 h-1/2 bg-white/20 rounded-t-full pointer-events-none" />
      )}

      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children && <span className="tracking-wide truncate">{children}</span>}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
