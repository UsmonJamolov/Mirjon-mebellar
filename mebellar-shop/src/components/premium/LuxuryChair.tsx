"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export interface ChairMaterials {
  leather: string;
  wood: string;
  base: string;
}

interface LuxuryChairProps {
  materials: ChairMaterials;
  /** Configurator panel rotation (radians) */
  rotation?: { x: number; y: number; z: number };
}

/**
 * Premium Eames-style lounge chair — procedural R3F geometry.
 * Cream leather cushions + walnut wood shells + matte-black 5-star base.
 * Pointer parallax + Float ambient drift.
 */
export function LuxuryChair({ materials, rotation }: LuxuryChairProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const mx = state.pointer.x;
    const my = state.pointer.y;

    const targetY = (mx * Math.PI) / 12 + (rotation?.y ?? 0);
    const targetX = (my * Math.PI) / 18 + (rotation?.x ?? 0);

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetY,
      0.06
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      0.06
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      rotation?.z ?? 0,
      0.06
    );
  });

  const leather = (
    <meshStandardMaterial
      color={materials.leather}
      roughness={0.55}
      metalness={0.02}
      envMapIntensity={0.85}
    />
  );
  const wood = (
    <meshStandardMaterial
      color={materials.wood}
      roughness={0.42}
      metalness={0.08}
      envMapIntensity={1.0}
    />
  );
  const metal = (
    <meshStandardMaterial
      color={materials.base}
      roughness={0.32}
      metalness={0.85}
      envMapIntensity={1.1}
    />
  );

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <group ref={group} position={[0, -0.1, 0]} scale={1}>
        {/* Wood back shell */}
        <RoundedBox
          args={[1.55, 1.3, 0.18]}
          radius={0.22}
          smoothness={6}
          position={[0, 0.45, -0.5]}
          castShadow
          receiveShadow
        >
          {wood}
        </RoundedBox>

        {/* Wood side panels (arms outer shells) */}
        <RoundedBox
          args={[0.18, 1.1, 0.95]}
          radius={0.14}
          smoothness={5}
          position={[-0.78, 0.3, -0.05]}
          castShadow
        >
          {wood}
        </RoundedBox>
        <RoundedBox
          args={[0.18, 1.1, 0.95]}
          radius={0.14}
          smoothness={5}
          position={[0.78, 0.3, -0.05]}
          castShadow
        >
          {wood}
        </RoundedBox>

        {/* Headrest cushion */}
        <RoundedBox
          args={[1.3, 0.32, 0.42]}
          radius={0.16}
          smoothness={5}
          position={[0, 1.05, -0.34]}
          castShadow
        >
          {leather}
        </RoundedBox>

        {/* Back cushion */}
        <RoundedBox
          args={[1.32, 0.92, 0.36]}
          radius={0.18}
          smoothness={5}
          position={[0, 0.4, -0.32]}
          castShadow
        >
          {leather}
        </RoundedBox>

        {/* Seat cushion */}
        <RoundedBox
          args={[1.3, 0.3, 0.95]}
          radius={0.16}
          smoothness={5}
          position={[0, -0.22, 0.02]}
          castShadow
          receiveShadow
        >
          {leather}
        </RoundedBox>

        {/* Armrest top cushions */}
        <RoundedBox
          args={[0.22, 0.12, 0.9]}
          radius={0.06}
          smoothness={4}
          position={[-0.7, 0.05, 0]}
          castShadow
        >
          {leather}
        </RoundedBox>
        <RoundedBox
          args={[0.22, 0.12, 0.9]}
          radius={0.06}
          smoothness={4}
          position={[0.7, 0.05, 0]}
          castShadow
        >
          {leather}
        </RoundedBox>

        {/* Center pole */}
        <mesh position={[0, -0.6, -0.05]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.55, 28]} />
          {metal}
        </mesh>

        {/* 5-star base */}
        <group position={[0, -0.88, -0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.13, 0.15, 0.08, 28]} />
            {metal}
          </mesh>

          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i * Math.PI * 2) / 5;
            return (
              <group key={i} rotation={[0, angle, 0]}>
                <mesh
                  position={[0.45, -0.02, 0]}
                  rotation={[0, 0, -0.05]}
                  castShadow
                >
                  <boxGeometry args={[0.9, 0.05, 0.11]} />
                  {metal}
                </mesh>
                <mesh position={[0.88, -0.05, 0]} castShadow>
                  <sphereGeometry args={[0.05, 18, 18]} />
                  {metal}
                </mesh>
              </group>
            );
          })}
        </group>
      </group>
    </Float>
  );
}
