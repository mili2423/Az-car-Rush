'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  CustomerOrder,
  CustomerType,
  GameProgress,
  INGREDIENTS,
  IngredientId,
  LevelDefinition,
  OvenState,
  PlayerUpgrades,
  ProductId,
  RECIPES,
  TrayState,
} from '@/types/game';
import { LEVELS } from '@/utils/levels';
import { loadGameProgress, saveGameProgress } from '@/utils/storage';
import { sounds } from '@/utils/audio';

// ============================================================================
// COMPONENTES DE INTERFAZ 2D (HUD, Modales, Pantallas y Menús)
// ============================================================================
import { Crosshair } from '@/components/ui/Crosshair';
import { HUD } from '@/components/ui/HUD';
import { StartScreen } from '@/components/ui/StartScreen';
import { IntroCutscene } from '@/components/ui/IntroCutscene';
import { HowToPlayModal } from '@/components/ui/HowToPlayModal';
import { CreditsModal } from '@/components/ui/CreditsModal';
import { ShopModal } from '@/components/ui/ShopModal';
import { MixerMinigame } from '@/components/ui/MixerMinigame';
import { DecorationMenu } from '@/components/ui/DecorationMenu';
import { LevelSummaryModal } from '@/components/ui/LevelSummaryModal';
import { GameWinModal } from '@/components/ui/GameWinModal';
import { MiniTutorialModal } from '@/components/ui/MiniTutorialModal';

// ============================================================================
// ESCENA 3D (Three.js / React Three Fiber con SSR desactivado)
// ============================================================================
const BakeryScene = dynamic(
  () => import('@/components/3d/BakeryScene').then(mod => mod.BakeryScene),
  { ssr: false }
);

type ScreenState = 'home' | 'cutscene' | 'playing' | 'summary' | 'win';

