import React from 'react';

export const BakeryRoom: React.FC = () => {
  return (
    <group>
      {/* Floor - 12x12 meters */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Decorative Floor Checker Tiles Effect */}
      {Array.from({ length: 7 }).map((_, i) =>
        Array.from({ length: 7 }).map((_, j) => {
          const isAlternate = (i + j) % 2 === 0;
          if (!isAlternate) return null;
          return (
            <mesh
              key={`tile-${i}-${j}`}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[-6 + i * 2, 0.005, -6 + j * 2]}
              receiveShadow
            >
              <planeGeometry args={[1.9, 1.9]} />
              <meshStandardMaterial color="#fdf4f5" roughness={0.2} />
            </mesh>
          );
        })
      )}

      {/* Back Wall (Z = -7) */}
      <mesh position={[0, 3, -7]} receiveShadow>
        <boxGeometry args={[14, 6, 0.2]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.8} />
      </mesh>
      {/* Wainscoting panel on back wall */}
      <mesh position={[0, 1.2, -6.85]}>
        <boxGeometry args={[14, 2.4, 0.1]} />
        <meshStandardMaterial color="#fbcfe8" roughness={0.6} />
      </mesh>
      {/* Wooden molding strip */}
      <mesh position={[0, 2.45, -6.8]}>
        <boxGeometry args={[14, 0.1, 0.15]} />
        <meshStandardMaterial color="#f472b6" roughness={0.5} />
      </mesh>

      {/* Left Wall (X = -7) */}
      <mesh position={[-7, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14, 6, 0.2]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.8} />
      </mesh>
      <mesh position={[-6.85, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[14, 2.4, 0.1]} />
        <meshStandardMaterial color="#fbcfe8" roughness={0.6} />
      </mesh>

      {/* Right Wall (X = 7) */}
      <mesh position={[7, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14, 6, 0.2]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.8} />
      </mesh>
      <mesh position={[6.85, 1.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[14, 2.4, 0.1]} />
        <meshStandardMaterial color="#fbcfe8" roughness={0.6} />
      </mesh>

      {/* Front Wall (Z = 7) with large window & glass */}
      <mesh position={[-4.5, 3, 7]}>
        <boxGeometry args={[5, 6, 0.2]} />
        <meshStandardMaterial color="#fffbeb" />
      </mesh>
      <mesh position={[4.5, 3, 7]}>
        <boxGeometry args={[5, 6, 0.2]} />
        <meshStandardMaterial color="#fffbeb" />
      </mesh>
      {/* Upper header above window */}
      <mesh position={[0, 5, 7]}>
        <boxGeometry args={[4, 2, 0.2]} />
        <meshStandardMaterial color="#f472b6" />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.9} />
      </mesh>

      {/* Ceiling Wooden Beams */}
      {[-4, 0, 4].map(x => (
        <mesh key={`beam-${x}`} position={[x, 5.8, 0]}>
          <boxGeometry args={[0.3, 0.4, 14]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
      ))}

      {/* Decorative Wall Posters / Signs */}
      {/* Logo Sign on Back Wall */}
      <group position={[0, 4.2, -6.85]}>
        <mesh>
          <boxGeometry args={[3.2, 1.2, 0.08]} />
          <meshStandardMaterial color="#ec4899" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[3.0, 1.0, 0.02]} />
          <meshStandardMaterial color="#fdf2f8" roughness={0.3} />
        </mesh>
      </group>

      {/* Left Wall Poster */}
      <group position={[-6.85, 3.8, -2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 2, 0.05]} />
          <meshStandardMaterial color="#f43f5e" />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[1.3, 1.8, 0.02]} />
          <meshStandardMaterial color="#fff1f2" />
        </mesh>
      </group>

      {/* Right Wall Shelf with Jars */}
      <group position={[6.7, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[4, 0.1, 0.4]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        {/* Colorful decorative jars */}
        {[-1.4, -0.7, 0, 0.7, 1.4].map((pos, idx) => {
          const jarColors = ['#f43f5e', '#ec4899', '#38bdf8', '#fbbf24', '#34d399'];
          return (
            <mesh key={`jar-${idx}`} position={[pos, 0.25, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.4, 12]} />
              <meshStandardMaterial color={jarColors[idx]} roughness={0.2} metalness={0.1} />
            </mesh>
          );
        })}
      </group>

      {/* Warm Ambient & Station Lighting */}
      <ambientLight color="#fff7ed" intensity={0.65} />
      <directionalLight
        position={[4, 8, 4]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#fff1f2"
      />
      
      {/* Pendant Lights hanging from ceiling */}
      {[
        [-3, 5.5, -4],
        [3, 5.5, -4],
        [0, 5.5, 3.5],
      ].map(([px, py, pz], idx) => (
        <group key={`pendant-${idx}`} position={[px, py, pz]}>
          <mesh position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Lampshade */}
          <mesh position={[0, -1.2, 0]}>
            <coneGeometry args={[0.4, 0.35, 16]} />
            <meshStandardMaterial color="#f472b6" roughness={0.3} />
          </mesh>
          <pointLight position={[0, -1.3, 0]} intensity={0.7} distance={7} color="#fef08a" />
        </group>
      ))}
    </group>
  );
};
