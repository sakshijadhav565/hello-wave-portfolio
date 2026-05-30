import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Figma, Search, BarChart3, PenTool, Palette, MousePointer2,
  CheckCircle2, Quote, AlertTriangle, Target, Lightbulb, ArrowRight,
  MessageSquare, Layers, Type, Grid3x3, ShieldCheck, Sparkles,
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

import personaAarohi from "@/assets/persona-aarohi.jpg";
import personaNeha from "@/assets/persona-neha.jpg";

const CYAN = "hsl(187, 100%, 50%)";
const PINK = "hsl(342, 100%, 59%)";

/* ── Lightweight floating particles ── */
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

function SeverityBadge({ level }: { level: "Critical" | "Major" | "Moderate" | "Minor" }) {
  const map = {
    Critical: { c: "hsl(0,90%,62%)", bg: "hsla(0,90%,62%,0.1)" },
    Major: { c: PINK, bg: "hsla(342,100%,59%,0.1)" },
    Moderate: { c: "hsl(38,100%,60%)", bg: "hsla(38,100%,60%,0.1)" },
    Minor: { c: CYAN, bg: "hsla(187,100%,50%,0.1)" },
  } as const;
  const { c, bg } = map[level];
  return (
    <span className="font-pixel text-[8px] tracking-widest px-2 py-0.5 rounded-full"
      style={{ color: c, background: bg, border: `1px solid ${c}40` }}>{level.toUpperCase()}</span>
  );
}

