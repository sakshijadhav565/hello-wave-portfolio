import { useState, useEffect, useCallback } from "react";

const navLinks = ["Home", "About", "Skills", "Projects", "Contact"];
const sectionIds = ["home", "about", "skills", "projects", "contact"];

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");

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
        className="w-full flex items-center px-6 py-1 sticky top-0 z-50"
        style={{ background: "linear-gradient(135deg, #ff2f6d, #ff4f9a)" }}
      >
        {/* SJ Monogram */}
        <span
          className="font-pixel text-2xl font-bold flex-shrink-0 select-none"
          style={{
            color: "hsl(183, 100%, 50%)",
            textShadow: "0 0 12px hsl(183, 100%, 50%), 0 0 30px hsla(183, 100%, 50%, 0.5)",
          }}
        >
          SJ
        </span>

        <ul className="flex gap-9 mx-auto">
          {navLinks.map((link) => (
            <li key={link}>
              <button
                onClick={() => handleClick(link)}
                className={`relative font-pixel text-xs transition-all duration-300 pb-1 bg-transparent border-none cursor-pointer ${
                  activeLink === link
                    ? "text-hero-heading"
                    : "text-primary-foreground hover:text-hero-heading"
                }`}
              >
                {link}
                {activeLink === link && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-hero-heading rounded-full" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
