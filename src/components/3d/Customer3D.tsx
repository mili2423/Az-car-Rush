import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { CustomerOrder } from '@/types/game';

interface Customer3DProps {
  currentOrder: CustomerOrder | null;
}

export const Customer3D: React.FC<Customer3DProps> = ({ currentOrder }) => {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !currentOrder) return;

    const t = clock.getElapsedTime();
    const patienceRatio =
      currentOrder.currentPatienceSeconds / currentOrder.maxPatienceSeconds;

    // Normal breathing bobbing
    if (patienceRatio > 0.3) {
      groupRef.current.position.y = Math.sin(t * 3) * 0.05;
      groupRef.current.rotation.z = 0;
    } else {
      // Impatient nervous wiggle
      groupRef.current.position.y = Math.sin(t * 8) * 0.03;
      groupRef.current.rotation.z = Math.sin(t * 12) * 0.04;
    }
  });

  if (!currentOrder) return null;

  const patienceRatio =
    currentOrder.currentPatienceSeconds / currentOrder.maxPatienceSeconds;
  const patienceColor =
    patienceRatio > 0.6 ? '#22c55e' : patienceRatio > 0.3 ? '#eab308' : '#ef4444';

  // Position: behind service counter, facing into the kitchen
  return (
    <group ref={groupRef} position={[-0.8, 0, 5.3]} rotation={[0, Math.PI, 0]} name="counter">
      {/* Customer Body / Torso */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.9, 14]} />
        <meshStandardMaterial color={currentOrder.avatarColor} roughness={0.5} />
      </mesh>

      {/* Scarf / Collar */}
      <mesh position={[0, 1.55, 0]}>
        <torusGeometry args={[0.22, 0.06, 8, 16]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.4} />
      </mesh>

      {/* Cute Hat (Beret / Cap) */}
      <group position={[0, 2.08, 0]}>
        <mesh rotation={[-0.1, 0, 0.1]}>
          <cylinderGeometry args={[0.28, 0.28, 0.08, 14]} />
          <meshStandardMaterial color={currentOrder.avatarColor} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      </group>

      {/* Eyes */}
      <mesh position={[-0.08, 1.88, 0.24]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.08, 1.88, 0.24]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Cheeks */}
      <mesh position={[-0.14, 1.8, 0.22]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#fb7185" />
      </mesh>
      <mesh position={[0.14, 1.8, 0.22]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#fb7185" />
      </mesh>

      {/* Patience Halo indicator floating above customer */}
      <group position={[0, 2.45, 0]}>
        {/* Ring background */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.03, 8, 24]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Glowing active patience ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry
            args={[0.26, 0.045, 8, 24, Math.PI * 2 * Math.max(0.05, patienceRatio)]}
          />
          <meshStandardMaterial color={patienceColor} emissive={patienceColor} emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
};
