'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Group } from 'three';
import { ProductId, RECIPES, DECORATION_OPTIONS, DecorationOption } from '@/types/game';
import { Product3DItem } from '@/components/3d/HeldItem3D';
import { sounds } from '@/utils/audio';
import { X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DecorationMinigameProps {
  productId: ProductId;
  requestedDecorations: string[];
  onFinish: (applied: string[], isCorrect: boolean) => void;
  onCancel: () => void;
}

// ─── TURNTABLE 3D Y POSTRE EN PRIMER PLANO ────────────────────────────────────
const RotatingPastry: React.FC<{
  productId: ProductId;
  decorations: string[];
  hasError: boolean;
}> = ({ productId, decorations, hasError }) => {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* Base giratoria / Turntable de repostería */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.34, 0.38, 0.04, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.015, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.02, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {/* Producto en primer plano escalado para apreciarlo en detalle */}
      <group scale={[1.85, 1.85, 1.85]}>
        <Product3DItem
          productId={productId}
          decorations={decorations}
          hasError={hasError}
        />
      </group>
    </group>
  );
};

export const DecorationMinigame: React.FC<DecorationMinigameProps> = ({
  productId,
  requestedDecorations,
  onFinish,
  onCancel,
}) => {
  const recipe = RECIPES[productId];
  const [appliedDecorations, setAppliedDecorations] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [lastActionFeedback, setLastActionFeedback] = useState<string | null>(null);

  const totalSteps = requestedDecorations.length > 0 ? requestedDecorations.length : 2;

  // Manejar tecla Escape para cancelar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleSelectDecoration = (option: DecorationOption) => {
    if (isCompleted) return;

    const expectedId = requestedDecorations[currentStep];
    const isStepCorrect = option.id === expectedId;

    const newApplied = [...appliedDecorations, option.id];
    setAppliedDecorations(newApplied);

    if (isStepCorrect) {
      sounds.playPickup();
      setLastActionFeedback(`¡${option.name} aplicado!`);
    } else {
      sounds.playError();
      setHasError(true);
      setLastActionFeedback(`¡Decoración incorrecta! Se pedía: ${DECORATION_OPTIONS.find(o => o.id === expectedId)?.name || 'otro elemento'}`);
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // ¿Se completó la secuencia?
    if (nextStep >= totalSteps) {
      setIsCompleted(true);
      const isFinalCorrect = !hasError && isStepCorrect;

      setTimeout(() => {
        if (isFinalCorrect) {
          sounds.playMixSuccess();
        } else {
          sounds.playError();
        }
      }, 300);

      setTimeout(() => {
        onFinish(newApplied, isFinalCorrect);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between items-center bg-stone-950/80 backdrop-blur-md select-none p-3 sm:p-5">
      {/* ============================================================== */}
      {/* 1. HEADER: Tarjeta de Pedido del Cliente                       */}
      {/* ============================================================== */}
      <header className="w-full max-w-2xl flex items-center justify-between gap-3 bg-white/95 border-2 border-pink-300 rounded-2xl p-3 sm:p-4 shadow-xl z-20">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl animate-bounce">{recipe.emoji}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full border border-pink-200">
                Mesa de Decoración
              </span>
              <span className="text-xs font-bold text-stone-500">
                Paso {Math.min(currentStep + 1, totalSteps)} de {totalSteps}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-stone-800">
              Decorando: <span className="text-pink-600">{recipe.name}</span>
            </h2>
          </div>
        </div>

        {/* Pasos requeridos con indicadores visuales */}
        <div className="hidden sm:flex items-center gap-2">
          {requestedDecorations.map((decId, idx) => {
            const decOpt = DECORATION_OPTIONS.find(o => o.id === decId);
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            const stepAppliedId = appliedDecorations[idx];
            const isStepWrong = isDone && stepAppliedId !== decId;

            return (
              <div
                key={`req-${idx}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  isStepWrong
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : isDone
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : isCurrent
                    ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-pink-400'
                    : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}
              >
                <span>{decOpt?.icon || '🎨'}</span>
                <span>{decOpt?.name || decId}</span>
                {isStepWrong ? (
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 ml-1" />
                ) : isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 ml-1" />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Botón cancelar */}
        <button
          onClick={onCancel}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          title="Cancelar decoración (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* ============================================================== */}
      {/* 2. ZONA CENTRAL: Canvas 3D del producto en primer plano        */}
      {/* ============================================================== */}
      <main className="relative flex-1 w-full max-w-xl flex items-center justify-center my-1 z-10 min-h-[220px]">
        {/* Banner de estado efímero */}
        {lastActionFeedback && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className={`px-4 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 animate-scale-in ${
              hasError && lastActionFeedback.includes('incorrecta')
                ? 'bg-red-500 text-white border-2 border-red-300'
                : 'bg-emerald-500 text-white border-2 border-emerald-300'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lastActionFeedback}</span>
            </div>
          </div>
        )}

        {/* Modal de éxito o error al completar */}
        {isCompleted && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-3xl animate-scale-in">
            <div className="bg-white/95 border-4 border-amber-300 px-6 py-4 rounded-3xl text-center shadow-2xl">
              <div className="text-4xl mb-1">{hasError ? '⚠️' : '✨'}</div>
              <div className="text-lg font-black text-stone-800">
                {hasError ? 'Decoración Errónea' : '¡Decoración Perfecta!'}
              </div>
              <p className="text-xs font-semibold text-stone-500 mt-0.5">
                {hasError
                  ? 'El cliente notará los adornos equivocados (-puntos)'
                  : 'Listo para servir y ganar propina extra'}
              </p>
            </div>
          </div>
        )}

        {/* Canvas 3D con Three.js */}
        <div className="w-full h-full max-h-[340px] rounded-3xl overflow-hidden">
          <Canvas
            camera={{ position: [0, 0.45, 1.05], fov: 38 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={1.1} />
            <directionalLight position={[2, 3, 2]} intensity={1.5} castShadow />
            <pointLight position={[-1.5, 2, -1]} intensity={0.8} color="#fbcfe8" />
            <pointLight position={[1, 1, 2]} intensity={0.6} color="#fef08a" />

            <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
              <RotatingPastry
                productId={productId}
                decorations={appliedDecorations}
                hasError={hasError}
              />
            </Float>
          </Canvas>
        </div>
      </main>

      {/* ============================================================== */}
      {/* 3. FOOTER: Grilla de Botones de Decoración Cuadrados Redondeados */}
      {/* ============================================================== */}
      <footer className="w-full max-w-2xl bg-white/95 border-2 border-pink-300 rounded-3xl p-3 sm:p-4 shadow-2xl z-20 flex flex-col items-center">
        <div className="text-xs font-black text-stone-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span>🎨</span>
          <span>Elige la decoración del pedido:</span>
        </div>

        {/* Grilla prolija de botones táctiles */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 w-full justify-items-center">
          {DECORATION_OPTIONS.map(opt => {
            const isBase = opt.category === 'base';
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectDecoration(opt)}
                disabled={isCompleted}
                className="group flex flex-col items-center justify-center p-2 rounded-2xl w-full h-[72px] sm:h-[76px] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 select-none shadow-sm"
                style={{
                  background: `${opt.color}18`,
                  border: `2px solid ${opt.color}`,
                }}
                title={`${opt.name} (${isBase ? 'Borde/Glaseado' : 'Topping'})`}
              >
                <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                  {opt.icon}
                </span>
                <span className="text-[10px] font-black text-stone-800 text-center leading-tight mt-1 line-clamp-1">
                  {opt.name}
                </span>
                <span className="text-[8px] font-bold text-stone-500 uppercase">
                  {isBase ? 'Borde' : 'Topping'}
                </span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
