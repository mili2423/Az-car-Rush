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
        confetti({ particleCount: 60, spread: 90, origin: { y: 0.5, x: Math.random() }, colors: ['#f472b6', '#fbbf24', '#a855f7', '#34d399', '#60a5fa'] });
      } catch (e) {}
    };
    burst();
    const interval = setInterval(burst, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      style={{ background: 'rgba(5,2,15,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="relative flex flex-col items-center max-w-lg w-full rounded-3xl p-10 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0f0825 0%, #1a0d3d 60%, #0a1020 100%)',
          border: '2px solid rgba(251,191,36,0.5)',
          boxShadow: '0 0 80px rgba(251,191,36,0.2), 0 0 200px rgba(168,85,247,0.15), 0 24px 80px rgba(0,0,0,0.7)',
        }}>

        {/* Glow dorado de fondo */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 25%, rgba(251,191,36,0.15) 0%, transparent 65%)' }} />

        {/* Trofeo con aura */}
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full blur-2xl"
            style={{ background: 'rgba(251,191,36,0.4)', transform: 'scale(2)' }} />
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)', boxShadow: '0 0 50px rgba(251,191,36,0.5)' }}>
            <Trophy className="w-12 h-12 text-white drop-shadow-2xl" />
          </div>
        </div>

        {/* Badge "Gran Apertura" */}
        <div className="relative flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3"
          style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', color: '#fde68a' }}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>¡Gran Apertura Triunfal!</span>
        </div>

        {/* Título */}
        <h2 className="relative text-3xl md:text-4xl font-black mb-3"
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #fde68a 40%, #f472b6 80%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          ¡Maestro Pastelero!
        </h2>
        <p className="relative text-sm leading-relaxed font-medium mb-7" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Has devuelto el brillo y la gloria a la vieja pastelería del pueblo. Las colas dan la vuelta a la manzana y el aroma a azúcar cautivó a cada habitante.
        </p>

        {/* Stats */}
        <div className="relative w-full flex items-center justify-around p-5 rounded-2xl mb-8"
          style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.25)' }}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Estrellas</span>
            <div className="flex items-center gap-1 text-2xl font-black text-white">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{totalStars} / 15</span>
            </div>
          </div>
          <div className="h-10 w-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Fortuna</span>
            <div className="text-2xl font-black" style={{ color: '#fbbf24' }}>
              ${totalCoins.toLocaleString()}
            </div>
          </div>
        </div>

        <button
          onClick={onReturnHome}
          className="relative w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #ec4899, #a855f7, #6366f1)',
            boxShadow: '0 8px 32px rgba(168,85,247,0.4)',
          }}
        >
          <Home className="w-5 h-5" />
          <span>Volver a la Pantalla Principal</span>
        </button>
      </div>
    </div>
  );
};
