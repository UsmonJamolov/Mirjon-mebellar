"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

const leatherProps = {
  color: "#1a1a1e",
  metalness: 0.15,
  roughness: 0.45,
  clearcoat: 0.8,
  clearcoatRoughness: 0.2,
};

const metalProps = {
  color: "#b8b8c0",
  metalness: 0.95,
  roughness: 0.15,
};

function ChairModel({
  mouse,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y =
      Math.sin(t * 0.25) * 0.2 + mouse.current.x * 0.35;
    group.current.rotation.x = mouse.current.y * 0.12;
    group.current.position.y = Math.sin(t * 0.6) * 0.06;
  });

  return (
    <group ref={group} scale={1.15} position={[0, -0.35, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.18, 1]} />
        <meshPhysicalMaterial {...leatherProps} />
      </mesh>
      <mesh position={[0, 0.75, -0.38]} castShadow>
        <boxGeometry args={[1.05, 0.7, 0.14]} />
        <meshPhysicalMaterial {...leatherProps} />
      </mesh>
      <mesh position={[-0.58, 0.55, 0]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.85]} />
        <meshPhysicalMaterial {...leatherProps} />
      </mesh>
      <mesh position={[0.58, 0.55, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.85]} />
        <meshPhysicalMaterial {...leatherProps} />
      </mesh>
      {(
        [
          [-0.42, 0.08, 0.38],
          [0.42, 0.08, 0.38],
          [-0.42, 0.08, -0.38],
          [0.42, 0.08, -0.38],
        ] as const
      ).map((pos, i) => (
        <mesh key={i} position={[...pos]} castShadow>
          <cylinderGeometry args={[0.03, 0.025, 0.32, 16]} />
          <meshPhysicalMaterial {...metalProps} />
        </mesh>
      ))}
    </group>
  );
}

export function LuxuryChairScene({
  mouse,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <spotLight
        position={[4, 6, 4]}
        angle={0.35}
        penumbra={1}
        intensity={2.5}
        castShadow
        color="#e8e8f0"
      />
      <spotLight position={[-5, 3, -2]} intensity={1.2} color="#8888aa" />
      <pointLight position={[0, 2, 3]} intensity={0.8} color="#ffffff" />
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
        <ChairModel mouse={mouse} />
      </Float>
      <Environment preset="city" />
    </>
  );
}
