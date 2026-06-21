"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PC = 260;

export function DriftingParticles({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const aPos = new Float32Array(PC * 3);
    for (let i = 0; i < PC; i++) {
      aPos[i * 3] = (Math.random() - 0.5) * 30;
      aPos[i * 3 + 1] = Math.random() * 7 + 0.5;
      aPos[i * 3 + 2] = (Math.random() - 0.5) * 24 - 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(aPos, 3));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0x9fe8ff,
        size: 0.05,
        transparent: true,
        opacity: 0.55,
        fog: true,
      }),
    [],
  );

  useFrame(() => {
    if (!ref.current) return;
    const ap = ref.current.geometry.attributes.position;
    const speed = reduced ? 0 : 0.004;
    for (let i = 0; i < PC; i++) {
      let y = ap.getY(i) + speed;
      if (y > 8) y = 0.5;
      ap.setY(i, y);
    }
    ap.needsUpdate = true;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}
