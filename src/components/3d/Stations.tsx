import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, PointLight } from 'three';
import { RoundedBox } from '@react-three/drei';
import { OvenState } from '@/types/game';
import {
  Flour3D,
  Egg3D,
  Milk3D,
  Sugar3D,
  Chocolate3D,
  Strawberry3D,
} from './Ingredient3D';

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
    // Rotar batidor cuando la batidora está en marcha
    if (mixerPaddleRef.current && isMixerActive) {
      mixerPaddleRef.current.rotation.y += delta * 18;
    }
    // Pulsación de la luz interior del horno
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
      {/* 1. ZONA DE INGREDIENTES (Mesada Curva Izquierda: X = -5.5, Z = -3) */}
      {/* ============================================================== */}
      <group position={[-5.5, 0, -3]}>
        {/* Cuerpo de la mesada con cantos redondeados */}
        <RoundedBox
          args={[1.6, 0.96, 4.4]}
          radius={0.06}
          smoothness={4}
          position={[0, 0.48, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#fffbf5" roughness={0.4} />
        </RoundedBox>

        {/* Paneles decorativos frontales estilo Boiserie */}
        {[-1.5, -0.5, 0.5, 1.5].map((pz, idx) => (
          <group key={`c-panel-${idx}`} position={[0.79, 0.48, pz]}>
            <RoundedBox args={[0.04, 0.68, 0.72]} radius={0.03} smoothness={3}>
              <meshStandardMaterial color="#fce7f3" roughness={0.5} />
            </RoundedBox>
            <mesh position={[0.025, 0, 0]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Patas curvas torneadas en las esquinas */}
        {[
          [-0.7, -2.1],
          [-0.7, 2.1],
          [0.7, -2.1],
          [0.7, 2.1],
        ].map(([lx, lz], lidx) => (
          <group key={`leg-${lidx}`} position={[lx, 0.25, lz]}>
            <mesh>
              <cylinderGeometry args={[0.07, 0.05, 0.5, 12]} />
              <meshStandardMaterial color="#f472b6" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Encimera voladiza con cantos biselados redondeados */}
        <RoundedBox
          args={[1.76, 0.09, 4.56]}
          radius={0.04}
          smoothness={4}
          position={[0, 1.01, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#f472b6" roughness={0.3} />
        </RoundedBox>
        {/* Moldura inferior de encimera */}
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[1.7, 0.03, 4.5]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Estante superior flotante con ménsulas curvas */}
        <group position={[0, 2.2, 0]}>
          <RoundedBox args={[0.85, 0.08, 4.3]} radius={0.03} smoothness={3} receiveShadow>
            <meshStandardMaterial color="#854d0e" roughness={0.5} />
          </RoundedBox>
          {/* Ménsulas arqueadas de hierro forjado/madera */}
          {[-1.6, 0, 1.6].map((mz, midx) => (
            <group key={`bracket-${midx}`} position={[-0.3, -0.2, mz]}>
              <mesh rotation={[0, 0, Math.PI / 4]}>
                <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
                <meshStandardMaterial color="#ca8a04" metalness={0.7} />
              </mesh>
            </group>
          ))}
        </group>

        {/* 1.1 HARINA (Saco rústico de papel kraft con cuerda, nudo, harina asomando y sello) */}
        <group position={[0.2, 1.05, -1.5]} name="flour">
          {/* Saco principal */}
          <group position={[0, 0.18, 0]} scale={[2.3, 2.3, 2.3]}>
            <Flour3D isFocused={focusedObject === 'flour'} />
          </group>
          {/* Saquito acompañante más pequeño al lado */}
          <group position={[-0.14, 0.14, 0.22]} rotation={[0, 0.4, 0]} scale={[1.7, 1.7, 1.7]}>
            <Flour3D isFocused={focusedObject === 'flour'} />
          </group>
          {/* Polvillo de harina esparcido suave en la mesada */}
          <mesh position={[-0.05, 0.01, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.28, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.95} transparent opacity={0.45} />
          </mesh>
          {/* Hit box para interacción cómoda y precisa */}
          <mesh visible={false} position={[0, 0.25, 0]}>
            <boxGeometry args={[0.55, 0.55, 0.65]} />
            <meshBasicMaterial />
          </mesh>
        </group>

        {/* 1.2 HUEVO (Huevera artesanal con huevos de cáscara suave, brillo y forma ovalada real) */}
        <group position={[0.2, 1.05, -0.7]} name="egg">
          {/* Bandeja huevera de cartón moldeado */}
          <RoundedBox
            args={[0.48, 0.09, 0.36]}
            radius={0.03}
            smoothness={3}
            position={[0, 0.05, 0]}
            castShadow
          >
            <meshStandardMaterial
              color={focusedObject === 'egg' ? '#fef08a' : '#f59e0b'}
              roughness={0.7}
            />
          </RoundedBox>
          {/* Tapa abierta inclinada hacia atrás */}
          <mesh position={[-0.05, 0.18, -0.18]} rotation={[-0.45, 0, 0]}>
            <boxGeometry args={[0.46, 0.16, 0.02]} />
            <meshStandardMaterial color="#d97706" roughness={0.7} />
          </mesh>
          {/* Huevos individuales con forma orgánica en 2x3 */}
          {[-0.13, 0, 0.13].map((z, zi) =>
            [-0.12, 0.12].map((x, xi) => (
              <group
                key={`egg-shelf-${xi}-${zi}`}
                position={[x, 0.07, z]}
                rotation={[0.08 * (xi === 0 ? -1 : 1), (xi + zi) * 0.3, 0.06 * (zi - 1)]}
                scale={[1.75, 1.75, 1.75]}
              >
                <Egg3D isFocused={focusedObject === 'egg'} />
              </group>
            ))
          )}
          {/* Hit box para interacción cómoda */}
          <mesh visible={false} position={[0, 0.18, 0]}>
            <boxGeometry args={[0.55, 0.45, 0.45]} />
            <meshBasicMaterial />
          </mesh>
        </group>

        {/* 1.3 LECHE (Botellas lecheras vintage con cuello esbelto, tapa celeste y etiqueta) */}
        <group position={[0.2, 1.05, 0.1]} name="milk">
          {/* Base / posavasos rústico de madera */}
          <RoundedBox args={[0.38, 0.03, 0.38]} radius={0.02} smoothness={2} position={[0, 0.02, 0]}>
            <meshStandardMaterial color="#78350f" roughness={0.6} />
          </RoundedBox>
          {/* Botella principal */}
          <group position={[0.04, 0.03, -0.06]} scale={[2.3, 2.3, 2.3]}>
            <Milk3D isFocused={focusedObject === 'milk'} />
          </group>
          {/* Segunda botella compañera */}
          <group position={[-0.08, 0.03, 0.08]} rotation={[0, 0.8, 0]} scale={[2.1, 2.1, 2.1]}>
            <Milk3D isFocused={focusedObject === 'milk'} />
          </group>
          {/* Hit box para interacción cómoda */}
          <mesh visible={false} position={[0, 0.28, 0]}>
            <boxGeometry args={[0.5, 0.65, 0.5]} />
            <meshBasicMaterial />
          </mesh>
        </group>

        {/* 1.4 AZÚCAR (Frasco de vidrio con azúcar cristalina, destellos, lazo rosa y tapa dorada) */}
        <group position={[0.2, 1.05, 0.8]} name="sugar">
          {/* Frasco principal de azúcar */}
          <group position={[0, 0.03, 0]} scale={[2.3, 2.3, 2.3]}>
            <Sugar3D isFocused={focusedObject === 'sugar'} />
          </group>
          {/* Cuchara pastelera de madera reposando al lado */}
          <group position={[0.16, 0.03, 0.12]} rotation={[0.2, 0.4, -0.3]}>
            <cylinderGeometry args={[0.015, 0.015, 0.32, 8]} />
            <meshStandardMaterial color="#b45309" roughness={0.7} />
          </group>
          {/* Granos de azúcar derramados coquetamente */}
          <mesh position={[0.12, 0.01, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.09, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.6} />
          </mesh>
          {/* Hit box para interacción cómoda */}
          <mesh visible={false} position={[0, 0.25, 0]}>
            <boxGeometry args={[0.5, 0.55, 0.5]} />
            <meshBasicMaterial />
          </mesh>
        </group>

        {/* 1.5 CHOCOLATE (Tabletas con 6 onzas en relieve 3D, envoltorio dorado y estuche rojo) */}
        <group position={[0.2, 1.05, 1.4]} name="chocolate">
          {/* Barra principal abierta exhibiendo las onzas y el dorado */}
          <group position={[0, 0.04, -0.06]} scale={[2.2, 2.2, 2.2]}>
            <Chocolate3D isFocused={focusedObject === 'chocolate'} />
          </group>
          {/* Segunda barra cerrada apilada en diagonal */}
          <group position={[-0.04, 0.02, 0.12]} rotation={[0, -0.3, 0]} scale={[2.0, 2.0, 2.0]}>
            <Chocolate3D isFocused={focusedObject === 'chocolate'} />
          </group>
          {/* Hit box para interacción cómoda */}
          <mesh visible={false} position={[0, 0.15, 0]}>
            <boxGeometry args={[0.55, 0.4, 0.55]} />
            <meshBasicMaterial />
          </mesh>
        </group>

        {/* 1.6 FRUTILLA (Canasta de mimbre con frutillas carnosas, cáliz verde, semillas doradas y tallo) */}
        <group position={[0.2, 2.24, 0]} name="strawberry">
          {/* Canasta de mimbre tejida */}
          <RoundedBox args={[0.46, 0.18, 0.64]} radius={0.04} smoothness={3} position={[0, 0.09, 0]} castShadow>
            <meshStandardMaterial
              color={focusedObject === 'strawberry' ? '#fef08a' : '#b45309'}
              roughness={0.7}
            />
          </RoundedBox>
          {/* Asa arqueada semicircular de mimbre */}
          <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.24, 0.03, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
          {/* Lecho de hojas verdes bajo las frutillas */}
          <mesh position={[0, 0.17, 0]}>
            <boxGeometry args={[0.4, 0.02, 0.58]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
          {/* Pila de frutillas realistas con hojas, tallo y semillitas */}
          {[
            [-0.11, 0.2, -0.18, 0.1, 0.2],
            [0.1, 0.21, -0.17, -0.15, -0.3],
            [-0.09, 0.22, 0, 0.2, 0.1],
            [0.11, 0.21, 0.02, -0.1, 0.4],
            [-0.1, 0.2, 0.18, 0.05, -0.2],
            [0.09, 0.21, 0.19, -0.2, -0.1],
            [0, 0.26, -0.06, 0.1, 0.05],
            [0.01, 0.26, 0.09, -0.08, 0.2],
          ].map(([sx, sy, sz, rx, rz], sidx) => (
            <group
              key={`sb-shelf-${sidx}`}
              position={[sx, sy, sz]}
              rotation={[rx, sidx * 0.7, rz]}
              scale={[1.85, 1.85, 1.85]}
            >
              <Strawberry3D isFocused={focusedObject === 'strawberry'} />
            </group>
          ))}
          {/* Hit box para interacción cómoda en estante superior */}
          <mesh visible={false} position={[0, 0.24, 0]}>
            <boxGeometry args={[0.6, 0.5, 0.7]} />
            <meshBasicMaterial />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 2. MESA DE MEZCLA Y BATIDORA (Back Center-Left: X = -2.2, Z = -5.8) */}
      {/* ============================================================== */}
      <group position={[-2.2, 0, -5.8]} name="mixer">
        {/* Mesa con cantos redondeados */}
        <RoundedBox
          args={[2.0, 0.96, 1.4]}
          radius={0.06}
          smoothness={4}
          position={[0, 0.48, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#fffbf5" roughness={0.4} />
        </RoundedBox>
        {/* Moldura frontal decorativa */}
        <RoundedBox args={[1.7, 0.65, 0.04]} radius={0.03} position={[0, 0.48, 0.69]}>
          <meshStandardMaterial color="#fce7f3" roughness={0.5} />
        </RoundedBox>
        {/* Encimera voladiza */}
        <RoundedBox
          args={[2.14, 0.09, 1.54]}
          radius={0.04}
          smoothness={4}
          position={[0, 1.01, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#f472b6" roughness={0.3} />
        </RoundedBox>

        {/* Batidora Stand Mixer Retro Estilizada (Estilo KitchenAid Vintage) */}
        <group position={[0, 1.06, 0]}>
          {/* Base pesada con esquinas aerodinámicas */}
          <RoundedBox
            args={[0.48, 0.08, 0.72]}
            radius={0.04}
            smoothness={4}
            position={[0, 0.04, 0]}
            castShadow
          >
            <meshStandardMaterial
              color={focusedObject === 'mixer' ? '#fef08a' : '#ec4899'}
              roughness={0.25}
            />
          </RoundedBox>

          {/* Columna curva de soporte posterior */}
          <mesh position={[0, 0.46, -0.22]} castShadow>
            <cylinderGeometry args={[0.13, 0.16, 0.76, 16]} />
            <meshStandardMaterial color="#ec4899" roughness={0.25} />
          </mesh>

          {/* Cabezal superior abombado y curvado */}
          <group position={[0, 0.82, 0.06]}>
            <RoundedBox args={[0.28, 0.24, 0.68]} radius={0.08} smoothness={4} castShadow>
              <meshStandardMaterial color="#ec4899" roughness={0.25} />
            </RoundedBox>
            {/* Perilla cromada de velocidades */}
            <mesh position={[0.15, 0.02, -0.1]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Medallón plateado frontal de la marca */}
            <mesh position={[0, 0.02, 0.35]}>
              <circleGeometry args={[0.07, 16]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>

          {/* Tazón mezclador de acero inoxidable con asa redondeada */}
          <group position={[0, 0.28, 0.15]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.26, 0.18, 0.38, 20]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.18} />
            </mesh>
            {/* Asa curvada tubular */}
            <mesh position={[0.28, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.12, 0.022, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.18} />
            </mesh>

            {/* Masa batiéndose dentro del tazón */}
            {isMixerActive && (
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.23, 0.16, 0.14, 16]} />
                <meshStandardMaterial color="#fed7aa" roughness={0.6} />
              </mesh>
            )}
          </group>

          {/* Batidor de globo con varillas giratorias */}
          <group ref={mixerPaddleRef} position={[0, 0.55, 0.15]}>
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            {/* Varillas curvas de globo */}
            {[0, Math.PI / 3, (Math.PI * 2) / 3].map((rot, idx) => (
              <mesh key={`wire-${idx}`} position={[0, -0.22, 0]} rotation={[0, rot, 0]}>
                <torusGeometry args={[0.09, 0.014, 6, 16]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 3. HORNO PASTELERO VINTAGE (Back Center-Right: X = 2.2, Z = -5.8) */}
      {/* ============================================================== */}
      <group position={[2.2, 0, -5.8]} name="oven">
        {/* Cuerpo principal del horno con cantos redondeados */}
        <RoundedBox
          args={[2.0, 1.84, 1.4]}
          radius={0.09}
          smoothness={4}
          position={[0, 0.98, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={focusedObject === 'oven' ? '#fef08a' : '#fef3c7'}
            roughness={0.35}
          />
        </RoundedBox>

        {/* Cúpula / Techo abovedado vintage del horno */}
        <mesh position={[0, 1.95, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 2.0, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.25} />
        </mesh>

        {/* 4 Patas ornamentales curvas de bronce en las esquinas */}
        {[
          [-0.88, -0.58],
          [-0.88, 0.58],
          [0.88, -0.58],
          [0.88, 0.58],
        ].map(([ox, oz], oidx) => (
          <group key={`oven-foot-${oidx}`} position={[ox, 0.08, oz]}>
            <mesh scale={[1, 0.8, 1]}>
              <sphereGeometry args={[0.1, 10, 10]} />
              <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Puerta frontal con marco de bronce redondeado */}
        <RoundedBox
          args={[1.64, 1.18, 0.08]}
          radius={0.06}
          smoothness={3}
          position={[0, 0.92, 0.72]}
        >
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </RoundedBox>

        {/* Ventana de cristal redondeada / ovalada con marco dorado */}
        <RoundedBox
          args={[1.28, 0.78, 0.06]}
          radius={0.08}
          smoothness={4}
          position={[0, 0.92, 0.75]}
        >
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
            opacity={ovenState.isCooking ? 0.75 : 0.9}
          />
        </RoundedBox>

        {/* Manija ergonómica arqueada de latón pulido */}
        <group position={[0, 1.38, 0.82]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.9, 12]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Soportes de la manija */}
          {[-0.4, 0.4].map((hx, hidx) => (
            <mesh key={`hsupp-${hidx}`} position={[hx, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
              <meshStandardMaterial color="#ca8a04" metalness={0.9} />
            </mesh>
          ))}
        </group>

        {/* 3 Perillas circulares de termostato con agujas indicadoras */}
        {[-0.5, 0, 0.5].map((kx, kidx) => (
          <group key={`knob-${kidx}`} position={[kx, 1.68, 0.74]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.075, 0.085, 0.05, 16]} />
              <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Puntero indicador */}
            <mesh position={[0, 0.04, 0.03]}>
              <boxGeometry args={[0.015, 0.05, 0.01]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Postre horneándose en la rejilla interna */}
        {ovenState.isCooking && (
          <group position={[0, 0.76, 0.45]}>
            <RoundedBox args={[1.1, 0.02, 0.6]} radius={0.01} smoothness={2}>
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </RoundedBox>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.1, 16]} />
              <meshStandardMaterial
                color={
                  ovenState.isBurnt
                    ? '#1c1917'
                    : ovenState.isReady
                    ? '#d97706'
                    : '#fed7aa'
                }
                roughness={0.5}
              />
            </mesh>
          </group>
        )}

        {/* Luz cálida interna */}
        <pointLight
          ref={ovenGlowRef}
          position={[0, 0.9, 0.5]}
          intensity={ovenState.isCooking ? 1.8 : 0}
          distance={4}
          color="#f97316"
        />

        {/* Indicador de progreso 3D redondeado flotante */}
        {ovenState.isCooking && (
          <group position={[0, 2.25, 0]}>
            <RoundedBox args={[1.24, 0.18, 0.06]} radius={0.08} smoothness={3}>
              <meshStandardMaterial color="#1e293b" />
            </RoundedBox>
            <RoundedBox
              args={[
                Math.max(0.04, (ovenState.isReady ? 1 : ovenState.progress) * 1.16),
                0.12,
                0.07,
              ]}
              radius={0.05}
              smoothness={3}
              position={[
                -0.58 + (ovenState.isReady ? 1 : ovenState.progress) * 0.58,
                0,
                0.01,
              ]}
            >
              <meshStandardMaterial
                color={
                  ovenState.isBurnt
                    ? '#ef4444'
                    : ovenState.isReady
                    ? '#22c55e'
                    : '#f59e0b'
                }
                emissive={
                  ovenState.isBurnt
                    ? '#ef4444'
                    : ovenState.isReady
                    ? '#22c55e'
                    : '#f59e0b'
                }
                emissiveIntensity={0.6}
              />
            </RoundedBox>
          </group>
        )}
      </group>

      {/* ============================================================== */}
      {/* 4. ZONA DE DECORACIÓN (Mesada Derecha: X = 5.5, Z = -3)         */}
      {/* ============================================================== */}
      <group position={[5.5, 0, -3]} name="decorating">
        <RoundedBox
          args={[1.6, 0.96, 4.0]}
          radius={0.06}
          smoothness={4}
          position={[0, 0.48, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#fffbf5" roughness={0.4} />
        </RoundedBox>
        {/* Encimera voladiza con cantos curvos */}
        <RoundedBox
          args={[1.74, 0.09, 4.14]}
          radius={0.04}
          smoothness={4}
          position={[0, 1.01, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#f472b6" roughness={0.3} />
        </RoundedBox>

        {/* Plato giratorio para tortas / Turntable en el centro */}
        <group position={[0, 1.06, 0]}>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.2, 0.24, 0.06, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.04, 24]} />
            <meshStandardMaterial
              color={focusedObject === 'decorating' ? '#fef08a' : '#ffffff'}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Mangas pasteleras con forma cónica curvada y boquillas de estrella */}
        {[-1.1, -0.5, 0.6, 1.2].map((pz, idx) => {
          const bagColors = ['#ec4899', '#38bdf8', '#fbbf24', '#a855f7'];
          return (
            <group key={`bag-${idx}`} position={[-0.2, 1.18, pz]} rotation={[0.35, 0, 0.25]}>
              <mesh castShadow scale={[1, 1.2, 1]}>
                <coneGeometry args={[0.13, 0.42, 16]} />
                <meshStandardMaterial
                  color={focusedObject === 'decorating' ? '#fef08a' : bagColors[idx]}
                  roughness={0.4}
                />
              </mesh>
              {/* Boquilla rizada de acero inoxidable */}
              <mesh position={[0, -0.23, 0]}>
                <coneGeometry args={[0.045, 0.09, 10]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
              </mesh>
            </group>
          );
        })}

        {/* Cuencos esféricos de chispas y confites de colores */}
        {[-0.8, 0.8].map((bz, bidx) => {
          const names = ['dec_sprinkles', 'dec_strawberries'];
          const objName = names[bidx];
          return (
            <group key={`tbowl-${bidx}`} position={[0.32, 1.12, bz]} name={objName}>
              <mesh>
                <sphereGeometry args={[0.16, 14, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
                <meshStandardMaterial color={focusedObject === objName ? '#fef08a' : '#fdf2f8'} roughness={0.2} />
              </mesh>
              {/* Sprinkles de colores o frutillas en el interior */}
              {bidx === 0 ? (
                <mesh position={[0, -0.02, 0]}>
                  <cylinderGeometry args={[0.14, 0.1, 0.05, 14]} />
                  <meshStandardMaterial color="#ec4899" roughness={0.5} />
                </mesh>
              ) : (
                <group position={[0, -0.01, 0]} scale={[1.2, 1.2, 1.2]}>
                  <Strawberry3D isFocused={focusedObject === objName} />
                </group>
              )}
            </group>
          );
        })}
      </group>

      {/* ============================================================== */}
      {/* 5. TACHO DE BASURA RETRO (X = 5.5, Z = 1.5)                     */}
      {/* ============================================================== */}
      <group position={[5.5, 0, 1.5]} name="trash">
        {/* Cuerpo cilíndrico redondeado con acanalado */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.27, 0.9, 16]} />
          <meshStandardMaterial
            color={focusedObject === 'trash' ? '#fef08a' : '#34d399'}
            roughness={0.4}
          />
        </mesh>
        {/* Tapa abombada semiesférica */}
        <mesh position={[0, 0.93, 0]}>
          <sphereGeometry args={[0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#059669" roughness={0.3} />
        </mesh>
        {/* Asa de la tapa */}
        <mesh position={[0, 1.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.06, 0.015, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.9} />
        </mesh>
        {/* Pedal curvado cromado */}
        <mesh position={[-0.28, 0.06, 0]}>
          <boxGeometry args={[0.16, 0.04, 0.12]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 6. MOSTRADOR DE ATENCIÓN BOUTIQUE (Front Counter: X = 0, Z = 4.0) */}
      {/* ============================================================== */}
      <group position={[0, 0, 4.0]} name="counter">
        {/* Cuerpo de madera con cantos redondeados */}
        <RoundedBox
          args={[7.0, 1.08, 1.4]}
          radius={0.08}
          smoothness={4}
          position={[0, 0.54, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#451a03" roughness={0.55} />
        </RoundedBox>

        {/* Paneles decorativos de boiserie con marcos curvados en el frente */}
        {[-2.5, -1.25, 0, 1.25, 2.5].map((bx, bidx) => (
          <group key={`f-panel-${bidx}`} position={[bx, 0.54, 0.71]}>
            <RoundedBox args={[0.9, 0.75, 0.03]} radius={0.04} smoothness={3}>
              <meshStandardMaterial color="#78350f" roughness={0.6} />
            </RoundedBox>
            {/* Ribete interior pastel */}
            <RoundedBox args={[0.78, 0.63, 0.04]} radius={0.03} smoothness={3} position={[0, 0, 0.01]}>
              <meshStandardMaterial color="#fbcfe8" roughness={0.4} />
            </RoundedBox>
          </group>
        ))}

        {/* Encimera de mármol crema con cantos redondeados y voladizo */}
        <RoundedBox
          args={[7.25, 0.09, 1.55]}
          radius={0.05}
          smoothness={4}
          position={[0, 1.12, 0]}
          receiveShadow
        >
          <meshStandardMaterial
            color={focusedObject === 'counter' ? '#fef08a' : '#fffbeb'}
            roughness={0.2}
          />
        </RoundedBox>

        {/* Campana clásica de recepción de bronce brillante */}
        <group position={[-1.8, 1.21, 0]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.18, 0.04, 16]} />
            <meshStandardMaterial color="#78350f" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.11, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.21, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#fef08a" metalness={0.9} />
          </mesh>
        </group>

        {/* Vitrina de exhibición con cubierta de cristal curvado */}
        <group position={[2.0, 1.48, 0]}>
          {/* Base de la vitrina */}
          <RoundedBox args={[2.5, 0.04, 1.0]} radius={0.02} position={[0, -0.3, 0]}>
            <meshStandardMaterial color="#e2e8f0" metalness={0.6} />
          </RoundedBox>
          {/* Cúpula de cristal curvado */}
          <RoundedBox args={[2.46, 0.6, 0.96]} radius={0.08} smoothness={4}>
            <meshStandardMaterial
              color="#bae6fd"
              transparent
              opacity={0.32}
              roughness={0.08}
            />
          </RoundedBox>
          {/* Muestra de postres exhibidos en platitos circulares */}
          {[-0.8, 0, 0.8].map((dx, didx) => (
            <group key={`disp-${didx}`} position={[dx, -0.15, 0]}>
              <mesh position={[0, -0.06, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.02, 16]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
              </mesh>
              <mesh scale={[1, 1.2, 1]}>
                <cylinderGeometry args={[0.11, 0.13, 0.1, 14]} />
                <meshStandardMaterial
                  color={didx === 0 ? '#f472b6' : didx === 1 ? '#a855f7' : '#38bdf8'}
                  roughness={0.4}
                />
              </mesh>
              {/* Cereza o confite superior */}
              <mesh position={[0, 0.08, 0]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial color="#ef4444" roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
};
