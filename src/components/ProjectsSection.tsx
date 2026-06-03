import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Github, ExternalLink } from "lucide-react";
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
  techStack: string[];
}

const projects: Project[] = [
  {
    title: "ERP Portal Redesign",
    tag: "UI / UX Design",
    tagColor: "pink",
    description:
      "Redesigned a college ERP platform through UX research, heuristic evaluation, user testing, and mobile-first UI redesigns to improve usability, accessibility, and academic workflows.",
    phase: "2025 – Building Phase",
    techStack: ["Figma", "UX Research", "UI Design", "Wireframing", "Heuristic Evaluation"],
  },
  {
    title: "Movies Time",
    tag: "Web Development",
    tagColor: "pink",
    description:
      "A movie exploration web app using MovieDB API with smooth animations powered by Framer Motion. Designed for an immersive UI experience with dynamic search and filtering.",
    phase: "2024 – Learning Phase",
    techStack: ["React", "Framer Motion", "CSS", "MovieDB API"],
  },
  {
    title: "Stock Price Prediction",
    tag: "AI / Machine Learning",
    tagColor: "cyan",
    description:
      "Built a stock price prediction system using LSTM (Recurrent Neural Network) trained on time-series data. The model learns patterns from historical stock data and predicts future trends using real-time API inputs.",
    phase: "2024 – Learning Phase",
    techStack: ["Python", "LSTM", "TensorFlow", "Pandas"],
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
    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.setTransform(2, 0, 0, 2, 0, 0); };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * 100, y: Math.random() * 100,
        size: Math.random() * 2 + 0.5, sx: (Math.random() - 0.5) * 0.08,
        sy: (Math.random() - 0.5) * 0.08, o: Math.random() * 0.4 + 0.12,
      });
    }
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc((p.x / 100) * w, (p.y / 100) * h, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(187, 100%, 50%, ${p.o})`;
        ctx.shadowColor = "hsla(187, 100%, 50%, 0.5)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        p.x += p.sx; p.y += p.sy;
        if (p.x < 0 || p.x > 100) p.sx *= -1;
        if (p.y < 0 || p.y > 100) p.sy *= -1;
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
      <div
        className="absolute w-8 h-8 rounded-full animate-glow-pulse"
        style={{
          background: active
            ? "hsla(187, 100%, 50%, 0.3)"
            : "hsla(187, 100%, 50%, 0.1)",
          boxShadow: active ? "0 0 25px hsla(187, 100%, 50%, 0.5)" : "none",
          transition: "all 0.7s ease-out",
        }}
      />
      <div
        className="w-4 h-4 rounded-full border-2 z-10"
        style={{
          borderColor: "hsl(187, 100%, 50%)",
          background: active ? "hsl(187, 100%, 50%)" : "hsl(0, 0%, 0%)",
          boxShadow: active ? "0 0 14px hsl(187, 100%, 50%)" : "none",
          transition: "all 0.7s ease-out",
        }}
      />
    </div>
  );
}

/* ── Phase Label ── */
function PhaseLabel({ text, visible }: { text: string; visible: boolean }) {
  return (
    <div
      className="font-pixel text-[10px] tracking-widest text-center py-4"
      style={{
        color: "hsl(187, 100%, 50%)",
        textShadow: "0 0 12px hsla(187, 100%, 50%, 0.6)",
        opacity: visible ? 0.8 : 0,
        transition: "opacity 0.8s ease-out",
      }}
    >
      {text}
    </div>
  );
}

/* ── Connector Line (dashed line to empty side) ── */
function ConnectorLine({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="hidden md:block absolute top-1/2 -translate-y-1/2"
      style={{
        [side === "left" ? "right" : "left"]: "50%",
        width: "calc(50% - 40px)",
        height: "1px",
        backgroundImage: "repeating-linear-gradient(90deg, hsla(187, 100%, 50%, 0.12) 0px, hsla(187, 100%, 50%, 0.12) 6px, transparent 6px, transparent 14px)",
      }}
    />
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
          ? "linear-gradient(135deg, hsla(187, 100%, 50%, 0.08), hsla(187, 100%, 50%, 0.03))"
          : "linear-gradient(135deg, hsla(187, 100%, 50%, 0.04), hsla(0, 0%, 4%, 0.6))",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `2px solid ${hovered ? "hsla(187, 100%, 50%, 0.6)" : "hsla(187, 100%, 50%, 0.18)"}`,
        boxShadow: hovered
          ? "0 12px 50px hsla(187, 100%, 50%, 0.25), 0 0 40px hsla(187, 100%, 50%, 0.15), inset 0 1px 0 hsla(187, 100%, 50%, 0.1)"
          : "0 6px 30px hsla(0, 0%, 0%, 0.4), 0 0 15px hsla(187, 100%, 50%, 0.06), inset 0 1px 0 hsla(187, 100%, 50%, 0.05)",
        transform: `
          ${visible ? "translateX(0)" : isLeft ? "translateX(-60px)" : "translateX(60px)"}
          ${hovered ? "scale(1.04) translateY(-4px)" : "scale(1) translateY(0)"}
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
          background: project.tagColor === "cyan" ? "hsla(187, 100%, 50%, 0.1)" : "hsla(342, 100%, 59%, 0.1)",
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
          textShadow: hovered ? "0 0 14px hsla(187, 100%, 50%, 0.5)" : "none",
          transition: "text-shadow 0.3s",
        }}
      >
        {project.title}
      </h3>

      {/* Description — full, no truncation */}
      <p
        className="font-body text-sm leading-relaxed mb-4"
        style={{ color: "hsla(0, 0%, 100%, 0.65)" }}
      >
        {project.description}
      </p>

      {/* Tech Stack Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="font-body text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all duration-300 hover:-translate-y-0.5"
            style={{
              color: "hsl(187, 100%, 50%)",
              border: "1px solid hsla(187, 100%, 50%, 0.3)",
              background: "hsla(187, 100%, 50%, 0.06)",
              textShadow: "0 0 6px hsla(187, 100%, 50%, 0.3)",
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Footer: View Project + GitHub */}
      <div className="flex items-center justify-between">
        <button
          className="font-pixel text-[9px] tracking-wider flex items-center gap-1.5 transition-all duration-300 hover:gap-2.5"
          style={{
            color: "hsl(187, 100%, 50%)",
            textShadow: hovered ? "0 0 10px hsla(187, 100%, 50%, 0.6)" : "0 0 6px hsla(187, 100%, 50%, 0.3)",
          }}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          View Project <ExternalLink size={12} />
        </button>
        <button
          className="transition-all duration-300 hover:scale-110"
          style={{
            color: "hsla(0, 0%, 100%, 0.5)",
            filter: hovered ? "drop-shadow(0 0 8px hsla(187, 100%, 50%, 0.4))" : "none",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Github size={16} />
        </button>
      </div>
    </div>
  );
}

