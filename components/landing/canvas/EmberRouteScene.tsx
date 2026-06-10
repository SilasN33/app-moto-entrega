"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, type MutableRefObject } from "react";

const EMBER = "#FF6A2B";
const CORAL = "#FF8A4C";
const CLAY = "#F4EDE4";
const GOLDEN = "#FFC98A";
const SAGE = "#7FB08A";

// Rota em S atravessando as 4 estações da história
const CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-3.4, 0.06, 1.4),
    new THREE.Vector3(-2.4, 0.06, -0.7),
    new THREE.Vector3(-1.1, 0.06, 0.9),
    new THREE.Vector3(0.1, 0.06, -0.9),
    new THREE.Vector3(1.3, 0.06, 0.7),
    new THREE.Vector3(2.5, 0.06, -0.5),
    new THREE.Vector3(3.4, 0.06, 1.0),
  ],
  false,
  "catmullrom",
  0.6
);

// Posição (t na curva) de cada estação: pedido → fila → entrega → relatório
const STATION_TS = [0.06, 0.37, 0.66, 0.95];

type SceneProps = { progressRef: MutableRefObject<number> };

function ClayMaterial() {
  return <meshStandardMaterial color={CLAY} roughness={0.92} metalness={0} />;
}

/** Fagulha-pedido que percorre a rota conforme o scroll */
function OrderEmber({ progressRef }: SceneProps) {
  const group = useRef<THREE.Group>(null!);
  const smoothed = useRef(0);

  useFrame(() => {
    // lerp = movimento cinematográfico em vez de colado na barra de scroll
    smoothed.current = THREE.MathUtils.lerp(smoothed.current, progressRef.current, 0.06);
    const t = THREE.MathUtils.clamp(0.02 + smoothed.current * 0.95, 0.02, 0.97);
    const pos = CURVE.getPointAt(t);
    group.current.position.set(pos.x, pos.y + 0.13, pos.z);
  });

  return (
    <group ref={group}>
      <Trail width={0.5} length={4} color={CORAL} attenuation={(w) => w * w}>
        <mesh>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshBasicMaterial color={EMBER} toneMapped={false} />
        </mesh>
      </Trail>
      <pointLight color={EMBER} intensity={2.6} distance={2.4} decay={2} />
    </group>
  );
}

/** Estação de argila que acende quando a fagulha passa por ela */
function Station({
  index,
  progressRef,
  children,
}: SceneProps & { index: number; children: React.ReactNode }) {
  const ring = useRef<THREE.MeshBasicMaterial>(null!);
  const group = useRef<THREE.Group>(null!);
  const lit = useRef(0);
  const pos = useMemo(() => CURVE.getPointAt(STATION_TS[index]), [index]);

  useFrame(() => {
    const active = progressRef.current * 0.95 + 0.02 >= STATION_TS[index] - 0.03;
    lit.current = THREE.MathUtils.lerp(lit.current, active ? 1 : 0, 0.08);
    ring.current.opacity = 0.15 + lit.current * 0.85;
    const s = 1 + lit.current * 0.08;
    group.current.scale.setScalar(s);
  });

  return (
    <group ref={group} position={[pos.x, 0, pos.z]}>
      {/* plataforma */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.54, 0.08, 40]} />
        <ClayMaterial />
      </mesh>
      {/* anel-brasa que acende */}
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.018, 12, 60]} />
        <meshBasicMaterial ref={ring} color={EMBER} transparent toneMapped={false} />
      </mesh>
      <group position={[0, 0.08, 0]}>{children}</group>
    </group>
  );
}

/** Ícones de argila — abstratos, geométricos, nível maquete */
function RestaurantIcon() {
  return (
    <group>
      <RoundedBox args={[0.5, 0.4, 0.5]} radius={0.05} position={[0, 0.2, 0]} castShadow>
        <ClayMaterial />
      </RoundedBox>
      <mesh position={[0, 0.52, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.42, 0.26, 4]} />
        <meshStandardMaterial color={EMBER} roughness={0.7} />
      </mesh>
      {/* janela acesa */}
      <mesh position={[0, 0.2, 0.26]}>
        <planeGeometry args={[0.16, 0.12]} />
        <meshBasicMaterial color={GOLDEN} toneMapped={false} />
      </mesh>
    </group>
  );
}

