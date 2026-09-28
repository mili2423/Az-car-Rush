'use client';

import React from 'react';
import { GameProgress } from '@/types/game';
import { Play, BookOpen, Info, Star, Trophy, Sparkles, ShoppingBag, Volume2, VolumeX } from 'lucide-react';

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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-pink-100 via-rose-50 to-amber-50 select-none overflow-hidden">
      {/* Decorative Pastel Background Accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Pastry Background Elements */}
      <div className="absolute top-12 left-10 text-5xl opacity-40 animate-bounce pointer-events-none">🧁</div>
      <div className="absolute top-28 right-16 text-5xl opacity-40 animate-pulse pointer-events-none">🍩</div>
      <div className="absolute bottom-24 left-20 text-5xl opacity-40 animate-bounce pointer-events-none delay-300">🍪</div>
      <div className="absolute bottom-20 right-24 text-5xl opacity-40 animate-pulse pointer-events-none delay-500">🍓</div>

      {/* Top Navbar: Audio mute button */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-white/80 border border-pink-200 px-4 py-2 rounded-2xl shadow-sm backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Pastelería en 3D Primera Persona
          </span>
        </div>

        <button
          onClick={onToggleMute}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-pink-200 bg-white/90 text-slate-700 shadow-md backdrop-blur-md hover:bg-pink-50 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-pink-500" />}
        </button>
      </div>

      {/* Center Hero: Title & Menu */}
      <div className="flex flex-col items-center text-center max-w-lg w-full z-10 my-auto">
        {/* Animated Chef Hat Icon */}
        <div className="relative mb-3">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 p-1 shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-5xl">
              🎂
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black text-bakery-choco tracking-tight drop-shadow-sm mb-2">
          Azúcar <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">Rush</span>
        </h1>
        <p className="text-sm md:text-base font-medium text-slate-600 mb-8 max-w-md">
          Levanta tu pastelería día a día, hornea a toda velocidad y deslumbra al pueblo entero.
        </p>

        {/* Progress summary badge (if played before) */}
        {progress.unlockedLevel > 1 || totalStars > 0 ? (
          <div className="flex items-center gap-5 bg-white/90 border-2 border-pink-300 px-6 py-2.5 rounded-2xl shadow-lg backdrop-blur-md mb-8">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Día Desbloqueado: {progress.unlockedLevel} / 5</span>
            </div>
            <div className="h-4 w-px bg-pink-200" />
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-600">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{totalStars} Estrellas</span>
            </div>
          </div>
        ) : null}

        {/* Menu Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={onPlay}
            className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{progress.unlockedLevel > 1 ? `Continuar Día ${progress.unlockedLevel}` : 'Jugar'}</span>
          </button>

          <button
            onClick={onOpenTutorial}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-100 via-pink-100 to-rose-100 border-2 border-pink-300 text-pink-900 shadow-md hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>Mini Tutorial Guiado 🎓</span>
          </button>

          <button
            onClick={onOpenShop}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm bg-white/90 border-2 border-pink-300 text-slate-800 shadow-md hover:bg-pink-50/80 hover:border-pink-400 active:scale-[0.98] transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-pink-500" />
            <span>Tienda de Mejoras</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm bg-white/90 border-2 border-pink-200 text-slate-700 shadow-md hover:bg-pink-50 hover:border-pink-300 active:scale-[0.98] transition-all"
          >
            <BookOpen className="w-4 h-4 text-pink-500" />
            <span>Cómo Jugar</span>
          </button>

          <button
            onClick={onOpenCredits}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl font-bold text-xs bg-transparent text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Créditos</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs font-medium text-slate-400 z-10">
        Azúcar Rush • Desarrollado con Next.js + Three.js + React Three Fiber
      </div>
    </div>
  );
};
