import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import CurrentlyExploring from "@/components/CurrentlyExploring";
import ContactSection from "@/components/ContactSection";
import AmbientAtmosphere from "@/components/AmbientAtmosphere";

const Index = () => {
  const { hash } = useLocation();

  // Handle hash scrolling (e.g. /#projects from ERP back button)
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    // Wait one tick for sections to mount
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 60);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <div
      className="min-h-screen bg-background relative"
      style={{
        background:
          "linear-gradient(180deg, hsl(0, 0%, 0%) 0%, hsl(220, 10%, 3%) 20%, hsl(200, 8%, 4%) 40%, hsl(220, 10%, 3%) 60%, hsl(200, 6%, 2%) 80%, hsl(0, 0%, 0%) 100%)",
      }}
    >
      <AmbientAtmosphere />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <CurrentlyExploring />
      <ContactSection />
    </div>
  );
};

export default Index;
