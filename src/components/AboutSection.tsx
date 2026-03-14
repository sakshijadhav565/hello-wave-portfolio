import { useEffect, useRef, useState, useMemo } from "react";
import { Brain, Code, Lightbulb, Mail, Phone } from "lucide-react";

const PARTICLE_COUNT = 20;

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const features = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    desc: "Building intelligent systems using data, algorithms, and modern AI frameworks.",
  },
  {
    icon: Code,
    title: "Full-Stack Development",
    desc: "Creating interactive applications and scalable digital solutions.",
  },
  {
    icon: Lightbulb,
    title: "Curiosity Driven",
    desc: "Constantly learning new technologies and pushing the boundaries of innovation.",
  },
];

const techStack = [
  { name: "Python", icon: "🐍" },
  { name: "React", icon: "⚛️" },
  { name: "TensorFlow", icon: "🧠" },
  { name: "Git", icon: "📦" },
  { name: "Docker", icon: "🐳" },
  { name: "SQL", icon: "🗄️" },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.08,
        speedY: (Math.random() - 0.5) * 0.06,
        opacity: Math.random() * 0.2 + 0.05,
      })),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const local = particles.map((p) => ({ ...p }));

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      for (const p of local) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = 100;
        if (p.x > 100) p.x = 0;
        if (p.y < 0) p.y = 100;
        if (p.y > 100) p.y = 0;
        ctx.beginPath();
        ctx.arc((p.x / 100) * w, (p.y / 100) * h, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(187,100%,57%,${p.opacity})`;
        ctx.shadowColor = "hsl(187,100%,57%)";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [particles]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-16 px-6 md:px-16 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div
        className={`relative z-10 max-w-6xl mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Heading */}
        <h2 className="font-pixel text-xl md:text-2xl text-hero-heading text-center mb-10 drop-shadow-[0_0_15px_hsl(var(--hero-heading)/0.5)]">
          ABOUT ME
        </h2>

        {/* Two-column: content left, tech grid right */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Left column */}
          <div className="w-full lg:w-[60%] flex flex-col gap-8">
            {/* Short intro */}
            <div>
              <p className="font-pixel text-xs text-primary mb-2">
                Hi, I'm Sakshi — the mind behind Sakshi Codes.
              </p>
              <p className="font-body text-base text-foreground/85 leading-relaxed">
                I'm passionate about Artificial Intelligence, Machine Learning,
                and building intelligent systems that solve real-world problems.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group rounded-lg border border-hero-heading/30 bg-background/60 backdrop-blur-sm p-5 transition-all duration-300 hover:border-hero-heading/70 hover:shadow-[0_0_20px_hsl(var(--hero-heading)/0.15)] hover:-translate-y-1"
                >
                  <Icon
                    className="text-hero-heading mb-3 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(var(--hero-heading)/0.6)]"
                    size={24}
                  />
                  <h3 className="font-body text-sm font-bold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="font-body text-xs text-foreground/70 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact chips */}
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:sakshijadhav565@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-hero-heading/30 bg-background/60 font-body text-xs text-foreground/80 transition-all duration-300 hover:border-hero-heading/60 hover:shadow-[0_0_12px_hsl(var(--hero-heading)/0.15)]"
              >
                <Mail size={14} className="text-hero-heading" />
                sakshijadhav565@gmail.com
              </a>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-background/60 font-body text-xs text-foreground/80">
                <Phone size={14} className="text-primary" />
                +91 9604558388
              </span>
            </div>
          </div>

          {/* Right column: Tech grid */}
          <div className="w-full lg:w-[40%] flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 w-full max-w-[300px]">
              {techStack.map(({ name, icon }) => (
                <div
                  key={name}
                  className="group flex flex-col items-center justify-center gap-2 aspect-square rounded-lg border border-hero-heading/20 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-hero-heading/60 hover:shadow-[0_0_18px_hsl(var(--hero-heading)/0.2)] hover:-translate-y-0.5"
                >
                  <span className="text-2xl transition-all duration-300 group-hover:drop-shadow-[0_0_10px_hsl(var(--hero-heading)/0.5)]">
                    {icon}
                  </span>
                  <span className="font-body text-[10px] font-semibold text-foreground/70 group-hover:text-hero-heading transition-colors duration-300">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
