import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import stockHero from "@/assets/stock-hero.png";
import stockHome from "@/assets/stock-home.png";
import stockPredict from "@/assets/stock-predict.png";
import stockResult from "@/assets/stock-result.png";
import stockGraphs from "@/assets/stock-graphs.png";
import stockTicker from "@/assets/stock-ticker.png";

/* ── Floating particles canvas (subtle, depth varied) ── */
function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; speed: number; opacity: number; drift: number; hue: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        speed: Math.random() * 0.25 + 0.08,
        opacity: Math.random() * 0.4 + 0.08,
        drift: (Math.random() - 0.5) * 0.25,
        hue: Math.random() > 0.5 ? 187 : 175, // mix cyan + teal
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.opacity})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, ${p.opacity * 0.5})`;
        ctx.shadowBlur = p.r * 3;
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
      style={{ opacity: 0.55 }}
    />
  );
}

/* ── Heartbeat / pulse SVG line in background ── */
function HeartbeatBackground() {
  return (
    <svg
      className="absolute inset-x-0 pointer-events-none"
      style={{ top: "30%", width: "100%", height: "180px", opacity: 0.08 }}
      viewBox="0 0 1200 180"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="hbGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="hsla(187,100%,50%,0)" />
          <stop offset="50%" stopColor="hsla(187,100%,55%,1)" />
          <stop offset="100%" stopColor="hsla(175,100%,50%,0)" />
        </linearGradient>
      </defs>
      <path
        d="M0,90 L200,90 L240,90 L260,40 L280,140 L300,60 L320,90 L500,90 L540,90 L560,30 L580,150 L600,70 L620,90 L900,90 L940,90 L960,50 L980,130 L1000,90 L1200,90"
        fill="none"
        stroke="url(#hbGrad)"
        strokeWidth="1.5"
        style={{
          filter: "drop-shadow(0 0 6px hsla(187,100%,50%,0.6))",
          strokeDasharray: 2400,
          strokeDashoffset: 2400,
          animation: "hbDraw 12s linear infinite",
        }}
      />
      <style>{`
        @keyframes hbDraw {
          0% { stroke-dashoffset: 2400; }
          60% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -2400; }
        }
      `}</style>
    </svg>
  );
}

/* ── Cursor trail ── */
function useCursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

/* ── Scroll reveal ── */
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

/* ── Glow divider ── */
function GlowDivider() {
  return (
    <div className="relative my-12">
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsla(187,100%,50%,0.5) 50%, transparent 100%)",
          opacity: 0.35,
          boxShadow: "0 0 12px hsla(187,100%,50%,0.18)",
        }}
      />
    </div>
  );
}

/* ── Subtle side visual: faint stock-line SVG to balance text-only sections ── */
function SideStockLine({ side = "right" }: { side?: "left" | "right" }) {
  return (
    <div
      className="hidden md:block absolute top-1/2 -translate-y-1/2 pointer-events-none select-none"
      style={{
        [side]: "0",
        width: "38%",
        height: "180px",
        opacity: 0.08,
      } as React.CSSProperties}
    >
      <svg viewBox="0 0 400 180" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id={`side-${side}`} x1="0" x2="1">
            <stop offset="0%" stopColor="hsla(187,100%,55%,0)" />
            <stop offset="50%" stopColor="hsla(187,100%,55%,1)" />
            <stop offset="100%" stopColor="hsla(175,100%,55%,0)" />
          </linearGradient>
        </defs>
        {/* faint grid */}
        {[0, 45, 90, 135, 180].map((y) => (
          <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="hsla(187,100%,50%,0.18)" strokeWidth="0.5" />
        ))}
        <path
          d="M0,120 L40,110 L70,118 L100,80 L130,95 L160,60 L190,75 L220,40 L250,55 L280,30 L310,48 L340,25 L370,42 L400,18"
          fill="none"
          stroke={`url(#side-${side})`}
          strokeWidth="1.5"
          style={{ filter: "drop-shadow(0 0 6px hsla(187,100%,50%,0.5))" }}
        />
      </svg>
    </div>
  );
}