export default function ErpRedesign() {
  const navigate = useNavigate();

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroMetrics = [
    { value: "80+", label: "Students Surveyed" },
    { value: "10", label: "Heuristics Evaluated" },
    { value: "12+", label: "Pain Points Identified" },
    { value: "8+", label: "Screens Redesigned" },
  ];

  const research = [
    {
      value: "56%", title: "Disliked Visual Design",
      desc: "Students described the interface as outdated and visually cluttered.",
      why: "Poor visual design erodes daily-use confidence and engagement.",
    },
    {
      value: "57%", title: "Struggled With Navigation",
      desc: "Users couldn't reliably locate academic modules without trial and error.",
      why: "Hidden navigation slows critical academic workflows.",
    },
    {
      value: "93%", title: "Reported Bugs",
      desc: "Nearly every respondent encountered functional issues regularly.",
      why: "Frequent bugs reduced trust and damaged the overall experience.",
    },
    {
      value: "86%", title: "Found Grievance Hard",
      desc: "The complaint flow was perceived as confusing and unhelpful.",
      why: "A broken support loop leaves issues unresolved and users frustrated.",
    },
    {
      value: "79.5%", title: "Requested Dark Mode",
      desc: "A strong majority asked for an accessibility-oriented dark theme.",
      why: "Comfort and accessibility directly impact long study sessions.",
    },
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
    "Easy, predictable navigation",
    "Mobile-friendly experience",
    "Clear attendance visibility",
    "Timely, useful notifications",
    "Faster academic workflows",
    "Transparent academic information",
  ];
  const gaps = [
    "Poor responsiveness across devices",
    "Complex, multi-level navigation",
    "Critical information hidden",
    "Weak or missing notification system",
    "Cluttered, friction-heavy workflows",
    "Flat hierarchy with no emphasis",
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

  const userFlow = [
    "Login", "Home", "Dashboard", "Academics", "Attendance", "Examination", "Grade Card", "Accounts",
  ];

  const process = [
    {
      icon: Search, label: "Research",
      items: ["Survey of 80+ students", "Contextual interviews", "Pain point synthesis"],
    },
    {
      icon: BarChart3, label: "Analysis",
      items: ["UX audit of legacy portal", "Heuristic evaluation", "Expectations vs gap analysis"],
    },
    {
      icon: PenTool, label: "Wireframing",
      items: ["Information architecture", "Low-fidelity concepts", "Mobile-first layouts"],
    },
    {
      icon: Palette, label: "Visual Design",
      items: ["Design system definition", "UI component refinement", "Dark theme exploration"],
    },
    {
      icon: MousePointer2, label: "Prototype",
      items: ["High-fidelity Figma flows", "Interaction states", "Stakeholder review rounds"],
    },
    {
      icon: CheckCircle2, label: "Final Solution",
      items: ["Cohesive ERP redesign", "8+ redesigned screens", "Mobile-first delivery"],
    },
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
    { title: "Examination Page", before: examBefore, after: examAfter,
      insight: "Exam actions and deadlines lacked visibility and surfacing.",
      decision: "Structured sections surfacing deadlines, schedules, and entry actions.",
      outcome: "Reduced cognitive load for time-sensitive exam workflows." },
  ];

  const additionalScreens = [
    { title: "Dashboard", img: dashboardImg, note: "Personalized academic overview with prioritized cards." },
    { title: "Grade Card", img: gradeCardImg, note: "Readable grade summary with per-subject breakdown." },
    { title: "Test Scores", img: testScoreImg, note: "Compact score timeline with semester filters." },
    { title: "Academics Module", img: academicsImg, note: "Reorganized academic module hub with clear grouping." },
  ];

  const lessons = [
    { icon: Search, title: "Research Validates Assumptions",
      text: "Direct student input replaced guesswork and reshaped early design directions." },
    { icon: MousePointer2, title: "Mobile-First Improves Access",
      text: "Designing for phones first forced clarity and exposed every weak hierarchy." },
    { icon: Layers, title: "Design Systems Build Consistency",
      text: "Tokens and reusable components removed visual drift across modules." },
    { icon: Type, title: "Academic Tools Need Clear Hierarchy",
      text: "Students scan, not read. Typography and grouping carry the experience." },
    { icon: Sparkles, title: "Small UX Wins Compound",
      text: "Micro-improvements in spacing, labels, and feedback radically lift usability." },
  ];

  const outcomes = [
    { title: "Simplified Navigation",
      text: "Students reach key academic functions with fewer taps and improved discoverability." },
    { title: "Better Information Hierarchy",
      text: "Critical data is surfaced through typography, spacing, and grouping decisions." },
    { title: "Mobile-First Experience",
      text: "Every screen was redesigned around how students actually use the portal — on phones." },
    { title: "Faster Academic Workflows",
      text: "Common journeys like attendance and exam checks now take a fraction of the time." },
    { title: "Improved Readability",
      text: "Refined typography and dark theme reduce strain across long academic sessions." },
    { title: "Modern Visual Identity",
      text: "A cohesive component system replaces the previous fragmented, dated UI." },
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
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <SectionLabel color={PINK}>UI / UX CASE STUDY</SectionLabel>
            <h1 className="font-sans font-bold tracking-tight text-white mt-4 mb-4" style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05 }}>
              ERP Portal <span style={{ color: CYAN }}>Redesign</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-8">
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
                  <dt className="font-pixel text-[9px] tracking-widest text-white/40 mb-1">{k.toUpperCase()}</dt>
                  <dd className="text-white/90 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

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

        {/* Hero metrics row */}
        <Reveal delay={0.25}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12">
            {heroMetrics.map((m) => (
              <div key={m.label} className={`${card} p-4 text-center transition-transform duration-300 hover:-translate-y-0.5`}>
                <div className="font-sans font-bold mb-1" style={{ fontSize: "clamp(22px, 2.6vw, 30px)", color: CYAN, textShadow: "0 0 10px hsla(187,100%,50%,0.18)" }}>
                  {m.value}
                </div>
                <div className="text-white/55 text-xs md:text-sm leading-snug">{m.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* PROBLEM */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>01 — PROBLEM</SectionLabel>
          <H2>The existing ERP held students back.</H2>
          <p className="text-white/60 max-w-2xl mb-8">Built years ago and rarely updated, the portal failed at the basics — navigation, hierarchy, mobile usability, and accessibility.</p>
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
                <div className="font-pixel text-[10px] tracking-widest mb-2" style={{ color: PINK }}>PROBLEM STATEMENT</div>
                <p className="text-white/85 text-base md:text-lg leading-relaxed">
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
          ].map(([t, d]) => (
            <div key={t} className={`${card} p-5 transition-transform duration-300 hover:-translate-y-0.5`}>
              <h3 className="text-white font-semibold mb-1.5">{t}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GOAL */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
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
                <div className="font-pixel text-[10px] tracking-widest mb-2" style={{ color: CYAN }}>GOAL STATEMENT</div>
                <p className="text-white/85 text-base md:text-lg leading-relaxed">
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
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>03 — RESEARCH</SectionLabel>
          <H2>Research Findings</H2>
          <p className="text-white/60 max-w-2xl mb-8">Survey of 80+ students across years and devices, supplemented by contextual interviews.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {research.map((r, i) => (
            <Reveal key={r.value} delay={i * 0.05}>
              <div className={`${card} p-5 h-full transition-transform duration-300 hover:-translate-y-0.5`}>
                <div className="font-sans font-bold mb-2" style={{ fontSize: "clamp(28px, 3vw, 36px)", color: CYAN, textShadow: "0 0 8px hsla(187,100%,50%,0.18)" }}>
                  <CountUp value={r.value} />
                </div>
                <div className="text-white font-semibold mb-1.5">{r.title}</div>
                <p className="text-white/60 text-sm leading-relaxed mb-3">{r.desc}</p>
                <div className="pt-3 border-t border-white/10">
                  <div className="font-pixel text-[8px] tracking-widest text-white/40 mb-1">WHY IT MATTERS</div>
                  <p className="text-white/70 text-sm leading-relaxed">{r.why}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VOICE OF STUDENTS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel color={PINK}>04 — VOICE OF STUDENTS</SectionLabel>
          <H2>In their own words.</H2>
          <p className="text-white/60 max-w-2xl mb-8">Direct feedback collected during research — the friction students live with every day.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {voices.map((v, i) => (
            <Reveal key={v.theme} delay={i * 0.04}>
              <div className={`${card} p-5 h-full transition-transform duration-300 hover:-translate-y-0.5`}>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={14} style={{ color: PINK }} />
                  <span className="font-pixel text-[9px] tracking-widest" style={{ color: PINK }}>{v.theme.toUpperCase()}</span>
                </div>
                <p className="text-white/80 text-[15px] leading-relaxed italic">"{v.text}"</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EXPECTATIONS VS GAPS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>05 — GAP ANALYSIS</SectionLabel>
          <H2>Expectations vs Platform Gaps</H2>
          <p className="text-white/60 max-w-2xl mb-8">Bridging what students wanted with what the legacy platform actually delivered — the design brief in two columns.</p>
        </Reveal>
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
          <div className="rounded-2xl p-5 md:p-6"
            style={{ background: "linear-gradient(135deg, hsla(187,100%,50%,0.05), hsla(0,0%,4%,0.5))", border: "1px solid hsla(187,100%,50%,0.22)" }}>
            <div className="font-pixel text-[10px] tracking-widest mb-4" style={{ color: CYAN }}>USER EXPECTATIONS</div>
            <ul className="space-y-3">
              {expectations.map((e) => (
                <li key={e} className="flex items-start gap-3 text-white/85 text-sm">
                  <CheckCircle2 size={16} style={{ color: CYAN }} className="mt-0.5 shrink-0" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <ArrowRight size={28} className="text-white/30" />
          </div>
          <div className="rounded-2xl p-5 md:p-6"
            style={{ background: "linear-gradient(135deg, hsla(342,100%,59%,0.05), hsla(0,0%,4%,0.5))", border: "1px solid hsla(342,100%,59%,0.22)" }}>
            <div className="font-pixel text-[10px] tracking-widest mb-4" style={{ color: PINK }}>CURRENT PLATFORM GAPS</div>
            <ul className="space-y-3">
              {gaps.map((g) => (
                <li key={g} className="flex items-start gap-3 text-white/85 text-sm">
                  <AlertTriangle size={16} style={{ color: PINK }} className="mt-0.5 shrink-0" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>06 — USERS</SectionLabel>
          <H2>User Personas</H2>
          <p className="text-white/60 max-w-2xl mb-8">Two representative engineering students synthesized from research, guiding every design decision.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-5">
          {personas.map((p, idx) => (
            <Reveal key={p.name} delay={idx * 0.08}>
              <div className={`${card} p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:border-white/20 group`}
                style={{ boxShadow: `0 0 0 1px transparent` }}>
                <div className="grid md:grid-cols-[140px,1fr] gap-5">
                  <div className="flex md:flex-col items-center md:items-start gap-4">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{
                        border: `1px solid ${p.color === CYAN ? "hsla(187,100%,50%,0.35)" : "hsla(342,100%,59%,0.35)"}`,
                        boxShadow: `0 0 28px ${p.color === CYAN ? "hsla(187,100%,50%,0.20)" : "hsla(342,100%,59%,0.20)"}`,
                      }}>
                      <img src={p.img} alt={p.name} loading="lazy" decoding="async"
                        className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-lg leading-tight">{p.name}</div>
                      <div className="text-white/55 text-sm">Age {p.age} · {p.year}</div>
                      <div className="text-white/45 text-xs mt-1">{p.program}</div>
                    </div>
                  </div>
                  <div>
                    {([
                      ["GOALS", p.goals],
                      ["BEHAVIORS", p.behaviors],
                      ["FRUSTRATIONS", p.frustrations],
                      ["NEEDS", p.needs],
                    ] as const).map(([label, items]) => (
                      <div key={label} className="mb-3">
                        <div className="font-pixel text-[8px] tracking-widest text-white/40 mb-1.5">{label}</div>
                        <ul className="space-y-1">
                          {items.map((it) => (
                            <li key={it} className="text-white/75 text-sm flex gap-2">
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
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>07 — EVALUATION</SectionLabel>
          <H2>Heuristic Evaluation</H2>
          <p className="text-white/60 max-w-2xl mb-8">Scored against Nielsen's 10 usability heuristics with severity tags — every dimension scored below 60%.</p>
        </Reveal>
        <div className={`${card} p-6`}>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
            {heuristics.map((h) => (
              <div key={h.name}>
                <div className="flex justify-between items-baseline mb-1.5 gap-3">
                  <span className="text-white/85 text-sm font-medium">{h.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <SeverityBadge level={h.severity} />
                    <span className="font-pixel text-[10px]" style={{ color: h.score < 40 ? PINK : CYAN }}>{h.score}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-1.5">
                  <div className="h-full rounded-full" style={{
                    width: `${h.score}%`,
                    background: h.score < 40
                      ? "linear-gradient(90deg, hsla(342,100%,59%,0.7), hsla(342,100%,59%,0.4))"
                      : "linear-gradient(90deg, hsla(187,100%,50%,0.7), hsla(187,100%,50%,0.4))",
                  }} />
                </div>
                <p className="text-white/55 text-xs leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USER FLOW */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>08 — USER FLOW</SectionLabel>
          <H2>Redesigned User Flow</H2>
          <p className="text-white/60 max-w-2xl mb-8">A linear, mobile-friendly flow that surfaces the most-used academic journeys first and removes hidden detours.</p>
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
              <div key={t} className="rounded-lg p-4 border border-white/10 bg-white/[0.02]">
                <div className="font-pixel text-[8px] tracking-widest text-white/40 mb-2">{t.toUpperCase()}</div>
                <p className="text-white/70 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>09 — PROCESS</SectionLabel>
          <H2>Design Process</H2>
          <p className="text-white/60 max-w-2xl mb-8">Six structured stages, from raw research to a delivered redesign.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {process.map((s, i) => {
            const Icon = s.icon;
            const color = i % 2 === 0 ? CYAN : PINK;
            return (
              <Reveal key={s.label} delay={i * 0.04}>
                <div className={`${card} p-5 h-full transition-transform duration-300 hover:-translate-y-0.5`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: "hsla(0,0%,4%,0.9)", border: `1px solid ${color}55` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <div className="font-pixel text-[8px] tracking-widest text-white/40">0{i + 1}</div>
                      <div className="text-white font-semibold text-sm">{s.label}</div>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {s.items.map((it) => (
                      <li key={it} className="text-white/65 text-sm flex gap-2">
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

      {/* DESIGN SYSTEM */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>10 — DESIGN SYSTEM</SectionLabel>
          <H2>Design System</H2>
          <p className="text-white/60 max-w-2xl mb-8">A small, opinionated system that powers every redesigned screen.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Color palette */}
          <div className={`${card} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <Palette size={16} style={{ color: CYAN }} />
              <span className="font-pixel text-[9px] tracking-widest text-white/50">COLOR PALETTE</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Primary Blue", "#2563eb"],
                ["Accent Cyan", "#22d3ee"],
                ["Dark Background", "#0a0a0a"],
                ["Neutral Gray", "#9ca3af"],
              ].map(([name, hex]) => (
                <div key={hex} className="flex items-center gap-3 p-2 rounded-lg border border-white/10 bg-white/[0.02]">
                  <div className="w-8 h-8 rounded-md border border-white/15 shrink-0" style={{ background: hex }} />
                  <div className="min-w-0">
                    <div className="text-white/85 text-sm font-medium truncate">{name}</div>
                    <div className="font-pixel text-[9px] text-white/40">{hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className={`${card} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <Type size={16} style={{ color: PINK }} />
              <span className="font-pixel text-[9px] tracking-widest text-white/50">TYPOGRAPHY</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                <div className="text-white text-2xl font-bold leading-tight">Heading</div>
                <div className="font-pixel text-[9px] text-white/40 mt-1">Sans · Bold · 32 / 24 / 20</div>
              </div>
              <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                <div className="text-white/85 text-sm">Body text — clear, scannable, optimized for academic content.</div>
                <div className="font-pixel text-[9px] text-white/40 mt-1">Sans · Regular · 16 / 14</div>
              </div>
              <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                <div className="font-pixel text-[10px] tracking-widest text-white/60">LABEL / CAPTION</div>
                <div className="font-pixel text-[9px] text-white/40 mt-1">Pixel · 10 / 9</div>
              </div>
            </div>
          </div>

          {/* Components */}
          <div className={`${card} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <Grid3x3 size={16} style={{ color: CYAN }} />
              <span className="font-pixel text-[9px] tracking-widest text-white/50">COMPONENTS</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Buttons", "Cards", "Navigation", "Input Fields", "Status Chips", "Tabs", "Modals", "Lists"].map((c) => (
                <span key={c} className="px-3 py-1.5 rounded-full text-xs text-white/80 border border-white/15 bg-white/[0.03]">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Principles */}
          <div className={`${card} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} style={{ color: PINK }} />
              <span className="font-pixel text-[9px] tracking-widest text-white/50">PRINCIPLES</span>
            </div>
            <ul className="space-y-2">
              {[
                ["Consistency", "One pattern across every module."],
                ["Accessibility", "Contrast, touch targets, dark mode."],
                ["Clarity", "Strong hierarchy and plain language."],
                ["Mobile-First", "Designed for phones, scaled up."],
              ].map(([t, d]) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 size={14} style={{ color: CYAN }} className="mt-1 shrink-0" />
                  <div>
                    <span className="text-white/90 text-sm font-medium">{t}</span>
                    <span className="text-white/55 text-sm"> — {d}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SHOWCASE — compact comparison */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>11 — TRANSFORMATION</SectionLabel>
          <H2>Before &amp; After</H2>
          <p className="text-white/60 max-w-2xl mb-12">Five core screens redesigned end-to-end. Each pairs research insight, design decision, and outcome.</p>
        </Reveal>

        <div className="space-y-16">
          {showcases.map((s, i) => (
            <Reveal key={s.title}>
              <div>
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-pixel text-[10px] tracking-widest text-white/30">0{i + 1}</span>
                  <h3 className="font-sans font-semibold text-white text-lg md:text-xl">{s.title}</h3>
                </div>

                {/* Compact comparison */}
                <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-5">
                  {([["BEFORE", s.before, PINK], ["AFTER", s.after, CYAN]] as const).map(([label, src, color]) => (
                    <div key={label} className="flex flex-col items-center">
                      <span className={`${tag} mb-3 self-start`} style={{
                        color, border: `1px solid ${color === CYAN ? "hsla(187,100%,50%,0.35)" : "hsla(342,100%,59%,0.35)"}`,
                        background: color === CYAN ? "hsla(187,100%,50%,0.06)" : "hsla(342,100%,59%,0.06)",
                      }}>{label}</span>
                      <img
                        src={src}
                        alt={`${s.title} ${label}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full max-w-[280px] h-auto rounded-[22px] transition-transform duration-500 hover:-translate-y-1"
                        style={{ filter: "drop-shadow(0 14px 32px rgba(0,0,0,0.55))" }}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  {([
                    ["Research Insight", s.insight, PINK],
                    ["Design Decision", s.decision, CYAN],
                    ["Outcome", s.outcome, CYAN],
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

      {/* ADDITIONAL REDESIGNS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel color={PINK}>12 — MORE SCREENS</SectionLabel>
          <H2>Additional Redesigned Screens</H2>
          <p className="text-white/60 max-w-2xl mb-8">Supporting screens explored as part of the broader redesign system — dashboard, grade card, accounts, and exam workflows.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {additionalScreens.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.05}>
              <div className={`${card} p-4 h-full transition-transform duration-300 hover:-translate-y-0.5`}>
                <div className="rounded-xl overflow-hidden mb-3 bg-black/30 border border-white/10">
                  <img src={a.img} alt={a.title} loading="lazy" decoding="async"
                    className="w-full h-44 object-cover object-top" />
                </div>
                <div className="font-pixel text-[9px] tracking-widest mb-1.5" style={{ color: i % 2 === 0 ? CYAN : PINK }}>
                  {a.title.toUpperCase()}
                </div>
                <p className="text-white/65 text-sm leading-relaxed">{a.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LESSONS LEARNED */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>13 — REFLECTION</SectionLabel>
          <H2>Lessons Learned</H2>
          <p className="text-white/60 max-w-2xl mb-8">Key takeaways from running a research-driven academic UX redesign.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((l, i) => {
            const Icon = l.icon;
            const color = i % 2 === 0 ? CYAN : PINK;
            return (
              <Reveal key={l.title} delay={i * 0.04}>
                <div className={`${card} p-5 h-full transition-transform duration-300 hover:-translate-y-0.5`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Lightbulb size={16} style={{ color }} />
                    <Icon size={14} className="text-white/40" />
                  </div>
                  <div className="text-white font-semibold mb-1.5">{l.title}</div>
                  <p className="text-white/60 text-sm leading-relaxed">{l.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-14 border-t border-white/5">
        <Reveal>
          <SectionLabel>14 — OUTCOMES</SectionLabel>
          <H2>Key Outcomes</H2>
          <p className="text-white/60 max-w-2xl mb-8">Qualitative improvements drawn from the redesign — focused on clarity, usability, and a modern visual identity.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {outcomes.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.04}>
              <div className={`${card} p-5 h-full transition-transform duration-300 hover:-translate-y-0.5`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} style={{ color: CYAN }} />
                  <span className="text-white font-semibold">{o.title}</span>
                </div>
                <p className="text-white/65 text-sm leading-relaxed">{o.text}</p>
              </div>
            </Reveal>
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
