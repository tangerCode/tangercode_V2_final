"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BLUE = new THREE.Color(0x0a3a8c);
const CYAN = new THREE.Color(0x00d4ff);
const CORAL = new THREE.Color(0xff6b35);

const SEG = 110;
const SIZE = 34;

function heightAt(x: number, z: number, t: number): number {
  return (
    Math.sin(x * 0.45 + t) * 0.3 +
    Math.sin(z * 0.32 + t * 0.8) * 0.42 +
    Math.sin((x + z) * 0.22 + t * 1.25) * 0.22 +
    Math.sin((x - z) * 0.55 + t * 1.6) * 0.12
  );
}

export function WaveMesh({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const baseRef = useRef<Float32Array | null>(null);
  const posRef = useRef<THREE.BufferAttribute | null>(null);
  const colRef = useRef<THREE.BufferAttribute | null>(null);
  const countRef = useRef(0);
  const clockRef = useRef<THREE.Clock | null>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const count = pos.count;

    const base = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      base[i * 2] = pos.getX(i);
      base[i * 2 + 1] = pos.getZ(i);
    }
    baseRef.current = base;
    posRef.current = pos as THREE.BufferAttribute;
    countRef.current = count;

    const colors = new Float32Array(count * 3);
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    colRef.current = geo.attributes.color as THREE.BufferAttribute;

    clockRef.current = new THREE.Clock();
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.07,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        sizeAttenuation: true,
        fog: true,
      }),
    [],
  );

  useFrame(() => {
    if (!meshRef.current || !posRef.current || !colRef.current || !baseRef.current) return;
    const clock = clockRef.current;
    if (!clock) return;

    const t = reduced ? 0.5 : clock.getElapsedTime() * 0.6;
    const pos = posRef.current;
    const colors = colRef.current;
    const base = baseRef.current;
    const count = countRef.current;
    const tmp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const x = base[i * 2];
      const z = base[i * 2 + 1];
      const h = heightAt(x, z, t);
      pos.setY(i, h);

      const n = Math.min(Math.max((h + 0.8) / 1.8, 0), 1);
      tmp.copy(BLUE).lerp(CYAN, n);
      if (n > 0.82) tmp.lerp(CORAL, (n - 0.82) / 0.18 * 0.5);
      colors.setXYZ(i, tmp.r, tmp.g, tmp.b);
    }
    pos.needsUpdate = true;
    (meshRef.current.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geometry} material={material} position={[0, -1.4, 0]} />
  );
}
