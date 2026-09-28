/**
 * ============================================================================
 * DEFINICIONES DE TIPOS Y MODELOS DE DATOS: AZÚCAR RUSH
 * ============================================================================
 * Este archivo contiene todas las estructuras TypeScript de ingredientes,
 * recetas, estados de bandeja, clientes, mejoras de la tienda y niveles.
 */

// ----------------------------------------------------------------------------
// 1. INGREDIENTES
// ----------------------------------------------------------------------------
export type IngredientId = 'flour' | 'egg' | 'milk' | 'chocolate' | 'sugar' | 'strawberry';

export interface Ingredient {
  id: IngredientId;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

// Diccionario de ingredientes disponibles en la pastelería
export const INGREDIENTS: Record<IngredientId, Ingredient> = {
  flour: { id: 'flour', name: 'Harina', emoji: '🌾', color: '#fef3c7', description: 'Base para todas las masas' },
  egg: { id: 'egg', name: 'Huevo', emoji: '🥚', color: '#fde047', description: 'Da consistencia y esponjosidad' },
  milk: { id: 'milk', name: 'Leche', emoji: '🥛', color: '#e0f2fe', description: 'Otorga suavidad y textura' },
  sugar: { id: 'sugar', name: 'Azúcar', emoji: '🍬', color: '#fbcfe8', description: 'Dulzura pura para el postre' },
  chocolate: { id: 'chocolate', name: 'Chocolate', emoji: '🍫', color: '#78350f', description: 'Cacao intenso y delicioso' },
  strawberry: { id: 'strawberry', name: 'Frutilla', emoji: '🍓', color: '#f43f5e', description: 'Frutilla fresca del huerto' },
};

// ----------------------------------------------------------------------------
// 2. PRODUCTOS Y RECETAS
// ----------------------------------------------------------------------------
export type ProductId = 'cookie' | 'cupcake' | 'donut' | 'tart' | 'cake' | 'pastry';

export interface Recipe {
  id: ProductId;
  name: string;
  price: number;              // Precio de venta en $
  emoji: string;
  ingredients: IngredientId[]; // Lista exacta de ingredientes requeridos
  requiresBaking: boolean;    // Si necesita pasar por el horno
  bakeTimeSeconds: number;    // Segundos que tarda en hornearse
  requiresDecoration: boolean;// Si necesita pasar por la mesa de decoración
  decorationName?: string;    // Nombre del glaseado/topping
  decorationColor?: string;
}

// Libro oficial de recetas
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

// ----------------------------------------------------------------------------
// 3. ESTADOS DE LA BANDEJA (LO QUE SOSTIENE EL JUGADOR)
// ----------------------------------------------------------------------------
export type TrayState = 
  | { type: 'empty' }                                  // Bandeja vacía
  | { type: 'ingredients'; items: IngredientId[] }     // Ingredientes crudos recolectados
  | { type: 'mixed_dough'; recipeId: ProductId }       // Masa batida lista para el horno
  | { type: 'baked'; recipeId: ProductId }             // Postre horneado (puede requerir decoración)
  | { type: 'finished'; recipeId: ProductId }          // Postre terminado listo para entregar
  | { type: 'burnt'; recipeId: ProductId };            // Postre quemado (para tirar a la basura)

// ----------------------------------------------------------------------------
// 4. CLIENTES Y PEDIDOS
// ----------------------------------------------------------------------------
export type CustomerType = 'normal' | 'impatient' | 'frequent' | 'special';

export interface CustomerOrder {
  id: string;
  customerType: CustomerType;
  customerName: string;
  avatarColor: string;
  items: ProductId[];          // Lista de recetas solicitadas en el pedido
  deliveredItems: ProductId[]; // Lista de recetas ya entregadas
  totalPrice: number;          // Total a pagar al completar el pedido
  maxPatienceSeconds: number;  // Tiempo máximo de paciencia inicial
  currentPatienceSeconds: number; // Tiempo de paciencia restante
  createdAt: number;
}

// ----------------------------------------------------------------------------
// 5. DEFINICIÓN DE NIVELES
// ----------------------------------------------------------------------------
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
  burnSpeed?: number;           // Multiplicador de velocidad de quemado del horno (1 = normal, 2 = doble de rápido)
  patienceMultiplier?: number;  // Multiplicador de paciencia base del cliente (1 = normal, 0.5 = mitad de paciencia)
  difficultyLabel?: string;     // Etiqueta de dificultad mostrada en el HUD (ej: "Fácil", "Difícil")
  tutorialSteps?: string[];
}

// ----------------------------------------------------------------------------
// 6. MEJORAS DE LA TIENDA Y PROGRESO DEL JUGADOR
// ----------------------------------------------------------------------------
export interface PlayerUpgrades {
  fasterOven: number;       // Nivel 0..3 (+20% velocidad de horneado por nivel)
  fasterWalkSpeed: number;  // Nivel 0..3 (+15% velocidad de movimiento)
  extraLives: number;       // Nivel 0..2 (+1 vida/corazón por nivel)
  extraTime: number;        // Nivel 0..3 (+20s por nivel)
  trayCapacity: number;     // Capacidad de bandeja
}

export interface GameProgress {
  unlockedLevel: number;
  highScore: number;
  totalCoins: number;
  starsPerLevel: Record<number, number>; // levelNumber -> estrellas (1..3)
  upgrades: PlayerUpgrades;
  introSeen: boolean;
  tutorialSeen?: boolean;
}

// Objetos interactuables en la cocina 3D
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

// Estado interno del horno pastelero
export interface OvenState {
  isCooking: boolean;          // Si está activo cocinando
  recipeId: ProductId | null;  // Receta que se está cocinando
  progress: number;            // 0 a 1 (0 a 1 = cocinando, 1 = listo)
  burnProgress: number;        // 0 a 1 (0 = recién listo, 1 = quemado)
  isReady: boolean;            // Si ya terminó de hornearse
  isBurnt: boolean;            // Si se quemó
}
