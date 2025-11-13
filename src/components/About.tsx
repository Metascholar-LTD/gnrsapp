import { Award, Users, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import aboutImage from "@/assets/about-office.jpg";

export const About = () => {
  const features = [
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized excellence in AI innovation",
    },
    {
      icon: Users,
      title: "Professional Staff",
      description: "Expert team of AI specialists",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance",
    },
    {
      icon: DollarSign,
      title: "Fair Prices",
      description: "Competitive and transparent pricing",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={aboutImage}
                alt="Modern AI workspace"
                className="w-full h-auto"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-semibold text-lg">About Us</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                We Make Your Business Smarter with{" "}
                <span className="text-primary">Artificial Intelligence</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We specialize in delivering cutting-edge artificial intelligence solutions 
                  that transform how businesses operate. Our advanced AI technologies help 
                  you automate processes, gain valuable insights, and stay ahead of the competition.
                </p>
                <p>
                  With years of experience and a team of dedicated AI experts, we're committed 
                  to helping your business harness the power of intelligent automation and 
                  data-driven decision making.
                </p>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button size="lg" className="mt-4">
              Read More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
