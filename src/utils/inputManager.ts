/**
 * Sistema centralizado de gestión de teclado y reseteo de input para Azúcar Rush.
 * Evita teclas "fantasma", bloqueos al cambiar de foco (Alt+Tab, blur, modales)
 * y garantiza que el movimiento siempre refleje el estado real del teclado.
 */

type ResetCallback = () => void;

class InputManager {
  private pressedKeys = new Set<string>();
  private resetCallbacks = new Set<ResetCallback>();
  private initialized = false;

  constructor() {
    this.init();
  }

  public init() {
    if (typeof window === 'undefined' || this.initialized) return;
    this.initialized = true;

    // Rastrear eventos keydown y keyup a nivel global
    window.addEventListener('keydown', this.handleKeyDown, { passive: true });
    window.addEventListener('keyup', this.handleKeyUp, { passive: true });

    // Cuando la ventana pierde el foco (Alt+Tab, click afuera, etc.)
    window.addEventListener('blur', this.handleWindowBlur);

    // Cuando cambia la visibilidad del documento (cambio de pestaña)
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Cuando el navegador libera el pointer lock
    document.addEventListener('pointerlockchange', this.handlePointerLockChange);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.pressedKeys.add(e.code);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.pressedKeys.delete(e.code);
  };

  private handleWindowBlur = () => {
    this.resetInput();
  };

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.resetInput();
    }
  };

  private handlePointerLockChange = () => {
    if (!document.pointerLockElement) {
      this.resetInput();
    }
  };

  /**
   * Resetea completamente el mapa de teclas y notifica a los suscriptores.
   */
  public resetInput = () => {
    this.pressedKeys.clear();
    this.resetCallbacks.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Error in input reset callback:', err);
      }
    });
  };

  /**
   * Comprueba si una tecla está actualmente presionada.
   */
  public isKeyPressed = (code: string): boolean => {
    return this.pressedKeys.has(code);
  };

  /**
   * Obtiene el estado real actual de las teclas de movimiento.
   */
  public getMovementState = () => {
    return {
      forward: this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp'),
      backward: this.isKeyPressed('KeyS') || this.isKeyPressed('ArrowDown'),
      left: this.isKeyPressed('KeyA') || this.isKeyPressed('ArrowLeft'),
      right: this.isKeyPressed('KeyD') || this.isKeyPressed('ArrowRight'),
    };
  };

  /**
   * Suscribe un callback para ser notificado cada vez que se resetea el input.
   * Devuelve una función para desuscribirse.
   */
  public onReset = (callback: ResetCallback): (() => void) => {
    this.resetCallbacks.add(callback);
    return () => {
      this.resetCallbacks.delete(callback);
    };
  };
}

export const inputManager = new InputManager();

export const resetInput = () => inputManager.resetInput();
export const isKeyPressed = (code: string) => inputManager.isKeyPressed(code);
export const getRealMovementState = () => inputManager.getMovementState();
export const onInputReset = (callback: ResetCallback) => inputManager.onReset(callback);
