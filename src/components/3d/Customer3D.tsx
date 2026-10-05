import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, SphereGeometry, CylinderGeometry, BoxGeometry, TorusGeometry, ConeGeometry } from 'three';
import { CustomerOrder, CustomerType } from '@/types/game';
import { ToonOutline } from './ToonOutline';

interface Customer3DProps {
  currentOrder: CustomerOrder | null;
}

// ============================================================================
// COMPONENTES MODULARES DE LOS ARQUETIPOS DE CLIENTES
// ============================================================================

/**
 * Accesorios y cabello para el Cliente Normal (Pastel, Coqueta, Tranquila)
 */
const NormalCustomerFeatures: React.FC = () => {
  const hairGeo = useMemo(() => new SphereGeometry(0.36, 16, 16), []);
  const bunGeo = useMemo(() => new SphereGeometry(0.12, 12, 12), []);
  const frillGeo = useMemo(() => new TorusGeometry(0.24, 0.04, 8, 16), []);
  const apronGeo = useMemo(() => new BoxGeometry(0.42, 0.45, 0.04), []);
  const bowGeo = useMemo(() => new SphereGeometry(0.06, 8, 8), []);

  return (
    <>
      {/* Cabello castaño caramelo con moños bajos laterales */}
      <group position={[0, 0.04, -0.04]}>
        <mesh geometry={hairGeo}>
          <meshStandardMaterial color="#854d0e" roughness={0.6} />
          <ToonOutline geometry={hairGeo} thickness={0.018} color="#2a1714" />
        </mesh>
        {/* Moño izquierdo */}
        <mesh geometry={bunGeo} position={[-0.32, -0.08, -0.08]}>
          <meshStandardMaterial color="#854d0e" roughness={0.6} />
          <ToonOutline geometry={bunGeo} thickness={0.016} color="#2a1714" />
        </mesh>
        {/* Moño derecho */}
        <mesh geometry={bunGeo} position={[0.32, -0.08, -0.08]}>
          <meshStandardMaterial color="#854d0e" roughness={0.6} />
          <ToonOutline geometry={bunGeo} thickness={0.016} color="#2a1714" />
        </mesh>
      </group>

      {/* Cuello bobo / Voladitos de encaje blanco crema */}
      <mesh geometry={frillGeo} position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#fffbeb" roughness={0.4} />
      </mesh>

      {/* Delantal verde menta pastel con lazo */}
      <group position={[0, -0.58, 0.22]}>
        <mesh geometry={apronGeo}>
          <meshStandardMaterial color="#a7f3d0" roughness={0.5} />
          <ToonOutline geometry={apronGeo} thickness={0.014} color="#2a1714" />
        </mesh>
        {/* Bolsillo del delantal */}
        <mesh position={[0, -0.08, 0.025]}>
          <boxGeometry args={[0.22, 0.14, 0.02]} />
          <meshStandardMaterial color="#6ee7b7" />
        </mesh>
      </group>
      {/* Moño en la espalda del delantal */}
      <mesh geometry={bowGeo} position={[0, -0.58, -0.28]}>
        <meshStandardMaterial color="#6ee7b7" />
      </mesh>
    </>
  );
};

/**
 * Accesorios y cabello para el Cliente Impaciente (Apuro, Reloj, Suéter Naranja)
 */
