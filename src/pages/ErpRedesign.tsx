import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Figma, Search, BarChart3, PenTool, Palette, MousePointer2,
  CheckCircle2, Quote, AlertTriangle, Target, Lightbulb, ArrowRight,
  MessageSquare, Layers, Type, Sparkles, ExternalLink,
} from "lucide-react";

import loginBefore from "@/assets/erp-login-before.png";
import loginAfter from "@/assets/erp-login-after.png";
import homeBefore from "@/assets/erp-home-before.png";
import homeAfter from "@/assets/erp-home-after.png";
import attBefore from "@/assets/erp-attendance-before.png";
import attAfter from "@/assets/erp-attendance-after.png";
import examBefore from "@/assets/erp-exam-before.png";
import examAfter from "@/assets/erp-exam-after.png";
import gradeBefore from "@/assets/erp-grade-before.png";
import gradeAfter from "@/assets/erp-grade-after.png";
import dashboardImg from "@/assets/erp-dashboard.png";
import gradeCardImg from "@/assets/erp-gradecard.png";
import testScoreImg from "@/assets/erp-testscore.png";
import academicsImg from "@/assets/erp-academics.png";
import prototypeVideo from "@/assets/erp-prototype.mov";

import personaAarohi from "@/assets/persona-aarohi.jpg";
import personaNeha from "@/assets/persona-neha.jpg";

const CYAN = "hsl(187, 100%, 50%)";
const PINK = "hsl(342, 100%, 59%)";
const GREEN = "hsl(150, 90%, 55%)";

/* ── Particles ── */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const N = 28;
    const ps = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      sx: (Math.random() - 0.5) * 0.0004,
      sy: (Math.random() - 0.5) * 0.0003,
      r: Math.random() * 1.4 + 0.4,
      o: Math.random() * 0.25 + 0.08,
      pink: Math.random() > 0.7,
    }));
    const draw = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.sx; p.y += p.sy;
        if (p.x < 0 || p.x > 1) p.sx *= -1;
        if (p.y < 0 || p.y > 1) p.sy *= -1;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.pink ? `hsla(342,100%,59%,${p.o})` : `hsla(187,100%,50%,${p.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-70" />;
}

/* ── Custom cursor (cyan trailing dot) ── */
function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let tx = mx, ty = my;
    let raf = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);
    const loop = () => {
      tx += (mx - tx) * 0.18; ty += (my - ty) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
      if (trailRef.current) trailRef.current.style.transform = `translate3d(${tx - 14}px, ${ty - 14}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);
  return (
    <>
      <div ref={trailRef} className="fixed top-0 left-0 w-7 h-7 rounded-full pointer-events-none z-[100] hidden md:block"
        style={{ border: "1px solid hsla(187,100%,50%,0.4)", background: "hsla(187,100%,50%,0.04)", mixBlendMode: "screen" }} />
      <div ref={dotRef} className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[101] hidden md:block"
        style={{ background: CYAN, boxShadow: "0 0 12px hsla(187,100%,50%,0.9)" }} />
    </>
  );
}

/* ── Scroll progress bar ── */
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[99] bg-transparent">
      <div className="h-full" style={{ width: `${p}%`, background: `linear-gradient(90deg, ${CYAN}, hsl(210,100%,60%))`, boxShadow: "0 0 8px hsla(187,100%,50%,0.7)" }} />
    </div>
  );
}

/* ── Sticky floating nav ── */
const NAV_SECTIONS = [
  ["problem", "Problem"], ["research", "Research"], ["personas", "Personas"],
  ["evaluation", "Evaluation"], ["flow", "Flow"], ["prototype", "Prototype"],
  ["transformation", "Before/After"], ["outcomes", "Outcomes"],
];
function StickyNav() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(NAV_SECTIONS[0][0]);
  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 600);
      const y = window.scrollY + 200;
      for (let i = NAV_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_SECTIONS[i][0]);
        if (el && el.offsetTop <= y) { setActive(NAV_SECTIONS[i][0]); return; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 hidden md:flex ${show ? "top-4 opacity-100" : "-top-16 opacity-0"}`}>
      <div className="flex items-center gap-1 px-2 py-1.5 rounded-full"
        style={{ background: "hsla(0,0%,4%,0.7)", backdropFilter: "blur(12px)", border: "1px solid hsla(187,100%,50%,0.25)", boxShadow: "0 8px 30px rgba(0,0,0,0.5), 0 0 20px hsla(187,100%,50%,0.1)" }}>
        {NAV_SECTIONS.map(([id, label]) => (
          <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wide transition-all ${active === id ? "text-black" : "text-white/60 hover:text-white"}`}
            style={active === id ? { background: CYAN, boxShadow: `0 0 14px hsla(187,100%,50%,0.5)` } : {}}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Illustrated cartoon rocket with trail ── */
function BigRocket({ size = 110, accent = CYAN, trailColor = "#22d3ee" }: { size?: number; accent?: string; trailColor?: string }) {
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      {/* trail */}
      <div className="erp-rocket-trail" style={{
        position: "absolute", right: "100%", top: "50%", width: size * 2.6, height: 4,
        transform: "translateY(-50%)",
        background: `linear-gradient(90deg, transparent, ${trailColor}33, ${trailColor}99)`,
        filter: `blur(6px) drop-shadow(0 0 10px ${trailColor}88)`,
        borderRadius: 999, opacity: 0.35,
      }} />
      <svg viewBox="0 0 120 120" width={size} height={size} style={{ filter: `drop-shadow(0 0 14px ${accent}) drop-shadow(0 0 28px ${accent}55)` }}>
        {/* flame */}
        <ellipse cx="28" cy="60" rx="18" ry="6" fill="url(#flameG)" className="erp-rocket-flame"/>
        <defs>
          <linearGradient id="flameG" x1="0" x2="1">
            <stop offset="0%" stopColor={trailColor} stopOpacity="0"/>
            <stop offset="60%" stopColor={trailColor} stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#fff" stopOpacity="1"/>
          </linearGradient>
          <linearGradient id="bodyG" x1="0" x2="1">
            <stop offset="0%" stopColor="#1a2840"/>
            <stop offset="100%" stopColor="#0a1525"/>
          </linearGradient>
        </defs>
        {/* body */}
        <path d="M50 50 Q80 38 104 60 Q80 82 50 70 Z" fill="url(#bodyG)" stroke={accent} strokeWidth="2"/>
        {/* nose tip */}
        <path d="M100 56 L112 60 L100 64 Z" fill={accent} opacity="0.85"/>
        {/* window */}
        <circle cx="78" cy="60" r="6" fill="#0a1525" stroke={accent} strokeWidth="2"/>
        <circle cx="80" cy="58" r="2" fill={accent} opacity="0.6"/>
        {/* fins */}
        <path d="M58 50 L48 36 L60 50 Z" fill={accent} opacity="0.85"/>
        <path d="M58 70 L48 84 L60 70 Z" fill={accent} opacity="0.85"/>
      </svg>
    </div>
  );
}

