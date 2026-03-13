import { useState } from "react";
import logo from "@/assets/sakshi-codes-logo.png";

const navLinks = ["Home", "About", "Skills", "Projects", "Contact"];

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");

  return (
    <>
      <nav className="w-full flex items-center px-6 py-2 bg-nav">
        <div className="bg-background rounded-md p-1 flex items-center justify-center">
          <img src={logo} alt="Sakshi Codes" className="h-[45px] w-auto" />
        </div>
        <ul className="flex gap-8 mx-auto">
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                onClick={() => setActiveLink(link)}
                className={`relative font-body text-lg font-semibold transition-all duration-300 pb-1 ${
                  activeLink === link
                    ? "text-hero-heading drop-shadow-[0_0_8px_hsl(var(--hero-heading)/0.7)]"
                    : "text-primary-foreground hover:text-hero-heading hover:drop-shadow-[0_0_8px_hsl(var(--hero-heading)/0.5)]"
                }`}
              >
                {link}
                {activeLink === link && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-hero-heading rounded-full shadow-[0_0_6px_hsl(var(--hero-heading)/0.8)]" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="w-full h-2 bg-gradient-to-b from-background/80 to-background" />
    </>
  );
};

export default Navbar;
