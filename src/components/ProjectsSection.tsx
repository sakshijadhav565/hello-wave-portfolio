import { useEffect, useRef, useState, useCallback } from "react";
import moviesHero from "@/assets/movies-hero.png";
import moviesSidebar from "@/assets/movies-sidebar.png";
import moviesDetails from "@/assets/movies-details.png";
import moviesCast from "@/assets/movies-cast.png";

/* ── Data ── */
const screenshots = [
  { src: moviesHero, alt: "Movies Time - Hero Banner" },
  { src: moviesSidebar, alt: "Movies Time - Sidebar UI" },
  { src: moviesDetails, alt: "Movies Time - Movie Details" },
  { src: moviesCast, alt: "Movies Time - Cast Section" },
];

const features = [
  "Real-time movie data",
  "Trending & popular movies",
  "Smart search (movies, actors)",
  "Genre-based filtering",
  "Detailed movie insights",
  "Actor & cast exploration",
];

const techStack = [
  { name: "React", color: "hsl(197, 100%, 50%)" },
  { name: "Framer Motion", color: "hsl(280, 80%, 60%)" },
  { name: "CSS", color: "hsl(210, 80%, 55%)" },
  { name: "MovieDB API", color: "hsl(40, 90%, 55%)" },
];

const moreProjects = [
  { title: "AI Chatbot", desc: "NLP-powered conversational agent" },
  { title: "Portfolio V1", desc: "First iteration of my developer portfolio" },
  { title: "Data Dashboard", desc: "Real-time analytics visualization" },
  { title: "Smart Notes", desc: "AI-assisted note-taking app" },
];

