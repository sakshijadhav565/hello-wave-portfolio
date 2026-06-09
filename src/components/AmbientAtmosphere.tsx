/**
 * Ambient background: dense soft cyan radial glow particles drifting across
 * the whole page with parallax, twinkle, and hero particles for depth.
 */
import { useEffect, useState } from "react";

const AmbientAtmosphere = () => {
  const CYAN = "#22e3ff";
  const COUNT = 180;          // standard particles (~3x previous)
  const HERO_COUNT = 14;      // large depth particles

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Deterministic pseudo-random so positions stay stable between renders
  const rand = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  const dots = Array.from({ length: COUNT }, (_, i) => {
    const size = 4 + rand(i + 1) * 6;             // 4 – 10 px
    return {
      top: rand(i + 11) * 260,                    // % across very tall page
      left: rand(i + 23) * 100,
      size,
      delay: rand(i + 37) * 8,
      dur: 4 + rand(i + 53) * 7,                  // 4 – 11 s (faster twinkle)
      base: 0.45 + rand(i + 71) * 0.4,            // 0.45 – 0.85 base opacity
      depth: 0.15 + rand(i + 89) * 0.55,          // parallax depth
      trail: rand(i + 101) > 0.82,                // ~18% have light trail
    };
  });

  const heroes = Array.from({ length: HERO_COUNT }, (_, i) => {
    const size = 12 + rand(i + 211) * 6;          // 12 – 18 px
    return {
      top: rand(i + 233) * 260,
      left: rand(i + 257) * 100,
      size,
      delay: rand(i + 271) * 6,
      dur: 8 + rand(i + 293) * 6,
      depth: 0.05 + rand(i + 311) * 0.25,
    };
  });

  // Large ambient orbs (cyan + a hint of magenta), spread vertically
  const orbs = [
    { top: 5,   left: 8,  size: 520, hue: 187, alpha: 0.18, depth: 0.08 },
    { top: 22,  left: 78, size: 460, hue: 200, alpha: 0.14, depth: 0.12 },
    { top: 45,  left: 12, size: 600, hue: 187, alpha: 0.16, depth: 0.16 },
    { top: 62,  left: 70, size: 520, hue: 210, alpha: 0.15, depth: 0.20 },
    { top: 82,  left: 20, size: 560, hue: 187, alpha: 0.17, depth: 0.24 },
    { top: 100, left: 80, size: 500, hue: 342, alpha: 0.10, depth: 0.28 },
    { top: 130, left: 30, size: 620, hue: 187, alpha: 0.18, depth: 0.32 },
    { top: 160, left: 70, size: 540, hue: 200, alpha: 0.14, depth: 0.36 },
    { top: 190, left: 15, size: 580, hue: 187, alpha: 0.16, depth: 0.40 },
    { top: 220, left: 75, size: 500, hue: 210, alpha: 0.13, depth: 0.44 },
  ];

  return (
    <>
      <style>{`
        @keyframes erp-amb-pulse {
          0%, 100% { opacity: var(--base, 0.5); transform: translateY(0) scale(1); }
          50%      { opacity: 1;                transform: translateY(-10px) scale(1.25); }
        }
        @keyframes erp-amb-twinkle {
          0%, 100% { opacity: var(--base, 0.5); transform: scale(1); }
          45%      { opacity: 1; transform: scale(1.35); }
          50%      { opacity: 0.2; transform: scale(0.9); }
          55%      { opacity: 1; transform: scale(1.3); }
        }
        @keyframes erp-amb-drift {
          0%   { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50%  { transform: translate(20px, -30px) scale(1.15); opacity: 0.95; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          .erp-amb-dot, .erp-amb-hero, .erp-amb-orb { animation: none !important; }
        }
      `}</style>

      {/* Orb layer (deepest) */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none -z-20 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, hsla(187,100%,50%,0.10), transparent 50%), radial-gradient(circle at 82% 78%, hsla(342,100%,59%,0.06), transparent 55%)",
        }}
      >
        {orbs.map((o, i) => (
          <div
            key={i}
            className="erp-amb-orb absolute rounded-full"
            style={{
              top: `${o.top}vh`,
              left: `${o.left}%`,
              width: o.size,
              height: o.size,
              transform: `translate(-50%, -50%) translateY(${-scrollY * o.depth}px)`,
              background: `radial-gradient(circle, hsla(${o.hue},100%,60%,${o.alpha}), transparent 70%)`,
              filter: "blur(40px)",
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Particle layer */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      >
        {/* Hero particles (large, soft) */}
        {heroes.map((h, i) => (
          <span
            key={`h${i}`}
            className="erp-amb-hero absolute rounded-full"
            style={{
              top: `${h.top}vh`,
              left: `${h.left}%`,
              width: h.size,
              height: h.size,
              background: CYAN,
              transform: `translateY(${-scrollY * h.depth}px)`,
              boxShadow: `0 0 ${h.size * 4}px ${CYAN}, 0 0 ${h.size * 10}px hsla(187,90%,55%,0.7), 0 0 ${h.size * 22}px hsla(187,90%,55%,0.35)`,
              opacity: 0.7,
              animation: `erp-amb-drift ${h.dur}s ease-in-out ${h.delay}s infinite`,
              willChange: "opacity, transform",
            }}
          />
        ))}

        {/* Standard particles */}
        {dots.map((d, i) => {
          const useTwinkle = i % 4 === 0;
          return (
            <span
              key={i}
              className="erp-amb-dot absolute rounded-full"
              style={{
                top: `${d.top}vh`,
                left: `${d.left}%`,
                width: d.size,
                height: d.size,
                background: CYAN,
                transform: `translateY(${-scrollY * d.depth}px)`,
                boxShadow: d.trail
                  ? `0 0 ${d.size * 3}px ${CYAN}, 0 ${d.size * 2}px ${d.size * 6}px hsla(187,90%,55%,0.55), 0 0 ${d.size * 14}px hsla(187,90%,55%,0.5), 0 0 ${d.size * 28}px hsla(187,90%,55%,0.35)`
                  : `0 0 ${d.size * 3}px ${CYAN}, 0 0 ${d.size * 8}px hsla(187,90%,55%,0.75), 0 0 ${d.size * 18}px hsla(187,90%,55%,0.4)`,
                ["--base" as any]: d.base,
                opacity: d.base,
                animation: `${useTwinkle ? "erp-amb-twinkle" : "erp-amb-pulse"} ${d.dur}s ease-in-out ${d.delay}s infinite`,
                willChange: "opacity, transform",
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default AmbientAtmosphere;
