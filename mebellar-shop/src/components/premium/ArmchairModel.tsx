"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

export type ChairMaterial =
  | "Leather"
  | "Velvet"
  | "Matte fabric"
  | "Wood"
  | "Suede";

export type ChairColor =
  | "Black"
  | "Warm brown"
  | "Cream white"
  | "Graphite"
  | "Luxury beige";

export interface ChairConfig {
  rotation: { x: number; y: number; z: number };
  color: ChairColor;
  material: ChairMaterial;
}

const COLOR_MAP: Record<ChairColor, string> = {
  Black: "#1c1c1c",
  "Warm brown": "#6b4a32",
  "Cream white": "#f2ece2",
  Graphite: "#2e2e32",
  "Luxury beige": "#cfc0a8",
};

function makeFabricTexture(seed: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#f8f8f8";
  ctx.fillRect(0, 0, 512, 512);

  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;

  const img = ctx.getImageData(0, 0, 512, 512);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    s = (1664525 * s + 1013904223) >>> 0;
    const n = ((s >>> 16) & 255) / 255;
    const v = 228 + Math.floor(n * 22);
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function ArmchairModel({ config }: { config: ChairConfig }) {
  const group = useRef<THREE.Group>(null);
  const baseColor = COLOR_MAP[config.color];

  const fabricMap = useMemo(
    () =>
      typeof window !== "undefined"
        ? makeFabricTexture(`${config.material}-${config.color}`)
        : null,
    [config.material, config.color]
  );

  const upholstery = useMemo(() => {
    const roughness =
      config.material === "Leather"
        ? 0.38
        : config.material === "Velvet"
          ? 0.72
          : config.material === "Suede"
            ? 0.8
            : config.material === "Matte fabric"
              ? 0.86
              : 0.55;
    const clearcoat = config.material === "Leather" ? 0.65 : 0.1;
    const sheen = config.material === "Velvet" ? 0.85 : 0.25;

    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(baseColor),
      metalness: 0.04,
      roughness,
      clearcoat,
      clearcoatRoughness: 0.28,
      sheen,
      sheenRoughness: 0.7,
      map: fabricMap ?? undefined,
    });
  }, [baseColor, config.material, fabricMap]);

  const woodLegs = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#5c4030",
        roughness: 0.68,
        metalness: 0.02,
      }),
    []
  );

  const metalLegs = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#a8a8ad",
        metalness: 0.9,
        roughness: 0.18,
      }),
    []
  );

  const legsMat = config.material === "Wood" ? woodLegs : metalLegs;
  const rot = config.rotation;

  return (
    <group ref={group} rotation={[rot.x, rot.y, rot.z]} castShadow>
      {/* Seat */}
      <RoundedBox
        args={[1.05, 0.22, 0.95]}
        radius={0.1}
        smoothness={8}
        position={[0, 0.38, 0.02]}
        castShadow
        receiveShadow
      >
        <primitive object={upholstery} attach="material" />
      </RoundedBox>

      {/* Backrest — biroz orqaga egilgan */}
      <group position={[0, 0.72, -0.38]} rotation={[-0.18, 0, 0]}>
        <RoundedBox args={[1.0, 0.78, 0.18]} radius={0.1} smoothness={8} castShadow>
          <primitive object={upholstery} attach="material" />
        </RoundedBox>
      </group>

      {/* Armrests */}
      <RoundedBox
        args={[0.14, 0.42, 0.88]}
        radius={0.08}
        smoothness={8}
        position={[-0.58, 0.58, 0.02]}
        rotation={[0, 0, 0.08]}
        castShadow
      >
        <primitive object={upholstery} attach="material" />
      </RoundedBox>
      <RoundedBox
        args={[0.14, 0.42, 0.88]}
        radius={0.08}
        smoothness={8}
        position={[0.58, 0.58, 0.02]}
        rotation={[0, 0, -0.08]}
        castShadow
      >
        <primitive object={upholstery} attach="material" />
      </RoundedBox>

      {/* Skirt / base */}
      <RoundedBox
        args={[0.92, 0.1, 0.82]}
        radius={0.06}
        smoothness={6}
        position={[0, 0.22, 0.02]}
        castShadow
      >
        <meshPhysicalMaterial color="#222222" roughness={0.5} metalness={0.35} />
      </RoundedBox>

      {/* Legs */}
      {(
        [
          [-0.38, 0.06, 0.34],
          [0.38, 0.06, 0.34],
          [-0.38, 0.06, -0.3],
          [0.38, 0.06, -0.3],
        ] as const
      ).map((p, i) => (
        <mesh key={i} position={[...p]} castShadow>
          <cylinderGeometry args={[0.028, 0.024, 0.28, 16]} />
          <primitive object={legsMat} attach="material" />
        </mesh>
      ))}
    </group>
  );
}
