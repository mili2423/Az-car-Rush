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
          particleCount: 100,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#f472b6', '#ec4899', '#fbbf24', '#a855f7', '#34d399', '#60a5fa'],
        });
        setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#f472b6', '#fbbf24'] }), 400);
        setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#a855f7', '#34d399'] }), 600);
      } catch (e) {
        // Fallback sin confetti
      }
    } else {
      sounds.playError();
    }
  }, [isVictory]);

  const moneyProgress = Math.min(100, (money / targetMoney) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      style={{ background: 'rgba(5,2,15,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="relative flex flex-col items-center max-w-md w-full rounded-3xl p-8 text-center shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0f0825 0%, #1a0d3d 60%, #0a1020 100%)',
          border: isVictory ? '2px solid rgba(251,191,36,0.4)' : '2px solid rgba(244,63,94,0.4)',
          boxShadow: isVictory ? '0 0 60px rgba(251,191,36,0.15), 0 20px 60px rgba(0,0,0,0.6)' : '0 0 60px rgba(244,63,94,0.15), 0 20px 60px rgba(0,0,0,0.6)',
        }}>

        {/* Glow de fondo */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: isVictory
              ? 'radial-gradient(circle at 50% 30%, rgba(251,191,36,0.1) 0%, transparent 60%)'
              : 'radial-gradient(circle at 50% 30%, rgba(244,63,94,0.1) 0%, transparent 60%)',
          }} />

        {/* Icono principal */}
        <div className="relative mb-4">
          {isVictory ? (
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl"
                style={{ background: 'rgba(251,191,36,0.3)', transform: 'scale(1.4)' }} />
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 0 30px rgba(251,191,36,0.4)' }}>
                <Trophy className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl"
                style={{ background: 'rgba(244,63,94,0.3)', transform: 'scale(1.4)' }} />
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', boxShadow: '0 0 30px rgba(244,63,94,0.4)' }}>
                <RotateCcw className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>
          )}
        </div>

        {/* Título */}
        <h2 className="relative text-2xl md:text-3xl font-black mb-1"
          style={{
            background: isVictory
              ? 'linear-gradient(135deg, #fbbf24, #fde68a)'
              : 'linear-gradient(135deg, #f43f5e, #fda4af)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          {isVictory ? `¡Día ${levelNumber} Completado!` : `¡Fin del Día ${levelNumber}!`}
        </h2>
        <p className="relative text-xs mb-6 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {isVictory
            ? '¡Excelente jornada! Los clientes quedaron encantados.'
            : 'Se agotó el tiempo o las vidas. ¡No te rindas, vuelve a intentarlo!'}
        </p>

        {/* Estrellas */}
        {isVictory && (
          <div className="relative flex items-center justify-center gap-3 mb-6">
            {[1, 2, 3].map(s => (
              <div key={`star-${s}`} className="relative">
                {s <= stars && (
                  <div className="absolute inset-0 blur-lg rounded-full"
                    style={{ background: 'rgba(251,191,36,0.6)', transform: 'scale(1.5)' }} />
                )}
                <Star
                  className="relative w-10 h-10 transition-all duration-500"
                  style={{
                    fill: s <= stars ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                    color: s <= stars ? '#fbbf24' : 'rgba(255,255,255,0.15)',
                    transform: `scale(${s <= stars ? 1.15 : 0.85})`,
                    transitionDelay: `${s * 150}ms`,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="relative w-full grid grid-cols-2 gap-3 mb-6">
          {/* Recaudación */}
          <div className="p-3.5 rounded-2xl text-left"
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
            <div className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: '#fbbf24' }}>
              Recaudación
            </div>
            <div className="text-lg font-black text-white">${money.toLocaleString()}</div>
            <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${moneyProgress}%`, background: moneyProgress >= 100 ? 'linear-gradient(90deg, #34d399, #6ee7b7)' : 'linear-gradient(90deg, #fbbf24, #f59e0b)' }} />
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Meta: ${targetMoney.toLocaleString()}</div>
          </div>

          {/* Puntaje */}
          <div className="p-3.5 rounded-2xl text-left"
            style={{ background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.25)' }}>
            <div className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: '#f9a8d4' }}>
              Puntaje
            </div>
            <div className="text-lg font-black text-white">{score.toLocaleString()} pts</div>
            <div className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {ordersDelivered} pedidos entregados
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="relative w-full space-y-2.5">
          {isVictory ? (
            <>
              <button
                onClick={onNextLevel}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-base text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  boxShadow: '0 6px 24px rgba(168,85,247,0.35)',
                }}
              >
                <span>{levelNumber >= 5 ? 'Ver Victoria Final' : 'Siguiente Día'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenShop}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.65)' }}
              >
                <ShoppingBag className="w-4 h-4 text-pink-300" />
                <span>Ir a la Tienda de Mejoras</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onRetry}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)', boxShadow: '0 6px 24px rgba(168,85,247,0.35)' }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reintentar Día</span>
              </button>

              <button
                onClick={onOpenShop}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.65)' }}
              >
                <ShoppingBag className="w-4 h-4 text-pink-300" />
                <span>Comprar Mejoras antes de reintentar</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
