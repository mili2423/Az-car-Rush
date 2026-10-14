'use client';

import React from 'react';
import { IngredientId } from '@/types/game';
import { RoundedBox } from '@react-three/drei';

interface Ingredient3DProps {
  id: IngredientId;
  scale?: number;
  isFocused?: boolean;
}

// ─── 1. HARINA: Bolsita rústica con cuerda, etiqueta y polvo blanco asomando ────
export const Flour3D: React.FC<{ isFocused?: boolean }> = ({ isFocused = false }) => (
  <group>
    {/* Cuerpo principal abombado de la bolsa de papel kraft */}
    <RoundedBox args={[0.14, 0.16, 0.12]} radius={0.025} smoothness={3} castShadow>
      <meshStandardMaterial
        color={isFocused ? '#fef08a' : '#edd8ba'}
        roughness={0.85}
      />
    </RoundedBox>

    {/* Cuello doblado de la bolsa */}
    <mesh position={[0, 0.085, 0]} castShadow>
      <cylinderGeometry args={[0.065, 0.07, 0.03, 14]} />
      <meshStandardMaterial color={isFocused ? '#fef08a' : '#d8b894'} roughness={0.9} />
    </mesh>

    {/* Cuerda / hilo de cáñamo atado */}
    <mesh position={[0, 0.075, 0]}>
      <torusGeometry args={[0.068, 0.007, 6, 16]} />
      <meshStandardMaterial color="#854d0e" roughness={0.9} />
    </mesh>

    {/* Nudo de la cuerda */}
    <mesh position={[0.065, 0.075, 0.02]}>
      <sphereGeometry args={[0.012, 6, 6]} />
      <meshStandardMaterial color="#78350f" roughness={0.9} />
    </mesh>

    {/* Polvo blanco de harina fina asomando en la boca */}
    <mesh position={[0, 0.098, 0]}>
      <sphereGeometry args={[0.045, 12, 10]} />
      <meshStandardMaterial color="#ffffff" roughness={0.95} />
    </mesh>
    <mesh position={[0.02, 0.102, -0.01]}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshStandardMaterial color="#ffffff" roughness={0.95} />
    </mesh>

    {/* Sello / Etiqueta de trigo pastelero en el frente */}
    <mesh position={[0, -0.01, 0.062]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.035, 0.035, 0.005, 16]} />
      <meshStandardMaterial color="#ec4899" roughness={0.4} />
    </mesh>
  </group>
);

// ─── 2. HUEVO: Forma ovalada real con brillo de cáscara suave y nidito ─────────
export const Egg3D: React.FC<{ isFocused?: boolean }> = ({ isFocused = false }) => (
  <group>
    {/* Base cóncava / huevera individual */}
    <mesh position={[0, -0.02, 0]}>
      <cylinderGeometry args={[0.048, 0.036, 0.025, 16]} />
      <meshStandardMaterial color="#fed7aa" roughness={0.7} />
    </mesh>

    {/* Huevo con forma ovalada natural (más ancho en la base, afinado arriba) */}
    <group position={[0, 0.025, 0]} rotation={[0.1, 0, 0.08]}>
      {/* Cuerpo inferior esférico */}
      <mesh castShadow scale={[1, 1.3, 1]}>
        <sphereGeometry args={[0.048, 18, 18]} />
        <meshStandardMaterial
          color={isFocused ? '#fef08a' : '#fcd9b8'}
          roughness={0.32}
          metalness={0.06}
        />
      </mesh>
      {/* Punta superior afinada suave */}
      <mesh position={[0, 0.024, 0]} scale={[0.88, 1.25, 0.88]}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshStandardMaterial
          color={isFocused ? '#fef08a' : '#fce4cb'}
          roughness={0.32}
          metalness={0.06}
        />
      </mesh>
    </group>
  </group>
);