function Rocket() {
  return (
    <>
      <div className="fixed pointer-events-none z-0 erp-rocket-a" style={{ opacity: 0.4 }}>
        <BigRocket size={90} accent={CYAN} trailColor="#22d3ee" />
      </div>
      <div className="fixed pointer-events-none z-0 erp-rocket-b" style={{ opacity: 0.3 }}>
        <BigRocket size={70} accent={PINK} trailColor="#f472b6" />
      </div>
      <style>{`
        @keyframes erp-rocket-path-a {
          0%   { transform: translate(-12vw, 92vh) rotate(-30deg); }
          25%  { transform: translate(-8vw, 60vh) rotate(-15deg); }
          50%  { transform: translate(-6vw, 30vh) rotate(0deg); }
          75%  { transform: translate(-4vw, 10vh) rotate(15deg); }
          100% { transform: translate(-2vw, -12vh) rotate(30deg); }
        }
        @keyframes erp-rocket-path-b {
          0%   { transform: translate(102vw, -8vh) rotate(150deg); }
          25%  { transform: translate(100vw, 25vh) rotate(165deg); }
          50%  { transform: translate(98vw, 55vh) rotate(180deg); }
          75%  { transform: translate(100vw, 80vh) rotate(195deg); }
          100% { transform: translate(102vw, 108vh) rotate(210deg); }
        }
        .erp-rocket-a { animation: erp-rocket-path-a 70s ease-in-out infinite; }
        .erp-rocket-b { animation: erp-rocket-path-b 85s ease-in-out infinite; animation-delay: -30s; }
        @keyframes erp-flame-flicker { 0%,100% { opacity: 0.7; transform: scaleX(1);} 50% { opacity: 1; transform: scaleX(1.15);} }
        .erp-rocket-flame { transform-origin: 46px 60px; animation: erp-flame-flicker 0.25s ease-in-out infinite; }
        .erp-rocket-trail { animation: erp-flame-flicker 0.6s ease-in-out infinite; }
      `}</style>
    </>
  );
}

/* ── Starfield + Nebula background ── */
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => { c.width = c.offsetWidth * dpr; c.height = c.offsetHeight * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    resize(); window.addEventListener("resize", resize);
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.1 + 0.2,
      tw: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.02 + 0.005,
    }));
    let raf = 0;
    const draw = () => {
      const w = c.offsetWidth, h = c.offsetHeight;
      ctx.clearRect(0,0,w,h);
      for (const s of stars) {
        s.tw += s.sp;
        const o = 0.3 + Math.abs(Math.sin(s.tw)) * 0.6;
        ctx.beginPath();
        ctx.arc(s.x*w, s.y*h, s.r, 0, Math.PI*2);
        ctx.fillStyle = `hsla(0,0%,100%,${o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none -z-10" />;
}

/* ── Mouse-follow glow ── */
function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      if (ref.current) ref.current.style.transform = `translate3d(${e.clientX - 300}px, ${e.clientY - 300}px, 0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div ref={ref} className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none -z-10 hidden md:block"
      style={{ background: "radial-gradient(circle, hsla(187,100%,50%,0.07) 0%, transparent 60%)", transition: "transform 0.2s ease-out" }} />
  );
}

/* ── Reveal on scroll ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, v } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) ${delay}s`,
      willChange: "opacity, transform",
    }}>{children}</div>
  );
}

/* ── Animated count-up ── */
function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const { ref, v } = useReveal(0.3);
  const [n, setN] = useState(0);
  const target = parseFloat(value);
  const hasDecimal = value.includes(".");
  const suffix = value.replace(/[\d.]/g, "");
  useEffect(() => {
    if (!v) return;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(eased * target);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [v, target, duration]);
  return (
    <span ref={ref as any}>
      {hasDecimal ? n.toFixed(1) : Math.round(n)}{suffix}
    </span>
  );
}

/* ── Animated heuristic bar ── */
function HeuristicBar({ score, color }: { score: number; color: string }) {
  const { ref, v } = useReveal(0.3);
  return (
    <div ref={ref as any} className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-1.5">
      <div className="h-full rounded-full" style={{
        width: v ? `${score}%` : "0%",
        background: color === PINK
          ? "linear-gradient(90deg, hsla(342,100%,59%,0.8), hsla(342,100%,59%,0.4))"
          : "linear-gradient(90deg, hsla(187,100%,50%,0.8), hsla(187,100%,50%,0.4))",
        transition: "width 1.2s cubic-bezier(0.2,0.8,0.2,1)",
      }} />
    </div>
  );
}

/* ── Magnetic card ── */
function MagneticCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    el.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className}
      style={{ transition: "transform 0.3s ease-out", ...style }}>
      {children}
    </div>
  );
}

const card = "rounded-xl border border-white/10 bg-white/[0.025] erp-card";

function SectionLabel({ children, color = CYAN }: { children: React.ReactNode; color?: string }) {
  const isCyan = color === CYAN;
  return (
    <span className="inline-block font-mono text-[10px] font-medium tracking-[0.2em] px-3 py-1.5 rounded-full erp-pulse-pill"
      style={{
        color, border: `1px solid ${isCyan ? "hsla(187,100%,50%,0.5)" : "hsla(342,100%,59%,0.5)"}`,
        background: isCyan ? "hsla(187,100%,50%,0.08)" : "hsla(342,100%,59%,0.08)",
        boxShadow: isCyan ? "0 0 16px hsla(187,100%,50%,0.25)" : "0 0 16px hsla(342,100%,59%,0.25)",
      }}>{children}</span>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading font-semibold tracking-tight text-white mb-3" style={{ fontSize: "clamp(26px, 3.2vw, 36px)" }}>
      {children}
    </h2>
  );
}

