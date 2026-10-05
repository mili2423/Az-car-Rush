'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { ProductId, RECIPES } from '@/types/game';
import { sounds } from '@/utils/audio';
import { Product3DItem } from '@/components/3d/HeldItem3D';

// ─── Decoración disponibles con colores y nombres ───────────────────────────
const ALL_DECORATIONS = [
  { id: 'Glaseado Rosa',      color: '#f472b6', emoji: '🌸' },
  { id: 'Glaseado Violeta',   color: '#a855f7', emoji: '💜' },
  { id: 'Glaseado Celeste',   color: '#38bdf8', emoji: '💙' },
  { id: 'Glaseado Limón',     color: '#facc15', emoji: '🍋' },
  { id: 'Crema Chantilly',    color: '#ffffff', emoji: '🤍' },
  { id: 'Frutillas Frescas',  color: '#e11d48', emoji: '🍓' },
  { id: 'Chispas de Colores', color: '#a855f7', emoji: '✨' },
  { id: 'Velitas de Fiesta',  color: '#f59e0b', emoji: '🕯️' },
  { id: 'Caramelo Dorado',    color: '#d97706', emoji: '🍯' },
];

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
  const steps = recipe.decorationSteps || [];
  const [stepIndex, setStepIndex] = useState(0);
  const [wrongSelected, setWrongSelected] = useState<string | null>(null);
  const [isIncorrect, setIsIncorrect] = useState(false);

  const handlePick = useCallback((decId: string) => {
    if (stepIndex >= steps.length) return;

    const correctId = steps[stepIndex];
    if (decId === correctId) {
      sounds.playPickup();
      const nextStep = stepIndex + 1;
      setStepIndex(nextStep);

      if (nextStep >= steps.length) {
        // Wait a bit to let them see the finished product before closing
        setTimeout(() => {
          onDecorate(!isIncorrect);
        }, 1200);
      }
    } else {
      sounds.playError();
      setWrongSelected(decId);
      setIsIncorrect(true);
      
      // Let the player try again after a short delay
      setTimeout(() => {
        setWrongSelected(null);
      }, 600);
    }
  }, [stepIndex, steps, isIncorrect, onDecorate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col w-full max-w-4xl h-[90vh] bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-500">
        
        {/* Header */}
        <div className="bg-pink-600 text-white p-4 text-center shadow-md relative z-10">
          <h2 className="text-2xl font-black tracking-wide uppercase">Estación de Decoración</h2>
          <p className="text-pink-100 font-medium">Pedido: {recipe.name}</p>
          <button 
            onClick={onCancel}
            className="absolute right-6 top-6 text-pink-200 hover:text-white font-bold"
          >
            [ESC] Volver
          </button>
        </div>

        {/* 3D Viewer Area */}
        <div className="relative flex-1 bg-stone-800">
          {/* Requerimientos del cliente */}
          <div className="absolute top-4 left-4 bg-black/60 p-4 rounded-xl border border-stone-600 z-10 max-w-xs">
            <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-widest text-stone-400">El cliente pide:</h3>
            <ul className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className={\`flex items-center gap-2 text-sm font-medium \${i < stepIndex ? 'text-green-400' : i === stepIndex ? 'text-white' : 'text-stone-500'}\`}>
                  <span>{i < stepIndex ? '✓' : i === stepIndex ? '▶' : ' '}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <Canvas shadows camera={{ position: [0, 0.3, 0.6], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[2, 4, 2]} intensity={2.5} castShadow />
            <pointLight position={[-2, 2, -2]} intensity={1.5} />
            
            {/* Turntable / Table base */}
            <mesh position={[0, -0.02, 0]} receiveShadow>
              <cylinderGeometry args={[0.3, 0.32, 0.04, 32]} />
              <meshStandardMaterial color="#333" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.05, 0]} receiveShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.06, 32]} />
              <meshStandardMaterial color="#222" />
            </mesh>

            {/* Product */}
            <group scale={[1.8, 1.8, 1.8]} position={[0, 0, 0]}>
              <Product3DItem productId={recipeId} stepIndex={stepIndex} />
            </group>
          </Canvas>
        </div>

        {/* Decorator Controls Grid */}
        <div className="bg-stone-100 p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-10">
          <h3 className="text-center font-black text-stone-700 mb-4 uppercase tracking-widest">Opciones de Decoración</h3>
          <div className="grid grid-cols-5 gap-3 max-w-3xl mx-auto">
            {ALL_DECORATIONS.map(dec => {
              const isWrong = wrongSelected === dec.id;
              return (
                <button
                  key={dec.id}
                  onClick={() => !wrongSelected && handlePick(dec.id)}
                  disabled={stepIndex >= steps.length}
                  className="relative flex flex-col items-center justify-center p-3 h-24 rounded-2xl transition-all duration-150 active:scale-95 bg-white border-b-4 hover:-translate-y-1"
                  style={{
                    borderColor: isWrong ? '#ef4444' : dec.color,
                    boxShadow: isWrong ? '0 0 15px rgba(239,68,68,0.5)' : '0 4px 10px rgba(0,0,0,0.05)',
                    transform: isWrong ? 'translateX(-4px)' : 'none',
                    animation: isWrong ? 'shake 0.3s ease' : 'none',
                  }}
                >
                  <span className="text-3xl mb-1 drop-shadow-sm">{dec.emoji}</span>
                  <span className="text-[10px] font-bold text-stone-700 leading-tight text-center">{dec.id}</span>
                </button>
              );
            })}
          </div>
        </div>
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
