import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import moviesHero from "@/assets/movies-hero.png";
import moviesSidebar from "@/assets/movies-sidebar.png";
import moviesDetails from "@/assets/movies-details.png";
import moviesCast from "@/assets/movies-cast.png";
import personaAarav from "@/assets/persona-aarav.png";
import personaRiya from "@/assets/persona-riya.png";

/* ── Floating particles canvas ── */
function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; speed: number; opacity: number; drift: number; hue: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        speed: Math.random() * 0.25 + 0.08,
        opacity: Math.random() * 0.4 + 0.08,
        drift: (Math.random() - 0.5) * 0.25,
        hue: Math.random() > 0.5 ? 187 : 175,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.opacity})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, ${p.opacity * 0.5})`;
        ctx.shadowBlur = p.r * 3;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.55 }}
    />
  );
}

/* ── Heartbeat background ── */
function HeartbeatBackground() {
  return (
    <svg
      className="absolute inset-x-0 pointer-events-none"
      style={{ top: "30%", width: "100%", height: "180px", opacity: 0.08 }}
      viewBox="0 0 1200 180"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="mt-hbGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="hsla(187,100%,50%,0)" />
          <stop offset="50%" stopColor="hsla(187,100%,55%,1)" />
          <stop offset="100%" stopColor="hsla(175,100%,50%,0)" />
        </linearGradient>
      </defs>
      <path
        d="M0,90 L200,90 L240,90 L260,40 L280,140 L300,60 L320,90 L500,90 L540,90 L560,30 L580,150 L600,70 L620,90 L900,90 L940,90 L960,50 L980,130 L1000,90 L1200,90"
        fill="none"
        stroke="url(#mt-hbGrad)"
        strokeWidth="1.5"
        style={{
          filter: "drop-shadow(0 0 6px hsla(187,100%,50%,0.6))",
          strokeDasharray: 2400,
          strokeDashoffset: 2400,
          animation: "mtHbDraw 12s linear infinite",
        }}
      />
      <style>{`
        @keyframes mtHbDraw {
          0% { stroke-dashoffset: 2400; }
          60% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -2400; }
        }
      `}</style>
    </svg>
  );
}

/* ── Cursor trail ── */
function useCursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

/* ── Scroll reveal ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function GlowDivider() {
  return (
    <div className="relative my-20 h-[60px] w-full overflow-hidden pointer-events-none select-none">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-full" style={{ opacity: 0.55 }}>
        <path
          d="M0,30 L300,30 L320,30 L340,10 L360,50 L380,20 L400,30 L700,30 L720,30 L740,8 L760,52 L780,18 L800,30 L1200,30"
          fill="none"
          stroke="hsla(187,100%,60%,0.55)"
          strokeWidth="1.5"
          style={{
            filter: "drop-shadow(0 0 6px hsla(187,100%,55%,0.45))",
            strokeDasharray: 2400,
            strokeDashoffset: 2400,
            animation: "mtHbDivDraw 6s linear infinite",
          }}
        />
        <style>{`
          @keyframes mtHbDivDraw {
            0% { stroke-dashoffset: 2400; }
            55% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -2400; }
          }
        `}</style>
      </svg>
    </div>
  );
}

function SideStockLine({ side = "right" }: { side?: "left" | "right" }) {
  return (
    <div
      className="hidden md:block absolute top-1/2 -translate-y-1/2 pointer-events-none select-none"
      style={{
        [side]: "0",
        width: "38%",
        height: "180px",
        opacity: 0.08,
      } as React.CSSProperties}
    >
      <svg viewBox="0 0 400 180" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id={`mt-side-${side}`} x1="0" x2="1">
            <stop offset="0%" stopColor="hsla(187,100%,55%,0)" />
            <stop offset="50%" stopColor="hsla(187,100%,55%,1)" />
            <stop offset="100%" stopColor="hsla(175,100%,55%,0)" />
          </linearGradient>
        </defs>
        {[0, 45, 90, 135, 180].map((y) => (
          <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="hsla(187,100%,50%,0.18)" strokeWidth="0.5" />
        ))}
        <path
          d="M0,120 L40,110 L70,118 L100,80 L130,95 L160,60 L190,75 L220,40 L250,55 L280,30 L310,48 L340,25 L370,42 L400,18"
          fill="none"
          stroke={`url(#mt-side-${side})`}
          strokeWidth="1.5"
          style={{ filter: "drop-shadow(0 0 6px hsla(187,100%,50%,0.5))" }}
        />
      </svg>
    </div>
  );
}

