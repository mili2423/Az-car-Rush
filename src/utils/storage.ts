import { GameProgress, PlayerUpgrades } from '@/types/game';

const STORAGE_KEY = 'azucar_rush_save_data_v1';

const DEFAULT_UPGRADES: PlayerUpgrades = {
  fasterOven: 0,
  fasterWalkSpeed: 0,
  extraLives: 0,
  extraTime: 0,
  trayCapacity: 0,
};

const DEFAULT_PROGRESS: GameProgress = {
  unlockedLevel: 1,
  highScore: 0,
  totalCoins: 0,
  starsPerLevel: {},
  upgrades: DEFAULT_UPGRADES,
  introSeen: false,
};

export const loadGameProgress = (): GameProgress => {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      upgrades: { ...DEFAULT_UPGRADES, ...(parsed.upgrades || {}) },
      starsPerLevel: parsed.starsPerLevel || {},
    };
  } catch (err) {
    console.error('Failed to load progress from localStorage', err);
    return DEFAULT_PROGRESS;
  }
};

export const saveGameProgress = (progress: GameProgress): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
};

export const resetGameProgress = (): GameProgress => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_PROGRESS;
};
