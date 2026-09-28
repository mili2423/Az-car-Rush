'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '@/utils/audio';

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
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
      <div className="relative flex flex-col items-center rounded-3xl border-4 border-pink-300 bg-white/95 p-8 shadow-2xl max-w-sm w-full text-center animate-scale-in">
        <div className="text-4xl mb-2 animate-bounce">🥣</div>
        <h3 className="text-2xl font-black text-amber-900 mb-1">
          Mesa de Mezcla
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          Mantén presionado <kbd className="px-2 py-0.5 bg-pink-100 text-pink-700 font-bold rounded shadow-sm">E</kbd> o <kbd className="px-2 py-0.5 bg-pink-100 text-pink-700 font-bold rounded shadow-sm">ESPACIO</kbd> y suelta en la <span className="text-emerald-600 font-bold">Zona Verde</span>
        </p>

        {/* Gauge Bar */}
        <div className="relative w-full h-9 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-300 mb-5 shadow-inner">
          {/* Target Sweet Spot Area */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-400/90 border-x-2 border-emerald-600 flex items-center justify-center text-[10px] font-black text-emerald-950 uppercase tracking-widest"
            style={{
              left: `${TARGET_MIN}%`,
              width: `${TARGET_MAX - TARGET_MIN}%`,
            }}
          >
            Listo
          </div>

          {/* Current Needle Fill */}
          <div
            className={`h-full transition-all duration-75 ${
              gauge >= TARGET_MIN && gauge <= TARGET_MAX
                ? 'bg-gradient-to-r from-amber-400 to-emerald-500'
                : gauge > TARGET_MAX
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-pink-400 to-amber-300'
            }`}
            style={{ width: `${gauge}%` }}
          />

          {/* Needle Pin Indicator */}
          <div
            className="absolute top-0 bottom-0 w-2 bg-slate-900 shadow-md transform -translate-x-1"
            style={{ left: `${gauge}%` }}
          />
        </div>

        {/* Status Message */}
        {message ? (
          <div className="h-8 text-sm font-black text-pink-600 animate-bounce">
            {message}
          </div>
        ) : (
          <div className="h-8 text-xs font-bold text-slate-500">
            {isPressing ? '¡Batiendo con fuerza! 🌀 Suelta en Verde' : 'Mantén presionado para mezclar...'}
          </div>
        )}

        {/* Interactive Button for Mouse/Touch */}
        <button
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
          className={`w-full py-3.5 mt-2 rounded-2xl font-black text-base transition-transform shadow-lg ${
            isPressing
              ? 'scale-95 bg-pink-600 text-white shadow-inner'
              : 'bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:brightness-105 active:scale-95'
          }`}
        >
          {isPressing ? '¡SOLTAR EN ZONA VERDE!' : 'Mantener para Batir [E / ESPACIO]'}
        </button>

        <button
          onClick={onCancel}
          className="mt-3 text-xs font-semibold text-gray-400 hover:text-gray-700"
        >
          Cancelar [ESC]
        </button>
      </div>
    </div>
  );
};