function SectionHeading({ children, kicker }: { children: React.ReactNode; kicker?: string }) {
  return (
    <div className="mb-8">
      {kicker && (
        <div className="font-pixel text-[10px] tracking-[0.3em] mb-3" style={{ color: "hsla(175,100%,55%,0.7)" }}>
          {kicker}
        </div>
      )}
      <h3
        className="font-pixel text-2xl tracking-wider"
        style={{
          color: "hsl(187,100%,55%)",
          textShadow: "0 0 18px hsla(187,100%,50%,0.45), 0 0 36px hsla(187,100%,50%,0.18)",
        }}
      >
        {children}
      </h3>
    </div>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[15px] leading-[1.95] max-w-[640px]" style={{ color: "hsla(0,0%,100%,0.72)" }}>
      {children}
    </p>
  );
}

/* ── Showcase screenshot card ── */
function ShowcaseCard({
  src, title, purpose, decision, benefit, index, cursorX, cursorY,
}: {
  src: string;
  title: string;
  purpose: string;
  decision: string;
  benefit: string;
  index: number;
  cursorX: number;
  cursorY: number;
}) {
  const { ref, visible } = useReveal(0.1);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  const imageRight = index % 2 === 0;

  const floatKeyframes = `@keyframes mt-float-${index} {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-${4 + (index % 3) * 2}px); }
  }`;

  const [magneticGlow, setMagneticGlow] = useState(0);
  useEffect(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((cursorX - cx) ** 2 + (cursorY - cy) ** 2);
    const intensity = Math.max(0, 1 - dist / 450);
    setMagneticGlow(intensity);
  }, [cursorX, cursorY]);

  const tiltY = isEven ? -5 : 5;

  return (
    <>
      <style>{floatKeyframes}</style>
      <div
        ref={(el) => {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex flex-col ${imageRight ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-12`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : `translateY(40px) translateX(${imageRight ? "30px" : "-30px"})`,
          transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${0.08 * index}s`,
          position: "relative",
        }}
      >
        <div
          className="w-full md:w-[65%] flex-shrink-0 relative"
          style={{
            perspective: "1200px",
            animation: `mt-float-${index} ${5 + index * 0.3}s ease-in-out infinite`,
          }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              width: "110%", height: "110%", top: "-5%", left: "-5%",
              background: `radial-gradient(ellipse at center, hsla(187,100%,50%,${0.06 + magneticGlow * 0.07}) 0%, transparent 65%)`,
              filter: "blur(28px)",
              transition: "all 0.4s ease",
              zIndex: 0,
            }}
          />
          <div
            className="rounded-xl overflow-hidden transition-all duration-500 relative"
            style={{
              transform: hovered
                ? "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1.04)"
                : `perspective(1200px) rotateX(2deg) rotateY(${tiltY}deg) scale(1)`,
              transformOrigin: "center center",
              boxShadow: hovered
                ? "0 30px 80px hsla(187,100%,50%,0.18), 0 0 40px hsla(187,100%,50%,0.12)"
                : `0 20px 60px hsla(187,100%,50%,0.12), 0 10px 30px hsla(0,0%,0%,0.55)`,
              border: `1px solid hsla(187,100%,55%,${hovered ? 0.4 : 0.15 + magneticGlow * 0.1})`,
            }}
          >
            <img src={src} alt={title} className="w-full block" loading="lazy" />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center" style={{ maxWidth: "550px" }}>
          <div className="font-pixel text-[10px] tracking-[0.25em] mb-2" style={{ color: "hsla(175,100%,55%,0.65)" }}>
            0{index + 1}
          </div>
          <h4
            className="font-pixel tracking-wider mb-4"
            style={{
              color: "hsl(187,100%,60%)",
              textShadow: "0 0 12px hsla(187,100%,50%,0.35)",
              fontSize: "13px",
            }}
          >
            {title}
          </h4>
          <div className="space-y-3">
            {[
              { label: "Purpose", text: purpose },
              { label: "Design Decision", text: decision },
              { label: "User Benefit", text: benefit },
            ].map((item) => (
              <div key={item.label}>
                <div
                  className="font-pixel text-[9px] tracking-[0.2em] mb-1"
                  style={{ color: "hsla(342,100%,70%,0.75)" }}
                >
                  {item.label}
                </div>
                <p className="font-body text-sm leading-[1.7]" style={{ color: "hsla(0,0%,100%,0.78)" }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Counter animation ── */
function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const { ref, visible } = useReveal(0.3);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(start + (end - start) * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, end]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Main page ── */
export default function MoviesTime() {
  const [entered, setEntered] = useState(false);
  const cursor = useCursorGlow();

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => setEntered(true));
  }, []);

  const projectInfo = [
    { label: "Duration", value: "3 Weeks" },
    { label: "Role", value: "Designer + Developer" },
    { label: "Team", value: "Solo Project" },
    { label: "Tools", value: "React, TMDB, CSS" },
  ];

  const features = [
    { title: "Trending Movies", desc: "Surfaces the most popular titles in real time" },
    { title: "Search Functionality", desc: "Quickly find movies by title or keyword" },
    { title: "Genre Filtering", desc: "Browse by category for focused discovery" },
    { title: "Detailed Movie Information", desc: "Ratings, runtime, budget, revenue and more" },
    { title: "Cast Information", desc: "Explore actors and their characters" },
    { title: "Similar Movie Recommendations", desc: "Discover related titles you'll love" },
    { title: "Responsive Design", desc: "Optimized for desktop, tablet, and mobile" },
    { title: "Dark Mode Interface", desc: "Cinematic dark theme reduces eye strain" },
  ];

  const process = [
    "Research",
    "Wireframing",
    "Visual Exploration",
    "UI Design",
    "Development",
  ];

  const techStack = ["React", "TMDB API", "JavaScript", "CSS", "Responsive Design"];

  const screenshots = [
    {
      src: moviesHero,
      title: "Home Page",
      purpose: "Welcomes users with a cinematic hero carousel of trending movies.",
      decision: "A full-bleed hero with bold typography sets an entertainment-first tone.",
      benefit: "Users instantly see what's popular without scrolling or searching.",
    },
    {
      src: moviesSidebar,
      title: "Navigation Menu",
      purpose: "Provides quick access to genres, upcoming releases, and account.",
      decision: "Slide-in sidebar keeps the interface clean while staying one tap away.",
      benefit: "Reduces cognitive load and keeps focus on content.",
    },
    {
      src: moviesDetails,
      title: "Movie Details Page",
      purpose: "Shows comprehensive information for a selected title.",
      decision: "Poster on the left, metadata stacked on the right for scan-friendly hierarchy.",
      benefit: "Users can evaluate a movie in seconds before committing to watch.",
    },
    {
      src: moviesCast,
      title: "Cast & Similar Movies",
      purpose: "Encourages further discovery through actors and related titles.",
      decision: "Horizontal card rows mirror familiar streaming patterns.",
      benefit: "Keeps users engaged with a continuous exploration loop.",
    },
  ];

  const outcomes = [
    "Improved movie discovery experience",
    "Faster access to movie information",
    "Better content organization",
    "Clean responsive interface",
    "Enhanced user engagement",
    "Modern entertainment-focused design",
  ];

  const learnings = [
    "Importance of information hierarchy in content-heavy interfaces",
    "Designing scalable layouts for recommendation systems",
    "Balancing cinematic aesthetics with everyday usability",
    "Integrating third-party APIs (TMDB) with a responsive React UI",
  ];

  const personas = [
    {
      name: "Aarav Patel",
      role: "Movie Enthusiast",
      avatar: personaAarav,
      goals: ["Discover new movies", "Track trending releases", "Explore cast details"],
      frustrations: ["Too much clutter", "Difficult navigation", "Poor recommendations"],
      needs: ["Fast browsing", "Personalized discovery", "Clean interface"],
      quote: "I want to discover great movies without spending more time searching than watching.",
    },
    {
      name: "Riya Shah",
      role: "Casual Viewer",
      avatar: personaRiya,
      goals: ["Find movies for weekends", "Read summaries quickly", "View ratings easily"],
      frustrations: ["Information overload", "Slow search experience"],
      needs: ["Simple navigation", "Better organization", "Easy recommendations"],
      quote: "I should be able to find something worth watching in just a few minutes.",
    },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(220,20%,3%) 0%, hsl(210,18%,6%) 20%, hsl(200,15%,5%) 40%, hsl(195,18%,6%) 60%, hsl(210,18%,4%) 80%, hsl(220,20%,3%) 100%)",
        opacity: entered ? 1 : 0,
        transition: "opacity 0.6s ease-out",
      }}
    >
      <ParticlesCanvas />

      {/* Cursor glow */}
      <div
        className="fixed pointer-events-none z-[2]"
        style={{
          left: cursor.x - 220,
          top: cursor.y - 220,
          width: 440,
          height: 440,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(187,100%,55%,0.10) 0%, hsla(175,100%,50%,0.04) 35%, transparent 65%)",
          filter: "blur(28px)",
          transition: "left 0.14s ease-out, top 0.14s ease-out",
        }}
      />

      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute" style={{ top: "8%", left: "50%", transform: "translateX(-50%)", width: "90%", height: "500px", background: "radial-gradient(ellipse, hsla(187,100%,50%,0.07) 0%, transparent 65%)" }} />
        <div className="absolute" style={{ top: "30%", left: "8%", width: "560px", height: "560px", background: "radial-gradient(circle, hsla(342,100%,59%,0.04) 0%, transparent 55%)" }} />
        <div className="absolute" style={{ top: "55%", right: "5%", width: "680px", height: "500px", background: "radial-gradient(ellipse, hsla(187,100%,50%,0.06) 0%, transparent 60%)" }} />
        <div className="absolute" style={{ top: "78%", left: "30%", width: "500px", height: "400px", background: "radial-gradient(circle, hsla(175,100%,50%,0.04) 0%, transparent 60%)" }} />
        <HeartbeatBackground />
      </div>

      {/* Back button */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 pt-8">
        <a
          href="/#projects"
          className="font-pixel text-[11px] tracking-wider inline-flex items-center gap-2 transition-all duration-300 hover:gap-3"
          style={{
            color: "hsl(187,100%,55%)",
            textShadow: "0 0 10px hsla(187,100%,50%,0.35)",
          }}
        >
          <ArrowLeft size={14} /> Back to Projects
        </a>
      </div>

      {/* Hero */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-10">
        <div className="text-center mb-12">
          <div
            className="font-pixel text-[10px] tracking-[0.3em] mb-4"
            style={{ color: "hsla(342,100%,70%,0.75)" }}
          >
            WEB DEVELOPMENT — CASE STUDY
          </div>
          <h1
            className="font-pixel tracking-wider mb-5"
            style={{
              fontSize: "clamp(36px, 7vw, 64px)",
              color: "hsl(0,0%,100%)",
              textShadow: "0 0 40px hsla(187,100%,55%,0.55), 0 0 80px hsla(187,100%,50%,0.2), 0 2px 10px hsla(0,0%,0%,0.9)",
            }}
          >
            Movie Time
          </h1>
          <p
            className="font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "hsla(0,0%,100%,0.72)" }}
          >
            A movie discovery and recommendation platform that helps users explore trending movies, view detailed information, discover cast members, and browse content through an intuitive entertainment-focused experience.
          </p>
        </div>

        {/* Project info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {projectInfo.map((info) => (
            <div
              key={info.label}
              className="rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, hsla(187,100%,50%,0.05) 0%, hsla(175,100%,50%,0.02) 100%)",
                border: "1px solid hsla(187,100%,55%,0.18)",
                boxShadow: "inset 0 0 20px hsla(187,100%,50%,0.03)",
              }}
            >
              <div
                className="font-pixel text-[9px] tracking-[0.25em] mb-2"
                style={{ color: "hsla(175,100%,55%,0.7)" }}
              >
                {info.label}
              </div>
              <div className="font-body text-sm font-semibold" style={{ color: "hsla(0,0%,100%,0.92)" }}>
                {info.value}
              </div>
            </div>
          ))}
        </div>

        {/* Hero mockup — two floating screenshots */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <style>{`
            @keyframes mtFloatA { 0%,100%{transform:translateY(0) rotate(-2deg);} 50%{transform:translateY(-10px) rotate(-2deg);} }
            @keyframes mtFloatB { 0%,100%{transform:translateY(0) rotate(2deg);} 50%{transform:translateY(-12px) rotate(2deg);} }
          `}</style>
          <div
            className="rounded-xl overflow-hidden"
            style={{
              animation: "mtFloatA 6s ease-in-out infinite",
              boxShadow: "0 30px 80px hsla(187,100%,50%,0.15), 0 0 40px hsla(187,100%,50%,0.1)",
              border: "1px solid hsla(187,100%,55%,0.2)",
            }}
          >
            <img src={moviesHero} alt="Movie Time Home Page" className="w-full block" />
          </div>
          <div
            className="rounded-xl overflow-hidden md:mt-10"
            style={{
              animation: "mtFloatB 6.5s ease-in-out infinite",
              boxShadow: "0 30px 80px hsla(342,100%,59%,0.15), 0 0 40px hsla(342,100%,59%,0.08)",
              border: "1px solid hsla(342,100%,70%,0.2)",
            }}
          >
            <img src={moviesDetails} alt="Movie Time Details Page" className="w-full block" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-14">
        {/* PROBLEM */}
        <Section delay={0.05}>
          <div className="relative">
            <SideStockLine side="right" />
            <SectionHeading kicker="01 — PROBLEM">Problem Statement</SectionHeading>
            <BodyText>
              Movie discovery platforms often overwhelm users with large amounts of content, making it difficult
              to quickly find relevant movies, understand ratings, and access important information such as cast
              members, genres, and recommendations.
            </BodyText>
            <div className="h-3" />
            <BodyText>
              The goal was to create a visually engaging movie browsing experience that simplifies content
              discovery and improves user engagement while maintaining a cinematic feel.
            </BodyText>
          </div>
        </Section>

        <GlowDivider />

        {/* FEATURES */}
        <Section delay={0.05}>
          <SectionHeading kicker="02 — FEATURES">Feature Highlights</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, hsla(187,100%,50%,0.04) 0%, hsla(0,0%,4%,0.5) 100%)",
                  border: "1px solid hsla(187,100%,55%,0.15)",
                  boxShadow: "inset 0 0 20px hsla(187,100%,50%,0.02)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "hsla(187,100%,55%,0.45)";
                  e.currentTarget.style.boxShadow = "0 10px 30px hsla(187,100%,50%,0.12), inset 0 0 20px hsla(187,100%,50%,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "hsla(187,100%,55%,0.15)";
                  e.currentTarget.style.boxShadow = "inset 0 0 20px hsla(187,100%,50%,0.02)";
                }}
              >
                <div className="font-pixel text-[10px] tracking-[0.2em] mb-2" style={{ color: "hsla(175,100%,55%,0.65)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="font-body text-sm font-semibold mb-1.5" style={{ color: "hsla(0,0%,100%,0.95)" }}>
                  {f.title}
                </h4>
                <p className="font-body text-sm leading-relaxed" style={{ color: "hsla(0,0%,100%,0.6)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <GlowDivider />

        {/* USERS / PERSONAS */}
        <Section delay={0.05}>
          <SectionHeading kicker="03 — USERS">User Personas</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map((p) => (
              <div
                key={p.name}
                className="rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, hsla(187,100%,50%,0.04) 0%, hsla(0,0%,4%,0.55) 100%)",
                  border: "1px solid hsla(187,100%,55%,0.18)",
                  boxShadow: "0 10px 30px hsla(0,0%,0%,0.4), inset 0 0 20px hsla(187,100%,50%,0.03)",
                }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                    style={{
                      border: "1px solid hsla(187,100%,55%,0.35)",
                      boxShadow: "0 0 18px hsla(187,100%,50%,0.25)",
                    }}
                  >
                    <img src={p.avatar} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-pixel text-xs mb-1" style={{ color: "hsl(187,100%,60%)", textShadow: "0 0 10px hsla(187,100%,50%,0.4)" }}>
                      {p.name}
                    </h4>
                    <div className="font-body text-xs" style={{ color: "hsla(342,100%,70%,0.85)" }}>
                      {p.role}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Goals", items: p.goals },
                    { label: "Frustrations", items: p.frustrations },
                    { label: "Needs", items: p.needs },
                  ].map((group) => (
                    <div key={group.label}>
                      <div className="font-pixel text-[9px] tracking-[0.2em] mb-1.5" style={{ color: "hsla(175,100%,55%,0.7)" }}>
                        {group.label}
                      </div>
                      <ul className="space-y-1">
                        {group.items.map((it) => (
                          <li key={it} className="font-body text-sm flex items-start gap-2" style={{ color: "hsla(0,0%,100%,0.75)" }}>
                            <span style={{ color: "hsl(187,100%,55%)", flexShrink: 0 }}>▹</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <blockquote
                  className="mt-5 pt-4 font-body text-sm italic leading-relaxed"
                  style={{
                    color: "hsla(187,100%,80%,0.9)",
                    borderTop: "1px solid hsla(187,100%,55%,0.15)",
                  }}
                >
                  "{p.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </Section>

        <GlowDivider />

        {/* PROCESS */}
        <Section delay={0.05}>
          <SectionHeading kicker="04 — PROCESS">Design Process</SectionHeading>
          <BodyText>
            From initial research to final implementation, each phase was carefully shaped around the user's
            need to discover content quickly without feeling overwhelmed.
          </BodyText>
          <div className="flex flex-wrap gap-3 items-center mt-8">
            {process.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="font-body text-xs px-4 py-2 rounded-lg"
                  style={{
                    color: "hsla(0,0%,100%,0.85)",
                    background: "hsla(187,100%,50%,0.04)",
                    border: "1px solid hsla(187,100%,55%,0.15)",
                  }}
                >
                  {step}
                </span>
                {i < process.length - 1 && (
                  <span style={{ color: "hsla(175,100%,55%,0.45)" }} className="font-pixel text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </Section>

        <GlowDivider />

        {/* KEY SCREENS */}
        <Section delay={0.05}>
          <SectionHeading kicker="05 — KEY SCREENS">Key Screens</SectionHeading>
        </Section>

        <div className="mt-10 space-y-20">
          {screenshots.map((s, i) => (
            <ShowcaseCard
              key={i}
              src={s.src}
              title={s.title}
              purpose={s.purpose}
              decision={s.decision}
              benefit={s.benefit}
              index={i}
              cursorX={cursor.x}
              cursorY={cursor.y}
            />
          ))}
        </div>

        <GlowDivider />

        {/* TECH STACK */}
        <Section delay={0.05}>
          <SectionHeading kicker="06 — IMPLEMENTATION">Technical Implementation</SectionHeading>
          <div
            className="rounded-xl p-7"
            style={{
              background: "linear-gradient(135deg, hsla(187,100%,50%,0.03) 0%, hsla(175,100%,50%,0.02) 100%)",
              border: "1px solid hsla(187,100%,50%,0.12)",
              boxShadow: "inset 0 0 30px hsla(187,100%,50%,0.03)",
            }}
          >
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-body text-xs font-semibold px-4 py-2 rounded-full cursor-default transition-all duration-300 hover:scale-105"
                  style={{
                    color: "hsl(187,100%,65%)",
                    border: "1px solid hsla(187,100%,55%,0.25)",
                    background: "hsla(187,100%,50%,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "hsla(187,100%,55%,0.5)";
                    e.currentTarget.style.background = "hsla(187,100%,50%,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "hsla(187,100%,55%,0.25)";
                    e.currentTarget.style.background = "hsla(187,100%,50%,0.05)";
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Section>

        <GlowDivider />

        {/* OUTCOMES & LEARNINGS */}
        <Section delay={0.05}>
          <div className="mb-10 text-center">
            <div className="font-pixel text-[10px] tracking-[0.3em] mb-3" style={{ color: "hsla(175,100%,55%,0.6)" }}>
              07 — OUTCOMES
            </div>
            <h3 className="font-pixel text-2xl tracking-wider" style={{ color: "hsla(0,0%,100%,0.95)" }}>
              Outcomes &amp; Learnings
            </h3>
          </div>

          <div
            className="rounded-2xl py-10 px-8 mb-10"
            style={{
              background: "linear-gradient(135deg, hsla(220,20%,5%,0.5) 0%, hsla(195,15%,8%,0.4) 100%)",
              border: "1px solid hsla(187,100%,50%,0.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {outcomes.map((o, i) => (
                <div
                  key={i}
                  className="rounded-lg p-4 transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "hsla(187,100%,50%,0.04)",
                    border: "1px solid hsla(187,100%,55%,0.15)",
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      style={{ color: "hsl(187,100%,55%)", textShadow: "0 0 8px hsla(187,100%,50%,0.5)", flexShrink: 0 }}
                      className="font-pixel text-xs"
                    >
                      ✓
                    </span>
                    <span className="font-body text-sm leading-relaxed" style={{ color: "hsla(0,0%,100%,0.85)" }}>
                      {o}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { value: 4, suffix: "+", label: "Key Screens" },
              { value: 8, suffix: "", label: "Core Features" },
              { value: 100, suffix: "%", label: "Responsive" },
              { value: 60, suffix: "fps", label: "Smooth UI" },
            ].map((m, i) => (
              <div key={i} className="text-center">
                <div
                  className="font-pixel mb-2"
                  style={{
                    fontSize: "clamp(24px, 3.2vw, 36px)",
                    color: "hsla(0,0%,100%,0.95)",
                    textShadow: "0 0 20px hsla(187,100%,50%,0.25)",
                  }}
                >
                  <CountUp end={m.value} suffix={m.suffix} />
                </div>
                <div className="font-body text-xs uppercase tracking-[0.18em]" style={{ color: "hsla(175,100%,65%,0.7)" }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="font-pixel text-[10px] tracking-[0.25em] mb-4" style={{ color: "hsla(342,100%,70%,0.75)" }}>
              KEY LEARNINGS
            </div>
            <ul className="space-y-4 max-w-2xl">
              {learnings.map((l, i) => (
                <li key={i} className="font-body text-sm flex items-start gap-3" style={{ color: "hsla(0,0%,100%,0.72)" }}>
                  <span style={{ color: "hsla(175,100%,55%,0.85)", flexShrink: 0 }}>✦</span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <GlowDivider />

        {/* MORE PROJECTS */}
        <Section delay={0.05}>
          <SectionHeading kicker="08 — EXPLORE">More Projects</SectionHeading>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-3 font-body text-sm group"
            style={{ color: "hsl(187,100%,65%)" }}
          >
            <span
              className="px-6 py-3 rounded-full transition-all duration-300 group-hover:gap-4 inline-flex items-center gap-2"
              style={{
                border: "1px solid hsla(187,100%,55%,0.3)",
                background: "hsla(187,100%,50%,0.05)",
              }}
            >
              View all projects <ArrowRight size={16} />
            </span>
          </Link>
        </Section>
      </div>
    </div>
  );
}
