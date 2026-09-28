import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3, Quaternion, MathUtils } from 'three';
import { TrayState, ProductId, IngredientId } from '@/types/game';

interface HeldItem3DProps {
  tray: TrayState;
  isMoving: boolean;
}

export const HeldItem3D: React.FC<HeldItem3DProps> = ({ tray, isMoving }) => {
  const heldGroupRef = useRef<Group>(null);
  const targetPos = useRef(new Vector3());
  const currentPos = useRef(new Vector3());
  const targetQuat = useRef(new Quaternion());
  const currentQuat = useRef(new Quaternion());

  useFrame(({ camera, clock }, delta) => {
    if (!heldGroupRef.current) return;

    // Calculate ideal local offset in front of camera
    // x = 0.28 (right), y = -0.28 (bottom), z = -0.65 (in front)
    const localOffset = new Vector3(0.25, -0.26, -0.62);

    // Natural bobbing when walking
    const t = clock.getElapsedTime();
    if (isMoving) {
      localOffset.y += Math.sin(t * 10) * 0.018;
      localOffset.x += Math.cos(t * 5) * 0.012;
      localOffset.z += Math.sin(t * 8) * 0.008;
    } else {
      // Subtle idle breathing
      localOffset.y += Math.sin(t * 2) * 0.004;
    }

    // Transform local offset to world position
    const desiredPos = localOffset.applyQuaternion(camera.quaternion).add(camera.position);

    // Smooth lerp for dynamic viewmodel sway when looking around
    const lerpFactor = Math.min(1.0, delta * 18);
    currentPos.current.lerp(desiredPos, lerpFactor);
    currentQuat.current.slerp(camera.quaternion, lerpFactor);

    heldGroupRef.current.position.copy(currentPos.current);
    heldGroupRef.current.quaternion.copy(currentQuat.current);
  });

  return (
    <group ref={heldGroupRef}>
      {/* ============================================================== */}
      {/* BAKER'S CHEF MITTENS (Hands holding the tray) */}
      {/* ============================================================== */}
      <group position={[0, -0.06, 0]}>
        {/* Left hand mitten */}
        <group position={[-0.32, -0.02, 0.05]} rotation={[0.2, 0.4, -0.2]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.07, 0.16, 8, 12]} />
            <meshStandardMaterial color="#fce7f3" roughness={0.4} />
          </mesh>
          {/* Thumb */}
          <mesh position={[0.05, 0.04, 0.04]} rotation={[0.4, 0.2, 0]}>
            <capsuleGeometry args={[0.035, 0.08, 6, 8]} />
            <meshStandardMaterial color="#fce7f3" roughness={0.4} />
          </mesh>
          {/* Cuff band */}
          <mesh position={[-0.02, -0.09, -0.02]}>
            <torusGeometry args={[0.07, 0.02, 8, 16]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
        </group>

        {/* Right hand mitten */}
        <group position={[0.32, -0.02, 0.05]} rotation={[0.2, -0.4, 0.2]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.07, 0.16, 8, 12]} />
            <meshStandardMaterial color="#fce7f3" roughness={0.4} />
          </mesh>
          {/* Thumb */}
          <mesh position={[-0.05, 0.04, 0.04]} rotation={[0.4, -0.2, 0]}>
            <capsuleGeometry args={[0.035, 0.08, 6, 8]} />
            <meshStandardMaterial color="#fce7f3" roughness={0.4} />
          </mesh>
          {/* Cuff band */}
          <mesh position={[0.02, -0.09, -0.02]}>
            <torusGeometry args={[0.07, 0.02, 8, 16]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* PASTEL BAKING TRAY */}
      {/* ============================================================== */}
      <group position={[0, -0.05, 0]} rotation={[0.08, 0, 0]}>
        {/* Tray Base */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.54, 0.025, 0.38]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Tray Golden Rim */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.56, 0.03, 0.4]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} wireframe={false} />
        </mesh>
        {/* Inner surface */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.34]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.2} />
        </mesh>

        {/* ============================================================== */}
        {/* CONTENT ON TRAY BASED ON TRAY STATE */}
        {/* ============================================================== */}

        {/* 1. INGREDIENTS ACCUMULATED */}
        {tray.type === 'ingredients' && (
          <group position={[0, 0.04, 0]}>
            {tray.items.map((item, idx) => {
              // Arrange nicely across tray
              const positions = [
                [-0.14, 0, -0.06],
                [0.14, 0, -0.06],
                [-0.14, 0, 0.07],
                [0.14, 0, 0.07],
                [0, 0, 0],
              ];
              const pos = positions[idx % positions.length];
              return (
                <group key={`ing-${idx}-${item}`} position={[pos[0], pos[1], pos[2]]}>
                  {item === 'flour' && (
                    <group>
                      <mesh position={[0, 0.08, 0]} castShadow>
                        <cylinderGeometry args={[0.06, 0.07, 0.14, 10]} />
                        <meshStandardMaterial color="#fef9c3" roughness={0.8} />
                      </mesh>
                      <mesh position={[0, 0.07, 0]}>
                        <cylinderGeometry args={[0.065, 0.065, 0.05, 10]} />
                        <meshStandardMaterial color="#ec4899" />
                      </mesh>
                    </group>
                  )}
                  {item === 'egg' && (
                    <mesh position={[0, 0.05, 0]} rotation={[0.3, 0, 0.2]} castShadow>
                      <sphereGeometry args={[0.05, 8, 8]} />
                      <meshStandardMaterial color="#fef08a" roughness={0.4} />
                    </mesh>
                  )}
                  {item === 'milk' && (
                    <group position={[0, 0.07, 0]}>
                      <mesh castShadow>
                        <cylinderGeometry args={[0.035, 0.04, 0.13, 10]} />
                        <meshStandardMaterial color="#e0f2fe" roughness={0.2} />
                      </mesh>
                      <mesh position={[0, 0.07, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
                        <meshStandardMaterial color="#0284c7" />
                      </mesh>
                    </group>
                  )}
                  {item === 'sugar' && (
                    <group position={[0, 0.06, 0]}>
                      <mesh castShadow>
                        <cylinderGeometry args={[0.05, 0.05, 0.11, 10]} />
                        <meshStandardMaterial color="#fce7f3" roughness={0.3} />
                      </mesh>
                      <mesh position={[0, 0.06, 0]}>
                        <cylinderGeometry args={[0.055, 0.055, 0.02, 10]} />
                        <meshStandardMaterial color="#ec4899" />
                      </mesh>
                    </group>
                  )}
                  {item === 'chocolate' && (
                    <group position={[0, 0.03, 0]} rotation={[0, 0.4, 0]}>
                      <mesh castShadow>
                        <boxGeometry args={[0.1, 0.03, 0.14]} />
                        <meshStandardMaterial color="#451a03" roughness={0.3} />
                      </mesh>
                      <mesh position={[0, 0.005, 0.03]}>
                        <boxGeometry args={[0.105, 0.025, 0.07]} />
                        <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.3} />
                      </mesh>
                    </group>
                  )}
                  {item === 'strawberry' && (
                    <group position={[0, 0.04, 0]}>
                      <mesh castShadow>
                        <coneGeometry args={[0.04, 0.08, 8]} />
                        <meshStandardMaterial color="#e11d48" roughness={0.3} />
                      </mesh>
                      <mesh position={[0, 0.04, 0]}>
                        <sphereGeometry args={[0.02, 6, 6]} />
                        <meshStandardMaterial color="#22c55e" />
                      </mesh>
                    </group>
                  )}
                </group>
              );
            })}
          </group>
        )}

        {/* 2. MIXED DOUGH */}
        {tray.type === 'mixed_dough' && (
          <group position={[0, 0.08, 0]}>
            {/* Smooth dough mound */}
            <mesh castShadow>
              <sphereGeometry args={[0.13, 16, 12]} />
              <meshStandardMaterial color="#fed7aa" roughness={0.7} />
            </mesh>
            {/* Cute sparkle hint */}
            <mesh position={[0.08, 0.06, 0.06]}>
              <sphereGeometry args={[0.02, 6, 6]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
            </mesh>
          </group>
        )}

        {/* 3. BAKED / FINISHED PRODUCTS */}
        {(tray.type === 'baked' || tray.type === 'finished') && (
          <Product3DItem
            productId={tray.recipeId}
            isFinished={tray.type === 'finished'}
          />
        )}

        {/* 4. BURNT LUMP */}
        {tray.type === 'burnt' && (
          <group position={[0, 0.07, 0]}>
            {/* Irregular burnt lump */}
            <mesh castShadow>
              <dodecahedronGeometry args={[0.12, 1]} />
              <meshStandardMaterial color="#1e1e1e" roughness={0.9} />
            </mesh>
            {/* Ember glow dots */}
            <mesh position={[0.04, 0.03, 0.04]}>
              <sphereGeometry args={[0.015, 6, 6]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.0} />
            </mesh>
            <mesh position={[-0.03, 0.05, -0.02]}>
              <sphereGeometry args={[0.012, 6, 6]} />
              <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={2.0} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// Sub-component to render the specific 3D pastry model
const Product3DItem: React.FC<{ productId: ProductId; isFinished: boolean }> = ({
  productId,
  isFinished,
}) => {
  switch (productId) {
    case 'cookie':
      return (
        <group position={[0, 0.04, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.035, 16]} />
            <meshStandardMaterial color="#d97706" roughness={0.6} />
          </mesh>
          {/* Chocolate chips */}
          {[
            [-0.06, 0.02, -0.04],
            [0.05, 0.02, 0.05],
            [-0.03, 0.02, 0.06],
            [0.06, 0.02, -0.05],
            [0, 0.02, 0],
          ].map(([x, y, z], i) => (
            <mesh key={`chip-${i}`} position={[x, y, z]}>
              <sphereGeometry args={[0.02, 6, 6]} />
              <meshStandardMaterial color="#451a03" />
            </mesh>
          ))}
        </group>
      );

    case 'cupcake':
      return (
        <group position={[0, 0.05, 0]}>
          {/* Paper Liner */}
          <mesh castShadow>
            <cylinderGeometry args={[0.09, 0.06, 0.09, 14]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.5} />
          </mesh>
          {/* Baked Sponge Cake */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <sphereGeometry args={[0.095, 12, 10]} />
            <meshStandardMaterial color="#78350f" roughness={0.6} />
          </mesh>
          {/* If decorated: Luscious Pink Swirl Frosting + Cherry */}
          {isFinished && (
            <group position={[0, 0.11, 0]}>
              <mesh castShadow>
                <coneGeometry args={[0.08, 0.1, 10]} />
                <meshStandardMaterial color="#ec4899" roughness={0.3} />
              </mesh>
              {/* Cherry on top */}
              <mesh position={[0, 0.07, 0]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshStandardMaterial color="#e11d48" roughness={0.2} />
              </mesh>
            </group>
          )}
        </group>
      );

    case 'donut':
      return (
        <group position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          {/* Doughnut Dough Ring */}
          <mesh castShadow>
            <torusGeometry args={[0.11, 0.055, 12, 20]} />
            <meshStandardMaterial color="#d97706" roughness={0.5} />
          </mesh>
          {/* If decorated: Pink Strawberry Glaze */}
          {isFinished && (
            <mesh position={[0, 0, 0.02]}>
              <torusGeometry args={[0.11, 0.045, 10, 20, Math.PI * 1.8]} />
              <meshStandardMaterial color="#f472b6" roughness={0.2} />
            </mesh>
          )}
        </group>
      );

    case 'tart':
      return (
        <group position={[0, 0.04, 0]}>
          {/* Fluted Pie Crust */}
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.12, 0.06, 16]} />
            <meshStandardMaterial color="#b45309" roughness={0.6} />
          </mesh>
          {/* Filling Custard */}
          <mesh position={[0, 0.028, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.02, 14]} />
            <meshStandardMaterial color="#fef08a" roughness={0.3} />
          </mesh>
          {/* If decorated: Fresh Strawberries + Cream */}
          {isFinished && (
            <group position={[0, 0.045, 0]}>
              {[-0.05, 0.05].map(x =>
                [-0.05, 0.05].map(z => (
                  <mesh key={`tart-b-${x}-${z}`} position={[x, 0, z]}>
                    <coneGeometry args={[0.03, 0.06, 6]} />
                    <meshStandardMaterial color="#e11d48" roughness={0.2} />
                  </mesh>
                ))
              )}
              {/* Cream center swirl */}
              <mesh position={[0, 0.015, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
            </group>
          )}
        </group>
      );

    case 'cake':
      return (
        <group position={[0, 0.05, 0]}>
          {/* Tier 1 Cake Base */}
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.09, 16]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.5} />
          </mesh>
          {/* If decorated: Royal Violet Icing + Cream Drops */}
          {isFinished && (
            <group position={[0, 0.045, 0]}>
              <mesh>
                <cylinderGeometry args={[0.165, 0.165, 0.02, 16]} />
                <meshStandardMaterial color="#a855f7" roughness={0.2} />
              </mesh>
              {/* Cute Candle in center */}
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.08, 6]} />
                <meshStandardMaterial color="#fbbf24" />
              </mesh>
              {/* Flame */}
              <mesh position={[0, 0.11, 0]}>
                <coneGeometry args={[0.015, 0.03, 6]} />
                <meshStandardMaterial color="#ef4444" emissive="#f97316" emissiveIntensity={1.5} />
              </mesh>
            </group>
          )}
        </group>
      );

    case 'pastry':
      return (
        <group position={[0, 0.04, 0]} rotation={[0, 0.3, 0]}>
          {/* Crescent Medialuna / Factura */}
          <mesh castShadow>
            <torusGeometry args={[0.1, 0.045, 8, 14, Math.PI * 1.3]} />
            <meshStandardMaterial color="#d97706" roughness={0.4} />
          </mesh>
          {/* Sweet Sugar Syrup Glaze */}
          <mesh position={[0, 0.01, 0]}>
            <torusGeometry args={[0.1, 0.04, 6, 12, Math.PI * 1.2]} />
            <meshStandardMaterial color="#fef08a" roughness={0.1} transparent opacity={0.6} />
          </mesh>
        </group>
      );

    default:
      return null;
  }
};
