'use client';

import React from 'react';
import { INGREDIENTS, IngredientId, TrayState, OvenState, CustomerOrder, RECIPES } from '@/types/game';

interface CrosshairProps {
  focusedObject: string | null;
  tray: TrayState;
  ovenState: OvenState;
  currentOrder: CustomerOrder | null;
  isMixing?: boolean;
}

export const Crosshair: React.FC<CrosshairProps> = ({
  focusedObject,
  tray,
  ovenState,
  currentOrder,
  isMixing = false,
}) => {
  const getActionPrompt = (): { action: string; key: string; color: string } | null => {
    if (!focusedObject) return null;

    if (isMixing) {
      return {
        action: 'Mezclando en la Batidora... 🥣',
        key: '⏳',
        color: 'from-pink-500 to-amber-400',
      };
    }

    // 1. Ingredients
    if (focusedObject in INGREDIENTS) {
      const ing = INGREDIENTS[focusedObject as IngredientId];
      return {
        action: `Tomar ${ing.name} ${ing.emoji}`,
        key: 'E',
        color: 'from-amber-400 to-amber-500',
      };
    }

    // 2. Mixer
    if (focusedObject === 'mixer') {
      if (tray.type === 'ingredients') {
        return {
          action: 'Batir Ingredientes 🥣',
          key: 'E',
          color: 'from-pink-500 to-rose-400',
        };
      }
      if (tray.type === 'mixed_dough') {
        return {
          action: 'Masa ya batida (ir al horno 🔥)',
          key: 'E',
          color: 'from-slate-500 to-slate-600',
        };
      }
      return {
        action: 'Mesa de Mezcla 🥣',
        key: 'E',
        color: 'from-pink-400 to-rose-400',
      };
    }

    // 3. Oven
    if (focusedObject === 'oven') {
      if (ovenState.isCooking) {
        if (ovenState.isBurnt) {
          return {
            action: '¡Sacar quemado del Horno! ⚠️',
            key: 'E',
            color: 'from-red-600 to-rose-600',
          };
        }
        if (ovenState.isReady) {
          return {
            action: '¡Sacar del Horno! (Listo ✨)',
            key: 'E',
            color: 'from-emerald-500 to-green-600',
          };
        }
        return {
          action: 'Horneando... ⏳',
          key: 'E',
          color: 'from-orange-500 to-amber-500',
        };
      } else {
        if (tray.type === 'mixed_dough') {
          return {
            action: 'Meter Masa al Horno 🔥',
            key: 'E',
            color: 'from-pink-500 to-rose-500',
          };
        }
        return {
          action: 'Horno Pastelero 🔥',
          key: 'E',
          color: 'from-amber-500 to-orange-500',
        };
      }
    }

    // 4. Decorating
    if (focusedObject === 'decorating') {
      if (tray.type === 'baked') {
        const recipe = RECIPES[tray.recipeId];
        if (recipe.requiresDecoration) {
          return {
            action: `Decorar ${recipe.name} 🎨`,
            key: 'E',
            color: 'from-purple-500 to-pink-500',
          };
        }
      }
      if (tray.type === 'finished') {
        return {
          action: 'Decoración lista (ir al mostrador 🎁)',
          key: 'E',
          color: 'from-slate-500 to-slate-600',
        };
      }
      return {
        action: 'Mesa de Decoración 🎨',
        key: 'E',
        color: 'from-purple-400 to-pink-400',
      };
    }

    // 5. Service Counter
    if (focusedObject === 'counter') {
      if (tray.type === 'finished' || tray.type === 'baked') {
        const isTarget = currentOrder?.items.includes(tray.recipeId);
        return {
          action: isTarget ? '¡Entregar Pedido! 🎁' : 'Entregar (Verifica pedido)',
          key: 'E',
          color: isTarget ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-orange-500',
        };
      }
      return {
        action: 'Mostrador de Clientes 🛎️',
        key: 'E',
        color: 'from-amber-500 to-amber-600',
      };
    }

    // 6. Trash
    if (focusedObject === 'trash') {
      if (tray.type !== 'empty') {
        return {
          action: 'Descartar a la Basura 🗑️',
          key: 'E',
          color: 'from-red-500 to-rose-500',
        };
      }
      return {
        action: 'Tacho de Basura 🗑️',
        key: 'E',
        color: 'from-slate-600 to-slate-700',
      };
    }

    return null;
  };

  const prompt = getActionPrompt();
  const isActionable = prompt && prompt.key === 'E';

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      {/* Center dot / crosshair */}
      <div
        className={`relative flex items-center justify-center transition-transform duration-150 ${
          isActionable ? 'scale-125' : 'scale-100'
        }`}
      >
        <div
          className={`h-2.5 w-2.5 rounded-full shadow-lg transition-colors ${
            isActionable
              ? 'bg-amber-300 ring-4 ring-pink-500/80 ring-offset-2 ring-offset-black/20 animate-pulse'
              : 'bg-white/85 ring-2 ring-black/40'
          }`}
        />

        {/* Crosshair guide lines */}
        {!isActionable && (
          <>
            <div className="absolute -left-3.5 h-0.5 w-2 bg-white/70 shadow-sm" />
            <div className="absolute -right-3.5 h-0.5 w-2 bg-white/70 shadow-sm" />
            <div className="absolute -top-3.5 h-2 w-0.5 bg-white/70 shadow-sm" />
            <div className="absolute -bottom-3.5 h-2 w-0.5 bg-white/70 shadow-sm" />
          </>
        )}

        {/* Rich Action Prompt Badge */}
        {prompt && (
          <div className="absolute top-8 flex flex-col items-center whitespace-nowrap animate-scale-in">
            <div className="flex items-center gap-2 rounded-full bg-slate-900/90 px-3.5 py-1.5 text-xs font-black text-white shadow-2xl backdrop-blur-md border border-white/20">
              {prompt.key === 'E' ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-[11px] font-black text-white shadow-md">
                  E
                </span>
              ) : (
                <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[9px] font-bold text-slate-300">
                  {prompt.key}
                </span>
              )}
              <span className="tracking-wide">{prompt.action}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
