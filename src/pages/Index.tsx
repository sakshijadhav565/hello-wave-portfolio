import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";

const Index = () => {
  return (
    <div
      className="min-h-screen bg-background"
      style={{
        background: "linear-gradient(180deg, hsl(0, 0%, 0%) 0%, hsl(220, 10%, 3%) 20%, hsl(200, 8%, 4%) 40%, hsl(220, 10%, 3%) 60%, hsl(200, 6%, 2%) 80%, hsl(0, 0%, 0%) 100%)",
      }}
    >
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
    </div>
  );
};

export default Index;
