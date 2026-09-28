'use client';

import React, { useEffect } from 'react';
import { Trophy, Sparkles, Home, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
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
    const interval = setInterval(() => {
      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.5, x: Math.random() },
          colors: ['#f472b6', '#fbbf24', '#38bdf8', '#34d399', '#ec4899'],
        });
      } catch (e) {}
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 select-none">
      <div className="relative flex flex-col items-center max-w-lg w-full rounded-3xl border-4 border-amber-300 bg-white/98 p-8 shadow-2xl text-center">
        <div className="text-6xl mb-3 animate-bounce">👑🎂</div>
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-3.5 py-1 rounded-full mb-2">
          <Sparkles className="w-4 h-4" />
          <span>¡Gran Apertura Triunfal!</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-bakery-choco mb-2">
          ¡Felicidades, Maestro Pastelero!
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
          Has devuelto el brillo y la gloria a la vieja pastelería del pueblo. Las colas dan la vuelta a la manzana y el aroma a azúcar y chocolate cautivó a cada habitante.
        </p>

        {/* Stats card */}
        <div className="w-full flex items-center justify-around p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-200 mb-8">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-amber-700">Estrellas Totales</span>
            <div className="flex items-center gap-1 text-xl font-black text-amber-900 mt-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              <span>{totalStars} / 15</span>
            </div>
          </div>
          <div className="h-8 w-px bg-amber-200" />
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-amber-700">Fortuna Ganada</span>
            <div className="text-xl font-black text-amber-900 mt-1">
              ${totalCoins.toLocaleString()}
            </div>
          </div>
        </div>

        <button
          onClick={onReturnHome}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white shadow-xl hover:brightness-105 active:scale-95 transition-all"
        >
          <Home className="w-5 h-5" />
          <span>Volver a la Pantalla Principal</span>
        </button>
      </div>
    </div>
  );
};
