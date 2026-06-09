import { useState } from "react";
import { Mail, Linkedin, Github, MapPin, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const cards = [
  {
    icon: Mail,
    label: "Email",
    value: "sakshi@example.com",
    href: "mailto:sakshi@example.com",
    hue: 187,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "/in/sakshi",
    href: "https://linkedin.com",
    hue: 210,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "@sakshicodes",
    href: "https://github.com",
    hue: 280,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "India · Remote",
    href: "#",
    hue: 342,
  },
];

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill in all fields" });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", message: "" });
      toast({
        title: "Message sent ✨",
        description: "Thanks for reaching out — I'll reply shortly.",
      });
    }, 800);
  };

  const inputBase =
    "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all focus:border-cyan-400/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_hsla(187,100%,50%,0.12)]";

  return (
    <section
      id="contact"
      className="relative z-10 max-w-6xl mx-auto px-6 py-24"
    >
      {/* Ambient orbs */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      >
        <div
          className="absolute -top-32 -left-20 w-[28rem] h-[28rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, hsla(187,100%,50%,0.18), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-10 w-[28rem] h-[28rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, hsla(342,100%,60%,0.14), transparent 70%)" }}
        />
      </div>

      <div className="text-center mb-12">
        <p
          className="text-xs uppercase tracking-[0.35em] mb-3"
          style={{ color: "hsl(187 100% 60%)" }}
        >
          Get In Touch
        </p>
        <h2
          className="text-4xl md:text-6xl font-bold text-white mb-4"
          style={{
            textShadow:
              "0 0 20px hsla(187,100%,50%,0.3), 0 0 2px hsla(187,100%,50%,0.4)",
          }}
        >
          Let's Build Something Amazing
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Open to UX Design, Product Design, AI Projects, Research Opportunities,
          Collaborations, and Internships.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6 md:gap-8">
        {/* Form */}
        <form
          onSubmit={submit}
          className="md:col-span-3 rounded-3xl p-6 md:p-8 space-y-4"
          style={{
            background:
              "linear-gradient(160deg, hsla(0,0%,100%,0.05), hsla(0,0%,100%,0.015))",
            border: "1px solid hsla(0,0%,100%,0.08)",
            backdropFilter: "blur(14px)",
            boxShadow:
              "0 20px 60px -20px hsla(187,100%,50%,0.15), inset 0 1px 0 hsla(0,0%,100%,0.05)",
          }}
        >
          <div>
            <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
              Name
            </label>
            <input
              className={inputBase}
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
              Email
            </label>
            <input
              type="email"
              className={inputBase}
              placeholder="you@domain.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
              Message
            </label>
            <textarea
              rows={5}
              className={inputBase + " resize-none"}
              placeholder="Tell me about your project, idea, or opportunity…"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
            style={{
              background:
                "linear-gradient(135deg, hsl(187 100% 50%), hsl(200 100% 55%))",
              boxShadow:
                "0 10px 30px -10px hsla(187,100%,50%,0.5), 0 0 0 1px hsla(187,100%,70%,0.3) inset",
            }}
          >
            <Send size={16} />
            {sending ? "Sending…" : "Send Message"}
          </button>
        </form>

        {/* Contact cards */}
        <div className="md:col-span-2 grid sm:grid-cols-2 md:grid-cols-1 gap-4">
          {cards.map(({ icon: Icon, label, value, href, hue }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group relative rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1"
              style={{
                background:
                  "linear-gradient(160deg, hsla(0,0%,100%,0.04), hsla(0,0%,100%,0.015))",
                border: "1px solid hsla(0,0%,100%,0.07)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `hsla(${hue},100%,60%,0.12)`,
                  border: `1px solid hsla(${hue},100%,60%,0.3)`,
                  color: `hsl(${hue} 100% 70%)`,
                  boxShadow: `0 0 24px hsla(${hue},100%,60%,0.2)`,
                }}
              >
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-white/40">
                  {label}
                </div>
                <div className="text-white font-medium truncate">{value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="text-center text-white/30 text-xs mt-16">
        © {new Date().getFullYear()} Sakshi Codes — Crafted with care.
      </div>
    </section>
  );
};

export default ContactSection;
