"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./CodeArchitectScene").then((m) => ({ default: m.CodeArchitectScene })), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center" style={{ background: "#0a1628" }}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[rgba(255,255,255,0.05)] border-t-[#00d4ff]" />
        <p className="font-mono text-sm" style={{ color: "#94A3B8" }}>
          Loading 3D scene...
        </p>
      </div>
    </div>
  ),
});

export function Scene3DLoader() {
  return <Scene />;
}
