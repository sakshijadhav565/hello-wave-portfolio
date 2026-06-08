/**
 * Subtle ambient background: a few faint cyan glow dots that drift and pulse
 * very slowly. CSS-only, pointer-events none, sits behind content.
 */
const AmbientAtmosphere = () => {
  const CYAN = "#00E5FF";
  const dots = [
    { top: "12%", left: "8%",  size: 4, delay: 0,   dur: 9 },
    { top: "28%", left: "82%", size: 3, delay: 1.4, dur: 11 },
    { top: "44%", left: "18%", size: 5, delay: 0.6, dur: 13 },
    { top: "62%", left: "70%", size: 3, delay: 2.1, dur: 10 },
    { top: "78%", left: "12%", size: 4, delay: 1.0, dur: 12 },
    { top: "88%", left: "88%", size: 3, delay: 0.3, dur: 14 },
    { top: "20%", left: "48%", size: 2, delay: 1.8, dur: 9 },
    { top: "55%", left: "92%", size: 2, delay: 0.9, dur: 10 },
    { top: "70%", left: "40%", size: 3, delay: 2.4, dur: 11 },
  ];

  return (
    <>
      <style>{`
        @keyframes erp-amb-pulse {
          0%, 100% { opacity: 0.15; transform: translateY(0); }
          50%      { opacity: 0.55; transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .erp-amb-dot { animation: none !important; opacity: 0.25 !important; }
        }
      `}</style>
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, hsla(187,100%,50%,0.04), transparent 45%), radial-gradient(circle at 80% 70%, hsla(342,100%,59%,0.03), transparent 50%)",
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
              boxShadow: `0 0 ${d.size * 4}px ${CYAN}, 0 0 ${d.size * 8}px hsla(187,100%,50%,0.4)`,
              animation: `erp-amb-pulse ${d.dur}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default AmbientAtmosphere;
