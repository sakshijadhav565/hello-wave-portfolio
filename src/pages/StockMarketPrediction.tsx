import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import stockHero from "@/assets/stock-hero.png";
import stockHome from "@/assets/stock-home.png";
import stockPredict from "@/assets/stock-predict.png";
import stockResult from "@/assets/stock-result.png";
import stockGraphs from "@/assets/stock-graphs.png";
import stockTicker from "@/assets/stock-ticker.png";

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
    <div className="relative my-12">
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(187,100%,50%) 50%, transparent 100%)",
          opacity: 0.4,
          boxShadow: "0 0 12px hsla(187,100%,50%,0.3)",
        }}
      />
    </div>
  );
}

/* ── Screenshot card with alternating layout ── */
function ScreenshotCard({
  src,
  caption,
  title,
  index,
  delay,
}: {
  src: string;
  caption: string;
  title: string;
  index: number;
  delay: number;
}) {
  const { ref, visible } = useReveal(0.1);
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;
  const tiltDeg = isEven ? -3 : 3;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`mb-20 flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(40px) translateX(${isEven ? "-30px" : "30px"})`,
        transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {/* Image */}
      <div className="flex-1 min-w-0" style={{ perspective: "1200px" }}>
        <div
          className="rounded-xl overflow-hidden transition-all duration-500"
          style={{
            transform: hovered
              ? "rotateY(0deg) scale(1.04)"
              : `rotateY(${tiltDeg}deg) scale(1)`,
            boxShadow: hovered
              ? "0 20px 60px hsla(187,100%,50%,0.35), 0 0 50px hsla(187,100%,50%,0.2)"
              : "0 12px 40px hsla(0,0%,0%,0.7), 0 0 25px hsla(187,100%,50%,0.1)",
            border: `1px solid ${hovered ? "hsla(187,100%,50%,0.6)" : "hsla(187,100%,50%,0.2)"}`,
          }}
        >
          <img src={src} alt={caption} className="w-full block" loading="lazy" />
        </div>
      </div>

      {/* Caption */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4
          className="font-pixel text-sm tracking-wider mb-3"
          style={{
            color: "hsl(187,100%,50%)",
            textShadow: "0 0 16px hsla(187,100%,50%,0.6)",
          }}
        >
          {title}
        </h4>
        <p
          className="font-body text-sm leading-relaxed"
          style={{ color: "hsla(0,0%,100%,0.7)" }}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}

/* ── Heading helper ── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-pixel text-xl tracking-wider mb-6"
      style={{
        color: "hsl(187,100%,50%)",
        textShadow: "0 0 20px hsla(187,100%,50%,0.6), 0 0 40px hsla(187,100%,50%,0.2)",
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
        background: "linear-gradient(180deg, hsl(220,20%,3%) 0%, hsl(210,15%,6%) 25%, hsl(200,12%,4%) 50%, hsl(220,18%,5%) 75%, hsl(220,20%,3%) 100%)",
        opacity: entered ? 1 : 0,
        transition: "opacity 0.6s ease-out",
      }}
    >
      {/* Cursor glow */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          left: cursor.x - 200,
          top: cursor.y - 200,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(187,100%,50%,0.08) 0%, hsla(187,100%,50%,0.03) 40%, transparent 70%)",
          filter: "blur(40px)",
          transition: "left 0.15s ease-out, top 0.15s ease-out",
        }}
      />

      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute"
          style={{
            top: "10%", left: "50%", transform: "translateX(-50%)",
            width: "80%", height: "400px",
            background: "radial-gradient(ellipse, hsla(187,100%,50%,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "45%", left: "20%",
            width: "500px", height: "500px",
            background: "radial-gradient(circle, hsla(187,100%,50%,0.04) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "70%", right: "10%",
            width: "600px", height: "400px",
            background: "radial-gradient(ellipse, hsla(187,100%,50%,0.05) 0%, transparent 65%)",
          }}
        />
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
      <div className="relative w-full h-[55vh] min-h-[400px] mt-4 overflow-hidden">
        <img
          src={stockHero}
          alt="Stock Market Prediction"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Strong dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, hsla(0,0%,0%,0.55) 0%, hsla(0,0%,0%,0.65) 50%, hsl(220,20%,3%) 100%)",
          }}
        />
        {/* Cyan radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 50% 70% at 50% 55%, hsla(187,100%,50%,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1
            className="font-pixel tracking-wider mb-4"
            style={{
              fontSize: "clamp(32px, 6vw, 56px)",
              color: "hsl(0,0%,100%)",
              textShadow: "0 0 40px hsla(187,100%,50%,0.5), 0 0 80px hsla(187,100%,50%,0.2), 0 2px 10px hsla(0,0%,0%,0.8)",
            }}
          >
            Stock Market Prediction
          </h1>
          <p
            className="font-body text-lg md:text-xl"
            style={{
              color: "hsla(187,100%,50%,0.85)",
              textShadow: "0 0 16px hsla(187,100%,50%,0.4)",
            }}
          >
            AI-powered time-series forecasting using LSTM
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 space-y-4">
        {/* Overview */}
        <Section>
          <SectionHeading>Overview</SectionHeading>
          <p className="font-body text-sm leading-relaxed" style={{ color: "hsla(0,0%,100%,0.7)" }}>
            Predicting stock prices is complex due to market volatility. This project uses LSTM (Long Short-Term Memory), a type of Recurrent Neural Network, to analyze time-series data and forecast future trends.
          </p>
        </Section>

        <GlowDivider />

        {/* Goal */}
        <Section delay={0.1}>
          <SectionHeading>Goal</SectionHeading>
          <p className="font-body text-sm leading-relaxed" style={{ color: "hsla(0,0%,100%,0.7)" }}>
            To build a web application that predicts stock prices using real-time API data.
          </p>
        </Section>

        <GlowDivider />

        {/* Tech Stack */}
        <Section delay={0.15}>
          <SectionHeading>Tech Stack</SectionHeading>
          <div
            className="rounded-xl p-6"
            style={{
              background: "hsla(187,100%,50%,0.03)",
              border: "1px solid hsla(187,100%,50%,0.12)",
              boxShadow: "inset 0 0 30px hsla(187,100%,50%,0.04), 0 0 20px hsla(187,100%,50%,0.05)",
            }}
          >
            <div className="flex flex-wrap gap-4">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-body text-xs font-semibold px-4 py-2 rounded-full cursor-default"
                  style={{
                    color: "hsl(187,100%,50%)",
                    border: "1px solid hsla(187,100%,50%,0.35)",
                    background: "hsla(187,100%,50%,0.08)",
                    textShadow: "0 0 8px hsla(187,100%,50%,0.4)",
                    boxShadow: "0 0 12px hsla(187,100%,50%,0.06)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 0 20px hsla(187,100%,50%,0.25), 0 4px 15px hsla(187,100%,50%,0.15)";
                    e.currentTarget.style.borderColor = "hsla(187,100%,50%,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1) translateY(0)";
                    e.currentTarget.style.boxShadow = "0 0 12px hsla(187,100%,50%,0.06)";
                    e.currentTarget.style.borderColor = "hsla(187,100%,50%,0.35)";
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
          <ul className="space-y-3">
            {features.map((f, i) => (
              <li
                key={i}
                className="font-body text-sm flex items-start gap-3"
                style={{ color: "hsla(0,0%,100%,0.7)" }}
              >
                <span style={{ color: "hsl(187,100%,50%)", flexShrink: 0, textShadow: "0 0 8px hsla(187,100%,50%,0.5)" }}>▹</span>
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
                    boxShadow: "0 0 10px hsla(187,100%,50%,0.05)",
                  }}
                >
                  {step}
                </span>
                {i < howItWorks.length - 1 && (
                  <span
                    style={{ color: "hsla(187,100%,50%,0.5)", textShadow: "0 0 8px hsla(187,100%,50%,0.3)" }}
                    className="font-pixel text-xs"
                  >
                    →
                  </span>
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

        {screenshots.map((s, i) => (
          <ScreenshotCard
            key={i}
            src={s.src}
            title={s.title}
            caption={s.caption}
            index={i}
            delay={0.1 * i}
          />
        ))}
      </div>
    </div>
  );
}
