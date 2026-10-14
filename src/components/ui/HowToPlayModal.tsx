'use client';

import React from 'react';
import { CandyModal, CandyButton, CandyCard, CandyBadge } from '@/components/ui/design-system';
import { Navigation, MousePointer, Hand, Sparkles, ChefHat, BookOpen, Flame, UtensilsCrossed } from 'lucide-react';
import { RECIPES, INGREDIENTS } from '@/types/game';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <CandyModal
      isOpen
      onClose={onClose}
      title="Cómo Jugar a Azúcar Rush"
      subtitle="Guía rápida de controles, estaciones de cocina y recetas de pastelería."
      icon={<BookOpen className="w-6 h-6 text-pink-600" />}
      maxWidth="xl"
      footer={
        <CandyButton variant="primary" size="lg" fullWidth onClick={onClose}>
          ¡Entendido, a Cocinar!
        </CandyButton>
      }
    >
      <div className="space-y-5">
        {/* 1. Controles en Primera Persona */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <CandyBadge variant="primary" size="sm">Paso 1</CandyBadge>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#451a03]">
              Controles en Primera Persona
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <CandyCard variant="cream" className="p-3.5 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-pink-100 text-pink-600 mb-2 border border-pink-200">
                <Navigation className="w-5 h-5" />
              </div>
              <div className="font-black text-xs text-[#451a03] mb-1">Teclado WASD</div>
              <p className="text-[11px] text-stone-600 leading-tight">
                Camina libremente entre las mesadas de la cocina.
              </p>
            </CandyCard>

            <CandyCard variant="cream" className="p-3.5 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-100 text-purple-600 mb-2 border border-purple-200">
                <MousePointer className="w-5 h-5" />
              </div>
              <div className="font-black text-xs text-[#451a03] mb-1">Mouse (Mirar)</div>
              <p className="text-[11px] text-stone-600 leading-tight">
                Mueve el mouse para apuntar la vista en 360°.
              </p>
            </CandyCard>

            <CandyCard variant="cream" className="p-3.5 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-100 text-amber-700 mb-2 border border-amber-200">
                <Hand className="w-5 h-5" />
              </div>
              <div className="font-black text-xs text-[#451a03] mb-1">Tecla [E] / Click</div>
              <p className="text-[11px] text-stone-600 leading-tight">
                Interactúa con ingredientes, batidora, horno y clientes.
              </p>
            </CandyCard>
          </div>
        </div>

        {/* 2. Ciclo de Pastelería */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <CandyBadge variant="secondary" size="sm">Paso 2</CandyBadge>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#451a03]">
              El Ciclo de la Pastelería
            </h3>
          </div>

          <CandyCard variant="amber" className="p-4 space-y-2 text-xs text-[#451a03] font-medium leading-relaxed">
            <div><strong className="text-amber-950 font-black">1. Pedido:</strong> Llega un cliente al mostrador con su pedido y paciencia.</div>
            <div><strong className="text-amber-950 font-black">2. Ingredientes:</strong> Junta los ingredientes de la receta en tu bandeja con [E].</div>
            <div><strong className="text-amber-950 font-black">3. Mesa de Mezcla:</strong> Mantén [E] en la batidora hasta soltar en la zona verde.</div>
            <div><strong className="text-amber-950 font-black">4. Horno:</strong> Mete la masa en el horno. ¡Sácala cuando la barra esté verde antes de que se queme!</div>
            <div><strong className="text-amber-950 font-black">5. Decoración:</strong> Si lo requiere, dale el toque final en la mesa con glaseado y toppings.</div>
            <div><strong className="text-amber-950 font-black">6. Entrega:</strong> Lleva el postre al mostrador y entrega con [E] para ganar dinero y puntos.</div>
          </CandyCard>
        </div>

        {/* 3. Libro de Recetas */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <CandyBadge variant="accent" size="sm">Paso 3</CandyBadge>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#451a03]">
              Libro de Recetas
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.values(RECIPES).map(rec => (
              <CandyCard
                key={rec.id}
                variant="cream"
                className="p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{rec.emoji}</span>
                  <div>
                    <div className="text-xs font-black text-[#451a03]">{rec.name}</div>
                    <div className="text-[10px] font-semibold text-stone-500 mt-0.5">
                      {rec.ingredients.map(i => INGREDIENTS[i].name).join(' + ')}
                    </div>
                  </div>
                </div>
                <CandyBadge variant="warning" size="sm">
                  ${rec.price}
                </CandyBadge>
              </CandyCard>
            ))}
          </div>
        </div>
      </div>
    </CandyModal>
  );
};
