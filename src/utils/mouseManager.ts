/**
 * Sistema centralizado de control de puntero (Pointer Lock) y cursor.
 * ÚNICA fuente de verdad autorizada para solicitar o liberar el bloqueo del mouse.
 */

export const MAIN_CANVAS_ID = 'azucar-rush-main-canvas';

/**
 * Solicita el bloqueo del mouse de forma segura sobre el canvas principal del juego.
 * Solo debe ser llamado ante un gesto explícito del usuario (clicks en botones de continuar, etc.)
 */
export function requestGamePointerLock(targetCanvas?: HTMLCanvasElement | null): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  const canvas =
    targetCanvas ||
    (document.getElementById(MAIN_CANVAS_ID) as HTMLCanvasElement | null) ||
    (document.querySelector('canvas') as HTMLCanvasElement | null);
  if (!canvas) return false;

  try {
    const res = canvas.requestPointerLock() as unknown;
    if (res && typeof (res as Promise<void>).catch === 'function') {
      (res as Promise<void>).catch((err: unknown) => {
        // Rechazo normal del navegador si no hubo gesto directo de usuario
        console.warn('Pointer lock request rejected or deferred by browser:', err);
      });
    }
    return true;
  } catch (err) {
    console.warn('Pointer lock request error:', err);
    return false;
  }
}

/**
 * Libera inmediatamente el bloqueo del mouse devolviendo el cursor normal.
 */
export function releaseGamePointerLock(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  try {
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }
  } catch (err) {
    console.warn('Exit pointer lock error:', err);
  }
}

/**
 * Comprueba si el mouse se encuentra actualmente bloqueado.
 */
export function isPointerLocked(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  return document.pointerLockElement !== null;
}
