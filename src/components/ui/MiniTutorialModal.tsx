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
  X,
  Gamepad2,
  ClipboardList,
  Package,
  UtensilsCrossed,
  Trash2,
  Heart,
  Timer,
} from 'lucide-react';
import { sounds } from '@/utils/audio';

/**
 * ============================================================================
 * MODAL DE MINI TUTORIAL INTERACTIVO (6 PASOS) - ESTILO LIMPIO SIN EMOJIS
 * ============================================================================
 */

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
  badgeColor: string;
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
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      content: (
        <div className="flex flex-col gap-4 text-left w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Movimiento WASD */}
            <div className="p-3.5 rounded-2xl bg-pink-50/80 border border-pink-200 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-pink-200 mb-2">
                <Navigation className="w-5 h-5 text-pink-500" />
              </div>
              <div className="font-black text-slate-800 text-sm mb-1">Moverse</div>
              <div className="flex gap-1 mb-1.5">
                <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold shadow-xs">W</span>
                <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold shadow-xs">A</span>
                <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold shadow-xs">S</span>
                <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold shadow-xs">D</span>
              </div>
              <p className="text-[11px] text-slate-600">Camina por la cocina</p>
            </div>

            {/* Vista con el Mouse */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-amber-200 mb-2">
                <MousePointer className="w-5 h-5 text-amber-500" />
              </div>
              <div className="font-black text-slate-800 text-sm mb-1">Mirar / Apuntar</div>
              <div className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold shadow-xs mb-1.5">
                Mouse 360°
              </div>
              <p className="text-[11px] text-slate-600">Gira la vista en primera persona</p>
            </div>

            {/* Tecla de Interacción [E] */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-emerald-200 mb-2">
                <Hand className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="font-black text-slate-800 text-sm mb-1">Interactuar</div>
              <div className="flex gap-1 mb-1.5">
                <span className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold shadow-xs">[E]</span>
                <span className="text-xs text-slate-400">o</span>
                <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-mono font-bold shadow-xs">Click</span>
              </div>
              <p className="text-[11px] text-slate-600">Agarra, bate, hornea y entrega</p>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-pink-100/60 border border-pink-200 text-xs text-pink-900 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
            <span><strong>Tip:</strong> Haz click dentro de la pantalla 3D para activar el control del mouse y presiona <strong>ESC</strong> para pausar.</span>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 2,
      title: 'El Pedido del Cliente',
      subtitle: 'Observa qué quiere cada comensal en el mostrador',
      icon: <ClipboardList className="w-8 h-8 text-pink-600" />,
      badge: 'Paso 1',
      badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
      content: (
        <div className="flex flex-col gap-3 text-left w-full">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Cake className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-pink-600 uppercase tracking-wider">Orden Activa</div>
              <div className="text-base font-black text-slate-800">1x Cupcake Dulce ($1.200)</div>
              <div className="text-xs text-slate-600 mt-0.5">
                Ingredientes: Harina + Huevo + Leche + Frutilla
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Barra de Paciencia:</strong> Cada cliente tiene un temporizador amplio. ¡Entrégalo rápido para ganar propinas extra!</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 shrink-0 fill-rose-500" />
              <span><strong>Corazones de Vida:</strong> Si un cliente se va enojado o entregas algo incorrecto, perderás una vida.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 3,
      title: 'Recolectar Ingredientes',
      subtitle: 'Toma los ingredientes necesarios para la receta',
      icon: <Package className="w-8 h-8 text-amber-600" />,
      badge: 'Paso 2',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
      content: (
        <div className="flex flex-col gap-3 text-left w-full">
          <p className="text-xs text-slate-600 font-medium">
            Acércate a la estantería de ingredientes y presiona <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-800">[E]</kbd> para colocar cada uno en tu bandeja (máximo 5):
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { name: 'Harina', color: 'bg-amber-50 text-amber-900 border-amber-200' },
              { name: 'Huevo', color: 'bg-yellow-50 text-yellow-900 border-yellow-200' },
              { name: 'Leche', color: 'bg-blue-50 text-blue-900 border-blue-200' },
              { name: 'Azúcar', color: 'bg-pink-50 text-pink-900 border-pink-200' },
              { name: 'Chocolate', color: 'bg-amber-100 text-amber-950 border-amber-300' },
              { name: 'Frutilla', color: 'bg-rose-50 text-rose-900 border-rose-200' },
            ].map(ing => (
              <div key={ing.name} className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center font-bold text-xs shadow-xs ${ing.color}`}>
                <span>{ing.name}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-slate-500 shrink-0" />
            <span>¿Te equivocaste de ingrediente? Ve al <strong>Tacho de Basura</strong> y presiona [E] para limpiar tu bandeja.</span>
          </div>
        </div>
      ),
    },
    {
      stepNumber: 4,
      title: 'Batir en la Batidora Rosa',
      subtitle: 'Mezcla los ingredientes para crear masa lista para hornear',
      icon: <UtensilsCrossed className="w-8 h-8 text-purple-600" />,
      badge: 'Paso 3',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      content: (
        <div className="flex flex-col gap-3 text-left w-full">
          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-md shrink-0">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-purple-600 uppercase tracking-wider">Estación de Mezcla</div>
              <div className="text-sm font-black text-slate-800">Batidora Pastelera Automática</div>
              <div className="text-xs text-slate-600 mt-1">
                Con los ingredientes correctos en tu bandeja, acércate y presiona <kbd className="px-1.5 py-0.5 bg-white border border-purple-300 rounded font-bold text-purple-800">[E]</kbd>.
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
            La batidora procesará la mezcla en unos segundos y tu bandeja tendrá la <strong>Masa Cruda</strong> lista para hornear.
          </div>
        </div>
      ),
    },
    {
      stepNumber: 5,
      title: 'El Horno Pastelero',
      subtitle: 'Hornea a tiempo y no dejes que se queme',
      icon: <Flame className="w-8 h-8 text-rose-600" />,
      badge: 'Paso 4',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
      content: (
        <div className="flex flex-col gap-3 text-left w-full">
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black text-rose-600 uppercase tracking-wider">Horno Profesional</div>
              <div className="text-sm font-black text-slate-800">Cocina tu postre</div>
              <div className="text-xs text-slate-600 mt-1">
                1. Presiona <kbd className="px-1 bg-white border rounded font-bold">[E]</kbd> para meter la masa cruda.<br />
                2. Espera la campana de listo.<br />
                3. Sácalo con <kbd className="px-1 bg-white border rounded font-bold">[E]</kbd> antes de que se llene la barra roja y se queme.
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
            <strong>Cuidado:</strong> Si el postre se quema, perderás una vida y tendrás que tirarlo al tacho de basura.
          </div>
        </div>
      ),
    },
    {
      stepNumber: 6,
      title: 'Decoración y Entrega',
      subtitle: 'Decora y entrega al cliente para ganar dinero y estrellas',
      icon: <Gift className="w-8 h-8 text-emerald-600" />,
      badge: 'Paso Final',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      content: (
        <div className="flex flex-col gap-3 text-left w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200">
              <div className="flex items-center gap-2 font-black text-purple-900 text-sm mb-1">
                <Cake className="w-4 h-4 text-purple-600" />
                <span>1. Mesa de Decoración [E]</span>
              </div>
              <p className="text-xs text-slate-600">
                Los cupcakes, donuts y tartas requieren glaseado o toppings en la mesa de decoración para completarse.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <div className="flex items-center gap-2 font-black text-emerald-900 text-sm mb-1">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>2. Mostrador de Entrega [E]</span>
              </div>
              <p className="text-xs text-slate-600">
                Acércate al mostrador frente al cliente y presiona [E] para entregar el pedido, ganar dinero y sumar estrellas.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white text-center font-bold text-xs shadow-md">
            ¡Ya conoces todo el ciclo! Estás listo para abrir Azúcar Rush y convertirte en el mejor pastelero.
          </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 select-none">
      <div className="relative flex flex-col items-center max-w-xl w-full rounded-3xl border-4 border-pink-300 bg-white/98 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Botón de cerrar */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Indicadores de bolitas de progreso */}
        <div className="flex items-center gap-1.5 mb-5 w-full justify-center">
          {steps.map((s, idx) => (
            <button
              key={`step-pill-${idx}`}
              onClick={() => {
                sounds.playPickup();
                setCurrentStep(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-8 bg-pink-500 shadow-xs'
                  : idx < currentStep
                  ? 'w-3 bg-pink-300'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Icono e insignia del paso */}
        <div className="relative mb-3">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-pink-100 to-rose-50 border-2 border-pink-200 flex items-center justify-center shadow-inner">
            {current.icon}
          </div>
          <span
            className={`absolute -bottom-2 -right-2 text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-xs ${current.badgeColor}`}
          >
            {current.badge}
          </span>
        </div>

        {/* Título y subtítulo */}
        <h2 className="text-xl md:text-2xl font-black text-slate-800 text-center mb-1">
          {current.title}
        </h2>
        <p className="text-xs text-slate-500 text-center mb-5 font-medium max-w-md">
          {current.subtitle}
        </p>

        {/* Contenido visual de cada paso */}
        <div className="w-full mb-6 min-h-[170px] flex items-center justify-center">
          {current.content}
        </div>

        {/* Botones de navegación inferior */}
        <div className="w-full flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div>
            {currentStep > 0 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors px-2 py-1"
              >
                Saltar Tutorial
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              {currentStep + 1} de {steps.length}
            </span>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs md:text-sm bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25 hover:brightness-105 active:scale-95 transition-all"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Empezar a Jugar!</span>
                </>
              ) : (
                <>
                  <span>Siguiente</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
