import { Brain, Search, Layers, Code2 } from "lucide-react";

const items = [
  { icon: Brain, label: "AI & Machine Learning", hue: 187 },
  { icon: Search, label: "UX Research", hue: 320 },
  { icon: Layers, label: "Multi-Modal Systems", hue: 260 },
  { icon: Code2, label: "Full-Stack Development", hue: 200 },
];

const CurrentlyExploring = () => {
  return (
    <section
      id="currently-exploring"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-12">
        <p
          className="text-xs uppercase tracking-[0.35em] mb-3"
          style={{ color: "hsl(187 100% 60%)", letterSpacing: "0.35em" }}
        >
          Currently Exploring
        </p>
        <h2
          className="text-3xl md:text-5xl font-bold text-white"
          style={{
            textShadow:
              "0 0 18px hsla(187,100%,50%,0.25), 0 0 2px hsla(187,100%,50%,0.3)",
          }}
        >
          What I'm Diving Into Right Now
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map(({ icon: Icon, label, hue }, i) => (
          <div
            key={label}
            className="group relative rounded-2xl p-5 md:p-6 transition-all duration-500 hover:-translate-y-1"
            style={{
              background:
                "linear-gradient(160deg, hsla(0,0%,100%,0.04), hsla(0,0%,100%,0.015))",
              border: "1px solid hsla(0,0%,100%,0.07)",
              backdropFilter: "blur(10px)",
              animation: `float 6s ease-in-out ${i * 0.4}s infinite`,
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 0%, hsla(${hue},100%,60%,0.22), transparent 70%)`,
                boxShadow: `0 0 40px hsla(${hue},100%,60%,0.18) inset`,
              }}
            />
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
              style={{
                background: `hsla(${hue},100%,60%,0.12)`,
                border: `1px solid hsla(${hue},100%,60%,0.3)`,
                color: `hsl(${hue} 100% 70%)`,
              }}
            >
              <Icon size={20} />
            </div>
            <div className="text-white font-semibold text-sm md:text-base leading-snug">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CurrentlyExploring;
