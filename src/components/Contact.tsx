import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      detail: "123 AI Street, Tech City, TC 12345",
    },
    {
      icon: Phone,
      title: "Call Us",
      detail: "+1 (555) 123-4567",
    },
    {
      icon: Mail,
      title: "Email Us",
      detail: "info@aitech.com",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-semibold text-lg">Contact Us</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Get in Touch with{" "}
            <span className="text-primary">Our Experts</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Have a question or ready to transform your business with AI? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-hero-gradient rounded-2xl p-8 text-primary-foreground">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="mb-6 opacity-90">
                Join hundreds of businesses already using our AI solutions to drive growth and innovation.
              </p>
              <Button variant="hero" size="lg">
                Schedule a Demo
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-8">
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Your Name
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="How can we help?"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your project..."
                  className="min-h-[150px] resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};
