'use client';

import React, { useState } from 'react';
import { CustomerOrder, INGREDIENTS, ProductId, RECIPES, TrayState } from '@/types/game';
import { Volume2, VolumeX, Heart, Clock, Award, Trash2, BookOpen, X, Sparkles, UtensilsCrossed, Package } from 'lucide-react';

interface HUDProps {
  levelNumber: number;
  levelTitle: string;
  money: number;
  targetMoney: number;
  score: number;
  lives: number;
  maxLives: number;
  timeLeftSeconds: number;
  currentOrder: CustomerOrder | null;
  tray: TrayState;
  onClearTray: () => void;
  tutorialTip?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  toast?: { message: string; type: 'info' | 'success' | 'warning' } | null;
  mixingProgress?: number | null;
  availableProducts?: ProductId[];
  onOpenTutorial?: () => void;
  difficultyLabel?: string;
}

// Estilo común del panel glassmorphism oscuro del HUD
const hudPanel = {
  background: 'rgba(10, 5, 25, 0.75)',
  border: '1px solid rgba(244,114,182,0.3)',
  backdropFilter: 'blur(16px)',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
} as const;

// Color de la barra de paciencia del cliente según el nivel restante
const getPatienceColor = (ratio: number) => {
  if (ratio > 0.6) return 'linear-gradient(90deg, #34d399, #6ee7b7)';
  if (ratio > 0.3) return 'linear-gradient(90deg, #fbbf24, #fde68a)';
  return 'linear-gradient(90deg, #f43f5e, #fb7185)';
};

