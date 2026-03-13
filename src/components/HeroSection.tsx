import { useState, useEffect } from "react";
import sakshiVideo from "@/assets/sakshi-intro.mp4";

const roles = ["AI Developer", "Machine Learning Engineer", "Problem Solver"];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <section
      id="home"
      className="relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-6 md:px-16 py-16 min-h-[80vh]"
    >
      {/* Illustration / Video */}
      <div className="w-full md:w-[42%] flex justify-center animate-float">
        <video
          src={sakshiVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-w-[450px] rounded-lg shadow-[0_0_30px_hsl(var(--hero-heading)/0.2)]"
        />
      </div>

      {/* Text Content */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="font-pixel text-3xl md:text-4xl text-hero-heading mb-2 leading-tight tracking-tight drop-shadow-[0_0_15px_hsl(var(--hero-heading)/0.5)]">
          Hey!
        </h1>
        <h1 className="font-pixel text-3xl md:text-4xl text-hero-heading mb-3 leading-tight tracking-tight drop-shadow-[0_0_15px_hsl(var(--hero-heading)/0.5)]">
          I'm Sakshi
        </h1>

        {/* Typing Animation */}
        <p className="font-pixel text-sm md:text-base text-primary mb-6 h-6">
          <span>{roles[roleIndex].substring(0, charIndex)}</span>
          <span className="inline-block w-[2px] h-4 bg-primary ml-0.5 animate-pulse align-middle" />
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
        <div className="flex gap-4 justify-center md:justify-start">
          <a
            href="#projects"
            className="px-6 py-3 font-body font-semibold text-hero-heading border-2 border-hero-heading rounded-md transition-all duration-300 hover:bg-hero-heading/10 hover:shadow-[0_0_20px_hsl(var(--hero-heading)/0.4)] hover:scale-105"
          >
            View Projects
          </a>
          <a
            href="#"
            className="px-6 py-3 font-body font-semibold text-hero-heading border-2 border-hero-heading rounded-md transition-all duration-300 hover:bg-hero-heading/10 hover:shadow-[0_0_20px_hsl(var(--hero-heading)/0.4)] hover:scale-105"
          >
            Download Resume
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <span className="font-body text-xs text-foreground/60">
          Scroll to explore
        </span>
        <span className="text-hero-heading text-lg">↓</span>
      </div>
    </section>
  );
};

export default HeroSection;
