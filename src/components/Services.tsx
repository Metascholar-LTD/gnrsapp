import { Bot, Brain, LineChart, Shield, Cpu, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Services = () => {
  const services = [
    {
      icon: Bot,
      title: "Robotic Automation",
      description:
        "Automate repetitive tasks and streamline your business processes with intelligent robotic process automation solutions.",
    },
    {
      icon: Brain,
      title: "Machine Learning",
      description:
        "Leverage advanced machine learning algorithms to unlock insights from your data and make smarter business decisions.",
    },
    {
      icon: LineChart,
      title: "Predictive Analysis",
      description:
        "Forecast trends and anticipate market changes with our powerful predictive analytics and data modeling tools.",
    },
    {
      icon: Shield,
      title: "Cyber Security",
      description:
        "Protect your digital assets with AI-powered security solutions that detect and prevent threats in real-time.",
    },
    {
      icon: Cpu,
      title: "Deep Learning",
      description:
        "Harness the power of neural networks and deep learning to solve complex problems and create innovative solutions.",
    },
    {
      icon: Zap,
      title: "Process Optimization",
      description:
        "Optimize your workflows and maximize efficiency with intelligent process automation and continuous improvement.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-semibold text-lg">Our Services</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Our Excellent AI Solutions{" "}
            <span className="text-primary">for Your Business</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We offer comprehensive AI solutions tailored to your business needs. 
            From automation to predictive analytics, we help you stay ahead in the digital age.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group p-8 hover:shadow-glow transition-all duration-300 border-2 hover:border-primary/50 hover:-translate-y-2"
            >
              <div className="space-y-4">
                {/* Icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* CTA Link */}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary group-hover:translate-x-2 transition-transform duration-300"
                >
                  Learn More →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button size="lg">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};
