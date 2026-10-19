'use client';

import React from 'react';
import { PlayerUpgrades } from '@/types/game';
import { Flame, Zap, Heart, Clock, Layers, Sparkles, DollarSign, Check } from 'lucide-react';
import { CandyModal, CandyButton, CandyCard, CandyBadge } from '@/components/ui/design-system';
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
    icon: <Clock className="w-5 h-5 text-sky-500" />,
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
    <CandyModal
      isOpen
      onClose={onClose}
      title="Tienda de Mejoras"
      subtitle="Invierte las ganancias de tu pastelería en equipamiento profesional."
      icon={<Sparkles className="w-6 h-6 text-pink-600" />}
      maxWidth="xl"
      footer={
        <CandyButton variant="neutral" size="md" fullWidth onClick={onClose}>
          Volver
        </CandyButton>
      }
    >
      <div className="space-y-4">
        {/* Balance de Monedas */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-900">
              Tus Ganancias Disponibles
            </span>
          </div>
          <div className="flex items-center gap-1 text-lg font-black text-amber-950">
            <DollarSign className="w-5 h-5 text-amber-600 shrink-0" />
            <span>${totalCoins.toLocaleString()}</span>
          </div>
        </div>

        {/* Lista de Mejoras */}
        <div className="space-y-2.5">
          {UPGRADE_ITEMS.map(item => {
            const currentLevel = upgrades[item.key] || 0;
            const isMax = currentLevel >= item.maxLevel;
            const cost = getUpgradeCost(item, currentLevel);
            const canAfford = totalCoins >= cost && !isMax;

            return (
              <CandyCard
                key={item.key}
                variant="cream"
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-pink-200/80"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-white shadow-2xs border border-pink-200 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-[#451a03] text-sm">{item.title}</span>
                      {/* Puntos de nivel */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: item.maxLevel }).map((_, idx) => (
                          <div
                            key={`lvl-${idx}`}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${
                              idx < currentLevel ? 'bg-pink-500 shadow-2xs' : 'bg-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 leading-snug">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center sm:self-center gap-2 ml-auto shrink-0">
                  {isMax ? (
                    <CandyBadge variant="success" size="md">
                      <Check className="w-3.5 h-3.5" />
                      <span>Máximo</span>
                    </CandyBadge>
                  ) : (
                    <CandyButton
                      variant={canAfford ? 'primary' : 'neutral'}
                      size="sm"
                      disabled={!canAfford}
                      onClick={() => {
                        sounds.playPickup();
                        onBuyUpgrade(item.key, cost);
                      }}
                    >
                      Mejorar (${cost.toLocaleString()})
                    </CandyButton>
                  )}
                </div>
              </CandyCard>
            );
          })}
        </div>
      </div>
    </CandyModal>
  );
};
