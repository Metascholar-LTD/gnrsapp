import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/resume-builder/layout/Layout";
import heroWorkspace from "@/assets/resume-builder/hero-workspace.jpg";
import testimonial1 from "@/assets/resume-builder/testimonial-1.jpg";
import testimonial2 from "@/assets/resume-builder/testimonial-2.jpg";
import testimonial3 from "@/assets/resume-builder/testimonial-3.jpg";

const Index = () => {
  const features = [
    {
      title: "AI Writing Assistant",
      description: "Smart suggestions that help you write impactful content for every section.",
    },
    {
      title: "50+ Templates",
      description: "Professionally designed layouts for every industry and career level.",
    },
    {
      title: "Easy Export",
      description: "Download as PDF or share with a unique link. One click, done.",
    },
    {
      title: "ATS Optimized",
      description: "Every template passes applicant tracking systems with flying colors.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Add your content",
      description: "Enter your experience, skills, and education. We guide you through it.",
    },
    {
      number: "02",
      title: "Pick a template",
      description: "Choose from 50+ designs and customize colors, fonts, and spacing.",
    },
    {
      number: "03",
      title: "Download & apply",
      description: "Export as PDF and start applying. Land interviews faster.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at Google",
      content: "MetaResume helped me land my dream job. The templates are clean, professional, and the AI suggestions were incredibly helpful.",
      image: testimonial2,
    },
    {
      name: "Marcus Johnson",
      role: "Software Engineer at Meta",
      content: "I was skeptical at first, but the ATS optimization actually works. Got 3x more callbacks after switching to MetaResume.",
      image: testimonial1,
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      content: "The simplest resume builder I've used. Created a beautiful resume in under 10 minutes. Highly recommend.",
      image: testimonial3,
    },
  ];

  const stats = [
    { value: "4.3M+", label: "Resumes created" },
    { value: "98%", label: "Success rate" },
    { value: "50+", label: "Templates" },
    { value: "4.9", label: "User rating" },
  ];

  const logos = ["Google", "Meta", "Apple", "Amazon", "Microsoft", "Netflix"];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-sm font-medium text-muted-foreground mb-6">
                Free forever plan available
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                Build a resume that gets you hired
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Create a professional resume in minutes. AI-powered suggestions, 
                beautiful templates, and ATS optimization built in. 100% free.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link to="/join" state={{ from: "/jobs/cv-builder/builder" }}>
                  <Button size="lg" className="w-full sm:w-auto">
                    Create your resume
                  </Button>
                </Link>
                <Link to="/jobs/cv-builder/templates">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View templates
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <img src={testimonial1} alt="" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
                  <img src={testimonial2} alt="" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
                  <img src={testimonial3} alt="" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Trusted by 4.3M+ users</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
                <img 
                  src={heroWorkspace} 
                  alt="Professional workspace with resume" 
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-lg">
                <div>
                  <p className="font-semibold text-sm">ATS Score</p>
                  <p className="text-xs text-muted-foreground">98% Optimized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Our users work at leading companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {logos.map((logo) => (
              <span key={logo} className="text-lg font-semibold text-muted-foreground/50">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-3">How it works</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Create your resume in 3 steps
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our intuitive builder guides you through the entire process
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-border" />
                )}
                <div className="relative bg-card border border-border rounded-2xl p-6">
                  <div className="mb-4">
                    <span className="text-4xl font-display font-bold text-muted-foreground/20">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-3">Features</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Professional tools that help you stand out from the competition
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors"
              >
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-secondary text-secondary-foreground rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-4xl lg:text-5xl font-bold mb-1">{stat.value}</p>
                  <p className="text-secondary-foreground/70 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-3">Testimonials</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Loved by job seekers worldwide
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join millions who have landed their dream jobs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <p className="text-foreground mb-6 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Index;

