'use client';

import React, { useState } from 'react';
import { CustomerOrder, INGREDIENTS, ProductId, RECIPES, TrayState, DECORATION_OPTIONS, DEFAULT_PRODUCT_DECORATIONS } from '@/types/game';
import { Volume2, VolumeX, Heart, Clock, Award, Trash2, BookOpen, X, Sparkles, UtensilsCrossed, Package, DollarSign } from 'lucide-react';
import { CandyCard, CandyBadge, CandyProgressBar, CandyButton, CandyModal, CandyToast } from '@/components/ui/design-system';

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

  // Estado del tutorial de tip efímero
  const [visibleTutorial, setVisibleTutorial] = React.useState<string | null>(null);
  const [tutorialOpacity, setTutorialOpacity] = React.useState<number>(0);
  const lastTipRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (tutorialTip && tutorialTip !== lastTipRef.current) {
      lastTipRef.current = tutorialTip;
      setVisibleTutorial(tutorialTip);
      setTutorialOpacity(1);

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

  const renderTrayContent = () => {
    switch (tray.type) {
      case 'empty':
        return (
          <div className="flex items-center gap-2 italic text-xs text-stone-400">
            <span>Bandeja vacía</span>
            <span className="text-[10px] text-stone-400">(Toma ingredientes con [E])</span>
          </div>
        );
      case 'ingredients':
        return (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="text-[10px] font-black uppercase tracking-wider flex items-center justify-between text-amber-900">
              <span>Ingredientes ({tray.items.length}/5):</span>
              <CandyBadge
                variant={tray.items.length >= 3 ? 'success' : 'warning'}
                size="sm"
              >
                {tray.items.length >= 3 ? 'Listo para batir' : 'Agrega más'}
              </CandyBadge>
            </div>
            <div className="flex flex-wrap gap-1">
              {tray.items.map((ingId, idx) => (
                <span
                  key={`${ingId}-${idx}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black bg-white border border-pink-200 text-[#451a03] shadow-2xs"
                >
                  {INGREDIENTS[ingId].name}
                </span>
              ))}
            </div>
            <div className="text-[10px] font-black text-emerald-700 mt-0.5">
              → Llévalos a la Batidora Rosa y presiona [E]
            </div>
          </div>
        );
      case 'mixed_dough': {
        const recipe = RECIPES[tray.recipeId];
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-black text-xs border border-purple-200 shadow-2xs">
                MASA
              </div>
              <div>
                <div className="text-[9px] font-black text-purple-700 uppercase">Masa Lista:</div>
                <div className="text-xs font-black text-[#451a03]">{recipe.name}</div>
              </div>
            </div>
            <CandyBadge variant="secondary" size="sm" className="animate-bounce">
              → Horno [E]
            </CandyBadge>
          </div>
        );
      }
      case 'baked': {
        const recipe = RECIPES[tray.recipeId];
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700 font-black text-xs border border-orange-200 shadow-2xs">
                HORN
              </div>
              <div>
                <div className="text-[9px] font-black text-orange-700 uppercase">Horneado:</div>
                <div className="text-xs font-black text-[#451a03]">{recipe.name}</div>
              </div>
            </div>
            {recipe.requiresDecoration ? (
              <CandyBadge variant="primary" size="sm">
                → Decoración [E]
              </CandyBadge>
            ) : (
              <CandyBadge variant="success" size="sm">
                → Mostrador [E]
              </CandyBadge>
            )}
          </div>
        );
      }
      case 'finished': {
        const recipe = RECIPES[tray.recipeId];
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center text-pink-700 font-black text-xs border border-pink-200 shadow-2xs">
                LISTO
              </div>
              <div>
                <div className="text-[9px] font-black text-pink-700 uppercase">
                  {tray.isIncorrectDecor ? 'Decoración Errónea:' : 'Listo para servir:'}
                </div>
                <div className="text-xs font-black text-[#451a03]">{recipe.name}</div>
              </div>
            </div>
            <CandyBadge variant={tray.isIncorrectDecor ? 'warning' : 'success'} size="sm" className="animate-pulse">
              → Mostrador [E]
            </CandyBadge>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 md:p-4 select-none">
      {/* Toast Notification unificada */}
      {toast && (
        <CandyToast
          message={toast.message}
          type={toast.type}
        />
      )}

      {/* ================================================================ */}
      {/* 1. TOP BAR REAGRUPADA: 3 BLOQUES COMPACTOS CON DISEÑO UNIFICADO */}
      {/* ================================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-2 w-full">
        {/* --- BLOQUE IZQUIERDO: Progreso del Día y Ganancias --- */}
        <CandyCard variant="cream" className="flex items-center p-0 border-2 border-pink-200 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-2xs bg-gradient-to-r from-pink-500 to-rose-500 shrink-0">
              $
            </div>
            <div className="flex flex-col min-w-[110px]">
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] font-black text-stone-400 uppercase leading-none">Meta</span>
                <span className="text-[10px] font-black text-pink-600">
                  {Math.min(100, Math.round((money / targetMoney) * 100))}%
                </span>
              </div>
              <span className="text-xs font-black text-[#451a03] leading-tight">
                ${money.toLocaleString()}{' '}
                <span className="text-[9px] font-bold text-stone-400">/ ${targetMoney.toLocaleString()}</span>
              </span>
              <div className="w-full mt-1">
                <CandyProgressBar
                  value={money}
                  max={targetMoney}
                  variant={money >= targetMoney ? 'success' : 'primary'}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-pink-200/80" />

          {/* Nivel + Dificultad */}
          <div className="hidden sm:flex flex-col px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-700">Día {levelNumber}</span>
              {difficultyLabel && (
                <CandyBadge variant="warning" size="sm">
                  {difficultyLabel}
                </CandyBadge>
              )}
            </div>
            <span className="text-xs font-black text-[#451a03] truncate max-w-[110px]">{levelTitle}</span>
          </div>
        </CandyCard>

        {/* --- BLOQUE CENTRO: Reloj y Puntaje --- */}
        <CandyCard variant="cream" className="flex items-center p-0 border-2 border-pink-200 shadow-sm">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 ${timeLeftSeconds <= 30 ? 'animate-pulse' : ''}`}>
            <Clock
              className={`w-4 h-4 shrink-0 ${timeLeftSeconds <= 30 ? 'text-rose-600' : 'text-amber-600'}`}
            />
            <span
              className={`text-sm font-black tracking-tight ${timeLeftSeconds <= 30 ? 'text-rose-600' : 'text-[#451a03]'}`}
            >
              {formattedTime}
            </span>
          </div>

          <div className="h-6 w-[1px] bg-pink-200/80" />

          <div className="flex items-center gap-1.5 px-3 py-1.5">
            <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="text-xs font-black text-[#451a03] whitespace-nowrap">
              {score.toLocaleString()} <span className="text-[9px] font-bold text-stone-400">pts</span>
            </span>
          </div>
        </CandyCard>

        {/* --- BLOQUE DERECHO: Vidas y Botones --- */}
        <CandyCard variant="cream" className="flex items-center p-0 border-2 border-pink-200 shadow-sm">
          {/* Corazones / Vidas */}
          <div className="flex items-center gap-1 px-2.5 py-1.5">
            {Array.from({ length: maxLives }).map((_, idx) => (
              <Heart
                key={`heart-${idx}`}
                className="w-3.5 h-3.5 transition-all duration-200"
                style={{
                  fill: idx < lives ? '#ec4899' : '#e2e8f0',
                  color: idx < lives ? '#db2777' : '#cbd5e1',
                  transform: idx < lives ? 'scale(1)' : 'scale(0.85)',
                }}
              />
            ))}
          </div>

          <div className="h-6 w-[1px] bg-pink-200/80" />

          {/* Botones de acción compactos con Candy styling */}
          <div className="pointer-events-auto flex items-center gap-1 px-1.5 py-1">
            <button
              onClick={() => setShowRecipesModal(true)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-black text-amber-900 hover:bg-amber-100 rounded-full transition-all active:scale-95 border border-transparent hover:border-amber-200"
              title="Libro de Recetas"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden md:inline">Recetas</span>
            </button>

            {onOpenTutorial && (
              <button
                onClick={onOpenTutorial}
                className="flex items-center gap-1 px-2 py-1 text-xs font-black text-purple-900 hover:bg-purple-100 rounded-full transition-all active:scale-95 border border-transparent hover:border-purple-200"
                title="Repasar Tutorial"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="hidden lg:inline">Ayuda</span>
              </button>
            )}

            <button
              onClick={onToggleMute}
              className="flex h-7 w-7 items-center justify-center text-stone-600 hover:bg-pink-100 rounded-full transition-all active:scale-95 shrink-0"
              title={isMuted ? 'Activar Sonido' : 'Silenciar'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-pink-600" />
              )}
            </button>

            <button
              onClick={onPause}
              className="flex h-7 px-2.5 items-center justify-center text-[10px] font-black text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all shadow-[0_2px_0_#9d174d] active:translate-y-0.5 active:shadow-none"
              title="Pausar juego"
            >
              PAUSA
            </button>
          </div>
        </CandyCard>
      </div>

      {/* Pastilla no invasiva del tutorial: anclada en la parte superior sin tapar el centro */}
      {visibleTutorial && !toast && (
        <div className="pointer-events-none fixed top-16 left-1/2 -translate-x-1/2 z-30 max-w-md w-full px-4 flex justify-center">
          <div
            className="transition-opacity duration-500 px-4 py-1.5 rounded-full text-center flex items-center gap-2 shadow-md bg-[#fffbf5]/95 border border-amber-300 backdrop-blur-md"
            style={{ opacity: tutorialOpacity }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <div className="text-xs font-bold text-[#451a03] truncate">
              {visibleTutorial}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 2. ZONA CENTRAL: Barra de progreso de la batidora                */}
      {/* ================================================================ */}
      <div className="flex flex-col items-center gap-2 pointer-events-none">
        {mixingProgress !== null && (
          <CandyCard
            variant="cream"
            className="flex flex-col items-center px-6 py-3 min-w-[240px] border-2 border-pink-300 shadow-xl"
          >
            <UtensilsCrossed className="w-5 h-5 mb-1 animate-spin text-pink-600" />
            <div className="text-xs font-black text-[#451a03] mb-1.5">Batiendo Masa...</div>
            <CandyProgressBar value={mixingProgress} variant="primary" size="md" className="w-48" />
          </CandyCard>
        )}
      </div>

      {/* ================================================================ */}
      {/* 3. BOTTOM CARDS UNIFICADAS Y COMPACTAS                          */}
      {/* ================================================================ */}
      <div className="flex flex-wrap items-end justify-between gap-3 w-full">
        {/* Tarjeta A: Pedido del cliente actual */}
        {currentOrder ? (
          <CandyCard
            variant="cream"
            className="pointer-events-auto max-w-sm w-full p-3.5 border-2 border-pink-200/90 shadow-md"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded-full ring-2 ring-white shadow-xs shrink-0"
                  style={{ backgroundColor: currentOrder.avatarColor }}
                />
                <span className="font-black text-xs text-[#451a03]">{currentOrder.customerName}</span>
                <CandyBadge variant="neutral" size="sm">
                  {currentOrder.customerType}
                </CandyBadge>
              </div>
              <span className="text-xs font-black text-pink-700 bg-pink-100/80 px-2 py-0.5 rounded-full border border-pink-200">
                +${currentOrder.totalPrice}
              </span>
            </div>

            {/* Barra de paciencia */}
            <div className="mb-2">
              <CandyProgressBar
                value={patienceRatio * 100}
                variant="patience"
                size="sm"
              />
            </div>

            {/* Lista compacta de ítems */}
            <div className="space-y-1">
              {currentOrder.items.map((prodId, idx) => {
                const recipe = RECIPES[prodId];
                const isDelivered = currentOrder.deliveredItems.includes(prodId);
                return (
                  <div
                    key={`ord-${idx}`}
                    className="flex items-center justify-between px-2 py-1 rounded-xl text-xs transition-colors"
                    style={{
                      background: isDelivered ? '#f0fdf4' : '#ffffff',
                      border: `1px solid ${isDelivered ? '#86efac' : 'rgba(236,72,153,0.2)'}`,
                      opacity: isDelivered ? 0.6 : 1,
                    }}
                  >
                    <div className="flex flex-col truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-sm">{recipe.emoji}</span>
                        <span
                          className="font-black text-[#451a03] truncate"
                          style={{ textDecoration: isDelivered ? 'line-through' : 'none' }}
                        >
                          {recipe.name}
                        </span>
                      </div>
                      {!isDelivered && (
                        <div className="flex flex-col gap-0.5 ml-6">
                          <span className="text-[9px] text-stone-500 font-medium leading-tight truncate">
                            {recipe.ingredients.map(i => INGREDIENTS[i].name).join(' + ')}
                          </span>
                          {recipe.requiresDecoration && (
                            <span className="text-[9px] font-black text-pink-600 leading-tight truncate flex items-center gap-1">
                              🎨{' '}
                              {(currentOrder.requestedDecorations?.[prodId] ||
                                DEFAULT_PRODUCT_DECORATIONS[prodId] ||
                                [])
                                .map(dId => DECORATION_OPTIONS.find(o => o.id === dId)?.name || dId)
                                .join(' + ')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-black text-pink-700 shrink-0 ml-2">
                      ${recipe.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </CandyCard>
        ) : (
          <CandyCard variant="cream" className="px-3.5 py-2 text-xs font-bold text-stone-500 border-2 border-pink-200">
            Esperando próximo cliente...
          </CandyCard>
        )}

        {/* Tarjeta B: En tus Manos (Mismo sistema visual y proporción) */}
        <CandyCard
          variant="cream"
          className="pointer-events-auto min-w-[260px] max-w-sm w-full p-3.5 border-2 border-pink-200/90 shadow-md"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-pink-600" />
              En tus Manos
            </span>
            {tray.type !== 'empty' && (
              <button
                onClick={onClearTray}
                className="flex items-center gap-1 text-[10px] font-black text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-full transition-colors border border-rose-200 active:scale-95"
              >
                <Trash2 className="w-3 h-3" />
                <span>Vaciar</span>
              </button>
            )}
          </div>
          <div className="min-h-[40px] flex items-center">
            {renderTrayContent()}
          </div>
        </CandyCard>
      </div>

      {/* ================================================================ */}
      {/* MODAL DE RECETAS (CandyModal)                                     */}
      {/* ================================================================ */}
      {showRecipesModal && (
        <CandyModal
          isOpen={showRecipesModal}
          onClose={() => setShowRecipesModal(false)}
          title="Libro de Recetas"
          subtitle="Consulta los ingredientes y tiempos de horneado"
          icon={<BookOpen className="w-6 h-6 text-pink-600" />}
          maxWidth="lg"
          footer={
            <CandyButton
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setShowRecipesModal(false)}
            >
              Entendido
            </CandyButton>
          }
        >
          <div className="space-y-2.5">
            {availableProducts.map(prodId => {
              const rec = RECIPES[prodId];
              return (
                <CandyCard
                  key={`rec-${prodId}`}
                  variant="cream"
                  className="p-3 flex items-center justify-between border-2 border-pink-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm bg-pink-100 text-pink-700 border border-pink-200">
                      {rec.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#451a03]">{rec.name}</div>
                      <div className="text-[11px] font-bold text-pink-700 mt-0.5">
                        {rec.ingredients.map(i => INGREDIENTS[i].name).join(' + ')}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        Horno: {rec.bakeTimeSeconds}s {rec.requiresDecoration ? '· Requiere Decoración' : ''}
                      </div>
                    </div>
                  </div>
                  <CandyBadge variant="warning" size="sm">
                    ${rec.price}
                  </CandyBadge>
                </CandyCard>
              );
            })}
          </div>
        </CandyModal>
      )}
    </div>
  );
};