const ImpatientCustomerFeatures: React.FC<{
  armRef: React.RefObject<Group>;
  footRef: React.RefObject<Group>;
  patienceRatio: number;
}> = ({ armRef, footRef, patienceRatio }) => {
  const hairGeo = useMemo(() => new SphereGeometry(0.36, 16, 16), []);
  const watchGeo = useMemo(() => new TorusGeometry(0.065, 0.022, 8, 16), []);
  const watchFaceGeo = useMemo(() => new BoxGeometry(0.06, 0.06, 0.03), []);

  return (
    <>
      {/* Cabello castaño corto y despeinado */}
      <group position={[0, 0.06, -0.04]}>
        <mesh geometry={hairGeo}>
          <meshStandardMaterial color="#573016" roughness={0.6} />
          <ToonOutline geometry={hairGeo} thickness={0.018} color="#2a1714" />
        </mesh>
        {/* Mechón despeinado */}
        <mesh position={[0, 0.34, 0.12]} rotation={[-0.4, 0.2, 0]}>
          <coneGeometry args={[0.1, 0.18, 5]} />
          <meshStandardMaterial color="#573016" roughness={0.6} />
        </mesh>
      </group>

      {/* Cuello de polo blanco que asoma del suéter */}
      <mesh position={[0, -0.32, 0.08]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Brazo izquierdo levantado con reloj inteligente (animado al mirar la hora) */}
      <group ref={armRef} position={[-0.34, -0.52, 0.12]} rotation={[0.6, 0.7, -0.4]}>
        {/* Manga de suéter naranja */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.08, 0.075, 0.26, 12]} />
          <meshStandardMaterial color="#fb923c" roughness={0.5} />
          <ToonOutline geometry={new CylinderGeometry(0.08, 0.075, 0.26, 12)} thickness={0.014} />
        </mesh>
        {/* Mano */}
        <mesh position={[0, -0.28, 0]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>

        {/* Reloj inteligente distintivo con pantalla celeste luminosa */}
        <group position={[0, -0.21, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh geometry={watchGeo}>
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.2} />
          </mesh>
          <mesh geometry={watchFaceGeo} position={[0, 0, 0.055]}>
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>

      {/* Pierna y zapato derecho para foot-tapping rápido */}
      <group ref={footRef} position={[0.18, -1.05, 0.04]}>
        {/* Pierna jean azul */}
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.28, 12]} />
          <meshStandardMaterial color="#2563eb" roughness={0.6} />
        </mesh>
        {/* Zapatilla deportiva roja/blanca */}
        <mesh position={[0, -0.05, 0.08]}>
          <boxGeometry args={[0.12, 0.1, 0.22]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
          <ToonOutline geometry={new BoxGeometry(0.12, 0.1, 0.22)} thickness={0.014} />
        </mesh>
        <mesh position={[0, -0.08, 0.09]}>
          <boxGeometry args={[0.13, 0.04, 0.23]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </>
  );
};

/**
 * Accesorios y vestimenta para el Cliente Frecuente (Gorro Beanie Mostaza, Bufanda a rayas)
 */
const FrequentCustomerFeatures: React.FC<{ scarfTailRef: React.RefObject<Group> }> = ({
  scarfTailRef,
}) => {
  const beanieGeo = useMemo(() => new CylinderGeometry(0.35, 0.38, 0.24, 16), []);
  const beanieCuffGeo = useMemo(() => new TorusGeometry(0.37, 0.06, 8, 20), []);
  const pompomGeo = useMemo(() => new SphereGeometry(0.1, 12, 12), []);
  const scarfRingGeo = useMemo(() => new TorusGeometry(0.26, 0.07, 8, 20), []);
  const cardGeo = useMemo(() => new BoxGeometry(0.14, 0.2, 0.01), []);

  return (
    <>
      {/* Gorro de lana tejido tipo Beanie amarillo mostaza con pompón */}
      <group position={[0, 0.26, -0.02]} rotation={[-0.1, 0, 0.05]}>
        {/* Cuerpo del gorro */}
        <mesh geometry={beanieGeo}>
          <meshStandardMaterial color="#eab308" roughness={0.7} />
          <ToonOutline geometry={beanieGeo} thickness={0.018} color="#2a1714" />
        </mesh>
        {/* Dobladillo acanalado del gorro */}
        <mesh geometry={beanieCuffGeo} position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ca8a04" roughness={0.8} />
          <ToonOutline geometry={beanieCuffGeo} thickness={0.016} color="#2a1714" />
        </mesh>
        {/* Pompón esponjoso */}
        <mesh geometry={pompomGeo} position={[0, 0.18, 0]}>
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
          <ToonOutline geometry={pompomGeo} thickness={0.016} color="#2a1714" />
        </mesh>
      </group>

      {/* Cabello castaño que asoma bajo el gorro */}
      <mesh position={[0, 0.05, 0.22]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Bufanda gruesa a rayas chocolate y crema enrollada al cuello */}
      <group position={[0, -0.32, 0]}>
        <mesh geometry={scarfRingGeo} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#78350f" roughness={0.7} />
          <ToonOutline geometry={scarfRingGeo} thickness={0.018} color="#2a1714" />
        </mesh>

        {/* Cola de la bufanda que cuelga al frente y se mece con la respiración */}
        <group ref={scarfTailRef} position={[0.16, -0.06, 0.24]} rotation={[0.1, 0, -0.15]}>
          <mesh position={[0, -0.16, 0]}>
            <boxGeometry args={[0.12, 0.32, 0.04]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
            <ToonOutline geometry={new BoxGeometry(0.12, 0.32, 0.04)} thickness={0.014} />
          </mesh>
          {/* Rayas crema en la bufanda */}
          {[-0.08, -0.22].map((y, idx) => (
            <mesh key={`stripe-${idx}`} position={[0, y, 0.005]}>
              <boxGeometry args={[0.122, 0.04, 0.045]} />
              <meshStandardMaterial color="#fef3c7" />
            </mesh>
          ))}
          {/* Flecos al final */}
          <mesh position={[0, -0.33, 0]}>
            <boxGeometry args={[0.12, 0.03, 0.02]} />
            <meshStandardMaterial color="#fde68a" />
          </mesh>
        </group>
      </group>

      {/* Tarjeta de fidelidad / sellitos que sostiene amigablemente en la mano derecha */}
      <group position={[0.38, -0.6, 0.2]} rotation={[0.4, -0.3, 0.2]}>
        {/* Mano */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>
        {/* Tarjeta */}
        <mesh geometry={cardGeo} position={[0.04, 0.08, 0.05]} rotation={[-0.3, 0.2, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
          <ToonOutline geometry={cardGeo} thickness={0.012} color="#2a1714" />
        </mesh>
        {/* Sellitos rosados en la tarjeta */}
        {[-0.04, 0.04].map((x, i) =>
          [-0.04, 0.04].map((y, j) => (
            <mesh
              key={`stamp-${i}-${j}`}
              position={[0.04 + x * 0.7, 0.08 + y * 0.7, 0.06]}
              rotation={[-0.3, 0.2, 0]}
            >
              <sphereGeometry args={[0.012, 6, 6]} />
              <meshStandardMaterial color="#ec4899" />
            </mesh>
          ))
        )}
      </group>
    </>
  );
};

/**
 * Accesorios para el Cliente Especial / VIP (Corona, Abrigo Violeta Real, Ribetes Dorados, Partículas)
 */
const SpecialCustomerFeatures: React.FC<{ sparklesRef: React.RefObject<Group> }> = ({
  sparklesRef,
}) => {
  const crownGeo = useMemo(() => new CylinderGeometry(0.18, 0.14, 0.12, 5), []);
  const gemGeo = useMemo(() => new SphereGeometry(0.04, 8, 8), []);
  const trimGeo = useMemo(() => new BoxGeometry(0.05, 0.65, 0.03), []);
  const starGeo = useMemo(() => new ConeGeometry(0.04, 0.09, 4), []);

  return (
    <>
      {/* Corona real dorada con gema rubí */}
      <group position={[0, 0.38, 0]} rotation={[0.1, 0, -0.05]}>
        <mesh geometry={crownGeo}>
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          <ToonOutline geometry={crownGeo} thickness={0.016} color="#2a1714" />
        </mesh>
        {/* Puntas de la corona */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 5;
          return (
            <mesh
              key={`peak-${i}`}
              position={[Math.cos(angle) * 0.16, 0.08, Math.sin(angle) * 0.16]}
              rotation={[0, angle, 0]}
            >
              <coneGeometry args={[0.035, 0.08, 4]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
            </mesh>
          );
        })}
        {/* Gema rubí al frente */}
        <mesh geometry={gemGeo} position={[0, 0, 0.17]}>
          <meshStandardMaterial color="#e11d48" metalness={0.4} roughness={0.1} emissive="#e11d48" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Cabello ondulado elegante y peinado */}
      <mesh position={[0, 0.08, -0.08]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#4c1d95" roughness={0.5} />
        <ToonOutline geometry={new SphereGeometry(0.35, 16, 16)} thickness={0.018} />
      </mesh>

      {/* Ribete dorado del abrigo real */}
      <mesh geometry={trimGeo} position={[0, -0.6, 0.28]}>
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Botones dorados opulentos */}
      {[-0.42, -0.54, -0.66].map((y, idx) => (
        <mesh key={`gold-btn-${idx}`} position={[0.06, y, 0.29]}>
          <cylinderGeometry args={[0.02, 0.02, 0.015, 8]} />
          <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Cuello alto de abrigo de alta costura */}
      <mesh position={[0, -0.32, -0.05]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.38, 0.12, 0.24]} />
        <meshStandardMaterial color="#581c87" roughness={0.4} />
        <ToonOutline geometry={new BoxGeometry(0.38, 0.12, 0.24)} thickness={0.016} />
      </mesh>

      {/* Partículas / Estrellitas doradas de aura VIP flotando suavemente */}
      <group ref={sparklesRef}>
        {[
          [-0.45, 0.3, 0.2],
          [0.48, 0.2, -0.1],
          [-0.3, -0.2, 0.4],
          [0.35, -0.1, 0.35],
        ].map(([sx, sy, sz], idx) => (
          <group key={`spark-${idx}`} position={[sx, sy, sz]}>
            <mesh geometry={starGeo}>
              <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={0.8} />
            </mesh>
            <mesh geometry={starGeo} rotation={[Math.PI, 0, 0]}>
              <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL CUSTOMER3D
// ============================================================================

export const Customer3D: React.FC<Customer3DProps> = ({ currentOrder }) => {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const armRef = useRef<Group>(null);
  const footRef = useRef<Group>(null);
  const scarfTailRef = useRef<Group>(null);
  const sparklesRef = useRef<Group>(null);
  const leftEyeBrowRef = useRef<Group>(null);
  const rightEyeBrowRef = useRef<Group>(null);

  // Estado para animar la reacción de salida (satisfecho vs enojado) al terminar pedido
  const lastCustomerRef = useRef<{
    type: CustomerType;
    wasSatisfied: boolean;
    timestamp: number;
  } | null>(null);

  const prevOrderRef = useRef<CustomerOrder | null>(currentOrder);

  // Detectar cuándo finaliza un pedido para retener al cliente durante su reacción
  if (currentOrder && currentOrder !== prevOrderRef.current) {
    prevOrderRef.current = currentOrder;
  } else if (!currentOrder && prevOrderRef.current) {
    const wasSatisfied = prevOrderRef.current.currentPatienceSeconds > 0;
    lastCustomerRef.current = {
      type: prevOrderRef.current.customerType,
      wasSatisfied,
      timestamp: Date.now(),
    };
    prevOrderRef.current = null;
  }

  // Geometrías principales compartidas para el cuerpo base Chibi
  const headGeo = useMemo(() => new SphereGeometry(0.34, 20, 20), []);
  const bodyGeo = useMemo(() => new CylinderGeometry(0.32, 0.42, 0.72, 16), []);
  const cheekGeo = useMemo(() => new SphereGeometry(0.045, 10, 10), []);
  const eyeWhiteGeo = useMemo(() => new SphereGeometry(0.065, 12, 12), []);
  const pupilGeo = useMemo(() => new SphereGeometry(0.045, 10, 10), []);
  const highlightGeo = useMemo(() => new SphereGeometry(0.018, 6, 6), []);
  const browGeo = useMemo(() => new BoxGeometry(0.1, 0.024, 0.02), []);
  const mouthGeo = useMemo(() => new BoxGeometry(0.08, 0.025, 0.02), []);

  // Determinar si mostramos cliente activo o cliente en reacción de salida
  const isExiting = !currentOrder && lastCustomerRef.current !== null;
  const exitData = isExiting ? lastCustomerRef.current : null;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const t = clock.getElapsedTime();

    // Caso A: Reacción de Salida (Satisfecho / Enojado tras completar o fallar pedido)
    if (exitData) {
      const elapsed = (Date.now() - exitData.timestamp) / 1000;
      if (elapsed > 1.4) {
        lastCustomerRef.current = null;
        return;
      }

      // Desplazamiento suave retrocediendo hacia la puerta de salida
      groupRef.current.position.z = 5.3 + elapsed * 0.7;

      if (exitData.wasSatisfied) {
        // --- REACCIÓN SATISFECHO: Saltito alegre y cabeza de fiesta ---
        groupRef.current.position.y = 0.45 + Math.abs(Math.sin(elapsed * 12)) * 0.16;
        if (headRef.current) {
          headRef.current.rotation.z = Math.sin(elapsed * 10) * 0.12;
          headRef.current.rotation.x = -0.1;
        }
        if (leftEyeBrowRef.current && rightEyeBrowRef.current) {
          leftEyeBrowRef.current.rotation.z = 0.15;
          rightEyeBrowRef.current.rotation.z = -0.15;
          leftEyeBrowRef.current.position.y = 0.11;
          rightEyeBrowRef.current.position.y = 0.11;
        }
        if (sparklesRef.current) {
          sparklesRef.current.rotation.y = elapsed * 3.5;
        }
      } else {
        // --- REACCIÓN ENOJADO / TIMEOUT: Sacudida de cabeza y pisotón ---
        groupRef.current.position.y = 0.45;
        if (headRef.current) {
          headRef.current.rotation.y = Math.sin(elapsed * 16) * 0.22;
          headRef.current.rotation.x = 0.12;
        }
        if (footRef.current) {
          footRef.current.rotation.x = Math.abs(Math.sin(elapsed * 14)) * 0.45;
        }
        if (leftEyeBrowRef.current && rightEyeBrowRef.current) {
          leftEyeBrowRef.current.rotation.z = -0.45;
          rightEyeBrowRef.current.rotation.z = 0.45;
          leftEyeBrowRef.current.position.y = 0.05;
          rightEyeBrowRef.current.position.y = 0.05;
        }
      }
      return;
    }

    // Caso B: Espera Activa con Pedido Vigente
    if (!currentOrder) return;

    const patienceRatio = currentOrder.currentPatienceSeconds / currentOrder.maxPatienceSeconds;
    const type = currentOrder.customerType;

    // Resetear posición Z fija frente al mostrador
    groupRef.current.position.z = 5.3;

    // 1. Dinámica de cuerpo según tipo y nivel de paciencia
    if (type === 'impatient') {
      // Impaciente: respiración rápida + foot tapping rítmico
      const nervousSpeed = patienceRatio < 0.3 ? 14 : 9;
      groupRef.current.position.y = 0.45 + Math.sin(t * nervousSpeed) * (patienceRatio < 0.3 ? 0.04 : 0.025);
      groupRef.current.rotation.z = Math.sin(t * (nervousSpeed * 1.2)) * 0.03;

      // Movimiento de foot tapping en el piso
      if (footRef.current) {
        const tapRate = patienceRatio < 0.3 ? 16 : 10;
        footRef.current.rotation.x = Math.abs(Math.sin(t * tapRate)) * 0.38;
      }

      // Mira su reloj periódicamente (cada ~3 segundos)
      if (armRef.current && headRef.current) {
        const glanceCycle = Math.sin(t * 1.8);
        if (glanceCycle > 0.4) {
          // Levanta muñeca hacia el pecho y baja cabeza
          armRef.current.rotation.x = 0.8 + glanceCycle * 0.3;
          headRef.current.rotation.x = 0.15;
          headRef.current.rotation.y = -0.15;
        } else {
          armRef.current.rotation.x = 0.6;
          headRef.current.rotation.x = 0;
          headRef.current.rotation.y = 0;
        }
      }
    } else if (type === 'frequent') {
      // Frecuente: balanceo suave y alegre de izquierda a derecha (tarareando)
      groupRef.current.position.y = 0.45 + Math.sin(t * 3.5) * 0.04;
      groupRef.current.rotation.z = Math.sin(t * 2.2) * 0.06;

      // El extremo de la bufanda se balancea con física inercial
      if (scarfTailRef.current) {
        scarfTailRef.current.rotation.z = -0.15 + Math.sin(t * 2.2) * 0.15;
      }
    } else if (type === 'special') {
      // Especial / VIP: respiración suave, imponente y digna
      groupRef.current.position.y = 0.45 + Math.sin(t * 2.0) * 0.025;
      groupRef.current.rotation.z = 0;

      // Partículas de aura dorada rotando alrededor
      if (sparklesRef.current) {
        sparklesRef.current.rotation.y = t * 0.8;
      }
    } else {
      // Normal: respiración suave y tranquila
      groupRef.current.position.y = 0.45 + Math.sin(t * 2.8) * 0.035;
      groupRef.current.rotation.z = 0;
    }

    // 2. Cejas reactivas según la paciencia
    if (leftEyeBrowRef.current && rightEyeBrowRef.current) {
      if (patienceRatio < 0.3 || type === 'impatient') {
        // Cejas fruncidas de enojo/impaciencia (inclinadas hacia el centro)
        leftEyeBrowRef.current.rotation.z = -0.35;
        rightEyeBrowRef.current.rotation.z = 0.35;
        leftEyeBrowRef.current.position.y = 0.06;
        rightEyeBrowRef.current.position.y = 0.06;
      } else {
        // Cejas relajadas y amables
        leftEyeBrowRef.current.rotation.z = 0.05;
        rightEyeBrowRef.current.rotation.z = -0.05;
        leftEyeBrowRef.current.position.y = 0.09;
        rightEyeBrowRef.current.position.y = 0.09;
      }
    }
  });

  if (!currentOrder && !exitData) return null;

  const activeType: CustomerType = currentOrder ? currentOrder.customerType : (exitData?.type ?? 'normal');
  const patienceRatio = currentOrder
    ? currentOrder.currentPatienceSeconds / currentOrder.maxPatienceSeconds
    : (exitData?.wasSatisfied ? 1.0 : 0.0);

  const patienceColor =
    patienceRatio > 0.6 ? '#22c55e' : patienceRatio > 0.3 ? '#eab308' : '#ef4444';

  // Color de ropa base según el tipo de cliente
  const type = activeType;
  const bodyColor =
    type === 'normal'
      ? '#6ee7b7' // Menta pastel
      : type === 'impatient'
      ? '#fb923c' // Naranja coral cálido
      : type === 'frequent'
      ? '#d97706' // Camel / mostaza suave
      : '#7c3aed'; // Violeta real

  return (
    <group
      ref={groupRef}
      position={[-0.8, 0.45, 5.3]}
      rotation={[0, Math.PI, 0]}
      name="counter"
    >
      {/* ============================================================== */}
      {/* 1. CUERPO Y TORSO CHIBI REDONDEADO (CHONKY TOON)               */}
      {/* ============================================================== */}
      <group position={[0, 0.65, 0]}>
        <mesh geometry={bodyGeo} castShadow receiveShadow>
          <meshStandardMaterial color={bodyColor} roughness={0.5} />
          <ToonOutline geometry={bodyGeo} thickness={0.022} color="#2a1714" />
        </mesh>

        {/* Piernas base para apoyar en el suelo */}
        {type !== 'impatient' && (
          <group position={[0, -0.45, 0]}>
            {/* Pierna Izquierda */}
            <mesh position={[-0.15, -0.1, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            {/* Pierna Derecha */}
            <mesh position={[0.15, -0.1, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          </group>
        )}
      </group>

      {/* ============================================================== */}
      {/* 2. CABEZA CHIBI Y ROSTRO EXPRESIVO                             */}
      {/* ============================================================== */}
      <group ref={headRef} position={[0, 1.45, 0]}>
        {/* Esfera de la cabeza en tono piel cálido de durazno */}
        <mesh geometry={headGeo} castShadow>
          <meshStandardMaterial color="#fed7aa" roughness={0.4} />
          <ToonOutline geometry={headGeo} thickness={0.022} color="#2a1714" />
        </mesh>

        {/* OJOS GRANDES ESTILO TOON (Esclerótica blanca + Pupila brillante + Reflejo especular) */}
        {/* Ojo Izquierdo */}
        <group position={[-0.11, 0.02, 0.29]}>
          <mesh geometry={eyeWhiteGeo} scale={[1, 1.15, 0.35]}>
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh geometry={pupilGeo} position={[0, 0, 0.02]} scale={[1, 1.1, 0.3]}>
            <meshStandardMaterial color="#1e1b4b" roughness={0.1} />
          </mesh>
          {/* Brillo especular blanco en el ojo */}
          <mesh geometry={highlightGeo} position={[-0.015, 0.02, 0.035]}>
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Ojo Derecho */}
        <group position={[0.11, 0.02, 0.29]}>
          <mesh geometry={eyeWhiteGeo} scale={[1, 1.15, 0.35]}>
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh geometry={pupilGeo} position={[0, 0, 0.02]} scale={[1, 1.1, 0.3]}>
            <meshStandardMaterial color="#1e1b4b" roughness={0.1} />
          </mesh>
          <mesh geometry={highlightGeo} position={[-0.015, 0.02, 0.035]}>
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* CEJAS REACTIVAS (Giran para mostrar impaciencia / alegría) */}
        <group ref={leftEyeBrowRef} position={[-0.12, 0.09, 0.31]}>
          <mesh geometry={browGeo}>
            <meshStandardMaterial color="#451a03" />
          </mesh>
        </group>
        <group ref={rightEyeBrowRef} position={[0.12, 0.09, 0.31]}>
          <mesh geometry={browGeo}>
            <meshStandardMaterial color="#451a03" />
          </mesh>
        </group>

        {/* MEJILLAS RUBORIZADAS TIERNAS (Blush) */}
        <mesh geometry={cheekGeo} position={[-0.18, -0.06, 0.27]} scale={[1, 0.7, 0.3]}>
          <meshStandardMaterial color="#fb7185" roughness={0.6} />
        </mesh>
        <mesh geometry={cheekGeo} position={[0.18, -0.06, 0.27]} scale={[1, 0.7, 0.3]}>
          <meshStandardMaterial color="#fb7185" roughness={0.6} />
        </mesh>

        {/* BOCA REACTIVA */}
        <group position={[0, -0.11, 0.31]}>
          {patienceRatio < 0.3 ? (
            // Boca en zigzag de molestia
            <mesh rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.07, 0.02, 0.02]} />
              <meshStandardMaterial color="#7f1d1d" />
            </mesh>
          ) : (
            // Sonrisa apacible de dibujo animado
            <mesh geometry={mouthGeo}>
              <meshStandardMaterial color="#9f1239" />
            </mesh>
          )}
        </group>

        {/* Naricita simpática */}
        <mesh position={[0, -0.02, 0.33]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#fca5a5" />
        </mesh>

        {/* ============================================================ */}
        {/* 3. ELEMENTOS DISTINTIVOS SEGÚN EL TIPO DE CLIENTE           */}
        {/* ============================================================ */}
        {type === 'normal' && <NormalCustomerFeatures />}
        {type === 'impatient' && (
          <ImpatientCustomerFeatures
            armRef={armRef}
            footRef={footRef}
            patienceRatio={patienceRatio}
          />
        )}
        {type === 'frequent' && <FrequentCustomerFeatures scarfTailRef={scarfTailRef} />}
        {type === 'special' && <SpecialCustomerFeatures sparklesRef={sparklesRef} />}
      </group>

      {/* ============================================================== */}
      {/* 4. FEEDBACK DE REACCIÓN O HALO FLOTANTE DE PACIENCIA           */}
      {/* ============================================================== */}
      {currentOrder && !isExiting ? (
        <group position={[0, 2.15, 0]}>
          {/* Anillo fondo oscuro */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.03, 8, 28]} />
            <meshStandardMaterial color="#1e293b" />
            <ToonOutline geometry={new TorusGeometry(0.28, 0.03, 8, 28)} thickness={0.012} />
          </mesh>

          {/* Anillo luminoso de progreso */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry
              args={[0.28, 0.045, 8, 28, Math.PI * 2 * Math.max(0.04, patienceRatio)]}
            />
            <meshStandardMaterial
              color={patienceColor}
              emissive={patienceColor}
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Ícono emoji flotante miniatura sobre el halo */}
          <group position={[0, 0.16, 0]}>
            <mesh>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial
                color={patienceColor}
                emissive={patienceColor}
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        </group>
      ) : isExiting && exitData?.wasSatisfied ? (
        /* Reacción feliz flotante: Corazón / Esfera Rosa Brillante con chispas */
        <group position={[0, 2.15, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#fb7185"
              emissive="#f43f5e"
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[-0.14, 0.08, 0]} rotation={[0, 0, 0.4]}>
            <coneGeometry args={[0.05, 0.1, 4]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.9} />
          </mesh>
          <mesh position={[0.14, 0.08, 0]} rotation={[0, 0, -0.4]}>
            <coneGeometry args={[0.05, 0.1, 4]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.9} />
          </mesh>
        </group>
      ) : isExiting && !exitData?.wasSatisfied ? (
        /* Reacción de enfado: Cruz roja de comic 💢 pulsante */
        <group position={[0, 2.15, 0]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.05, 0.22, 0.04]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.9} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.05, 0.22, 0.04]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.9} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};
