import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ExternalLink, Figma, ChevronDown } from "lucide-react";
import erpLogin from "@/assets/erp-login.png";
import erpHome from "@/assets/erp-home.png";
import erpDashboard from "@/assets/erp-dashboard.png";
import erpAcademics from "@/assets/erp-academics.png";
import erpAttendance from "@/assets/erp-attendance.png";
import erpExamination from "@/assets/erp-examination.png";
import erpTestscore from "@/assets/erp-testscore.png";
import erpGradecard from "@/assets/erp-gradecard.png";

const CYAN = "hsl(187, 100%, 50%)";
const PINK = "hsl(342, 100%, 59%)";

/* ── Particles ── */
function ParticlesCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.4,
      sx: (Math.random() - 0.5) * 0.06,
      sy: (Math.random() - 0.5) * 0.06,
      o: Math.random() * 0.5 + 0.15,
      pink: Math.random() > 0.75,
    }));
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc((p.x / 100) * w, (p.y / 100) * h, p.size, 0, Math.PI * 2);
        const color = p.pink ? `hsla(342, 100%, 59%, ${p.o})` : `hsla(187, 100%, 50%, ${p.o})`;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        p.x += p.sx;
        p.y += p.sy;
        if (p.x < 0 || p.x > 100) p.sx *= -1;
        if (p.y < 0 || p.y > 100) p.sy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none z-0" aria-hidden />;
}

/* ── Reveal ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Counter ── */
function Counter({ to, suffix = "%" }: { to: number; suffix?: string }) {
  const { ref, visible } = useReveal(0.3);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased * 10) / 10);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ── Section heading ── */
function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  const { ref, visible } = useReveal(0.2);
  return (
    <div
      ref={ref}
      className="mb-12 text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s ease-out",
      }}
    >
      <div
        className="font-pixel text-[10px] tracking-[0.3em] mb-3"
        style={{ color: PINK, textShadow: `0 0 10px ${PINK}` }}
      >
        {kicker}
      </div>
      <h2
        className="font-pixel tracking-widest animate-glow-pulse"
        style={{
          fontSize: "clamp(22px, 3.4vw, 38px)",
          color: CYAN,
          textShadow: `0 0 22px ${CYAN}, 0 0 44px hsla(187,100%,50%,0.35)`,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ── Glow card wrapper ── */
function GlowCard({
  children,
  className = "",
  accent = "cyan",
}: {
  children: React.ReactNode;
  className?: string;
  accent?: "cyan" | "pink";
}) {
  const [hover, setHover] = useState(false);
  const color = accent === "cyan" ? CYAN : PINK;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`rounded-xl p-6 transition-all duration-500 ${className}`}
      style={{
        background: "linear-gradient(135deg, hsla(187,100%,50%,0.04), hsla(0,0%,4%,0.7))",
        backdropFilter: "blur(14px)",
        border: `2px solid ${hover ? color : "hsla(187,100%,50%,0.2)"}`,
        boxShadow: hover
          ? `0 12px 50px ${color}40, 0 0 40px ${color}30, inset 0 1px 0 hsla(255,255,255,0.05)`
          : "0 6px 30px hsla(0,0%,0%,0.4), inset 0 1px 0 hsla(255,255,255,0.04)",
        transform: hover ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
      }}
    >
      {children}
    </div>
  );
}

