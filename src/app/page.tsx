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

// 2D UI Components
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

// Dynamically import Three.js 3D Scene with SSR disabled
const BakeryScene = dynamic(
  () => import('@/components/3d/BakeryScene').then(mod => mod.BakeryScene),
  { ssr: false }
);

type ScreenState = 'home' | 'cutscene' | 'playing' | 'summary' | 'win';

export default function GamePage() {
  // --- Global Progress & Settings ---
  const [progress, setProgress] = useState<GameProgress>(loadGameProgress);
  const [screen, setScreen] = useState<ScreenState>('home');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showCredits, setShowCredits] = useState<boolean>(false);
  const [showShop, setShowShop] = useState<boolean>(false);
  const [isMixerActive, setIsMixerActive] = useState<boolean>(false);
  const [decoratingRecipe, setDecoratingRecipe] = useState<ProductId | null>(null);

  // --- Active Level State ---
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const currentLevelDef: LevelDefinition =
    LEVELS.find(l => l.levelNumber === currentLevelNumber) || LEVELS[0];

  const [money, setMoney] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [maxLives, setMaxLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(150);
  const [ordersDeliveredCount, setOrdersDeliveredCount] = useState<number>(0);

  // 3D / Player State
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [focusedObject, setFocusedObject] = useState<string | null>(null);

  // Cooking state
  const [tray, setTray] = useState<TrayState>({ type: 'empty' });
  const [ovenState, setOvenState] = useState<OvenState>({
    isCooking: false,
    recipeId: null,
    progress: 0,
    burnProgress: 0,
    isReady: false,
    isBurnt: false,
  });

  // Customers state
  const [currentOrder, setCurrentOrder] = useState<CustomerOrder | null>(null);
  const [customersRemaining, setCustomersRemaining] = useState<number>(3);

  // Tutorial tip index for Level 1
  const [tutorialStepIdx, setTutorialStepIdx] = useState<number>(0);

  // End of level result
  const [summaryResult, setSummaryResult] = useState<{
    isVictory: boolean;
    stars: number;
  }>({ isVictory: false, stars: 0 });

  // Toast notifications & in-HUD mixing progress
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

  // Update progress helper
  const updateProgress = useCallback((newProg: Partial<GameProgress>) => {
    setProgress(prev => {
      const updated = { ...prev, ...newProg };
      saveGameProgress(updated);
      return updated;
    });
  }, []);

  // Audio mute toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  // Generate a customer
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

      // Determine order size
      const orderCount =
        levelDef.allowMultiOrders && (chosenType === 'special' || Math.random() > 0.5)
          ? chosenType === 'special'
            ? Math.floor(Math.random() * 2) + 2 // 2 or 3 items
            : 2
          : 1;

      for (let i = 0; i < orderCount; i++) {
        const p = available[Math.floor(Math.random() * available.length)];
        items.push(p);
      }

      const basePrice = items.reduce((acc, p) => acc + RECIPES[p].price, 0);
      const bonusMultiplier = chosenType === 'frequent' ? 1.2 : chosenType === 'special' ? 1.5 : 1.0;
      const totalPrice = Math.round(basePrice * bonusMultiplier);

      const basePatience =
        chosenType === 'impatient' ? 26 : chosenType === 'special' ? 45 : 35;

      const order: CustomerOrder = {
        id: `cust-${Date.now()}`,
        customerType: chosenType,
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
        items,
        deliveredItems: [],
        totalPrice,
        maxPatienceSeconds: basePatience,
        currentPatienceSeconds: basePatience,
        createdAt: Date.now(),
      };

      setCurrentOrder(order);
      sounds.playCustomerBell();
    },
    []
  );

  // --- Start Level ---
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
      setTutorialStepIdx(0);

      spawnCustomer(def);
      setScreen('playing');
      sounds.startBGM();

      // Request pointer lock after DOM paints
      setTimeout(() => {
        const canvas = document.querySelector('canvas');
        canvas?.requestPointerLock?.();
      }, 200);
    },
    [progress.upgrades, spawnCustomer]
  );

  // --- Handle Play button from Home ---
  const handleHomePlay = () => {
    if (!progress.introSeen) {
      setScreen('cutscene');
    } else {
      startLevel(progress.unlockedLevel);
    }
  };

  const handleCutsceneComplete = () => {
    updateProgress({ introSeen: true });
    startLevel(1);
  };

  // --- Game Loop (Timer, Patience, Oven) ---
  useEffect(() => {
    if (screen !== 'playing') return;

    const interval = setInterval(() => {
      // 1. Level Countdown
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time expired!
          handleEndLevel(false);
          return 0;
        }
        return prev - 1;
      });

      // 2. Customer Patience Countdown
      setCurrentOrder(prevOrder => {
        if (!prevOrder) return null;
        const nextPatience = prevOrder.currentPatienceSeconds - 1;
        if (nextPatience <= 0) {
          // Customer abandoned!
          sounds.playError();
          setScore(s => Math.max(0, s - 100));
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) {
              handleEndLevel(false);
            }
            return nextL;
          });

          // Next customer
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

      // 3. Oven Baking Progress
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
          // Food is ready, now burning timer ticks!
          const burnIncrement = 0.15; // ~7 seconds to take it out before it burns
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

  // --- End of Level Evaluation ---
  const handleEndLevel = (isVictory: boolean) => {
    sounds.stopBGM();
    document.exitPointerLock?.();

    if (isVictory) {
      // Calculate Stars (1 to 3)
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

  // --- Interaction Router (Triggered by 'E' or Left Click) ---
  const handleInteract = () => {
    if (!focusedObject) return;

    // 1. Ingredients shelf
    if (
      ['flour', 'egg', 'milk', 'chocolate', 'sugar', 'strawberry'].includes(
        focusedObject
      )
    ) {
      const ingId = focusedObject as IngredientId;
      const ing = INGREDIENTS[ingId];
      sounds.playPickup();

      if (tray.type === 'empty') {
        setTray({ type: 'ingredients', items: [ingId] });
        showToast(`+1 ${ing.name} ${ing.emoji} en bandeja (1/5)`, 'info');
      } else if (tray.type === 'ingredients') {
        if (tray.items.length < 5) {
          const updated = [...tray.items, ingId];
          setTray({ type: 'ingredients', items: updated });

          // Check if it already matches an active recipe
          const matched = Object.values(RECIPES).find(r => {
            if (!currentLevelDef.availableProducts.includes(r.id)) return false;
            if (r.ingredients.length !== updated.length) return false;
            const s1 = [...r.ingredients].sort();
            const s2 = [...updated].sort();
            return s1.every((v, i) => v === s2[i]);
          });

          if (matched) {
            showToast(`✅ ¡Ingredientes listos para ${matched.name}! Ve a la batidora 🥣`, 'success');
          } else {
            showToast(`+1 ${ing.name} ${ing.emoji} (${updated.length}/5 en bandeja)`, 'info');
          }
        } else {
          showToast('⚠️ Bandeja llena (máximo 5 ingredientes)', 'warning');
        }
      } else {
        showToast('⚠️ Ya tienes un postre en la bandeja. Termínalo o vacíalo en el tacho 🗑️', 'warning');
      }
      return;
    }

    // 2. Mixer Station
    if (focusedObject === 'mixer') {
      if (mixingProgress !== null) return; // already in progress

      if (tray.type === 'empty') {
        const targetProd = currentOrder?.items[0] || currentLevelDef.availableProducts[0];
        const rec = RECIPES[targetProd];
        sounds.playError();
        const ingList = rec.ingredients.map(i => `${INGREDIENTS[i].name} ${INGREDIENTS[i].emoji}`).join(' + ');
        showToast(`🥣 Bandeja vacía. Para ${rec.name} toma: ${ingList}`, 'warning');
        return;
      }

      if (tray.type === 'mixed_dough') {
        showToast('🔥 ¡Esta masa ya está batida! Llévala al horno pastelero.', 'info');
        return;
      }

      if (tray.type === 'baked' || tray.type === 'finished') {
        showToast('📦 Este postre ya está horneado. Llévalo a decorar o al mostrador.', 'info');
        return;
      }

      if (tray.type === 'burnt') {
        showToast('🗑️ Postre quemado. Tíralo a la basura.', 'warning');
        return;
      }

      if (tray.type === 'ingredients') {
        // Find if ingredients match any available recipe
        const matchingRecipe = Object.values(RECIPES).find(r => {
          if (!currentLevelDef.availableProducts.includes(r.id)) return false;
          if (r.ingredients.length !== tray.items.length) return false;
          const sortedRecipe = [...r.ingredients].sort();
          const sortedTray = [...tray.items].sort();
          return sortedRecipe.every((val, idx) => val === sortedTray[idx]);
        });

        if (matchingRecipe) {
          // START SMOOTH MIXING ANIMATION
          setIsMixerActive(true);
          setMixingProgress(0);
          sounds.playMixSound();
          showToast(`🥣 Batiendo masa para ${matchingRecipe.name}...`, 'info');

          let progressValue = 0;
          const mixInterval = setInterval(() => {
            progressValue += 16;
            if (progressValue >= 100) {
              clearInterval(mixInterval);
              setMixingProgress(null);
              setIsMixerActive(false);
              sounds.playMixSuccess();
              setTray({ type: 'mixed_dough', recipeId: matchingRecipe.id });
              showToast(`✨ ¡Masa de ${matchingRecipe.name} lista! Llévala al horno [E en 🔥]`, 'success');
            } else {
              setMixingProgress(progressValue);
            }
          }, 140);
        } else {
          sounds.playError();
          // Find closest target recipe to tell user what they are missing
          const targetProd = currentOrder?.items.find(p => currentLevelDef.availableProducts.includes(p)) || currentLevelDef.availableProducts[0];
          const rec = RECIPES[targetProd];
          const missing = rec.ingredients.filter(i => !tray.items.includes(i));
          if (missing.length > 0) {
            const missingNames = missing.map(i => `${INGREDIENTS[i].name} ${INGREDIENTS[i].emoji}`).join(', ');
            showToast(`🥣 Para ${rec.name} te falta: ${missingNames} (o vacía en 🗑️)`, 'warning');
          } else {
            showToast(`⚠️ Combinación inválida (${tray.items.map(i => INGREDIENTS[i].name).join(' + ')}). Vacía en 🗑️`, 'warning');
          }
        }
      }
      return;
    }

    // 3. Oven Station
    if (focusedObject === 'oven') {
      // Put in raw dough
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
        showToast(`🔥 Horneando ${rec.name}... ¡Sácalo cuando suene la campana!`, 'info');
        return;
      }

      // Take out cooked or burnt product
      if (ovenState.isCooking && (ovenState.isReady || ovenState.isBurnt)) {
        sounds.playPickup();
        if (ovenState.isBurnt) {
          setTray({ type: 'burnt', recipeId: ovenState.recipeId! });
          showToast('⚠️ ¡El producto se quemó! Tíralo a la basura 🗑️', 'warning');
        } else {
          const rec = RECIPES[ovenState.recipeId!];
          if (rec.requiresDecoration) {
            setTray({ type: 'baked', recipeId: ovenState.recipeId! });
            showToast(`✨ ¡${rec.name} horneado! Llévalo a la mesa de decoración [E en 🎨]`, 'info');
          } else {
            setTray({ type: 'finished', recipeId: ovenState.recipeId! });
            showToast(`✨ ¡${rec.name} horneado y listo para entregar al cliente! [E en 🎁]`, 'success');
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
        showToast('⏳ Aún se está cocinando... Espera al ding de listo', 'info');
        return;
      }

      if (tray.type !== 'mixed_dough' && !ovenState.isCooking) {
        showToast('🔥 El horno está libre. Trae una masa batida para hornear.', 'info');
        return;
      }
      return;
    }

    // 4. Decoration Station
    if (focusedObject === 'decorating') {
      if (tray.type === 'baked') {
        const rec = RECIPES[tray.recipeId];
        if (rec.requiresDecoration) {
          sounds.playPickup();
          setTray({ type: 'finished', recipeId: tray.recipeId });
          showToast(`🎨 ¡${rec.name} decorado con ${rec.decorationName}! ¡Listo para entregar! 🎁`, 'success');
        } else {
          showToast(`✨ ${rec.name} no requiere decoración. ¡Entrégalo al cliente!`, 'info');
        }
      } else if (tray.type === 'finished') {
        showToast('✨ Ya está decorado. Llévalo al mostrador para entregarlo al cliente [E].', 'info');
      } else {
        showToast('🎨 Trae un postre horneado que requiera decoración (cupcake, donut, tarta, torta).', 'info');
      }
      return;
    }

    // 5. Service Counter (Deliver to Customer)
    if (focusedObject === 'counter') {
      if (tray.type === 'finished' || tray.type === 'baked') {
        const deliveredId = tray.recipeId;

        if (currentOrder && currentOrder.items.includes(deliveredId)) {
          // Correct item!
          sounds.playSuccessDelivery();
          const recipe = RECIPES[deliveredId];

          const isFast =
            currentOrder.currentPatienceSeconds / currentOrder.maxPatienceSeconds > 0.6;
          const isDecorated = tray.type === 'finished';
          const bonusDecor = isDecorated ? 50 : 0;
          const pointsEarned = 100 + (isFast ? 50 : 0) + bonusDecor;
          const revenueEarned = recipe.price;

          setMoney(m => m + revenueEarned);
          setScore(s => s + pointsEarned);
          setOrdersDeliveredCount(c => c + 1);
          setTray({ type: 'empty' });

          if (isDecorated || !recipe.requiresDecoration) {
            showToast(`🎉 ¡${recipe.name} entregado con éxito! +$${revenueEarned} (+${pointsEarned} pts)`, 'success');
          } else {
            showToast(`🎉 ¡${recipe.name} entregado! +$${revenueEarned} (Tip: decóralo en 🎨 para +50 pts)`, 'success');
          }

          const remainingItems = [...currentOrder.items];
          const idx = remainingItems.indexOf(deliveredId);
          if (idx > -1) remainingItems.splice(idx, 1);

          if (remainingItems.length === 0) {
            // Whole order complete!
            setCustomersRemaining(rem => {
              const nextRem = rem - 1;
              if (nextRem <= 0) {
                // All customers served! Check victory
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
            setCurrentOrder({
              ...currentOrder,
              items: remainingItems,
              deliveredItems: [...currentOrder.deliveredItems, deliveredId],
            });
          }
        } else {
          // Wrong item!
          sounds.playError();
          const wantedNames = currentOrder?.items.map(p => RECIPES[p].name).join(' o ') || 'nada';
          showToast(`❌ El cliente pidió ${wantedNames}, no ${RECIPES[deliveredId].name}. (Usa 🗑️ para vaciar)`, 'warning');
          setScore(s => Math.max(0, s - 50));
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) handleEndLevel(false);
            return nextL;
          });
        }
      } else if (tray.type === 'ingredients') {
        showToast('🥣 Tienes ingredientes crudos en la bandeja. Llévalos a la batidora 🥣', 'info');
      } else if (tray.type === 'mixed_dough') {
        showToast('🔥 Tienes masa cruda en la bandeja. Llévala al horno 🔥', 'info');
      } else {
        showToast('🛎️ Mostrador de clientes. Trae el postre horneado para entregarlo.', 'info');
      }
      return;
    }

    // 6. Trash Can
    if (focusedObject === 'trash') {
      if (tray.type !== 'empty') {
        sounds.playPickup();
        setTray({ type: 'empty' });
        showToast('🗑️ Bandeja vaciada.', 'info');
      } else {
        showToast('🗑️ La bandeja ya está vacía.', 'info');
      }
    }
  };

  // Upgrades shop purchase
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

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-black">
      {/* 1. HOME SCREEN */}
      {screen === 'home' && (
        <StartScreen
          progress={progress}
          onPlay={handleHomePlay}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenCredits={() => setShowCredits(true)}
          onOpenShop={() => setShowShop(true)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      )}

      {/* 2. INTRO CUTSCENE */}
      {screen === 'cutscene' && (
        <IntroCutscene onComplete={handleCutsceneComplete} />
      )}

      {/* 3. PLAYING IN 3D SCENE */}
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
            tutorialTip={
              currentLevelDef.tutorialSteps &&
              currentLevelDef.tutorialSteps[tutorialStepIdx]
            }
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onPause={() => {
              document.exitPointerLock?.();
              setIsLocked(false);
            }}
            toast={toast}
            mixingProgress={mixingProgress}
            availableProducts={currentLevelDef.availableProducts}
          />

          {/* Decoration Station Overlay */}
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

      {/* 4. LEVEL SUMMARY MODAL */}
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

      {/* 5. GAME WIN / GRAND OPENING MODAL */}
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

      {/* GLOBAL MODALS */}
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
