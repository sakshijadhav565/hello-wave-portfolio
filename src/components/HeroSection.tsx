import { useState, useEffect, useRef, useCallback } from "react";
import sakshiVideo from "@/assets/sakshi-intro.mp4";

const roles = ["AI Developer", "Machine Learning Engineer", "Problem Solver"];

const PARTICLE_COUNT = 40;

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2 + 0.5,
      sx: (Math.random() - 0.5) * 0.0008,
      sy: (Math.random() - 0.5) * 0.0006,
      opacity: Math.random() * 0.3 + 0.08,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.sx;
        p.y += p.sy;
        if (p.x < 0 || p.x > 1) p.sx *= -1;
        if (p.y < 0 || p.y > 1) p.sy *= -1;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(187, 100%, 50%, ${p.opacity})`;
        ctx.shadowColor = "hsla(187, 100%, 50%, 0.4)";
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
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 100);
    } else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 50);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallaxOffset = scrollY * 0.15;

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-6 md:px-16 pt-16 pb-28 min-h-[85vh] overflow-hidden"
    >
      {/* Background particles */}
      <HeroParticles />

      {/* Glowing gradient backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, hsla(187, 100%, 50%, 0.1) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 70% 60%, hsla(342, 100%, 59%, 0.07) 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 30% 50%, hsla(187, 100%, 50%, 0.04) 0%, transparent 60%)",
        }}
      />

      {/* Illustration / Video */}
      <div
        className="w-full md:w-[42%] flex justify-center animate-float relative z-10"
        style={{ transform: `translateY(${-parallaxOffset * 0.3}px)` }}
      >
        <video
          src={sakshiVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-w-[450px] rounded-lg"
          style={{
            boxShadow: "0 0 40px hsla(187, 100%, 50%, 0.15), 0 8px 32px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Text Content */}
      <div
        className="w-full md:w-1/2 text-center md:text-left relative z-10 rounded-2xl p-6 md:p-8"
        style={{
          background: "hsla(0, 0%, 4%, 0.45)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid hsla(187, 100%, 50%, 0.12)",
          boxShadow: "0 8px 40px hsla(0, 0%, 0%, 0.5), 0 0 30px hsla(187, 100%, 50%, 0.06)",
          transform: `translateY(${-parallaxOffset * 0.5}px)`,
        }}
      >
        <h1 className="font-pixel text-3xl md:text-4xl text-hero-heading mb-2 leading-tight tracking-tight drop-shadow-[0_0_20px_hsl(var(--hero-heading)/0.7)]">
          Hey!
        </h1>
        <h1 className="font-pixel text-3xl md:text-4xl text-hero-heading mb-3 leading-tight tracking-tight drop-shadow-[0_0_20px_hsl(var(--hero-heading)/0.7)]">
          I'm Sakshi
        </h1>

        {/* Typing Animation */}
        <p className="font-pixel text-sm md:text-base mb-6 h-6" style={{ color: "#ff2f6d" }}>
          <span>{roles[roleIndex].substring(0, charIndex)}</span>
          <span
            className="inline-block w-[2px] h-4 ml-0.5 align-middle animate-cursor-blink"
            style={{ backgroundColor: "#ff2f6d" }}
          />
        </p>

        <p className="font-pixel text-sm text-foreground mb-6">
          the mind behind Sakshi Codes.
        </p>
        <p className="font-body text-base text-foreground/90 leading-relaxed mb-4">
          I specialize in AI, Machine Learning, and intelligent systems. Whether
          it's building research-backed models, developing full-stack
          applications, or experimenting with emerging technologies, I'm always
          ready for a challenge.
        </p>
        <p className="font-body text-base text-foreground/90 leading-relaxed mb-8">
          I'm deeply interested in solving real-world problems using data and
          algorithms — and I'm just getting started.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center md:justify-start mb-12">
          <a
            href="#projects"
            className="px-6 py-3 font-body font-semibold text-hero-heading border-2 border-hero-heading rounded-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_hsl(var(--hero-heading)/0.4)]"
          >
            View Projects
          </a>
          <a
            href="#"
            className="px-6 py-3 font-body font-semibold text-hero-heading border-2 border-hero-heading rounded-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_hsl(var(--hero-heading)/0.4)]"
          >
            Download Resume
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-scroll-hint z-10">
        <span className="font-body text-xs text-foreground/60">
          Scroll to explore
        </span>
        <span className="text-hero-heading text-lg">↓</span>
      </div>
    </section>
  );
};

export default HeroSection;
