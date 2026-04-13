import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";

const Index = () => {
  return (
    <div
      className="min-h-screen bg-background"
      style={{
        background: "linear-gradient(180deg, hsl(0, 0%, 0%) 0%, hsl(0, 0%, 2%) 30%, hsl(220, 10%, 3%) 60%, hsl(0, 0%, 0%) 100%)",
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
