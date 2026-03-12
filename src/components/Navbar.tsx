import logo from "@/assets/logo.png";

const navLinks = ["Home", "About", "Skills", "Projects", "Contact"];

const Navbar = () => {
  return (
    <nav className="bg-nav flex items-center px-6 py-2">
      <img src={logo} alt="Sakshi Codes" className="h-16 w-auto mr-8" />
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
