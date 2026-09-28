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

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 md:p-4">

      {/* ================================================================ */}
      {/* TOP BAR                                                           */}
      {/* ================================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-2">

        {/* Izquierda */}
        <div className="flex items-center gap-2">
          {/* Dinero */}
          <div className="flex items-center gap-2 px-3 py-2" style={panelStyle}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #d97706, #ea580c)' }}>$</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-stone-400 uppercase leading-none">Ganado</span>
              <span className="text-sm font-black text-stone-800 leading-tight">
                ${money.toLocaleString()} <span className="text-[10px] font-medium text-stone-400">/ ${targetMoney.toLocaleString()}</span>
              </span>
            </div>
          </div>

          {/* Nivel + Dificultad */}
          <div className="hidden sm:flex flex-col px-3 py-2" style={panelStyle}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Día {levelNumber}</span>
              {diffStyle && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: diffStyle.bg, color: diffStyle.text, border: `1px solid ${diffStyle.border}` }}>
                  {difficultyLabel}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-stone-700">{levelTitle}</span>
          </div>

          {/* Acciones */}
          <div className="pointer-events-auto flex gap-1.5">
            <button onClick={() => setShowRecipesModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-800 transition-all active:scale-95 hover:bg-amber-100 rounded-xl"
              style={panelStyle}>
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Recetas</span>
            </button>
            {onOpenTutorial && (
              <button onClick={onOpenTutorial}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-orange-800 transition-all active:scale-95 hover:bg-orange-100 rounded-xl"
                style={{ ...panelStyle, border: '1.5px solid rgba(251,146,60,0.35)' }}>
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Tutorial</span>
              </button>
            )}
          </div>
        </div>

        {/* Centro: Reloj + Puntaje */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 ${timeLeftSeconds <= 30 ? 'animate-pulse' : ''}`}
            style={{
              ...panelStyle,
              background: timeLeftSeconds <= 30 ? 'rgba(254,226,226,0.97)' : 'rgba(255,252,245,0.97)',
              border: timeLeftSeconds <= 30 ? '1.5px solid rgba(239,68,68,0.4)' : '1.5px solid rgba(180,140,80,0.25)',
            }}>
            <Clock className="w-5 h-5" style={{ color: timeLeftSeconds <= 30 ? '#ef4444' : '#d97706' }} />
            <span className="text-lg font-black tracking-tight" style={{ color: timeLeftSeconds <= 30 ? '#ef4444' : '#292524' }}>
              {formattedTime}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2" style={panelStyle}>
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-black text-stone-800">{score.toLocaleString()} pts</span>
          </div>
        </div>

        {/* Derecha */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-2" style={panelStyle}>
            {Array.from({ length: maxLives }).map((_, idx) => (
              <Heart key={`heart-${idx}`} className="w-5 h-5 transition-all duration-200"
                style={{ fill: idx < lives ? '#ef4444' : '#e5e7eb', color: idx < lives ? '#ef4444' : '#d1d5db', transform: idx < lives ? 'scale(1)' : 'scale(0.85)' }} />
            ))}
          </div>

          <div className="pointer-events-auto flex gap-1.5">
            <button onClick={onToggleMute}
              className="flex h-9 w-9 items-center justify-center transition-all active:scale-95"
              style={panelStyle} title={isMuted ? 'Activar Sonido' : 'Silenciar'}>
              {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
            </button>
            <button onClick={onPause}
              className="flex h-9 px-3 items-center justify-center text-[11px] font-bold text-stone-600 transition-all active:scale-95"
              style={panelStyle}>
              PAUSA [ESC]
            </button>
          </div>
        </div>
      </div>

      {/* Barra de meta de dinero */}
      <div className="self-center w-full max-w-sm">
        <div className="flex justify-between text-[10px] font-semibold mb-1 text-stone-500">
          <span>Meta del día</span>
          <span style={{ color: money >= targetMoney ? '#16a34a' : '#78716c' }}>
            {Math.min(100, Math.round((money / targetMoney) * 100))}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden bg-stone-200">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (money / targetMoney) * 100)}%`, background: money >= targetMoney ? '#16a34a' : 'linear-gradient(90deg, #d97706, #ea580c)' }} />
        </div>
      </div>

      {/* Batidora */}
      {mixingProgress !== null && (
        <div className="self-center flex flex-col items-center">
          <div className="flex flex-col items-center px-7 py-4 rounded-2xl min-w-[280px]"
            style={{ background: 'rgba(255,252,245,0.98)', border: '2px solid rgba(180,140,80,0.35)', boxShadow: '0 8px 32px rgba(120,80,20,0.18)' }}>
            <UtensilsCrossed className="w-7 h-7 mb-1 animate-spin text-amber-600" />
            <div className="text-sm font-black text-stone-800 mb-2">Batiendo en la Batidora</div>
            <div className="w-full h-3 rounded-full overflow-hidden bg-stone-200">
              <div className="h-full rounded-full transition-all duration-100"
                style={{ width: `${mixingProgress}%`, background: 'linear-gradient(90deg, #d97706, #ea580c)' }} />
            </div>
            <div className="text-xs font-bold mt-1.5 text-amber-700">
              {mixingProgress < 100 ? `Mezclando... ${mixingProgress}%` : 'Masa Lista'}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="self-center max-w-md w-full">
          <div className="px-5 py-3 rounded-2xl text-center text-xs md:text-sm font-bold flex items-center justify-center gap-2"
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

      {/* Tutorial tip */}
      {!toast && tutorialTip && (
        <div className="self-center max-w-lg px-5 py-2.5 rounded-2xl text-center"
          style={{ background: 'rgba(255,251,235,0.98)', border: '1.5px solid #fde047', boxShadow: '0 4px 16px rgba(120,80,20,0.12)' }}>
          <div className="text-[10px] font-bold uppercase tracking-wide text-amber-700 mb-0.5">Instrucción del Día:</div>
          <div className="text-sm font-semibold text-stone-800">{tutorialTip}</div>
        </div>
      )}

      {/* ================================================================ */}
      {/* BOTTOM: Pedido + Bandeja                                          */}
      {/* ================================================================ */}
      <div className="flex flex-wrap items-end justify-between gap-3">

        {/* Pedido del cliente */}
        {currentOrder ? (
          <div className="pointer-events-auto max-w-sm w-full p-4 rounded-2xl"
            style={{ background: 'rgba(255,252,245,0.98)', border: '1.5px solid rgba(180,140,80,0.3)', boxShadow: '0 4px 24px rgba(120,80,20,0.18)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: currentOrder.avatarColor }} />
                <span className="font-black text-sm text-stone-800">{currentOrder.customerName}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 uppercase">
                  {currentOrder.customerType}
                </span>
              </div>
              <span className="text-xs font-black text-amber-700">+${currentOrder.totalPrice}</span>
            </div>

            {/* Barra de paciencia */}
            <div className="w-full h-2 rounded-full overflow-hidden bg-stone-200 mb-3">
              <div className="h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(4, patienceRatio * 100)}%`, backgroundColor: getPatienceColor(patienceRatio) }} />
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Pedido:</div>
              {currentOrder.items.map((prodId, idx) => {
                const recipe = RECIPES[prodId];
                const isDelivered = currentOrder.deliveredItems.includes(prodId);
                return (
                  <div key={`ord-${idx}`}
                    className="flex items-center justify-between p-2 rounded-xl"
                    style={{
                      background: isDelivered ? '#f0fdf4' : '#fdf6ec',
                      border: `1px solid ${isDelivered ? '#86efac' : '#e8d5b0'}`,
                      opacity: isDelivered ? 0.6 : 1,
                    }}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold bg-amber-100 text-amber-800">
                        {recipe.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-black text-stone-800" style={{ textDecoration: isDelivered ? 'line-through' : 'none' }}>
                          {recipe.name}
                        </div>
                        <div className="text-[10px] font-semibold text-amber-700">
                          {recipe.ingredients.map(i => INGREDIENTS[i].name).join(' + ')}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-700">${recipe.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="px-4 py-2 rounded-2xl text-xs font-semibold text-stone-500"
            style={panelStyle}>
            Esperando próximo cliente...
          </div>
        )}

        {/* Bandeja */}
        <div className="pointer-events-auto min-w-[280px] max-w-md w-full p-4 rounded-2xl"
          style={{ background: 'rgba(255,252,245,0.98)', border: '1.5px solid rgba(180,140,80,0.3)', boxShadow: '0 4px 24px rgba(120,80,20,0.18)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-600" />
              En tus Manos
            </span>
            {tray.type !== 'empty' && (
              <button onClick={onClearTray}
                className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-lg transition-colors border border-red-200">
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
