import { useEffect, useRef, useState, useCallback } from "react";
import moviesHero from "@/assets/movies-hero.png";
import moviesSidebar from "@/assets/movies-sidebar.png";
import moviesDetails from "@/assets/movies-details.png";
import moviesCast from "@/assets/movies-cast.png";

const PARTICLE_COUNT = 30;

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

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

const techStack = ["React", "Framer Motion", "CSS", "MovieDB API"];

const moreProjects = [
  { title: "AI Chatbot", desc: "NLP-powered conversational agent" },
  { title: "Portfolio V1", desc: "First iteration of my developer portfolio" },
  { title: "Data Dashboard", desc: "Real-time analytics visualization" },
  { title: "Smart Notes", desc: "AI-assisted note-taking app" },
];

/* ── Particles Canvas ── */
function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(187, 100%, 50%, ${p.opacity})`;
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
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
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* ── Screenshot Carousel ── */
function ScreenshotCarousel() {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % screenshots.length);
  }, []);

  useEffect(() => {
    if (!hovered) {
      intervalRef.current = setInterval(next, 3500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovered, next]);

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border-2 border-secondary/60 group"
      style={{ boxShadow: "0 0 25px hsla(187, 100%, 50%, 0.15)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Slides */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {screenshots.map((s, i) => (
          <img
            key={i}
            src={s.src}
            alt={s.alt}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
            style={{
              opacity: i === current ? 1 : 0,
              transform: i === current
                ? hovered ? "scale(1.04)" : "scale(1)"
                : "scale(1.08)",
            }}
          />
        ))}

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: "hsla(0, 0%, 0%, 0.4)",
          }}
        >
          <span
            className="font-pixel text-sm tracking-wider text-secondary px-6 py-3 border-2 border-secondary rounded-lg"
            style={{ textShadow: "0 0 12px hsl(187, 100%, 50%)" }}
          >
            Explore Project
          </span>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              background: i === current
                ? "hsl(187, 100%, 50%)"
                : "hsla(187, 100%, 50%, 0.3)",
              boxShadow: i === current ? "0 0 8px hsl(187, 100%, 50%)" : "none",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Scroll-triggered fade-in hook ── */
function useScrollVisible(threshold = 0.15) {
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

/* ── Main Section ── */
export default function ProjectsSection() {
  const { ref: sectionRef, visible } = useScrollVisible(0.1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 10,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
    });
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-background overflow-hidden py-16 px-4"
    >
      <ParticlesCanvas />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ── Title ── */}
        <h2
          className="font-pixel text-secondary text-center mb-14 tracking-widest animate-glow-pulse"
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            textShadow: "0 0 20px hsl(187, 100%, 50%), 0 0 40px hsla(187, 100%, 50%, 0.4)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease-out",
          }}
        >
          PROJECTS
        </h2>

        {/* ── Featured Project ── */}
        <div
          className="grid lg:grid-cols-2 gap-10 items-start"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? `translateY(0) perspective(1200px) rotateX(${mousePos.y * 0.15}deg) rotateY(${mousePos.x * 0.15}deg)`
              : "translateY(40px)",
            transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          {/* Left: Carousel */}
          <ScreenshotCarousel />

          {/* Right: Content */}
          <div className="flex flex-col gap-6">
            <div>
              <h3
                className="font-pixel text-primary text-2xl mb-2"
                style={{ textShadow: "0 0 15px hsl(342, 100%, 59%)" }}
              >
                Movies Time
              </h3>
              <p className="font-body text-secondary/80 text-lg italic">
                A cinematic movie discovery platform
              </p>
            </div>

            <p className="font-body text-muted-foreground leading-relaxed text-base">
              Movies Time is an immersive movie exploration platform built using real-time data
              from the MovieDB API. It allows users to discover trending films, explore detailed
              movie insights, and navigate through a visually rich cinematic interface powered
              by smooth animations.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div
                  key={f}
                  className="px-3 py-2.5 rounded-lg border border-secondary/30 bg-secondary/[0.04] font-body text-sm text-foreground/90 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/70"
                  style={{
                    boxShadow: "0 0 8px hsla(187, 100%, 50%, 0.06)",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(15px)",
                    transition: `opacity 0.5s ease-out ${0.4 + i * 0.1}s, transform 0.5s ease-out ${0.4 + i * 0.1}s, box-shadow 0.3s, border-color 0.3s`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 0 18px hsla(187, 100%, 50%, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 0 8px hsla(187, 100%, 50%, 0.06)";
                  }}
                >
                  {f}
                </div>
              ))}
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-3 mt-1">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="px-4 py-1.5 rounded-full font-body text-sm text-secondary border border-secondary/50 transition-all duration-300 hover:border-secondary"
                  style={{
                    background: "hsla(187, 100%, 50%, 0.06)",
                    boxShadow: "0 0 8px hsla(187, 100%, 50%, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLSpanElement).style.boxShadow =
                      "0 0 16px hsla(187, 100%, 50%, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLSpanElement).style.boxShadow =
                      "0 0 8px hsla(187, 100%, 50%, 0.1)";
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="mx-auto my-16 h-px w-2/3"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(187, 100%, 50%), transparent)",
            boxShadow: "0 0 12px hsla(187, 100%, 50%, 0.3)",
          }}
        />

        {/* ── More Projects ── */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease-out 0.6s",
          }}
        >
          <h3
            className="font-pixel text-secondary text-center text-sm tracking-widest mb-8"
            style={{ textShadow: "0 0 12px hsl(187, 100%, 50%)" }}
          >
            MORE PROJECTS
          </h3>

          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {moreProjects.map((p) => (
              <div
                key={p.title}
                className="snap-start shrink-0 w-64 rounded-xl border border-secondary/30 bg-secondary/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60 group cursor-pointer"
                style={{ boxShadow: "0 0 10px hsla(187, 100%, 50%, 0.06)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 0 20px hsla(187, 100%, 50%, 0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 0 10px hsla(187, 100%, 50%, 0.06)";
                }}
              >
                {/* Placeholder image area */}
                <div className="w-full h-32 rounded-lg bg-secondary/[0.06] border border-secondary/20 mb-4 flex items-center justify-center">
                  <span className="font-pixel text-xs text-secondary/40">PREVIEW</span>
                </div>
                <h4
                  className="font-pixel text-xs text-primary mb-1"
                  style={{ textShadow: "0 0 8px hsl(342, 100%, 59%)" }}
                >
                  {p.title}
                </h4>
                <p className="font-body text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