export const HUD: React.FC<HUDProps> = ({
  levelNumber,
  levelTitle,
  money,
  targetMoney,
  score,
  lives,
  maxLives,
  timeLeftSeconds,
  currentOrder,
  tray,
  onClearTray,
  tutorialTip,
  isMuted,
  onToggleMute,
  onPause,
  toast,
  mixingProgress,
  availableProducts = ['cookie', 'cupcake', 'donut'],
  onOpenTutorial,
  difficultyLabel,
}) => {
  const [showRecipesModal, setShowRecipesModal] = useState(false);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = Math.floor(timeLeftSeconds % 60);
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const patienceRatio = currentOrder
    ? currentOrder.currentPatienceSeconds / currentOrder.maxPatienceSeconds
    : 0;

  // Color de la etiqueta de dificultad
  const diffColors: Record<string, string> = {
    'Fácil': '#34d399',
    'Normal': '#60a5fa',
    'Difícil': '#fbbf24',
    'Muy Difícil': '#f97316',
    'Experto': '#f43f5e',
  };
  const diffColor = difficultyLabel ? (diffColors[difficultyLabel] ?? '#a78bfa') : '#a78bfa';

  // Renderizado del contenido de la bandeja
  const renderTrayContent = () => {
    switch (tray.type) {
      case 'empty':
        return (
          <div className="flex items-center gap-2 italic text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>Bandeja vacía</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>(Toma ingredientes con [E])</span>
          </div>
        );
      case 'ingredients':
        return (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center justify-between" style={{ color: '#f9a8d4' }}>
              <span>Ingredientes ({tray.items.length}/5):</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black"
                style={{ background: tray.items.length >= 3 ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)', color: tray.items.length >= 3 ? '#34d399' : '#fbbf24' }}>
                {tray.items.length >= 3 ? 'Listo para batir' : 'Agrega más'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {tray.items.map((ingId, idx) => {
                const ing = INGREDIENTS[ingId];
                return (
                  <span
                    key={`${ingId}-${idx}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(244,114,182,0.3)', color: 'white' }}
                  >
                    <span>{ing.name}</span>
                  </span>
                );
              })}
            </div>
            <div className="text-[11px] font-bold mt-0.5" style={{ color: '#6ee7b7' }}>
              → Llévalos a la Batidora Rosa y presiona [E] para batir
            </div>
          </div>
        );
      case 'mixed_dough': {
        const recipe = RECIPES[tray.recipeId];
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                MASA
              </div>
              <div>
                <div className="text-xs font-bold uppercase" style={{ color: '#fbbf24' }}>Masa Lista:</div>
                <div className="text-sm font-black text-white">{recipe.name} (Cruda)</div>
              </div>
            </div>
            <div className="text-xs font-black px-3 py-1 rounded-full animate-bounce"
              style={{ background: 'rgba(251,191,36,0.2)', color: '#fde68a', border: '1px solid rgba(251,191,36,0.3)' }}>
              → Llevar al Horno [E]
            </div>
          </div>
        );
      }
      case 'baked': {
        const recipe = RECIPES[tray.recipeId];
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{ background: 'rgba(244,114,182,0.2)', color: '#f472b6', border: '1px solid rgba(244,114,182,0.3)' }}>
                HORN
              </div>
              <div>
                <div className="text-xs font-bold uppercase" style={{ color: '#f9a8d4' }}>Horneado:</div>
                <div className="text-sm font-black text-white">{recipe.name}</div>
              </div>
            </div>
            {recipe.requiresDecoration ? (
              <div className="text-xs font-black px-3 py-1 rounded-full"
                style={{ background: 'rgba(167,139,250,0.2)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.3)' }}>
                → Mesa Decoración [E]
              </div>
            ) : (
              <div className="text-xs font-black px-3 py-1 rounded-full"
                style={{ background: 'rgba(52,211,153,0.2)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.3)' }}>
                → Entregar Mostrador [E]
              </div>
            )}
          </div>
        );
      }
      case 'finished': {
        const recipe = RECIPES[tray.recipeId];
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
                LISTO
              </div>
              <div>
                <div className="text-xs font-bold uppercase" style={{ color: '#6ee7b7' }}>Listo para servir:</div>
                <div className="text-sm font-black text-white">{recipe.name}</div>
              </div>
            </div>
            <div className="text-xs font-black px-3 py-1 rounded-full animate-pulse"
              style={{ background: 'rgba(52,211,153,0.25)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.4)' }}>
              → Entregar Mostrador [E]
            </div>
          </div>
        );
      }
      case 'burnt': {
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{ background: 'rgba(244,63,94,0.2)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
                QMD
              </div>
              <div>
                <div className="text-xs font-bold uppercase" style={{ color: '#fb7185' }}>¡Se quemó!</div>
                <div className="text-sm font-black text-white">Producto carbonizado</div>
              </div>
            </div>
            <div className="text-xs font-black px-3 py-1 rounded-full"
              style={{ background: 'rgba(244,63,94,0.2)', color: '#fda4af', border: '1px solid rgba(244,63,94,0.3)' }}>
              → Tirar a la Basura [E]
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-5"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ==================================================================== */}
      {/* BARRA SUPERIOR */}
      {/* ==================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-2">

        {/* Izquierda: Dinero + Nivel + Recetas + Tutorial */}
        <div className="flex items-center gap-2">

          {/* Dinero */}
          <div className="flex items-center gap-2 px-3 py-2" style={hudPanel}>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#1c1917' }}>
              $
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase leading-none" style={{ color: 'rgba(255,255,255,0.4)' }}>Ganado</span>
              <span className="text-sm font-black leading-tight text-white">
                ${money.toLocaleString()} <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>/ ${targetMoney.toLocaleString()}</span>
              </span>
            </div>
          </div>

          {/* Nivel + Dificultad */}
          <div className="hidden sm:flex flex-col px-3 py-2" style={hudPanel}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#f9a8d4' }}>
                Día {levelNumber}
              </span>
              {difficultyLabel && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ background: `${diffColor}22`, color: diffColor, border: `1px solid ${diffColor}55` }}>
                  {difficultyLabel}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-white">{levelTitle}</span>
          </div>

          {/* Botones de acción (clickeables) */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              onClick={() => setShowRecipesModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-black transition-all active:scale-95 hover:brightness-125"
              style={{ ...hudPanel, color: '#f9a8d4' }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Recetas</span>
            </button>
            {onOpenTutorial && (
              <button
                onClick={onOpenTutorial}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-black transition-all active:scale-95 hover:brightness-125"
                style={{ ...hudPanel, color: '#fde68a', border: '1px solid rgba(251,191,36,0.35)' }}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Tutorial</span>
              </button>
            )}
          </div>
        </div>

        {/* Centro: Reloj + Puntaje */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-4 py-2 ${timeLeftSeconds <= 30 ? 'animate-pulse' : ''}`}
            style={{
              ...hudPanel,
              border: timeLeftSeconds <= 30 ? '1px solid rgba(244,63,94,0.6)' : '1px solid rgba(244,114,182,0.3)',
              background: timeLeftSeconds <= 30 ? 'rgba(244,63,94,0.2)' : 'rgba(10,5,25,0.75)',
            }}
          >
            <Clock className="w-5 h-5" style={{ color: timeLeftSeconds <= 30 ? '#f43f5e' : '#f9a8d4' }} />
            <span className="text-lg font-black tracking-tight" style={{ color: timeLeftSeconds <= 30 ? '#fda4af' : 'white' }}>
              {formattedTime}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2" style={hudPanel}>
            <Award className="w-4 h-4" style={{ color: '#fbbf24' }} />
            <span className="text-sm font-black text-white">{score.toLocaleString()} pts</span>
          </div>
        </div>

        {/* Derecha: Vidas + Sonido + Pausa */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-2" style={hudPanel}>
            {Array.from({ length: maxLives }).map((_, idx) => (
              <Heart
                key={`heart-${idx}`}
                className="w-5 h-5 transition-all duration-200"
                style={{
                  fill: idx < lives ? '#f43f5e' : 'rgba(255,255,255,0.15)',
                  color: idx < lives ? '#f43f5e' : 'rgba(255,255,255,0.15)',
                  transform: idx < lives ? 'scale(1)' : 'scale(0.85)',
                }}
              />
            ))}
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              onClick={onToggleMute}
              className="flex h-9 w-9 items-center justify-center transition-all active:scale-95 hover:brightness-125"
              style={hudPanel}
              title={isMuted ? 'Activar Sonido' : 'Silenciar'}
            >
              {isMuted
                ? <VolumeX className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                : <Volume2 className="w-4 h-4" style={{ color: '#f9a8d4' }} />}
            </button>
            <button
              onClick={onPause}
              className="flex h-9 px-3 items-center justify-center text-[11px] font-black transition-all active:scale-95 hover:brightness-125"
              style={{ ...hudPanel, color: 'rgba(255,255,255,0.6)' }}
            >
              PAUSA [ESC]
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* PROGRESO DE META (barra de dinero) */}
      {/* ==================================================================== */}
      <div className="self-center w-full max-w-sm">
        <div className="flex justify-between text-[10px] font-bold mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>Meta del día</span>
          <span style={{ color: money >= targetMoney ? '#34d399' : 'rgba(255,255,255,0.4)' }}>
            {Math.min(100, Math.round((money / targetMoney) * 100))}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (money / targetMoney) * 100)}%`,
              background: money >= targetMoney
                ? 'linear-gradient(90deg, #34d399, #6ee7b7)'
                : 'linear-gradient(90deg, #ec4899, #a855f7)',
            }}
          />
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BATIDORA (progreso de mezclado) */}
      {/* ==================================================================== */}
      {mixingProgress !== null && (
        <div className="self-center flex flex-col items-center">
          <div className="flex flex-col items-center px-7 py-4 rounded-3xl min-w-[280px]"
            style={{ background: 'rgba(10,5,25,0.92)', border: '2px solid rgba(244,114,182,0.5)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(244,114,182,0.25)' }}>
            <UtensilsCrossed className="w-7 h-7 mb-1 animate-spin" style={{ color: '#f472b6' }} />
            <div className="text-sm font-black text-white mb-2">Batiendo en la Batidora</div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{ width: `${mixingProgress}%`, background: 'linear-gradient(90deg, #f472b6, #a855f7, #34d399)' }}
              />
            </div>
            <div className="text-xs font-bold mt-1.5" style={{ color: '#f9a8d4' }}>
              {mixingProgress < 100 ? `Mezclando... ${mixingProgress}%` : 'Masa Lista'}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOAST Y TUTORIAL TIP */}
      {/* ==================================================================== */}
      {toast && (
        <div className="self-center max-w-md w-full">
          <div
            className="px-5 py-3 rounded-2xl text-center text-xs md:text-sm font-black flex items-center justify-center gap-2"
            style={{
              backdropFilter: 'blur(16px)',
              background: toast.type === 'success'
                ? 'rgba(16,185,129,0.15)'
                : toast.type === 'warning'
                  ? 'rgba(245,158,11,0.15)'
                  : 'rgba(99,102,241,0.15)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(52,211,153,0.5)' : toast.type === 'warning' ? 'rgba(251,191,36,0.5)' : 'rgba(167,139,250,0.5)'}`,
              color: toast.type === 'success' ? '#6ee7b7' : toast.type === 'warning' ? '#fde68a' : '#c4b5fd',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {!toast && tutorialTip && (
        <div className="self-center max-w-lg px-5 py-2.5 rounded-2xl text-center"
          style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)', backdropFilter: 'blur(12px)' }}>
          <div className="text-[10px] font-black uppercase tracking-wide mb-0.5" style={{ color: '#fbbf24' }}>
            Instrucción del Día:
          </div>
          <div className="text-sm font-bold" style={{ color: '#fde68a' }}>{tutorialTip}</div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* BOTTOM: Pedido del cliente + Bandeja */}
      {/* ==================================================================== */}
      <div className="flex flex-wrap items-end justify-between gap-3">

        {/* Pedido del cliente (izquierda) */}
        {currentOrder ? (
          <div className="pointer-events-auto max-w-sm w-full p-4 rounded-3xl"
            style={{ background: 'rgba(10,5,25,0.88)', border: '1px solid rgba(244,114,182,0.35)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            {/* Encabezado del cliente */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full ring-2 ring-white/20"
                  style={{ backgroundColor: currentOrder.avatarColor }}
                />
                <span className="font-black text-sm text-white">{currentOrder.customerName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                  style={{ background: 'rgba(244,114,182,0.15)', color: '#f9a8d4', border: '1px solid rgba(244,114,182,0.3)' }}>
                  {currentOrder.customerType}
                </span>
              </div>
              <span className="text-xs font-black" style={{ color: '#fbbf24' }}>
                +${currentOrder.totalPrice}
              </span>
            </div>

            {/* Barra de paciencia */}
            <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${Math.max(4, patienceRatio * 100)}%`,
                  background: getPatienceColor(patienceRatio),
                }}
              />
            </div>

            {/* Ítems pedidos */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Pedido solicitado:
              </div>
              {currentOrder.items.map((prodId, idx) => {
                const recipe = RECIPES[prodId];
                const isDelivered = currentOrder.deliveredItems.includes(prodId);
                return (
                  <div
                    key={`ord-${idx}`}
                    className="flex items-center justify-between p-2 rounded-xl"
                    style={{
                      background: isDelivered ? 'rgba(52,211,153,0.1)' : 'rgba(244,114,182,0.08)',
                      border: `1px solid ${isDelivered ? 'rgba(52,211,153,0.3)' : 'rgba(244,114,182,0.2)'}`,
                      opacity: isDelivered ? 0.6 : 1,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(244,114,182,0.2)', color: '#f472b6' }}>
                        {recipe.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-black text-white" style={{ textDecoration: isDelivered ? 'line-through' : 'none' }}>
                          {recipe.name}
                        </div>
                        <div className="text-[10px] font-bold" style={{ color: '#f9a8d4' }}>
                          {recipe.ingredients.map(i => INGREDIENTS[i].name).join(' + ')}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black" style={{ color: '#fbbf24' }}>${recipe.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="px-4 py-2 rounded-2xl text-xs font-bold"
            style={{ ...hudPanel, color: 'rgba(255,255,255,0.4)' }}>
            Esperando próximo cliente...
          </div>
        )}

        {/* Bandeja (derecha) */}
        <div className="pointer-events-auto min-w-[280px] max-w-md w-full p-4 rounded-3xl"
          style={{ background: 'rgba(10,5,25,0.88)', border: '1px solid rgba(244,114,182,0.35)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black tracking-wider uppercase flex items-center gap-1.5" style={{ color: '#fde68a' }}>
              <Package className="w-4 h-4 text-amber-400" />
              <span>En tus Manos</span>
            </span>
            {tray.type !== 'empty' && (
              <button
                onClick={onClearTray}
                className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg transition-colors"
                style={{ background: 'rgba(244,63,94,0.15)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}
                title="Vaciar bandeja"
              >
                <Trash2 className="w-3 h-3" />
                <span>Vaciar</span>
              </button>
            )}
          </div>
          <div className="min-h-[48px] flex items-center">
            {renderTrayContent()}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODAL DE RECETAS */}
      {/* ==================================================================== */}
      {showRecipesModal && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="relative w-full max-w-lg p-6 rounded-3xl shadow-2xl"
            style={{ background: 'rgba(15,8,35,0.97)', border: '2px solid rgba(244,114,182,0.4)', backdropFilter: 'blur(24px)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6" style={{ color: '#f472b6' }} />
                <h3 className="text-xl font-black text-white">Libro de Recetas</h3>
              </div>
              <button
                onClick={() => setShowRecipesModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {availableProducts.map(prodId => {
                const rec = RECIPES[prodId];
                return (
                  <div
                    key={`rec-${prodId}`}
                    className="p-3 rounded-2xl flex items-center justify-between"
                    style={{ background: 'rgba(244,114,182,0.07)', border: '1px solid rgba(244,114,182,0.2)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                        style={{ background: 'rgba(244,114,182,0.2)', color: '#f472b6' }}>
                        {rec.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white">{rec.name}</div>
                        <div className="text-xs font-bold mt-0.5" style={{ color: '#f9a8d4' }}>
                          {rec.ingredients.map(i => INGREDIENTS[i].name).join(' + ')}
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          Horno: {rec.bakeTimeSeconds}s {rec.requiresDecoration ? '· Requiere Decoración' : ''}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-black" style={{ color: '#fbbf24' }}>${rec.price}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowRecipesModal(false)}
              className="w-full mt-4 py-2.5 rounded-2xl font-black text-sm text-white transition-colors"
              style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
