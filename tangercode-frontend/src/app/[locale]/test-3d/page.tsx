import { setRequestLocale } from "next-intl/server";
import { Scene3DLoader } from "@/components/3d/Scene3DLoader";

type Props = {
  params: { locale: string };
};

export default function Test3DPage({ params }: Props) {
  setRequestLocale(params.locale);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden", background: "#0a1628" }}>
      {/* hero-glow overlay (z-0) */}
      <div
        className="hero-glow"
        style={{
          position: "absolute",
          zIndex: 0,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60vw",
          height: "60vw",
          maxWidth: 720,
          maxHeight: 720,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.22), rgba(0,82,204,0.10) 45%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* 3D Scene (z-1) */}
      <Scene3DLoader />

      {/* hero-veil overlay (z-2) */}
      <div
        className="hero-veil"
        style={{
          position: "absolute",
          zIndex: 2,
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, #0a1628 78%), linear-gradient(180deg, transparent 60%, #0a1628 98%)`,
        }}
      />

      {/* code-bits overlay (z-3) — placeholder for now */}
      <div
        className="code-bits"
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 3,
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />
    </div>
  );
}