/* ── Section heading ── */
function SectionHeading({ children, kicker }: { children: React.ReactNode; kicker?: string }) {
  return (
    <div className="mb-8">
      {kicker && (
        <div
          className="font-pixel text-[10px] tracking-[0.3em] mb-3"
          style={{ color: "hsla(175,100%,55%,0.7)" }}
        >
          {kicker}
        </div>
      )}
      <h3
        className="font-pixel text-2xl tracking-wider"
        style={{
          color: "hsl(187,100%,55%)",
          textShadow: "0 0 18px hsla(187,100%,50%,0.45), 0 0 36px hsla(187,100%,50%,0.18)",
        }}
      >
        {children}
      </h3>
    </div>
  );
}

/* ── Body paragraph ── */
function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-body text-[15px] leading-[1.95] max-w-[640px]"
      style={{ color: "hsla(0,0%,100%,0.72)" }}
    >
      {children}
    </p>
  );
}

/* ── Showcase screenshot card ── */
function ShowcaseCard({
  src,
  title,
  caption,
  index,
  cursorX,
  cursorY,
}: {
  src: string;
  title: string;
  caption: string;
  index: number;
  cursorX: number;
  cursorY: number;
}) {
  const { ref, visible } = useReveal(0.1);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  const tiltDeg = isEven ? -3 : 3;

  // Alternating: index 0 → image right (md:flex-row-reverse), index 1 → image left (md:flex-row), etc.
  const imageRight = index % 2 === 0;

  const floatKeyframes = `@keyframes float-${index} {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-${4 + (index % 3) * 2}px); }
  }`;

  const [magneticGlow, setMagneticGlow] = useState(0);
  useEffect(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((cursorX - cx) ** 2 + (cursorY - cy) ** 2);
    const intensity = Math.max(0, 1 - dist / 450);
    setMagneticGlow(intensity);
  }, [cursorX, cursorY]);

  return (
    <>
      <style>{floatKeyframes}</style>
      <div
        ref={(el) => {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex flex-col ${imageRight ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-14`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0)"
            : `translateY(40px) translateX(${imageRight ? "30px" : "-30px"})`,
          transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${0.08 * index}s`,
          position: "relative",
        }}
      >
        {/* Image side — 60% width */}
        <div
          className="w-full md:w-[60%] flex-shrink-0 relative"
          style={{
            perspective: "1000px",
            animation: `float-${index} ${5 + index * 0.3}s ease-in-out infinite`,
          }}
        >
          {/* Soft radial glow behind */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "110%",
              height: "110%",
              top: "-5%",
              left: "-5%",
              background: `radial-gradient(ellipse at center, hsla(187,100%,50%,${0.05 + magneticGlow * 0.06}) 0%, transparent 65%)`,
              filter: "blur(28px)",
              transition: "all 0.4s ease",
              zIndex: 0,
            }}
          />
          <div
            className="rounded-xl overflow-hidden transition-all duration-500 relative"
            style={{
              transform: hovered
                ? "rotateY(0deg) rotateX(0deg) scale(1.04)"
                : `perspective(1000px) rotateX(2deg) rotate(${tiltDeg}deg) scale(1)`,
              transformOrigin: "center center",
              boxShadow: hovered
                ? "0 25px 70px hsla(187,100%,50%,0.16), 0 0 35px hsla(187,100%,50%,0.12)"
                : `0 20px 60px hsla(187,100%,50%,0.12), 0 10px 30px hsla(0,0%,0%,0.55)`,
              border: `1px solid hsla(187,100%,55%,${hovered ? 0.4 : 0.15 + magneticGlow * 0.1})`,
            }}
          >
            <img src={src} alt={caption} className="w-full block" loading="lazy" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(${imageRight ? "225deg" : "135deg"}, hsla(187,100%,80%,${hovered ? 0.05 : 0.02}) 0%, transparent 50%)`,
                transition: "all 0.5s ease",
              }}
            />
          </div>
        </div>

        {/* Caption */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div
            className="font-pixel text-[10px] tracking-[0.25em] mb-2"
            style={{ color: "hsla(175,100%,55%,0.65)" }}
          >
            0{index + 1}
          </div>
          <h4
            className="font-pixel tracking-wider mb-3"
            style={{
              color: "hsl(187,100%,60%)",
              textShadow: "0 0 12px hsla(187,100%,50%,0.35)",
              fontSize: "13px",
            }}
          >
            {title}
          </h4>
          <p
            className="font-body text-sm leading-[1.85]"
            style={{ color: "hsla(0,0%,100%,0.72)" }}
          >
            {caption}
          </p>
        </div>
      </div>
    </>
  );
}

/* ── Main page ── */
export default function StockMarketPrediction() {
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
    { title: "Real-time stock visualization", desc: "Displays live stock trends with interactive charts" },
    { title: "LSTM-based prediction", desc: "Captures temporal dependencies for better accuracy" },
    { title: "Prediction with custom inputs", desc: "Users can enter ticker + duration" },
    { title: "QR code generation", desc: "Quick access to prediction results" },
    { title: "Ticker information system", desc: "Displays supported stock symbols" },
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

  const metrics = [
    { value: "+120%", label: "Prediction Accuracy" },
    { value: "+35%", label: "Model Performance" },
    { value: "2×", label: "Faster Processing" },
    { value: "Real-time", label: "Data Integration" },
  ];

  const learnings = [
    "Designing time-series pipelines for noisy financial data",
    "Tuning LSTM depth, sequence length, and dropout for stability",
    "Bridging ML inference with a responsive web UI",
    "Communicating model outputs through clear, interactive visuals",
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(220,20%,3%) 0%, hsl(210,18%,6%) 20%, hsl(200,15%,5%) 40%, hsl(195,18%,6%) 60%, hsl(210,18%,4%) 80%, hsl(220,20%,3%) 100%)",
        opacity: entered ? 1 : 0,
        transition: "opacity 0.6s ease-out",
      }}
    >
      <ParticlesCanvas />

      {/* Cursor trail glow */}
      <div
        className="fixed pointer-events-none z-[2]"
        style={{
          left: cursor.x - 220,
          top: cursor.y - 220,
          width: 440,
          height: 440,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(187,100%,55%,0.10) 0%, hsla(175,100%,50%,0.04) 35%, transparent 65%)",
          filter: "blur(28px)",
          transition: "left 0.14s ease-out, top 0.14s ease-out",
        }}
      />

      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute" style={{ top: "8%", left: "50%", transform: "translateX(-50%)", width: "90%", height: "500px", background: "radial-gradient(ellipse, hsla(187,100%,50%,0.07) 0%, transparent 65%)" }} />
        <div className="absolute" style={{ top: "30%", left: "8%", width: "560px", height: "560px", background: "radial-gradient(circle, hsla(175,100%,50%,0.05) 0%, transparent 55%)" }} />
        <div className="absolute" style={{ top: "55%", right: "5%", width: "680px", height: "500px", background: "radial-gradient(ellipse, hsla(187,100%,50%,0.06) 0%, transparent 60%)" }} />
        <div className="absolute" style={{ top: "78%", left: "30%", width: "500px", height: "400px", background: "radial-gradient(circle, hsla(175,100%,50%,0.04) 0%, transparent 60%)" }} />
        <HeartbeatBackground />
      </div>

      {/* Back button */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 pt-8">
        <a
          href="/#projects"
          className="font-pixel text-[11px] tracking-wider inline-flex items-center gap-2 transition-all duration-300 hover:gap-3"
          style={{
            color: "hsl(187,100%,55%)",
            textShadow: "0 0 10px hsla(187,100%,50%,0.35)",
          }}
        >
          <ArrowLeft size={14} /> Back to Projects
        </a>
      </div>

      {/* Hero */}
      <div className="relative w-full h-[60vh] min-h-[420px] mt-4 overflow-hidden">
        <img src={stockHero} alt="Stock Market Prediction" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsla(0,0%,0%,0.65) 0%, hsla(0,0%,0%,0.7) 50%, hsl(220,20%,3%) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 70% at 50% 55%, hsla(187,100%,50%,0.12) 0%, transparent 70%)" }} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1
            className="font-pixel tracking-wider mb-4"
            style={{
              fontSize: "clamp(36px, 7vw, 64px)",
              color: "hsl(0,0%,100%)",
              textShadow: "0 0 40px hsla(187,100%,55%,0.55), 0 0 80px hsla(187,100%,50%,0.2), 0 2px 10px hsla(0,0%,0%,0.9)",
            }}
          >
            Stock Market Prediction
          </h1>
          <p
            className="font-body text-xl md:text-2xl"
            style={{
              color: "hsla(187,100%,70%,0.9)",
              textShadow: "0 0 16px hsla(187,100%,50%,0.4)",
            }}
          >
            AI-powered time-series forecasting using LSTM
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* TECH STACK — Quick Info, near top */}
        <Section>
          <SectionHeading kicker="QUICK INFO">Tech Stack</SectionHeading>
          <div
            className="rounded-xl p-7"
            style={{
              background: "linear-gradient(135deg, hsla(187,100%,50%,0.03) 0%, hsla(175,100%,50%,0.02) 100%)",
              border: "1px solid hsla(187,100%,50%,0.12)",
              boxShadow: "inset 0 0 30px hsla(187,100%,50%,0.03)",
            }}
          >
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-body text-xs font-semibold px-4 py-2 rounded-full cursor-default transition-all duration-300 hover:scale-105"
                  style={{
                    color: "hsl(187,100%,65%)",
                    border: "1px solid hsla(187,100%,55%,0.25)",
                    background: "hsla(187,100%,50%,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "hsla(187,100%,55%,0.5)";
                    e.currentTarget.style.background = "hsla(187,100%,50%,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "hsla(187,100%,55%,0.25)";
                    e.currentTarget.style.background = "hsla(187,100%,50%,0.05)";
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Section>

        <GlowDivider />

        {/* OVERVIEW */}
        <Section delay={0.05}>
          <div className="relative">
            <SideStockLine side="right" />
            <SectionHeading kicker="01 — OVERVIEW">Overview</SectionHeading>
            <BodyText>
              Stock price prediction is inherently complex due to market volatility and rapidly changing trends.
              This project uses an LSTM (Long Short-Term Memory) model to analyze time-series data and generate
              accurate short-term forecasts. The system combines machine learning with real-time data
              visualization to create an interactive and insightful user experience.
            </BodyText>
          </div>
        </Section>

        <GlowDivider />

        {/* PROBLEM */}
        <Section delay={0.05}>
          <div className="relative md:pl-[40%]">
            <SideStockLine side="left" />
            <SectionHeading kicker="02 — PROBLEM">Problem</SectionHeading>
            <BodyText>
              Traditional prediction methods struggle to capture temporal dependencies in stock data, leading to
              inconsistent results. Users also lack intuitive tools to explore predictions and understand trends
              in real time. There is a need for a system that is both technically robust and visually interactive.
            </BodyText>
          </div>
        </Section>

        <GlowDivider />

        {/* SOLUTION */}
        <Section delay={0.05}>
          <div className="relative">
            <SideStockLine side="right" />
            <SectionHeading kicker="03 — APPROACH">Solution / Approach</SectionHeading>
            <BodyText>
              To address this, an LSTM-based model was implemented to learn patterns from historical stock data.
              The data is preprocessed into time-series sequences and normalized before being fed into the model.
              Real-time API integration ensures that predictions remain dynamic and relevant.
            </BodyText>
          </div>
        </Section>

        <GlowDivider />

        {/* HOW IT WORKS */}
        <Section delay={0.05}>
          <SectionHeading kicker="04 — PROCESS">How It Works</SectionHeading>
          <BodyText>
            The system fetches real-time stock data through APIs and processes it into structured time-series
            inputs. The LSTM model analyzes historical patterns and generates predictions for future values.
            Results are then displayed using interactive charts, allowing users to easily interpret trends
            and insights.
          </BodyText>

          <div className="flex flex-wrap gap-3 items-center mt-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="font-body text-xs px-4 py-2 rounded-lg"
                  style={{
                    color: "hsla(0,0%,100%,0.85)",
                    background: "hsla(187,100%,50%,0.04)",
                    border: "1px solid hsla(187,100%,55%,0.15)",
                  }}
                >
                  {step}
                </span>
                {i < howItWorks.length - 1 && (
                  <span style={{ color: "hsla(175,100%,55%,0.45)" }} className="font-pixel text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </Section>

        <GlowDivider />

        {/* KEY FEATURES */}
        <Section delay={0.05}>
          <SectionHeading kicker="05 — FEATURES">Key Features</SectionHeading>
          <ul className="space-y-5 max-w-2xl">
            {features.map((f, i) => (
              <li key={i} className="font-body text-sm flex items-start gap-3" style={{ color: "hsla(0,0%,100%,0.78)" }}>
                <span style={{ color: "hsl(187,100%,55%)", flexShrink: 0, textShadow: "0 0 8px hsla(187,100%,50%,0.4)" }}>▹</span>
                <span>
                  <span className="font-semibold" style={{ color: "hsla(0,0%,100%,0.95)" }}>{f.title}</span>
                  <span style={{ color: "hsla(0,0%,100%,0.55)" }}> — {f.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <GlowDivider />

        {/* PRODUCT SHOWCASE */}
        <Section delay={0.05}>
          <SectionHeading kicker="06 — PRODUCT SHOWCASE">Product Showcase</SectionHeading>
        </Section>

        <div className="mt-10 space-y-20">
          {screenshots.map((s, i) => (
            <ShowcaseCard
              key={i}
              src={s.src}
              title={s.title}
              caption={s.caption}
              index={i}
              cursorX={cursor.x}
              cursorY={cursor.y}
            />
          ))}
        </div>

        <GlowDivider />

        {/* RESULTS / IMPACT */}
        <Section delay={0.05}>
          <div className="mb-10 text-center">
            <div
              className="font-pixel text-[10px] tracking-[0.3em] mb-3"
              style={{ color: "hsla(175,100%,55%,0.6)" }}
            >
              07 — RESULTS / IMPACT
            </div>
            <h3
              className="font-pixel text-2xl tracking-wider"
              style={{ color: "hsla(0,0%,100%,0.95)" }}
            >
              Results / Impact
            </h3>
          </div>

          <div
            className="rounded-2xl py-14 px-8"
            style={{
              background: "linear-gradient(135deg, hsla(220,20%,5%,0.6) 0%, hsla(195,15%,8%,0.5) 100%)",
              border: "1px solid hsla(187,100%,50%,0.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {metrics.map((m, i) => (
                <div key={i} className="text-center">
                  <div
                    className="font-pixel mb-3"
                    style={{
                      fontSize: "clamp(28px, 4vw, 44px)",
                      color: "hsla(0,0%,100%,0.95)",
                      textShadow: "0 0 20px hsla(187,100%,50%,0.18)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {m.value}
                  </div>
                  <div
                    className="font-body text-xs uppercase tracking-[0.18em]"
                    style={{ color: "hsla(175,100%,65%,0.7)" }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <GlowDivider />

        {/* LEARNINGS */}
        <Section delay={0.05}>
          <SectionHeading kicker="08 — LEARNINGS">Learnings</SectionHeading>
          <ul className="space-y-4 max-w-2xl">
            {learnings.map((l, i) => (
              <li key={i} className="font-body text-sm flex items-start gap-3" style={{ color: "hsla(0,0%,100%,0.72)" }}>
                <span style={{ color: "hsla(175,100%,55%,0.85)", flexShrink: 0 }}>✦</span>
                {l}
              </li>
            ))}
          </ul>
        </Section>

        <GlowDivider />

        {/* MORE PROJECTS */}
        <Section delay={0.05}>
          <SectionHeading kicker="09 — EXPLORE">More Projects</SectionHeading>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-3 font-body text-sm group"
            style={{
              color: "hsl(187,100%,65%)",
            }}
          >
            <span
              className="px-6 py-3 rounded-full transition-all duration-300 group-hover:gap-4 inline-flex items-center gap-2"
              style={{
                border: "1px solid hsla(187,100%,55%,0.3)",
                background: "hsla(187,100%,50%,0.05)",
              }}
            >
              View all projects <ArrowRight size={16} />
            </span>
          </Link>
        </Section>
      </div>
    </div>
  );
}
