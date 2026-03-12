import sakshiVideo from "@/assets/sakshi-waving.mp4";

const HeroSection = () => {
  return (
    <section id="home" className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-6 md:px-16 py-12 min-h-[80vh]">
      <div className="w-full md:w-1/2 flex justify-center">
        <video
          src={sakshiVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-w-[550px] rounded-lg shadow-2xl"
        />
      </div>
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="font-pixel text-4xl md:text-5xl lg:text-6xl text-hero-heading mb-4 leading-none tracking-tight whitespace-nowrap">
          Hey! I'm Sakshi
        </h1>
        <p className="font-pixel text-sm text-foreground mb-6">
          the mind behind Sakshi Codes.
        </p>
        <p className="font-pixel text-xs text-foreground leading-relaxed mb-4">
          I specialize in AI, Machine Learning, and intelligent systems. Whether it's building
          research-backed models, developing full-stack applications, or experimenting with
          emerging technologies, I'm always ready for a challenge.
        </p>
        <p className="font-pixel text-xs text-foreground leading-relaxed">
          I'm deeply interested in solving real-world problems using data and algorithms — and I'm
          just getting started.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
