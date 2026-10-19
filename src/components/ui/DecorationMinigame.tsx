'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Group } from 'three';
import { ProductId, RECIPES, DECORATION_OPTIONS, DecorationOption } from '@/types/game';
import { Product3DItem } from '@/components/3d/HeldItem3D';
import { sounds } from '@/utils/audio';
import { X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CandyCard, CandyBadge, CandyButton } from '@/components/ui/design-system';
import { releaseGamePointerLock, requestGamePointerLock } from '@/utils/mouseManager';

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

  // Guard: evita llamar onFinish dos veces (click del usuario + setTimeout)
  const finishedRef = useRef(false);
  // Referencia al setTimeout de auto-salida para cancelarlo si el usuario hace click antes
  const autoFinishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guardamos los valores finales para usarlos en el click del banner
  const finalAppliedRef = useRef<string[]>([]);
  const finalIsCorrectRef = useRef<boolean>(true);

  const totalSteps = requestedDecorations.length > 0 ? requestedDecorations.length : 2;

  // Liberar el cursor inmediatamente al montar el minijuego
  useEffect(() => {
    releaseGamePointerLock();
    // Limpiar timers al desmontar
    return () => {
      if (autoFinishTimerRef.current) clearTimeout(autoFinishTimerRef.current);
    };
  }, []);

  // Manejar tecla Escape para cancelar (Escape es un gesto de usuario válido para pedir lock después)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // No pedimos pointer lock aquí porque Escape lo rechaza automáticamente.
        // La capa "Haz clic para jugar" se encarga cuando el usuario hace click.
        onCancel();
      }
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

      // Guardamos para el click del banner
      finalAppliedRef.current = newApplied;
      finalIsCorrectRef.current = isFinalCorrect;

      setTimeout(() => {
        if (isFinalCorrect) {
          sounds.playMixSuccess();
        } else {
          sounds.playError();
        }
      }, 300);

      // Auto-salida tras 1s — el jugador también puede clickear el banner para salir antes
      autoFinishTimerRef.current = setTimeout(() => {
        if (!finishedRef.current) {
          finishedRef.current = true;
          onFinish(newApplied, isFinalCorrect);
        }
      }, 1000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between items-center bg-slate-950/75 backdrop-blur-md select-none p-3 sm:p-5"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* ============================================================== */}
      {/* 1. HEADER: Tarjeta de Pedido del Cliente                       */}
      {/* ============================================================== */}
      <CandyCard
        variant="cream"
        className="w-full max-w-2xl flex items-center justify-between gap-3 p-3.5 sm:p-4 shadow-xl border-2 border-pink-300 z-20"
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl animate-bounce">{recipe.emoji}</div>
          <div>
            <div className="flex items-center gap-2">
              <CandyBadge variant="primary" size="sm">
                Mesa de Decoración
              </CandyBadge>
              <span className="text-xs font-bold text-stone-500">
                Paso {Math.min(currentStep + 1, totalSteps)} de {totalSteps}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#451a03]">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black transition-all ${
                  isStepWrong
                    ? 'bg-rose-100 border-rose-300 text-rose-800'
                    : isDone
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    : isCurrent
                    ? 'bg-amber-100 border-amber-300 text-amber-950 ring-2 ring-pink-400'
                    : 'bg-white/80 border-stone-200 text-stone-400'
                }`}
              >
                <span>{decOpt?.icon || '🎨'}</span>
                <span>{decOpt?.name || decId}</span>
                {isStepWrong ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 ml-0.5" />
                ) : isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Botón cancelar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Pedimos el pointer lock ANTES de llamar onCancel (gesto directo del usuario).
            requestGamePointerLock();
            onCancel();
          }}
          className="p-2 rounded-full text-stone-400 hover:text-pink-600 hover:bg-pink-100 transition-colors"
          title="Cancelar decoración (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </CandyCard>

      {/* ============================================================== */}
      {/* 2. ZONA CENTRAL: Canvas 3D del producto en primer plano        */}
      {/* ============================================================== */}
      <main className="relative flex-1 w-full max-w-xl flex items-center justify-center my-1 z-10 min-h-[200px]">
        {/* Banner de estado efímero */}
        {lastActionFeedback && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 animate-scale-in border-2 ${
                hasError && lastActionFeedback.includes('incorrecta')
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white border-rose-300'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lastActionFeedback}</span>
            </div>
          </div>
        )}

        {/* Modal de éxito o error al completar — también clickeable para salir inmediatamente */}
        {isCompleted && (
          <div
            className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs rounded-3xl animate-scale-in cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (finishedRef.current) return; // ya salió por setTimeout
              finishedRef.current = true;
              // Cancelar el setTimeout automático
              if (autoFinishTimerRef.current) {
                clearTimeout(autoFinishTimerRef.current);
                autoFinishTimerRef.current = null;
              }
              // Gesto directo del usuario: pedimos pointer lock antes de notificar al padre
              requestGamePointerLock();
              onFinish(finalAppliedRef.current, finalIsCorrectRef.current);
            }}
          >
            <CandyCard variant="cream" className="p-6 text-center shadow-2xl border-4 border-amber-300 max-w-xs w-full pointer-events-none">
              <div className="text-4xl mb-1">{hasError ? '⚠️' : '✨'}</div>
              <div className="text-lg font-black text-[#451a03]">
                {hasError ? 'Decoración Errónea' : '¡Decoración Perfecta!'}
              </div>
              <p className="text-xs font-semibold text-stone-500 mt-1">
                {hasError
                  ? 'El cliente notará los adornos equivocados (-puntos)'
                  : 'Listo para servir y ganar propina extra'}
              </p>
              <p className="text-[10px] font-bold text-pink-500 mt-2 animate-pulse">
                Haz clic para continuar
              </p>
            </CandyCard>
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
      <CandyCard
        variant="cream"
        className="w-full max-w-2xl p-3 sm:p-4 shadow-2xl border-2 border-pink-300 z-20 flex flex-col items-center"
      >
        <div className="text-xs font-black text-[#451a03] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>🎨</span>
          <span>Elige la decoración del pedido:</span>
        </div>

        {/* Grilla prolija de botones con sombras inferiores sólidas */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 w-full justify-items-center">
          {DECORATION_OPTIONS.map(opt => {
            const isBase = opt.category === 'base';
            return (
              <button
                key={opt.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectDecoration(opt);
                }}
                disabled={isCompleted}
                className="group flex flex-col items-center justify-center p-2 rounded-2xl w-full h-[72px] sm:h-[76px] transition-all hover:scale-105 active:scale-95 disabled:opacity-45 select-none shadow-[0_3px_0_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-none"
                style={{
                  background: `${opt.color}15`,
                  border: `2px solid ${opt.color}`,
                }}
                title={`${opt.name} (${isBase ? 'Borde/Glaseado' : 'Topping'})`}
              >
                <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                  {opt.icon}
                </span>
                <span className="text-[10px] font-black text-[#451a03] text-center leading-tight mt-1 line-clamp-1">
                  {opt.name}
                </span>
                <span className="text-[8px] font-bold text-stone-500 uppercase">
                  {isBase ? 'Borde' : 'Topping'}
                </span>
              </button>
            );
          })}
        </div>
      </CandyCard>
    </div>
  );
};
