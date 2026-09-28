'use client';

import React, { useEffect } from 'react';
import { Star, Trophy, ArrowRight, ShoppingBag, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '@/utils/audio';

interface LevelSummaryModalProps {
  levelNumber: number;
  isVictory: boolean;
  money: number;
  targetMoney: number;
  score: number;
  ordersDelivered: number;
  stars: number;
  onNextLevel: () => void;
  onRetry: () => void;
  onOpenShop: () => void;
}

export const LevelSummaryModal: React.FC<LevelSummaryModalProps> = ({
  levelNumber,
  isVictory,
  money,
  targetMoney,
  score,
  ordersDelivered,
  stars,
  onNextLevel,
  onRetry,
  onOpenShop,
}) => {
  useEffect(() => {
    if (isVictory) {
      sounds.playLevelWon();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#ec4899', '#fbbf24', '#38bdf8', '#34d399'],
        });
      } catch (e) {
        // Confetti fallback
      }
    } else {
      sounds.playError();
    }
  }, [isVictory]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      <div className="relative flex flex-col items-center max-w-md w-full rounded-3xl border-4 border-pink-300 bg-white/98 p-8 shadow-2xl text-center">
        {/* Top Celebration Icon */}
        <div className="text-5xl mb-2 animate-bounce">
          {isVictory ? '🎉' : '💔'}
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-bakery-choco mb-1">
          {isVictory ? `¡Día ${levelNumber} Completado!` : `¡Fin del Día ${levelNumber}!`}
        </h2>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          {isVictory
            ? '¡Excelente jornada en la pastelería! Los clientes quedaron encantados.'
            : 'Se agotó el tiempo o las vidas. ¡No te rindas, vuelve a intentarlo!'}
        </p>

        {/* Stars awarded */}
        {isVictory && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <Star
                key={`star-${s}`}
                className={`w-10 h-10 transition-all duration-300 ${
                  s <= stars
                    ? 'fill-amber-400 text-amber-400 scale-110 animate-bounce'
                    : 'fill-slate-200 text-slate-300 scale-90'
                }`}
                style={{ animationDelay: `${s * 150}ms` }}
              />
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left">
            <div className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
              Recaudación
            </div>
            <div className="text-lg font-black text-amber-950 mt-0.5">
              ${money.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Meta: ${targetMoney.toLocaleString()}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 text-left">
            <div className="text-[10px] font-black text-pink-600 uppercase tracking-wider">
              Puntaje
            </div>
            <div className="text-lg font-black text-slate-900 mt-0.5">{score} pts</div>
            <div className="text-[10px] text-slate-400">{ordersDelivered} pedidos entregados</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-2.5">
          {isVictory ? (
            <>
              <button
                onClick={onNextLevel}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-base bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg hover:brightness-105 active:scale-95 transition-all"
              >
                <span>{levelNumber >= 5 ? 'Celebrar Gran Apertura' : 'Siguiente Día'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenShop}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-white border-2 border-pink-200 text-slate-700 hover:bg-pink-50 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-pink-500" />
                <span>Ir a la Tienda de Mejoras</span>
              </button>
            </>
          ) : (
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg hover:brightness-105 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reintentar Día</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
