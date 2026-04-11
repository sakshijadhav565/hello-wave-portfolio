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
      className="relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-6 md:px-16 pt-16 pb-28 min-h-[85vh]"
    >
      {/* Illustration / Video */}
      <div className="w-full md:w-[42%] flex justify-center animate-float">
        <video
          src={sakshiVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-w-[450px] rounded-lg"
        />
      </div>

      {/* Text Content */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="font-pixel text-3xl md:text-4xl text-hero-heading mb-2 leading-tight tracking-tight">
          Hey!
        </h1>
        <h1 className="font-pixel text-3xl md:text-4xl text-hero-heading mb-3 leading-tight tracking-tight">
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

        <p className="font-pixel text-xs text-foreground mb-6">
          the mind behind Sakshi Codes.
        </p>
        <p className="font-pixel text-[9px] text-foreground/90 leading-relaxed mb-4">
          I specialize in AI, Machine Learning, and intelligent systems. Whether
          it's building research-backed models, developing full-stack
          applications, or experimenting with emerging technologies, I'm always
          ready for a challenge.
        </p>
        <p className="font-pixel text-[9px] text-foreground/90 leading-relaxed mb-8">
          I'm deeply interested in solving real-world problems using data and
          algorithms — and I'm just getting started.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center md:justify-start mb-12">
          <a
            href="#projects"
            className="px-6 py-3 font-pixel text-[9px] font-semibold text-hero-heading border-2 border-hero-heading rounded-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_hsla(340,100%,59%,0.5)]"
          >
            View Projects
          </a>
          <a
            href="#"
            className="px-6 py-3 font-pixel text-[9px] font-semibold text-hero-heading border-2 border-hero-heading rounded-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_hsla(340,100%,59%,0.5)]"
          >
            Download Resume
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-scroll-hint">
        <span className="font-pixel text-[8px] text-foreground/60">
          Scroll to explore
        </span>
        <span className="text-hero-heading text-lg">↓</span>
      </div>
    </section>
  );
};

export default HeroSection;
