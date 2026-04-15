import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import stockHero from "@/assets/stock-hero.png";
import stockHome from "@/assets/stock-home.png";
import stockPredict from "@/assets/stock-predict.png";
import stockResult from "@/assets/stock-result.png";
import stockGraphs from "@/assets/stock-graphs.png";
import stockTicker from "@/assets/stock-ticker.png";

/* ── Floating particles canvas ── */
function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; speed: number; opacity: number; drift: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        drift: (Math.random() - 0.5) * 0.3,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(187, 100%, 50%, ${p.opacity})`;
        ctx.shadowColor = `hsla(187, 100%, 50%, ${p.opacity * 0.6})`;
        ctx.shadowBlur = p.r * 4;
        ctx.fill();
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
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
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ── Cursor glow hook ── */
function useCursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

/* ── Scroll reveal hook ── */
function useReveal(threshold = 0.15) {
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

/* ── Parallax hook ── */
function useParallax(speed = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handler = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      setOffset((center - viewCenter) * speed);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [speed]);
  return { ref, offset };
}

/* ── Section wrapper ── */
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Divider ── */
function GlowDivider() {
  return (
    <div className="relative my-16">
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(187,100%,50%) 50%, transparent 100%)",
          opacity: 0.5,
          boxShadow: "0 0 20px hsla(187,100%,50%,0.4), 0 0 40px hsla(187,100%,50%,0.15)",
        }}
      />
    </div>
  );
}

/* ── Screenshot card with parallax + floating ── */
function ScreenshotCard({
  src,
  caption,
  title,
  index,
  delay,
  cursorX,
  cursorY,
}: {
  src: string;
  caption: string;
  title: string;
  index: number;
  delay: number;
  cursorX: number;
  cursorY: number;
}) {
  const { ref, visible } = useReveal(0.1);
  const parallax = useParallax(0.08);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  const tiltDeg = isEven ? -3 : 3;
  const verticalOffset = index % 3 === 0 ? 0 : index % 3 === 1 ? 20 : -15;

  // Floating animation phase
  const floatKeyframes = `@keyframes float-${index} {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-${6 + (index % 3) * 2}px); }
  }`;

  // Magnetic glow near cursor
  const [magneticGlow, setMagneticGlow] = useState(0);
  useEffect(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((cursorX - cx) ** 2 + (cursorY - cy) ** 2);
    const intensity = Math.max(0, 1 - dist / 400);
    setMagneticGlow(intensity);
  }, [cursorX, cursorY]);

  return (
    <>
      <style>{floatKeyframes}</style>
      <div
        ref={(el) => {
          (ref as any).current = el;
          (parallax.ref as any).current = el;
          (cardRef as any).current = el;
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`mb-12 flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-6`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? `translateY(${verticalOffset}px)`
            : `translateY(50px) translateX(${isEven ? "-40px" : "40px"})`,
          transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
          marginTop: index === 0 ? 0 : `${20 + (index % 3) * 15}px`,
        }}
      >
        {/* Image — 65% width */}
        <div
          className="w-full md:w-[65%] flex-shrink-0"
          style={{
            perspective: "1000px",
            animation: `float-${index} ${4 + index * 0.5}s ease-in-out infinite`,
          }}
        >
          {/* Radial glow behind */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "120%",
              height: "120%",
              top: "-10%",
              left: isEven ? "-15%" : "5%",
              background: `radial-gradient(ellipse at ${isEven ? "60%" : "40%"} 50%, hsla(187,100%,50%,${0.08 + magneticGlow * 0.12}) 0%, transparent 70%)`,
              filter: "blur(30px)",
              transition: "all 0.3s ease",
            }}
          />
          <div
            className="rounded-xl overflow-hidden transition-all duration-500 relative"
            style={{
              transform: hovered
                ? "rotateY(0deg) rotateX(0deg) scale(1.05)"
                : `rotateY(${tiltDeg}deg) rotateX(2deg) scale(1)`,
              transformOrigin: isEven ? "left center" : "right center",
              boxShadow: hovered
                ? `0 30px 80px hsla(187,100%,50%,0.4), 0 0 60px hsla(187,100%,50%,0.25), ${isEven ? "-8px" : "8px"} 0 30px hsla(187,100%,50%,0.2)`
                : `0 20px 60px hsla(0,0%,0%,0.8), 0 0 30px hsla(187,100%,50%,${0.1 + magneticGlow * 0.15}), ${isEven ? "-6px" : "6px"} 0 20px hsla(187,100%,50%,0.08)`,
              border: `1.5px solid hsla(187,100%,50%,${hovered ? 0.7 : 0.25 + magneticGlow * 0.2})`,
            }}
          >
            <img src={src} alt={caption} className="w-full block" loading="lazy" />
            {/* Directional light overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(${isEven ? "135deg" : "225deg"}, hsla(187,100%,80%,${hovered ? 0.08 : 0.03}) 0%, transparent 50%)`,
                transition: "all 0.5s ease",
              }}
            />
          </div>
        </div>

        {/* Caption — narrower */}
        <div className="flex-1 min-w-0 flex flex-col justify-center md:max-w-[30%]">
          <h4
            className="font-pixel text-sm tracking-wider mb-3"
            style={{
              color: "hsl(187,100%,50%)",
              textShadow: "0 0 20px hsla(187,100%,50%,0.7), 0 0 40px hsla(187,100%,50%,0.3)",
              fontSize: "14px",
            }}
          >
            {title}
          </h4>
          <p
            className="font-body text-sm leading-[1.8]"
            style={{ color: "hsla(0,0%,100%,0.7)" }}
          >
            {caption}
          </p>
        </div>
      </div>
    </>
  );
}

