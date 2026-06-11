import { useEffect, useState } from "react";

/**
 * Lightweight CSS-only ambient glows positioned behind major sections of the
 * ERP case study. No canvas, no WebGL, no per-frame work — just a handful of
 * large blurred radial gradients with a very slow drift animation.
 */
type GlowKind = "cyan" | "duo";

const TARGETS: { id: string; kind: GlowKind; side: "left" | "right" | "center" }[] = [
  { id: "hero",          kind: "duo",  side: "center" },
  { id: "research",      kind: "cyan", side: "left"   },
  { id: "personas",      kind: "duo",  side: "right"  },
  { id: "evaluation",    kind: "cyan", side: "left"   },
  { id: "prototype",     kind: "duo",  side: "right"  },
  { id: "outcomes",      kind: "cyan", side: "center" },
];

const SectionGlows = () => {
  const [rects, setRects] = useState<{ top: number; height: number; cfg: typeof TARGETS[number] }[]>([]);

  useEffect(() => {
    const measure = () => {
      const next: typeof rects = [];
      for (const cfg of TARGETS) {
        const el = document.getElementById(cfg.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        next.push({ top: r.top + window.scrollY, height: r.height, cfg });
      }
      setRects(next);
    };
    // Measure after layout settles
    const t = setTimeout(measure, 80);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t); window.removeEventListener("resize", measure); };
  }, []);

  return (
    <>
      <style>{`
        @keyframes erp-glow-drift-a {
          0%, 100% { transform: translate3d(-4%, -2%, 0); }
          50%      { transform: translate3d( 4%,  3%, 0); }
        }
        @keyframes erp-glow-drift-b {
          0%, 100% { transform: translate3d( 3%,  2%, 0); }
          50%      { transform: translate3d(-3%, -3%, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .erp-glow { animation: none !important; }
        }
      `}</style>
      <div aria-hidden className="absolute inset-x-0 top-0 pointer-events-none -z-10 overflow-hidden" style={{ height: "100%" }}>
        {rects.map(({ top, height, cfg }, i) => {
          const sizeW = Math.max(720, Math.min(1200, height * 1.6));
          const sizeH = Math.max(520, Math.min(900, height * 1.2));
          const leftPct = cfg.side === "left" ? -10 : cfg.side === "right" ? 60 : 20;
          const isDuo = cfg.kind === "duo";
          const bg = isDuo
            ? "radial-gradient(circle at 30% 50%, rgba(0,229,255,0.10) 0%, transparent 65%), radial-gradient(circle at 70% 55%, rgba(255,0,128,0.05) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(0,229,255,0.09) 0%, transparent 70%)";
          return (
            <div
              key={cfg.id}
              className="erp-glow absolute"
              style={{
                top: top + height / 2 - sizeH / 2,
                left: `${leftPct}%`,
                width: sizeW,
                height: sizeH,
                background: bg,
                filter: "blur(80px)",
                opacity: 0.9,
                animation: `${i % 2 === 0 ? "erp-glow-drift-a" : "erp-glow-drift-b"} ${28 + (i % 3) * 6}s ease-in-out infinite`,
                willChange: "transform",
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default SectionGlows;
