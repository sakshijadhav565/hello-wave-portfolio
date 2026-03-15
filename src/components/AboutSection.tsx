import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Brain, Code, Lightbulb, Mail, Phone } from "lucide-react";

const PARTICLE_COUNT = 35;

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

const stats = [
  { label: "Projects Built", value: 10, suffix: "+" },
  { label: "Technologies Used", value: 8, suffix: "+" },
  { label: "AI Experiments", value: 15, suffix: "+" },
];

const techStack = [
  { name: "Python", icon: "🐍", delay: "0s" },
  { name: "React", icon: "⚛️", delay: "0.4s" },
  { name: "TensorFlow", icon: "🧠", delay: "0.8s" },
  { name: "Node.js", icon: "🟢", delay: "1.2s" },
  { name: "Git", icon: "📦", delay: "0.3s" },
  { name: "Docker", icon: "🐳", delay: "0.7s" },
  { name: "SQL", icon: "🗄️", delay: "1.1s" },
  { name: "Figma", icon: "🎨", delay: "0.5s" },
];

/* ── Animated Counter Hook ── */
function useCountUp(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!trigger || hasPlayed.current) return;
    hasPlayed.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);

  return count;
}

const StatCard = ({ label, value, suffix, trigger }: { label: string; value: number; suffix: string; trigger: boolean }) => {
  const count = useCountUp(value, 1200, trigger);
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4 rounded-lg border-2 border-hero-heading/40 bg-hero-heading/[0.04] backdrop-blur-sm transition-all duration-300 hover:border-hero-heading hover:shadow-[0_0_20px_hsl(var(--hero-heading)/0.25)]">
      <span className="font-pixel text-2xl md:text-3xl text-hero-heading drop-shadow-[0_0_10px_hsl(var(--hero-heading)/0.6)]">
        {count}{suffix}
      </span>
      <span className="font-body text-xs text-foreground/60 uppercase tracking-wider">{label}</span>
    </div>
  );
};

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.1,
        opacity: Math.random() * 0.4 + 0.12,
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
        ctx.shadowBlur = 8;
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
      className="relative w-full min-h-screen flex items-center justify-center py-20 px-6 md:px-16 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div
        className={`relative z-10 max-w-7xl w-full mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Heading */}
        <h2 className="font-pixel text-4xl md:text-5xl lg:text-[56px] text-hero-heading text-center mb-12 drop-shadow-[0_0_25px_hsl(var(--hero-heading)/0.6)]">
          ABOUT ME
        </h2>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          {/* Left column */}
          <div className="w-full lg:w-[58%] flex flex-col gap-8">
            {/* Intro */}
            <div>
              <p className="font-pixel text-sm md:text-base text-primary mb-3 leading-relaxed">
                Hi, I'm Sakshi — the mind behind Sakshi Codes.
              </p>
              <p className="font-body text-lg md:text-xl text-foreground/85 leading-relaxed">
                I'm passionate about Artificial Intelligence, Machine Learning,
                and building intelligent systems that solve real-world problems.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group rounded-xl border-[3px] border-hero-heading/50 bg-hero-heading/[0.04] backdrop-blur-sm p-6 transition-all duration-300 hover:border-hero-heading hover:shadow-[0_0_35px_hsl(var(--hero-heading)/0.35)] hover:-translate-y-2"
                >
                  <Icon
                    className="text-hero-heading mb-3 transition-all duration-300 group-hover:drop-shadow-[0_0_14px_hsl(var(--hero-heading)/0.8)]"
                    size={28}
                  />
                  <h3 className="font-body text-base font-bold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="font-body text-sm text-foreground/70 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full flex justify-center">
              <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-hero-heading/50 to-transparent shadow-[0_0_8px_hsl(var(--hero-heading)/0.3)]" />
            </div>

            {/* Stats row */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} trigger={statsVisible} />
              ))}
            </div>

            {/* Contact chips */}
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:sakshijadhav565@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-hero-heading/40 bg-background/60 font-body text-sm text-foreground/80 transition-all duration-300 hover:border-hero-heading/70 hover:shadow-[0_0_15px_hsl(var(--hero-heading)/0.2)]"
              >
                <Mail size={16} className="text-hero-heading" />
                sakshijadhav565@gmail.com
              </a>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/40 bg-background/60 font-body text-sm text-foreground/80">
                <Phone size={16} className="text-primary" />
                +91 9604558388
              </span>
            </div>
          </div>

          {/* Right column: Tech grid */}
          <div className="w-full lg:w-[42%] flex items-center justify-center">
            <div className="grid grid-cols-4 gap-4 w-full max-w-[340px]">
              {techStack.map(({ name, icon, delay }) => (
                <div
                  key={name}
                  className="group flex flex-col items-center justify-center gap-2 aspect-square rounded-lg border-2 border-hero-heading/30 bg-hero-heading/[0.04] backdrop-blur-sm transition-all duration-300 hover:border-hero-heading hover:shadow-[0_0_22px_hsl(var(--hero-heading)/0.3)] hover:-translate-y-1"
                  style={{ animation: `about-float 3.5s ease-in-out infinite`, animationDelay: delay }}
                >
                  <span className="text-2xl transition-all duration-300 group-hover:drop-shadow-[0_0_12px_hsl(var(--hero-heading)/0.6)]">
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
