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
            decorations={tray.type === 'finished' ? tray.decorations : undefined}
            hasError={tray.type === 'finished' ? tray.isIncorrectDecor : false}
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

// ─── TOPPERS Y DECORACIONES 3D ESTILIZADAS ────────────────────────────────────
const HeartTopper: React.FC<{ color?: string; position?: [number, number, number]; scale?: number }> = ({
  color = '#ef4444',
  position = [0, 0, 0],
  scale = 1,
}) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[-0.015, 0.015, 0]}>
      <sphereGeometry args={[0.02, 10, 10]} />
      <meshStandardMaterial color={color} roughness={0.25} />
    </mesh>
    <mesh position={[0.015, 0.015, 0]}>
      <sphereGeometry args={[0.02, 10, 10]} />
      <meshStandardMaterial color={color} roughness={0.25} />
    </mesh>
    <mesh position={[0, -0.01, 0]} rotation={[0, 0, Math.PI]}>
      <coneGeometry args={[0.028, 0.04, 10]} />
      <meshStandardMaterial color={color} roughness={0.25} />
    </mesh>
  </group>
);

const SmileyTopper: React.FC<{ position?: [number, number, number]; scale?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
}) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.035, 0.035, 0.008, 16]} />
      <meshStandardMaterial color="#f59e0b" roughness={0.3} />
    </mesh>
    <mesh position={[-0.012, 0.006, 0.008]}>
      <sphereGeometry args={[0.004, 6, 6]} />
      <meshStandardMaterial color="#451a03" />
    </mesh>
    <mesh position={[0.012, 0.006, 0.008]}>
      <sphereGeometry args={[0.004, 6, 6]} />
      <meshStandardMaterial color="#451a03" />
    </mesh>
    <mesh position={[0, -0.008, 0.008]} rotation={[0, 0, Math.PI]}>
      <torusGeometry args={[0.012, 0.003, 6, 10, Math.PI]} />
      <meshStandardMaterial color="#451a03" />
    </mesh>
  </group>
);

const CloverTopper: React.FC<{ position?: [number, number, number]; scale?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
}) => (
  <group position={position} scale={[scale, scale, scale]}>
    {[-0.014, 0.014].map(x =>
      [-0.014, 0.014].map(z => (
        <mesh key={`clover-${x}-${z}`} position={[x, 0, z]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial color="#22c55e" roughness={0.3} />
        </mesh>
      ))
    )}
  </group>
);

const FlameTopper: React.FC<{ position?: [number, number, number]; scale?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
}) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[0, 0.03, 0]}>
      <cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />
      <meshStandardMaterial color="#fbbf24" />
    </mesh>
    <mesh position={[0, 0.07, 0]}>
      <coneGeometry args={[0.016, 0.032, 8]} />
      <meshStandardMaterial color="#ef4444" emissive="#f97316" emissiveIntensity={2.5} />
    </mesh>
  </group>
);