/* ── Showcase row ── */
type ShowcaseProps = {
  num: string;
  title: string;
  img: string;
  problems: string[];
  improvements: string[];
  outcome: string;
  reverse?: boolean;
};
function ShowcaseRow({ num, title, img, problems, improvements, outcome, reverse }: ShowcaseProps) {
  const { ref, visible } = useReveal(0.12);
  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-2 gap-10 items-center ${reverse ? "md:[direction:rtl]" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Image */}
      <div className="[direction:ltr] relative group">
        <div
          className="absolute -inset-4 rounded-2xl opacity-60 blur-2xl pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(187,100%,50%,0.25), transparent 70%)" }}
        />
        <div
          className="relative rounded-xl overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]"
          style={{
            border: "1.5px solid hsla(187,100%,50%,0.4)",
            boxShadow: "0 20px 60px hsla(0,0%,0%,0.6), 0 0 30px hsla(187,100%,50%,0.2)",
            background: "hsla(0,0%,4%,0.6)",
            transform: "perspective(1200px) rotateX(2deg) rotateY(0deg)",
          }}
        >
          <img src={img} alt={title} loading="lazy" className="w-full h-auto block" />
        </div>
        <div
          className="absolute -top-3 -left-3 font-pixel text-[11px] px-3 py-1.5 rounded-md"
          style={{
            color: PINK,
            background: "hsla(0,0%,4%,0.9)",
            border: `1px solid ${PINK}`,
            boxShadow: `0 0 16px ${PINK}80`,
          }}
        >
          {num}
        </div>
      </div>

      {/* Text */}
      <div className="[direction:ltr] space-y-4">
        <h3
          className="font-pixel text-[14px] md:text-[16px] tracking-wider"
          style={{ color: CYAN, textShadow: `0 0 14px ${CYAN}80` }}
        >
          {title}
        </h3>

        <div>
          <p className="font-pixel text-[9px] tracking-widest mb-2" style={{ color: PINK }}>
            ▸ PROBLEMS IDENTIFIED
          </p>
          <ul className="space-y-1.5">
            {problems.map((p) => (
              <li key={p} className="font-body text-sm pl-4 relative" style={{ color: "hsla(0,0%,100%,0.72)" }}>
                <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full" style={{ background: PINK, boxShadow: `0 0 6px ${PINK}` }} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-pixel text-[9px] tracking-widest mb-2" style={{ color: CYAN }}>
            ▸ IMPROVEMENTS MADE
          </p>
          <ul className="space-y-1.5">
            {improvements.map((p) => (
              <li key={p} className="font-body text-sm pl-4 relative" style={{ color: "hsla(0,0%,100%,0.85)" }}>
                <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full" style={{ background: CYAN, boxShadow: `0 0 6px ${CYAN}` }} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="mt-3 rounded-lg p-3 font-body text-sm"
          style={{
            background: "hsla(187,100%,50%,0.06)",
            border: "1px solid hsla(187,100%,50%,0.25)",
            color: "hsla(0,0%,100%,0.85)",
          }}
        >
          <span className="font-pixel text-[9px] tracking-widest mr-2" style={{ color: CYAN }}>
            FINAL OUTCOME →
          </span>
          {outcome}
        </div>
      </div>
    </div>
  );
}

/* ── DATA ── */
const stats = [
  { v: 56, label: "Disliked Visual Design" },
  { v: 57, label: "Struggled With Navigation" },
  { v: 93, label: "Reported Bugs" },
  { v: 86, label: "Grievance Difficulty" },
  { v: 79.5, label: "Wanted Dark Mode" },
];

const painPoints = [
  "Confusing navigation",
  "Cluttered UI",
  "Broken features",
  "Poor responsiveness",
  "Difficult grievance system",
  "Inconsistent typography",
  "Hard-to-read grade cards",
  "Weak academic workflow visibility",
];

const stories = [
  {
    name: "Aarohi Sharma",
    role: "Second Year Engineering Student",
    avatar: "👩‍🎓",
    story:
      "Aarohi frequently struggled while navigating the old ERP portal during exam season. Important academic tools were difficult to locate, attendance tracking was unclear, and the cluttered interface made simple tasks stressful. After the redesign, Aarohi can now quickly access attendance, schedules, exam forms, and academic resources through a clean dashboard with intuitive navigation.",
    pain: "Confusing navigation and cluttered dashboard.",
    fix: "Simplified dashboard with quick academic access and improved visual hierarchy.",
  },
  {
    name: "Rohan Mehta",
    role: "First Year Student",
    avatar: "👨‍🎓",
    story:
      "Rohan mostly accessed the ERP system through his mobile phone, but the old interface was poorly responsive and difficult to use on smaller screens. Important buttons were hard to identify and forms were frustrating to complete. The redesigned mobile-first experience now allows him to navigate smoothly, submit forms easily, and track academic updates without confusion.",
    pain: "Poor mobile responsiveness.",
    fix: "Responsive mobile-first UI with cleaner layouts and better accessibility.",
  },
  {
    name: "Neha Patil",
    role: "Third Year Student",
    avatar: "👩‍💻",
    story:
      "Neha often missed important examination deadlines because notifications and updates were buried deep inside the old ERP portal. The redesign introduced a modern dashboard with upcoming deadlines, notice boards, and clearer academic workflows, helping her stay organized and stress-free.",
    pain: "Hidden updates and poor information hierarchy.",
    fix: "Centralized dashboard with notices and upcoming deadlines.",
  },
  {
    name: "Aditya Verma",
    role: "Final Year Student",
    avatar: "👨‍💼",
    story:
      "Aditya found the grievance system frustrating because submitting complaints required navigating through unclear workflows and inconsistent interfaces. The redesigned grievance experience simplified the process with intuitive navigation, cleaner forms, and improved accessibility.",
    pain: "Complicated grievance workflow.",
    fix: "Simplified grievance system with improved UX flow.",
  },
];

const heuristics = [
  { name: "User Control & Freedom", score: 62 },
  { name: "Error Prevention", score: 48 },
  { name: "Recognition rather than Recall", score: 55 },
  { name: "Help & Documentation", score: 40 },
  { name: "Aesthetic & Minimal Design", score: 44 },
  { name: "Help Users with Errors", score: 50 },
  { name: "Flexibility & Efficiency", score: 58 },
  { name: "Match System & Real World", score: 65 },
  { name: "Consistency & Standards", score: 52 },
  { name: "Visibility of System Status", score: 60 },
];

const userFlow = [
  "Login & Authentication",
  "Personalised Dashboard",
  "Academics Hub",
  "Attendance & Exams",
  "Results & Grade Card",
  "Notices & Grievance",
];

const showcases: ShowcaseProps[] = [
  {
    num: "01",
    title: "LOGIN SCREEN",
    img: erpLogin,
    problems: ["Poor visual hierarchy", "Weak branding visibility", "Cluttered dark interface", "Unclear input fields"],
    improvements: ["Cleaner modern layout", "Better spacing and typography", "Improved login accessibility", "Stronger institutional branding"],
    outcome: "A cleaner and more intuitive authentication experience with improved readability and accessibility.",
  },
  {
    num: "02",
    title: "HOME PAGE",
    img: erpHome,
    problems: ["Cluttered card arrangement", "Difficult navigation", "Weak content hierarchy"],
    improvements: ["Simplified dashboard cards", "Improved spacing and alignment", "Cleaner navigation structure", "Modern card-based UI"],
    outcome: "Students can now quickly access core ERP modules through a visually organized interface.",
    reverse: true,
  },
  {
    num: "03",
    title: "DASHBOARD",
    img: erpDashboard,
    problems: ["Empty/uninformative dashboard", "Missing academic overview", "Lack of quick access widgets"],
    improvements: ["Added GPA overview", "Added schedule tracking", "Added notice board", "Added dashboard widgets"],
    outcome: "A centralized dashboard experience providing students with important academic insights instantly.",
  },
  {
    num: "04",
    title: "ACADEMICS PAGE",
    img: erpAcademics,
    problems: ["Poor academic navigation", "Difficult attendance visibility", "Cluttered layouts"],
    improvements: ["Attendance preview card", "Improved card layouts", "Cleaner academic module organization"],
    outcome: "Improved academic accessibility with simplified navigation and better information hierarchy.",
    reverse: true,
  },
  {
    num: "05",
    title: "ATTENDANCE PAGE",
    img: erpAttendance,
    problems: ["Attendance visibility issues", "Difficult subject tracking", "Weak data visualization"],
    improvements: ["Subject-wise attendance cards", "Circular attendance indicators", "Better visual clarity"],
    outcome: "Students can now monitor attendance efficiently through clear visual progress indicators.",
  },
  {
    num: "06",
    title: "EXAMINATION PAGE",
    img: erpExamination,
    problems: ["Cluttered examination workflow", "Poor access to forms and deadlines", "Weak navigation"],
    improvements: ["Simplified examination modules", "Added upcoming deadlines", "Improved card hierarchy"],
    outcome: "A cleaner and stress-free examination experience with easier access to critical actions.",
    reverse: true,
  },
  {
    num: "07",
    title: "TEST SCORE PAGE",
    img: erpTestscore,
    problems: ["Difficult score interpretation", "Poor analytics visibility", "Lack of progress insights"],
    improvements: ["Added score analytics cards", "Improved performance visibility", "Better result organization"],
    outcome: "Students can now easily analyze academic performance with structured score visualization.",
  },
  {
    num: "08",
    title: "GRADE CARD PAGE",
    img: erpGradecard,
    problems: ["Hard-to-read grade table", "Dense information layout", "Poor readability"],
    improvements: ["Cleaner tabular hierarchy", "Improved typography", "Added semester GPA card"],
    outcome: "A modern and highly readable academic performance interface with better clarity.",
    reverse: true,
  },
];

const features = [
  "Attendance Tracking",
  "Exam Registration",
  "Dashboard Overview",
  "Fee Management",
  "Upcoming Deadlines",
  "Grade Analytics",
  "Responsive Mobile UI",
  "Improved Navigation",
  "Notice Board",
  "Better Academic Workflow",
];

const palette = [
  { name: "Neon Cyan", hex: "#00E5FF", color: "hsl(187,100%,50%)" },
  { name: "Hot Pink", hex: "#FF1F6D", color: "hsl(342,100%,59%)" },
  { name: "Deep Black", hex: "#000000", color: "hsl(0,0%,0%)" },
  { name: "Surface", hex: "#0A0A0A", color: "hsl(0,0%,4%)" },
  { name: "Foreground", hex: "#FFFFFF", color: "hsl(0,0%,100%)" },
];

/* ── Heuristic ring ── */
function Ring({ score, label }: { score: number; label: string }) {
  const { ref, visible } = useReveal(0.3);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / 1200, 1);
      setV(score * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, score]);
  const C = 2 * Math.PI * 32;
  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
          <circle cx="36" cy="36" r="32" fill="none" stroke="hsla(187,100%,50%,0.12)" strokeWidth="4" />
          <circle
            cx="36"
            cy="36"
            r="32"
            fill="none"
            stroke={CYAN}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C - (v / 100) * C}
            style={{ filter: `drop-shadow(0 0 6px ${CYAN})` }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center font-pixel text-[11px]"
          style={{ color: CYAN, textShadow: `0 0 8px ${CYAN}` }}
        >
          {Math.round(v)}
        </div>
      </div>
      <div className="font-body text-[11px] text-center" style={{ color: "hsla(0,0%,100%,0.7)" }}>
        {label}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ErpRedesign() {
  const scrollToCase = () => {
    document.getElementById("case-study")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <ParticlesCanvas />

      {/* Top mini nav */}
      <div className="fixed top-5 left-5 z-50">
        <a
          href="/#projects"
          className="font-pixel text-[10px] tracking-widest inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:gap-3"
          style={{
            color: CYAN,
            background: "hsla(0,0%,4%,0.85)",
            border: `1px solid ${CYAN}`,
            boxShadow: `0 0 18px hsla(187,100%,50%,0.4)`,
            backdropFilter: "blur(10px)",
          }}
        >
          <ArrowLeft size={14} /> BACK TO PROJECTS
        </a>
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 z-10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, hsla(187,100%,50%,0.12), transparent 70%), radial-gradient(ellipse 40% 30% at 80% 70%, hsla(342,100%,59%,0.10), transparent 70%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="font-pixel text-[10px] tracking-[0.3em] mb-5 inline-block px-3 py-1.5 rounded"
              style={{
                color: PINK,
                border: `1px solid ${PINK}`,
                background: "hsla(342,100%,59%,0.08)",
                textShadow: `0 0 8px ${PINK}`,
              }}
            >
              UI / UX CASE STUDY
            </div>
            <h1
              className="font-pixel leading-[1.15] mb-6 animate-glow-pulse"
              style={{
                fontSize: "clamp(28px, 5vw, 56px)",
                color: CYAN,
                textShadow: `0 0 30px ${CYAN}, 0 0 60px hsla(187,100%,50%,0.4)`,
              }}
            >
              ERP PORTAL<br />REDESIGN
            </h1>
            <p
              className="font-body text-base md:text-lg max-w-md mb-8"
              style={{ color: "hsla(0,0%,100%,0.78)" }}
            >
              Transforming an outdated student ERP into a modern, mobile-first, user-friendly experience.
            </p>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 mb-8 max-w-md">
              {[
                { k: "ROLE", v: "UI/UX Designer" },
                { k: "TEAM", v: "Solo Project" },
                { k: "DURATION", v: "6 Weeks" },
                { k: "TOOLS", v: "Figma, Maze" },
              ].map((m) => (
                <div
                  key={m.k}
                  className="rounded-lg px-3 py-2"
                  style={{
                    background: "hsla(0,0%,4%,0.7)",
                    border: "1px solid hsla(187,100%,50%,0.25)",
                  }}
                >
                  <div className="font-pixel text-[8px] tracking-widest mb-1" style={{ color: PINK }}>
                    {m.k}
                  </div>
                  <div className="font-body text-sm" style={{ color: "hsla(0,0%,100%,0.9)" }}>
                    {m.v}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="font-pixel text-[10px] tracking-widest px-5 py-3 rounded-lg inline-flex items-center gap-2 transition-all hover:-translate-y-0.5"
                style={{
                  color: "hsl(0,0%,0%)",
                  background: CYAN,
                  boxShadow: `0 0 24px ${CYAN}, 0 0 50px hsla(187,100%,50%,0.4)`,
                }}
              >
                <Figma size={14} /> VIEW PROTOTYPE
              </a>
              <button
                onClick={scrollToCase}
                className="font-pixel text-[10px] tracking-widest px-5 py-3 rounded-lg inline-flex items-center gap-2 transition-all hover:-translate-y-0.5"
                style={{
                  color: CYAN,
                  background: "hsla(0,0%,4%,0.6)",
                  border: `1px solid ${CYAN}`,
                  boxShadow: `0 0 16px hsla(187,100%,50%,0.3)`,
                }}
              >
                SCROLL TO CASE STUDY <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Floating mockups */}
          <div className="relative h-[500px] hidden md:block">
            <div
              className="absolute top-0 right-12 w-52 rounded-2xl overflow-hidden animate-float"
              style={{
                border: `2px solid ${CYAN}`,
                boxShadow: `0 0 40px hsla(187,100%,50%,0.5), 0 20px 60px hsla(0,0%,0%,0.6)`,
                transform: "perspective(1000px) rotateY(-12deg) rotateX(4deg)",
                animationDelay: "0s",
              }}
            >
              <img src={erpDashboard} alt="dashboard mockup" className="w-full" />
            </div>
            <div
              className="absolute bottom-0 left-0 w-48 rounded-2xl overflow-hidden animate-float"
              style={{
                border: `2px solid ${PINK}`,
                boxShadow: `0 0 40px hsla(342,100%,59%,0.5), 0 20px 60px hsla(0,0%,0%,0.6)`,
                transform: "perspective(1000px) rotateY(10deg) rotateX(-4deg)",
                animationDelay: "1.5s",
              }}
            >
              <img src={erpAttendance} alt="attendance mockup" className="w-full" />
            </div>
            <div
              className="absolute top-20 left-24 w-44 rounded-2xl overflow-hidden animate-float"
              style={{
                border: `1.5px solid hsla(187,100%,50%,0.7)`,
                boxShadow: `0 0 30px hsla(187,100%,50%,0.4)`,
                transform: "perspective(1000px) rotateY(-4deg)",
                animationDelay: "0.7s",
              }}
            >
              <img src={erpGradecard} alt="grade card mockup" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW STATS */}
      <section id="case-study" className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeading kicker="01 — PROJECT OVERVIEW" title="THE NUMBERS DON'T LIE" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.map((s) => (
              <GlowCard key={s.label} className="text-center">
                <div
                  className="font-pixel mb-3"
                  style={{
                    fontSize: "clamp(22px, 3vw, 34px)",
                    color: CYAN,
                    textShadow: `0 0 18px ${CYAN}`,
                  }}
                >
                  <Counter to={s.v} />
                </div>
                <div className="font-body text-xs" style={{ color: "hsla(0,0%,100%,0.7)" }}>
                  {s.label}
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* UX RESEARCH */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeading kicker="02 — UX RESEARCH" title="LISTENING TO STUDENTS" />
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <GlowCard>
              <h3 className="font-pixel text-[12px] mb-4 tracking-wider" style={{ color: PINK, textShadow: `0 0 10px ${PINK}` }}>
                ▸ RESEARCH METHOD
              </h3>
              <ul className="space-y-2 font-body text-sm" style={{ color: "hsla(0,0%,100%,0.78)" }}>
                <li>• Survey conducted with 120+ students across years</li>
                <li>• 1-on-1 contextual interviews with 15 users</li>
                <li>• Heuristic evaluation against Nielsen's 10 principles</li>
                <li>• Usability testing on existing portal flows</li>
                <li>• Competitive analysis of modern student portals</li>
              </ul>
            </GlowCard>
            <GlowCard accent="pink">
              <h3 className="font-pixel text-[12px] mb-4 tracking-wider" style={{ color: CYAN, textShadow: `0 0 10px ${CYAN}` }}>
                ▸ KEY INSIGHTS
              </h3>
              <ul className="space-y-2 font-body text-sm" style={{ color: "hsla(0,0%,100%,0.78)" }}>
                <li>• 79.5% of students wanted a dark mode option</li>
                <li>• Mobile usage outpaced desktop by 3:1</li>
                <li>• Navigation depth caused most task failures</li>
                <li>• Grade & attendance flows were top pain points</li>
                <li>• Students wanted at-a-glance academic overviews</li>
              </ul>
            </GlowCard>
          </div>

          <h3
            className="font-pixel text-[12px] tracking-widest text-center mb-6"
            style={{ color: PINK, textShadow: `0 0 10px ${PINK}` }}
          >
            ▸ PAIN POINTS IDENTIFIED
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {painPoints.map((p) => (
              <div
                key={p}
                className="rounded-lg p-4 text-center transition-all hover:-translate-y-1"
                style={{
                  background: "hsla(342,100%,59%,0.05)",
                  border: "1px solid hsla(342,100%,59%,0.3)",
                  boxShadow: "0 0 16px hsla(342,100%,59%,0.1)",
                }}
              >
                <div className="font-body text-sm" style={{ color: "hsla(0,0%,100%,0.85)" }}>
                  {p}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USER STORIES */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeading kicker="03 — USER STORIES" title="REAL STUDENTS, REAL STRUGGLES" />
          <div className="grid md:grid-cols-2 gap-6">
            {stories.map((s, i) => (
              <GlowCard key={s.name} accent={i % 2 === 0 ? "cyan" : "pink"}>
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
                    style={{
                      background: "hsla(187,100%,50%,0.1)",
                      border: `2px solid ${i % 2 === 0 ? CYAN : PINK}`,
                      boxShadow: `0 0 20px ${i % 2 === 0 ? CYAN : PINK}80`,
                    }}
                  >
                    {s.avatar}
                  </div>
                  <div>
                    <h4 className="font-pixel text-[12px] mb-1" style={{ color: CYAN, textShadow: `0 0 8px ${CYAN}` }}>
                      {s.name}
                    </h4>
                    <p className="font-body text-xs" style={{ color: "hsla(0,0%,100%,0.6)" }}>
                      {s.role}
                    </p>
                  </div>
                </div>
                <p className="font-body text-sm mb-4 leading-relaxed" style={{ color: "hsla(0,0%,100%,0.78)" }}>
                  {s.story}
                </p>
                <div className="space-y-2">
                  <div className="rounded p-2.5" style={{ background: "hsla(342,100%,59%,0.08)", border: "1px solid hsla(342,100%,59%,0.3)" }}>
                    <span className="font-pixel text-[8px] tracking-widest mr-2" style={{ color: PINK }}>PAIN POINT:</span>
                    <span className="font-body text-xs" style={{ color: "hsla(0,0%,100%,0.85)" }}>{s.pain}</span>
                  </div>
                  <div className="rounded p-2.5" style={{ background: "hsla(187,100%,50%,0.08)", border: "1px solid hsla(187,100%,50%,0.3)" }}>
                    <span className="font-pixel text-[8px] tracking-widest mr-2" style={{ color: CYAN }}>IMPROVEMENT:</span>
                    <span className="font-body text-xs" style={{ color: "hsla(0,0%,100%,0.85)" }}>{s.fix}</span>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* HEURISTIC EVALUATION */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeading kicker="04 — HEURISTIC EVALUATION" title="NIELSEN'S 10 PRINCIPLES" />
          <GlowCard className="!p-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {heuristics.map((h) => (
                <Ring key={h.name} score={h.score} label={h.name} />
              ))}
            </div>
            <div
              className="mt-8 pt-6 text-center font-body text-sm"
              style={{ borderTop: "1px solid hsla(187,100%,50%,0.2)", color: "hsla(0,0%,100%,0.7)" }}
            >
              Average baseline score:{" "}
              <span className="font-pixel text-[12px]" style={{ color: CYAN, textShadow: `0 0 8px ${CYAN}` }}>
                53.4 / 100
              </span>{" "}
              — major opportunity for redesign.
            </div>
          </GlowCard>
        </div>
      </section>

      {/* USER FLOW */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-5xl mx-auto">
          <SectionHeading kicker="05 — USER FLOW" title="THE NEW JOURNEY" />
          <div className="relative">
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 md:block hidden"
              style={{
                background: `linear-gradient(180deg, transparent, ${CYAN}, transparent)`,
                boxShadow: `0 0 10px ${CYAN}`,
              }}
            />
            <div className="space-y-6">
              {userFlow.map((step, i) => {
                const left = i % 2 === 0;
                return (
                  <div key={step} className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:items-center gap-4">
                    {left ? (
                      <>
                        <GlowCard className="md:!p-4">
                          <div className="font-pixel text-[10px] mb-1" style={{ color: PINK }}>STEP {String(i + 1).padStart(2, "0")}</div>
                          <div className="font-body text-sm" style={{ color: "hsla(0,0%,100%,0.9)" }}>{step}</div>
                        </GlowCard>
                        <div className="hidden md:flex w-4 h-4 rounded-full mx-auto" style={{ background: CYAN, boxShadow: `0 0 16px ${CYAN}` }} />
                        <div />
                      </>
                    ) : (
                      <>
                        <div />
                        <div className="hidden md:flex w-4 h-4 rounded-full mx-auto" style={{ background: CYAN, boxShadow: `0 0 16px ${CYAN}` }} />
                        <GlowCard className="md:!p-4">
                          <div className="font-pixel text-[10px] mb-1" style={{ color: PINK }}>STEP {String(i + 1).padStart(2, "0")}</div>
                          <div className="font-body text-sm" style={{ color: "hsla(0,0%,100%,0.9)" }}>{step}</div>
                        </GlowCard>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER SHOWCASE */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeading kicker="06 — BEFORE vs AFTER" title="THE TRANSFORMATION" />
          <div className="space-y-24">
            {showcases.map((s) => (
              <ShowcaseRow key={s.num} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeading kicker="07 — FEATURES ADDED" title="WHAT'S NEW" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {features.map((f, i) => (
              <div
                key={f}
                className="rounded-lg p-4 text-center transition-all hover:-translate-y-1 hover:scale-105"
                style={{
                  background: "hsla(0,0%,4%,0.7)",
                  border: `1px solid ${i % 2 === 0 ? "hsla(187,100%,50%,0.4)" : "hsla(342,100%,59%,0.4)"}`,
                  boxShadow: `0 0 20px ${i % 2 === 0 ? "hsla(187,100%,50%,0.15)" : "hsla(342,100%,59%,0.15)"}`,
                }}
              >
                <div
                  className="font-pixel text-[9px] tracking-wider"
                  style={{
                    color: i % 2 === 0 ? CYAN : PINK,
                    textShadow: `0 0 8px ${i % 2 === 0 ? CYAN : PINK}`,
                  }}
                >
                  {f}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESIGN SYSTEM */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeading kicker="08 — DESIGN SYSTEM" title="THE NEON LANGUAGE" />
          <div className="grid md:grid-cols-2 gap-6">
            <GlowCard>
              <h4 className="font-pixel text-[11px] mb-4" style={{ color: CYAN }}>▸ COLOR PALETTE</h4>
              <div className="space-y-3">
                {palette.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded"
                      style={{
                        background: c.color,
                        border: "1px solid hsla(255,255,255,0.15)",
                        boxShadow: c.name.includes("Cyan") || c.name.includes("Pink") ? `0 0 16px ${c.color}` : "none",
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-pixel text-[10px]" style={{ color: "hsla(0,0%,100%,0.9)" }}>{c.name}</div>
                      <div className="font-body text-xs" style={{ color: "hsla(0,0%,100%,0.5)" }}>{c.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlowCard>
            <GlowCard accent="pink">
              <h4 className="font-pixel text-[11px] mb-4" style={{ color: PINK }}>▸ TYPOGRAPHY</h4>
              <div className="space-y-4">
                <div>
                  <div className="font-pixel text-[8px] mb-1 tracking-widest" style={{ color: "hsla(0,0%,100%,0.5)" }}>HEADINGS — Press Start 2P</div>
                  <div className="font-pixel text-base" style={{ color: CYAN, textShadow: `0 0 10px ${CYAN}` }}>HEADING SAMPLE</div>
                </div>
                <div>
                  <div className="font-pixel text-[8px] mb-1 tracking-widest" style={{ color: "hsla(0,0%,100%,0.5)" }}>BODY — Quicksand</div>
                  <div className="font-body text-sm" style={{ color: "hsla(0,0%,100%,0.85)" }}>
                    The quick brown fox jumps over the lazy dog. Clean, geometric, and highly legible across screens.
                  </div>
                </div>
              </div>
              <h4 className="font-pixel text-[11px] mt-6 mb-3" style={{ color: PINK }}>▸ BUTTONS</h4>
              <div className="flex flex-wrap gap-2">
                <span className="font-pixel text-[9px] px-4 py-2 rounded-lg" style={{ background: CYAN, color: "hsl(0,0%,0%)", boxShadow: `0 0 16px ${CYAN}` }}>PRIMARY</span>
                <span className="font-pixel text-[9px] px-4 py-2 rounded-lg" style={{ color: CYAN, border: `1px solid ${CYAN}` }}>OUTLINE</span>
                <span className="font-pixel text-[9px] px-4 py-2 rounded-lg" style={{ color: PINK, border: `1px solid ${PINK}`, boxShadow: `0 0 12px ${PINK}40` }}>ACCENT</span>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="relative py-24 px-4 z-10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsla(187,100%,50%,0.12), transparent 70%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center">
          <SectionHeading kicker="09 — IMPACT" title="THE OUTCOME" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { v: 92, l: "Usability Score" },
              { v: 87, l: "Task Success Rate" },
              { v: 74, l: "Faster Navigation" },
              { v: 96, l: "Mobile Satisfaction" },
            ].map((m) => (
              <div key={m.l}>
                <div
                  className="font-pixel mb-2"
                  style={{
                    fontSize: "clamp(28px, 4vw, 44px)",
                    color: CYAN,
                    textShadow: `0 0 22px ${CYAN}, 0 0 44px hsla(187,100%,50%,0.3)`,
                  }}
                >
                  <Counter to={m.v} />
                </div>
                <div className="font-body text-xs tracking-wider" style={{ color: "hsla(0,0%,100%,0.7)" }}>
                  {m.l}
                </div>
              </div>
            ))}
          </div>
          <div
            className="h-px mx-auto max-w-xl mb-8"
            style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`, boxShadow: `0 0 12px ${CYAN}` }}
          />
          <p
            className="font-body text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: "hsla(0,0%,100%,0.8)" }}
          >
            The redesigned ERP portal delivered better usability, cleaner navigation, improved accessibility, and a fully responsive student experience — modernizing the entire academic workflow system.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h3
            className="font-pixel mb-8 tracking-widest"
            style={{
              fontSize: "clamp(18px, 2.6vw, 28px)",
              color: PINK,
              textShadow: `0 0 22px ${PINK}, 0 0 44px hsla(342,100%,59%,0.3)`,
            }}
          >
            LIKE WHAT YOU SEE?
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-pixel text-[10px] tracking-widest px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-all hover:-translate-y-0.5"
              style={{
                color: "hsl(0,0%,0%)",
                background: CYAN,
                boxShadow: `0 0 24px ${CYAN}, 0 0 50px hsla(187,100%,50%,0.4)`,
              }}
            >
              <Figma size={14} /> VIEW FIGMA PROTOTYPE <ExternalLink size={12} />
            </a>
            <a
              href="/#projects"
              className="font-pixel text-[10px] tracking-widest px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-all hover:-translate-y-0.5"
              style={{
                color: PINK,
                background: "hsla(0,0%,4%,0.6)",
                border: `1px solid ${PINK}`,
                boxShadow: `0 0 18px hsla(342,100%,59%,0.3)`,
              }}
            >
              <ArrowLeft size={14} /> BACK TO PROJECTS
            </a>
          </div>
        </div>
      </section>

      <div className="h-12" />
    </div>
  );
}
