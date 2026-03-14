import { useState, useEffect, useCallback } from "react";
import logo from "@/assets/sakshi-codes-logo.png";

const navLinks = ["Home", "About", "Skills", "Projects", "Contact"];
const sectionIds = ["home", "about", "skills", "projects", "contact"];

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");

  // Scroll-based active section detection
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + 120;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveLink(navLinks[i]);
          return;
        }
      }
      setActiveLink("Home");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = useCallback((link: string) => {
    setActiveLink(link);
    const el = document.getElementById(link.toLowerCase());
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <nav
        className="w-full flex items-center px-6 py-2 sticky top-0 z-50"
        style={{ background: "linear-gradient(135deg, #ff2f6d, #ff4f9a)" }}
      >
        <img src={logo} alt="Sakshi Codes" className="h-[65px] w-auto flex-shrink-0" />
        <ul className="flex gap-9 mx-auto">
          {navLinks.map((link) => (
            <li key={link}>
              <button
                onClick={() => handleClick(link)}
                className={`relative font-body text-lg font-semibold transition-all duration-300 pb-1 bg-transparent border-none cursor-pointer ${
                  activeLink === link
                    ? "text-hero-heading drop-shadow-[0_0_8px_hsl(var(--hero-heading)/0.7)]"
                    : "text-primary-foreground hover:text-hero-heading hover:drop-shadow-[0_0_8px_hsl(var(--hero-heading)/0.5)]"
                }`}
              >
                {link}
                {activeLink === link && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-hero-heading rounded-full shadow-[0_0_6px_hsl(var(--hero-heading)/0.8)]" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="w-full h-2 bg-gradient-to-b from-background/80 to-background" />
    </>
  );
};

export default Navbar;
