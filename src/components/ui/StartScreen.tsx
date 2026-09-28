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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Partículas animadas de fondo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; r: number; dy: number; dx: number; opacity: number; color: string }[] = [];
    const colors = ['#fda4af', '#f9a8d4', '#fbbf24', '#a78bfa', '#6ee7b7', '#93c5fd'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 6 + 2,
        dy: -(Math.random() * 0.5 + 0.2),
        dx: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        p.y += p.dy;
        p.x += p.dx;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #1a0533 0%, #2d0a5e 30%, #3d0f6b 60%, #1a0533 100%)',
      }}
    >
      {/* Canvas partículas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Glows decorativos */}
      <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.25) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)' }} />

      {/* Top bar */}
      <div className="relative w-full max-w-4xl flex items-center justify-between z-10 px-6 pt-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}>
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black text-white/80 uppercase tracking-wider">
            Pastelería 3D · Primera Persona
          </span>
        </div>

        <button
          onClick={onToggleMute}
          className="flex h-11 w-11 items-center justify-center rounded-2xl transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)' }}
        >
          {isMuted
            ? <VolumeX className="w-5 h-5 text-white/40" />
            : <Volume2 className="w-5 h-5 text-pink-300" />}
        </button>
      </div>

      {/* Hero central */}
      <div className="relative flex flex-col items-center text-center max-w-lg w-full z-10 px-6 my-auto">
        {/* Ícono del chef con glow */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-3xl blur-2xl"
            style={{ background: 'linear-gradient(135deg, #f472b6, #a78bfa, #fbbf24)', opacity: 0.6, transform: 'scale(1.2)' }} />
          <div className="relative h-24 w-24 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #fbbf24 100%)' }}>
            <ChefHat className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-1 drop-shadow-xl"
          style={{ background: 'linear-gradient(135deg, #fda4af 0%, #f9a8d4 30%, #fbbf24 70%, #fde68a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Azúcar
        </h1>
        <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-4 drop-shadow-xl"
          style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 50%, #f472b6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Rush
        </h1>
        <p className="text-sm md:text-base font-medium mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Levanta tu pastelería día a día, hornea a toda velocidad y deslumbra al pueblo entero.
        </p>

        {/* Badge de progreso */}
        {(progress.unlockedLevel > 1 || totalStars > 0) && (
          <div className="flex items-center gap-5 px-6 py-3 rounded-2xl mb-8 shadow-xl"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)' }}>
            <div className="flex items-center gap-1.5 text-xs font-black text-white/80">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Día {progress.unlockedLevel} / 5</span>
            </div>
            <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{totalStars} Estrellas</span>
            </div>
          </div>
        )}

        {/* Botones del menú */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Jugar */}
          <button
            onClick={onPlay}
            className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-lg text-white shadow-2xl transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #6366f1 100%)', boxShadow: '0 8px 32px rgba(168,85,247,0.4)' }}
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc, #818cf8)', boxShadow: '0 0 40px rgba(168,85,247,0.6)' }} />
            <Play className="relative w-5 h-5 fill-white" />
            <span className="relative">{progress.unlockedLevel > 1 ? `Continuar Día ${progress.unlockedLevel}` : 'Jugar'}</span>
          </button>

          {/* Tutorial */}
          <button
            onClick={onOpenTutorial}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.97]"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(251,191,36,0.4)', color: '#fde68a', backdropFilter: 'blur(12px)' }}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Mini Tutorial Guiado</span>
          </button>

          {/* Tienda */}
          <button
            onClick={onOpenShop}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.97]"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(244,114,182,0.35)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
          >
            <ShoppingBag className="w-4 h-4 text-pink-300" />
            <span>Tienda de Mejoras</span>
          </button>

          {/* Cómo Jugar */}
          <button
            onClick={onOpenHowToPlay}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.97]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)' }}
          >
            <BookOpen className="w-4 h-4 text-purple-300" />
            <span>Cómo Jugar</span>
          </button>

          {/* Créditos */}
          <button
            onClick={onOpenCredits}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl font-bold text-xs transition-colors"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Créditos</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative text-center text-xs font-medium pb-4 z-10" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Azúcar Rush · Next.js + Three.js + React Three Fiber
      </div>
    </div>
  );
};