/* ── Particles ── */
function CyberParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; size: number; sx: number; sy: number; o: number }[] = [];

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.4,
        sx: (Math.random() - 0.5) * 0.25,
        sy: (Math.random() - 0.5) * 0.25,
        o: Math.random() * 0.35 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(183, 100%, 50%, ${p.o})`;
        ctx.fill();
        p.x += p.sx; p.y += p.sy;
        if (p.x < 0 || p.x > canvas.width) p.sx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.sy *= -1;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

/* ── Cursor Glow ── */
function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        width: 220,
        height: 220,
        background: "radial-gradient(circle, hsla(340, 100%, 59%, 0.12) 0%, transparent 70%)",
      }}
    />
  );
}

/* ── Scroll fade hook ── */
function useScrollVisible(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Screenshot Carousel ── */
function ScreenshotCarousel() {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const next = useCallback(() => setCurrent((c) => (c + 1) % screenshots.length), []);

  useEffect(() => {
    if (!hovered) intervalRef.current = setInterval(next, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hovered, next]);

  return (
    <div
      className="relative rounded-xl overflow-hidden group"
      style={{
        border: "2px solid hsla(183, 100%, 50%, 0.3)",
        boxShadow: "0 0 30px hsla(183, 100%, 50%, 0.15), inset 0 0 30px hsla(183, 100%, 50%, 0.05)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Scan-line overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-20">
        <div
          className="absolute inset-0 animate-scan-line"
          style={{
            background: "linear-gradient(180deg, transparent 0%, hsla(183, 100%, 50%, 0.08) 50%, transparent 100%)",
            height: "200%",
          }}
        />
      </div>

      {/* Slides */}
      <div className="relative aspect-[16/10] overflow-hidden bg-cyber-card">
        {screenshots.map((s, i) => (
          <img
            key={i}
            src={s.src}
            alt={s.alt}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
            style={{
              opacity: i === current ? 1 : 0,
              transform: i === current ? (hovered ? "scale(1.05)" : "scale(1)") : "scale(1.1)",
            }}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-cyber-bg to-transparent pointer-events-none" />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0, background: "hsla(0, 0%, 0%, 0.5)" }}
        >
          <span
            className="font-orbitron text-sm tracking-[0.2em] text-cyber-cyan px-6 py-3 border border-cyber-cyan/60 rounded-lg"
            style={{ textShadow: "0 0 12px hsl(183, 100%, 50%)" }}
          >
            EXPLORE PROJECT
          </span>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i === current ? "hsl(183, 100%, 50%)" : "hsla(183, 100%, 50%, 0.3)",
              boxShadow: i === current ? "0 0 8px hsl(183, 100%, 50%)" : "none",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Section ── */
export default function ProjectsSection() {
  const { ref: sectionRef, visible } = useScrollVisible(0.08);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden py-16 px-4"
      style={{ background: "hsl(234, 47%, 5%)" }}
    >
      <CyberParticles />
      <CursorGlow />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <h2
          className="font-orbitron font-bold text-center mb-16 tracking-[0.15em] animate-glow-pulse"
          style={{
            fontSize: "clamp(32px, 4.5vw, 56px)",
            color: "hsl(183, 100%, 50%)",
            textShadow: "0 0 20px hsl(183, 100%, 50%), 0 0 60px hsla(183, 100%, 50%, 0.4), 0 0 100px hsla(183, 100%, 50%, 0.15)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease-out",
          }}
        >
          PROJECTS
        </h2>

        {/* Featured Project Card */}
        <div
          className="rounded-2xl p-1 mb-20"
          style={{
            background: "linear-gradient(135deg, hsla(183, 100%, 50%, 0.2), hsla(340, 100%, 59%, 0.1), hsla(183, 100%, 50%, 0.05))",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.8s ease-out 0.15s",
          }}
        >
          <div className="rounded-xl p-8 lg:p-10 grid lg:grid-cols-2 gap-10 items-start" style={{ background: "hsl(228, 33%, 7%)" }}>
            {/* Left: Carousel */}
            <ScreenshotCarousel />

            {/* Right: Content */}
            <div className="flex flex-col gap-5">
              <div>
                <h3
                  className="font-orbitron font-bold text-3xl mb-1"
                  style={{ color: "hsl(340, 100%, 59%)", textShadow: "0 0 20px hsla(340, 100%, 59%, 0.5)" }}
                >
                  Movies Time
                </h3>
                <p className="font-rajdhani text-lg italic" style={{ color: "hsl(183, 100%, 50%)" }}>
                  A cinematic movie discovery platform
                </p>
              </div>

              <p className="font-rajdhani text-base leading-relaxed" style={{ color: "hsla(0, 0%, 100%, 0.65)" }}>
                An immersive movie exploration platform built with real-time data from the MovieDB API.
                Discover trending films, explore detailed insights, and navigate a visually rich cinematic
                interface powered by smooth animations.
              </p>

              {/* Feature tags */}
              <div className="grid grid-cols-2 gap-2.5">
                {features.map((f, i) => (
                  <div
                    key={f}
                    className="px-3 py-2.5 rounded-lg font-rajdhani text-sm transition-all duration-300 hover:-translate-y-1 cursor-default"
                    style={{
                      background: "hsla(183, 100%, 50%, 0.04)",
                      border: "1px solid hsla(183, 100%, 50%, 0.2)",
                      color: "hsla(0, 0%, 100%, 0.85)",
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(12px)",
                      transition: `opacity 0.5s ease-out ${0.3 + i * 0.08}s, transform 0.5s ease-out ${0.3 + i * 0.08}s, box-shadow 0.3s, border-color 0.3s`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "hsla(183, 100%, 50%, 0.5)";
                      e.currentTarget.style.boxShadow = "0 0 16px hsla(183, 100%, 50%, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "hsla(183, 100%, 50%, 0.2)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {f}
                  </div>
                ))}
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2.5 mt-1">
                {techStack.map((t) => (
                  <span
                    key={t.name}
                    className="px-4 py-1.5 rounded-full font-rajdhani text-sm font-semibold transition-all duration-300"
                    style={{
                      background: `${t.color}18`,
                      border: `1px solid ${t.color}55`,
                      color: t.color,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 14px ${t.color}44`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {t.name}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <button
                className="mt-2 self-start font-orbitron text-sm font-semibold tracking-wider px-7 py-3 rounded-lg transition-all duration-300"
                style={{
                  background: "hsl(340, 100%, 59%)",
                  color: "white",
                  boxShadow: "0 0 20px hsla(340, 100%, 59%, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 30px hsla(340, 100%, 59%, 0.55)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 20px hsla(340, 100%, 59%, 0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                View Project →
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mx-auto mb-14 h-px w-2/3"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(183, 100%, 50%), transparent)",
            boxShadow: "0 0 12px hsla(183, 100%, 50%, 0.3)",
          }}
        />

        {/* More Projects */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease-out 0.5s",
          }}
        >
          <h3
            className="font-orbitron font-semibold text-center text-sm tracking-[0.25em] mb-10"
            style={{ color: "hsl(183, 100%, 50%)", textShadow: "0 0 12px hsla(183, 100%, 50%, 0.5)" }}
          >
            MORE PROJECTS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {moreProjects.map((p, i) => (
              <div
                key={p.title}
                className="rounded-xl p-5 transition-all duration-300 cursor-pointer group"
                style={{
                  background: "hsl(228, 33%, 7%)",
                  border: "1px solid hsla(183, 100%, 50%, 0.12)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease-out ${0.6 + i * 0.1}s, transform 0.6s ease-out ${0.6 + i * 0.1}s, border-color 0.3s, box-shadow 0.3s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "hsla(183, 100%, 50%, 0.45)";
                  e.currentTarget.style.boxShadow = "0 8px 30px hsla(183, 100%, 50%, 0.1), 0 0 20px hsla(340, 100%, 59%, 0.06)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "hsla(183, 100%, 50%, 0.12)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Preview placeholder */}
                <div
                  className="w-full h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: "hsla(183, 100%, 50%, 0.03)",
                    border: "1px solid hsla(183, 100%, 50%, 0.1)",
                  }}
                >
                  <span className="font-orbitron text-[10px] tracking-[0.2em] z-10" style={{ color: "hsla(183, 100%, 50%, 0.35)" }}>
                    PREVIEW
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                </div>

                <h4
                  className="font-orbitron text-xs font-semibold mb-1"
                  style={{ color: "hsl(340, 100%, 59%)", textShadow: "0 0 8px hsla(340, 100%, 59%, 0.3)" }}
                >
                  {p.title}
                </h4>
                <p className="font-rajdhani text-sm" style={{ color: "hsla(0, 0%, 100%, 0.55)" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
