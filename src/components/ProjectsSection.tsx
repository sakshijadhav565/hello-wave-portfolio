import { useEffect, useRef, useState } from "react";

/* ── Data ── */
const projects = [
  {
    title: "Stock Price Predictor",
    year: "2024",
    tags: ["AI / ML", "Python", "LSTM", "RNN"],
    desc: "Uses LSTM neural networks to predict real-time stock prices fetched via API. Machine learning identifies hidden patterns in market data.",
  },
  {
    title: "Movies Time",
    year: "2024",
    tags: ["React", "Framer Motion", "MovieDB API"],
    desc: "A cinematic movie discovery platform with smooth animations. Explore trending films, actors, and detailed movie insights.",
  },
  {
    title: "AI Chatbot",
    year: "2023",
    tags: ["NLP", "Python"],
    desc: "NLP-powered conversational agent.",
  },
  {
    title: "Data Dashboard",
    year: "2023",
    tags: ["React", "D3.js"],
    desc: "Real-time analytics visualization.",
  },
  {
    title: "Smart Notes",
    year: "2023",
    tags: ["React", "AI"],
    desc: "AI-assisted note-taking app.",
  },
  {
    title: "Portfolio V1",
    year: "2022",
    tags: ["HTML", "CSS", "JS"],
    desc: "First iteration of my developer portfolio.",
  },
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

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.4,
        sx: (Math.random() - 0.5) * 0.2,
        sy: (Math.random() - 0.5) * 0.2,
        o: Math.random() * 0.3 + 0.05,
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

/* ── Scroll visibility hook ── */
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

/* ── Timeline Node ── */
function TimelineNode({ project, index, visible }: { project: typeof projects[0]; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isLeft = index % 2 === 0;

  return (
    <div
      className="relative flex items-center w-full mb-8 last:mb-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s ease-out ${0.2 + index * 0.12}s`,
      }}
    >
      {/* Left content (even) or spacer (odd) */}
      <div className={`w-[45%] ${isLeft ? "text-right pr-8" : ""}`}>
        {isLeft && (
          <TimelineCard project={project} hovered={hovered} setHovered={setHovered} />
        )}
      </div>

      {/* Center line + dot */}
      <div className="w-[10%] flex flex-col items-center relative">
        <div
          className="w-4 h-4 rounded-full border-2 z-10 transition-all duration-300"
          style={{
            borderColor: hovered ? "hsl(183, 100%, 50%)" : "hsl(340, 100%, 59%)",
            background: hovered ? "hsl(183, 100%, 50%)" : "hsl(340, 100%, 59%)",
            boxShadow: hovered
              ? "0 0 20px hsl(183, 100%, 50%), 0 0 40px hsla(183, 100%, 50%, 0.4)"
              : "0 0 8px hsla(340, 100%, 59%, 0.5)",
            transform: hovered ? "scale(1.4)" : "scale(1)",
          }}
        />
      </div>

      {/* Right content (odd) or spacer (even) */}
      <div className={`w-[45%] ${!isLeft ? "pl-8" : ""}`}>
        {!isLeft && (
          <TimelineCard project={project} hovered={hovered} setHovered={setHovered} />
        )}
      </div>
    </div>
  );
}

function TimelineCard({
  project,
  hovered,
  setHovered,
}: {
  project: typeof projects[0];
  hovered: boolean;
  setHovered: (v: boolean) => void;
}) {
  return (
    <div
      className="rounded-xl p-5 cursor-pointer transition-all duration-300"
      style={{
        background: "hsl(228, 33%, 7%)",
        border: `1px solid ${hovered ? "hsla(183, 100%, 50%, 0.5)" : "hsla(183, 100%, 50%, 0.15)"}`,
        boxShadow: hovered
          ? "0 0 25px hsla(183, 100%, 50%, 0.15), 0 0 10px hsla(340, 100%, 59%, 0.1)"
          : "none",
        transform: hovered ? "scale(1.03)" : "scale(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3 mb-2">
        <h4
          className="font-pixel text-xs md:text-sm"
          style={{ color: "hsl(340, 100%, 59%)" }}
        >
          {project.title}
        </h4>
        <span
          className="font-pixel text-[8px] px-2 py-0.5 rounded-full border"
          style={{
            color: "hsl(183, 100%, 50%)",
            borderColor: "hsla(183, 100%, 50%, 0.3)",
          }}
        >
          {project.year}
        </span>
      </div>

      <p className="font-pixel text-[8px] md:text-[9px] leading-relaxed mb-3" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
        {project.desc}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-pixel text-[7px] px-2 py-1 rounded-full"
            style={{
              background: "hsla(183, 100%, 50%, 0.08)",
              border: "1px solid hsla(183, 100%, 50%, 0.25)",
              color: "hsl(183, 100%, 50%)",
            }}
          >
            {tag}
          </span>
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

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Title */}
        <h2
          className="font-pixel font-bold text-center mb-16 tracking-[0.15em] animate-glow-pulse"
          style={{
            fontSize: "clamp(24px, 3.5vw, 42px)",
            color: "hsl(183, 100%, 50%)",
            textShadow: "0 0 20px hsl(183, 100%, 50%), 0 0 60px hsla(183, 100%, 50%, 0.4)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease-out",
          }}
        >
          PROJECTS
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
            style={{
              background: "linear-gradient(180deg, hsla(183, 100%, 50%, 0.05), hsla(183, 100%, 50%, 0.3), hsla(340, 100%, 59%, 0.3), hsla(183, 100%, 50%, 0.05))",
            }}
          />

          {projects.map((project, i) => (
            <TimelineNode key={project.title} project={project} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
