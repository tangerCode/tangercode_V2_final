"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WaveMesh } from "./WaveMesh";
import { DriftingParticles } from "./DriftingParticles";

const BG = 0x0a1628;

function CameraController({ target }: { target: { x: number; y: number } }) {
  const { camera } = useThree();
  const mx = useRef(0);
  const my = useRef(0);

  useFrame(() => {
    mx.current += (target.x - mx.current) * 0.04;
    my.current += (target.y - my.current) * 0.04;
    camera.position.x = mx.current * 2.2;
    camera.position.y = 2.6 - my.current * 1.2;
    camera.lookAt(0, -0.6, -6);
  });

  return null;
}

export function CodeArchitectScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({
      x: e.clientX / window.innerWidth - 0.5,
      y: e.clientY / window.innerHeight - 0.5,
    });
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    >
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 100, position: [0, 2.6, 8] }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2(BG, 0.085);
          scene.background = new THREE.Color(BG);
        }}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      >
        <CameraController target={mouse} />
        <WaveMesh reduced={reduced} />
        <DriftingParticles reduced={reduced} />
      </Canvas>
    </div>
  );
}
