import { LevelDefinition } from '@/types/game';

/**
 * ============================================================================
 * CONFIGURACIÓN DE NIVELES (DÍAS DE TRABAJO) DE AZÚCAR RUSH
 * ============================================================================
 * Cada nivel representa un día de trabajo en la pastelería.
 * - timeLimitSeconds: Tiempo total del reloj del nivel.
 * - targetMoney: Meta de dinero requerida para ganar el nivel.
 * - customerCount: Cantidad total de clientes que visitarán el local ese día.
 * - availableProducts: Productos y recetas desbloqueadas en ese nivel.
 * - allowMultiOrders: Si los clientes pueden pedir 2 o más recetas en un solo pedido.
 * - burnSpeed: Multiplicador de qué tan rápido se quema el horno (1 = normal, >1 = más rápido).
 * - patienceMultiplier: Multiplicador de paciencia base del cliente (<1 = menos paciencia).
 * - difficultyLabel: Etiqueta de dificultad para el HUD.
 */
export const LEVELS: LevelDefinition[] = [
  {
    levelNumber: 1,
    title: 'Primer Día',
    subtitle: 'Abre la vieja pastelería y aprende las recetas básicas',
    storyIntro: '¡Bienvenido a tu primer día! Los vecinos del pueblo se han enterado de la reapertura. Prepara galletitas, cupcakes y donuts para complacerlos.',
    targetMoney: 2000,
    customerCount: 3,
    timeLimitSeconds: 220, // Tiempo generoso para el primer día
    availableProducts: ['cookie', 'cupcake', 'donut'],
    customerTypes: ['normal', 'frequent'],
    allowMultiOrders: false,
    burnSpeed: 0.8,           // Horno quema lento (dificultad baja)
    patienceMultiplier: 1.4,  // Clientes muy pacientes
    difficultyLabel: 'Fácil',
    tutorialSteps: [
      'Mira el pedido del cliente en la esquina inferior izquierda.',
      'Ve a la mesa de ingredientes y toma con [E] los necesarios.',
      'Camina a la Batidora Rosa y mantén [E] para mezclar la masa.',
      'Lleva la masa al Horno con [E]. Vigila el reloj y sácalo antes de que se queme.',
      'Si requiere decoración, ve a la mesa de glaseado con [E].',
      '¡Acércate al mostrador y entrega el pedido con [E]!'
    ]
  },
  {
    levelNumber: 2,
    title: 'Más Clientes',
    subtitle: 'El aroma a vainilla atrae a más comensales',
    storyIntro: '¡El aroma de tus primeros dulces atrajo miradas! Se suma la deliciosa Tarta de Frutilla al menú. Prepárate para atender pedidos de múltiples delicias.',
    targetMoney: 4500,
    customerCount: 5,
    timeLimitSeconds: 260,
    availableProducts: ['cookie', 'cupcake', 'donut', 'tart'],
    customerTypes: ['normal', 'frequent', 'impatient'],
    allowMultiOrders: true,
    burnSpeed: 1.1,           // El horno quema un poco más rápido
    patienceMultiplier: 1.1,  // Clientes ligeramente menos pacientes
    difficultyLabel: 'Normal',
  },
  {
    levelNumber: 3,
    title: 'Hora Pico',
    subtitle: 'El pueblo hace cola frente al mostrador',
    storyIntro: '¡La hora del té es una locura! Los clientes tienen menos paciencia y esperan su pedido calientito. Administra tus idas y vueltas al horno con sabiduría.',
    targetMoney: 7000,
    customerCount: 8,
    timeLimitSeconds: 300,
    availableProducts: ['cookie', 'cupcake', 'donut', 'tart', 'pastry'],
    customerTypes: ['normal', 'impatient', 'frequent'],
    allowMultiOrders: true,
    burnSpeed: 1.5,           // El horno se pone caliente — quema más rápido
    patienceMultiplier: 0.85, // Clientes notablemente menos pacientes
    difficultyLabel: 'Difícil',
  },
  {
    levelNumber: 4,
    title: 'Gran Pedido',
    subtitle: 'Fiestas y eventos especiales del pueblo',
    storyIntro: 'El alcalde y las familias del pueblo encargan pedidos gigantes para sus celebraciones. Llega la magnífica Torta de Cumpleaños.',
    targetMoney: 10000,
    customerCount: 9,
    timeLimitSeconds: 340,
    availableProducts: ['cookie', 'cupcake', 'donut', 'tart', 'pastry', 'cake'],
    customerTypes: ['normal', 'frequent', 'special'],
    allowMultiOrders: true,
    burnSpeed: 1.9,           // Horno muy caliente — hay que estar pendiente
    patienceMultiplier: 0.70, // Clientes impacientes — poco margen de error
    difficultyLabel: 'Muy Difícil',
  },
  {
    levelNumber: 5,
    title: 'Gran Apertura',
    subtitle: '¡La consagración definitiva de Azúcar Rush!',
    storyIntro: '¡El gran día ha llegado! La pastelería luce impecable y todo el pueblo asiste a la Gran Apertura oficial. ¡Alcanza la meta y conviértete en una leyenda pastelera!',
    targetMoney: 14000,
    customerCount: 12,
    timeLimitSeconds: 380,
    availableProducts: ['cookie', 'cupcake', 'donut', 'tart', 'pastry', 'cake'],
    customerTypes: ['normal', 'impatient', 'frequent', 'special'],
    allowMultiOrders: true,
    burnSpeed: 2.4,           // El horno a máxima temperatura — un descuido y se quema
    patienceMultiplier: 0.55, // Clientes muy exigentes — necesitas ser muy rápido
    difficultyLabel: 'Experto',
  }
];
