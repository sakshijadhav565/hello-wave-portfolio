import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Figma, Search, BarChart3, PenTool, Palette, MousePointer2, CheckCircle2, Quote } from "lucide-react";

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

const CYAN = "hsl(187, 100%, 50%)";
const PINK = "hsl(342, 100%, 59%)";

/* ── Lightweight floating particles (perf-friendly) ── */
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
        ctx.fillStyle = p.pink
          ? `hsla(342,100%,59%,${p.o})`
          : `hsla(187,100%,50%,${p.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-70" />;
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
      transform: v ? "translateY(0)" : "translateY(14px)",
      transition: `opacity 0.55s ease-out ${delay}s, transform 0.55s ease-out ${delay}s`,
      willChange: "opacity, transform",
    }}>{children}</div>
  );
}

/* ── Animated count-up number ── */
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

/* ── Persona avatar (clean SVG illustration) ── */
function PersonaAvatar({ color, seed }: { color: string; seed: number }) {
  const second = color === CYAN ? "hsl(187,80%,35%)" : "hsl(342,80%,40%)";
  const hair = seed % 2 === 0 ? "hsl(20, 30%, 18%)" : "hsl(30, 40%, 25%)";
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <defs>
        <linearGradient id={`bg-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={second} stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="40" fill={`url(#bg-${seed})`} />
      <circle cx="40" cy="58" r="22" fill="hsl(28, 40%, 78%)" />
      <circle cx="40" cy="34" r="14" fill="hsl(28, 40%, 78%)" />
      <path d="M26,30 Q26,18 40,18 Q54,18 54,30 Q54,34 50,32 Q46,28 40,28 Q34,28 30,32 Q26,34 26,30 Z" fill={hair} />
      <circle cx="35" cy="34" r="1.2" fill="hsl(20,40%,20%)" />
      <circle cx="45" cy="34" r="1.2" fill="hsl(20,40%,20%)" />
      <path d="M36,40 Q40,42 44,40" stroke="hsl(20,40%,30%)" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="40" r="39" fill="none" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
    </svg>
  );
}

const card = "rounded-xl border border-white/10 bg-white/[0.025]";
const tag = "inline-block font-pixel text-[9px] tracking-widest px-2.5 py-1 rounded-full";

function SectionLabel({ children, color = CYAN }: { children: React.ReactNode; color?: string }) {
  return (
    <span className={tag} style={{
      color, border: `1px solid ${color === CYAN ? "hsla(187,100%,50%,0.35)" : "hsla(342,100%,59%,0.35)"}`,
      background: color === CYAN ? "hsla(187,100%,50%,0.06)" : "hsla(342,100%,59%,0.06)",
    }}>{children}</span>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-sans font-semibold tracking-tight text-white mb-3" style={{ fontSize: "clamp(24px, 3vw, 32px)" }}>
      {children}
    </h2>
  );
}

