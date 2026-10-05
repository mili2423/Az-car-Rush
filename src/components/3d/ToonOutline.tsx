import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ToonOutlineProps {
  geometry: THREE.BufferGeometry;
  thickness?: number;
  color?: string;
  renderOrder?: number;
}

export const ToonOutline: React.FC<ToonOutlineProps> = ({
  geometry,
  thickness = 0.025,
  color = '#2a1714',
  renderOrder = 0,
}) => {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        thickness: { value: thickness },
        outlineColor: { value: new THREE.Color(color) },
      },
      vertexShader: `
        uniform float thickness;
        void main() {
          vec3 transformed = position + normal * thickness;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 outlineColor;
        void main() {
          gl_FragColor = vec4(outlineColor, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: true,
    });
  }, [thickness, color]);

  return <mesh geometry={geometry} material={material} renderOrder={renderOrder} />;
};

/**
 * ToonMesh: Un helper conveniente que renderiza un mesh con su material principal
 * y automáticamente adjunta el contorno invertido estilizado.
 */
interface ToonMeshProps {
  geometry: THREE.BufferGeometry;
  children?: React.ReactNode;
  outlineThickness?: number;
  outlineColor?: string;
  castShadow?: boolean;
  receiveShadow?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  name?: string;
}

export const ToonMesh: React.FC<ToonMeshProps> = ({
  geometry,
  children,
  outlineThickness = 0.022,
  outlineColor = '#2a1714',
  castShadow = true,
  receiveShadow = false,
  position,
  rotation,
  scale,
  name,
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale} name={name}>
      <mesh geometry={geometry} castShadow={castShadow} receiveShadow={receiveShadow}>
        {children}
      </mesh>
      {outlineThickness > 0 && (
        <ToonOutline geometry={geometry} thickness={outlineThickness} color={outlineColor} />
      )}
    </group>
  );
};
