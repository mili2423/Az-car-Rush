'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { releaseGamePointerLock } from '@/utils/mouseManager';

export interface CandyModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
}

export const CandyModal: React.FC<CandyModalProps> = ({
  isOpen = true,
  onClose,
  title,
  subtitle,
  icon,
  maxWidth = 'md',
  children,
  footer,
  showCloseButton = true,
}) => {
  // Asegurar cursor libre al abrir cualquier modal
  useEffect(() => {
    if (isOpen) {
      releaseGamePointerLock();
    }
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm select-none overflow-y-auto"
      onClick={e => {
        e.stopPropagation();
        if (e.target === e.currentTarget) onClose();
      }}
      onPointerDown={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
    >
      <div
        className={`relative flex flex-col w-full ${maxWidthClasses[maxWidth]} my-auto max-h-[90vh] rounded-3xl border-4 border-pink-300 bg-[#fffbf7] shadow-2xl p-6 sm:p-8 text-[#451a03] animate-scale-in`}
        onClick={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Top gloss strip */}
        <div className="absolute top-0 left-6 right-6 h-1.5 bg-gradient-to-r from-pink-400 via-purple-400 to-amber-300 rounded-b-full pointer-events-none" />

        {/* Close Button (min 44px) */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-11 h-11 p-2.5 rounded-full text-stone-400 hover:text-pink-600 hover:bg-pink-100/80 transition-all active:scale-90 flex items-center justify-center shrink-0"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-4 pr-6 pl-6">
          {icon && (
            <div className="mb-2 p-3.5 rounded-2xl bg-pink-100/80 border-2 border-pink-200 text-pink-600 shadow-inner">
              {icon}
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-black text-[#451a03] tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-stone-600 font-semibold mt-1.5 max-w-md leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Body (scrollable if long) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[60vh] scrollbar-thin">
          {children}
        </div>

        {/* Footer actions */}
        {footer && <div className="mt-5 pt-3 border-t border-pink-100 w-full">{footer}</div>}
      </div>
    </div>
  );
};
