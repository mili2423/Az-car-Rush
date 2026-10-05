'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProductId, RECIPES } from '@/types/game';
import { sounds } from '@/utils/audio';

// ─── Decoración disponibles con colores y nombres ───────────────────────────
const ALL_DECORATIONS = [
  { id: 'pink_glaze',    name: 'Glaseado Rosa',      color: '#f472b6', emoji: '🌸' },
  { id: 'choco_glaze',   name: 'Glaseado Chocolate',  color: '#7c3aed', emoji: '🍫' },
  { id: 'blue_glaze',    name: 'Glaseado Celeste',    color: '#38bdf8', emoji: '💙' },
  { id: 'yellow_glaze',  name: 'Glaseado Limón',      color: '#facc15', emoji: '🍋' },
  { id: 'cream_glaze',   name: 'Glaseado Crema',      color: '#fde68a', emoji: '🍦' },
  { id: 'strawberries',  name: 'Frutillas Frescas',   color: '#e11d48', emoji: '🍓' },
  { id: 'sprinkles',     name: 'Chispas de Colores',  color: '#a855f7', emoji: '✨' },
  { id: 'candles',       name: 'Velitas de Fiesta',   color: '#f59e0b', emoji: '🕯️' },
  { id: 'cream',         name: 'Crema Chantilly',     color: '#ffffff', emoji: '🤍' },
  { id: 'caramel',       name: 'Caramelo Dorado',     color: '#d97706', emoji: '🍯' },
];

// Mapeo: qué decoración es la "correcta" para cada receta
const CORRECT_DECORATION: Record<ProductId, string[]> = {
  cookie:  [],
  pastry:  [],
  cupcake: ['choco_glaze', 'sprinkles'],
  donut:   ['pink_glaze'],
  tart:    ['strawberries', 'cream'],
  cake:    ['choco_glaze', 'candles'],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOptions(correctId: string): typeof ALL_DECORATIONS {
  const correct = ALL_DECORATIONS.find(d => d.id === correctId)!;
  const others = shuffle(ALL_DECORATIONS.filter(d => d.id !== correctId)).slice(0, 3);
  return shuffle([correct, ...others]);
}

interface DecorationMenuProps {
  recipeId: ProductId;
  onDecorate: (isCorrect: boolean) => void;
  onCancel: () => void;
}

export const DecorationMenu: React.FC<DecorationMenuProps> = ({
  recipeId,
  onDecorate,
  onCancel,
}) => {
  const recipe = RECIPES[recipeId];
  const steps = CORRECT_DECORATION[recipeId] ?? [];
  const [stepIndex, setStepIndex] = useState(0);
  const [wrongSelected, setWrongSelected] = useState<string | null>(null);
  const [correctSelected, setCorrectSelected] = useState<string | null>(null);
  const [allCorrect, setAllCorrect] = useState(true);

  const currentCorrectId = steps[stepIndex] ?? steps[0] ?? 'pink_glaze';
  const [options] = useState(() => buildOptions(currentCorrectId));

  // Rebuild options when step changes - we use a key trick to remount
  const stepOptions = buildOptions(steps[stepIndex] ?? currentCorrectId);

  const handlePick = useCallback((decId: string) => {
    const isCorrect = decId === (steps[stepIndex] ?? currentCorrectId);
    if (isCorrect) {
      sounds.playPickup();
      setCorrectSelected(decId);

      setTimeout(() => {
        if (stepIndex < steps.length - 1) {
          setStepIndex(s => s + 1);
          setCorrectSelected(null);
          setWrongSelected(null);
        } else {
          onDecorate(allCorrect);
        }
      }, 600);
    } else {
      sounds.playError();
      setWrongSelected(decId);
      setAllCorrect(false);
      // Let the player try again with the wrong one shaking, then auto-continue after 1s
      setTimeout(() => {
        setWrongSelected(null);
        // Still finish - mark as incorrectly decorated
        if (stepIndex >= steps.length - 1) {
          onDecorate(false);
        }
      }, 1000);
    }
  }, [stepIndex, steps, currentCorrectId, allCorrect, onDecorate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const currentStepCorrectId = steps[stepIndex] ?? currentCorrectId;
  const displayOptions = buildOptions(currentStepCorrectId);

  const stepLabel = steps.length > 1
    ? `Paso ${stepIndex + 1} de ${steps.length}`
    : 'Elige la decoración';

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="relative flex flex-col items-center rounded-3xl p-7 shadow-2xl max-w-sm w-full text-center"
        style={{
          background: 'rgba(255,252,245,0.98)',
          border: '2.5px solid #f9a8d4',
          boxShadow: '0 20px 60px rgba(180,80,120,0.25)',
        }}
      >
        {/* Header */}
        <div className="text-3xl mb-1 animate-bounce">{recipe.emoji}</div>
        <h3 className="text-xl font-black text-stone-800 mb-0.5">Mesa de Decoración</h3>
        <p className="text-xs text-stone-500 mb-1">
          Decorando: <span className="font-bold text-pink-600">{recipe.name}</span>
        </p>
        <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-5 bg-amber-50 border border-amber-200 rounded-full px-3 py-0.5">
          {stepLabel}
        </div>

        {/* 4 decoration options grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-5">
          {displayOptions.map(dec => {
            const isWrong = wrongSelected === dec.id;
            const isCorrectPick = correctSelected === dec.id;
            return (
              <button
                key={dec.id}
                onClick={() => !wrongSelected && !correctSelected && handlePick(dec.id)}
                className="flex flex-col items-center gap-1.5 p-4 rounded-2xl font-bold text-sm transition-all duration-150 active:scale-95 select-none"
                style={{
                  background: isCorrectPick
                    ? '#dcfce7'
                    : isWrong
                    ? '#fee2e2'
                    : `${dec.color}22`,
                  border: `2.5px solid ${
                    isCorrectPick ? '#86efac' : isWrong ? '#fca5a5' : dec.color
                  }`,
                  color: '#292524',
                  transform: isWrong ? 'translateX(-4px)' : 'none',
                  animation: isWrong ? 'shake 0.3s ease' : 'none',
                  boxShadow: isCorrectPick
                    ? '0 0 0 3px #22c55e44'
                    : isWrong
                    ? '0 0 0 3px #ef444444'
                    : 'none',
                }}
              >
                <span className="text-2xl">{dec.emoji}</span>
                <span className="text-[11px] font-black text-stone-700 leading-tight">{dec.name}</span>
                {isCorrectPick && <span className="text-[10px] text-green-600 font-black">✓ ¡Correcto!</span>}
                {isWrong && <span className="text-[10px] text-red-500 font-black">✗ Error</span>}
              </button>
            );
          })}
        </div>

        {/* Step indicator dots */}
        {steps.length > 1 && (
          <div className="flex gap-2 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: i < stepIndex ? '#22c55e' : i === stepIndex ? '#ec4899' : '#e5e7eb',
                  transform: i === stepIndex ? 'scale(1.4)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        )}

        <button
          onClick={onCancel}
          className="text-xs font-semibold text-stone-400 hover:text-stone-600 transition-colors"
        >
          Volver [ESC]
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
};
