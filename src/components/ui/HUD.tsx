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
}

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
}) => {
  const [showRecipesModal, setShowRecipesModal] = useState(false);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = Math.floor(timeLeftSeconds % 60);
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const patienceRatio = currentOrder
    ? currentOrder.currentPatienceSeconds / currentOrder.maxPatienceSeconds
    : 0;

  const renderTrayContent = () => {
    switch (tray.type) {
      case 'empty':
        return (
          <div className="flex items-center gap-2 text-slate-400 italic text-sm">
            <span>Bandeja vacía</span>
            <span className="text-xs text-slate-500 font-normal">(Toma ingredientes con [E] en la estantería)</span>
          </div>
        );
      case 'ingredients':
        return (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="text-xs font-bold uppercase tracking-wider text-pink-600 flex items-center justify-between">
              <span>Ingredientes en Bandeja ({tray.items.length}/5):</span>
              <span className="text-[10px] text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full font-black">
                {tray.items.length >= 3 ? 'Listo para batir' : 'Agrega más'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {tray.items.map((ingId, idx) => {
                const ing = INGREDIENTS[ingId];
                return (
                  <span
                    key={`${ingId}-${idx}`}
                    className="inline-flex items-center gap-1 bg-white border border-pink-200 px-2.5 py-1 rounded-xl text-xs font-black text-slate-800 shadow-sm"
                  >
                    <span>{ing.name}</span>
                  </span>
                );
              })}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
              → Llévalos a la Batidora Rosa y presiona [E] para batir
            </div>
          </div>
        );
      case 'mixed_dough': {
        const recipe = RECIPES[tray.recipeId];
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
                MASA
              </div>
              <div>
                <div className="text-xs font-bold text-amber-600 uppercase">Masa Lista:</div>
                <div className="text-sm font-black text-slate-800">{recipe.name} (Cruda)</div>
              </div>
            </div>
            <div className="text-xs text-amber-900 bg-amber-200 font-black px-3 py-1 rounded-full shadow-sm animate-bounce">
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
              <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-xs">
                HORNO
              </div>
              <div>
                <div className="text-xs font-bold text-pink-600 uppercase">Horneado:</div>
                <div className="text-sm font-black text-slate-800">{recipe.name}</div>
              </div>
            </div>
            {recipe.requiresDecoration ? (
              <div className="text-xs text-purple-900 bg-purple-200 font-black px-3 py-1 rounded-full shadow-sm">
                → Mesa de Decoración [E]
              </div>
            ) : (
              <div className="text-xs text-emerald-900 bg-emerald-200 font-black px-3 py-1 rounded-full shadow-sm">
                → Entregar al Mostrador [E]
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
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                LISTO
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-600 uppercase">Listo para servir:</div>
                <div className="text-sm font-black text-slate-800">{recipe.name}</div>
              </div>
            </div>
            <div className="text-xs text-emerald-900 bg-emerald-200 font-black px-3 py-1 rounded-full shadow-sm animate-pulse">
              → Entregar en Mostrador [E]
            </div>
          </div>
        );
      }
      case 'burnt': {
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-xs">
                QUEMADO
              </div>
              <div>
                <div className="text-xs font-bold text-rose-600 uppercase">¡Se quemó!</div>
                <div className="text-sm font-black text-slate-800">Producto carbonizado</div>
              </div>
            </div>
            <div className="text-xs text-rose-900 bg-rose-200 font-black px-3 py-1 rounded-full shadow-sm">
              → Tirar a la Basura [E]
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6">
      {/* ============================================================== */}
      {/* TOP BAR: Money, Level, Timer, Score, Lives, Settings */}
      {/* ============================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Money & Level */}
        <div className="flex items-center gap-3">
          {/* Money badge */}
          <div className="flex items-center gap-2 rounded-2xl border-2 border-pink-300/80 bg-white/95 px-4 py-2 shadow-xl backdrop-blur-md">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-400 text-amber-950 font-black shadow-inner">
              $
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase leading-none">Ganado</span>
              <span className="text-base font-black text-slate-800 leading-tight">
                ${money} <span className="text-xs font-medium text-slate-400">/ ${targetMoney}</span>
              </span>
            </div>
          </div>

          {/* Level Title */}
          <div className="hidden sm:flex flex-col rounded-2xl border-2 border-pink-300/80 bg-white/95 px-4 py-2 shadow-xl backdrop-blur-md">
            <span className="text-[10px] font-black uppercase text-pink-500 tracking-wider">
              Nivel {levelNumber}
            </span>
            <span className="text-xs font-bold text-slate-800">{levelTitle}</span>
          </div>

          {/* Recipe book button (clickable) */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => setShowRecipesModal(true)}
              className="flex items-center gap-1.5 rounded-2xl border-2 border-pink-300 bg-pink-100 hover:bg-pink-200 px-3 py-2 text-xs font-black text-pink-800 shadow-xl backdrop-blur-md active:scale-95 transition-all"
            >
              <BookOpen className="w-4 h-4 text-pink-600" />
              <span>Recetas</span>
            </button>
            {onOpenTutorial && (
              <button
                onClick={onOpenTutorial}
                className="flex items-center gap-1.5 rounded-2xl border-2 border-amber-300 bg-amber-100 hover:bg-amber-200 px-3 py-2 text-xs font-black text-amber-900 shadow-xl backdrop-blur-md active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Tutorial</span>
              </button>
            )}
          </div>
        </div>

        {/* Center: Timer & Score */}
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div
            className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2 shadow-xl backdrop-blur-md ${
              timeLeftSeconds <= 30
                ? 'border-rose-400 bg-rose-50 text-rose-600 animate-pulse'
                : 'border-pink-300/80 bg-white/90 text-slate-800'
            }`}
          >
            <Clock className="w-5 h-5 text-pink-500" />
            <span className="text-lg font-black tracking-tight">{formattedTime}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 rounded-2xl border-2 border-pink-300/80 bg-white/90 px-4 py-2 shadow-xl backdrop-blur-md">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-black text-slate-800">{score} pts</span>
          </div>
        </div>

        {/* Right: Hearts & Sound / Pause */}
        <div className="flex items-center gap-3">
          {/* Hearts */}
          <div className="flex items-center gap-1 rounded-2xl border-2 border-pink-300/80 bg-white/90 px-3.5 py-2 shadow-xl backdrop-blur-md">
            {Array.from({ length: maxLives }).map((_, idx) => (
              <Heart
                key={`heart-${idx}`}
                className={`w-5 h-5 transition-all duration-200 ${
                  idx < lives
                    ? 'fill-rose-500 text-rose-500 scale-100'
                    : 'fill-slate-200 text-slate-300 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Audio toggle & Pause */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-pink-300/80 bg-white/90 text-slate-700 shadow-xl backdrop-blur-md hover:bg-pink-50 active:scale-95 transition-all"
              title={isMuted ? 'Activar Sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-pink-500" />}
            </button>
            <button
              onClick={onPause}
              className="flex h-10 px-3.5 items-center justify-center rounded-2xl border-2 border-pink-300/80 bg-white/90 text-xs font-black text-slate-700 shadow-xl backdrop-blur-md hover:bg-pink-50 active:scale-95 transition-all"
            >
              PAUSA [ESC]
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MIDDLE: Active Mixing Progress Meter */}
      {/* ============================================================== */}
      {mixingProgress !== null && (
        <div className="self-center flex flex-col items-center animate-scale-in">
          <div className="bg-slate-900/95 border-2 border-pink-400 px-7 py-4 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col items-center min-w-[300px]">
            <UtensilsCrossed className="w-8 h-8 text-pink-400 mb-1 animate-spin" />
            <div className="text-base font-black text-white mb-2">Batiendo en la Batidora</div>
            <div className="w-full bg-slate-700 h-4 rounded-full overflow-hidden border border-white/20 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-400 transition-all duration-100 rounded-full"
                style={{ width: `${mixingProgress}%` }}
              />
            </div>
            <div className="text-xs font-bold text-pink-300 mt-2">
              {mixingProgress < 100 ? `Mezclando ingredientes... ${mixingProgress}%` : 'Masa Lista'}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOAST ALERT NOTIFICATION BANNER */}
      {/* ============================================================== */}
      {toast && (
        <div className="self-center max-w-md w-full animate-bounce">
          <div
            className={`px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-center text-xs md:text-sm font-black flex items-center justify-center gap-2 ${
              toast.type === 'success'
                ? 'bg-emerald-900/95 border-emerald-400 text-emerald-100'
                : toast.type === 'warning'
                ? 'bg-amber-900/95 border-amber-400 text-amber-100'
                : 'bg-slate-900/95 border-pink-400 text-white'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Tutorial Banner (if active) */}
      {!toast && tutorialTip && (
        <div className="self-center max-w-lg rounded-2xl border-2 border-amber-300 bg-amber-50/95 px-5 py-2.5 shadow-2xl backdrop-blur-md text-center">
          <div className="text-xs font-black text-amber-800 uppercase tracking-wide">
            Instrucción del Día:
          </div>
          <div className="text-sm font-bold text-amber-950 mt-0.5">{tutorialTip}</div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BOTTOM AREA: Active Customer Order & Current Tray in Hands */}
      {/* ============================================================== */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        {/* Customer Order Card (Left) */}
        {currentOrder ? (
          <div className="pointer-events-auto max-w-sm w-full rounded-3xl border-3 border-pink-300 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
            {/* Header: Customer Name & Type */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: currentOrder.avatarColor }}
                />
                <span className="font-black text-sm text-slate-800">
                  {currentOrder.customerName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 uppercase">
                  {currentOrder.customerType}
                </span>
              </div>
              <span className="text-xs font-black text-amber-600">
                +${currentOrder.totalPrice}
              </span>
            </div>

            {/* Patience Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  patienceRatio > 0.6
                    ? 'bg-emerald-500'
                    : patienceRatio > 0.3
                    ? 'bg-amber-400'
                    : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${Math.max(5, patienceRatio * 100)}%` }}
              />
            </div>

            {/* Requested Items */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pedido solicitado:
              </div>
              <div className="space-y-1.5">
                {currentOrder.items.map((prodId, idx) => {
                  const recipe = RECIPES[prodId];
                  const isDelivered = currentOrder.deliveredItems.includes(prodId);
                  return (
                    <div
                      key={`ord-${idx}`}
                      className={`flex items-center justify-between p-2 rounded-xl border ${
                        isDelivered
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 line-through opacity-60'
                          : 'bg-pink-50/70 border-pink-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-pink-200 flex items-center justify-center text-pink-800 font-bold text-xs">
                          {recipe.name[0]}
                        </div>
                        <div>
                          <div className="text-xs font-black">{recipe.name}</div>
                          <div className="text-[10px] text-pink-700 font-bold">
                            Ingredientes: {recipe.ingredients.map(i => INGREDIENTS[i].name).join(' + ')}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-pink-600">${recipe.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-slate-200 bg-white/80 px-4 py-2 text-xs font-bold text-slate-500">
            Esperando próximo cliente...
          </div>
        )}

        {/* Current Tray / Hands Card (Right) */}
        <div className="pointer-events-auto min-w-[280px] max-w-md w-full rounded-3xl border-3 border-pink-300 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black tracking-wider uppercase text-amber-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-700" />
              <span>En tus Manos (Bandeja)</span>
            </span>
            {tray.type !== 'empty' && (
              <button
                onClick={onClearTray}
                className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-lg transition-colors"
                title="Descartar bandeja en la basura"
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

      {/* ============================================================== */}
      {/* RECIPES MODAL (Cheat Sheet) */}
      {/* ============================================================== */}
      {showRecipesModal && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl border-4 border-pink-300 bg-white p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-pink-600" />
                <h3 className="text-xl font-black text-amber-950">Libro de Recetas</h3>
              </div>
              <button
                onClick={() => setShowRecipesModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
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
                    className="p-3 rounded-2xl bg-pink-50/70 border border-pink-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-black text-sm">
                        {rec.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800">{rec.name}</div>
                        <div className="text-xs font-bold text-pink-700 mt-0.5">
                          {rec.ingredients.map(i => INGREDIENTS[i].name).join(' + ')}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Horno: {rec.bakeTimeSeconds}s {rec.requiresDecoration ? '• Requiere Decoración' : ''}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-black text-amber-600">${rec.price}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowRecipesModal(false)}
              className="w-full mt-4 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-black text-sm shadow-md transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
