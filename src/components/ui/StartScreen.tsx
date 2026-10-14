'use client';

import React from 'react';
import { GameProgress } from '@/types/game';
import { Play, BookOpen, Info, Star, Trophy, Sparkles, ShoppingBag, Volume2, VolumeX, ChefHat, Heart } from 'lucide-react';

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
      style={{
        background: 'linear-gradient(145deg, #fff1f2 0%, #fdf4ff 22%, #eff6ff 48%, #f0fdf4 72%, #fefce8 100%)',
      }}
    >
      {/* ============================================================== */}
      {/* 1. DECORACIONES DE FONDO: Degradés radiales golosineros         */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glow Fucsia (arriba izquierda) */}
        <div
          className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, #f472b6 0%, #ec4899 50%, transparent 75%)' }}
        />
        {/* Glow Lila Intenso (arriba derecha) */}
        <div
          className="absolute -top-20 -right-20 w-[480px] h-[480px] rounded-full blur-3xl opacity-35"
          style={{ background: 'radial-gradient(circle, #c084fc 0%, #a855f7 50%, transparent 75%)' }}
        />
        {/* Glow Celeste Caramelo (abajo izquierda) */}
        <div
          className="absolute -bottom-24 -left-20 w-[450px] h-[450px] rounded-full blur-3xl opacity-35"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, #0284c7 50%, transparent 75%)' }}
        />
        {/* Glow Amarillo Manteca (abajo derecha) */}
        <div
          className="absolute -bottom-20 -right-20 w-[460px] h-[460px] rounded-full blur-3xl opacity-45"
          style={{ background: 'radial-gradient(circle, #fde047 0%, #f59e0b 50%, transparent 75%)' }}
        />

        {/* ============================================================== */}
        {/* ELEMENTOS GOLOSINEROS FLOTANTES ANIMADOS (Sutiles y tiernos)  */}
        {/* ============================================================== */}
        {/* Cupcake 1 (flotando arriba a la izquierda) */}
        <div
          className="absolute top-[14%] left-[6%] text-4xl sm:text-5xl opacity-80 drop-shadow-md select-none"
          style={{ animation: 'candyFloat1 6s ease-in-out infinite' }}
        >
          🧁
        </div>

        {/* Donut Glaseada (arriba a la derecha) */}
        <div
          className="absolute top-[18%] right-[8%] text-4xl sm:text-5xl opacity-85 drop-shadow-md select-none"
          style={{ animation: 'candyFloat2 7s ease-in-out infinite 0.5s' }}
        >
          🍩
        </div>

        {/* Caramelo dulce (centro izquierda) */}
        <div
          className="absolute top-[52%] left-[4%] text-3xl sm:text-4xl opacity-75 drop-shadow-md select-none"
          style={{ animation: 'candyFloat3 5.5s ease-in-out infinite 1s' }}
        >
          🍬
        </div>

        {/* Frutilla fresca (centro derecha) */}
        <div
          className="absolute top-[50%] right-[5%] text-3xl sm:text-4xl opacity-80 drop-shadow-md select-none"
          style={{ animation: 'candyFloat1 6.5s ease-in-out infinite 1.5s' }}
        >
          🍓
        </div>

        {/* Galletita crocante (abajo a la izquierda) */}
        <div
          className="absolute bottom-[16%] left-[8%] text-3xl sm:text-4xl opacity-75 drop-shadow-md select-none"
          style={{ animation: 'candyFloat2 8s ease-in-out infinite 2s' }}
        >
          🍪
        </div>

        {/* Porción de Torta (abajo a la derecha) */}
        <div
          className="absolute bottom-[18%] right-[10%] text-3xl sm:text-4xl opacity-80 drop-shadow-md select-none"
          style={{ animation: 'candyFloat3 6.8s ease-in-out infinite 0.8s' }}
        >



        </div>

        {/* Chispitas de colores (Sprinkles) */}
        <div
          className="absolute top-[28%] left-[18%] w-5 h-2 rounded-full bg-pink-500/70 rotate-45 shadow-sm"
          style={{ animation: 'candyFloat1 4.5s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[24%] right-[22%] w-6 h-2.5 rounded-full bg-purple-500/70 -rotate-12 shadow-sm"
          style={{ animation: 'candyFloat2 5s ease-in-out infinite 1s' }}
        />
        <div
          className="absolute bottom-[30%] left-[16%] w-5 h-2 rounded-full bg-sky-400/80 rotate-12 shadow-sm"
          style={{ animation: 'candyFloat3 5.2s ease-in-out infinite 1.5s' }}
        />
        <div
          className="absolute bottom-[34%] right-[20%] w-6 h-2 rounded-full bg-amber-400/80 -rotate-45 shadow-sm"
          style={{ animation: 'candyFloat1 6s ease-in-out infinite 2s' }}
        />
        <div
          className="absolute top-[68%] left-[24%] w-4 h-1.5 rounded-full bg-emerald-400/70 rotate-30 shadow-sm"
          style={{ animation: 'candyFloat2 5.8s ease-in-out infinite' }}
        />
      </div>

      {/* ============================================================== */}
      {/* 2. BARRA SUPERIOR: Logo Instituto + Controles                  */}
      {/* ============================================================== */}
      <header className="relative w-full max-w-5xl flex items-center justify-between z-20 px-5 sm:px-8 pt-5 sm:pt-6">
        {/* Logo del Instituto en la esquina superior izquierda */}
        <div
          className="flex items-center gap-2.5 bg-slate-950/85 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95"
          title="Instituto Técnico La Falda (ITLF)"
        >
          <img
            src="/img/logoNav.webp"
            alt="Instituto Técnico La Falda"
            className="h-6 sm:h-7 w-auto object-contain"
          />
        </div>

        {/* Pastilla temática + Botón de Silencio */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 bg-white/85 backdrop-blur-md border-2 border-pink-200/80 px-4 py-1.5 rounded-2xl shadow-sm text-pink-700">
            <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
          </div>

          <button
            onClick={onToggleMute}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 border-2 border-amber-300 shadow-md transition-all hover:bg-amber-50 hover:scale-105 active:scale-95"
            title={isMuted ? 'Activar Sonido' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-stone-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-amber-600" />
            )}
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 3. HERO CENTRAL: Cartel de Pastelería y Botonera Golosinera    */}
      {/* ============================================================== */}
      <main className="relative flex flex-col items-center text-center max-w-lg w-full z-10 px-5 my-auto py-4">

        {/* Gorro de Chef con aureola de brillo */}
        <div className="relative mb-3 group cursor-default">
          <div
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-[30px] border-4 border-white shadow-2xl flex items-center justify-center transition-transform hover:rotate-6 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #9333ea 100%)',
              boxShadow: '0 12px 28px rgba(219,39,119,0.35)',
            }}
          >
            <ChefHat className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-md" />
          </div>
          {/* Chispa decorativa */}
          <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">
            ✨
          </div>
        </div>

        {/* Título Estilo Cartel de Pastelería Golosinera */}
        <div className="mb-3">
          {/* Cartelito superior */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-100 border border-pink-300 text-[11px] font-black tracking-widest uppercase text-pink-700 shadow-xs mb-1.5">

          </div>

          {/* Palabra 1: AZÚCAR */}
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none"
            style={{
              background: 'linear-gradient(180deg, #f43f5e 0%, #e11d48 45%, #be123c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 0 #451a03) drop-shadow(0 8px 16px rgba(69,26,3,0.35))',
            }}
          >
            Azúcar
          </h1>

          {/* Palabra 2: RUSH */}
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none -mt-1 sm:-mt-2"
            style={{
              background: 'linear-gradient(180deg, #fde047 0%, #f59e0b 50%, #ea580c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 0 #451a03) drop-shadow(0 8px 16px rgba(69,26,3,0.35))',
            }}
          >
            Rush
          </h1>
        </div>

        {/* Bajada en contraste chocolate */}
        <p className="text-xs sm:text-sm font-bold text-amber-950/80 mb-5 max-w-sm leading-snug px-2">
          Hornea a toda velocidad, decora con estilo golosinero y deslumbra al pueblo entero.
        </p>

        {/* Badge de progreso guardado (si existe) */}
        {(progress.unlockedLevel > 1 || totalStars > 0) && (
          <div className="flex items-center gap-4 bg-white/95 border-2 border-amber-300 px-5 py-2.5 rounded-2xl shadow-lg mb-5 animate-scale-in">
            <div className="flex items-center gap-1.5 text-xs font-black text-purple-900">
              <Trophy className="w-4 h-4 text-purple-600" />
              <span>Día {progress.unlockedLevel} / 5</span>
            </div>
            <div className="h-4 w-0.5 bg-amber-200" />
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-600">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{totalStars} Estrellas</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* BOTONERA GOLOSINERA PRINCIPAL                                   */}
        {/* ============================================================== */}
        <div className="flex flex-col gap-2.5 w-full max-w-xs sm:max-w-sm">

          {/* 1. BOTÓN PRINCIPAL DESTACADO: JUGAR */}
          <button
            onClick={onPlay}
            className="relative group w-full py-4 px-6 rounded-3xl font-black text-xl text-white transition-all overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 40%, #d946ef 100%)',
              border: '3.5px solid #fef08a',
              boxShadow: '0 8px 0 #831843, 0 16px 28px rgba(219,39,119,0.4)',
              transform: 'translateY(0)',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(4px)';
              e.currentTarget.style.boxShadow = '0 4px 0 #831843, 0 8px 16px rgba(219,39,119,0.4)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 0 #831843, 0 16px 28px rgba(219,39,119,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 0 #831843, 0 16px 28px rgba(219,39,119,0.4)';
            }}
          >
            {/* Brillo gloss superior */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/25 rounded-t-2xl pointer-events-none" />

            <div className="relative flex items-center justify-center gap-3 drop-shadow-md">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-white shadow-inner group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </span>
              <span className="tracking-wide">
                {progress.unlockedLevel > 1 ? `Continuar Día ${progress.unlockedLevel}` : '¡JUGAR AHORA!'}
              </span>
            </div>
          </button>

          {/* 2. BOTONES SECUNDARIOS REDONDEADOS Y LLAMATIVOS */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            {/* Tutorial */}
            <button
              onClick={onOpenTutorial}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl font-black text-xs bg-purple-50 hover:bg-purple-100/90 border-2 border-purple-300 text-purple-900 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="truncate">Tutorial</span>
            </button>

            {/* Tienda */}
            <button
              onClick={onOpenShop}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl font-black text-xs bg-amber-50 hover:bg-amber-100/90 border-2 border-amber-300 text-amber-900 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">Mejoras</span>
            </button>
          </div>

          {/* Cómo Jugar */}
          <button
            onClick={onOpenHowToPlay}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-xs bg-sky-50 hover:bg-sky-100/90 border-2 border-sky-300 text-sky-900 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Cómo Jugar & Recetas</span>
          </button>

          {/* Créditos */}
          <button
            onClick={onOpenCredits}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs text-stone-500 hover:text-pink-600 hover:bg-pink-50/60 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Créditos del Proyecto</span>
          </button>
        </div>
      </main>

      {/* ============================================================== */}
      {/* 4. FOOTER: Mención del Instituto y Tecnologías                 */}
      {/* ============================================================== */}
      <footer className="relative flex flex-col items-center gap-1 text-center text-xs pb-3.5 z-20 px-4">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 bg-white/80 backdrop-blur-md px-4 py-1 rounded-full border border-pink-200 shadow-xs">
          <span>Proyecto realizado en</span>
          <span className="text-pink-700 font-black">Instituto Técnico La Falda (ITLF)</span>
        </div>
        <div className="text-[10px] font-semibold text-stone-500">
          Azúcar Rush · Next.js · Three.js · React Three Fiber
        </div>
      </footer>
    </div>
  );
};