function QueueIcon() {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <RoundedBox
          key={i}
          args={[0.46 - i * 0.06, 0.1, 0.34 - i * 0.04]}
          radius={0.03}
          position={[i * 0.03, 0.07 + i * 0.13, -i * 0.02]}
          castShadow
        >
          <ClayMaterial />
        </RoundedBox>
      ))}
      <mesh position={[0.06, 0.46, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={EMBER} toneMapped={false} />
      </mesh>
    </group>
  );
}

function PhotoIcon() {
  return (
    <group>
      <RoundedBox args={[0.46, 0.32, 0.16]} radius={0.04} position={[0, 0.24, 0]} castShadow>
        <ClayMaterial />
      </RoundedBox>
      <mesh position={[0, 0.26, 0.09]}>
        <cylinderGeometry args={[0.09, 0.09, 0.04, 24]} />
        <meshStandardMaterial color="#3a3531" roughness={0.4} />
      </mesh>
      <mesh position={[0.16, 0.36, 0.09]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={GOLDEN} toneMapped={false} />
      </mesh>
    </group>
  );
}

function ChartIcon() {
  const heights = [0.18, 0.32, 0.48];
  return (
    <group>
      {heights.map((h, i) => (
        <RoundedBox
          key={i}
          args={[0.12, h, 0.12]}
          radius={0.025}
          position={[-0.18 + i * 0.18, h / 2 + 0.02, 0]}
          castShadow
        >
          {i === 2 ? (
            <meshStandardMaterial
              color={EMBER}
              emissive={EMBER}
              emissiveIntensity={0.35}
              roughness={0.6}
            />
          ) : (
            <ClayMaterial />
          )}
        </RoundedBox>
      ))}
    </group>
  );
}

/** Árvores de argila para equilíbrio (a única nota fria da paleta) */
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.24, 10]} />
        <meshStandardMaterial color="#b9a896" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.34, 0]} castShadow>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color={SAGE} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Route() {
  return (
    <group>
      <mesh>
        <tubeGeometry args={[CURVE, 220, 0.02, 10, false]} />
        <meshBasicMaterial color={EMBER} toneMapped={false} />
      </mesh>
      {/* halo da rota */}
      <mesh>
        <tubeGeometry args={[CURVE, 220, 0.05, 10, false]} />
        <meshBasicMaterial color={CORAL} transparent opacity={0.18} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Câmera com parallax de mouse — sempre via lerp, nunca direto */
function CameraRig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.5, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2.4 + pointer.y * 0.25, 0.04);
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

export default function EmberRouteScene({ progressRef }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 2.4, 6.2], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      className="!pointer-events-none"
    >
      <hemisphereLight args={[GOLDEN, CLAY, 0.75]} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.5}
        color={GOLDEN}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <ambientLight intensity={0.35} />

      <Route />
      <OrderEmber progressRef={progressRef} />

      <Station index={0} progressRef={progressRef}>
        <RestaurantIcon />
      </Station>
      <Station index={1} progressRef={progressRef}>
        <QueueIcon />
      </Station>
      <Station index={2} progressRef={progressRef}>
        <PhotoIcon />
      </Station>
      <Station index={3} progressRef={progressRef}>
        <ChartIcon />
      </Station>

      <Tree position={[-2.0, 0, 1.6]} />
      <Tree position={[1.9, 0, -1.4]} scale={0.8} />
      <Tree position={[3.0, 0, 0.2]} scale={1.1} />
      <Tree position={[-3.2, 0, -0.6]} scale={0.9} />

      <ContactShadows position={[0, 0, 0]} opacity={0.32} scale={11} blur={2.6} far={3} />
      <CameraRig />
    </Canvas>
  );
}
