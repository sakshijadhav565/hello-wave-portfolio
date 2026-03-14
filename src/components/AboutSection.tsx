import { useEffect, useRef, useState, useMemo } from "react";
import aboutIllustration from "@/assets/about-tech-illustration.png";

const PARTICLE_COUNT = 30;

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Fade-in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Particle background
  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.3 + 0.1,
    })),
  []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const localParticles = particles.map((p) => ({ ...p }));

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      for (const p of localParticles) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = 100;
        if (p.x > 100) p.x = 0;
        if (p.y < 0) p.y = 100;
        if (p.y > 100) p.y = 0;

        ctx.beginPath();
        ctx.arc((p.x / 100) * w, (p.y / 100) * h, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(187, 100%, 57%, ${p.opacity})`;
        ctx.shadowColor = "hsl(187, 100%, 57%)";
        ctx.shadowBlur = 6;
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
      className="relative w-full py-24 px-6 md:px-16 overflow-hidden"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div
        className={`relative z-10 max-w-6xl mx-auto transition-all duration-1000 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        {/* Section heading */}
        <h2 className="font-pixel text-2xl md:text-3xl text-hero-heading text-center mb-16 drop-shadow-[0_0_15px_hsl(var(--hero-heading)/0.5)]">
          ABOUT ME
        </h2>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Left: Content */}
          <div className="w-full md:w-[55%]">
            <p className="font-pixel text-sm text-primary mb-6">
              Hi, I'm Sakshi — the mind behind Sakshi Codes.
            </p>
            <p className="font-body text-base md:text-lg text-foreground/90 leading-relaxed mb-4">
              I'm deeply passionate about Artificial Intelligence, Machine
              Learning, and building intelligent systems that solve real-world
              problems. I love turning ideas into reality through code, data,
              and creative problem solving.
            </p>
            <p className="font-body text-base md:text-lg text-foreground/90 leading-relaxed mb-4">
              Whether it's experimenting with new technologies, designing smart
              algorithms, or building interactive applications, I thrive on
              pushing the boundaries of what technology can achieve.
            </p>
            <p className="font-body text-base md:text-lg text-foreground/90 leading-relaxed mb-4">
              My journey revolves around curiosity, constant learning, and
              building meaningful digital experiences. I'm especially excited
              about the intersection of AI, software development, and
              innovation — where data transforms into intelligent solutions.
            </p>
            <p className="font-body text-base md:text-lg text-foreground/90 leading-relaxed mb-8">
              Beyond just coding, I enjoy exploring new ideas, collaborating on
              ambitious projects, and continuously evolving as a developer and
              creator.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-2">
              <p className="font-body text-sm text-muted-foreground">
                <span className="text-hero-heading font-semibold">Email:</span>{" "}
                <a
                  href="mailto:sakshijadhav565@gmail.com"
                  className="hover:text-hero-heading transition-colors duration-300"
                >
                  sakshijadhav565@gmail.com
                </a>
              </p>
              <p className="font-body text-sm text-muted-foreground">
                <span className="text-hero-heading font-semibold">Phone:</span>{" "}
                +91 9604558388
              </p>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="w-full md:w-[45%] flex justify-center">
            <img
              src={aboutIllustration}
              alt="Coding themed illustration"
              className="w-full max-w-[400px] animate-float drop-shadow-[0_0_25px_hsl(var(--hero-heading)/0.3)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
