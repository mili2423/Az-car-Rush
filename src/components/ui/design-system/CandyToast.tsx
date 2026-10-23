'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, Flame, Info } from 'lucide-react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface CandyToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
}

export const CandyToast: React.FC<CandyToastProps> = ({
  message,
  type = 'info',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'error':
        return <Flame className="w-5 h-5 text-rose-600 shrink-0" />;
      default:
        return <Sparkles className="w-5 h-5 text-pink-600 shrink-0" />;
    }
  };

  const typeClasses: Record<ToastType, string> = {
    info: 'bg-[#fffbf5] border-pink-300 text-stone-800 shadow-[0_8px_24px_rgba(236,72,153,0.25)]',
    success: 'bg-[#f0fdf4] border-emerald-300 text-emerald-950 shadow-[0_8px_24px_rgba(34,197,94,0.25)]',
    warning: 'bg-[#fffbeb] border-amber-300 text-amber-950 shadow-[0_8px_24px_rgba(245,158,11,0.25)]',
    error: 'bg-[#fff1f2] border-rose-300 text-rose-950 shadow-[0_8px_24px_rgba(244,63,94,0.25)]',
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none max-w-lg w-auto px-4 flex justify-center animate-scale-in">
      <div
        className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 text-sm sm:text-base font-black backdrop-blur-md ${typeClasses[type]}`}
      >
        {getIcon()}
        <span className="truncate">{message}</span>
      </div>
    </div>
  );
};
