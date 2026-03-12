const navLinks = ["Home", "About", "Skills", "Projects", "Contact"];

const Navbar = () => {
  return (
    <nav className="bg-nav flex items-center px-6 py-3">
      <div className="font-pixel text-base tracking-widest mr-8 select-none">
        <span className="text-hero-heading drop-shadow-[0_0_8px_hsl(var(--hero-heading)/0.8)]">SAKSHI</span>
        <span className="text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)]">{" <"}CODES{"/>"}</span>
      </div>
      <ul className="flex gap-8 ml-auto">
        {navLinks.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="font-body text-lg font-semibold text-foreground hover:text-hero-heading transition-colors"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
