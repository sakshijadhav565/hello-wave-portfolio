import { useEffect, useState } from "react";

/**
 * Ambient background: soft cyan radial glow particles.
 * Tuned for production stability: low count, small glow radii, GPU-friendly
 * transforms, disabled on small screens and when reduced-motion is set.
 */
const AmbientAtmosphere = () => {
  const CYAN = "#22e3ff";

  const [enabled, setEnabled] = useState(false);
  const [count, setCount] = useState(28);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      // Fully disable on mobile or when user prefers reduced motion —
      // 80 glowing DOM nodes with large box-shadows is what was flickering
      // in the production build.
      if (mqMobile.matches || mqReduced.matches) {
        setEnabled(false);
      } else {
        setEnabled(true);
        setCount(28);
      }
    };
    sync();
    mqMobile.addEventListener("change", sync);
    mqReduced.addEventListener("change", sync);
    return () => {
      mqMobile.removeEventListener("change", sync);
      mqReduced.removeEventListener("change", sync);
    };
  }, []);

  // Deterministic pseudo-random so positions stay stable between renders
  const rand = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  const dots = Array.from({ length: count }, (_, i) => {
    const size = 2 + rand(i + 1) * 4; // 2 – 6 px core
    return {
      top: `${rand(i + 11) * 100}%`,
      left: `${rand(i + 23) * 100}%`,
      size,
      delay: rand(i + 37) * 8,
      dur: 8 + rand(i + 53) * 8, // 8 – 16 s (slower = cheaper)
      base: 0.25 + rand(i + 71) * 0.3,
    };
  });

  return (
    <>
      <style>{`
        @keyframes erp-amb-pulse {
          0%, 100% { opacity: var(--base, 0.3); }
          50%      { opacity: 1; }
        }
      `}</style>
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, hsla(187,100%,50%,0.05), transparent 45%), radial-gradient(circle at 80% 70%, hsla(342,100%,59%,0.03), transparent 50%)",
        }}
      >
        {enabled &&
          dots.map((d, i) => (
            <span
              key={i}
              className="erp-amb-dot absolute rounded-full"
              style={{
                top: d.top,
                left: d.left,
                width: d.size,
                height: d.size,
                background: CYAN,
                // Smaller blur radii — large box-shadow blur is the
                // single most expensive paint op when repeated 80x.
                boxShadow: `0 0 ${d.size * 3}px ${CYAN}, 0 0 ${d.size * 7}px hsla(187,90%,55%,0.4)`,
                ["--base" as any]: d.base,
                opacity: d.base,
                animation: `erp-amb-pulse ${d.dur}s ease-in-out ${d.delay}s infinite`,
              }}
            />
          ))}
      </div>
    </>
  );
};

export default AmbientAtmosphere;