export default function GamePage() {
  // --------------------------------------------------------------------------
  // 1. ESTADO GLOBAL DE PROGRESO Y AJUSTES
  // --------------------------------------------------------------------------
  const [progress, setProgress] = useState<GameProgress>(loadGameProgress);
  const [screen, setScreen] = useState<ScreenState>('home');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Estados para abrir/cerrar modales
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showCredits, setShowCredits] = useState<boolean>(false);
  const [showShop, setShowShop] = useState<boolean>(false);
  const [isMixerActive, setIsMixerActive] = useState<boolean>(false);
  const [decoratingRecipe, setDecoratingRecipe] = useState<ProductId | null>(null);

  // --------------------------------------------------------------------------
  // 2. ESTADO DEL NIVEL ACTIVO (DÍA EN CURSO)
  // --------------------------------------------------------------------------
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const currentLevelDef: LevelDefinition =
    LEVELS.find(l => l.levelNumber === currentLevelNumber) || LEVELS[0];

  const [money, setMoney] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [maxLives, setMaxLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(200);
  const [ordersDeliveredCount, setOrdersDeliveredCount] = useState<number>(0);

  // --------------------------------------------------------------------------
  // 3. ESTADO DEL JUGADOR Y CONTROL 3D (PRIMERA PERSONA)
  // --------------------------------------------------------------------------
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [focusedObject, setFocusedObject] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // 4. ESTADO DE COCINA: BANDEJA Y HORNO
  // --------------------------------------------------------------------------
  const [tray, setTray] = useState<TrayState>({ type: 'empty' });
  const [ovenState, setOvenState] = useState<OvenState>({
    isCooking: false,
    recipeId: null,
    progress: 0,
    burnProgress: 0,
    isReady: false,
    isBurnt: false,
  });

  // --------------------------------------------------------------------------
  // 5. ESTADO DE CLIENTES Y PEDIDOS
  // --------------------------------------------------------------------------
  const [currentOrder, setCurrentOrder] = useState<CustomerOrder | null>(null);
  const [customersRemaining, setCustomersRemaining] = useState<number>(3);

  const [summaryResult, setSummaryResult] = useState<{
    isVictory: boolean;
    stars: number;
  }>({ isVictory: false, stars: 0 });

  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warning' } | null>(null);
  const [mixingProgress, setMixingProgress] = useState<number | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3800);
  }, []);

  const updateProgress = useCallback((newProg: Partial<GameProgress>) => {
    setProgress(prev => {
      const updated = { ...prev, ...newProg };
      saveGameProgress(updated);
      return updated;
    });
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  // --------------------------------------------------------------------------
  // 6. GENERACIÓN DE CLIENTES Y CÁLCULO DE TIEMPO / PACIENCIA
  // --------------------------------------------------------------------------
  const spawnCustomer = useCallback(
    (levelDef: LevelDefinition) => {
      const customerNames = [
        'Sofía', 'Martín', 'Camila', 'Mateo', 'Valentina',
        'Lucas', 'Emma', 'Santiago', 'Lucía', 'Joaquín'
      ];
      const avatarColors = [
        '#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6',
        '#10b981', '#f59e0b', '#06b6d4', '#6366f1'
      ];

      const chosenType: CustomerType =
        levelDef.customerTypes[Math.floor(Math.random() * levelDef.customerTypes.length)];

      const available = levelDef.availableProducts;
      const items: ProductId[] = [];

      const orderCount =
        levelDef.allowMultiOrders && (chosenType === 'special' || Math.random() > 0.5)
          ? chosenType === 'special'
            ? Math.floor(Math.random() * 2) + 2
            : 2
          : 1;

      for (let i = 0; i < orderCount; i++) {
        const p = available[Math.floor(Math.random() * available.length)];
        items.push(p);
      }

      const basePrice = items.reduce((acc, p) => acc + RECIPES[p].price, 0);
      const bonusMultiplier = chosenType === 'frequent' ? 1.2 : chosenType === 'special' ? 1.5 : 1.0;
      const totalPrice = Math.round(basePrice * bonusMultiplier);

      const patiencePerRecipe =
        chosenType === 'impatient' ? 50 : chosenType === 'special' ? 75 : 60;
      const totalPatience = patiencePerRecipe * orderCount + 20;

      const order: CustomerOrder = {
        id: `cust-${Date.now()}`,
        customerType: chosenType,
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
        items,
        deliveredItems: [],
        totalPrice,
        maxPatienceSeconds: totalPatience,
        currentPatienceSeconds: totalPatience,
        createdAt: Date.now(),
      };

      setCurrentOrder(order);
      sounds.playCustomerBell();
    },
    []
  );

  // --------------------------------------------------------------------------
  // 7. INICIAR NIVEL
  // --------------------------------------------------------------------------
  const startLevel = useCallback(
    (lvlNum: number) => {
      const def = LEVELS.find(l => l.levelNumber === lvlNum) || LEVELS[0];
      setCurrentLevelNumber(lvlNum);

      const calculatedLives = 3 + (progress.upgrades.extraLives || 0);
      const calculatedTime = def.timeLimitSeconds + (progress.upgrades.extraTime || 0) * 20;

      setMoney(0);
      setScore(0);
      setLives(calculatedLives);
      setMaxLives(calculatedLives);
      setTimeLeft(calculatedTime);
      setOrdersDeliveredCount(0);
      setTray({ type: 'empty' });
      setOvenState({
        isCooking: false,
        recipeId: null,
        progress: 0,
        burnProgress: 0,
        isReady: false,
        isBurnt: false,
      });
      setCustomersRemaining(def.customerCount);

      spawnCustomer(def);
      setScreen('playing');
      sounds.startBGM();

      setTimeout(() => {
        const canvas = document.querySelector('canvas');
        canvas?.requestPointerLock?.();
      }, 200);
    },
    [progress.upgrades, spawnCustomer]
  );

  // --------------------------------------------------------------------------
  // 8. GUÍA DINÁMICA DEL TUTORIAL (SOLO DÍA 1 - SIN EMOJIS)
  // --------------------------------------------------------------------------
  const getDynamicTutorialTip = useCallback((): string | undefined => {
    if (currentLevelNumber !== 1) return undefined;
    if (!currentOrder) return 'Esperando al próximo cliente...';
    if (tray.type === 'empty') {
      const target = currentOrder.items[0];
      const rec = RECIPES[target];
      if (!rec) return '1. Toma los ingredientes del pedido con [E] en la estantería';
      const ings = rec.ingredients.map(i => INGREDIENTS[i].name).join(', ');
      return `1. Toma los ingredientes para ${rec.name} (${ings}) con [E] en la estantería`;
    }
    if (tray.type === 'ingredients') {
      return '2. Ve a la Batidora Rosa y presiona [E] para batir la masa';
    }
    if (tray.type === 'mixed_dough') {
      return '3. Lleva la masa al Horno y presiona [E] para hornear';
    }
    if (ovenState.isCooking) {
      if (ovenState.isReady) {
        return '4. ¡El postre está listo! Presiona [E] en el horno antes de que se queme';
      }
      return '4. Espera a que suene la campana en el horno...';
    }
    if (tray.type === 'baked') {
      const rec = RECIPES[tray.recipeId];
      if (rec?.requiresDecoration) {
        return '5. Ve a la mesa de decoración y presiona [E] para decorarlo';
      }
      return '6. Ve al mostrador frente al cliente y presiona [E] para entregar';
    }
    if (tray.type === 'finished') {
      return '6. Ve al mostrador frente al cliente y presiona [E] para entregar el pedido';
    }
    if (tray.type === 'burnt') {
      return 'El postre se quemó. Ve al tacho de basura y presiona [E] para vaciarlo';
    }
    return currentLevelDef.tutorialSteps?.[0];
  }, [currentLevelNumber, currentOrder, tray, ovenState, currentLevelDef]);

  // --------------------------------------------------------------------------
  // 9. FLUJO DE INICIO Y TUTORIAL (A PARTIR DEL DÍA 2 NO SE MUESTRA)
  // --------------------------------------------------------------------------
  const handleHomePlay = () => {
    // Si el jugador ya desbloqueó el Día 2 o superior, jamás mostrar el tutorial automáticamente
    if (progress.unlockedLevel > 1) {
      startLevel(progress.unlockedLevel);
      return;
    }

    // Para el Día 1:
    if (!progress.introSeen) {
      setScreen('cutscene');
    } else if (!progress.tutorialSeen) {
      setShowTutorial(true);
    } else {
      startLevel(1);
    }
  };

  const handleCutsceneComplete = () => {
    updateProgress({ introSeen: true });
    // Solo mostrar el tutorial si estamos en el Día 1
    if (!progress.tutorialSeen && progress.unlockedLevel <= 1) {
      setShowTutorial(true);
    } else {
      startLevel(progress.unlockedLevel || 1);
    }
  };

  const handleTutorialComplete = () => {
    updateProgress({ tutorialSeen: true });
    setShowTutorial(false);
    if (screen !== 'playing') {
      startLevel(progress.unlockedLevel || 1);
    }
  };

  // --------------------------------------------------------------------------
  // 10. BUCLE PRINCIPAL DEL JUEGO (RELOJ, PACIENCIA DE CLIENTES Y HORNO)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (screen !== 'playing') return;

    const interval = setInterval(() => {
      // A. Cuenta regresiva del nivel
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleEndLevel(false);
          return 0;
        }
        return prev - 1;
      });

      // B. Paciencia del cliente
      setCurrentOrder(prevOrder => {
        if (!prevOrder) return null;
        const nextPatience = prevOrder.currentPatienceSeconds - 1;
        if (nextPatience <= 0) {
          sounds.playError();
          setScore(s => Math.max(0, s - 100));
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) {
              handleEndLevel(false);
            }
            return nextL;
          });

          setCustomersRemaining(c => {
            const rem = c - 1;
            if (rem <= 0) {
              handleEndLevel(money >= currentLevelDef.targetMoney);
              return 0;
            }
            setTimeout(() => spawnCustomer(currentLevelDef), 1000);
            return rem;
          });
          return null;
        }
        return { ...prevOrder, currentPatienceSeconds: nextPatience };
      });

      // C. Progreso del horno
      setOvenState(prevOven => {
        if (!prevOven.isCooking || !prevOven.recipeId) return prevOven;

        const recipe = RECIPES[prevOven.recipeId];
        const ovenSpeedFactor = 1 + (progress.upgrades.fasterOven || 0) * 0.25;
        const progressIncrement = 1 / (recipe.bakeTimeSeconds / ovenSpeedFactor);

        if (!prevOven.isReady) {
          const nextProg = prevOven.progress + progressIncrement;
          if (nextProg >= 1.0) {
            sounds.playOvenDing();
            return { ...prevOven, progress: 1.0, isReady: true };
          }
          return { ...prevOven, progress: nextProg };
        } else {
          const burnIncrement = 0.15;
          const nextBurn = prevOven.burnProgress + burnIncrement;
          if (nextBurn >= 1.0 && !prevOven.isBurnt) {
            sounds.playBurnAlert();
            setLives(l => {
              const nextL = l - 1;
              if (nextL <= 0) handleEndLevel(false);
              return nextL;
            });
            return { ...prevOven, burnProgress: 1.0, isBurnt: true };
          }
          return { ...prevOven, burnProgress: nextBurn };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, currentLevelDef, money, progress.upgrades, spawnCustomer]);

  // --------------------------------------------------------------------------
  // 11. EVALUACIÓN DE FIN DE NIVEL
  // --------------------------------------------------------------------------
  const handleEndLevel = (isVictory: boolean) => {
    sounds.stopBGM();
    document.exitPointerLock?.();

    if (isVictory) {
      let stars = 1;
      if (money >= currentLevelDef.targetMoney * 1.25 || lives >= 2) stars = 2;
      if (money >= currentLevelDef.targetMoney * 1.4 && lives >= 3) stars = 3;

      const nextUnlocked = Math.max(
        progress.unlockedLevel,
        currentLevelNumber < 5 ? currentLevelNumber + 1 : 5
      );

      const prevStars = progress.starsPerLevel[currentLevelNumber] || 0;
      const updatedStars = {
        ...progress.starsPerLevel,
        [currentLevelNumber]: Math.max(prevStars, stars),
      };

      updateProgress({
        unlockedLevel: nextUnlocked,
        totalCoins: progress.totalCoins + money,
        highScore: Math.max(progress.highScore, score),
        starsPerLevel: updatedStars,
      });

      setSummaryResult({ isVictory: true, stars });

      if (currentLevelNumber === 5) {
        setScreen('win');
      } else {
        setScreen('summary');
      }
    } else {
      setSummaryResult({ isVictory: false, stars: 0 });
      setScreen('summary');
    }
  };

  // --------------------------------------------------------------------------
  // 12. ENRUTADOR DE INTERACCIÓN (SIN EMOJIS EN MENSAJES)
  // --------------------------------------------------------------------------
  const handleInteract = () => {
    if (!focusedObject) return;

    // A. Estantería de Ingredientes
    if (['flour', 'egg', 'milk', 'chocolate', 'sugar', 'strawberry'].includes(focusedObject)) {
      const ingId = focusedObject as IngredientId;
      const ing = INGREDIENTS[ingId];
      sounds.playPickup();

      if (tray.type === 'empty') {
        setTray({ type: 'ingredients', items: [ingId] });
        showToast(`+1 ${ing.name} en bandeja (1/5)`, 'info');
      } else if (tray.type === 'ingredients') {
        if (tray.items.length < 5) {
          const updated = [...tray.items, ingId];
          setTray({ type: 'ingredients', items: updated });

          const matched = Object.values(RECIPES).find(r => {
            if (!currentLevelDef.availableProducts.includes(r.id)) return false;
            if (r.ingredients.length !== updated.length) return false;
            const s1 = [...r.ingredients].sort();
            const s2 = [...updated].sort();
            return s1.every((v, i) => v === s2[i]);
          });

          if (matched) {
            showToast(`Ingredientes listos para ${matched.name}. Ve a la batidora`, 'success');
          } else {
            showToast(`+1 ${ing.name} (${updated.length}/5 en bandeja)`, 'info');
          }
        } else {
          showToast('Bandeja llena (máximo 5 ingredientes)', 'warning');
        }
      } else {
        showToast('Ya tienes un postre en la bandeja. Termínalo o vacíalo en el tacho', 'warning');
      }
      return;
    }

    // B. Estación de Batido
    if (focusedObject === 'mixer') {
      if (mixingProgress !== null) return;

      if (tray.type === 'empty') {
        const targetProd = currentOrder?.items[0] || currentLevelDef.availableProducts[0];
        const rec = RECIPES[targetProd];
        sounds.playError();
        const ingList = rec.ingredients.map(i => INGREDIENTS[i].name).join(' + ');
        showToast(`Bandeja vacía. Para ${rec.name} toma: ${ingList}`, 'warning');
        return;
      }

      if (tray.type === 'mixed_dough') {
        showToast('Esta masa ya está batida. Llévala al horno pastelero.', 'info');
        return;
      }

      if (tray.type === 'baked' || tray.type === 'finished') {
        showToast('Este postre ya está horneado. Llévalo a decorar o al mostrador.', 'info');
        return;
      }

      if (tray.type === 'burnt') {
        showToast('Postre quemado. Tíralo a la basura.', 'warning');
        return;
      }

      if (tray.type === 'ingredients') {
        const matchingRecipe = Object.values(RECIPES).find(r => {
          if (!currentLevelDef.availableProducts.includes(r.id)) return false;
          if (r.ingredients.length !== tray.items.length) return false;
          const sortedRecipe = [...r.ingredients].sort();
          const sortedTray = [...tray.items].sort();
          return sortedRecipe.every((val, idx) => val === sortedTray[idx]);
        });

        if (matchingRecipe) {
          setIsMixerActive(true);
          setMixingProgress(0);
          sounds.playMixSound();
          showToast(`Batiendo masa para ${matchingRecipe.name}...`, 'info');

          let progressValue = 0;
          const mixInterval = setInterval(() => {
            progressValue += 16;
            if (progressValue >= 100) {
              clearInterval(mixInterval);
              setMixingProgress(null);
              setIsMixerActive(false);
              sounds.playMixSuccess();
              setTray({ type: 'mixed_dough', recipeId: matchingRecipe.id });
              showToast(`Masa de ${matchingRecipe.name} lista. Llévala al horno [E]`, 'success');
            } else {
              setMixingProgress(progressValue);
            }
          }, 140);
        } else {
          sounds.playError();
          const targetProd = currentOrder?.items.find(p => currentLevelDef.availableProducts.includes(p)) || currentLevelDef.availableProducts[0];
          const rec = RECIPES[targetProd];
          const missing = rec.ingredients.filter(i => !tray.items.includes(i));
          if (missing.length > 0) {
            const missingNames = missing.map(i => INGREDIENTS[i].name).join(', ');
            showToast(`Para ${rec.name} te falta: ${missingNames}`, 'warning');
          } else {
            showToast(`Combinación inválida (${tray.items.map(i => INGREDIENTS[i].name).join(' + ')}). Vacía en el tacho`, 'warning');
          }
        }
      }
      return;
    }

    // C. Horno
    if (focusedObject === 'oven') {
      if (tray.type === 'mixed_dough' && !ovenState.isCooking) {
        const rec = RECIPES[tray.recipeId];
        sounds.playPickup();
        setOvenState({
          isCooking: true,
          recipeId: tray.recipeId,
          progress: 0,
          burnProgress: 0,
          isReady: false,
          isBurnt: false,
        });
        setTray({ type: 'empty' });
        showToast(`Horneando ${rec.name}... Sácalo cuando suene la campana`, 'info');
        return;
      }

      if (ovenState.isCooking && (ovenState.isReady || ovenState.isBurnt)) {
        sounds.playPickup();
        if (ovenState.isBurnt) {
          setTray({ type: 'burnt', recipeId: ovenState.recipeId! });
          showToast('El producto se quemó. Tíralo a la basura', 'warning');
        } else {
          const rec = RECIPES[ovenState.recipeId!];
          if (rec.requiresDecoration) {
            setTray({ type: 'baked', recipeId: ovenState.recipeId! });
            showToast(`${rec.name} horneado. Llévalo a la mesa de decoración [E]`, 'info');
          } else {
            setTray({ type: 'finished', recipeId: ovenState.recipeId! });
            showToast(`${rec.name} horneado y listo para entregar al cliente [E]`, 'success');
          }
        }
        setOvenState({
          isCooking: false,
          recipeId: null,
          progress: 0,
          burnProgress: 0,
          isReady: false,
          isBurnt: false,
        });
        return;
      }

      if (ovenState.isCooking && !ovenState.isReady) {
        showToast('Aún se está cocinando... Espera a que esté listo', 'info');
        return;
      }

      if (tray.type !== 'mixed_dough' && !ovenState.isCooking) {
        showToast('El horno está libre. Trae una masa batida para hornear.', 'info');
        return;
      }
      return;
    }

    // D. Mesa de Decoración
    if (focusedObject === 'decorating') {
      if (tray.type === 'baked') {
        const rec = RECIPES[tray.recipeId];
        if (rec.requiresDecoration) {
          sounds.playPickup();
          setTray({ type: 'finished', recipeId: tray.recipeId });
          showToast(`${rec.name} decorado con ${rec.decorationName}. ¡Listo para entregar!`, 'success');
        } else {
          showToast(`${rec.name} no requiere decoración. ¡Entrégalo al cliente!`, 'info');
        }
      } else if (tray.type === 'finished') {
        showToast('Ya está decorado. Llévalo al mostrador para entregarlo al cliente [E].', 'info');
      } else {
        showToast('Trae un postre horneado que requiera decoración (cupcake, donut, tarta, torta).', 'info');
      }
      return;
    }

    // E. Mostrador de Entrega
    if (focusedObject === 'counter') {
      if (tray.type === 'finished' || tray.type === 'baked') {
        const deliveredId = tray.recipeId;

        if (currentOrder && currentOrder.items.includes(deliveredId)) {
          sounds.playSuccessDelivery();
          const recipe = RECIPES[deliveredId];

          const isFast = currentOrder.currentPatienceSeconds / currentOrder.maxPatienceSeconds > 0.6;
          const isDecorated = tray.type === 'finished';
          const bonusDecor = isDecorated ? 50 : 0;
          const pointsEarned = 100 + (isFast ? 50 : 0) + bonusDecor;
          const revenueEarned = recipe.price;

          setMoney(m => m + revenueEarned);
          setScore(s => s + pointsEarned);
          setOrdersDeliveredCount(c => c + 1);
          setTray({ type: 'empty' });

          if (isDecorated || !recipe.requiresDecoration) {
            showToast(`${recipe.name} entregado con éxito. +$${revenueEarned} (+${pointsEarned} pts)`, 'success');
          } else {
            showToast(`${recipe.name} entregado. +$${revenueEarned} (Tip: decóralo para +50 pts)`, 'success');
          }

          const remainingItems = [...currentOrder.items];
          const idx = remainingItems.indexOf(deliveredId);
          if (idx > -1) remainingItems.splice(idx, 1);

          if (remainingItems.length === 0) {
            setCustomersRemaining(rem => {
              const nextRem = rem - 1;
              if (nextRem <= 0) {
                setTimeout(() => {
                  handleEndLevel(true);
                }, 800);
                return 0;
              } else {
                setTimeout(() => spawnCustomer(currentLevelDef), 800);
                return nextRem;
              }
            });
            setCurrentOrder(null);
          } else {
            const bonusPatience = 40;
            const updatedPatience = Math.min(
              currentOrder.maxPatienceSeconds,
              currentOrder.currentPatienceSeconds + bonusPatience
            );
            setCurrentOrder({
              ...currentOrder,
              items: remainingItems,
              deliveredItems: [...currentOrder.deliveredItems, deliveredId],
              currentPatienceSeconds: updatedPatience,
            });
          }
        } else {
          sounds.playError();
          const wantedNames = currentOrder?.items.map(p => RECIPES[p].name).join(' o ') || 'nada';
          showToast(`El cliente pidió ${wantedNames}, no ${RECIPES[deliveredId].name}. (Usa el tacho para vaciar)`, 'warning');
          setScore(s => Math.max(0, s - 50));
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) handleEndLevel(false);
            return nextL;
          });
        }
      } else if (tray.type === 'ingredients') {
        showToast('Tienes ingredientes crudos en la bandeja. Llévalos a la batidora', 'info');
      } else if (tray.type === 'mixed_dough') {
        showToast('Tienes masa cruda en la bandeja. Llévala al horno', 'info');
      } else {
        showToast('Mostrador de clientes. Trae el postre horneado para entregarlo.', 'info');
      }
      return;
    }

    // F. Tacho de Basura
    if (focusedObject === 'trash') {
      if (tray.type !== 'empty') {
        sounds.playPickup();
        setTray({ type: 'empty' });
        showToast('Bandeja vaciada.', 'info');
      } else {
        showToast('La bandeja ya está vacía.', 'info');
      }
    }
  };

  const handleBuyUpgrade = (upgradeKey: keyof PlayerUpgrades, cost: number) => {
    if (progress.totalCoins >= cost) {
      const nextUpgrades = {
        ...progress.upgrades,
        [upgradeKey]: (progress.upgrades[upgradeKey] || 0) + 1,
      };
      updateProgress({
        totalCoins: progress.totalCoins - cost,
        upgrades: nextUpgrades,
      });
    }
  };

  // --------------------------------------------------------------------------
  // 13. RENDERIZADO DE LA INTERFAZ
  // --------------------------------------------------------------------------
  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-black">
      {/* 1. MENÚ PRINCIPAL */}
      {screen === 'home' && (
        <StartScreen
          progress={progress}
          onPlay={handleHomePlay}
          onOpenTutorial={() => setShowTutorial(true)}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenCredits={() => setShowCredits(true)}
          onOpenShop={() => setShowShop(true)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      )}

      {/* 2. CINEMÁTICA DE INTRODUCCIÓN */}
      {screen === 'cutscene' && (
        <IntroCutscene onComplete={handleCutsceneComplete} />
      )}

      {/* 3. ESCENA DE JUEGO 3D */}
      {screen === 'playing' && (
        <div className="relative w-full h-full">
          <BakeryScene
            ovenState={ovenState}
            isMixerActive={isMixerActive}
            currentOrder={currentOrder}
            focusedObject={focusedObject}
            walkSpeedBonus={(progress.upgrades.fasterWalkSpeed || 0) * 0.15}
            tray={tray}
            onFocusChange={setFocusedObject}
            onInteract={handleInteract}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
          />

          <Crosshair
            focusedObject={focusedObject}
            tray={tray}
            ovenState={ovenState}
            currentOrder={currentOrder}
            isMixing={mixingProgress !== null}
          />

          <HUD
            levelNumber={currentLevelNumber}
            levelTitle={currentLevelDef.title}
            money={money}
            targetMoney={currentLevelDef.targetMoney}
            score={score}
            lives={lives}
            maxLives={maxLives}
            timeLeftSeconds={timeLeft}
            currentOrder={currentOrder}
            tray={tray}
            onClearTray={() => setTray({ type: 'empty' })}
            tutorialTip={getDynamicTutorialTip()}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onPause={() => {
              document.exitPointerLock?.();
              setIsLocked(false);
            }}
            toast={toast}
            mixingProgress={mixingProgress}
            availableProducts={currentLevelDef.availableProducts}
            onOpenTutorial={() => setShowTutorial(true)}
          />

          {decoratingRecipe && (
            <DecorationMenu
              recipeId={decoratingRecipe}
              onDecorate={() => {
                setTray({ type: 'finished', recipeId: decoratingRecipe });
                setDecoratingRecipe(null);
              }}
              onCancel={() => setDecoratingRecipe(null)}
            />
          )}
        </div>
      )}

      {/* 4. MODAL DE RESUMEN AL FINAL DEL NIVEL */}
      {screen === 'summary' && (
        <LevelSummaryModal
          levelNumber={currentLevelNumber}
          isVictory={summaryResult.isVictory}
          money={money}
          targetMoney={currentLevelDef.targetMoney}
          score={score}
          ordersDelivered={ordersDeliveredCount}
          stars={summaryResult.stars}
          onNextLevel={() => {
            if (currentLevelNumber < 5) {
              startLevel(currentLevelNumber + 1);
            } else {
              setScreen('home');
            }
          }}
          onRetry={() => startLevel(currentLevelNumber)}
          onOpenShop={() => setShowShop(true)}
        />
      )}

      {/* 5. MODAL DE VICTORIA FINAL */}
      {screen === 'win' && (
        <GameWinModal
          totalCoins={progress.totalCoins}
          totalStars={Object.values(progress.starsPerLevel).reduce(
            (acc, s) => acc + s,
            0
          )}
          onReturnHome={() => setScreen('home')}
        />
      )}

      {/* 6. MODALES GLOBALES */}
      {showTutorial && (
        <MiniTutorialModal
          onComplete={handleTutorialComplete}
          onClose={() => setShowTutorial(false)}
        />
      )}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
      {showCredits && <CreditsModal onClose={() => setShowCredits(false)} />}
      {showShop && (
        <ShopModal
          totalCoins={progress.totalCoins}
          upgrades={progress.upgrades}
          onBuyUpgrade={handleBuyUpgrade}
          onClose={() => setShowShop(false)}
        />
      )}
    </main>
  );
}
