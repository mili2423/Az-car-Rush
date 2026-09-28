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
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.55 }, colors: ['#f59e0b', '#ea580c', '#d97706', '#fbbf24', '#fde68a', '#fb923c'] });
        setTimeout(() => confetti({ particleCount: 40, angle: 60, spread: 50, origin: { x: 0 }, colors: ['#d97706', '#fbbf24'] }), 400);
        setTimeout(() => confetti({ particleCount: 40, angle: 120, spread: 50, origin: { x: 1 }, colors: ['#ea580c', '#fde68a'] }), 600);
      } catch (e) {}
    } else {
      sounds.playError();
    }
  }, [isVictory]);

  const moneyProgress = Math.min(100, (money / targetMoney) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      style={{ background: 'rgba(60,40,20,0.55)', backdropFilter: 'blur(8px)' }}>
      <div className="relative flex flex-col items-center max-w-md w-full rounded-3xl p-8 text-center shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #fffbf5 0%, #fef6e8 60%, #fff9f0 100%)',
          border: isVictory ? '2.5px solid rgba(251,191,36,0.6)' : '2.5px solid rgba(239,68,68,0.35)',
          boxShadow: '0 16px 64px rgba(120,80,20,0.25), 0 4px 16px rgba(120,80,20,0.1)',
        }}>

        {/* Icono principal */}
        <div className="relative mb-4">
          {isVictory ? (
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)', boxShadow: '0 8px 32px rgba(251,191,36,0.4)' }}>
              <Trophy className="w-10 h-10 text-white drop-shadow" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', boxShadow: '0 8px 32px rgba(239,68,68,0.3)' }}>
              <RotateCcw className="w-10 h-10 text-white drop-shadow" />
            </div>
          )}
        </div>

        {/* Título */}
        <h2 className="text-2xl md:text-3xl font-black mb-1"
          style={{ color: isVictory ? '#78350f' : '#991b1b' }}>
          {isVictory ? `¡Día ${levelNumber} Completado!` : `Día ${levelNumber} sin terminar`}
        </h2>
        <p className="text-xs text-stone-500 mb-5 font-medium leading-relaxed">
          {isVictory
            ? '¡Excelente jornada! Los clientes quedaron encantados con tus delicias.'
            : 'Se agotó el tiempo o las vidas. ¡Sigue adelante, la próxima será mejor!'}
        </p>

        {/* Estrellas */}
        {isVictory && (
          <div className="flex items-center justify-center gap-2 mb-5">
            {[1, 2, 3].map(s => (
              <Star key={s} className="w-10 h-10 transition-all duration-500"
                style={{
                  fill: s <= stars ? '#fbbf24' : '#e5e7eb',
                  color: s <= stars ? '#d97706' : '#d1d5db',
                  transform: `scale(${s <= stars ? 1.15 : 0.85})`,
                  transitionDelay: `${s * 120}ms`,
                  filter: s <= stars ? 'drop-shadow(0 2px 6px rgba(251,191,36,0.5))' : 'none',
                }} />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl text-left bg-amber-50 border border-amber-200">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-700 mb-1">Recaudación</div>
            <div className="text-lg font-black text-stone-800">${money.toLocaleString()}</div>
            <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden bg-amber-100">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${moneyProgress}%`, background: moneyProgress >= 100 ? '#16a34a' : 'linear-gradient(90deg, #d97706, #ea580c)' }} />
            </div>
            <div className="text-[10px] mt-1 text-stone-400">Meta: ${targetMoney.toLocaleString()}</div>
          </div>
          <div className="p-3.5 rounded-2xl text-left bg-orange-50 border border-orange-200">
            <div className="text-[10px] font-black uppercase tracking-wider text-orange-700 mb-1">Puntaje</div>
            <div className="text-lg font-black text-stone-800">{score.toLocaleString()} pts</div>
            <div className="text-[10px] mt-2 text-stone-400">{ordersDelivered} pedidos entregados</div>
          </div>
        </div>

        {/* Botones */}
        <div className="w-full space-y-2.5">
          {isVictory ? (
            <>
              <button onClick={onNextLevel}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-base text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                style={{ background: 'linear-gradient(135deg, #d97706, #ea580c)', boxShadow: '0 4px 20px rgba(217,119,6,0.35)' }}>
                <span>{levelNumber >= 5 ? 'Ver Victoria Final' : 'Siguiente Día'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onOpenShop}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-xs text-stone-600 bg-white border-2 border-stone-200 hover:bg-stone-50 transition-colors">
                <ShoppingBag className="w-4 h-4 text-stone-400" />
                <span>Ir a la Tienda de Mejoras</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={onRetry}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                style={{ background: 'linear-gradient(135deg, #d97706, #ea580c)', boxShadow: '0 4px 20px rgba(217,119,6,0.35)' }}>
                <RotateCcw className="w-4 h-4" />
                <span>Reintentar Día</span>
              </button>
              <button onClick={onOpenShop}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-xs text-stone-600 bg-white border-2 border-stone-200 hover:bg-stone-50 transition-colors">
                <ShoppingBag className="w-4 h-4 text-stone-400" />
                <span>Comprar Mejoras antes de reintentar</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
