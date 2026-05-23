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

/* ── Reveal on scroll (used sparingly for hero + showcases) ── */
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
      transform: v ? "translateY(0)" : "translateY(12px)",
      transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
    }}>{children}</div>
  );
}

/* ── Static (no-animation) wrapper to keep markup uniform ── */
function Static({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

/* ── Reusable bits — no backdrop blur for perf ── */
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

/* ── Page ── */
export default function ErpRedesign() {
  const navigate = useNavigate();

  const research = [
    { value: "56%", label: "Disliked current visual design" },
    { value: "57%", label: "Found navigation confusing" },
    { value: "93%", label: "Reported bugs or usability issues" },
    { value: "86%", label: "Found grievance process difficult" },
    { value: "79.5%", label: "Wanted dark mode support" },
  ];

  const personas = [
    {
      name: "Aarohi Sharma", age: 19, role: "Second Year Engineering Student",
      initials: "AS", color: CYAN,
      goals: ["Access academic tools quickly", "Track attendance", "View schedules easily"],
      frustrations: ["Confusing navigation", "Difficult module discovery", "Cluttered dashboard"],
      needs: ["Simple navigation", "Better organization", "Faster access to information"],
      quote: "I just want to find what I need without clicking through multiple screens.",
    },
    {
      name: "Rohan Mehta", age: 18, role: "First Year Student",
      initials: "RM", color: PINK,
      goals: ["Use ERP efficiently on mobile", "Submit forms quickly", "Stay updated on academics"],
      frustrations: ["Poor responsiveness", "Small touch targets", "Difficult mobile navigation"],
      needs: ["Mobile-first design", "Better accessibility", "Cleaner layouts"],
      quote: "I mostly use my phone, so everything should work smoothly there.",
    },
    {
      name: "Neha Patil", age: 20, role: "Third Year Engineering Student",
      initials: "NP", color: CYAN,
      goals: ["Track deadlines", "View academic progress", "Stay organized"],
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
      challenge: "The original login experience lacked visual hierarchy, clear branding, and intuitive form design.",
      decision: "Introduced a cleaner layout, improved typography, stronger branding visibility, and modernized form components.",
      impact: "Improved readability, trust, and ease of authentication." },
    { title: "Home Page", before: homeBefore, after: homeAfter,
      challenge: "Students struggled to quickly identify important modules due to cluttered layouts and weak hierarchy.",
      decision: "Reorganized modules into cleaner card structures with improved spacing and visual consistency.",
      impact: "Faster navigation and easier access to core academic functions." },
    { title: "Attendance Page", before: attBefore, after: attAfter,
      challenge: "Attendance information was difficult to scan and compare across subjects.",
      decision: "Added subject-wise attendance cards, visual indicators, and clearer information grouping.",
      impact: "Students can quickly understand attendance status and monitor progress." },
    { title: "Examination Page", before: examBefore, after: examAfter,
      challenge: "Important examination actions and deadlines lacked visibility and organization.",
      decision: "Introduced structured sections, deadline visibility, and simplified navigation paths.",
      impact: "Reduced cognitive load and improved exam-related task completion." },
    { title: "Grade Card Page", before: gradeBefore, after: gradeAfter,
      challenge: "Academic performance data felt dense and difficult to interpret.",
      decision: "Improved typography, hierarchy, spacing, and performance summaries.",
      impact: "Created a clearer and more accessible academic overview experience." },
  ];

  const outcomes = [
    "Simplified Navigation", "Improved Information Hierarchy", "Mobile-First Experience", "Better Readability",
    "Faster Access To Academic Tools", "Consistent Design Language", "Improved User Experience", "Modern Visual Identity",
  ];

  const reflections = [
    { title: "Importance of User Research", body: "Grounding decisions in real student feedback prevented assumption-led design and surfaced needs we didn't anticipate." },
    { title: "Designing for Real Workflows", body: "Mapping daily academic tasks revealed where students actually lost time, not where we thought they did." },
    { title: "Information Architecture", body: "Restructuring modules into clear groups had more impact than any visual change alone." },
    { title: "Aesthetics vs Usability", body: "Modern visuals matter, but clarity and consistency drove the largest usability gains." },
    { title: "Mobile-First Thinking", body: "Starting from a 375px frame forced ruthless prioritization that improved every breakpoint." },
    { title: "Scalable Interfaces", body: "Building with reusable components and tokens means the design can grow without breaking." },
  ];

  return (
    <div className="min-h-screen bg-background text-white font-body relative overflow-x-hidden">
      <Particles />

      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10" style={{
        background: "radial-gradient(ellipse 60% 40% at 20% 10%, hsla(187,100%,50%,0.06), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, hsla(342,100%,59%,0.05), transparent 60%)"
      }} />

      {/* Back nav */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pt-8">
        <button onClick={() => navigate("/#projects")}
          className="inline-flex items-center gap-2 font-pixel text-[10px] tracking-widest text-white/60 hover:text-cyan-300 transition-colors">
          <ArrowLeft size={14} /> BACK TO PROJECTS
        </button>
      </div>

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-20">
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

          {/* Floating collage */}
          <Reveal delay={0.15}>
            <div className="relative h-[420px] md:h-[480px]">
              <img src={loginAfter} alt="Login redesign mockup" loading="lazy"
                className="absolute top-0 left-4 w-[46%] rounded-2xl border border-white/10 shadow-2xl"
                style={{ transform: "rotate(-6deg)", boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px hsla(187,100%,50%,0.12)" }} />
              <img src={homeAfter} alt="Home redesign mockup" loading="lazy"
                className="absolute top-10 right-0 w-[46%] rounded-2xl border border-white/10 shadow-2xl"
                style={{ transform: "rotate(4deg)", boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px hsla(342,100%,59%,0.12)" }} />
              <img src={attAfter} alt="Attendance redesign mockup" loading="lazy"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[46%] rounded-2xl border border-white/10 shadow-2xl"
                style={{ transform: "rotate(-2deg)", boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px hsla(187,100%,50%,0.12)" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <Reveal>
          <SectionLabel>01 — PROBLEM</SectionLabel>
          <H2>The existing ERP held students back.</H2>
          <p className="text-white/60 max-w-2xl mb-10">Built years ago and rarely updated, the portal failed at the basics — navigation, hierarchy, mobile usability, and accessibility.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["Outdated Interface", "Visual language stuck in legacy patterns with no modern affordances."],
            ["Difficult Navigation", "Important modules buried behind multiple unclear clicks."],
            ["Poor Hierarchy", "Equal visual weight on everything — nothing stood out."],
            ["Inconsistent Design", "Mixed components, colors, and typography across pages."],
            ["Weak Mobile Experience", "Layouts broke on phones despite being the primary device."],
            ["Poor Accessibility", "Low contrast, small targets, and no dark mode support."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.04}>
              <div className={`${card} p-5 h-full`}>
                <h3 className="text-white font-semibold mb-1.5">{t}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RESEARCH */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <Reveal>
          <SectionLabel>02 — RESEARCH</SectionLabel>
          <H2>Research Findings</H2>
          <p className="text-white/60 max-w-2xl mb-10">Survey of 80+ students across years and devices, supplemented by contextual interviews.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {research.map((r, i) => (
            <Reveal key={r.value} delay={i * 0.05}>
              <div className={`${card} p-5 h-full`}>
                <div className="font-sans font-bold text-white mb-2" style={{ fontSize: "clamp(28px, 3vw, 36px)", color: CYAN, textShadow: "0 0 10px hsla(187,100%,50%,0.25)" }}>
                  {r.value}
                </div>
                <p className="text-white/60 text-sm leading-snug">{r.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PERSONAS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <Reveal>
          <SectionLabel>03 — USERS</SectionLabel>
          <H2>User Personas</H2>
          <p className="text-white/60 max-w-2xl mb-10">Three representative personas synthesized from research, guiding every design decision.</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {personas.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div className={`${card} p-6 h-full flex flex-col`}>
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/10">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-sans font-semibold text-lg shrink-0"
                    style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color === CYAN ? "hsl(187,80%,35%)" : "hsl(342,80%,40%)"})`, color: "white" }}>
                    {p.initials}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{p.name}</div>
                    <div className="text-white/50 text-xs">Age {p.age} · {p.role}</div>
                  </div>
                </div>

                {([
                  ["GOALS", p.goals], ["FRUSTRATIONS", p.frustrations], ["NEEDS", p.needs],
                ] as const).map(([label, items]) => (
                  <div key={label} className="mb-4">
                    <div className="font-pixel text-[8px] tracking-widest text-white/40 mb-2">{label}</div>
                    <ul className="space-y-1">
                      {items.map(it => (
                        <li key={it} className="text-white/70 text-sm flex gap-2">
                          <span className="text-cyan-400/60 mt-1.5">·</span>{it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="mt-auto pt-4 border-t border-white/10 flex gap-2 text-white/65 text-sm italic">
                  <Quote size={14} className="shrink-0 mt-1" style={{ color: p.color }} />
                  <span>"{p.quote}"</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HEURISTIC */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <Reveal>
          <SectionLabel>04 — EVALUATION</SectionLabel>
          <H2>Heuristic Evaluation</H2>
          <p className="text-white/60 max-w-2xl mb-10">Scored the existing portal against Nielsen's 10 usability heuristics. Every dimension scored below 60%.</p>
        </Reveal>
        <div className={`${card} p-6`}>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-4">
            {heuristics.map((h, i) => (
              <Reveal key={h.name} delay={i * 0.03}>
                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-white/85 text-sm font-medium">{h.name}</span>
                    <span className="font-pixel text-[10px]" style={{ color: h.score < 40 ? PINK : CYAN }}>{h.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${h.score}%`,
                      background: h.score < 40
                        ? "linear-gradient(90deg, hsla(342,100%,59%,0.7), hsla(342,100%,59%,0.4))"
                        : "linear-gradient(90deg, hsla(187,100%,50%,0.7), hsla(187,100%,50%,0.4))",
                      boxShadow: `0 0 8px ${h.score < 40 ? "hsla(342,100%,59%,0.3)" : "hsla(187,100%,50%,0.3)"}`,
                    }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <Reveal>
          <SectionLabel>05 — PROCESS</SectionLabel>
          <H2>Design Process</H2>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="relative mt-8">
            <div className="hidden md:block absolute top-7 left-[8%] right-[8%] h-px" style={{
              background: "linear-gradient(90deg, transparent, hsla(187,100%,50%,0.3), hsla(342,100%,59%,0.3), transparent)"
            }} />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {process.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex flex-col items-center text-center relative z-10">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                      style={{
                        background: "hsla(0,0%,4%,0.9)",
                        border: `1px solid ${i % 2 === 0 ? "hsla(187,100%,50%,0.4)" : "hsla(342,100%,59%,0.4)"}`,
                        boxShadow: `0 0 12px ${i % 2 === 0 ? "hsla(187,100%,50%,0.15)" : "hsla(342,100%,59%,0.15)"}`,
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
        </Reveal>
      </section>

      {/* SHOWCASE */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <Reveal>
          <SectionLabel>06 — TRANSFORMATION</SectionLabel>
          <H2>Before &amp; After</H2>
          <p className="text-white/60 max-w-2xl mb-12">Five core screens redesigned end-to-end. The originals are shown on the left, the redesigned mobile-first experience on the right.</p>
        </Reveal>

        <div className="space-y-20">
          {showcases.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <div>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-pixel text-[10px] tracking-widest text-white/30">0{i + 1}</span>
                  <h3 className="font-sans font-semibold text-white text-xl md:text-2xl">{s.title}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {([["BEFORE", s.before, PINK], ["AFTER", s.after, CYAN]] as const).map(([label, src, color]) => (
                    <div key={label} className="group">
                      <div className="flex items-center justify-between mb-3">
                        <span className={tag} style={{
                          color, border: `1px solid ${color === CYAN ? "hsla(187,100%,50%,0.35)" : "hsla(342,100%,59%,0.35)"}`,
                          background: color === CYAN ? "hsla(187,100%,50%,0.06)" : "hsla(342,100%,59%,0.06)",
                        }}>{label}</span>
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/30 flex items-center justify-center p-4 transition-all duration-500 group-hover:border-white/20"
                        style={{ minHeight: 480, boxShadow: `0 10px 40px rgba(0,0,0,0.4)` }}>
                        <img src={src} alt={`${s.title} ${label}`} loading="lazy"
                          className="max-h-[520px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {([
                    ["Challenge", s.challenge, PINK],
                    ["Design Decision", s.decision, CYAN],
                    ["Impact", s.impact, CYAN],
                  ] as const).map(([label, text, color]) => (
                    <div key={label} className={`${card} p-5`}>
                      <div className="font-pixel text-[9px] tracking-widest mb-2" style={{ color }}>{label.toUpperCase()}</div>
                      <p className="text-white/70 text-sm leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <Reveal>
          <SectionLabel>07 — OUTCOMES</SectionLabel>
          <H2>Key Outcomes</H2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          {outcomes.map((o, i) => (
            <Reveal key={o} delay={i * 0.04}>
              <div className={`${card} px-4 py-4 flex items-center gap-3 h-full`}>
                <CheckCircle2 size={18} style={{ color: CYAN }} className="shrink-0" />
                <span className="text-white/85 text-sm font-medium">{o}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REFLECTION */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <Reveal>
          <SectionLabel>08 — REFLECTION</SectionLabel>
          <H2>Lessons Learned</H2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {reflections.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.05}>
              <div className={`${card} p-5 h-full`}>
                <h3 className="text-white font-semibold mb-2">{r.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{r.body}</p>
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
