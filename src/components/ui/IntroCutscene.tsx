'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles, ChefHat, Scroll, UtensilsCrossed, Store } from 'lucide-react';
import { CandyButton, CandyCard, CandyBadge } from '@/components/ui/design-system';
import { sounds } from '@/utils/audio';

interface IntroCutsceneProps {
  onComplete: () => void;
}

interface Slide {
  icon: React.ReactNode;
  tag: string;
  title: string;
  story: string;
}

const SLIDES: Slide[] = [
  {
    icon: <Scroll className="w-12 h-12 text-pink-600" />,
    tag: 'La Herencia',
    title: 'Una Carta Inesperada',
    story: 'Llega a tus manos una carta amarillenta... Has heredado la vieja pastelería del pueblo. Antaño llena de risas y aroma a pan caliente, hoy sus mesadas acumulan polvo y casi ningún cliente cruza la puerta.',
  },
  {
    icon: <UtensilsCrossed className="w-12 h-12 text-pink-600" />,
    tag: 'El Desafío',
    title: 'Las Recetas Secretas',
    story: 'Al entrar a la cocina, encuentras el antiguo recetario familiar intacto. Con ingredientes frescos y tus habilidades, puedes devolverle la vida a este rincón dulce y convertirlo en el orgullo de la comunidad.',
  },
  {
    icon: <Store className="w-12 h-12 text-pink-600" />,
    tag: 'El Gran Sueño',
    title: 'Hacia la Gran Apertura',
    story: 'Día tras día, atenderás a comensales exigentes, ganarás propinas, equiparás el local con hornos más potentes y desbloquearás creaciones deliciosas hasta celebrar la Gran Apertura oficial.',
  },
  {
    icon: <ChefHat className="w-12 h-12 text-pink-600" />,
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
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-6 select-none overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #fff1f2 0%, #fdf4ff 22%, #eff6ff 48%, #f0fdf4 72%, #fefce8 100%)',
      }}
    >
      {/* Glows y elementos flotantes golosineros de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full blur-3xl opacity-35"
          style={{ background: 'radial-gradient(circle, #f472b6 0%, #ec4899 50%, transparent 75%)' }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-[450px] h-[450px] rounded-full blur-3xl opacity-35"
          style={{ background: 'radial-gradient(circle, #fde047 0%, #f59e0b 50%, transparent 75%)' }}
        />
        <div className="absolute top-[15%] left-[8%] text-4xl opacity-75 drop-shadow-md select-none animate-bounce">
          🧁
        </div>
        <div className="absolute top-[20%] right-[10%] text-4xl opacity-75 drop-shadow-md select-none animate-pulse">
          🍩
        </div>
        <div className="absolute bottom-[20%] left-[10%] text-4xl opacity-75 drop-shadow-md select-none">
          🍬
        </div>
        <div className="absolute bottom-[15%] right-[12%] text-4xl opacity-75 drop-shadow-md select-none">
          🍓
        </div>
      </div>

      {/* Tarjeta Central del Storyboard */}
      <CandyCard
        variant="cream"
        className="relative flex flex-col items-center max-w-lg w-full p-7 sm:p-8 text-center z-10 border-4 border-pink-300 shadow-2xl animate-scale-in"
      >
        {/* Step dots */}
        <div className="flex items-center gap-2 mb-5">
          {SLIDES.map((_, idx) => (
            <div
              key={`dot-${idx}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-8 bg-gradient-to-r from-pink-500 to-rose-500 shadow-xs'
                  : 'w-2.5 bg-pink-200'
              }`}
            />
          ))}
        </div>

        {/* Big Icon Container */}
        <div className="h-24 w-24 rounded-3xl bg-pink-100/80 border-2 border-pink-200 flex items-center justify-center shadow-inner mb-3 transition-transform hover:scale-105">
          {slide.icon}
        </div>

        {/* Tag badge */}
        <CandyBadge variant="primary" size="md" className="mb-2">
          {slide.tag}
        </CandyBadge>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#451a03] mb-3">
          {slide.title}
        </h2>

        {/* Story Text */}
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-semibold mb-7 max-w-md">
          {slide.story}
        </p>

        {/* Actions */}
        <div className="w-full flex items-center justify-between gap-4 pt-3 border-t border-pink-100">
          <CandyButton
            variant="ghost"
            size="sm"
            onClick={onComplete}
          >
            Saltar Historia
          </CandyButton>

          <CandyButton
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4 ml-1" />}
            iconPosition="right"
            onClick={handleNext}
          >
            {currentSlide === SLIDES.length - 1 ? '¡Comenzar Día 1!' : 'Siguiente'}
          </CandyButton>
        </div>
      </CandyCard>
    </div>
  );
};
