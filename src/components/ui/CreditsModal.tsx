'use client';

import React from 'react';
import { CandyModal, CandyButton, CandyCard } from '@/components/ui/design-system';
import { Heart, Sparkles, Code2, Palette, Volume2 } from 'lucide-react';

interface CreditsModalProps {
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  // ─── NOMBRE DEL INSTITUTO (Fácil de editar) ─────────────────────────────────
  const NOMBRE_INSTITUTO = 'Instituto Técnico La Falda (ITLF)';

  return (
    <CandyModal
      isOpen
      onClose={onClose}
      title="Azúcar Rush"
      subtitle="Pastelería & Cafetería"
      icon={<div className="text-3xl animate-bounce">🧁</div>}
      maxWidth="md"
      footer={
        <CandyButton variant="primary" size="md" fullWidth onClick={onClose}>
          Cerrar Créditos
        </CandyButton>
      }
    >
      <div className="space-y-4">
        {/* Sección destacada del Instituto: MISMO ESTILO DE TARJETA QUE EN HOME */}
        <div className="flex flex-col items-center">
          <div
            className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl shadow-md transition-transform hover:scale-[1.02]"
            title={NOMBRE_INSTITUTO}
          >
            <img
              src="/img/logoNav.webp"
              alt={NOMBRE_INSTITUTO}
              className="h-8 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-amber-300 tracking-wider uppercase">
                Proyecto realizado en
              </span>
              <span className="text-xs font-black text-white">
                {NOMBRE_INSTITUTO}
              </span>
            </div>
          </div>
        </div>

        {/* Tarjetas informativas con CandyCard */}
        <CandyCard variant="cream" className="p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <Palette className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-black text-xs text-[#451a03]">Concepto & Experiencia:</div>
              <div className="text-xs text-stone-600 mt-0.5 leading-snug">
                Pastelería en primera persona que combina la adrenalina y rapidez de los clásicos de cocina con gráficos 3D envolventes y controles intuitivos.
              </div>
            </div>
          </div>

          <div className="h-px bg-pink-100" />

          <div className="flex items-start gap-2.5">
            <Code2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-black text-xs text-[#451a03]">Desarrollo & Tecnologías:</div>
              <div className="text-xs text-stone-600 mt-0.5 leading-snug">
                Construido con Next.js 14, React, Three.js, React Three Fiber, React Three Drei y Tailwind CSS.
              </div>
            </div>
          </div>

          <div className="h-px bg-pink-100" />

          <div className="flex items-start gap-2.5">
            <Volume2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-black text-xs text-[#451a03]">Música y Efectos Sonoros:</div>
              <div className="text-xs text-stone-600 mt-0.5 leading-snug">
                Sintetizador procedural en tiempo real mediante Web Audio API para una respuesta instantánea y liviana.
              </div>
            </div>
          </div>
        </CandyCard>
      </div>
    </CandyModal>
  );
};
