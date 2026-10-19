'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Navigation,
  MousePointer,
  Hand,
  Flame,
  Cake,
  Gift,
  Gamepad2,
  ClipboardList,
  Package,
  UtensilsCrossed,
  Trash2,
  Heart,
  Timer,
} from 'lucide-react';
import { CandyModal, CandyButton, CandyCard, CandyBadge } from '@/components/ui/design-system';
import { sounds } from '@/utils/audio';

interface MiniTutorialModalProps {
  onComplete: () => void;
  onClose?: () => void;
}

interface TutorialStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge: string;
  badgeVariant: 'primary' | 'secondary' | 'accent' | 'warning' | 'success';
  content: React.ReactNode;
}

export const MiniTutorialModal: React.FC<MiniTutorialModalProps> = ({
  onComplete,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TutorialStep[] = [
    {
      stepNumber: 1,
      title: 'Controles y Movimiento',
      subtitle: 'Aprende a desplazarte por la cocina de la pastelería',
      icon: <Gamepad2 className="w-8 h-8 text-pink-600" />,
      badge: 'Básico',
      badgeVariant: 'accent',
      content: (
        <div className="flex flex-col gap-3 text-left w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Movimiento WASD */}
            <CandyCard variant="cream" className="p-3 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-pink-100 text-pink-600 mb-1.5 border border-pink-200">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="font-black text-xs text-[#451a03] mb-1">Moverse</div>
              <div className="flex gap-1 mb-1">
                <span className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono font-bold shadow-2xs">W</span>
                <span className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono font-bold shadow-2xs">A</span>
                <span className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono font-bold shadow-2xs">S</span>
                <span className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono font-bold shadow-2xs">D</span>
              </div>
              <p className="text-[10px] text-stone-600 leading-tight">Camina por la cocina</p>
            </CandyCard>

            {/* Vista con el Mouse */}
            <CandyCard variant="cream" className="p-3 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-100 text-purple-600 mb-1.5 border border-purple-200">
                <MousePointer className="w-4 h-4" />
              </div>
              <div className="font-black text-xs text-[#451a03] mb-1">Mirar / Apuntar</div>
              <div className="px-2 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono font-bold shadow-2xs mb-1">
                Mouse 360°
              </div>
              <p className="text-[10px] text-stone-600 leading-tight">Gira la vista 3D</p>
            </CandyCard>

            {/* Tecla de Interacción [E] */}
            <CandyCard variant="cream" className="p-3 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-100 text-amber-700 mb-1.5 border border-amber-200">
                <Hand className="w-4 h-4" />
              </div>
              <div className="font-black text-xs text-[#451a03] mb-1">Interactuar</div>
              <div className="flex gap-1 mb-1 items-center">
                <span className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono font-bold shadow-2xs">[E]</span>
                <span className="text-[10px] text-stone-400">/</span>
                <span className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono font-bold shadow-2xs">Click</span>
              </div>
              <p className="text-[10px] text-stone-600 leading-tight">Agarra, bate y sirve</p>
            </CandyCard>
          </div>

          <CandyCard variant="pink" className="p-3 text-xs text-pink-950 font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
            <span><strong>Tip:</strong> Haz click dentro de la pastelería 3D para mirar en primera persona y presiona <strong>ESC</strong> para pausar.</span>
          </CandyCard>
        </div>
      ),
    },
    {
      stepNumber: 2,
      title: 'El Pedido del Cliente',
      subtitle: 'Observa qué quiere cada comensal en el mostrador',
      icon: <ClipboardList className="w-8 h-8 text-pink-600" />,
      badge: 'Paso 1',
      badgeVariant: 'primary',
      content: (
        <div className="flex flex-col gap-3 text-left w-full">
          <CandyCard variant="cream" className="p-3.5 flex items-center gap-3.5 border-2 border-pink-300">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shrink-0">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black text-pink-600 uppercase tracking-wider">Orden Activa</div>
              <div className="text-sm font-black text-[#451a03]">1x Cupcake Dulce ($1.200)</div>
              <div className="text-xs text-stone-600 mt-0.5 font-medium">
                Ingredientes: Harina + Huevo + Leche + Frutilla
              </div>
            </div>
          </CandyCard>

          <CandyCard variant="amber" className="p-3 space-y-2 text-xs text-[#451a03]">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Barra de Paciencia:</strong> Cada cliente tiene un temporizador amplio. ¡Entrégalo rápido para ganar propinas extra!</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 shrink-0 fill-rose-500" />
              <span><strong>Corazones de Vida:</strong> Si un cliente se va enojado o entregas algo incorrecto, perderás una vida.</span>
            </div>
          </CandyCard>
        </div>
      ),
    },
    {
      stepNumber: 3,
      title: 'Recolectar Ingredientes',
      subtitle: 'Toma los ingredientes necesarios para la receta',
      icon: <Package className="w-8 h-8 text-amber-600" />,
      badge: 'Paso 2',
      badgeVariant: 'warning',
      content: (
        <div className="flex flex-col gap-2.5 text-left w-full">
          <p className="text-xs text-stone-600 font-semibold">
            Acércate a la estantería y presiona <kbd className="px-1.5 py-0.5 bg-amber-100 border border-amber-300 rounded font-mono font-bold text-amber-950">[E]</kbd> para colocar cada ingrediente en tu bandeja:
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { name: 'Harina', variant: 'warning' as const },
              { name: 'Huevo', variant: 'warning' as const },
              { name: 'Leche', variant: 'accent' as const },
              { name: 'Azúcar', variant: 'primary' as const },
              { name: 'Chocolate', variant: 'amber' as const },
              { name: 'Frutilla', variant: 'primary' as const },
            ].map(ing => (
              <div
                key={ing.name}
                className="p-2 rounded-xl border border-pink-200 bg-white/90 text-center flex flex-col items-center justify-center font-black text-xs text-[#451a03] shadow-2xs"
              >
                <span>{ing.name}</span>
              </div>
            ))}
          </div>

          <CandyCard variant="cream" className="p-3 text-xs text-stone-600 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-stone-500 shrink-0" />
            <span>¿Te equivocaste? Ve al <strong>Tacho de Basura</strong> y presiona [E] para vaciar tu bandeja.</span>
          </CandyCard>
        </div>
      ),
    },
    {
      stepNumber: 4,
      title: 'Batir en la Batidora Rosa',
      subtitle: 'Mezcla los ingredientes para crear masa lista para hornear',
      icon: <UtensilsCrossed className="w-8 h-8 text-purple-600" />,
      badge: 'Paso 3',
      badgeVariant: 'secondary',
      content: (
        <div className="flex flex-col gap-3 text-left w-full">
          <CandyCard variant="purple" className="p-3.5 flex items-center gap-3.5 border-2 border-purple-300">
            <div className="w-11 h-11 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-md shrink-0">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Estación de Mezcla</div>
              <div className="text-sm font-black text-purple-950">Batidora Pastelera Automática</div>
              <div className="text-xs text-purple-900 mt-0.5">
                Con los ingredientes correctos en la bandeja, acércate y presiona <kbd className="px-1.5 py-0.5 bg-white border border-purple-300 rounded font-bold text-purple-900">[E]</kbd>.
              </div>
            </div>
          </CandyCard>

          <CandyCard variant="cream" className="p-3 text-xs text-[#451a03] font-medium border-emerald-300 bg-emerald-50/70">
            La batidora procesará la mezcla en unos segundos y tu bandeja tendrá la <strong>Masa Cruda</strong> lista para hornear.
          </CandyCard>
        </div>
      ),
    },
    {
      stepNumber: 5,
      title: 'El Horno Pastelero',
      subtitle: 'Hornea a tiempo y no dejes que se queme',
      icon: <Flame className="w-8 h-8 text-rose-600" />,
      badge: 'Paso 4',
      badgeVariant: 'primary',
      content: (
        <div className="flex flex-col gap-3 text-left w-full">
          <CandyCard variant="pink" className="p-3.5 flex items-center gap-3.5 border-2 border-rose-300">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black text-rose-700 uppercase tracking-wider">Horno Profesional</div>
              <div className="text-sm font-black text-rose-950">Cocina tu postre</div>
              <div className="text-xs text-rose-900 mt-0.5 leading-relaxed">
                1. Presiona <kbd className="px-1 bg-white border rounded font-bold">[E]</kbd> para meter la masa.<br />
                2. Espera la campana de listo.<br />
                3. Sácalo con <kbd className="px-1 bg-white border rounded font-bold">[E]</kbd> antes de que se llene la barra roja y se queme.
              </div>
            </div>
          </CandyCard>

          <CandyCard variant="amber" className="p-2.5 text-xs text-amber-950 font-medium">
            <strong>Cuidado:</strong> Si el postre se quema, perderás una vida y tendrás que tirarlo al tacho de basura.
          </CandyCard>
        </div>
      ),
    },
    {
      stepNumber: 6,
      title: 'Decoración y Entrega',
      subtitle: 'Decora y entrega al cliente para ganar dinero y estrellas',
      icon: <Gift className="w-8 h-8 text-emerald-600" />,
      badge: 'Paso Final',
      badgeVariant: 'success',
      content: (
        <div className="flex flex-col gap-3 text-left w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <CandyCard variant="purple" className="p-3">
              <div className="flex items-center gap-1.5 font-black text-purple-950 text-xs mb-1">
                <Cake className="w-4 h-4 text-purple-600" />
                <span>1. Mesa de Decoración [E]</span>
              </div>
              <p className="text-[11px] text-purple-900 leading-snug">
                Los postres que requieren glaseado o toppings se decoran en la mesa interactiva para completarse.
              </p>
            </CandyCard>

            <CandyCard variant="cream" className="p-3 border-emerald-300 bg-emerald-50/70">
              <div className="flex items-center gap-1.5 font-black text-emerald-950 text-xs mb-1">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>2. Mostrador de Entrega [E]</span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-snug">
                Acércate al cliente y presiona [E] para entregar el pedido, cobrar dinero y ganar estrellas.
              </p>
            </CandyCard>
          </div>

          <CandyCard variant="pink" className="p-3 text-center font-black text-xs text-pink-900 border-pink-300">
            ¡Ya conoces todo el ciclo! Estás listo para abrir Azúcar Rush y convertirte en el mejor pastelero.
          </CandyCard>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    sounds.playPickup();
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    sounds.playPickup();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <CandyModal
      isOpen
      onClose={onClose || onComplete}
      title={current.title}
      subtitle={current.subtitle}
      icon={current.icon}
      maxWidth="xl"
      footer={
        <div className="w-full flex items-center justify-between gap-3">
          <div>
            {currentStep > 0 ? (
              <CandyButton
                variant="neutral"
                size="sm"
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
                onClick={handlePrev}
              >
                Anterior
              </CandyButton>
            ) : (
              <CandyButton
                variant="ghost"
                size="sm"
                onClick={onComplete}
              >
                Saltar Tutorial
              </CandyButton>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-stone-400">
              {currentStep + 1} de {steps.length}
            </span>

            <CandyButton
              variant="primary"
              size="md"
              icon={currentStep === steps.length - 1 ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? '¡Empezar a Jugar!' : 'Siguiente'}
            </CandyButton>
          </div>
        </div>
      }
    >
      <div className="flex flex-col items-center">
        {/* Step dots */}
        <div className="flex items-center gap-1.5 mb-4 w-full justify-center">
          {steps.map((_, idx) => (
            <button
              key={`step-dot-${idx}`}
              onClick={() => {
                sounds.playPickup();
                setCurrentStep(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-7 bg-pink-500 shadow-2xs'
                  : idx < currentStep
                  ? 'w-3 bg-pink-300'
                  : 'w-2 bg-stone-200'
              }`}
            />
          ))}
        </div>

        {/* Step badge */}
        <CandyBadge variant={current.badgeVariant} size="sm" className="mb-3">
          {current.badge}
        </CandyBadge>

        {/* Step content */}
        <div className="w-full min-h-[170px] flex items-center justify-center">
          {current.content}
        </div>
      </div>
    </CandyModal>
  );
};
