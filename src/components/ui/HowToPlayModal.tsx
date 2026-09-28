'use client';

import React from 'react';
import { X, Navigation, MousePointer, Hand, Sparkles } from 'lucide-react';
import { RECIPES, INGREDIENTS } from '@/types/game';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      <div className="relative flex flex-col max-w-2xl w-full max-h-[90vh] rounded-3xl border-4 border-pink-300 bg-white/98 p-6 md:p-8 shadow-2xl overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <h2 className="text-2xl md:text-3xl font-black text-bakery-choco">
            Cómo Jugar a Azúcar Rush
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Guía rápida de controles, estaciones de cocina y recetas de pastelería.
        </p>

        {/* 1. Controles */}
        <div className="mb-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-pink-600 mb-3">
            1. Controles en Primera Persona
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-pink-50 border border-pink-200">
              <div className="flex items-center gap-2 font-black text-slate-800 text-sm mb-1">
                <Navigation className="w-4 h-4 text-pink-500" />
                <span>Teclado WASD</span>
              </div>
              <p className="text-xs text-slate-600">
                Camina libremente entre las mesadas de la pastelería.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-pink-50 border border-pink-200">
              <div className="flex items-center gap-2 font-black text-slate-800 text-sm mb-1">
                <MousePointer className="w-4 h-4 text-pink-500" />
                <span>Mouse (Mirar)</span>
              </div>
              <p className="text-xs text-slate-600">
                Mueve el mouse para apuntar la vista en 360°.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-pink-50 border border-pink-200">
              <div className="flex items-center gap-2 font-black text-slate-800 text-sm mb-1">
                <Hand className="w-4 h-4 text-pink-500" />
                <span>Tecla E / Click</span>
              </div>
              <p className="text-xs text-slate-600">
                Interactúa con ingredientes, batidora, horno y mostrador.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Ciclo de Cocina */}
        <div className="mb-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-pink-600 mb-3">
            2. El Ciclo de Pastelería
          </h3>
          <div className="space-y-2 text-xs text-slate-700 bg-amber-50/70 p-4 rounded-2xl border border-amber-200 font-medium leading-relaxed">
            <div><strong className="text-amber-900">1. Pedido:</strong> Llega un cliente al mostrador con su pedido y paciencia.</div>
            <div><strong className="text-amber-900">2. Ingredientes:</strong> Junta los ingredientes de la receta en tu bandeja con [E].</div>
            <div><strong className="text-amber-900">3. Mesa de Mezcla:</strong> Mantén [E] en la batidora hasta soltar en la zona verde.</div>
            <div><strong className="text-amber-900">4. Horno:</strong> Mete la masa en el horno. ¡Sácala cuando la barra esté verde antes de que se queme!</div>
            <div><strong className="text-amber-900">5. Decoración:</strong> Si lo requiere, dale el toque final con glaseado y toppings.</div>
            <div><strong className="text-amber-900">6. Entrega:</strong> Lleva el postre al mostrador y entrega con [E] para ganar dinero y puntos.</div>
          </div>
        </div>

        {/* 3. Libro de Recetas */}
        <div className="mb-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-pink-600 mb-3">
            3. Libro de Recetas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.values(RECIPES).map(rec => (
              <div
                key={rec.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-pink-100 bg-pink-50/40"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{rec.emoji}</span>
                  <div>
                    <div className="text-xs font-black text-slate-800">{rec.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {rec.ingredients.map(i => INGREDIENTS[i].name).join(' + ')}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-black text-pink-600">${rec.price}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg hover:brightness-105 active:scale-95 transition-all"
        >
          ¡Entendido, a Cocinar!
        </button>
      </div>
    </div>
  );
};
