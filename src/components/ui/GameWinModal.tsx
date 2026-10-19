'use client';

import React, { useEffect } from 'react';
import { Trophy, Sparkles, Home, Star, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CandyButton, CandyCard, CandyBadge } from '@/components/ui/design-system';
import { sounds } from '@/utils/audio';

interface GameWinModalProps {
  totalCoins: number;
  totalStars: number;
  onReturnHome: () => void;
}

export const GameWinModal: React.FC<GameWinModalProps> = ({
  totalCoins,
  totalStars,
  onReturnHome,
}) => {
  useEffect(() => {
    sounds.playLevelWon();
    const burst = () => {
      try {
        confetti({
          particleCount: 55,
          spread: 85,
          origin: { y: 0.5, x: Math.random() },
          colors: ['#ec4899', '#f43f5e', '#fbbf24', '#a855f7', '#38bdf8', '#10b981'],
        });
      } catch (e) {}
    };
    burst();
    const interval = setInterval(burst, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none bg-slate-950/65 backdrop-blur-md">
      <CandyCard
        variant="cream"
        className="relative flex flex-col items-center max-w-lg w-full p-8 sm:p-10 text-center shadow-2xl border-4 border-pink-300 animate-scale-in"
      >
        {/* Decoración superior gloss */}
        <div className="absolute top-0 left-6 right-6 h-1.5 bg-gradient-to-r from-pink-400 via-amber-300 to-purple-400 rounded-b-full pointer-events-none" />

        {/* Trofeo de Oro Grande */}
        <div className="relative mb-4">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
              boxShadow: '0 12px 32px rgba(245,158,11,0.4)',
            }}
          >
            <Trophy className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Badge triunfal */}
        <CandyBadge variant="warning" size="md" className="mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>¡Gran Apertura Triunfal!</span>
        </CandyBadge>

        {/* Título */}
        <h2 className="text-3xl sm:text-4xl font-black text-[#451a03] mb-2 tracking-tight">
          ¡Maestro Pastelero!
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-semibold mb-6 max-w-sm">
          Has devuelto el brillo y la gloria a la vieja pastelería del pueblo. Las colas dan la vuelta a la manzana y el aroma a azúcar cautivó a cada habitante.
        </p>

        {/* Resumen de logros con CandyCards */}
        <div className="w-full grid grid-cols-2 gap-3 mb-7">
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border-2 border-amber-200/90 flex flex-col items-center shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 mb-1">
              Estrellas
            </span>
            <div className="flex items-center gap-1.5 text-xl font-black text-[#451a03]">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500 drop-shadow-xs" />
              <span>{totalStars} / 15</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-pink-50/90 border-2 border-pink-200/90 flex flex-col items-center shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-pink-800 mb-1">
              Fortuna Ganada
            </span>
            <div className="flex items-center gap-1 text-xl font-black text-[#451a03]">
              <DollarSign className="w-5 h-5 text-pink-600" />
              <span>${totalCoins.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Botón Volver al Home */}
        <CandyButton
          variant="primary"
          size="lg"
          fullWidth
          icon={<Home className="w-5 h-5" />}
          onClick={onReturnHome}
        >
          Volver a la Pantalla Principal
        </CandyButton>
      </CandyCard>
    </div>
  );
};
