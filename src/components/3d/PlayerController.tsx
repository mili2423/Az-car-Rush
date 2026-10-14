import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls as ThreePointerLockControls } from 'three-stdlib';
import { Vector3, Vector2, Raycaster, Object3D } from 'three';
import { sounds } from '@/utils/audio';

interface PlayerControllerProps {
  walkSpeedBonus: number;
  onFocusChange: (objectName: string | null) => void;
  onInteract: () => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  onMoveChange: (isMoving: boolean) => void;
  enabled?: boolean;
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

  // Initial camera position & view
  useEffect(() => {
    camera.position.set(0, 1.7, 0); // Natural eye level
    camera.lookAt(0, 1.7, -4); // Facing back counters
  }, [camera]);

  // Controles de puntero nativos de Three.js (SIN listener global en document)
  useEffect(() => {
    if (!enabled) {
      if (controlsRef.current) {
        controlsRef.current.disconnect();
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      setIsLocked(false);
      onMoveChange(false);
      return;
    }

    const controls = new ThreePointerLockControls(camera, gl.domElement);
    controlsRef.current = controls;

    const onLock = () => {
      justLockedTime.current = performance.now();
      setIsLocked(true);
    };

    const onUnlock = () => {
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

  // Keyboard and mouse interaction listeners
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = true;
          break;
        case 'KeyE':
          if (isLocked) {
            onInteract();
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = false;
          break;
        case 'KeyA':
          moveState.current.left = false;
          break;
        case 'KeyD':
          moveState.current.right = false;
          break;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Left click interacts only if locked and enabled and not the initial lock click
      if (isLocked && enabled && e.button === 0) {
        if (performance.now() - justLockedTime.current > 150) {
          onInteract();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [enabled, isLocked, onInteract]);

  // Movement & Raycasting frame loop
  useFrame((_, delta) => {
    if (!enabled || !isLocked) return;

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

      // Room boundaries (comfortably inside walls)
      const minX = -4.5;
      const maxX = 4.5;
      const minZ = -4.6;
      const maxZ = 2.8;

      let validX = nextX;
      let validZ = nextZ;

      // Room clamp
      if (validX < minX) validX = minX;
      if (validX > maxX) validX = maxX;
      if (validZ < minZ) validZ = minZ;
      if (validZ > maxZ) validZ = maxZ;

      // Furniture sliding collisions:
      // Left counter (Ingredients shelf)
      if (validX < -3.8 && validZ > -5.2 && validZ < -0.8) {
        validX = -3.8;
      }
      // Right counter (Decorating station)
      if (validX > 3.8 && validZ > -5.2 && validZ < -0.8) {
        validX = 3.8;
      }
      // Back table (Mixer & Oven)
      if (validZ < -4.2 && validX > -3.5 && validX < 3.5) {
        validZ = -4.2;
      }
      // Front Service counter
      if (validZ > 2.5 && validX > -3.5 && validX < 3.5) {
        validZ = 2.5;
      }

      camera.position.x = validX;
      camera.position.z = validZ;

      // Footstep sound
      const now = performance.now();
      if (now - lastStepTime.current > 330) {
        sounds.playFootstep();
        lastStepTime.current = now;
      }
    }

    // Raycast for interactable under crosshair
    raycaster.current.setFromCamera(new Vector2(0, 0), camera);
    raycaster.current.far = 4.0; // Comfortable reach distance

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