function SeverityBadge({ level }: { level: "Critical" | "Major" | "Moderate" | "Minor" }) {
  const map = {
    Critical: { c: "hsl(0,90%,62%)", bg: "hsla(0,90%,62%,0.1)" },
    Major: { c: PINK, bg: "hsla(342,100%,59%,0.1)" },
    Moderate: { c: "hsl(38,100%,60%)", bg: "hsla(38,100%,60%,0.1)" },
    Minor: { c: CYAN, bg: "hsla(187,100%,50%,0.1)" },
  } as const;
  const { c, bg } = map[level];
  return (
    <span className="font-mono text-[9px] font-medium tracking-widest px-2 py-0.5 rounded-full"
      style={{ color: c, background: bg, border: `1px solid ${c}40` }}>{level.toUpperCase()}</span>
  );
}

/* ── Before/After comparison row (alternating) ── */
function BAComparison({ s, i, reverse }: { s: any; i: number; reverse: boolean }) {
  const mockups = (
    <div className="flex justify-center gap-4 md:gap-6">
      {[["BEFORE", s.before, "hsl(0,85%,60%)"], ["AFTER", s.after, CYAN]].map(([label, src, color]) => (
        <div key={label as string} className="flex flex-col items-center">
          <span className="font-mono text-[9px] tracking-[0.2em] px-2.5 py-1 rounded-full mb-3"
            style={{
              color: color as string,
              border: `1px solid ${label === "AFTER" ? "hsla(187,100%,50%,0.45)" : "hsla(0,85%,60%,0.45)"}`,
              background: label === "AFTER" ? "hsla(187,100%,50%,0.08)" : "hsla(0,85%,60%,0.08)",
            }}>{label as string}</span>
          <div className="rounded-[28px] p-1.5 transition-transform duration-500 hover:scale-[1.04]"
            style={{
              background: "linear-gradient(180deg, hsla(0,0%,10%,0.9), hsla(0,0%,3%,0.9))",
              border: "1px solid hsla(0,0%,100%,0.08)",
              boxShadow: `0 18px 50px rgba(0,0,0,0.6), 0 0 20px ${label === "AFTER" ? "hsla(187,100%,50%,0.15)" : "hsla(0,85%,60%,0.1)"}`,
            }}>
            <img src={src as string} alt={`${s.title} ${label}`} loading="lazy" decoding="async"
              className="w-full max-w-[230px] h-auto rounded-[22px]" />
          </div>
        </div>
      ))}
    </div>
  );
  const text = (
    <div className="space-y-4">
      {[
        ["RESEARCH INSIGHT", s.insight, PINK],
        ["DESIGN DECISION", s.decision, CYAN],
        ["OUTCOME", s.outcome, GREEN],
      ].map(([label, body, color]) => (
        <div key={label as string} className="rounded-xl p-4 border border-white/10 bg-white/[0.02] erp-card">
          <div className="font-mono text-[10px] tracking-[0.2em] mb-2 font-medium" style={{ color: color as string, textShadow: `0 0 10px ${color}40` }}>
            {label as string}
          </div>
          <p className="text-white/75 text-sm leading-[1.75]">{body as string}</p>
        </div>
      ))}
    </div>
  );
  return (
    <Reveal>
      <div className="py-6">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/35">0{i + 1}</span>
          <h3 className="font-heading font-semibold text-white text-lg md:text-2xl">{s.title}</h3>
        </div>
        <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${reverse ? "" : ""}`}>
          <div className={reverse ? "md:order-2" : ""}>{mockups}</div>
          <div className={reverse ? "md:order-1" : ""}>{text}</div>
        </div>
      </div>
    </Reveal>
  );
}

export default function ErpRedesign() {
  const navigate = useNavigate();

  // Always start at top on mount; disable browser scroll restoration for this page
  useEffect(() => {
    const prev = window.history.scrollRestoration;
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => { if ("scrollRestoration" in window.history) window.history.scrollRestoration = prev; };
  }, []);

  const [scrollY, setScrollY] = useState(0);
  const heroDevicesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mouse-responsive 3D tilt on hero devices
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = heroDevicesRef.current; if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      el.style.setProperty("--ry", `${dx * 8}deg`);
      el.style.setProperty("--rx", `${-dy * 6}deg`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);


  const heroMetrics = [
    { value: "80+", label: "Students Surveyed" },
    { value: "10", label: "Heuristics Evaluated" },
    { value: "12+", label: "Pain Points Identified" },
    { value: "8+", label: "Screens Redesigned" },
  ];

  const research = [
    { value: "56%", title: "Disliked Visual Design", desc: "Students described the interface as outdated and visually cluttered.", why: "Poor visual design erodes daily-use confidence and engagement." },
    { value: "57%", title: "Struggled With Navigation", desc: "Users couldn't reliably locate academic modules without trial and error.", why: "Hidden navigation slows critical academic workflows." },
    { value: "93%", title: "Reported Bugs", desc: "Nearly every respondent encountered functional issues regularly.", why: "Frequent bugs reduced trust and damaged the overall experience." },
    { value: "86%", title: "Found Grievance Hard", desc: "The complaint flow was perceived as confusing and unhelpful.", why: "A broken support loop leaves issues unresolved and users frustrated." },
    { value: "79.5%", title: "Requested Dark Mode", desc: "A strong majority asked for an accessibility-oriented dark theme.", why: "Comfort and accessibility directly impact long study sessions." },
  ];

  const voices = [
    { theme: "Navigation", text: "I can never find the page I'm looking for. Everything is buried." },
    { theme: "Visual Design", text: "It looks like it was built ten years ago and never updated." },
    { theme: "Notifications", text: "I miss important updates because nothing tells me when they happen." },
    { theme: "Grade Card", text: "The grade card is impossible to read on my phone — too much in one place." },
    { theme: "Mobile UX", text: "Half the screen breaks on mobile, but I only ever use it on mobile." },
    { theme: "Grievance", text: "Filing a grievance feels like shouting into the void." },
  ];

  const expectations = [
    "Easy, predictable navigation", "Mobile-friendly experience", "Clear attendance visibility",
    "Timely, useful notifications", "Faster academic workflows", "Transparent academic information",
  ];
  const gaps = [
    "Poor responsiveness across devices", "Complex, multi-level navigation", "Critical information hidden",
    "Weak or missing notification system", "Cluttered, friction-heavy workflows", "Flat hierarchy with no emphasis",
  ];

  const personas = [
    {
      name: "Aarohi Sharma", age: 19, year: "Second Year", program: "B.Tech Computer Engineering",
      img: personaAarohi, color: CYAN,
      goals: ["Access academic tools in under 3 taps", "Track attendance reliably each week", "View timetable at a glance"],
      behaviors: ["Mobile-first — phone over laptop", "Checks ERP 4–5 times a day", "Quick task-driven sessions"],
      frustrations: ["Confusing module layout", "Cluttered dashboard hierarchy", "Hard to discover key actions"],
      needs: ["Predictable, simple navigation", "Stronger hierarchy", "Fast paths to common actions"],
      quote: "I just want to find what I need without clicking through five screens.",
    },
    {
      name: "Neha Patil", age: 20, year: "Third Year", program: "B.Tech Information Technology",
      img: personaNeha, color: PINK,
      goals: ["Track exam and project deadlines", "Monitor academic progress over semesters", "Stay organized across modules"],
      behaviors: ["Splits usage between phone and laptop", "Plans week in one sitting", "Relies on notifications"],
      frustrations: ["Hidden updates", "Missed deadlines", "Weak information hierarchy"],
      needs: ["Visible reminders and alerts", "Organized academic timeline", "Clear progress visibility"],
      quote: "I shouldn't have to search multiple pages to know what's due this week.",
    },
  ];

  const heuristics: { name: string; score: number; severity: "Critical" | "Major" | "Moderate" | "Minor"; desc: string }[] = [
    { name: "Visibility of System Status", score: 45, severity: "Major", desc: "Users rarely receive feedback after key actions." },
    { name: "Match Between System & Real World", score: 55, severity: "Moderate", desc: "Some labels use system jargon instead of student language." },
    { name: "User Control & Freedom", score: 40, severity: "Major", desc: "Limited undo paths and unclear exit points." },
    { name: "Consistency & Standards", score: 35, severity: "Critical", desc: "Mixed components and patterns across modules." },
    { name: "Error Prevention", score: 30, severity: "Critical", desc: "Form errors surface only after submission." },
    { name: "Recognition Rather Than Recall", score: 50, severity: "Moderate", desc: "Users must remember nested paths to reach key actions." },
    { name: "Flexibility & Efficiency", score: 42, severity: "Major", desc: "No shortcuts for repeat tasks like attendance checks." },
    { name: "Aesthetic & Minimal Design", score: 38, severity: "Major", desc: "Visual clutter competes with primary information." },
    { name: "Help Users With Errors", score: 33, severity: "Critical", desc: "Errors aren't explained in plain, actionable language." },
    { name: "Help & Documentation", score: 28, severity: "Critical", desc: "No in-product guidance, tooltips, or help center." },
  ];

  const userFlow = ["Login", "Home", "Dashboard", "Academics", "Attendance", "Examination", "Grade Card", "Accounts"];

  const process = [
    { icon: Search, label: "Research", items: ["Survey of 80+ students", "Contextual interviews", "Pain point synthesis"] },
    { icon: BarChart3, label: "Analysis", items: ["UX audit of legacy portal", "Heuristic evaluation", "Expectations vs gap analysis"] },
    { icon: PenTool, label: "Wireframing", items: ["Information architecture", "Low-fidelity concepts", "Mobile-first layouts"] },
    { icon: Palette, label: "Visual Design", items: ["Design system definition", "UI component refinement", "Dark theme exploration"] },
    { icon: MousePointer2, label: "Prototype", items: ["High-fidelity Figma flows", "Interaction states", "Stakeholder review rounds"] },
    { icon: CheckCircle2, label: "Final Solution", items: ["Cohesive ERP redesign", "8+ redesigned screens", "Mobile-first delivery"] },
  ];

  const showcases = [
    { title: "Login Screen", before: loginBefore, after: loginAfter,
      insight: "Students bounced off authentication on mobile due to unclear forms and weak branding.",
      decision: "Cleaner layout, strong branding lockup, and modernized input components.",
      outcome: "Faster, more confident sign-in with reduced authentication friction." },
    { title: "Home Page", before: homeBefore, after: homeAfter,
      insight: "Cluttered modules made critical academic actions hard to surface.",
      decision: "Reorganized modules into priority cards with clear hierarchy and grouping.",
      outcome: "Core academic functions are reachable in fewer taps." },
    { title: "Academics Page", before: gradeBefore, after: gradeAfter,
      insight: "Dense data prevented students from interpreting their academic standing.",
      decision: "Refined typography, spacing, and grouping for scannability.",
      outcome: "A clearer overview of subjects, scores, and standing." },
    { title: "Attendance Page", before: attBefore, after: attAfter,
      insight: "Attendance status across subjects was hard to monitor at a glance.",
      decision: "Subject cards with visual percentage indicators and risk flags.",
      outcome: "Students assess attendance health in seconds, not minutes." },
    { title: "Grade Card Page", before: examBefore, after: examAfter,
      insight: "Grade and exam data lacked structure and surfacing of deadlines.",
      decision: "Structured sections, clear typography, and prominent key actions.",
      outcome: "Reduced cognitive load for time-sensitive grade workflows." },
  ];

  const additionalScreens = [
    { title: "Dashboard", img: dashboardImg, note: "Personalized academic overview with prioritized cards." },
    { title: "Grade Card", img: gradeCardImg, note: "Readable grade summary with per-subject breakdown." },
    { title: "Test Scores", img: testScoreImg, note: "Compact score timeline with semester filters." },
    { title: "Academics Module", img: academicsImg, note: "Reorganized academic module hub with clear grouping." },
  ];

  const lessons = [
    { icon: Search, title: "Research Validates Assumptions", text: "Direct student input replaced guesswork and reshaped early design directions." },
    { icon: MousePointer2, title: "Mobile-First Improves Access", text: "Designing for phones first forced clarity and exposed every weak hierarchy." },
    { icon: Layers, title: "Design Systems Build Consistency", text: "Tokens and reusable components removed visual drift across modules." },
    { icon: Type, title: "Academic Tools Need Clear Hierarchy", text: "Students scan, not read. Typography and grouping carry the experience." },
    { icon: Sparkles, title: "Small UX Wins Compound", text: "Micro-improvements in spacing, labels, and feedback radically lift usability." },
  ];

  const outcomes = [
    { title: "Simplified Navigation", text: "Students reach key academic functions with fewer taps and improved discoverability." },
    { title: "Better Information Hierarchy", text: "Critical data is surfaced through typography, spacing, and grouping decisions." },
    { title: "Mobile-First Experience", text: "Every screen was redesigned around how students actually use the portal — on phones." },
    { title: "Faster Academic Workflows", text: "Common journeys like attendance and exam checks now take a fraction of the time." },
    { title: "Improved Readability", text: "Refined typography and dark theme reduce strain across long academic sessions." },
    { title: "Modern Visual Identity", text: "A cohesive component system replaces the previous fragmented, dated UI." },
  ];

  const heroOffset = scrollY * 0.08;

  return (
    <div className="min-h-screen bg-background text-white relative overflow-x-hidden erp-page">
      <style>{`
        .erp-page { font-family: 'Inter', 'Quicksand', sans-serif; line-height: 1.75; }
        .erp-page .font-heading { font-family: 'Space Grotesk', 'Inter', sans-serif; }
        .erp-page .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .erp-card { transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out; }
        .erp-card:hover { transform: translateY(-2px); border-color: hsla(187,100%,50%,0.25); box-shadow: 0 0 20px rgba(34,211,238,0.15); }
        @keyframes erp-pulse-glow {
          0%,100% { box-shadow: 0 0 12px hsla(187,100%,50%,0.2); }
          50% { box-shadow: 0 0 22px hsla(187,100%,50%,0.45); }
        }
        .erp-pulse-pill { animation: erp-pulse-glow 3s ease-in-out infinite; }
        @keyframes erp-underline-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .erp-anim-underline {
          background-image: linear-gradient(90deg, ${CYAN}, hsl(210,100%,60%), ${CYAN});
          background-size: 200% 100%;
          background-repeat: repeat-x;
          background-position: 0 100%;
          background-size: 200% 3px;
          padding-bottom: 4px;
          animation: erp-underline-flow 3s linear infinite;
          background-clip: padding-box;
        }
        @keyframes erp-dot-drift { from { background-position: 0 0; } to { background-position: 40px 40px; } }
        .erp-dot-grid {
          background-image: radial-gradient(hsla(187,100%,50%,0.18) 1px, transparent 1px);
          background-size: 22px 22px;
          animation: erp-dot-drift 25s linear infinite;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 80%);
        }
        @keyframes erpFloatA { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-12px) rotate(-2deg)} }
        @keyframes erpFloatB { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-16px) rotate(3deg)} }
        .erp-float-a { animation: erpFloatA 5.5s ease-in-out infinite; }
        .erp-float-b { animation: erpFloatB 6.5s ease-in-out infinite; animation-delay: 0.6s; }
        @keyframes erp-nebula-drift { 0%,100% { transform: translate3d(0,0,0);} 50% { transform: translate3d(-2%, 2%, 0);} }
        .erp-nebula-drift { animation: erp-nebula-drift 22s ease-in-out infinite; }
        @keyframes erp-orbit-rot { from { transform: translate(-50%,-50%) rotate(0deg);} to { transform: translate(-50%,-50%) rotate(360deg);} }
        .erp-orbit { position: absolute; left: 50%; top: 50%; border-radius: 50%; border: 1px solid hsla(187,100%,50%,0.18); animation: erp-orbit-rot 40s linear infinite; pointer-events: none; }
        .erp-orbit::before { content: ''; position: absolute; width: 6px; height: 6px; border-radius: 50%; background: ${CYAN}; box-shadow: 0 0 12px ${CYAN}; top: -3px; left: 50%; transform: translateX(-50%); }
        .erp-orbit.pink { border-color: hsla(342,100%,59%,0.15); animation-duration: 55s; animation-direction: reverse; }
        .erp-orbit.pink::before { background: ${PINK}; box-shadow: 0 0 12px ${PINK}; }
      `}</style>


      <ScrollProgress />
      <CursorDot />
      <StickyNav />
      <Rocket />
      <Particles />
      <Starfield />
      <MouseGlow />
      <div className="fixed inset-0 pointer-events-none -z-10" style={{
        background: "radial-gradient(ellipse 55% 40% at 18% 12%, hsla(187,100%,50%,0.10), transparent 65%), radial-gradient(ellipse 50% 40% at 82% 78%, hsla(342,100%,59%,0.09), transparent 65%), radial-gradient(ellipse 40% 30% at 50% 50%, hsla(270,80%,55%,0.05), transparent 70%)"
      }} />
      <div className="fixed inset-0 pointer-events-none -z-10 erp-nebula-drift" style={{
        background: "radial-gradient(ellipse 30% 25% at 30% 70%, hsla(187,100%,50%,0.06), transparent 70%), radial-gradient(ellipse 30% 25% at 70% 30%, hsla(342,100%,59%,0.06), transparent 70%)"
      }} />

      {/* Back nav */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pt-8">
        <button onClick={() => navigate("/#projects")}
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-white/60 hover:text-cyan-300 transition-colors">
          <ArrowLeft size={14} /> BACK TO PROJECTS
        </button>
      </div>

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-16">
        <div className="absolute inset-0 erp-dot-grid -z-10" />
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <SectionLabel color={PINK}>UI / UX CASE STUDY</SectionLabel>
            <h1 className="font-heading font-bold tracking-tight text-white mt-5 mb-5" style={{ fontSize: "clamp(40px, 5.5vw, 64px)", lineHeight: 1.05 }}>
              ERP Portal <span className="erp-anim-underline" style={{ color: CYAN }}>Redesign</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-[1.75] max-w-xl mb-8">
              A research-driven redesign of an outdated student ERP into a modern,
              mobile-first, accessible academic experience.
            </p>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Duration", "6 Weeks"],
                ["Role", "UI / UX Designer"],
                ["Team", "Team Project"],
                ["Tools", "Figma, FigJam"],
              ].map(([k, v]) => (
                <div key={k} className={`${card} px-4 py-3`}>
                  <dt className="font-mono text-[10px] tracking-widest text-white/40 mb-1">{k.toUpperCase()}</dt>
                  <dd className="text-white/90 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.15}>
          <Reveal>
            <SectionLabel color={PINK}>UI / UX CASE STUDY</SectionLabel>
            <h1
              className="font-heading font-bold tracking-tight text-white mt-5 mb-5 pb-2"
              style={{ fontSize: "clamp(40px, 5.5vw, 64px)", lineHeight: 1.15, overflow: "visible" }}
            >
              ERP Portal{" "}
              <span className="erp-anim-underline inline-block pb-1" style={{ color: CYAN, lineHeight: 1.2 }}>
                Redesign
              </span>
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-[1.75] max-w-xl mb-8">
              A research-driven redesign of an outdated student ERP into a modern,
              mobile-first, accessible academic experience.
            </p>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Duration", "6 Weeks"],
                ["Role", "UI / UX Designer"],
                ["Team", "Team Project"],
                ["Tools", "Figma, FigJam"],
              ].map(([k, v]) => (
                <div key={k} className={`${card} px-4 py-3`}>
                  <dt className="font-mono text-[10px] tracking-widest text-white/40 mb-1">{k.toUpperCase()}</dt>
                  <dd className="text-white/90 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.15}>
            <div
              ref={heroDevicesRef}
              className="relative h-[420px] md:h-[480px]"
              style={{
                transform: `translateY(${-heroOffset}px)`,
                perspective: "1200px",
              }}
            >
              {/* Premium cyan glow behind phones */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 60% 55% at 50% 55%, hsla(187,100%,50%,0.22), transparent 70%)",
                filter: "blur(20px)",
              }} aria-hidden />

              {/* Orbital rings */}
              <div className="erp-orbit" style={{ width: 380, height: 380 }} aria-hidden />
              <div className="erp-orbit pink" style={{ width: 520, height: 520, opacity: 0.6 }} aria-hidden />
              <div className="erp-orbit" style={{ width: 260, height: 260, opacity: 0.7, animationDuration: "30s" }} aria-hidden />

              <div
                className="absolute top-4 left-2 w-[48%] erp-float-a"
                style={{ transform: "rotateY(var(--ry,0)) rotateX(var(--rx,0))", transformStyle: "preserve-3d", transition: "transform 0.25s ease-out" }}
              >
                <img src={loginAfter} alt="Login redesign mockup" loading="lazy" decoding="async"
                  className="w-full rounded-2xl border border-white/10"
                  style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.55), 0 0 40px hsla(187,100%,50%,0.28)" }} />
              </div>
              <div
                className="absolute bottom-0 right-0 w-[55%] erp-float-b"
                style={{ transform: "rotateY(calc(var(--ry,0) * -1)) rotateX(var(--rx,0))", transformStyle: "preserve-3d", transition: "transform 0.25s ease-out" }}
              >
                <img src={homeAfter} alt="Home redesign mockup" loading="lazy" decoding="async"
                  className="w-full rounded-2xl border border-white/10"
                  style={{ boxShadow: "0 22px 60px rgba(0,0,0,0.6), 0 0 44px hsla(187,100%,50%,0.22), 0 0 30px hsla(342,100%,59%,0.14)" }} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Hero metrics row — magnetic */}
        <Reveal delay={0.25}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-10">

            {heroMetrics.map((m, i) => (
              <MagneticCard key={m.label} className={`${card} p-5 text-center`} style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="font-heading font-bold mb-1" style={{ fontSize: "clamp(24px, 2.8vw, 32px)", color: CYAN, textShadow: "0 0 12px hsla(187,100%,50%,0.3)" }}>
                  <CountUp value={m.value} />
                </div>
                <div className="text-white/55 text-xs md:text-sm leading-snug font-mono tracking-wide">{m.label}</div>
              </MagneticCard>
            ))}
          </div>
        </Reveal>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>01 — PROBLEM</SectionLabel>
          <H2 >The existing ERP held students back.</H2>
          <p className="text-white/60 max-w-2xl mb-8 leading-[1.75]">Built years ago and rarely updated, the portal failed at the basics — navigation, hierarchy, mobile usability, and accessibility.</p>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsla(342,100%,59%,0.06), hsla(0,0%,4%,0.6))",
              border: "1px solid hsla(342,100%,59%,0.25)",
              boxShadow: "0 10px 40px hsla(342,100%,59%,0.08)",
            }}>
            <div className="flex items-start gap-4">
              <AlertTriangle size={28} style={{ color: PINK }} className="shrink-0 mt-1" />
              <div>
                <div className="font-mono text-[11px] tracking-widest mb-2" style={{ color: PINK }}>PROBLEM STATEMENT</div>
                <p className="text-white/85 text-base md:text-lg leading-[1.75]">
                  The existing ERP portal suffered from <span className="text-white font-semibold">confusing navigation</span>,
                  poor information hierarchy, inconsistent visual design, accessibility issues,
                  frequent usability frustrations, and missing academic support features —
                  blocking students from completing routine academic tasks with confidence.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["Outdated Interface", "Visual language stuck in legacy patterns."],
            ["Difficult Navigation", "Modules buried behind multiple unclear clicks."],
            ["Poor Hierarchy", "Equal visual weight on everything — nothing stood out."],
            ["Inconsistent Design", "Mixed components, colors, and typography across pages."],
            ["Weak Mobile Experience", "Layouts broke on phones despite being the primary device."],
            ["Missing Academic Support", "Key academic helpers absent from the experience."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.05}>
              <div className={`${card} p-5 h-full`}>
                <h3 className="text-white font-semibold mb-1.5 font-heading">{t}</h3>
                <p className="text-white/55 text-sm leading-[1.75]">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GOAL */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>02 — GOAL</SectionLabel>
          <H2>The redesign objective.</H2>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsla(187,100%,50%,0.06), hsla(0,0%,4%,0.6))",
              border: "1px solid hsla(187,100%,50%,0.25)",
              boxShadow: "0 10px 40px hsla(187,100%,50%,0.08)",
            }}>
            <div className="flex items-start gap-4">
              <Target size={28} style={{ color: CYAN }} className="shrink-0 mt-1" />
              <div>
                <div className="font-mono text-[11px] tracking-widest mb-2" style={{ color: CYAN }}>GOAL STATEMENT</div>
                <p className="text-white/85 text-base md:text-lg leading-[1.75]">
                  Redesign the ERP portal into a <span className="text-white font-semibold">mobile-first, accessible, and intuitive</span> platform that
                  improves navigation, surfaces academic information clearly, enhances overall usability,
                  and meaningfully lifts student satisfaction across daily academic workflows.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* RESEARCH */}
      <section id="research" className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>03 — RESEARCH</SectionLabel>
          <H2>Research Findings</H2>
          <p className="text-white/60 max-w-2xl mb-8 leading-[1.75]">Survey of 80+ students across years and devices, supplemented by contextual interviews.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {research.map((r, i) => (
            <Reveal key={r.value} delay={i * 0.08}>
              <div className={`${card} p-5 h-full`}>
                <div className="font-heading font-bold mb-2" style={{ fontSize: "clamp(30px, 3.2vw, 38px)", color: CYAN, textShadow: "0 0 12px hsla(187,100%,50%,0.25)" }}>
                  <CountUp value={r.value} />
                </div>
                <div className="text-white font-semibold mb-1.5 font-heading">{r.title}</div>
                <p className="text-white/60 text-sm leading-[1.75] mb-3">{r.desc}</p>
                <div className="pt-3 border-t border-white/10">
                  <div className="font-mono text-[10px] tracking-widest text-white/40 mb-1">WHY IT MATTERS</div>
                  <p className="text-white/70 text-sm leading-[1.75]">{r.why}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VOICE OF STUDENTS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel color={PINK}>04 — VOICE OF STUDENTS</SectionLabel>
          <H2>In their own words.</H2>
          <p className="text-white/60 max-w-2xl mb-8 leading-[1.75]">Direct feedback collected during research — the friction students live with every day.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {voices.map((v, i) => (
            <Reveal key={v.theme} delay={i * 0.06}>
              <div className={`${card} p-5 h-full`}>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={14} style={{ color: PINK }} />
                  <span className="font-mono text-[10px] tracking-widest" style={{ color: PINK }}>{v.theme.toUpperCase()}</span>
                </div>
                <p className="text-white/80 text-[15px] leading-[1.75] italic">"{v.text}"</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EXPECTATIONS VS GAPS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>05 — GAP ANALYSIS</SectionLabel>
          <H2>Expectations vs Platform Gaps</H2>
          <p className="text-white/60 max-w-2xl mb-8 leading-[1.75]">Bridging what students wanted with what the legacy platform actually delivered — the design brief in two columns.</p>
        </Reveal>
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
          <div className="rounded-2xl p-5 md:p-6 erp-card"
            style={{ background: "linear-gradient(135deg, hsla(187,100%,50%,0.05), hsla(0,0%,4%,0.5))", border: "1px solid hsla(187,100%,50%,0.22)" }}>
            <div className="font-mono text-[11px] tracking-widest mb-4" style={{ color: CYAN }}>USER EXPECTATIONS</div>
            <ul className="space-y-3">
              {expectations.map((e) => (
                <li key={e} className="flex items-start gap-3 text-white/85 text-sm leading-[1.75]">
                  <CheckCircle2 size={16} style={{ color: CYAN }} className="mt-0.5 shrink-0" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <ArrowRight size={28} className="text-white/30" />
          </div>
          <div className="rounded-2xl p-5 md:p-6 erp-card"
            style={{ background: "linear-gradient(135deg, hsla(342,100%,59%,0.05), hsla(0,0%,4%,0.5))", border: "1px solid hsla(342,100%,59%,0.22)" }}>
            <div className="font-mono text-[11px] tracking-widest mb-4" style={{ color: PINK }}>CURRENT PLATFORM GAPS</div>
            <ul className="space-y-3">
              {gaps.map((g) => (
                <li key={g} className="flex items-start gap-3 text-white/85 text-sm leading-[1.75]">
                  <AlertTriangle size={16} style={{ color: PINK }} className="mt-0.5 shrink-0" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section id="personas" className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>06 — USERS</SectionLabel>
          <H2>User Personas</H2>
          <p className="text-white/60 max-w-2xl mb-8 leading-[1.75]">Two representative engineering students synthesized from research, guiding every design decision.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-5">
          {personas.map((p, idx) => (
            <Reveal key={p.name} delay={idx * 0.1}>
              <div className={`${card} p-6 h-full group`}>
                <div className="grid md:grid-cols-[140px,1fr] gap-5">
                  <div className="flex md:flex-col items-center md:items-start gap-4">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{
                        border: `1px solid ${p.color === CYAN ? "hsla(187,100%,50%,0.35)" : "hsla(342,100%,59%,0.35)"}`,
                        boxShadow: `0 0 28px ${p.color === CYAN ? "hsla(187,100%,50%,0.20)" : "hsla(342,100%,59%,0.20)"}`,
                      }}>
                      <img src={p.img} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-lg leading-tight font-heading">{p.name}</div>
                      <div className="text-white/55 text-sm">Age {p.age} · {p.year}</div>
                      <div className="text-white/45 text-xs mt-1">{p.program}</div>
                    </div>
                  </div>
                  <div>
                    {([
                      ["GOALS", p.goals], ["BEHAVIORS", p.behaviors],
                      ["FRUSTRATIONS", p.frustrations], ["NEEDS", p.needs],
                    ] as const).map(([label, items]) => (
                      <div key={label} className="mb-3">
                        <div className="font-mono text-[10px] tracking-widest text-white/40 mb-1.5">{label}</div>
                        <ul className="space-y-1">
                          {items.map((it) => (
                            <li key={it} className="text-white/75 text-sm flex gap-2 leading-[1.75]">
                              <span style={{ color: p.color }} className="mt-1">·</span>{it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="pt-3 mt-2 border-t border-white/10 flex gap-2 text-white/70 text-sm italic">
                      <Quote size={14} className="shrink-0 mt-1" style={{ color: p.color }} />
                      <span>"{p.quote}"</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HEURISTIC */}
      <section id="evaluation" className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>07 — EVALUATION</SectionLabel>
          <H2>Heuristic Evaluation</H2>
          <p className="text-white/60 max-w-2xl mb-8 leading-[1.75]">Scored against Nielsen's 10 usability heuristics with severity tags — every dimension scored below 60%.</p>
        </Reveal>
        <div className={`${card} p-6`}>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
            {heuristics.map((h) => (
              <div key={h.name}>
                <div className="flex justify-between items-baseline mb-1.5 gap-3">
                  <span className="text-white/85 text-sm font-medium">{h.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <SeverityBadge level={h.severity} />
                    <span className="font-mono text-[11px] font-medium" style={{ color: h.score < 40 ? PINK : CYAN }}>{h.score}%</span>
                  </div>
                </div>
                <HeuristicBar score={h.score} color={h.score < 40 ? PINK : CYAN} />
                <p className="text-white/55 text-xs leading-[1.75]">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USER FLOW */}
      <section id="flow" className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>08 — USER FLOW</SectionLabel>
          <H2>Redesigned User Flow</H2>
          <p className="text-white/60 max-w-2xl mb-8 leading-[1.75]">A linear, mobile-friendly flow that surfaces the most-used academic journeys first and removes hidden detours.</p>
        </Reveal>
        <div className={`${card} p-6 md:p-8`}>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-center">
            {userFlow.map((step, i) => (
              <div key={step} className="flex items-center gap-2 md:gap-3">
                <div className="px-3 md:px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: i % 2 === 0 ? "hsla(187,100%,50%,0.08)" : "hsla(342,100%,59%,0.08)",
                    border: `1px solid ${i % 2 === 0 ? "hsla(187,100%,50%,0.3)" : "hsla(342,100%,59%,0.3)"}`,
                    color: i % 2 === 0 ? CYAN : PINK,
                  }}>{step}</div>
                {i < userFlow.length - 1 && <ArrowRight size={14} className="text-white/30" />}
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              ["Why Redesigned", "The legacy flow forced students through deep, unclear menus to reach daily-use modules."],
              ["Pain Points Addressed", "Hidden academics, weak attendance access, scattered exam information."],
              ["Navigation Simplified", "Flattened structure, predictable order, and shortcut surfacing on Home."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-lg p-4 border border-white/10 bg-white/[0.02] erp-card">
                <div className="font-mono text-[10px] tracking-widest text-white/40 mb-2">{t.toUpperCase()}</div>
                <p className="text-white/70 text-sm leading-[1.75]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>09 — PROCESS</SectionLabel>
          <H2>Design Process</H2>
          <p className="text-white/60 max-w-2xl mb-8 leading-[1.75]">Six structured stages, from raw research to a delivered redesign.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {process.map((s, i) => {
            const Icon = s.icon;
            const color = i % 2 === 0 ? CYAN : PINK;
            return (
              <Reveal key={s.label} delay={i * 0.06}>
                <div className={`${card} p-5 h-full`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: "hsla(0,0%,4%,0.9)", border: `1px solid ${color}55` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-widest text-white/40">0{i + 1}</div>
                      <div className="text-white font-semibold text-sm font-heading">{s.label}</div>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {s.items.map((it) => (
                      <li key={it} className="text-white/65 text-sm flex gap-2 leading-[1.75]">
                        <span style={{ color }} className="mt-1">·</span>{it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* PROTOTYPE */}
      <section id="prototype" className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>10 — PROTOTYPE</SectionLabel>
          <H2>See It In Motion.</H2>
          <p className="text-white/60 max-w-2xl mb-10 leading-[1.75]">
            High-fidelity prototype built in Figma — interactions, transitions, and real academic flows.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-[28px] p-3 md:p-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsla(0,0%,7%,0.95), hsla(0,0%,3%,0.95))",
              border: "1px solid hsla(187,100%,50%,0.35)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 40px hsla(187,100%,50%,0.18), inset 0 0 0 1px hsla(0,0%,100%,0.04)",
            }}>
            <div className="rounded-[20px] overflow-hidden bg-black">
              <video
                src={prototypeVideo}
                autoPlay loop muted playsInline controls
                preload="metadata"
                className="w-full h-auto block mx-auto"
                style={{ maxHeight: 540, objectFit: "contain" }}

              />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="flex justify-center mt-8">
            <a href="https://www.figma.com" target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-sm font-medium transition-all duration-300 relative overflow-hidden"
              style={{
                color: CYAN,
                border: `1px solid hsla(187,100%,50%,0.5)`,
                background: "hsla(187,100%,50%,0.05)",
                boxShadow: "0 0 20px hsla(187,100%,50%,0.18)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = CYAN; e.currentTarget.style.color = "hsl(0,0%,4%)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "hsla(187,100%,50%,0.05)"; e.currentTarget.style.color = CYAN; }}>
              View Full Prototype in Figma
              <ExternalLink size={14} />
            </a>
          </div>
        </Reveal>
      </section>

      {/* BEFORE & AFTER — alternating */}
      <section id="transformation" className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>11 — TRANSFORMATION</SectionLabel>
          <H2>Before &amp; After</H2>
          <p className="text-white/60 max-w-2xl mb-12 leading-[1.75]">Five core screens redesigned end-to-end. Each pairs research insight, design decision, and outcome.</p>
        </Reveal>

        <div>
          {showcases.map((s, i) => (
            <div key={s.title}>
              <BAComparison s={s} i={i} reverse={i % 2 === 1} />
              {i < showcases.length - 1 && <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent my-6" />}
            </div>
          ))}
        </div>
      </section>

      {/* ADDITIONAL REDESIGNS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel color={PINK}>12 — MORE SCREENS</SectionLabel>
          <H2>Additional Redesigned Screens</H2>
          <p className="text-white/60 max-w-2xl mb-8 leading-[1.75]">Supporting screens explored as part of the broader redesign system — dashboard, grade card, accounts, and exam workflows.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {additionalScreens.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06}>
              <div className={`${card} p-4 h-full`}>
                <div className="rounded-xl overflow-hidden mb-3 bg-black/30 border border-white/10">
                  <img src={a.img} alt={a.title} loading="lazy" decoding="async"
                    className="w-full h-44 object-cover object-top" />
                </div>
                <div className="font-mono text-[10px] tracking-widest mb-1.5" style={{ color: i % 2 === 0 ? CYAN : PINK }}>
                  {a.title.toUpperCase()}
                </div>
                <p className="text-white/65 text-sm leading-[1.75]">{a.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LESSONS LEARNED */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>13 — REFLECTION</SectionLabel>
          <H2>Lessons Learned</H2>
          <p className="text-white/60 max-w-2xl mb-8 leading-[1.75]">Key takeaways from running a research-driven academic UX redesign.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((l, i) => {
            const Icon = l.icon;
            const color = i % 2 === 0 ? CYAN : PINK;
            return (
              <Reveal key={l.title} delay={i * 0.05}>
                <div className={`${card} p-5 h-full`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Lightbulb size={16} style={{ color }} />
                    <Icon size={14} className="text-white/40" />
                  </div>
                  <div className="text-white font-semibold mb-1.5 font-heading">{l.title}</div>
                  <p className="text-white/60 text-sm leading-[1.75]">{l.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* OUTCOMES */}
      <section id="outcomes" className="relative z-10 max-w-6xl mx-auto px-6 border-t border-white/5" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <Reveal>
          <SectionLabel>14 — OUTCOMES</SectionLabel>
          <H2>Key Outcomes</H2>
          <p className="text-white/60 max-w-2xl mb-8 leading-[1.75]">Qualitative improvements drawn from the redesign — focused on clarity, usability, and a modern visual identity.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {outcomes.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.05}>
              <div className={`${card} p-5 h-full`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} style={{ color: CYAN }} />
                  <span className="text-white font-semibold font-heading">{o.title}</span>
                </div>
                <p className="text-white/65 text-sm leading-[1.75]">{o.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] tracking-widest text-white/40 mb-2">CASE STUDY · 2025</div>
            <div className="text-white/80 font-semibold font-heading">ERP Portal Redesign</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/#projects")}
              className="px-5 py-2.5 rounded-lg border border-white/15 text-white/80 text-sm hover:bg-white/5 transition-colors inline-flex items-center gap-2">
              <ArrowLeft size={14} /> Back to Projects
            </button>
            <a href="https://www.figma.com" target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${CYAN}, hsl(187,80%,45%))`, color: "hsl(0,0%,4%)" }}>
              <Figma size={14} /> View on Figma
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
