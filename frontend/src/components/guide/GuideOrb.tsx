"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Orb({ thinking }: { thinking: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const speed = thinking ? 2.6 : 0.6;
    if (mesh.current) {
      mesh.current.rotation.y += delta * speed;
      mesh.current.rotation.x += delta * speed * 0.4;
      const s = 1 + Math.sin(t * (thinking ? 7 : 2.2)) * (thinking ? 0.1 : 0.04);
      mesh.current.scale.setScalar(s);
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * speed * 0.7;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight color="#A9D9C0" intensity={12} position={[2, 2, 3]} />
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#A9D9C0" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh ref={inner} scale={0.55}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#F3BFA3" metalness={0.4} roughness={0.3} />
      </mesh>
    </>
  );
}

export default function GuideOrb({ thinking }: { thinking: boolean }) {
  return (
    <Canvas dpr={1} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 3.2], fov: 45 }}>
      <Orb thinking={thinking} />
    </Canvas>
  );
}