/* ── Main Section ── */
export default function ProjectsSection() {
  const navigate = useNavigate();
  const { ref: titleRef, visible: titleVisible } = useScrollReveal(0.3);
  const cardRefs = [useScrollReveal(0.15), useScrollReveal(0.15), useScrollReveal(0.15)];
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const phases = [...new Set(projects.map((p) => p.phase))];

  return (
    <section id="projects" className="relative min-h-screen bg-background overflow-hidden py-20 px-4">
      <ParticlesCanvas />

      {/* Radial glow behind section */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 30%, hsla(187, 100%, 50%, 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Title */}
        <h2
          ref={titleRef}
          className="font-pixel text-center mb-14 tracking-widest animate-glow-pulse"
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            color: "hsl(187, 100%, 50%)",
            textShadow: "0 0 25px hsl(187, 100%, 50%), 0 0 50px hsla(187, 100%, 50%, 0.3)",
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(25px)",
            transition: "all 0.8s ease-out",
          }}
        >
          PROJECTS
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical glow behind line */}
          <div
            className="absolute top-0 bottom-0 w-8 md:left-1/2 left-4 -translate-x-1/2 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, transparent 0%, hsla(187, 100%, 50%, 0.06) 15%, hsla(187, 100%, 50%, 0.08) 50%, hsla(187, 100%, 50%, 0.06) 85%, transparent 100%)",
              filter: "blur(8px)",
            }}
          />
          {/* Vertical glowing line */}
          <div
            className="absolute top-0 bottom-0 w-px md:left-1/2 left-4 -translate-x-1/2"
            style={{
              background: "linear-gradient(180deg, transparent, hsl(187, 100%, 50%), hsla(187, 100%, 50%, 0.4), transparent)",
              boxShadow: "0 0 10px hsla(187, 100%, 50%, 0.4)",
            }}
          />

          {(() => {
            let cardIdx = 0;
            return phases.map((phase) => {
              const phaseProjects = projects.filter((p) => p.phase === phase);
              return (
                <div key={phase}>
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
                        className="relative flex items-center mb-8"
                      >
                        {/* Dashed connector to empty side */}
                        <ConnectorLine side={isLeft ? "right" : "left"} />

                        {/* Desktop layout */}
                        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] w-full items-center gap-4">
                          {isLeft ? (
                            <>
                              <div className="pr-4">
                                <ProjectCard
                                  project={project}
                                  index={idx}
                                  visible={visible}
                                  onClick={() => { if (project.title === "Stock Price Prediction") navigate("/projects/stock-market-prediction"); else if (project.title === "ERP Portal Redesign") navigate("/projects/erp-redesign"); else if (project.title === "Movies Time") navigate("/projects/movies-time"); else setSelectedProject(project); }}
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
                                  onClick={() => { if (project.title === "Stock Price Prediction") navigate("/projects/stock-market-prediction"); else if (project.title === "ERP Portal Redesign") navigate("/projects/erp-redesign"); else if (project.title === "Movies Time") navigate("/projects/movies-time"); else setSelectedProject(project); }}
                                />
                              </div>
                            </>
                          )}
                        </div>

                        {/* Mobile layout */}
                        <div className="md:hidden flex items-center gap-4 w-full pl-8">
                          <div className="absolute left-4 -translate-x-1/2">
                            <TimelineNode active={visible} />
                          </div>
                          <div className="flex-1">
                            <ProjectCard
                              project={project}
                              index={idx}
                              visible={visible}
                              onClick={() => { if (project.title === "Stock Price Prediction") navigate("/projects/stock-market-prediction"); else if (project.title === "ERP Portal Redesign") navigate("/projects/erp-redesign"); else if (project.title === "Movies Time") navigate("/projects/movies-time"); else setSelectedProject(project); }}
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
            boxShadow: "0 0 50px hsla(187, 100%, 50%, 0.2)",
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
            <DialogDescription className="font-body text-sm pt-2" style={{ color: "hsla(0, 0%, 100%, 0.65)" }}>
              {selectedProject?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedProject.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-body text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    color: "hsl(187, 100%, 50%)",
                    border: "1px solid hsla(187, 100%, 50%, 0.3)",
                    background: "hsla(187, 100%, 50%, 0.06)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          <p className="font-pixel text-[10px] mt-2" style={{ color: "hsla(187, 100%, 50%, 0.5)" }}>
            Full project details coming soon...
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
