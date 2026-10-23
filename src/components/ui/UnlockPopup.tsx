'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ProductId, RECIPES } from '@/types/game';
import { CandyButton } from '@/components/ui/design-system';
import { releaseGamePointerLock } from '@/utils/mouseManager';

interface UnlockPopupProps {
  /** Lista de productos a mostrar en secuencia */
  products: ProductId[];
  onClose: () => void;
}

const PARTICLE_COUNT = 28;
const COLORS = ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#34d399', '#60a5fa', '#f472b6'];

function Particles() {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * 360;
    const dist = 80 + Math.random() * 80;
    const size = 6 + Math.random() * 8;
    const color = COLORS[i % COLORS.length];
    return { angle, dist, size, color, delay: Math.random() * 0.3 };
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-0"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            top: '50%',
            left: '50%',
            animation: `particle-burst 1.2s ease-out ${p.delay}s forwards`,
            '--dx': `${Math.cos((p.angle * Math.PI) / 180) * p.dist}px`,
            '--dy': `${Math.sin((p.angle * Math.PI) / 180) * p.dist}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export const UnlockPopup: React.FC<UnlockPopupProps> = ({ products, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const current = products[currentIdx];
  const recipe = current ? RECIPES[current] : null;
  const isLast = currentIdx === products.length - 1;

  // Liberar el pointer lock al abrir el popup
  useEffect(() => {
    releaseGamePointerLock();
  }, []);

  // Fase de entrada animada
  useEffect(() => {
    setPhase('enter');
    timerRef.current = setTimeout(() => setPhase('show'), 50);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentIdx]);

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  if (!recipe) return null;

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  return (
    <>
      {/* Estilos de partículas */}
      <style>{`
        @keyframes particle-burst {
          0%   { opacity: 1; transform: translate(0,0) scale(1); }
          80%  { opacity: 0.8; transform: translate(var(--dx), var(--dy)) scale(0.6); }
          100% { opacity: 0; transform: translate(calc(var(--dx)*1.3), calc(var(--dy)*1.3)) scale(0); }
        }
        @keyframes unlock-enter {
          0%   { opacity: 0; transform: scale(0.7) rotate(-3deg); }
          60%  { transform: scale(1.06) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes emoji-spin {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 24px 8px rgba(236,72,153,0.5); }
          50%       { box-shadow: 0 0 48px 16px rgba(168,85,247,0.6); }
        }
      `}</style>

      {/* Overlay */}
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: 'rgba(30,0,20,0.72)', backdropFilter: 'blur(6px)' }}
      >
        {/* Card */}
        <div
          className="relative flex flex-col items-center gap-5 rounded-3xl px-8 py-8 max-w-sm w-full mx-4 overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #fff7f0 0%, #fce7f3 50%, #f3e8ff 100%)',
            border: '3px solid #f9a8d4',
            animation: prefersReducedMotion ? 'none' : (phase === 'enter' ? 'unlock-enter 0.55s cubic-bezier(0.175,0.885,0.32,1.275) forwards' : 'none'),
            animationFillMode: 'forwards',
          }}
        >
          {/* Partículas de confeti */}
          {!prefersReducedMotion && <Particles key={currentIdx} />}

          {/* Badge "Nuevo desbloqueo" */}
          <div
            className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs tracking-widest uppercase text-white"
            style={{ background: 'linear-gradient(90deg, #ec4899, #a855f7)' }}
          >
            <span>🔓</span>
            <span>¡Nuevo Producto!</span>
          </div>

          {/* Emoji grande girando */}
          <div
            className="relative z-10 text-7xl select-none"
            style={{
              animation: prefersReducedMotion ? 'none' : 'emoji-spin 2.5s ease-in-out infinite',
              filter: 'drop-shadow(0 6px 18px rgba(236,72,153,0.5))',
            }}
            aria-label={recipe.name}
          >
            {recipe.emoji}
          </div>

          {/* Nombre del producto */}
          <div className="relative z-10 text-center">
            <div
              className="text-2xl font-black mb-1"
              style={{ color: '#451a03', textShadow: '0 2px 8px rgba(236,72,153,0.2)' }}
            >
              {recipe.name}
            </div>
            <div className="text-sm font-bold text-pink-600">
              Precio: <span className="font-black text-emerald-600">${recipe.price}</span>
            </div>
          </div>

          {/* Receta */}
          <div
            className="relative z-10 w-full rounded-2xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.8)', border: '1.5px solid #f9a8d4' }}
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-2 text-center">
              Receta
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 mb-2">
              {recipe.ingredients.map(ingId => (
                <span
                  key={ingId}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black text-[#451a03] bg-pink-50 border border-pink-200"
                >
                  {ingId === 'flour' ? '🌾' : ingId === 'egg' ? '🥚' : ingId === 'milk' ? '🥛' : ingId === 'sugar' ? '🍬' : ingId === 'chocolate' ? '🍫' : '🍓'}
                  {' '}{ingId === 'flour' ? 'Harina' : ingId === 'egg' ? 'Huevo' : ingId === 'milk' ? 'Leche' : ingId === 'sugar' ? 'Azúcar' : ingId === 'chocolate' ? 'Chocolate' : 'Frutilla'}
                </span>
              ))}
            </div>
            <div className="text-[10px] text-center text-stone-500 font-bold">
              Mezclar → Hornear ({recipe.bakeTimeSeconds}s)
              {recipe.requiresDecoration && <span className="text-pink-600"> → Decorar</span>}
            </div>
          </div>

          {/* Progreso si hay varios productos */}
          {products.length > 1 && (
            <div className="relative z-10 flex gap-1.5">
              {products.map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ background: i === currentIdx ? '#ec4899' : '#fce7f3', border: '1px solid #f9a8d4' }}
                />
              ))}
            </div>
          )}

          {/* Botón */}
          <div className="relative z-10 w-full">
            <CandyButton
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNext}
            >
              {isLast ? '¡Entendido! →' : `Siguiente (${currentIdx + 1}/${products.length})`}
            </CandyButton>
          </div>
        </div>
      </div>
    </>
  );
};
