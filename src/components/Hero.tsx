import { Button } from "@/components/ui/button";
import heroImage from "@/assets/ai-hero.png";

export const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-hero-gradient"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-primary-foreground space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full text-sm font-medium border border-primary-foreground/20">
                AI.Tech
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Artificial Intelligence
              <br />
              <span className="text-cyan-accent">for Your Business</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/90 max-w-xl leading-relaxed">
              Transform your business with cutting-edge AI solutions. We deliver intelligent automation and data-driven insights to accelerate your growth.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg">
                Read More
              </Button>
              <Button variant="hero-outline" size="lg">
                Contact Us
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative lg:block animate-float">
            <div className="relative">
              <img
                src={heroImage}
                alt="AI Robot"
                className="w-full h-auto drop-shadow-2xl"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-cyan-accent/20 blur-3xl -z-10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
