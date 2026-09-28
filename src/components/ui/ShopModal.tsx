'use client';

import React from 'react';
import { PlayerUpgrades } from '@/types/game';
import { X, Flame, Zap, Heart, Clock, Layers, Sparkles, DollarSign } from 'lucide-react';
import { sounds } from '@/utils/audio';

interface ShopModalProps {
  totalCoins: number;
  upgrades: PlayerUpgrades;
  onBuyUpgrade: (upgradeKey: keyof PlayerUpgrades, cost: number) => void;
  onClose: () => void;
}

interface UpgradeItem {
  key: keyof PlayerUpgrades;
  title: string;
  description: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  icon: React.ReactNode;
}

const UPGRADE_ITEMS: UpgradeItem[] = [
  {
    key: 'fasterOven',
    title: 'Horno Turbo',
    description: 'Cocina las masas un 25% más rápido por nivel de mejora.',
    maxLevel: 3,
    baseCost: 800,
    costMultiplier: 1.5,
    icon: <Flame className="w-5 h-5 text-orange-500" />,
  },
  {
    key: 'fasterWalkSpeed',
    title: 'Zapatillas Veloces',
    description: 'Aumenta tu velocidad de caminata en la cocina un +15% por nivel.',
    maxLevel: 3,
    baseCost: 600,
    costMultiplier: 1.4,
    icon: <Zap className="w-5 h-5 text-amber-500" />,
  },
  {
    key: 'extraLives',
    title: 'Corazón Extra',
    description: 'Empieza cada día con vidas adicionales para resistir más errores.',
    maxLevel: 2,
    baseCost: 1200,
    costMultiplier: 2.0,
    icon: <Heart className="w-5 h-5 text-rose-500" />,
  },
  {
    key: 'extraTime',
    title: 'Reloj de Cocina',
    description: 'Añade +20 segundos extra al reloj de cada nivel.',
    maxLevel: 3,
    baseCost: 700,
    costMultiplier: 1.5,
    icon: <Clock className="w-5 h-5 text-blue-500" />,
  },
  {
    key: 'trayCapacity',
    title: 'Bandeja Mágica',
    description: 'Optimiza el espacio de trabajo para manipular ingredientes a mayor velocidad.',
    maxLevel: 1,
    baseCost: 1500,
    costMultiplier: 1.0,
    icon: <Layers className="w-5 h-5 text-purple-500" />,
  },
];

export const ShopModal: React.FC<ShopModalProps> = ({
  totalCoins,
  upgrades,
  onBuyUpgrade,
  onClose,
}) => {
  const getUpgradeCost = (item: UpgradeItem, currentLevel: number): number => {
    return Math.round(item.baseCost * Math.pow(item.costMultiplier, currentLevel));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 select-none">
      <div className="relative flex flex-col max-w-2xl w-full max-h-[90vh] rounded-3xl border-4 border-pink-300 bg-white/98 p-6 md:p-8 shadow-2xl overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Coins Balance */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <h2 className="text-2xl md:text-3xl font-black text-bakery-choco">
                Tienda de Mejoras
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Invierte las ganancias de tu pastelería en equipamiento profesional.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-100/90 border-2 border-amber-300 px-4 py-2 rounded-2xl shadow-sm">
            <DollarSign className="w-5 h-5 text-amber-600" />
            <span className="text-lg font-black text-amber-950">${totalCoins.toLocaleString()}</span>
          </div>
        </div>

        {/* Upgrades List */}
        <div className="space-y-3 mb-6">
          {UPGRADE_ITEMS.map(item => {
            const currentLevel = upgrades[item.key] || 0;
            const isMax = currentLevel >= item.maxLevel;
            const cost = getUpgradeCost(item, currentLevel);
            const canAfford = totalCoins >= cost && !isMax;

            return (
              <div
                key={item.key}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border-2 border-pink-100 bg-pink-50/40 hover:bg-pink-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-pink-100">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800 text-sm">{item.title}</span>
                      {/* Level Badges */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: item.maxLevel }).map((_, idx) => (
                          <div
                            key={`lvl-${idx}`}
                            className={`w-2.5 h-2.5 rounded-full ${
                              idx < currentLevel ? 'bg-pink-500' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center sm:self-center gap-2 ml-auto">
                  {isMax ? (
                    <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-4 py-2 rounded-xl">
                      Nivel Máximo ✓
                    </span>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        sounds.playPickup();
                        onBuyUpgrade(item.key, cost);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black shadow-md transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:brightness-105 active:scale-95'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Mejorar</span>
                      <span>(${cost.toLocaleString()})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-black text-sm bg-slate-900 text-white shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
        >
          Volver al Menú
        </button>
      </div>
    </div>
  );
};
