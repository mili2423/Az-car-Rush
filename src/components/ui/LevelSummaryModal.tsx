'use client';

import React, { useEffect } from 'react';
import { Star, Trophy, ArrowRight, ShoppingBag, RotateCcw, Award, DollarSign, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CandyButton, CandyCard, CandyBadge, CandyProgressBar } from '@/components/ui/design-system';
import { sounds } from '@/utils/audio';
import { PRODUCTS_UNLOCKED_ON_DAY } from '@/utils/levels';
import { RECIPES } from '@/types/game';

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
          spread: 75,
          origin: { y: 0.55 },
          colors: ['#ec4899', '#f43f5e', '#fbbf24', '#a855f7', '#38bdf8'],
        });
        setTimeout(
          () =>
            confetti({
              particleCount: 40,
              angle: 60,
              spread: 50,
              origin: { x: 0 },
              colors: ['#ec4899', '#fbbf24'],
            }),
          350
        );
        setTimeout(
          () =>
            confetti({
              particleCount: 40,
              angle: 120,
              spread: 50,
              origin: { x: 1 },
              colors: ['#a855f7', '#38bdf8'],
            }),
          550
        );
      } catch (e) {}
    } else {
      sounds.playError();
    }
  }, [isVictory]);

  const moneyProgress = Math.min(100, (money / targetMoney) * 100);

  const nextDayUnlocks = isVictory && levelNumber < 5 ? PRODUCTS_UNLOCKED_ON_DAY[levelNumber + 1] : null;
  const nextUnlockNames = nextDayUnlocks && nextDayUnlocks.length > 0
    ? nextDayUnlocks.map(id => RECIPES[id]?.name || id).join(' y ')
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none bg-slate-950/60 backdrop-blur-sm">
      <CandyCard
        variant="cream"
        className="relative flex flex-col items-center max-w-md w-full p-7 sm:p-8 text-center shadow-2xl border-4 border-pink-300 animate-scale-in"
      >
        {/* Glow superior */}
        <div className="absolute top-0 left-6 right-6 h-1.5 bg-gradient-to-r from-pink-400 via-purple-400 to-amber-300 rounded-b-full pointer-events-none" />

        {/* Icono central de estado */}
        <div className="relative mb-3.5">
          {isVictory ? (
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg border-2 border-white transition-transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                boxShadow: '0 10px 24px rgba(245,158,11,0.35)',
              }}
            >
              <Trophy className="w-10 h-10 text-white drop-shadow-md" />
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg border-2 border-white transition-transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #be123c 100%)',
                boxShadow: '0 10px 24px rgba(225,29,72,0.35)',
              }}
            >
              <RotateCcw className="w-10 h-10 text-white drop-shadow-md" />
            </div>
          )}
        </div>

        {/* Badge del Día */}
        <CandyBadge
          variant={isVictory ? 'warning' : 'primary'}
          size="sm"
          className="mb-2"
        >
          {isVictory ? `Día ${levelNumber} Completado` : `Día ${levelNumber} Terminado`}
        </CandyBadge>

        {/* Título Principal */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#451a03] mb-1">
          {isVictory ? '¡Jornada Exitosa!' : '¡Agotaste el Tiempo o Vidas!'}
        </h2>
        <p className="text-xs text-stone-600 mb-5 font-semibold leading-relaxed max-w-xs">
          {isVictory
            ? 'Tus postres cautivaron a los clientes. ¡Sigue así para la Gran Apertura!'
            : 'Los pedidos se complicaron pero la pastelería sigue en pie. ¡Reinténtalo!'}
        </p>

        {/* Estrellas Ganadas */}
        {isVictory && (
          <div className="flex items-center justify-center gap-2 mb-5">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className="transition-transform duration-300"
                style={{
                  transform: s <= stars ? 'scale(1.15)' : 'scale(0.9)',
                }}
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    s <= stars
                      ? 'fill-amber-400 text-amber-500 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                      : 'fill-stone-200 text-stone-300'
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Estadísticas de la Jornada */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-6 text-left">
          {/* Recaudación */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border-2 border-amber-200/90 shadow-2xs">
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-800 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-600" />
              <span>Recaudación</span>
            </div>
            <div className="text-lg font-black text-[#451a03]">${money.toLocaleString()}</div>
            <div className="mt-2">
              <CandyProgressBar value={moneyProgress} variant={moneyProgress >= 100 ? 'success' : 'warning'} size="sm" />
            </div>
            <div className="text-[10px] mt-1 font-bold text-stone-400">
              Meta: ${targetMoney.toLocaleString()}
            </div>
          </div>

          {/* Puntaje y pedidos */}
          <div className="p-3.5 rounded-2xl bg-purple-50/80 border-2 border-purple-200/90 shadow-2xs">
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-purple-800 mb-1">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>Puntaje</span>
            </div>
            <div className="text-lg font-black text-[#451a03]">{score.toLocaleString()} pts</div>
            <div className="text-[10px] mt-3 font-bold text-stone-500">
              {ordersDelivered} {ordersDelivered === 1 ? 'pedido entregado' : 'pedidos entregados'}
            </div>
          </div>
        </div>

        {/* Aviso de desbloqueo para el día siguiente */}
        {nextUnlockNames && (
          <div className="w-full mb-5 p-3 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 border-2 border-pink-300/80 shadow-xs flex items-center justify-center gap-2 text-center animate-pulse">
            <Sparkles className="w-4 h-4 text-pink-500 shrink-0" />
            <span className="text-xs font-black text-pink-900">
              Mañana desbloquearás:{' '}
              <span className="text-purple-700 underline decoration-pink-400 font-extrabold">{nextUnlockNames}</span>
            </span>
          </div>
        )}

        {/* Botonera con CandyButton */}
        <div className="w-full space-y-2.5">
          {isVictory ? (
            <>
              <CandyButton
                variant="primary"
                size="lg"
                fullWidth
                icon={<ArrowRight className="w-5 h-5 ml-1" />}
                iconPosition="right"
                onClick={onNextLevel}
              >
                {levelNumber >= 5 ? 'Ver Victoria Final' : 'Siguiente Día'}
              </CandyButton>
              <CandyButton
                variant="warning"
                size="md"
                fullWidth
                icon={<ShoppingBag className="w-4 h-4" />}
                onClick={onOpenShop}
              >
                Tienda de Mejoras
              </CandyButton>
            </>
          ) : (
            <>
              <CandyButton
                variant="primary"
                size="lg"
                fullWidth
                icon={<RotateCcw className="w-5 h-5" />}
                onClick={onRetry}
              >
                Reintentar Día {levelNumber}
              </CandyButton>
              <CandyButton
                variant="warning"
                size="md"
                fullWidth
                icon={<ShoppingBag className="w-4 h-4" />}
                onClick={onOpenShop}
              >
                Comprar Mejoras
              </CandyButton>
            </>
          )}
        </div>
      </CandyCard>
    </div>
  );
};
