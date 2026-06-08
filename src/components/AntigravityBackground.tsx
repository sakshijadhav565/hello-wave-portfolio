import { Canvas } from "@react-three/fiber";
import { lazy, Suspense, useEffect, useState } from "react";
import Antigravity from "./Antigravity";

/**
 * Ambient background layer using the Antigravity particle field.
 * - Fixed behind content (z-index negative)
 * - Heavy blur + very low opacity for a diffused "data nebula" feel
 * - Cyan tones to match design system
 * - Disabled pointer events
 * - Reduced particle count on mobile for performance
 */
const AntigravityBackground = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setIsMobile(mq.matches);
      setReduced(rm.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    rm.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      rm.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none -z-20"
      style={{
        opacity: isMobile ? 0.12 : 0.18,
        filter: `blur(${isMobile ? 18 : 26}px) saturate(1.1)`,
        // Soft radial fade so particles dim behind content-heavy center
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,1) 100%)",
        maskImage:
          "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,1) 100%)",
      }}
    >
      <Canvas
        dpr={[1, isMobile ? 1.25 : 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 18], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Antigravity
            count={isMobile ? 60 : 130}
            color="#00E5FF"
            particleSize={1.1}
            particleShape="capsule"
            waveSpeed={reduced ? 0.05 : 0.25}
            waveAmplitude={0.7}
            rotationSpeed={reduced ? 0 : 0.04}
            pulseSpeed={2}
            fieldStrength={4}
            magnetRadius={0}
            lerpSpeed={0.03}
            autoAnimate={!reduced}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AntigravityBackground;
