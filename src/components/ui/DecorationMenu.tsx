'use client';

import React, { useEffect } from 'react';
import { ProductId, RECIPES } from '@/types/game';
import { sounds } from '@/utils/audio';

interface DecorationMenuProps {
  recipeId: ProductId;
  onDecorate: () => void;
  onCancel: () => void;
}

export const DecorationMenu: React.FC<DecorationMenuProps> = ({
  recipeId,
  onDecorate,
  onCancel,
}) => {
  const recipe = RECIPES[recipeId];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
        sounds.playPickup();
        onDecorate();
      } else if (e.code === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDecorate, onCancel]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative flex flex-col items-center rounded-3xl border-4 border-pink-300 bg-white/95 p-8 shadow-2xl max-w-sm w-full text-center">
        <div className="text-4xl mb-2 animate-bounce">🎨</div>
        <h3 className="text-2xl font-black text-bakery-choco mb-1">
          Mesa de Decoración
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Aplica el toque final a tu <span className="font-bold text-bakery-pink-dark">{recipe.name}</span>
        </p>

        {/* Selected Product Card */}
        <div className="w-full flex items-center justify-between p-4 mb-6 rounded-2xl bg-pink-50 border-2 border-pink-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{recipe.emoji}</span>
            <div className="text-left">
              <div className="font-black text-gray-800 text-sm">{recipe.name}</div>
              <div className="text-xs font-semibold text-pink-600">
                Topping: {recipe.decorationName || 'Glaseado Artesanal'}
              </div>
            </div>
          </div>
          <span className="text-xs bg-pink-200 text-pink-800 font-bold px-2.5 py-1 rounded-full">
            Requerido
          </span>
        </div>

        <button
          onClick={() => {
            sounds.playPickup();
            onDecorate();
          }}
          className="w-full py-3.5 rounded-2xl font-black text-lg bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg hover:brightness-105 active:scale-95 transition-transform"
        >
          Decorar y Terminar [E]
        </button>

        <button
          onClick={onCancel}
          className="mt-4 text-xs font-semibold text-gray-400 hover:text-gray-700"
        >
          Volver [ESC]
        </button>
      </div>
    </div>
  );
};
