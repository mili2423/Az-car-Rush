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
    const burst = () => {
      try {
        confetti({ particleCount: 55, spread: 85, origin: { y: 0.5, x: Math.random() }, colors: ['#fbbf24', '#ea580c', '#d97706', '#fb923c', '#fde68a', '#f97316'] });
      } catch (e) {}
    };
    burst();
    const interval = setInterval(burst, 950);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      style={{ background: 'rgba(60,40,20,0.6)', backdropFilter: 'blur(10px)' }}>
      <div className="relative flex flex-col items-center max-w-lg w-full rounded-3xl p-10 text-center shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #fffbf5 0%, #fef6e8 60%, #fff9f0 100%)',
          border: '2.5px solid rgba(251,191,36,0.6)',
          boxShadow: '0 20px 80px rgba(120,80,20,0.3), 0 4px 20px rgba(120,80,20,0.12)',
        }}>

        {/* Decoración superior */}
        <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl"
          style={{ background: 'linear-gradient(90deg, #fbbf24, #ea580c, #d97706)' }} />

        {/* Trofeo */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 60%, #b45309 100%)', boxShadow: '0 8px 40px rgba(251,191,36,0.45)' }}>
            <Trophy className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3"
          style={{ background: '#fef9c3', border: '1.5px solid #fde047', color: '#a16207' }}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>¡Gran Apertura Triunfal!</span>
        </div>

        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: '#78350f' }}>
          ¡Maestro Pastelero!
        </h2>
        <p className="text-sm text-stone-500 leading-relaxed font-medium mb-7 max-w-sm">
          Has devuelto el brillo y la gloria a la vieja pastelería del pueblo. Las colas dan la vuelta a la manzana y el aroma a azúcar cautivó a cada habitante.
        </p>

        {/* Stats */}
        <div className="w-full flex items-center justify-around p-5 rounded-2xl mb-8"
          style={{ background: '#fef9ec', border: '1.5px solid #fde68a' }}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Estrellas</span>
            <div className="flex items-center gap-1 text-2xl font-black text-stone-800">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              <span>{totalStars} / 15</span>
            </div>
          </div>
          <div className="h-10 w-px bg-amber-200" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Fortuna</span>
            <div className="text-2xl font-black text-amber-700">${totalCoins.toLocaleString()}</div>
          </div>
        </div>

        <button onClick={onReturnHome}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          style={{ background: 'linear-gradient(135deg, #d97706, #ea580c)', boxShadow: '0 6px 24px rgba(217,119,6,0.4)' }}>
          <Home className="w-5 h-5" />
          <span>Volver a la Pantalla Principal</span>
        </button>
      </div>
    </div>
  );
};