export default function ErpRedesign() {
  const navigate = useNavigate();

  /* Hero parallax floating */
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const research = [
    { value: "56%", label: "Disliked current visual design" },
    { value: "57%", label: "Struggled with navigation" },
    { value: "93%", label: "Reported bugs" },
    { value: "86%", label: "Found grievance process difficult" },
    { value: "79.5%", label: "Requested dark mode" },
  ];

  const personas = [
    {
      name: "Aarohi Sharma", age: 19, role: "Second-Year Engineering Student",
      color: CYAN, seed: 1,
      goals: ["Access academic tools quickly", "Track attendance reliably", "View schedules at a glance"],
      frustrations: ["Confusing navigation", "Cluttered dashboard", "Hard to discover modules"],
      needs: ["Simple navigation", "Better organization", "Faster access to information"],
      quote: "I just want to find what I need without clicking through multiple screens.",
    },
    {
      name: "Neha Patil", age: 20, role: "Third-Year Engineering Student",
      color: PINK, seed: 2,
      goals: ["Track deadlines", "Monitor academic progress", "Stay organized"],
      frustrations: ["Hidden updates", "Missed notifications", "Weak information hierarchy"],
      needs: ["Clear reminders", "Better visibility", "Organized dashboard"],
      quote: "I shouldn't have to search multiple pages to find important updates.",
    },
  ];

  const heuristics = [
    { name: "Visibility of System Status", score: 45 },
    { name: "Match Between System & Real World", score: 55 },
    { name: "User Control & Freedom", score: 40 },
    { name: "Consistency & Standards", score: 35 },
    { name: "Error Prevention", score: 30 },
    { name: "Recognition Rather Than Recall", score: 50 },
    { name: "Flexibility & Efficiency", score: 42 },
    { name: "Aesthetic & Minimal Design", score: 38 },
    { name: "Help Users With Errors", score: 33 },
    { name: "Help & Documentation", score: 28 },
  ];

  const process = [
    { icon: Search, label: "Research" },
    { icon: BarChart3, label: "Analysis" },
    { icon: PenTool, label: "Wireframing" },
    { icon: Palette, label: "Visual Design" },
    { icon: MousePointer2, label: "Prototype" },
    { icon: CheckCircle2, label: "Final Solution" },
  ];

  const showcases = [
    { title: "Login Screen", before: loginBefore, after: loginAfter,
      challenge: "Lacked visual hierarchy, branding, and intuitive form design.",
      decision: "Cleaner layout, stronger branding, and modernized form components.",
      impact: "Improved readability and trust during authentication." },
    { title: "Home Page", before: homeBefore, after: homeAfter,
      challenge: "Cluttered layout made important modules hard to find.",
      decision: "Reorganized modules into clean cards with clear hierarchy.",
      impact: "Faster access to core academic functions." },
    { title: "Academics Page", before: gradeBefore, after: gradeAfter,
      challenge: "Academic data felt dense and hard to interpret.",
      decision: "Refined typography, spacing, and grouping for clarity.",
      impact: "A clearer and more accessible academic overview." },
    { title: "Attendance Page", before: attBefore, after: attAfter,
      challenge: "Attendance was hard to scan across subjects.",
      decision: "Subject cards, visual indicators, and clearer grouping.",
      impact: "Students can monitor attendance status at a glance." },
    { title: "Examination Page", before: examBefore, after: examAfter,
      challenge: "Exam actions and deadlines lacked visibility.",
      decision: "Structured sections with surfaced deadlines.",
      impact: "Reduced cognitive load for exam-related tasks." },
  ];

  const outcomes = [
    "Simplified navigation",
    "Better information hierarchy",
    "Mobile-first experience",
    "Faster access to academic tools",
    "Improved readability",
    "Modern visual identity",
  ];

  const heroOffset = scrollY * 0.08;

  return (
    <div className="min-h-screen bg-background text-white font-body relative overflow-x-hidden">
      <Particles />
      <div className="fixed inset-0 pointer-events-none -z-10" style={{
        background: "radial-gradient(ellipse 60% 40% at 20% 10%, hsla(187,100%,50%,0.04), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, hsla(342,100%,59%,0.03), transparent 60%)"
      }} />

      {/* Back nav */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pt-8">
        <button onClick={() => navigate("/#projects")}
          className="inline-flex items-center gap-2 font-pixel text-[10px] tracking-widest text-white/60 hover:text-cyan-300 transition-colors">
          <ArrowLeft size={14} /> BACK TO PROJECTS
        </button>
      </div>

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <SectionLabel color={PINK}>UI / UX CASE STUDY</SectionLabel>
            <h1 className="font-sans font-bold tracking-tight text-white mt-4 mb-4" style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05 }}>
              ERP Portal <span style={{ color: CYAN }}>Redesign</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-8">
              Transforming an outdated student ERP into a modern, mobile-first academic experience.
            </p>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Duration", "6 Weeks"],
                ["Role", "UI / UX Designer"],
                ["Team", "Team Project"],
                ["Tools", "Figma, FigJam"],
              ].map(([k, v]) => (
                <div key={k} className={`${card} px-4 py-3`}>
                  <dt className="font-pixel text-[9px] tracking-widest text-white/40 mb-1">{k.toUpperCase()}</dt>
                  <dd className="text-white/90 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Floating device — Login + Home only, clean composition */}
          <Reveal delay={0.15}>
            <div className="relative h-[460px] md:h-[520px]" style={{ transform: `translateY(${-heroOffset}px)` }}>
              <div className="absolute top-4 left-2 w-[48%] erp-float-a">
                <img src={loginAfter} alt="Login redesign mockup" loading="lazy" decoding="async"
                  className="w-full rounded-2xl border border-white/10"
                  style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.55), 0 0 22px hsla(187,100%,50%,0.10)" }} />
              </div>
              <div className="absolute bottom-0 right-0 w-[55%] erp-float-b">
                <img src={homeAfter} alt="Home redesign mockup" loading="lazy" decoding="async"
                  className="w-full rounded-2xl border border-white/10"
                  style={{ boxShadow: "0 22px 60px rgba(0,0,0,0.6), 0 0 26px hsla(342,100%,59%,0.10)" }} />
              </div>
            </div>
            <style>{`
              @keyframes erpFloatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
              @keyframes erpFloatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
              .erp-float-a { animation: erpFloatA 5s ease-in-out infinite; }
              .erp-float-b { animation: erpFloatB 6s ease-in-out infinite; animation-delay: 0.6s; }
            `}</style>
          </Reveal>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>01 — PROBLEM</SectionLabel>
          <H2>The existing ERP held students back.</H2>
          <p className="text-white/60 max-w-2xl mb-8">Built years ago and rarely updated, the portal failed at the basics — navigation, hierarchy, mobile usability, and accessibility.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["Outdated Interface", "Visual language stuck in legacy patterns."],
            ["Difficult Navigation", "Modules buried behind multiple unclear clicks."],
            ["Poor Hierarchy", "Equal visual weight on everything — nothing stood out."],
            ["Inconsistent Design", "Mixed components, colors, and typography across pages."],
            ["Weak Mobile Experience", "Layouts broke on phones despite being the primary device."],
            ["Poor Accessibility", "Low contrast, small targets, no dark mode."],
          ].map(([t, d]) => (
            <div key={t} className={`${card} p-5 transition-transform duration-300 hover:-translate-y-0.5`}>
              <h3 className="text-white font-semibold mb-1.5">{t}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RESEARCH */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>02 — RESEARCH</SectionLabel>
          <H2>Research Findings</H2>
          <p className="text-white/60 max-w-2xl mb-8">Survey of 80+ students across years and devices, supplemented by contextual interviews.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {research.map((r) => (
            <div key={r.value} className={`${card} p-5 transition-transform duration-300 hover:-translate-y-0.5`}>
              <div className="font-sans font-bold mb-2" style={{ fontSize: "clamp(26px, 3vw, 34px)", color: CYAN, textShadow: "0 0 8px hsla(187,100%,50%,0.18)" }}>
                <CountUp value={r.value} />
              </div>
              <p className="text-white/60 text-sm leading-snug">{r.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PERSONAS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>03 — USERS</SectionLabel>
          <H2>User Personas</H2>
          <p className="text-white/60 max-w-2xl mb-8">Two representative personas synthesized from research, guiding every design decision.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-5">
          {personas.map((p) => (
            <div key={p.name} className={`${card} p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20`}>
              <div className="grid md:grid-cols-[160px,1fr] gap-6">
                {/* Left: avatar + info */}
                <div className="flex md:flex-col items-center md:items-start gap-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0"
                    style={{ boxShadow: `0 0 24px ${p.color === CYAN ? "hsla(187,100%,50%,0.18)" : "hsla(342,100%,59%,0.18)"}` }}>
                    <PersonaAvatar color={p.color} seed={p.seed} />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">{p.name}</div>
                    <div className="text-white/55 text-sm">Age {p.age}</div>
                    <div className="text-white/55 text-sm">{p.role}</div>
                  </div>
                </div>
                {/* Right: details */}
                <div>
                  {([
                    ["GOALS", p.goals], ["FRUSTRATIONS", p.frustrations], ["NEEDS", p.needs],
                  ] as const).map(([label, items]) => (
                    <div key={label} className="mb-4">
                      <div className="font-pixel text-[8px] tracking-widest text-white/40 mb-2">{label}</div>
                      <ul className="space-y-1">
                        {items.map(it => (
                          <li key={it} className="text-white/75 text-sm flex gap-2">
                            <span style={{ color: p.color }} className="mt-1">·</span>{it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="pt-3 mt-2 border-t border-white/10 flex gap-2 text-white/65 text-sm italic">
                    <Quote size={14} className="shrink-0 mt-1" style={{ color: p.color }} />
                    <span>"{p.quote}"</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HEURISTIC */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>04 — EVALUATION</SectionLabel>
          <H2>Heuristic Evaluation</H2>
          <p className="text-white/60 max-w-2xl mb-8">Scored the existing portal against Nielsen's 10 usability heuristics. Every dimension scored below 60%.</p>
        </Reveal>
        <div className={`${card} p-6`}>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-4">
            {heuristics.map((h) => (
              <div key={h.name}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-white/85 text-sm font-medium">{h.name}</span>
                  <span className="font-pixel text-[10px]" style={{ color: h.score < 40 ? PINK : CYAN }}>{h.score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${h.score}%`,
                    background: h.score < 40
                      ? "linear-gradient(90deg, hsla(342,100%,59%,0.7), hsla(342,100%,59%,0.4))"
                      : "linear-gradient(90deg, hsla(187,100%,50%,0.7), hsla(187,100%,50%,0.4))",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>05 — PROCESS</SectionLabel>
          <H2>Design Process</H2>
        </Reveal>
        <div className="relative mt-8">
          <div className="hidden md:block absolute top-7 left-[8%] right-[8%] h-px" style={{
            background: "linear-gradient(90deg, transparent, hsla(187,100%,50%,0.25), hsla(342,100%,59%,0.25), transparent)"
          }} />
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {process.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex flex-col items-center text-center relative z-10">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                    style={{
                      background: "hsla(0,0%,4%,0.9)",
                      border: `1px solid ${i % 2 === 0 ? "hsla(187,100%,50%,0.35)" : "hsla(342,100%,59%,0.35)"}`,
                    }}>
                    <Icon size={20} style={{ color: i % 2 === 0 ? CYAN : PINK }} />
                  </div>
                  <div className="font-pixel text-[9px] tracking-widest text-white/40 mb-1">0{i + 1}</div>
                  <div className="text-white/85 text-sm font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>06 — TRANSFORMATION</SectionLabel>
          <H2>Before &amp; After</H2>
          <p className="text-white/60 max-w-2xl mb-12">Five core screens redesigned end-to-end — original on the left, mobile-first redesign on the right.</p>
        </Reveal>

        <div className="space-y-24">
          {showcases.map((s, i) => (
            <Reveal key={s.title} delay={0}>
              <div>
                <div className="flex items-baseline gap-3 mb-8">
                  <span className="font-pixel text-[10px] tracking-widest text-white/30">0{i + 1}</span>
                  <h3 className="font-sans font-semibold text-white text-xl md:text-2xl">{s.title}</h3>
                </div>

                {/* Screenshots — minimal framing, larger */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-8 items-end">
                  {([["BEFORE", s.before, PINK], ["AFTER", s.after, CYAN]] as const).map(([label, src, color]) => (
                    <div key={label} className="flex flex-col items-center">
                      <span className={`${tag} mb-4 self-start`} style={{
                        color, border: `1px solid ${color === CYAN ? "hsla(187,100%,50%,0.35)" : "hsla(342,100%,59%,0.35)"}`,
                        background: color === CYAN ? "hsla(187,100%,50%,0.06)" : "hsla(342,100%,59%,0.06)",
                      }}>{label}</span>
                      <img
                        src={src}
                        alt={`${s.title} ${label}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full max-w-[420px] h-auto rounded-[28px] transition-transform duration-500 hover:-translate-y-1"
                        style={{
                          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.55))",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Compact info cards */}
                <div className="grid md:grid-cols-3 gap-3 max-w-4xl">
                  {([
                    ["Challenge", s.challenge, PINK],
                    ["Design Decision", s.decision, CYAN],
                    ["Impact", s.impact, CYAN],
                  ] as const).map(([label, text, color]) => (
                    <div key={label} className={`${card} p-4`}>
                      <div className="font-pixel text-[8px] tracking-widest mb-2" style={{ color }}>{label.toUpperCase()}</div>
                      <p className="text-white/70 text-[13px] leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>07 — OUTCOMES</SectionLabel>
          <H2>Key Outcomes</H2>
          <p className="text-white/60 max-w-2xl mb-8">Qualitative improvements drawn from the redesign — focused on clarity, usability, and modern visual identity.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {outcomes.map((o) => (
            <div key={o} className={`${card} px-4 py-4 flex items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5`}>
              <CheckCircle2 size={18} style={{ color: CYAN }} className="shrink-0" />
              <span className="text-white/85 text-sm font-medium">{o}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-pixel text-[10px] tracking-widest text-white/40 mb-2">CASE STUDY · 2025</div>
            <div className="text-white/80 font-semibold">ERP Portal Redesign</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/#projects")}
              className="px-5 py-2.5 rounded-lg border border-white/15 text-white/80 text-sm hover:bg-white/5 transition-colors inline-flex items-center gap-2">
              <ArrowLeft size={14} /> Back to Projects
            </button>
            <a href="#" onClick={(e) => e.preventDefault()}
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
