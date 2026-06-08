/**
 * Ambient background: many soft cyan radial glow particles drifting across
 * the whole page. CSS-only, pointer-events none, sits behind content.
 */
const AmbientAtmosphere = () => {
  const CYAN = "#22e3ff";
  const COUNT = 80;

  // Deterministic pseudo-random so positions stay stable between renders
  const rand = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  const dots = Array.from({ length: COUNT }, (_, i) => {
    const size = 2 + rand(i + 1) * 5;        // 2 – 7 px core
    return {
      top: `${rand(i + 11) * 100}%`,
      left: `${rand(i + 23) * 100}%`,
      size,
      delay: rand(i + 37) * 8,
      dur: 6 + rand(i + 53) * 8,              // 6 – 14 s
      base: 0.25 + rand(i + 71) * 0.35,       // base opacity
    };
  });

  return (
    <>
      <style>{`
        @keyframes erp-amb-pulse {
          0%, 100% { opacity: var(--base, 0.3); transform: translateY(0) scale(1); }
          50%      { opacity: 1;                transform: translateY(-8px) scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .erp-amb-dot { animation: none !important; }
        }
      `}</style>
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, hsla(187,100%,50%,0.06), transparent 45%), radial-gradient(circle at 80% 70%, hsla(342,100%,59%,0.04), transparent 50%)",
        }}
      >
        {dots.map((d, i) => (
          <span
            key={i}
            className="erp-amb-dot absolute rounded-full"
            style={{
              top: d.top,
              left: d.left,
              width: d.size,
              height: d.size,
              background: CYAN,
              boxShadow: `0 0 ${d.size * 5}px ${CYAN}, 0 0 ${d.size * 12}px hsla(187,90%,55%,0.55), 0 0 ${d.size * 22}px hsla(187,90%,55%,0.25)`,
              ["--base" as any]: d.base,
              opacity: d.base,
              animation: `erp-amb-pulse ${d.dur}s ease-in-out ${d.delay}s infinite`,
              willChange: "opacity, transform",
            }}
          />
        ))}
      </div>
    </>
  );
};

export default AmbientAtmosphere;
