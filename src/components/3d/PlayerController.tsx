import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls as ThreePointerLockControls } from 'three-stdlib';
import { Vector3, Vector2, Raycaster, Object3D, Euler } from 'three';
import { sounds } from '@/utils/audio';
import { resetInput, getRealMovementState, onInputReset } from '@/utils/inputManager';

interface PlayerControllerProps {
  walkSpeedBonus: number;
  onFocusChange: (objectName: string | null) => void;
  onInteract: () => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  onMoveChange: (isMoving: boolean) => void;
  enabled?: boolean;
}

/** Resetea el estado interno de teclas de movimiento. */
function resetMoveState(ms: { forward: boolean; backward: boolean; left: boolean; right: boolean }) {
  ms.forward = false;
  ms.backward = false;
  ms.left = false;
  ms.right = false;
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  walkSpeedBonus,
  onFocusChange,
  onInteract,
  isLocked,
  setIsLocked,
  onMoveChange,
  enabled = true,
}) => {
  const { camera, scene, gl } = useThree();
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const raycaster = useRef(new Raycaster());
  const lastStepTime = useRef(0);
  const wasMovingRef = useRef(false);
  const justLockedTime = useRef(0);
  const controlsRef = useRef<ThreePointerLockControls | null>(null);

  // Cámara: almacenar transformación previa a entrar en minijuegos o pausas para restaurar sin saltos
  const savedCameraPos = useRef<Vector3 | null>(null);
  const savedCameraRot = useRef<Euler | null>(null);
  const isFirstMount = useRef(true);

  // Posición inicial de cámara (solo una vez en la carga inicial)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      camera.position.set(0, 1.7, 0); // Altura de ojos natural
      camera.lookAt(0, 1.7, -4); // Mirando al mesón de cocina
    }
  }, [camera]);

  // Suscripción al reseteo centralizado global de inputs (blur, visibilitychange, modales, etc.)
  useEffect(() => {
    const unsubscribe = onInputReset(() => {
      resetMoveState(moveState.current);
      if (wasMovingRef.current) {
        wasMovingRef.current = false;
        onMoveChange(false);
      }
    });
    return unsubscribe;
  }, [onMoveChange]);

  // Gestión del ciclo de vida de los controles y preservación de cámara
  useEffect(() => {
    if (!enabled) {
      // 1. Guardar posición y rotación actual de la cámara
      savedCameraPos.current = camera.position.clone();
      savedCameraRot.current = camera.rotation.clone();

      // 2. Resetear TODO el input de movimiento
      resetInput();
      resetMoveState(moveState.current);
      wasMovingRef.current = false;
      onMoveChange(false);

      // 3. Desconectar controles y liberar puntero
      if (controlsRef.current) {
        controlsRef.current.disconnect();
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      setIsLocked(false);
      return;
    }

    // Al reactivar los controles: restaurar cámara de forma limpia si teníamos posición guardada
    if (savedCameraPos.current) {
      camera.position.copy(savedCameraPos.current);
    }
    if (savedCameraRot.current) {
      camera.rotation.copy(savedCameraRot.current);
    }

    // Resetear inmediatamente cualquier tecla residual
    resetInput();
    resetMoveState(moveState.current);

    // Instanciar controles de puntero sobre el canvas principal
    const controls = new ThreePointerLockControls(camera, gl.domElement);
    controlsRef.current = controls;

    const onLock = () => {
      justLockedTime.current = performance.now();
      resetInput();
      resetMoveState(moveState.current);
      setIsLocked(true);
    };

    const onUnlock = () => {
      resetInput();
      resetMoveState(moveState.current);
      wasMovingRef.current = false;
      setIsLocked(false);
      onMoveChange(false);
    };

    controls.addEventListener('lock', onLock);
    controls.addEventListener('unlock', onUnlock);
    controls.connect(gl.domElement);

    return () => {
      controls.removeEventListener('lock', onLock);
      controls.removeEventListener('unlock', onUnlock);
      controls.disconnect();
      controls.dispose();
      controlsRef.current = null;
    };
  }, [enabled, camera, gl.domElement, setIsLocked, onMoveChange]);

  // Listeners de teclado y mouse para interacción activa
  useEffect(() => {
    if (!enabled) {
      resetInput();
      resetMoveState(moveState.current);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        if (isLocked) {
          onInteract();
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isLocked && enabled && e.button === 0) {
        if (performance.now() - justLockedTime.current > 150) {
          onInteract();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      resetInput();
      resetMoveState(moveState.current);
    };
  }, [enabled, isLocked, onInteract]);

  // Frame Loop de Movimiento & Raycasting
  useFrame((_, delta) => {
    if (!enabled || !isLocked) {
      if (wasMovingRef.current) {
        wasMovingRef.current = false;
        onMoveChange(false);
      }
      return;
    }

    // Consultar el estado REAL físico del teclado (garantiza cero teclas fantasma)
    const realMove = getRealMovementState();
    moveState.current = realMove;

    const baseSpeed = 4.8 * (1 + walkSpeedBonus);
    const speed = baseSpeed * Math.min(delta, 0.08);

    const dir = new Vector3();
    const camDir = new Vector3();
    const camSide = new Vector3();

    camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();

    camSide.crossVectors(camDir, new Vector3(0, 1, 0)).normalize();

    if (moveState.current.forward) dir.add(camDir);
    if (moveState.current.backward) dir.sub(camDir);
    if (moveState.current.left) dir.sub(camSide);
    if (moveState.current.right) dir.add(camSide);

    const isMoving = dir.lengthSq() > 0.001;

    if (isMoving !== wasMovingRef.current) {
      wasMovingRef.current = isMoving;
      onMoveChange(isMoving);
    }

    if (isMoving) {
      dir.normalize();
      const nextX = camera.position.x + dir.x * speed;
      const nextZ = camera.position.z + dir.z * speed;

      // Límites perimetrales de la cocina
      const minX = -4.5;
      const maxX = 4.5;
      const minZ = -4.6;
      const maxZ = 2.8;

      let validX = nextX;
      let validZ = nextZ;

      if (validX < minX) validX = minX;
      if (validX > maxX) validX = maxX;
      if (validZ < minZ) validZ = minZ;
      if (validZ > maxZ) validZ = maxZ;

      // Colisiones con mobiliario de la cocina
      // 1. Estantería de ingredientes (izquierda)
      if (validX < -3.8 && validZ > -5.2 && validZ < -0.8) {
        validX = -3.8;
      }
      // 2. Mesa de decoración (derecha)
      if (validX > 3.8 && validZ > -5.2 && validZ < -0.8) {
        validX = 3.8;
      }
      // 3. Mesón trasero (batidora y horno)
      if (validZ < -4.2 && validX > -3.5 && validX < 3.5) {
        validZ = -4.2;
      }
      // 4. Mostrador de atención a clientes (frente)
      if (validZ > 2.5 && validX > -3.5 && validX < 3.5) {
        validZ = 2.5;
      }

      camera.position.x = validX;
      camera.position.z = validZ;

      // Efecto sonoro de pasos rítmicos
      const now = performance.now();
      if (now - lastStepTime.current > 330) {
        sounds.playFootstep();
        lastStepTime.current = now;
      }
    }

    // Raycast para interactuar con lo que esté en la mira central
    raycaster.current.setFromCamera(new Vector2(0, 0), camera);
    raycaster.current.far = 4.0;

    const intersects = raycaster.current.intersectObjects(scene.children, true);
    let hitInteractable: string | null = null;

    const validNames = [
      'flour',
      'egg',
      'milk',
      'chocolate',
      'sugar',
      'strawberry',
      'mixer',
      'oven',
      'decorating',
      'counter',
      'customer',
      'trash',
    ];

    for (const hit of intersects) {
      let cur: Object3D | null = hit.object;
      while (cur) {
        if (cur.name && validNames.includes(cur.name)) {
          hitInteractable = cur.name === 'customer' ? 'counter' : cur.name;
          break;
        }
        cur = cur.parent;
      }
      if (hitInteractable) break;
    }

    onFocusChange(hitInteractable);
  });

  return null;
};
