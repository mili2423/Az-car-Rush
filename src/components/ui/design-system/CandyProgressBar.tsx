'use client';

import React from 'react';

export type ProgressVariant = 'primary' | 'warning' | 'success' | 'danger' | 'patience' | 'oven';

export interface CandyProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  variant?: ProgressVariant;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  animate?: boolean;
}

export const CandyProgressBar: React.FC<CandyProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className = '',
  animate = true,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getGradient = () => {
    switch (variant) {
      case 'primary':
        return 'linear-gradient(90deg, #f472b6, #ec4899)';
      case 'warning':
        return 'linear-gradient(90deg, #fbbf24, #ea580c)';
      case 'success':
        return 'linear-gradient(90deg, #4ade80, #16a34a)';
      case 'danger':
        return 'linear-gradient(90deg, #f87171, #dc2626)';
      case 'patience':
        if (percentage > 55) return 'linear-gradient(90deg, #4ade80, #22c55e)';
        if (percentage > 25) return 'linear-gradient(90deg, #fbbf24, #f59e0b)';
        return 'linear-gradient(90deg, #f87171, #ef4444)';
      case 'oven':
        if (percentage < 60) return 'linear-gradient(90deg, #fdba74, #ea580c)';
        if (percentage <= 100) return 'linear-gradient(90deg, #4ade80, #16a34a)';
        return 'linear-gradient(90deg, #ef4444, #991b1b)';
      default:
        return 'linear-gradient(90deg, #f472b6, #ec4899)';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`w-full ${sizeClasses[size]} rounded-full bg-stone-200/80 p-0.5 shadow-inner overflow-hidden border border-stone-200`}
      >
        <div
          className={`h-full rounded-full ${animate ? 'transition-all duration-300' : ''}`}
          style={{
            width: `${percentage}%`,
            background: getGradient(),
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-[10px] font-bold text-stone-500 mt-1">
          <span>Progreso</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};
