'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CandyCard, CandyButton, CandyBadge } from '@/components/ui/design-system';
import { sounds } from '@/utils/audio';
import { Sparkles, X } from 'lucide-react';

interface MixerMinigameProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const MixerMinigame: React.FC<MixerMinigameProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [gauge, setGauge] = useState(15); // 0 to 100
  const [isPressing, setIsPressing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isPressingRef = useRef(false);
  const gaugeRef = useRef(15);
  const animRef = useRef<number | null>(null);
  const soundTick = useRef(0);

  // Target sweet spot is between 65 and 88
  const TARGET_MIN = 65;
  const TARGET_MAX = 88;

  const handleEvaluate = () => {
    const currentG = gaugeRef.current;
    if (currentG >= TARGET_MIN && currentG <= TARGET_MAX) {
      sounds.playMixSuccess();
      setMessage('¡Consistencia Perfecta! ✨🥣');
      setTimeout(() => {
        onSuccess();
      }, 550);
    } else if (currentG > TARGET_MAX) {
      sounds.playError();
      setMessage('¡Te pasaste de batido! 💥');
      setTimeout(() => {
        gaugeRef.current = 20;
        setGauge(20);
        setMessage(null);
      }, 700);
    } else if (currentG > 25) {
      setMessage('¡Falta batir un poco más! 🥣');
      setTimeout(() => setMessage(null), 700);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' || e.code === 'Space') {
        if (!isPressingRef.current) {
          isPressingRef.current = true;
          setIsPressing(true);
        }
      } else if (e.code === 'Escape') {
        onCancel();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' || e.code === 'Space') {
        if (isPressingRef.current) {
          isPressingRef.current = false;
          setIsPressing(false);
          handleEvaluate();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [onCancel]);

  // Needle animation loop
  useEffect(() => {
    const loop = () => {
      if (isPressingRef.current) {
        gaugeRef.current = Math.min(100, gaugeRef.current + 1.4);
        const now = performance.now();
        if (now - soundTick.current > 110) {
          sounds.playMixSound();
          soundTick.current = now;
        }
      } else {
        // Natural drop back when released
        gaugeRef.current = Math.max(0, gaugeRef.current - 0.9);
      }

      setGauge(gaugeRef.current);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm pointer-events-auto select-none p-4">
      <CandyCard
        variant="cream"
        className="relative flex flex-col items-center max-w-sm w-full p-7 text-center shadow-2xl border-4 border-pink-300 animate-scale-in"
      >
        {/* Botón Cerrar */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-pink-600 hover:bg-pink-100 transition-colors"
          title="Cancelar (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icono animado */}
        <div className="w-16 h-16 rounded-2xl bg-pink-100/90 border-2 border-pink-200 flex items-center justify-center text-3xl mb-3 shadow-inner">
          🥣
        </div>

        {/* Badge */}
        <CandyBadge variant="primary" size="sm" className="mb-2">
          Estación de Mezcla
        </CandyBadge>

        <h3 className="text-2xl font-black text-[#451a03] mb-1">
          Batidora Pastelera
        </h3>
        <p className="text-xs text-stone-600 mb-5 font-semibold leading-relaxed">
          Mantén presionado <kbd className="px-1.5 py-0.5 bg-pink-100 text-pink-700 font-bold rounded shadow-2xs border border-pink-200">[E]</kbd> o <kbd className="px-1.5 py-0.5 bg-pink-100 text-pink-700 font-bold rounded shadow-2xs border border-pink-200">ESPACIO</kbd> y suelta en la <strong className="text-emerald-700 font-black">Zona Verde</strong>.
        </p>

        {/* Barra medidora con estética Candy */}
        <div className="relative w-full h-10 bg-stone-200/90 rounded-full overflow-hidden border-2 border-stone-300 mb-4 shadow-inner p-0.5">
          {/* Zona dulce verde (Sweet Spot) */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-400/85 border-x-2 border-emerald-600 flex items-center justify-center text-[10px] font-black text-emerald-950 uppercase tracking-widest"
            style={{
              left: `${TARGET_MIN}%`,
              width: `${TARGET_MAX - TARGET_MIN}%`,
            }}
          >
            Listo
          </div>

          {/* Relleno progresivo */}
          <div
            className={`h-full rounded-full transition-all duration-75 ${
              gauge >= TARGET_MIN && gauge <= TARGET_MAX
                ? 'bg-gradient-to-r from-amber-400 to-emerald-500'
                : gauge > TARGET_MAX
                ? 'bg-gradient-to-r from-rose-500 to-red-600'
                : 'bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300'
            }`}
            style={{ width: `${gauge}%` }}
          />

          {/* Aguja / Marcador */}
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-stone-900 shadow-md transform -translate-x-1/2 rounded-full border border-white"
            style={{ left: `${gauge}%` }}
          />
        </div>

        {/* Mensaje de estado */}
        <div className="h-7 mb-2 flex items-center justify-center">
          {message ? (
            <div className="text-xs font-black text-pink-600 animate-bounce">
              {message}
            </div>
          ) : (
            <div className="text-xs font-bold text-stone-500">
              {isPressing ? '¡Batiendo con fuerza! 🌀 Suelta en Verde' : 'Presiona o haz click para batir...'}
            </div>
          )}
        </div>

        {/* Botón táctil / ratón interactivo */}
        <CandyButton
          variant={isPressing ? 'warning' : 'primary'}
          size="lg"
          fullWidth
          onMouseDown={() => {
            isPressingRef.current = true;
            setIsPressing(true);
          }}
          onMouseUp={() => {
            if (isPressingRef.current) {
              isPressingRef.current = false;
              setIsPressing(false);
              handleEvaluate();
            }
          }}
          onTouchStart={() => {
            isPressingRef.current = true;
            setIsPressing(true);
          }}
          onTouchEnd={() => {
            if (isPressingRef.current) {
              isPressingRef.current = false;
              setIsPressing(false);
              handleEvaluate();
            }
          }}
        >
          {isPressing ? '¡SOLTAR EN ZONA VERDE!' : 'Mantener para Batir [E]'}
        </CandyButton>

        <button
          onClick={onCancel}
          className="mt-3 text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors"
        >
          Cancelar [ESC]
        </button>
      </CandyCard>
    </div>
  );
};