// ─── 3. LECHE: Botella lechera vintage con tapa celeste y etiqueta ────────────
export const Milk3D: React.FC<{ isFocused?: boolean }> = ({ isFocused = false }) => (
  <group>
    {/* Cuerpo de botella de vidrio lechero */}
    <mesh position={[0, 0.05, 0]} castShadow>
      <cylinderGeometry args={[0.045, 0.052, 0.14, 18]} />
      <meshStandardMaterial
        color={isFocused ? '#fef08a' : '#f8fafc'}
        roughness={0.2}
      />
    </mesh>

    {/* Hombro curvado de la botella */}
    <mesh position={[0, 0.125, 0]} scale={[1, 0.65, 1]} castShadow>
      <sphereGeometry args={[0.044, 16, 14]} />
      <meshStandardMaterial color="#ffffff" roughness={0.2} />
    </mesh>

    {/* Cuello cilíndrico */}
    <mesh position={[0, 0.155, 0]}>
      <cylinderGeometry args={[0.024, 0.024, 0.04, 14]} />
      <meshStandardMaterial color="#ffffff" roughness={0.2} />
    </mesh>

    {/* Tapa rosca celeste pastel */}
    <mesh position={[0, 0.18, 0]}>
      <cylinderGeometry args={[0.028, 0.028, 0.015, 14]} />
      <meshStandardMaterial color="#38bdf8" roughness={0.3} />
    </mesh>

    {/* Etiqueta celeste con gota de leche en el frente */}
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.046, 0.053, 0.06, 18]} />
      <meshStandardMaterial color="#bae6fd" roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.05, 0.05]}>
      <circleGeometry args={[0.018, 12]} />
      <meshStandardMaterial color="#0284c7" />
    </mesh>
  </group>
);

// ─── 4. AZÚCAR: Frasco de vidrio con cristales brillantes y tapa pastel ───────
export const Sugar3D: React.FC<{ isFocused?: boolean }> = ({ isFocused = false }) => (
  <group>
    {/* Frasco de vidrio translúcido */}
    <mesh position={[0, 0.05, 0]} castShadow>
      <cylinderGeometry args={[0.055, 0.055, 0.11, 16]} />
      <meshStandardMaterial
        color={isFocused ? '#fef08a' : '#ffffff'}
        roughness={0.15}
        transparent
        opacity={0.7}
      />
    </mesh>

    {/* Montículo de azúcar cristalina dentro */}
    <mesh position={[0, 0.04, 0]}>
      <cylinderGeometry args={[0.048, 0.048, 0.08, 14]} />
      <meshStandardMaterial color="#fff1f5" roughness={0.6} />
    </mesh>

    {/* Cristales de azúcar con destellos */}
    {[-0.025, 0.025].map(x =>
      [-0.025, 0.025].map(z => (
        <mesh key={`sug-${x}-${z}`} position={[x, 0.082, z]}>
          <dodecahedronGeometry args={[0.008, 0]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} roughness={0.2} />
        </mesh>
      ))
    )}

    {/* Tapa rosca dorada acanalada */}
    <mesh position={[0, 0.11, 0]}>
      <cylinderGeometry args={[0.058, 0.058, 0.018, 18]} />
      <meshStandardMaterial color="#f59e0b" metalness={0.75} roughness={0.25} />
    </mesh>

    {/* Cinta / lazo rosa alrededor del frasco */}
    <mesh position={[0, 0.098, 0]}>
      <torusGeometry args={[0.056, 0.006, 6, 18]} />
      <meshStandardMaterial color="#f472b6" roughness={0.4} />
    </mesh>
  </group>
);

