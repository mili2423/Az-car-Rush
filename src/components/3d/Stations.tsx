import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, PointLight } from 'three';
import { OvenState } from '@/types/game';

interface StationsProps {
  ovenState: OvenState;
  isMixerActive: boolean;
  focusedObject: string | null;
}

export const Stations: React.FC<StationsProps> = ({
  ovenState,
  isMixerActive,
  focusedObject,
}) => {
  const mixerPaddleRef = useRef<Group>(null);
  const ovenGlowRef = useRef<PointLight>(null);

  useFrame((_, delta) => {
    // Spin mixer when active
    if (mixerPaddleRef.current && isMixerActive) {
      mixerPaddleRef.current.rotation.y += delta * 18;
    }
    // Pulse oven glow when cooking or burning
    if (ovenGlowRef.current && ovenState.isCooking) {
      if (ovenState.isBurnt) {
        ovenGlowRef.current.color.set('#ef4444');
        ovenGlowRef.current.intensity = 2.5 + Math.sin(Date.now() * 0.015) * 1.5;
      } else if (ovenState.isReady) {
        ovenGlowRef.current.color.set('#22c55e');
        ovenGlowRef.current.intensity = 2.0;
      } else {
        ovenGlowRef.current.color.set('#f97316');
        ovenGlowRef.current.intensity = 1.2 + Math.sin(Date.now() * 0.005) * 0.4;
      }
    }
  });

  return (
    <group>
      {/* ============================================================== */}
      {/* 1. ZONA DE INGREDIENTES (Mesada a la izquierda: X = -5.5, Z = -3) */}
      {/* ============================================================== */}
      <group position={[-5.5, 0, -3]}>
        {/* Counter Table */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.0, 4.4]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.4} />
        </mesh>
        {/* Table Top Surface (Rose wood) */}
        <mesh position={[0, 1.02, 0]} receiveShadow>
          <boxGeometry args={[1.7, 0.08, 4.5]} />
          <meshStandardMaterial color="#f472b6" roughness={0.3} />
        </mesh>

        {/* Shelf Above Counter */}
        <mesh position={[0, 2.2, 0]} receiveShadow>
          <boxGeometry args={[0.8, 0.08, 4.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>

        {/* 1.1 HARINA (Flour) */}
        <group position={[0.2, 1.3, -1.5]} name="flour">
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.26, 0.5, 12]} />
            <meshStandardMaterial
              color={focusedObject === 'flour' ? '#fef08a' : '#fef9c3'}
              roughness={0.7}
            />
          </mesh>
          {/* Label band */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.24, 0.25, 0.18, 12]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
        </group>

        {/* 1.2 HUEVO (Egg Box) */}
        <group position={[0.2, 1.15, -0.7]} name="egg">
          <mesh castShadow>
            <boxGeometry args={[0.45, 0.15, 0.35]} />
            <meshStandardMaterial
              color={focusedObject === 'egg' ? '#fef08a' : '#fbbf24'}
              roughness={0.6}
            />
          </mesh>
          {/* Cute Eggs sticking out */}
          {[-0.12, 0.12].map(x =>
            [-0.08, 0.08].map(z => (
              <mesh key={`egg-${x}-${z}`} position={[x, 0.12, z]}>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
            ))
          )}
        </group>

        {/* 1.3 LECHE (Milk Bottle) */}
        <group position={[0.2, 1.32, 0.1]} name="milk">
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.14, 0.45, 12]} />
            <meshStandardMaterial
              color={focusedObject === 'milk' ? '#fef08a' : '#f8fafc'}
              roughness={0.2}
            />
          </mesh>
          {/* Cap */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 10]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* 1.4 AZÚCAR (Sugar Jar) */}
        <group position={[0.2, 1.28, 0.8]} name="sugar">
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.4, 12]} />
            <meshStandardMaterial
              color={focusedObject === 'sugar' ? '#fef08a' : '#fce7f3'}
              roughness={0.2}
            />
          </mesh>
          {/* Pink Lid */}
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 12]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
        </group>

        {/* 1.5 CHOCOLATE (Chocolate Bar) */}
        <group position={[0.2, 1.1, 1.4]} name="chocolate">
          <mesh castShadow rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.35, 0.1, 0.55]} />
            <meshStandardMaterial
              color={focusedObject === 'chocolate' ? '#fef08a' : '#451a03'}
              roughness={0.3}
            />
          </mesh>
          {/* Foil wrapper */}
          <mesh position={[0, 0.01, 0.1]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.36, 0.09, 0.25]} />
            <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* 1.6 FRUTILLA (Strawberry Crate on shelf) */}
        <group position={[0.2, 2.35, 0]} name="strawberry">
          {/* Wooden basket */}
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.2, 0.6]} />
            <meshStandardMaterial
              color={focusedObject === 'strawberry' ? '#fef08a' : '#b45309'}
              roughness={0.8}
            />
          </mesh>
          {/* Juicy Red Strawberries */}
          {[-0.1, 0.1].map(x =>
            [-0.15, 0, 0.15].map(z => (
              <mesh key={`berry-${x}-${z}`} position={[x, 0.12, z]}>
                <coneGeometry args={[0.07, 0.12, 8]} />
                <meshStandardMaterial color="#e11d48" roughness={0.3} />
              </mesh>
            ))
          )}
        </group>
      </group>

      {/* ============================================================== */}
      {/* 2. MESA DE MEZCLA (Back Center-Left: X = -2.2, Z = -5.8) */}
      {/* ============================================================== */}
      <group position={[-2.2, 0, -5.8]} name="mixer">
        {/* Table */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 1.0, 1.4]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.02, 0]} receiveShadow>
          <boxGeometry args={[2.1, 0.08, 1.5]} />
          <meshStandardMaterial color="#f472b6" roughness={0.3} />
        </mesh>

        {/* Stand Mixer Base */}
        <group position={[0, 1.06, 0]}>
          {/* Base plate */}
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.45, 0.08, 0.7]} />
            <meshStandardMaterial
              color={focusedObject === 'mixer' ? '#fef08a' : '#ec4899'}
              roughness={0.3}
            />
          </mesh>
          {/* Back upright arm */}
          <mesh position={[0, 0.45, -0.2]}>
            <boxGeometry args={[0.25, 0.75, 0.22]} />
            <meshStandardMaterial color="#ec4899" roughness={0.3} />
          </mesh>
          {/* Upper top head */}
          <mesh position={[0, 0.8, 0.05]}>
            <boxGeometry args={[0.26, 0.24, 0.65]} />
            <meshStandardMaterial color="#ec4899" roughness={0.3} />
          </mesh>
          {/* Stainless Steel Mixing Bowl */}
          <mesh position={[0, 0.28, 0.15]}>
            <cylinderGeometry args={[0.26, 0.18, 0.38, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Contents inside bowl when mixing */}
          {isMixerActive && (
            <mesh position={[0, 0.32, 0.15]}>
              <cylinderGeometry args={[0.24, 0.16, 0.1, 14]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.6} />
            </mesh>
          )}
          {/* Rotating Whisk / Paddle */}
          <group ref={mixerPaddleRef} position={[0, 0.55, 0.15]}>
            <mesh position={[0, -0.15, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            <mesh position={[0, -0.25, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#94a3b8" wireframe metalness={0.8} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 3. HORNO PASTELERO (Back Center-Right: X = 2.2, Z = -5.8) */}
      {/* ============================================================== */}
      <group position={[2.2, 0, -5.8]} name="oven">
        {/* Oven Body Vintage Cream & Gold */}
        <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 1.9, 1.4]} />
          <meshStandardMaterial
            color={focusedObject === 'oven' ? '#fef08a' : '#fef3c7'}
            roughness={0.4}
          />
        </mesh>
        {/* Oven Top Rim (Brass/Gold) */}
        <mesh position={[0, 1.92, 0]}>
          <boxGeometry args={[2.05, 0.06, 1.45]} />
          <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Oven Door Front Frame */}
        <mesh position={[0, 0.9, 0.72]}>
          <boxGeometry args={[1.6, 1.2, 0.08]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
        {/* Oven Glass Window (Semi-transparent) */}
        <mesh position={[0, 0.9, 0.74]}>
          <boxGeometry args={[1.2, 0.8, 0.06]} />
          <meshStandardMaterial
            color={
              ovenState.isCooking
                ? ovenState.isBurnt
                  ? '#7f1d1d'
                  : '#f97316'
                : '#1e293b'
            }
            roughness={0.1}
            transparent
            opacity={ovenState.isCooking ? 0.7 : 0.9}
          />
        </mesh>
        {/* Door Handle */}
        <mesh position={[0, 1.35, 0.8]}>
          <boxGeometry args={[1.0, 0.08, 0.08]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Oven Control Knobs */}
        {[-0.5, 0, 0.5].map((kx, kidx) => (
          <mesh key={`knob-${kidx}`} position={[kx, 1.65, 0.73]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.7} />
          </mesh>
        ))}

        {/* Item baking inside oven on rack */}
        {ovenState.isCooking && (
          <group position={[0, 0.75, 0.45]}>
            {/* Wire rack */}
            <mesh>
              <boxGeometry args={[1.1, 0.02, 0.6]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Pastry baking */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.1, 14]} />
              <meshStandardMaterial
                color={
                  ovenState.isBurnt
                    ? '#1c1917'
                    : ovenState.isReady
                    ? '#d97706'
                    : '#fed7aa'
                }
                roughness={0.6}
              />
            </mesh>
          </group>
        )}

        {/* Internal Glow Light */}
        <pointLight
          ref={ovenGlowRef}
          position={[0, 0.9, 0.5]}
          intensity={ovenState.isCooking ? 1.8 : 0}
          distance={4}
          color="#f97316"
        />

        {/* 3D Progress Indicator above oven when cooking */}
        {ovenState.isCooking && (
          <group position={[0, 2.2, 0]}>
            {/* Background pill */}
            <mesh>
              <boxGeometry args={[1.2, 0.2, 0.05]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            {/* Filled bar */}
            <mesh
              position={[
                -0.55 + (ovenState.isReady ? 1 : ovenState.progress) * 0.55,
                0,
                0.03,
              ]}
            >
              <boxGeometry
                args={[
                  Math.max(0.02, (ovenState.isReady ? 1 : ovenState.progress) * 1.1),
                  0.14,
                  0.05,
                ]}
              />
              <meshStandardMaterial
                color={
                  ovenState.isBurnt
                    ? '#ef4444'
                    : ovenState.isReady
                    ? '#22c55e'
                    : '#f59e0b'
                }
              />
            </mesh>
          </group>
        )}
      </group>

      {/* ============================================================== */}
      {/* 4. ZONA DE DECORACIÓN (Mesada a la derecha: X = 5.5, Z = -3) */}
      {/* ============================================================== */}
      <group position={[5.5, 0, -3]} name="decorating">
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.0, 4.0]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.02, 0]} receiveShadow>
          <boxGeometry args={[1.7, 0.08, 4.1]} />
          <meshStandardMaterial color="#f472b6" roughness={0.3} />
        </mesh>

        {/* Pastry piping bags / Mangas pasteleras */}
        {[-1.0, -0.3, 0.4, 1.1].map((pz, idx) => {
          const bagColors = ['#ec4899', '#38bdf8', '#fbbf24', '#a855f7'];
          return (
            <group key={`bag-${idx}`} position={[-0.2, 1.18, pz]} rotation={[0.4, 0, 0.3]}>
              <mesh castShadow>
                <coneGeometry args={[0.14, 0.4, 12]} />
                <meshStandardMaterial
                  color={focusedObject === 'decorating' ? '#fef08a' : bagColors[idx]}
                  roughness={0.4}
                />
              </mesh>
              {/* Metallic Nozzle */}
              <mesh position={[0, -0.22, 0]}>
                <coneGeometry args={[0.04, 0.08, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
              </mesh>
            </group>
          );
        })}

        {/* Sprinkle / Topping bowls */}
        {[-0.6, 0.7].map((bz, bidx) => (
          <mesh key={`tbowl-${bidx}`} position={[0.3, 1.12, bz]}>
            <cylinderGeometry args={[0.18, 0.12, 0.15, 12]} />
            <meshStandardMaterial color="#e0f2fe" roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ============================================================== */}
      {/* 5. TACHO DE BASURA (Trash can: X = 5.2, Z = 1.0) */}
      {/* ============================================================== */}
      <group position={[5.5, 0, 1.5]} name="trash">
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.26, 0.9, 14]} />
          <meshStandardMaterial
            color={focusedObject === 'trash' ? '#fef08a' : '#34d399'}
            roughness={0.5}
          />
        </mesh>
        {/* Lid */}
        <mesh position={[0, 0.92, 0]}>
          <cylinderGeometry args={[0.33, 0.33, 0.08, 14]} />
          <meshStandardMaterial color="#059669" />
        </mesh>
        {/* Foot pedal */}
        <mesh position={[-0.25, 0.06, 0]}>
          <boxGeometry args={[0.15, 0.04, 0.12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 6. MOSTRADOR DE SERVICIO (Front Counter: X = 0, Z = 4.0) */}
      {/* ============================================================== */}
      <group position={[0, 0, 4.0]} name="counter">
        {/* Main front wooden counter */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.0, 1.1, 1.4]} />
          <meshStandardMaterial color="#451a03" roughness={0.6} />
        </mesh>
        {/* Counter Top Surface (Polished cream marble/wood) */}
        <mesh position={[0, 1.12, 0]} receiveShadow>
          <boxGeometry args={[7.2, 0.08, 1.5]} />
          <meshStandardMaterial
            color={focusedObject === 'counter' ? '#fef08a' : '#fffbeb'}
            roughness={0.2}
          />
        </mesh>

        {/* Vintage Service Bell on counter */}
        <group position={[-1.8, 1.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.14, 0.16, 0.04, 16]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.9} />
          </mesh>
        </group>

        {/* Glass Pastry Display Showcase on Left of Counter */}
        <group position={[2.0, 1.45, 0]}>
          <mesh>
            <boxGeometry args={[2.5, 0.6, 1.0]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.35} roughness={0.1} />
          </mesh>
          {/* Sample display treats */}
          {[-0.8, 0, 0.8].map((dx, didx) => (
            <mesh key={`disp-${didx}`} position={[dx, -0.15, 0]}>
              <cylinderGeometry args={[0.14, 0.12, 0.12, 12]} />
              <meshStandardMaterial color="#f472b6" />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
