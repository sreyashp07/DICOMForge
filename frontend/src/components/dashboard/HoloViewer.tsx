"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function HoloMesh({
  geometry,
  paused,
}: {
  geometry: THREE.BufferGeometry;
  paused: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  const scale = useMemo(() => {
    const r = geometry.boundingSphere?.radius || 1;
    return 58 / r;
  }, [geometry]);

  useFrame((_, delta) => {
    if (group.current && !paused) group.current.rotation.y += delta * 0.07;
  });

  return (
    <group ref={group} scale={scale}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#F3BFA3"
          metalness={0.32}
          roughness={0.38}
          transparent
          opacity={0.96}
        />
      </mesh>
      <mesh geometry={geometry} scale={1.001}>
        <meshBasicMaterial color="#A9D9C0" wireframe transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function ScanRing() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ring.current) return;
    const t = state.clock.elapsedTime;
    ring.current.position.y = Math.sin(t * 0.5) * 55;
    const mat = ring.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.1 + (Math.sin(t * 0.5 + Math.PI / 2) + 1) * 0.05;
  });
  return (
    <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[62, 63.2, 96]} />
      <meshBasicMaterial color="#A9D9C0" transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function HoloViewer({
  geometry,
  paused,
}: {
  geometry: THREE.BufferGeometry | null;
  paused: boolean;
}) {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={typeof window !== "undefined" && window.innerWidth < 768 ? [1, 1] : [1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 36, 175], fov: 42 }}
      >
        <fog attach="fog" args={["#0B0C0E", 220, 520]} />
        <ambientLight color="#F3BFA3" intensity={0.35} />
        <directionalLight color="#FCE6D6" intensity={1.5} position={[80, 100, 90]} />
        <directionalLight color="#A9D9C0" intensity={0.9} position={[-90, 30, -70]} />
        <pointLight color="#A9D9C0" intensity={120} distance={300} position={[0, -40, 0]} />

        <gridHelper
          args={[560, 46, new THREE.Color("#2A4438"), new THREE.Color("#16181C")]}
          position={[0, -72, 0]}
        />

        {geometry && (
          <>
            <HoloMesh geometry={geometry} paused={paused} />
            <ScanRing />
          </>
        )}

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
          minDistance={90}
          maxDistance={330}
          maxPolarAngle={Math.PI * 0.62}
        />
      </Canvas>
    </div>
  );
}
