export type IngredientId = 'flour' | 'egg' | 'milk' | 'chocolate' | 'sugar' | 'strawberry';

export interface Ingredient {
  id: IngredientId;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export const INGREDIENTS: Record<IngredientId, Ingredient> = {
  flour: { id: 'flour', name: 'Harina', emoji: '🌾', color: '#fef3c7', description: 'Base para todas las masas' },
  egg: { id: 'egg', name: 'Huevo', emoji: '🥚', color: '#fde047', description: 'Da consistencia y esponjosidad' },
  milk: { id: 'milk', name: 'Leche', emoji: '🥛', color: '#e0f2fe', description: 'Otorga suavidad y textura' },
  sugar: { id: 'sugar', name: 'Azúcar', emoji: '🍬', color: '#fbcfe8', description: 'Dulzura pura para el postre' },
  chocolate: { id: 'chocolate', name: 'Chocolate', emoji: '🍫', color: '#78350f', description: 'Cacao intenso y delicioso' },
  strawberry: { id: 'strawberry', name: 'Frutilla', emoji: '🍓', color: '#f43f5e', description: 'Frutilla fresca del huerto' },
};

export type ProductId = 'cookie' | 'cupcake' | 'donut' | 'tart' | 'cake' | 'pastry';

export interface Recipe {
  id: ProductId;
  name: string;
  price: number;
  emoji: string;
  ingredients: IngredientId[];
  requiresBaking: boolean;
  bakeTimeSeconds: number; // base bake duration
  requiresDecoration: boolean;
  decorationName?: string;
  decorationColor?: string;
}

export const RECIPES: Record<ProductId, Recipe> = {
  cookie: {
    id: 'cookie',
    name: 'Galletita',
    price: 300,
    emoji: '🍪',
    ingredients: ['flour', 'sugar', 'egg'],
    requiresBaking: true,
    bakeTimeSeconds: 5,
    requiresDecoration: false,
  },
  cupcake: {
    id: 'cupcake',
    name: 'Cupcake de Chocolate',
    price: 500,
    emoji: '🧁',
    ingredients: ['flour', 'sugar', 'chocolate'],
    requiresBaking: true,
    bakeTimeSeconds: 6,
    requiresDecoration: true,
    decorationName: 'Glaseado y Chispas',
    decorationColor: '#ec4899',
  },
  donut: {
    id: 'donut',
    name: 'Donut Glaseada',
    price: 400,
    emoji: '🍩',
    ingredients: ['flour', 'milk', 'sugar'],
    requiresBaking: true,
    bakeTimeSeconds: 5,
    requiresDecoration: true,
    decorationName: 'Glaseado Rosa Pastel',
    decorationColor: '#f472b6',
  },
  tart: {
    id: 'tart',
    name: 'Tarta de Frutilla',
    price: 700,
    emoji: '🥧',
    ingredients: ['flour', 'egg', 'strawberry'],
    requiresBaking: true,
    bakeTimeSeconds: 7,
    requiresDecoration: true,
    decorationName: 'Frutillas y Crema',
    decorationColor: '#fb7185',
  },
  cake: {
    id: 'cake',
    name: 'Torta de Cumpleaños',
    price: 1500,
    emoji: '🎂',
    ingredients: ['flour', 'egg', 'milk', 'chocolate', 'sugar'],
    requiresBaking: true,
    bakeTimeSeconds: 9,
    requiresDecoration: true,
    decorationName: 'Decoración de Fiesta',
    decorationColor: '#a855f7',
  },
  pastry: {
    id: 'pastry',
    name: 'Factura Artesanal',
    price: 350,
    emoji: '🥐',
    ingredients: ['flour', 'milk', 'egg'],
    requiresBaking: true,
    bakeTimeSeconds: 5,
    requiresDecoration: false,
  },
};

export type TrayState = 
  | { type: 'empty' }
  | { type: 'ingredients'; items: IngredientId[] }
  | { type: 'mixed_dough'; recipeId: ProductId }
  | { type: 'baked'; recipeId: ProductId }
  | { type: 'finished'; recipeId: ProductId }
  | { type: 'burnt'; recipeId: ProductId };

export type CustomerType = 'normal' | 'impatient' | 'frequent' | 'special';

export interface CustomerOrder {
  id: string;
  customerType: CustomerType;
  customerName: string;
  avatarColor: string;
  items: ProductId[];
  deliveredItems: ProductId[];
  totalPrice: number;
  maxPatienceSeconds: number;
  currentPatienceSeconds: number;
  createdAt: number;
}

export interface LevelDefinition {
  levelNumber: number;
  title: string;
  subtitle: string;
  storyIntro: string;
  targetMoney: number;
  customerCount: number;
  timeLimitSeconds: number;
  availableProducts: ProductId[];
  customerTypes: CustomerType[];
  allowMultiOrders: boolean;
  tutorialSteps?: string[];
}

export interface PlayerUpgrades {
  fasterOven: number;       // level 0..3 (+20% speed per level)
  fasterWalkSpeed: number;  // level 0..3 (+15% speed per level)
  extraLives: number;       // level 0..2 (+1 life per level)
  extraTime: number;        // level 0..3 (+15s per level)
  trayCapacity: number;     // level 0..1 (allows carrying 2 items)
}

export interface GameProgress {
  unlockedLevel: number;
  highScore: number;
  totalCoins: number;
  starsPerLevel: Record<number, number>; // levelNumber -> stars (1..3)
  upgrades: PlayerUpgrades;
  introSeen: boolean;
  tutorialSeen?: boolean;
}

export type InteractableType = 
  | 'flour'
  | 'egg'
  | 'milk'
  | 'chocolate'
  | 'sugar'
  | 'strawberry'
  | 'mixer'
  | 'oven'
  | 'decorating'
  | 'counter'
  | 'trash';

export interface OvenState {
  isCooking: boolean;
  recipeId: ProductId | null;
  progress: number; // 0 to 1 (0 to 1 = cooking, 1 = ready)
  burnProgress: number; // 0 to 1 (0 = ready, 1 = burnt)
  isReady: boolean;
  isBurnt: boolean;
}
