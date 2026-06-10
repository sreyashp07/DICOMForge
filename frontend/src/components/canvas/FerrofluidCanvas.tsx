"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uVel;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.05;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes.xy;
    vec2 p = uv;
    p.x *= uRes.x / uRes.y;

    vec2 m = uMouse;
    m.x *= uRes.x / uRes.y;

    float t = uTime * 0.08;

    float d = distance(p, m);
    float ripple = exp(-d * 3.2) * sin(d * 22.0 - uTime * 2.4) * uVel * 0.6;
    float pull = exp(-d * 2.4) * (0.18 + uVel * 0.55);

    vec2 q = vec2(
      fbm(p * 1.6 + vec2(t, -t * 0.7)),
      fbm(p * 1.6 + vec2(-t * 0.5, t))
    );
    vec2 r = vec2(
      fbm(p * 1.8 + q * 1.9 + vec2(1.7, 9.2) + (m - p) * pull),
      fbm(p * 1.8 + q * 1.9 + vec2(8.3, 2.8))
    );

    float field = fbm(p * 2.0 + r * 2.2 + ripple);

    float ridge = 1.0 - abs(field * 2.0 - 1.0);
    ridge = pow(ridge, 6.0);

    vec3 ink      = vec3(0.043, 0.047, 0.055);
    vec3 obsidian = vec3(0.082, 0.090, 0.102);
    vec3 charcoal = vec3(0.13, 0.14, 0.16);
    vec3 mint     = vec3(0.663, 0.851, 0.753);
    vec3 peach    = vec3(0.953, 0.749, 0.639);

    vec3 col = mix(ink, obsidian, smoothstep(0.25, 0.75, field));
    col = mix(col, charcoal, ridge * 0.7);

    float glint = pow(ridge, 3.0) * smoothstep(0.4, 1.0, field);
    col += mint * glint * 0.10;
    col += peach * pow(ridge, 8.0) * (0.05 + uVel * 0.25);

    float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function FluidPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const size = useThree((s) => s.size);
  const target = useRef(new THREE.Vector2(0.5, 0.5));
  const current = useRef(new THREE.Vector2(0.5, 0.5));
  const vel = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVel: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    const dpr = state.gl.getPixelRatio();
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uRes.value.set(size.width * dpr, size.height * dpr);

    const before = current.current.clone();
    current.current.lerp(target.current, Math.min(1, delta * 5));
    const moved = current.current.distanceTo(before) / Math.max(delta, 1e-4);
    vel.current = THREE.MathUtils.lerp(vel.current, Math.min(moved * 2.5, 1), 0.08);

    mat.uniforms.uMouse.value.copy(current.current);
    mat.uniforms.uVel.value = vel.current;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function FerrofluidCanvas() {
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 1] }}
      >
        <FluidPlane />
      </Canvas>
    </div>
  );
}