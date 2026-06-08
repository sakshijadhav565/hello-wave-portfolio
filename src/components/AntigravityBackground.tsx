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

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none -z-20"
      style={{
        opacity: isMobile ? 0.12 : 0.18,
        filter: `blur(${isMobile ? 18 : 26}px) saturate(1.1)`,
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,1) 100%)",
        maskImage:
          "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,1) 100%)",
      }}
    >
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
    </div>
  );
};

export default AntigravityBackground;
