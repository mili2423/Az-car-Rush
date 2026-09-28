'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles, ChefHat, Scroll, UtensilsCrossed, Store } from 'lucide-react';
import { sounds } from '@/utils/audio';

interface IntroCutsceneProps {
  onComplete: () => void;
}

interface Slide {
  icon: React.ReactNode;
  title: string;
  story: string;
  tag: string;
}

const SLIDES: Slide[] = [
  {
    icon: <Scroll className="w-14 h-14 text-pink-600" />,
    tag: 'La Herencia',
    title: 'Una Carta Inesperada',
    story: 'Llega a tus manos una carta amarillenta... Has heredado la vieja pastelería del pueblo. Antaño llena de risas y aroma a pan caliente, hoy sus mesadas acumulan polvo y casi ningún cliente cruza la puerta.',
  },
  {
    icon: <UtensilsCrossed className="w-14 h-14 text-pink-600" />,
    tag: 'El Desafío',
    title: 'Las Recetas Secretas',
    story: 'Al entrar a la cocina, encuentras el antiguo recetario familiar intacto. Con ingredientes frescos y tus habilidades, puedes devolverle la vida a este rincón dulce y convertirlo en el orgullo de la comunidad.',
  },
  {
    icon: <Store className="w-14 h-14 text-pink-600" />,
    tag: 'El Gran Sueño',
    title: 'Hacia la Gran Apertura',
    story: 'Día tras día, atenderás a comensales exigentes, ganarás propinas, equiparás el local con hornos más potentes y desbloquearás creaciones deliciosas hasta celebrar la Gran Apertura oficial.',
  },
  {
    icon: <ChefHat className="w-14 h-14 text-pink-600" />,
    tag: 'Día 1: Inicio',
    title: '¡Hora de Ponerse el Delantal!',
    story: 'El primer cliente acaba de hacer sonar la campana del mostrador. Camina por la cocina con WASD, junta los ingredientes con [E] y prepara tu primera obra maestra.',
  },
];

export const IntroCutscene: React.FC<IntroCutsceneProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    sounds.playPickup();
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-b from-pink-100 via-rose-50 to-amber-50 select-none">
      <div className="relative flex flex-col items-center max-w-lg w-full rounded-3xl border-4 border-pink-300 bg-white/95 p-8 shadow-2xl text-center backdrop-blur-md">
        {/* Step dots */}
        <div className="flex items-center gap-2 mb-6">
          {SLIDES.map((_, idx) => (
            <div
              key={`dot-${idx}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-8 bg-pink-500'
                  : 'w-2 bg-pink-200'
              }`}
            />
          ))}
        </div>

        {/* Big Icon Card */}
        <div className="h-28 w-28 rounded-3xl bg-pink-50 border-2 border-pink-200 flex items-center justify-center shadow-inner mb-4">
          {slide.icon}
        </div>

        {/* Tag badge */}
        <span className="text-xs font-black text-pink-600 bg-pink-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          {slide.tag}
        </span>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black text-bakery-choco mb-4">
          {slide.title}
        </h2>

        {/* Story Text */}
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium mb-8">
          {slide.story}
        </p>

        {/* Actions */}
        <div className="w-full flex items-center justify-between gap-4">
          <button
            onClick={onComplete}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
          >
            Saltar Historia
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg hover:brightness-105 active:scale-95 transition-all"
          >
            <span>{currentSlide === SLIDES.length - 1 ? '¡Comenzar Día 1!' : 'Siguiente'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
