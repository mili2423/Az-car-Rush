import { LevelDefinition, ProductId } from '@/types/game';

/**
 * ============================================================================
 * CONFIGURACIÓN DE NIVELES (DÍAS DE TRABAJO) DE AZÚCAR RUSH
 * ============================================================================
 * Cada nivel representa un día de trabajo en la pastelería.
 * - timeLimitSeconds: Tiempo total del reloj del nivel.
 * - targetMoney: Meta de dinero requerida para ganar el nivel.
 * - customerCount: Cantidad total de clientes que visitarán el local ese día.
 * - availableProducts: Productos y recetas desbloqueadas en ese nivel.
 * - newProductsThisDay: Productos recién desbloqueados (pesan doble ese día y el siguiente).
 * - allowMultiOrders: Si los clientes pueden pedir 2 o más recetas en un solo pedido.
 * - burnSpeed: Multiplicador de qué tan rápido se quema el horno (1 = normal, >1 = más rápido).
 * - patienceMultiplier: Multiplicador de paciencia base del cliente (<1 = menos paciencia).
 * - difficultyLabel: Etiqueta de dificultad para el HUD.
 *
 * PROGRESIÓN DE DESBLOQUEOS (para modificar aquí):
 *   Día 1-2: cookie (Galletita) + cupcake (Cupcake de Chocolate) + donut (Donut Glaseada)
 *   Día 3-4: + pastry (Factura Artesanal)
 *   Día 5:   + tart (Tarta de Frutilla) + cake (Torta de Cumpleaños)
 */
export const LEVELS: LevelDefinition[] = [
  {
    levelNumber: 1,
    title: 'Primer Día',
    subtitle: 'Abre la vieja pastelería y aprende las recetas básicas',
    storyIntro: 'Bienvenido a tu primer día! Los vecinos del pueblo se han enterado de la reapertura. Prepara galletitas, cupcakes y donuts para complacerlos.',
    targetMoney: 2000,
    customerCount: 3,
    timeLimitSeconds: 220,
    availableProducts: ['cookie', 'cupcake', 'donut'],
    newProductsThisDay: ['cookie', 'cupcake', 'donut'],
    customerTypes: ['normal', 'frequent'],
    allowMultiOrders: false,
    burnSpeed: 0.8,
    patienceMultiplier: 1.4,
    difficultyLabel: 'Fácil',
    tutorialSteps: [
      'Mira el pedido del cliente en la esquina inferior izquierda.',
      'Ve a la mesa de ingredientes y toma con [E] los necesarios.',
      'Camina a la Batidora Rosa y mantén [E] para mezclar la masa.',
      'Lleva la masa al Horno con [E]. Vigila el reloj y sácalo antes de que se queme.',
      'Si requiere decoración, ve a la mesa de glaseado con [E].',
      'Acércate al mostrador y entrega el pedido con [E]!'
    ]
  },
  {
    levelNumber: 2,
    title: 'Más Clientes',
    subtitle: 'El aroma a vainilla atrae a más comensales',
    storyIntro: 'El aroma de tus primeros dulces atrajo miradas! Los clientes vuelven con más ganas. Prepárate para atender pedidos múltiples.',
    targetMoney: 4500,
    customerCount: 5,
    timeLimitSeconds: 260,
    availableProducts: ['cookie', 'cupcake', 'donut'],
    newProductsThisDay: [],
    customerTypes: ['normal', 'frequent', 'impatient'],
    allowMultiOrders: true,
    burnSpeed: 1.1,
    patienceMultiplier: 1.1,
    difficultyLabel: 'Normal',
  },
  {
    levelNumber: 3,
    title: 'Hora Pico',
    subtitle: 'El pueblo hace cola frente al mostrador',
    storyIntro: 'La hora del té es una locura! Se suma la Factura Artesanal al menú. Los clientes tienen menos paciencia.',
    targetMoney: 7000,
    customerCount: 8,
    timeLimitSeconds: 300,
    availableProducts: ['cookie', 'cupcake', 'donut', 'pastry'],
    newProductsThisDay: ['pastry'],
    customerTypes: ['normal', 'impatient', 'frequent'],
    allowMultiOrders: true,
    burnSpeed: 1.5,
    patienceMultiplier: 0.85,
    difficultyLabel: 'Difícil',
  },
  {
    levelNumber: 4,
    title: 'Gran Pedido',
    subtitle: 'Fiestas y eventos especiales del pueblo',
    storyIntro: 'El alcalde y las familias del pueblo encargan pedidos gigantes para sus celebraciones. La Factura Artesanal es furor!',
    targetMoney: 10000,
    customerCount: 9,
    timeLimitSeconds: 340,
    availableProducts: ['cookie', 'cupcake', 'donut', 'pastry'],
    newProductsThisDay: [],
    customerTypes: ['normal', 'frequent', 'special'],
    allowMultiOrders: true,
    burnSpeed: 1.9,
    patienceMultiplier: 0.70,
    difficultyLabel: 'Muy Difícil',
  },
  {
    levelNumber: 5,
    title: 'Gran Apertura',
    subtitle: 'La consagración definitiva de Azúcar Rush!',
    storyIntro: 'El gran día ha llegado! Llegan la Tarta de Frutilla y la Torta de Cumpleaños. Todo el pueblo asiste a la Gran Apertura oficial.',
    targetMoney: 14000,
    customerCount: 12,
    timeLimitSeconds: 380,
    availableProducts: ['cookie', 'cupcake', 'donut', 'pastry', 'tart', 'cake'],
    newProductsThisDay: ['tart', 'cake'],
    customerTypes: ['normal', 'impatient', 'frequent', 'special'],
    allowMultiOrders: true,
    burnSpeed: 2.4,
    patienceMultiplier: 0.55,
    difficultyLabel: 'Experto',
  }
];

/**
 * Mapa de qué productos se desbloquean en cada día.
 * Usado para mostrar avisos preventivos y candados en el popup de Recetas.
 */
export const PRODUCTS_UNLOCKED_ON_DAY: Record<number, ProductId[]> = {
  1: ['cookie', 'cupcake', 'donut'],
  3: ['pastry'],
  5: ['tart', 'cake'],
};
