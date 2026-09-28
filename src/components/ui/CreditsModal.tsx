'use client';

import React from 'react';
import { X, Heart, Sparkles } from 'lucide-react';

interface CreditsModalProps {
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      <div className="relative flex flex-col items-center max-w-md w-full rounded-3xl border-4 border-pink-300 bg-white/98 p-8 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-4xl mb-2 animate-bounce">🧁</div>
        <h2 className="text-2xl font-black text-bakery-choco mb-1">
          Azúcar Rush
        </h2>
        <p className="text-xs text-pink-600 font-bold uppercase tracking-wider mb-6">
          Juego 3D en Primera Persona de Pastelería
        </p>

        <div className="space-y-4 text-xs text-slate-600 mb-8 w-full text-left bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
          <div>
            <div className="font-bold text-slate-800">Diseño & Concepto Original:</div>
            <div>Inspirado en la emoción y rapidez de los juegos de cocina tipo Overcooked, adaptado a 3D inmersivo.</div>
          </div>
          <div>
            <div className="font-bold text-slate-800">Stack Tecnológico:</div>
            <div>Next.js, TypeScript, Three.js, React Three Fiber (@react-three/fiber), @react-three/drei, Tailwind CSS.</div>
          </div>
          <div>
            <div className="font-bold text-slate-800">Efectos Sonoros y Música:</div>
            <div>Sintetizador procedural en tiempo real con Web Audio API.</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg hover:brightness-105 active:scale-95 transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
