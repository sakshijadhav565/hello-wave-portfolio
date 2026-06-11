import { useEffect, useState } from "react";
import Antigravity from "./Antigravity";

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

  // Disable the WebGL canvas entirely on mobile or reduced-motion.
  // The full-screen blur filter over a live <canvas> is what was tanking
  // the production build (continuous GPU recomposite).
  if (isMobile || reduced) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none -z-20"
      style={{
        opacity: 0.14,
        // Drop heavy filter blur — it forced a fullscreen GPU readback
        // every animation frame. The mask alone gives the soft falloff.
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,1) 100%)",
        maskImage:
          "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,1) 100%)",
      }}
    >
      <Antigravity
        count={80}
        color="#00E5FF"
        particleSize={1.1}
        particleShape="capsule"
        waveSpeed={0.2}
        waveAmplitude={0.7}
        rotationSpeed={0.03}
        pulseSpeed={2}
        fieldStrength={4}
        magnetRadius={0}
        lerpSpeed={0.03}
        autoAnimate
      />
    </div>
  );
};

export default AntigravityBackground;
