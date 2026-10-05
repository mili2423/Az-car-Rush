import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3, Quaternion, CylinderGeometry, BoxGeometry, CapsuleGeometry, TorusGeometry } from 'three';
import { TrayState, ProductId, IngredientId } from '@/types/game';
import { ToonOutline } from './ToonOutline';

interface HeldItem3DProps {
  tray: TrayState;
  isMoving: boolean;
}

/**
 * Componente de mano estilizada de pastelero/chef en primera persona.
 * Presenta manga de chaqueta blanca, puño remangado rosa con botón dorado,
 * palma toon y 4 dedos articulados que sujetan por debajo + pulgar opuesto por encima del borde.
 */
const ChefHand: React.FC<{ side: 'left' | 'right'; isHoldingWeight: boolean }> = ({
  side,
  isHoldingWeight,
}) => {
  const isLeft = side === 'left';
  const sign = isLeft ? -1 : 1;

  // Geometrías compartidas para óptimo rendimiento
  const sleeveGeo = useMemo(() => new CylinderGeometry(0.08, 0.095, 0.38, 16), []);
  const cuffGeo = useMemo(() => new CylinderGeometry(0.098, 0.098, 0.07, 16), []);
  const buttonGeo = useMemo(() => new CylinderGeometry(0.012, 0.012, 0.01, 8), []);
  const wristGeo = useMemo(() => new CylinderGeometry(0.05, 0.055, 0.06, 12), []);
  const palmGeo = useMemo(() => new BoxGeometry(0.08, 0.045, 0.1), []);
  const fingerGeo = useMemo(() => new CapsuleGeometry(0.014, 0.05, 6, 8), []);
  const thumbGeo = useMemo(() => new CapsuleGeometry(0.016, 0.055, 6, 8), []);

  return (
    <group
      position={[sign * 0.22, -0.12, 0.0]}
      rotation={[0.05, sign * 0.12, sign * 0.05]}
    >
      {/* 1. Manga de la chaqueta de chef */}
      <group position={[sign * 0.04, -0.12, 0.22]} rotation={[0.9, sign * 0.18, -sign * 0.08]}>
        <mesh geometry={sleeveGeo} castShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
          <ToonOutline geometry={sleeveGeo} thickness={0.018} color="#2a1714" />
        </mesh>

        {/* 2. Puño remangado pastelero */}
        <group position={[0, -0.16, 0]}>
          <mesh geometry={cuffGeo} castShadow>
            <meshStandardMaterial color="#ec4899" roughness={0.35} />
            <ToonOutline geometry={cuffGeo} thickness={0.018} color="#2a1714" />
          </mesh>

          {/* Botón dorado del puño */}
          <mesh
            geometry={buttonGeo}
            position={[sign * 0.1, 0, 0]}
            rotation={[0, 0, sign * Math.PI / 2]}
          >
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* 3. Muñeca */}
      <group position={[sign * 0.01, -0.04, 0.04]} rotation={[-0.1, sign * 0.1, 0]}>
        <mesh geometry={wristGeo} castShadow>
          <meshStandardMaterial color="#fed7aa" roughness={0.4} />
        </mesh>
      </group>

      {/* 4. Palma de la mano estilizada (Chibi/Toon) */}
      <group position={[0, 0.0, 0.0]} rotation={[0.05, 0, sign * 0.04]}>
        <mesh geometry={palmGeo} castShadow>
          <meshStandardMaterial color="#fed7aa" roughness={0.4} />
          <ToonOutline geometry={palmGeo} thickness={0.016} color="#2a1714" />
        </mesh>

        {/* 5. Cuatro dedos apoyando firmemente bajo la bandeja */}
        {[-0.035, -0.012, 0.012, 0.035].map((zOffset, idx) => (
          <group
            key={`finger-${idx}`}
            position={[-sign * 0.04, -0.012, zOffset]}
            rotation={[
              0,
              0,
              -sign * (0.9 + (isHoldingWeight ? 0.15 : 0))
            ]}
          >
            <mesh geometry={fingerGeo} castShadow>
              <meshStandardMaterial color="#fed7aa" roughness={0.4} />
              <ToonOutline geometry={fingerGeo} thickness={0.012} color="#2a1714" />
            </mesh>
          </group>
        ))}

        {/* 6. Pulgar opuesto */}
        <group
          position={[-sign * 0.038, 0.028, 0.02]}
          rotation={[
            0.25,
            sign * 0.5,
            sign * 0.5
          ]}
        >
          <mesh geometry={thumbGeo} castShadow>
            <meshStandardMaterial color="#fed7aa" roughness={0.4} />
            <ToonOutline geometry={thumbGeo} thickness={0.014} color="#2a1714" />
          </mesh>
          {/* Uña sutil toon */}
          <mesh position={[0, 0.025, 0.014]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.014, 0.014, 0.005]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export const HeldItem3D: React.FC<HeldItem3DProps> = ({ tray, isMoving }) => {
  const heldGroupRef = useRef<Group>(null);
  const currentPos = useRef(new Vector3());
  const currentQuat = useRef(new Quaternion());

  // Física de rebote elástico (Spring Ease) al cambiar de objeto o estado
  const springY = useRef(0);
  const springVel = useRef(0);
  const prevTrayKey = useRef<string>('');

  // Detectar cambios en la bandeja para aplicar impulso físico elástico
  const trayKey = tray.type === 'ingredients' ? `ing-${tray.items.join(',')}` : tray.type;
  if (trayKey !== prevTrayKey.current) {
    if (prevTrayKey.current !== '') {
      springVel.current = tray.type === 'empty' ? 0.04 : -0.05;
    }
    prevTrayKey.current = trayKey;
  }

  const isHoldingWeight = tray.type !== 'empty';

  useFrame(({ camera, clock }, delta) => {
    if (!heldGroupRef.current) return;

    // Simulación física de resorte amortiguado
    const stiffness = 240;
    const damping = 16;
    const springForce = -stiffness * springY.current;
    springVel.current += (springForce - damping * springVel.current) * delta;
    springY.current += springVel.current * delta;

    // Calcular offset ideal: bandeja más centrada, baja y cercana a la cámara
    const localOffset = new Vector3(0.0, -0.28 + springY.current, -0.55);

    // Movimiento orgánico al caminar (bobbing) o respiración en reposo
    const t = clock.getElapsedTime();
    if (isMoving) {
      localOffset.y += Math.sin(t * 10) * 0.016;
      localOffset.x += Math.cos(t * 5) * 0.010;
      localOffset.z += Math.sin(t * 8) * 0.007;
    } else {
      localOffset.y += Math.sin(t * 2) * 0.003;
      localOffset.x += Math.cos(t * 1.5) * 0.002;
    }

    // Transformar a posición en el mundo
    const desiredPos = localOffset.applyQuaternion(camera.quaternion).add(camera.position);

    // Suavizado lerp para inercia al mover la vista
    const lerpFactor = Math.min(1.0, delta * 18);
    currentPos.current.lerp(desiredPos, lerpFactor);
    currentQuat.current.slerp(camera.quaternion, lerpFactor);

    heldGroupRef.current.position.copy(currentPos.current);
    heldGroupRef.current.quaternion.copy(currentQuat.current);
  });

  return (
    <group ref={heldGroupRef}>
      {/* ============================================================== */}
      {/* MANOS ESTILIZADAS DE PASTELERO (CHEF PASTRY HANDS)             */}
      {/* ============================================================== */}
      <ChefHand side="left" isHoldingWeight={isHoldingWeight} />
      <ChefHand side="right" isHoldingWeight={isHoldingWeight} />

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