const StrawberryTopper: React.FC<{ position?: [number, number, number]; scale?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
}) => (
  <group position={position} scale={[scale, scale, scale]}>
    <mesh position={[0, 0.02, 0]}>
      <coneGeometry args={[0.03, 0.06, 8]} />
      <meshStandardMaterial color="#e11d48" roughness={0.25} />
    </mesh>
    <mesh position={[0, 0.048, 0]}>
      <cylinderGeometry args={[0.025, 0.01, 0.006, 6]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  </group>
);

const SprinklesLayer: React.FC<{ radius?: number; y?: number; count?: number }> = ({
  radius = 0.1,
  y = 0.02,
  count = 10,
}) => {
  const colors = ['#ec4899', '#38bdf8', '#facc15', '#a855f7', '#22c55e', '#f97316'];
  const angles = Array.from({ length: count }, (_, i) => (i * Math.PI * 2) / count);
  return (
    <group position={[0, y, 0]}>
      {angles.map((ang, i) => {
        const r = radius * (0.4 + 0.6 * ((i % 3) / 2));
        const x = Math.cos(ang) * r;
        const z = Math.sin(ang) * r;
        return (
          <mesh key={`sp-${i}`} position={[x, 0, z]} rotation={[0.4, ang, 0.2]}>
            <capsuleGeometry args={[0.005, 0.012, 4, 8]} />
            <meshStandardMaterial color={colors[i % colors.length]} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};

// Sub-component to render the specific 3D pastry model
export const Product3DItem: React.FC<{
  productId: ProductId;
  isFinished?: boolean;
  decorations?: string[];
  hasError?: boolean;
}> = ({
  productId,
  isFinished = false,
  decorations = [],
  hasError = false,
}) => {
  // Determinar decoraciones efectivas (si está finished y sin decoraciones explícitas, usar las por defecto)
  const decs = decorations.length > 0
    ? decorations
    : isFinished
    ? (productId === 'donut' ? ['glaze_pink', 'sprinkles']
      : productId === 'cupcake' ? ['waves', 'heart']
      : productId === 'tart' ? ['zigzag', 'strawberry']
      : productId === 'cake' ? ['zigzag', 'flame']
      : [])
    : [];

  const hasGlazePink = decs.includes('glaze_pink');
  const hasWaves = decs.includes('waves');
  const hasZigzag = decs.includes('zigzag');
  const hasBase = hasGlazePink || hasWaves || hasZigzag;

  const hasHeart = decs.includes('heart');
  const hasSmiley = decs.includes('smiley');
  const hasClover = decs.includes('clover');
  const hasFlame = decs.includes('flame');
  const hasSprinkles = decs.includes('sprinkles');
  const hasStrawberry = decs.includes('strawberry');

  const errorColor = hasError ? '#b91c1c' : undefined;

  switch (productId) {
    case 'cookie':
      return (
        <group position={[0, 0.04, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.035, 16]} />
            <meshStandardMaterial color="#d97706" roughness={0.6} />
          </mesh>
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

          {/* Glaseado / Borde Base */}
          {hasBase && (
            <group position={[0, 0.11, 0]}>
              <mesh castShadow>
                <coneGeometry args={[0.08, 0.09, 12]} />
                <meshStandardMaterial
                  color={
                    errorColor ||
                    (hasWaves ? '#38bdf8' : hasZigzag ? '#fbbf24' : '#ec4899')
                  }
                  roughness={0.3}
                />
              </mesh>
            </group>
          )}

          {/* Toppers Superiores */}
          {hasHeart && <HeartTopper position={[0, 0.17, 0]} scale={1.1} />}
          {hasSmiley && <SmileyTopper position={[0, 0.17, 0]} scale={1.1} />}
          {hasClover && <CloverTopper position={[0, 0.16, 0]} scale={1.1} />}
          {hasFlame && <FlameTopper position={[0, 0.14, 0]} scale={1.0} />}
          {hasSprinkles && <SprinklesLayer radius={0.06} y={0.14} count={8} />}
          {hasStrawberry && <StrawberryTopper position={[0, 0.15, 0]} scale={1.0} />}
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

          {/* Glaseado Base */}
          {hasBase && (
            <mesh position={[0, 0, 0.02]}>
              <torusGeometry args={[0.11, 0.045, 10, 20, Math.PI * 1.85]} />
              <meshStandardMaterial
                color={
                  errorColor ||
                  (hasWaves ? '#38bdf8' : hasZigzag ? '#fbbf24' : '#f472b6')
                }
                roughness={0.2}
              />
            </mesh>
          )}

          {/* Toppers sobre la donut */}
          {hasSprinkles && <SprinklesLayer radius={0.11} y={0.04} count={12} />}
          {hasHeart && <HeartTopper position={[0, 0.07, 0.04]} scale={0.9} />}
          {hasSmiley && <SmileyTopper position={[0, 0.07, 0.04]} scale={0.9} />}
          {hasClover && <CloverTopper position={[0, 0.07, 0.04]} scale={0.9} />}
          {hasFlame && <FlameTopper position={[0, 0.06, 0.04]} scale={0.9} />}
          {hasStrawberry && <StrawberryTopper position={[0, 0.07, 0.04]} scale={0.9} />}
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

          {/* Borde / Glaseado de Tarta */}
          {hasBase && (
            <mesh position={[0, 0.038, 0]}>
              <torusGeometry args={[0.12, 0.018, 8, 20]} />
              <meshStandardMaterial
                color={
                  errorColor ||
                  (hasWaves ? '#38bdf8' : hasZigzag ? '#fbbf24' : '#f472b6')
                }
                roughness={0.3}
              />
            </mesh>
          )}

          {/* Toppers de Tarta */}
          {hasStrawberry && (
            <group position={[0, 0.045, 0]}>
              {[-0.05, 0.05].map(x =>
                [-0.05, 0.05].map(z => (
                  <StrawberryTopper key={`tart-b-${x}-${z}`} position={[x, 0, z]} scale={0.8} />
                ))
              )}
              {/* Cream center swirl */}
              <mesh position={[0, 0.015, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
            </group>
          )}
          {hasHeart && <HeartTopper position={[0, 0.06, 0]} scale={1.2} />}
          {hasSmiley && <SmileyTopper position={[0, 0.06, 0]} scale={1.2} />}
          {hasClover && <CloverTopper position={[0, 0.05, 0]} scale={1.2} />}
          {hasFlame && <FlameTopper position={[0, 0.04, 0]} scale={1.0} />}
          {hasSprinkles && <SprinklesLayer radius={0.1} y={0.04} count={10} />}
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

          {/* Glaseado / Icing Base */}
          {hasBase && (
            <group position={[0, 0.045, 0]}>
              <mesh>
                <cylinderGeometry args={[0.165, 0.165, 0.02, 16]} />
                <meshStandardMaterial
                  color={
                    errorColor ||
                    (hasWaves ? '#38bdf8' : hasZigzag ? '#fbbf24' : '#a855f7')
                  }
                  roughness={0.2}
                />
              </mesh>
            </group>
          )}

          {/* Toppers de Torta */}
          {hasFlame && <FlameTopper position={[0, 0.05, 0]} scale={1.1} />}
          {hasHeart && <HeartTopper position={[0, 0.08, 0]} scale={1.2} />}
          {hasSmiley && <SmileyTopper position={[0, 0.08, 0]} scale={1.2} />}
          {hasClover && <CloverTopper position={[0, 0.07, 0]} scale={1.2} />}
          {hasSprinkles && <SprinklesLayer radius={0.12} y={0.06} count={12} />}
          {hasStrawberry && <StrawberryTopper position={[0, 0.07, 0]} scale={1.1} />}
        </group>
      );

    case 'pastry':
      return (
        <group position={[0, 0.04, 0]} rotation={[0, 0.3, 0]}>
          <mesh castShadow>
            <torusGeometry args={[0.1, 0.045, 8, 14, Math.PI * 1.3]} />
            <meshStandardMaterial color="#d97706" roughness={0.4} />
          </mesh>
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