/* ── Heading helper ── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-pixel text-2xl tracking-wider mb-8"
      style={{
        color: "hsl(187,100%,50%)",
        textShadow: "0 0 25px hsla(187,100%,50%,0.7), 0 0 50px hsla(187,100%,50%,0.3), 0 0 80px hsla(187,100%,50%,0.1)",
      }}
    >
      {children}
    </h3>
  );
}

/* ── Main page ── */
export default function StockMarketPrediction() {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  const cursor = useCursorGlow();

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => setEntered(true));
  }, []);

  const techStack = [
    "Python", "LSTM", "TensorFlow", "Pandas", "Django", "JavaScript", "SQLite", "Yahoo Finance API",
  ];

  const features = [
    "Real-time stock data visualization",
    "LSTM-based prediction",
    "Interactive charts",
    "QR code generation",
    "Stock ticker exploration",
  ];

  const howItWorks = [
    "Fetch stock data via API",
    "Process time-series data",
    "LSTM learns patterns",
    "Predict future prices",
    "Display results with graphs",
  ];

  const screenshots = [
    { src: stockHome, title: "Dashboard Overview", caption: "The Home page displays real-time stock price data with interactive charts and multiple stock comparisons." },
    { src: stockPredict, title: "Prediction Input", caption: "To predict stock price, users enter a valid ticker value and number of days, then click the predict button." },
    { src: stockResult, title: "Prediction Results + QR", caption: "Displays the predicted stock price along with searched ticker details and generates a unique QR code to view the predicted result." },
    { src: stockGraphs, title: "Graph Analysis", caption: "The left graph shows real-time stock price for the past 1 day, while the right graph shows predicted stock prices for the selected duration." },
    { src: stockTicker, title: "Ticker Information", caption: "Displays details of all valid stock tickers accepted by the application." },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(220,20%,3%) 0%, hsl(210,18%,7%) 20%, hsl(200,15%,5%) 40%, hsl(195,20%,6%) 60%, hsl(210,18%,4%) 80%, hsl(220,20%,3%) 100%)",
        opacity: entered ? 1 : 0,
        transition: "opacity 0.6s ease-out",
      }}
    >
      <ParticlesCanvas />

      {/* Cursor glow */}
      <div
        className="fixed pointer-events-none z-[2]"
        style={{
          left: cursor.x - 250,
          top: cursor.y - 250,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(187,100%,50%,0.12) 0%, hsla(187,100%,50%,0.05) 30%, transparent 65%)",
          filter: "blur(30px)",
          transition: "left 0.12s ease-out, top 0.12s ease-out",
        }}
      />

      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute" style={{ top: "8%", left: "50%", transform: "translateX(-50%)", width: "90%", height: "500px", background: "radial-gradient(ellipse, hsla(187,100%,50%,0.08) 0%, transparent 65%)" }} />
        <div className="absolute" style={{ top: "35%", left: "10%", width: "600px", height: "600px", background: "radial-gradient(circle, hsla(187,100%,50%,0.06) 0%, transparent 55%)" }} />
        <div className="absolute" style={{ top: "55%", right: "5%", width: "700px", height: "500px", background: "radial-gradient(ellipse, hsla(187,100%,50%,0.07) 0%, transparent 60%)" }} />
        <div className="absolute" style={{ top: "80%", left: "30%", width: "500px", height: "400px", background: "radial-gradient(circle, hsla(187,100%,50%,0.05) 0%, transparent 60%)" }} />
      </div>

      {/* Back button */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate("/")}
          className="font-pixel text-[11px] tracking-wider flex items-center gap-2 transition-all duration-300 hover:gap-3"
          style={{
            color: "hsl(187,100%,50%)",
            textShadow: "0 0 10px hsla(187,100%,50%,0.4)",
          }}
        >
          <ArrowLeft size={14} /> Back to Projects
        </button>
      </div>

      {/* Hero */}
      <div className="relative w-full h-[60vh] min-h-[420px] mt-4 overflow-hidden">
        <img src={stockHero} alt="Stock Market Prediction" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsla(0,0%,0%,0.6) 0%, hsla(0,0%,0%,0.7) 50%, hsl(220,20%,3%) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 70% at 50% 55%, hsla(187,100%,50%,0.15) 0%, transparent 70%)" }} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1
            className="font-pixel tracking-wider mb-4"
            style={{
              fontSize: "clamp(36px, 7vw, 64px)",
              color: "hsl(0,0%,100%)",
              textShadow: "0 0 50px hsla(187,100%,50%,0.6), 0 0 100px hsla(187,100%,50%,0.25), 0 2px 10px hsla(0,0%,0%,0.9)",
            }}
          >
            Stock Market Prediction
          </h1>
          <p
            className="font-body text-xl md:text-2xl"
            style={{
              color: "hsla(187,100%,50%,0.9)",
              textShadow: "0 0 20px hsla(187,100%,50%,0.5)",
            }}
          >
            AI-powered time-series forecasting using LSTM
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 space-y-6">
        {/* Overview */}
        <Section>
          <SectionHeading>Overview</SectionHeading>
          <p className="font-body text-sm leading-[1.9] max-w-2xl" style={{ color: "hsla(0,0%,100%,0.7)" }}>
            Predicting stock prices is complex due to market volatility. This project uses LSTM (Long Short-Term Memory), a type of Recurrent Neural Network, to analyze time-series data and forecast future trends.
          </p>
        </Section>

        <GlowDivider />

        {/* Goal */}
        <Section delay={0.1}>
          <SectionHeading>Goal</SectionHeading>
          <p className="font-body text-sm leading-[1.9] max-w-2xl" style={{ color: "hsla(0,0%,100%,0.7)" }}>
            To build a web application that predicts stock prices using real-time API data.
          </p>
        </Section>

        <GlowDivider />

        {/* Tech Stack */}
        <Section delay={0.15}>
          <SectionHeading>Tech Stack</SectionHeading>
          <div
            className="rounded-xl p-8"
            style={{
              background: "linear-gradient(135deg, hsla(187,100%,50%,0.04) 0%, hsla(187,100%,50%,0.02) 100%)",
              border: "1px solid hsla(187,100%,50%,0.15)",
              boxShadow: "inset 0 0 40px hsla(187,100%,50%,0.05), 0 0 30px hsla(187,100%,50%,0.06)",
            }}
          >
            <div className="flex flex-wrap gap-5">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-body text-xs font-semibold px-5 py-2.5 rounded-full cursor-default transition-all duration-300 hover:scale-105"
                  style={{
                    color: "hsl(187,100%,50%)",
                    border: "1px solid hsla(187,100%,50%,0.35)",
                    background: "hsla(187,100%,50%,0.08)",
                    textShadow: "0 0 10px hsla(187,100%,50%,0.5)",
                    boxShadow: "0 0 15px hsla(187,100%,50%,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 25px hsla(187,100%,50%,0.3), 0 4px 20px hsla(187,100%,50%,0.2)";
                    e.currentTarget.style.borderColor = "hsla(187,100%,50%,0.7)";
                    e.currentTarget.style.background = "hsla(187,100%,50%,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 15px hsla(187,100%,50%,0.08)";
                    e.currentTarget.style.borderColor = "hsla(187,100%,50%,0.35)";
                    e.currentTarget.style.background = "hsla(187,100%,50%,0.08)";
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Section>

        <GlowDivider />

        {/* Key Features */}
        <Section delay={0.2}>
          <SectionHeading>Key Features</SectionHeading>
          <ul className="space-y-4 max-w-2xl">
            {features.map((f, i) => (
              <li key={i} className="font-body text-sm flex items-start gap-3" style={{ color: "hsla(0,0%,100%,0.7)" }}>
                <span style={{ color: "hsl(187,100%,50%)", flexShrink: 0, textShadow: "0 0 10px hsla(187,100%,50%,0.6)" }}>▹</span>
                {f}
              </li>
            ))}
          </ul>
        </Section>

        <GlowDivider />

        {/* How It Works */}
        <Section delay={0.25}>
          <SectionHeading>How It Works</SectionHeading>
          <div className="flex flex-wrap gap-4 items-center">
            {howItWorks.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <span
                  className="font-body text-xs px-4 py-2 rounded-lg"
                  style={{
                    color: "hsla(0,0%,100%,0.8)",
                    background: "hsla(187,100%,50%,0.06)",
                    border: "1px solid hsla(187,100%,50%,0.2)",
                    boxShadow: "0 0 12px hsla(187,100%,50%,0.06)",
                  }}
                >
                  {step}
                </span>
                {i < howItWorks.length - 1 && (
                  <span style={{ color: "hsla(187,100%,50%,0.5)", textShadow: "0 0 8px hsla(187,100%,50%,0.3)" }} className="font-pixel text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </Section>

        <GlowDivider />

        {/* Screenshots */}
        <Section delay={0.3}>
          <SectionHeading>Screenshots</SectionHeading>
        </Section>

        <div className="mt-8">
          {screenshots.map((s, i) => (
            <ScreenshotCard
              key={i}
              src={s.src}
              title={s.title}
              caption={s.caption}
              index={i}
              delay={0.1 * i}
              cursorX={cursor.x}
              cursorY={cursor.y}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
