import { useEffect, useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ── Data ── */
interface Project {
  title: string;
  tag: string;
  tagColor: "cyan" | "pink";
  description: string;
  phase: string;
}

const projects: Project[] = [
  {
    title: "Stock Price Prediction",
    tag: "AI / Machine Learning",
    tagColor: "cyan",
    description:
      "Built a stock price prediction system using LSTM (Recurrent Neural Network) trained on time-series data. The model learns patterns from historical stock data and predicts future trends using real-time API inputs.",
    phase: "2024 – Learning Phase",
  },
  {
    title: "Movies Time",
    tag: "Web Development",
    tagColor: "pink",
    description:
      "A movie exploration web app using MovieDB API with smooth animations powered by Framer Motion. Designed for an immersive UI experience with dynamic search and filtering.",
    phase: "2024 – Learning Phase",
  },
  {
    title: "Portfolio V1",
    tag: "Web Development",
    tagColor: "pink",
    description:
      "My first developer portfolio showcasing projects, skills, and interactive UI components. Focused on responsive design and clean layout.",
    phase: "2025 – Building Phase",
  },
  {
    title: "AI Chatbot",
    tag: "AI / NLP",
    tagColor: "cyan",
    description:
      "A conversational AI chatbot capable of understanding user queries and generating intelligent responses using NLP techniques.",
    phase: "2025 – Building Phase",
  },
];

/* ── Scroll visibility hook ── */
function useScrollReveal(threshold = 0.2) {
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

/* ── Particles ── */
function ParticlesCanvas() {
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
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.5, sx: (Math.random() - 0.5) * 0.25,
        sy: (Math.random() - 0.5) * 0.25, o: Math.random() * 0.35 + 0.1,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(187, 100%, 50%, ${p.o})`;
        ctx.fill();
        p.x += p.sx; p.y += p.sy;
        if (p.x < 0 || p.x > canvas.width) p.sx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.sy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

/* ── Timeline Node ── */
function TimelineNode({ active }: { active: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow */}
      <div
        className="absolute w-6 h-6 rounded-full transition-all duration-700"
        style={{
          background: active
            ? "hsla(187, 100%, 50%, 0.25)"
            : "hsla(187, 100%, 50%, 0.08)",
          boxShadow: active ? "0 0 20px hsla(187, 100%, 50%, 0.4)" : "none",
        }}
      />
      {/* Inner dot */}
      <div
        className="w-3 h-3 rounded-full border-2 transition-all duration-700 z-10"
        style={{
          borderColor: "hsl(187, 100%, 50%)",
          background: active ? "hsl(187, 100%, 50%)" : "hsl(0, 0%, 0%)",
          boxShadow: active ? "0 0 10px hsl(187, 100%, 50%)" : "none",
        }}
      />
    </div>
  );
}

/* ── Phase Label ── */
function PhaseLabel({ text, visible }: { text: string; visible: boolean }) {
  return (
    <div
      className="font-pixel text-[10px] tracking-widest text-center py-3"
      style={{
        color: "hsl(187, 100%, 50%)",
        textShadow: "0 0 10px hsla(187, 100%, 50%, 0.5)",
        opacity: visible ? 0.7 : 0,
        transition: "opacity 0.8s ease-out",
      }}
    >
      {text}
    </div>
  );
}

/* ── Project Card ── */
function ProjectCard({
  project,
  index,
  visible,
  onClick,
}: {
  project: Project;
  index: number;
  visible: boolean;
  onClick: () => void;
}) {
  const isLeft = index % 2 === 0;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer rounded-xl p-5 transition-all duration-500"
      style={{
        background: hovered
          ? "hsla(187, 100%, 50%, 0.06)"
          : "hsla(187, 100%, 50%, 0.03)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1.5px solid ${hovered ? "hsla(187, 100%, 50%, 0.5)" : "hsla(187, 100%, 50%, 0.15)"}`,
        boxShadow: hovered
          ? "0 8px 40px hsla(187, 100%, 50%, 0.2), 0 0 30px hsla(187, 100%, 50%, 0.15), inset 0 0 30px hsla(187, 100%, 50%, 0.03)"
          : "0 4px 20px hsla(0, 0%, 0%, 0.3), 0 0 10px hsla(187, 100%, 50%, 0.05)",
        transform: `
          ${visible ? "translateX(0)" : isLeft ? "translateX(-60px)" : "translateX(60px)"}
          ${hovered ? "scale(1.03)" : "scale(1)"}
        `,
        opacity: visible ? 1 : 0,
        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${index * 0.15}s`,
      }}
    >
      {/* Tag */}
      <span
        className="inline-block font-pixel text-[9px] tracking-wider px-3 py-1 rounded-full mb-3"
        style={{
          color: project.tagColor === "cyan" ? "hsl(187, 100%, 50%)" : "hsl(342, 100%, 59%)",
          border: `1px solid ${project.tagColor === "cyan" ? "hsla(187, 100%, 50%, 0.4)" : "hsla(342, 100%, 59%, 0.4)"}`,
          background: project.tagColor === "cyan" ? "hsla(187, 100%, 50%, 0.08)" : "hsla(342, 100%, 59%, 0.08)",
          textShadow: `0 0 8px ${project.tagColor === "cyan" ? "hsla(187, 100%, 50%, 0.5)" : "hsla(342, 100%, 59%, 0.5)"}`,
        }}
      >
        {project.tag}
      </span>

      {/* Title */}
      <h3
        className="font-pixel text-sm mb-2"
        style={{
          color: "hsl(0, 0%, 100%)",
          textShadow: hovered ? "0 0 12px hsla(187, 100%, 50%, 0.4)" : "none",
          transition: "text-shadow 0.3s",
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className="font-body text-sm leading-relaxed line-clamp-2"
        style={{ color: "hsla(0, 0%, 100%, 0.6)" }}
      >
        {project.description}
      </p>
    </div>
  );
}

/* ── Main Section ── */
export default function ProjectsSection() {
  const { ref: titleRef, visible: titleVisible } = useScrollReveal(0.3);
  const cardRefs = projects.map(() => useScrollReveal(0.2));
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Group projects by phase
  const phases = [...new Set(projects.map((p) => p.phase))];

  return (
    <section id="projects" className="relative min-h-screen bg-background overflow-hidden py-20 px-4">
      <ParticlesCanvas />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Title */}
        <h2
          ref={titleRef}
          className="font-pixel text-center mb-16 tracking-widest animate-glow-pulse"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            color: "hsl(187, 100%, 50%)",
            textShadow: "0 0 20px hsl(187, 100%, 50%), 0 0 40px hsla(187, 100%, 50%, 0.3)",
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(25px)",
            transition: "all 0.8s ease-out",
          }}
        >
          PROJECTS
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical glowing line — desktop center, mobile left */}
          <div
            className="absolute top-0 bottom-0 w-px md:left-1/2 left-4 md:-translate-x-1/2"
            style={{
              background: "linear-gradient(180deg, transparent, hsl(187, 100%, 50%), hsla(187, 100%, 50%, 0.3), transparent)",
              boxShadow: "0 0 8px hsla(187, 100%, 50%, 0.3)",
            }}
          />

          {(() => {
            let cardIdx = 0;
            return phases.map((phase) => {
              const phaseProjects = projects.filter((p) => p.phase === phase);
              return (
                <div key={phase}>
                  {/* Phase label */}
                  <PhaseLabel text={phase} visible={cardRefs[cardIdx]?.visible ?? false} />

                  {phaseProjects.map((project) => {
                    const idx = cardIdx;
                    const { ref, visible } = cardRefs[idx];
                    const isLeft = idx % 2 === 0;
                    cardIdx++;

                    return (
                      <div
                        key={project.title}
                        ref={ref}
                        className={`relative flex items-center mb-12 ${
                          /* Mobile: always right of line. Desktop: alternate */
                          "md:flex-row flex-row"
                        }`}
                        style={{
                          justifyContent: isLeft ? "flex-start" : "flex-end",
                        }}
                      >
                        {/* Desktop layout */}
                        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] w-full items-center gap-4">
                          {isLeft ? (
                            <>
                              <div className="pr-4">
                                <ProjectCard
                                  project={project}
                                  index={idx}
                                  visible={visible}
                                  onClick={() => setSelectedProject(project)}
                                />
                              </div>
                              <TimelineNode active={visible} />
                              <div />
                            </>
                          ) : (
                            <>
                              <div />
                              <TimelineNode active={visible} />
                              <div className="pl-4">
                                <ProjectCard
                                  project={project}
                                  index={idx}
                                  visible={visible}
                                  onClick={() => setSelectedProject(project)}
                                />
                              </div>
                            </>
                          )}
                        </div>

                        {/* Mobile layout — card always right of line */}
                        <div className="md:hidden flex items-center gap-4 w-full pl-8">
                          <div className="absolute left-4 -translate-x-1/2">
                            <TimelineNode active={visible} />
                          </div>
                          <div className="flex-1">
                            <ProjectCard
                              project={project}
                              index={idx}
                              visible={visible}
                              onClick={() => setSelectedProject(project)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent
          className="border-0 max-w-md"
          style={{
            background: "hsla(0, 0%, 4%, 0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid hsla(187, 100%, 50%, 0.3)",
            boxShadow: "0 0 40px hsla(187, 100%, 50%, 0.15)",
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="font-pixel text-base"
              style={{
                color: "hsl(187, 100%, 50%)",
                textShadow: "0 0 12px hsla(187, 100%, 50%, 0.5)",
              }}
            >
              {selectedProject?.title}
            </DialogTitle>
            <DialogDescription className="font-body text-sm pt-2" style={{ color: "hsla(0, 0%, 100%, 0.6)" }}>
              {selectedProject?.description}
            </DialogDescription>
          </DialogHeader>
          <p className="font-pixel text-[10px] mt-2" style={{ color: "hsla(187, 100%, 50%, 0.5)" }}>
            Full project details coming soon...
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
