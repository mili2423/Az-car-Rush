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

// Colores de dificultad
const diffColors: Record<string, { bg: string; text: string; border: string }> = {
  'Fácil':       { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
  'Normal':      { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
  'Difícil':     { bg: '#fef9c3', text: '#a16207', border: '#fde047' },
  'Muy Difícil': { bg: '#ffedd5', text: '#c2410c', border: '#fdba74' },
  'Experto':     { bg: '#fce7f3', text: '#be185d', border: '#f9a8d4' },
};

// Color de la barra de paciencia
const getPatienceColor = (ratio: number) => {
  if (ratio > 0.6) return '#22c55e';
  if (ratio > 0.3) return '#f59e0b';
  return '#ef4444';
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

  const diffStyle = difficultyLabel ? (diffColors[difficultyLabel] ?? { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' }) : null;

  // Estilo de panel del HUD: blanco/crema con borde suave
  const panelStyle: React.CSSProperties = {
    background: 'rgba(255,252,245,0.97)',
    border: '1.5px solid rgba(180,140,80,0.25)',
    borderRadius: '14px',
    boxShadow: '0 2px 12px rgba(120,80,20,0.12)',
    backdropFilter: 'blur(8px)',
  };

  const renderTrayContent = () => {
    switch (tray.type) {
      case 'empty':
        return (
          <div className="flex items-center gap-2 italic text-sm text-stone-400">
            <span>Bandeja vacía</span>
            <span className="text-xs text-stone-300">(Toma ingredientes con [E])</span>
          </div>
        );
      case 'ingredients':
        return (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center justify-between text-amber-700">
              <span>Ingredientes ({tray.items.length}/5):</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${tray.items.length >= 3 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {tray.items.length >= 3 ? 'Listo para batir' : 'Agrega más'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tray.items.map((ingId, idx) => (
                <span key={`${ingId}-${idx}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 border border-amber-200 text-amber-900">
                  {INGREDIENTS[ingId].name}
                </span>
              ))}
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
              → Llévalos a la Batidora Rosa y presiona [E]
            </div>
          </div>
        );
      case 'mixed_dough': {
        const recipe = RECIPES[tray.recipeId];
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs border border-amber-200">MASA</div>
              <div>
                <div className="text-xs font-bold text-amber-700 uppercase">Masa Lista:</div>
                <div className="text-sm font-black text-stone-800">{recipe.name}</div>
              </div>
            </div>
            <div className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 animate-bounce">
              → Horno [E]
            </div>
          </div>
        );
      }
      case 'baked': {
        const recipe = RECIPES[tray.recipeId];
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs border border-orange-200">HORN</div>
              <div>
                <div className="text-xs font-bold text-orange-700 uppercase">Horneado:</div>
                <div className="text-sm font-black text-stone-800">{recipe.name}</div>
              </div>
            </div>
            {recipe.requiresDecoration ? (
              <div className="text-xs font-bold px-3 py-1 rounded-full bg-pink-100 text-pink-800 border border-pink-200">
                → Decoración [E]
              </div>
            ) : (
              <div className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                → Mostrador [E]
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
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs border border-green-200">LISTO</div>
              <div>
                <div className="text-xs font-bold text-green-700 uppercase">Listo para servir:</div>
                <div className="text-sm font-black text-stone-800">{recipe.name}</div>
              </div>
            </div>
            <div className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-200 animate-pulse">
              → Mostrador [E]
            </div>
          </div>
        );
      }
      case 'burnt':
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700 font-bold text-xs border border-red-200">QMD</div>
              <div>
                <div className="text-xs font-bold text-red-600 uppercase">¡Se quemó!</div>
                <div className="text-sm font-black text-stone-800">Producto carbonizado</div>
              </div>
            </div>
            <div className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
              → Basura [E]
            </div>
          </div>
        );
    }
  };

  // Control de visibilidad del cartel de tutorial (aparece con cada nuevo paso y se desvanece suavemente)
  const [visibleTutorial, setVisibleTutorial] = useState<string | null>(tutorialTip || null);
  const [tutorialOpacity, setTutorialOpacity] = useState<number>(1);
  const lastTipRef = React.useRef<string | undefined>(tutorialTip);

  React.useEffect(() => {
    if (tutorialTip && tutorialTip !== lastTipRef.current) {
      lastTipRef.current = tutorialTip;
      setVisibleTutorial(tutorialTip);
      setTutorialOpacity(1);

      // Desvanecer suavemente después de 5 segundos
      const fadeTimer = setTimeout(() => {
        setTutorialOpacity(0);
      }, 5000);

      const hideTimer = setTimeout(() => {
        setVisibleTutorial(null);
      }, 5600);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    } else if (!tutorialTip) {
      setVisibleTutorial(null);
      lastTipRef.current = undefined;
    }
  }, [tutorialTip]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 md:p-4">

      {/* ================================================================ */}
      {/* 1. TOP BAR REAGRUPADA EN 3 BLOQUES LIMPIOS                       */}
      {/* ================================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-2 w-full">

        {/* --- BLOQUE IZQUIERDO: Progreso del Día y Ganancias --- */}
        <div className="flex items-center" style={panelStyle}>
          <div className="flex items-center gap-2.5 px-3 py-1.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, #d97706, #ea580c)' }}>$</div>
            <div className="flex flex-col min-w-[115px]">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold text-stone-400 uppercase leading-none">Ganado</span>
                <span className="text-[10px] font-bold text-amber-700">
                  {Math.min(100, Math.round((money / targetMoney) * 100))}%
                </span>
              </div>
              <span className="text-xs font-black text-stone-800 leading-tight">
                ${money.toLocaleString()} <span className="text-[10px] font-semibold text-stone-400">/ ${targetMoney.toLocaleString()}</span>
              </span>
              {/* Mini barra de progreso discreta integrada directamente en la tarjeta de Ganado */}
              <div className="w-full h-1.5 rounded-full overflow-hidden bg-stone-200 mt-1">
                <div className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (money / targetMoney) * 100)}%`,
                    background: money >= targetMoney ? '#16a34a' : 'linear-gradient(90deg, #d97706, #ea580c)'
                  }} />
              </div>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-stone-200/80" />

          {/* Nivel + Dificultad */}
          <div className="hidden sm:flex flex-col px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Día {levelNumber}</span>
              {diffStyle && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full"
                  style={{ background: diffStyle.bg, color: diffStyle.text, border: `1px solid ${diffStyle.border}` }}>
                  {difficultyLabel}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-stone-700 truncate max-w-[110px]">{levelTitle}</span>
          </div>
        </div>

        {/* --- BLOQUE CENTRO: Reloj y Puntaje --- */}
        <div className="flex items-center" style={panelStyle}>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 ${timeLeftSeconds <= 30 ? 'animate-pulse' : ''}`}>
            <Clock className="w-4 h-4 shrink-0" style={{ color: timeLeftSeconds <= 30 ? '#ef4444' : '#d97706' }} />
            <span className="text-sm font-black tracking-tight" style={{ color: timeLeftSeconds <= 30 ? '#ef4444' : '#292524' }}>
              {formattedTime}
            </span>
          </div>

          <div className="h-6 w-[1px] bg-stone-200/80" />

          <div className="flex items-center gap-1.5 px-3 py-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-xs font-black text-stone-800 whitespace-nowrap">
              {score.toLocaleString()} <span className="text-[10px] font-semibold text-stone-400">pts</span>
            </span>
          </div>
        </div>

        {/* --- BLOQUE DERECHO: Vidas y Controles --- */}
        <div className="flex items-center" style={panelStyle}>
          {/* Corazones / Vidas */}
          <div className="flex items-center gap-1 px-2.5 py-1.5">
            {Array.from({ length: maxLives }).map((_, idx) => (
              <Heart key={`heart-${idx}`} className="w-3.5 h-3.5 transition-all duration-200"
                style={{ fill: idx < lives ? '#ef4444' : '#e5e7eb', color: idx < lives ? '#ef4444' : '#d1d5db', transform: idx < lives ? 'scale(1)' : 'scale(0.85)' }} />
            ))}
          </div>

          <div className="h-7 w-[1px] bg-stone-200/80" />

          {/* Botones de acción compactos */}
          <div className="pointer-events-auto flex items-center gap-1 px-1.5 py-1">
            <button onClick={() => setShowRecipesModal(true)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-amber-800 hover:bg-amber-100/70 rounded-lg transition-all active:scale-95"
              title="Libro de Recetas">
              <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden md:inline">Recetas</span>
            </button>

            {onOpenTutorial && (
              <button onClick={onOpenTutorial}
                className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-orange-800 hover:bg-orange-100/70 rounded-lg transition-all active:scale-95"
                title="Repasar Tutorial">
                <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="hidden lg:inline">Ayuda</span>
              </button>
            )}

            <button onClick={onToggleMute}
              className="flex h-7 w-7 items-center justify-center text-stone-600 hover:bg-stone-100 rounded-lg transition-all active:scale-95 shrink-0"
              title={isMuted ? 'Activar Sonido' : 'Silenciar'}>
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
            </button>

            <button onClick={onPause}
              className="flex h-7 px-2 items-center justify-center text-[10px] font-bold text-stone-600 hover:bg-stone-100 rounded-lg transition-all active:scale-95"
              title="Pausar juego">
              PAUSA
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. ZONA CENTRAL DESPEJADA: Solo avisos efímeros no invasivos      */}
      {/* ================================================================ */}
      <div className="flex flex-col items-center gap-2 pointer-events-none">
        {/* Pastilla no invasiva del tutorial: se ubica arriba y se desvanece sola */}
        {visibleTutorial && !toast && (
          <div
            className="transition-opacity duration-500 max-w-md px-4 py-1.5 rounded-full text-center flex items-center gap-2 shadow-md"
            style={{
              opacity: tutorialOpacity,
              background: 'rgba(255, 251, 235, 0.96)',
              border: '1px solid #fde047',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <div className="text-xs font-bold text-stone-800 truncate">
              {visibleTutorial}
            </div>
          </div>
        )}

        {/* Notificación Toast temporal */}
        {toast && (
          <div className="max-w-md w-full animate-bounce">
            <div className="px-4 py-2 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2"
              style={{
                background: toast.type === 'success' ? 'rgba(220,252,231,0.98)' : toast.type === 'warning' ? 'rgba(255,251,235,0.98)' : 'rgba(255,252,245,0.98)',
                border: `1.5px solid ${toast.type === 'success' ? '#86efac' : toast.type === 'warning' ? '#fde047' : '#d1c4a0'}`,
                color: toast.type === 'success' ? '#15803d' : toast.type === 'warning' ? '#a16207' : '#44403c',
                boxShadow: '0 4px 20px rgba(120,80,20,0.15)',
              }}>
              {toast.message}
            </div>
          </div>
        )}

        {/* Barra de progreso de la batidora */}
        {mixingProgress !== null && (
          <div className="flex flex-col items-center px-5 py-3 rounded-2xl min-w-[240px]"
            style={{ ...panelStyle, boxShadow: '0 8px 32px rgba(120,80,20,0.18)' }}>
            <UtensilsCrossed className="w-5 h-5 mb-1 animate-spin text-amber-600" />
            <div className="text-xs font-black text-stone-800 mb-1.5">Batiendo Masa...</div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-stone-200">
              <div className="h-full rounded-full transition-all duration-100"
                style={{ width: `${mixingProgress}%`, background: 'linear-gradient(90deg, #d97706, #ea580c)' }} />
            </div>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* 3. BOTTOM CARDS UNIFICADAS Y COMPACTAS                          */}
      {/* ================================================================ */}
      <div className="flex flex-wrap items-end justify-between gap-3 w-full">

        {/* Tarjeta A: Pedido del cliente actual */}
        {currentOrder ? (
          <div className="pointer-events-auto max-w-sm w-full p-3 rounded-2xl" style={panelStyle}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-sm shrink-0"
                  style={{ backgroundColor: currentOrder.avatarColor }} />
                <span className="font-black text-xs text-stone-800">{currentOrder.customerName}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600 border border-stone-200 uppercase">
                  {currentOrder.customerType}
                </span>
              </div>
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                +${currentOrder.totalPrice}
              </span>
            </div>

            {/* Barra de paciencia delgada */}
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-stone-200 mb-2">
              <div className="h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(4, patienceRatio * 100)}%`, backgroundColor: getPatienceColor(patienceRatio) }} />
            </div>

            {/* Lista compacta de ítems */}
            <div className="space-y-1">
              {currentOrder.items.map((prodId, idx) => {
                const recipe = RECIPES[prodId];
                const isDelivered = currentOrder.deliveredItems.includes(prodId);
                return (
                  <div key={`ord-${idx}`}
                    className="flex items-center justify-between px-2 py-1 rounded-lg text-xs"
                    style={{
                      background: isDelivered ? '#f0fdf4' : '#fefdfa',
                      border: `1px solid ${isDelivered ? '#86efac' : 'rgba(180,140,80,0.18)'}`,
                      opacity: isDelivered ? 0.6 : 1,
                    }}>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-sm">{recipe.emoji}</span>
                      <span className="font-bold text-stone-800 truncate" style={{ textDecoration: isDelivered ? 'line-through' : 'none' }}>
                        {recipe.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-black text-amber-800 shrink-0 ml-2">${recipe.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-500" style={panelStyle}>
            Esperando próximo cliente...
          </div>
        )}

        {/* Tarjeta B: En tus Manos (Mismo sistema visual y proporción) */}
        <div className="pointer-events-auto min-w-[260px] max-w-sm w-full p-3 rounded-2xl" style={panelStyle}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-600" />
              En tus Manos
            </span>
            {tray.type !== 'empty' && (
              <button onClick={onClearTray}
                className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-lg transition-colors border border-red-200">
                <Trash2 className="w-3 h-3" />
                <span>Vaciar</span>
              </button>
            )}
          </div>
          <div className="min-h-[40px] flex items-center">
            {renderTrayContent()}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MODAL DE RECETAS                                                  */}
      {/* ================================================================ */}
      {showRecipesModal && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(60,40,20,0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="relative w-full max-w-lg p-6 rounded-3xl shadow-2xl"
            style={{ background: '#fffbf5', border: '2px solid rgba(180,140,80,0.4)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-black text-stone-800">Libro de Recetas</h3>
              </div>
              <button onClick={() => setShowRecipesModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {availableProducts.map(prodId => {
                const rec = RECIPES[prodId];
                return (
                  <div key={`rec-${prodId}`} className="p-3 rounded-2xl flex items-center justify-between bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm bg-amber-100 text-amber-800">
                        {rec.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black text-stone-800">{rec.name}</div>
                        <div className="text-xs font-semibold text-amber-700 mt-0.5">
                          {rec.ingredients.map(i => INGREDIENTS[i].name).join(' + ')}
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          Horno: {rec.bakeTimeSeconds}s {rec.requiresDecoration ? '· Requiere Decoración' : ''}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-black text-amber-700">${rec.price}</span>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setShowRecipesModal(false)}
              className="w-full mt-4 py-2.5 rounded-2xl font-black text-sm text-white transition-colors"
              style={{ background: 'linear-gradient(135deg, #d97706, #ea580c)' }}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
