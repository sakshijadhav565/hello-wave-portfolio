import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import stockHero from "@/assets/stock-hero.png";
import stockHome from "@/assets/stock-home.png";
import stockPredict from "@/assets/stock-predict.png";
import stockResult from "@/assets/stock-result.png";
import stockGraphs from "@/assets/stock-graphs.png";
import stockTicker from "@/assets/stock-ticker.png";

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

/* ── Screenshot card ── */
function ScreenshotCard({
  src,
  caption,
  tiltDir,
  delay,
}: {
  src: string;
  caption: string;
  tiltDir: "left" | "right";
  delay: number;
}) {
  const { ref, visible } = useReveal(0.1);
  const [hovered, setHovered] = useState(false);
  const baseRotate = tiltDir === "left" ? -3 : 3;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="mb-16"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      <div
        className="relative mx-auto max-w-3xl"
        style={{
          perspective: "1200px",
        }}
      >
        <div
          className="rounded-xl overflow-hidden transition-all duration-500"
          style={{
            transform: hovered
              ? "rotateY(0deg) scale(1.03)"
              : `rotateY(${baseRotate}deg) scale(1)`,
            boxShadow: hovered
              ? "0 20px 60px hsla(187,100%,50%,0.3), 0 0 40px hsla(187,100%,50%,0.15)"
              : "0 12px 40px hsla(0,0%,0%,0.6), 0 0 20px hsla(187,100%,50%,0.08)",
            border: `1px solid ${hovered ? "hsla(187,100%,50%,0.5)" : "hsla(187,100%,50%,0.15)"}`,
          }}
        >
          <img src={src} alt={caption} className="w-full block" loading="lazy" />
        </div>
      </div>
      <p
        className="font-body text-sm text-center mt-4 max-w-2xl mx-auto leading-relaxed"
        style={{ color: "hsla(0,0%,100%,0.6)" }}
      >
        {caption}
      </p>
    </div>
  );
}

/* ── Heading helper ── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-pixel text-lg tracking-wider mb-5"
      style={{
        color: "hsl(187,100%,50%)",
        textShadow: "0 0 14px hsla(187,100%,50%,0.5)",
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

  const screenshots: { src: string; caption: string; tiltDir: "left" | "right" }[] = [
    { src: stockHome, caption: "Displays real time data of stock prices with interactive charts and multiple stock comparisons.", tiltDir: "right" },
    { src: stockPredict, caption: "To predict stock price, users enter a valid ticker value and number of days, then click the predict button.", tiltDir: "left" },
    { src: stockResult, caption: "Displays the predicted stock price along with searched ticker details and generates a unique QR code to view the predicted result.", tiltDir: "right" },
    { src: stockGraphs, caption: "The left graph shows real-time stock price for the past 1 day, while the right graph shows predicted stock prices for the selected duration.", tiltDir: "left" },
    { src: stockTicker, caption: "Displays details of all valid stock tickers accepted by the application.", tiltDir: "right" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, hsl(0,0%,2%) 0%, hsl(220,15%,4%) 40%, hsl(0,0%,2%) 100%)",
        opacity: entered ? 1 : 0,
        transition: "opacity 0.6s ease-out",
      }}
    >
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
      <div className="relative w-full h-[50vh] min-h-[360px] mt-4 overflow-hidden">
        <img
          src={stockHero}
          alt="Stock Market Prediction"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, hsla(0,0%,0%,0.4) 0%, hsla(0,0%,0%,0.7) 60%, hsl(0,0%,2%) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 60%, hsla(187,100%,50%,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1
            className="font-pixel tracking-wider mb-3"
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              color: "hsl(0,0%,100%)",
              textShadow: "0 0 30px hsla(187,100%,50%,0.4), 0 2px 10px hsla(0,0%,0%,0.8)",
            }}
          >
            Stock Market Prediction
          </h1>
          <p
            className="font-body text-base md:text-lg"
            style={{
              color: "hsla(187,100%,50%,0.8)",
              textShadow: "0 0 12px hsla(187,100%,50%,0.3)",
            }}
          >
            AI-powered time-series forecasting using LSTM
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-14">
        {/* Overview */}
        <Section>
          <SectionHeading>Overview</SectionHeading>
          <p className="font-body text-sm leading-relaxed" style={{ color: "hsla(0,0%,100%,0.65)" }}>
            Predicting stock prices is complex due to market volatility. This project uses LSTM (Long Short-Term Memory), a type of Recurrent Neural Network, to analyze time-series data and forecast future trends.
          </p>
        </Section>

        {/* Goal */}
        <Section delay={0.1}>
          <SectionHeading>Goal</SectionHeading>
          <p className="font-body text-sm leading-relaxed" style={{ color: "hsla(0,0%,100%,0.65)" }}>
            To build a web application that predicts stock prices using real-time API data.
          </p>
        </Section>

        {/* Tech Stack */}
        <Section delay={0.15}>
          <SectionHeading>Tech Stack</SectionHeading>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="font-body text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: "hsl(187,100%,50%)",
                  border: "1px solid hsla(187,100%,50%,0.35)",
                  background: "hsla(187,100%,50%,0.08)",
                  textShadow: "0 0 8px hsla(187,100%,50%,0.4)",
                  boxShadow: "0 0 12px hsla(187,100%,50%,0.06)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </Section>

        {/* Key Features */}
        <Section delay={0.2}>
          <SectionHeading>Key Features</SectionHeading>
          <ul className="space-y-2">
            {features.map((f, i) => (
              <li
                key={i}
                className="font-body text-sm flex items-start gap-2"
                style={{ color: "hsla(0,0%,100%,0.65)" }}
              >
                <span style={{ color: "hsl(187,100%,50%)", flexShrink: 0 }}>▹</span>
                {f}
              </li>
            ))}
          </ul>
        </Section>

        {/* How It Works */}
        <Section delay={0.25}>
          <SectionHeading>How It Works</SectionHeading>
          <div className="flex flex-wrap gap-3 items-center">
            {howItWorks.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="font-body text-xs px-3 py-1.5 rounded-lg"
                  style={{
                    color: "hsla(0,0%,100%,0.75)",
                    background: "hsla(187,100%,50%,0.06)",
                    border: "1px solid hsla(187,100%,50%,0.2)",
                  }}
                >
                  {step}
                </span>
                {i < howItWorks.length - 1 && (
                  <span style={{ color: "hsla(187,100%,50%,0.4)" }} className="font-pixel text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Screenshots */}
        <Section delay={0.3}>
          <SectionHeading>Screenshots</SectionHeading>
        </Section>

        {screenshots.map((s, i) => (
          <ScreenshotCard
            key={i}
            src={s.src}
            caption={s.caption}
            tiltDir={s.tiltDir}
            delay={0.1 * i}
          />
        ))}
      </div>
    </div>
  );
}