// ─── 5. CHOCOLATE: Barra con cuadraditos marcados y envoltorio dorado ─────────
export const Chocolate3D: React.FC<{ isFocused?: boolean }> = ({ isFocused = false }) => (
  <group rotation={[0, 0.35, 0]}>
    {/* Tableta base de chocolate amargo con esquinas redondeadas */}
    <RoundedBox args={[0.13, 0.024, 0.18]} radius={0.008} smoothness={3} castShadow>
      <meshStandardMaterial
        color={isFocused ? '#fef08a' : '#3e1a07'}
        roughness={0.35}
      />
    </RoundedBox>

    {/* 6 Cuadraditos / onzas en relieve 3D (2 columnas x 3 filas) */}
    {[-0.035, 0.035].map(ox =>
      [-0.05, 0, 0.05].map(oz => (
        <RoundedBox
          key={`bar-${ox}-${oz}`}
          args={[0.052, 0.008, 0.04]}
          radius={0.004}
          smoothness={2}
          position={[ox, 0.014, oz]}
        >
          <meshStandardMaterial color="#351405" roughness={0.3} />
        </RoundedBox>
      ))
    )}

    {/* Papel foil dorado doblado a medio abrir */}
    <mesh position={[0, 0.004, 0.04]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.136, 0.028, 0.11]} />
      <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
    </mesh>

    {/* Envoltorio exterior rojo clásico */}
    <mesh position={[0, 0.006, 0.06]}>
      <boxGeometry args={[0.138, 0.03, 0.07]} />
      <meshStandardMaterial color="#b91c1c" roughness={0.5} />
    </mesh>
  </group>
);

// ─── 6. FRUTILLA: Forma carnosa, semillitas doradas y corona de hojitas ───────
export const Strawberry3D: React.FC<{ isFocused?: boolean }> = ({ isFocused = false }) => (
  <group>
    {/* Cuerpo de la frutilla con conicidad natural */}
    <group position={[0, 0.04, 0]} rotation={[0.05, 0, -0.05]}>
      <mesh castShadow scale={[1, 1.25, 1]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={isFocused ? '#fef08a' : '#e11d48'}
          roughness={0.28}
        />
      </mesh>
      {/* Punta cónica inferior */}
      <mesh position={[0, -0.035, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.038, 0.05, 14]} />
        <meshStandardMaterial
          color={isFocused ? '#fef08a' : '#be123c'}
          roughness={0.28}
        />
      </mesh>

      {/* Semillitas amarillas incrustadas */}
      {[
        [-0.035, 0.01, 0.02],
        [0.035, 0.01, 0.02],
        [0, 0.01, 0.04],
        [-0.02, -0.02, 0.03],
        [0.02, -0.02, 0.03],
        [0, -0.04, 0.02],
        [-0.03, 0.01, -0.02],
        [0.03, 0.01, -0.02],
      ].map(([sx, sy, sz], idx) => (
        <mesh key={`seed-${idx}`} position={[sx, sy, sz]}>
          <sphereGeometry args={[0.0035, 5, 5]} />
          <meshStandardMaterial color="#fef08a" roughness={0.4} />
        </mesh>
      ))}

      {/* Cáliz / Corona de hojitas verdes */}
      <mesh position={[0, 0.055, 0]}>
        <cylinderGeometry args={[0.042, 0.01, 0.006, 5]} />
        <meshStandardMaterial color="#16a34a" roughness={0.4} />
      </mesh>

      {/* Cabito / Tallo verde curvado */}
      <mesh position={[0, 0.07, 0]} rotation={[0.2, 0, 0.2]}>
        <cylinderGeometry args={[0.004, 0.004, 0.025, 6]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
    </group>
  </group>
);

// ─── COMPONENTE GENERAL DISPATCHER ────────────────────────────────────────────
export const Ingredient3DItem: React.FC<Ingredient3DProps> = ({
  id,
  scale = 1,
  isFocused = false,
}) => {
  return (
    <group scale={[scale, scale, scale]}>
      {id === 'flour' && <Flour3D isFocused={isFocused} />}
      {id === 'egg' && <Egg3D isFocused={isFocused} />}
      {id === 'milk' && <Milk3D isFocused={isFocused} />}
      {id === 'sugar' && <Sugar3D isFocused={isFocused} />}
      {id === 'chocolate' && <Chocolate3D isFocused={isFocused} />}
      {id === 'strawberry' && <Strawberry3D isFocused={isFocused} />}
    </group>
  );
};
