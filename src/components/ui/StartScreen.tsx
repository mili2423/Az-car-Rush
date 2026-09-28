'use client';

import React, { useEffect, useRef } from 'react';
import { GameProgress } from '@/types/game';
import { Play, BookOpen, Info, Star, Trophy, Sparkles, ShoppingBag, Volume2, VolumeX, ChefHat } from 'lucide-react';

interface StartScreenProps {
  progress: GameProgress;
  onPlay: () => void;
  onOpenTutorial: () => void;
  onOpenHowToPlay: () => void;
  onOpenCredits: () => void;
  onOpenShop: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  progress,
  onPlay,
  onOpenTutorial,
  onOpenHowToPlay,
  onOpenCredits,
  onOpenShop,
  isMuted,
  onToggleMute,
}) => {
  const totalStars = Object.values(progress.starsPerLevel).reduce((acc, s) => acc + s, 0);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden select-none"
      style={{ background: 'linear-gradient(160deg, #fdf6ec 0%, #fef3e2 40%, #fdf0e8 70%, #fef9f0 100%)' }}
    >
      {/* Manchas de color decorativas suaves */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.10) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-[-60px] w-[280px] h-[280px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Barra superior */}
      <div className="relative w-full max-w-4xl flex items-center justify-between z-10 px-6 pt-6">
        <div className="flex items-center gap-2 bg-white/80 border border-amber-200 px-4 py-2 rounded-2xl shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-stone-600 tracking-wide">
            Pastelería 3D · Primera Persona
          </span>
        </div>

        <button
          onClick={onToggleMute}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 border border-amber-200 shadow-sm transition-all hover:bg-amber-50 active:scale-95"
        >
          {isMuted
            ? <VolumeX className="w-5 h-5 text-stone-400" />
            : <Volume2 className="w-5 h-5 text-amber-600" />}
        </button>
      </div>

      {/* Hero central */}
      <div className="relative flex flex-col items-center text-center max-w-lg w-full z-10 px-6 my-auto">

        {/* Ícono del chef */}
        <div className="relative mb-5">
          <div className="h-24 w-24 rounded-[28px] shadow-xl border-4 border-white flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)' }}>
            <ChefHat className="w-12 h-12 text-white drop-shadow" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-1 drop-shadow-sm"
          style={{ color: '#78350f' }}>
          Azúcar
        </h1>
        <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-4"
          style={{ background: 'linear-gradient(135deg, #d97706, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Rush
        </h1>
        <p className="text-sm md:text-base font-medium text-stone-500 mb-8 max-w-md leading-relaxed">
          Levanta tu pastelería día a día, hornea a toda velocidad y deslumbra al pueblo entero.
        </p>

        {/* Badge de progreso */}
        {(progress.unlockedLevel > 1 || totalStars > 0) && (
          <div className="flex items-center gap-5 bg-white border-2 border-amber-200 px-6 py-3 rounded-2xl shadow-md mb-8">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Día {progress.unlockedLevel} / 5</span>
            </div>
            <div className="h-4 w-px bg-amber-200" />
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{totalStars} Estrellas</span>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Jugar */}
          <button
            onClick={onPlay}
            className="group flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-lg text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)', boxShadow: '0 4px 20px rgba(217,119,6,0.35)' }}
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{progress.unlockedLevel > 1 ? `Continuar Día ${progress.unlockedLevel}` : 'Jugar'}</span>
          </button>

          {/* Tutorial */}
          <button
            onClick={onOpenTutorial}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm bg-white border-2 border-amber-300 text-amber-800 shadow-sm transition-all hover:bg-amber-50 active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Mini Tutorial Guiado</span>
          </button>

          {/* Tienda */}
          <button
            onClick={onOpenShop}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm bg-white border-2 border-stone-200 text-stone-700 shadow-sm transition-all hover:bg-stone-50 active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4 text-stone-500" />
            <span>Tienda de Mejoras</span>
          </button>

          {/* Cómo Jugar */}
          <button
            onClick={onOpenHowToPlay}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm bg-white border-2 border-stone-200 text-stone-600 shadow-sm transition-all hover:bg-stone-50 active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4 text-stone-400" />
            <span>Cómo Jugar</span>
          </button>

          {/* Créditos */}
          <button
            onClick={onOpenCredits}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl font-medium text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Créditos</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative text-center text-xs font-medium text-stone-400 pb-4 z-10">
        Azúcar Rush · Next.js + Three.js + React Three Fiber
      </div>
    </div>
  );
};
