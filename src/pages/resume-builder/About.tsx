import Layout from "@/components/resume-builder/layout/Layout";
import aboutTeam from "@/assets/resume-builder/about-team.jpg";
import testimonial1 from "@/assets/resume-builder/testimonial-1.jpg";
import testimonial2 from "@/assets/resume-builder/testimonial-2.jpg";
import testimonial3 from "@/assets/resume-builder/testimonial-3.jpg";

const About = () => {
  const values = [
    {
      title: "Mission-Driven",
      description: "Everyone deserves a fair chance at their dream job, regardless of design skills or budget.",
    },
    {
      title: "User-First",
      description: "Every feature starts with understanding our users' real needs and pain points.",
    },
    {
      title: "Simplicity",
      description: "Complex problems deserve simple solutions. We make resume building effortless.",
    },
    {
      title: "Accessibility",
      description: "Our tools are designed to be accessible to everyone, everywhere in the world.",
    },
  ];

  const stats = [
    { value: "4.3M+", label: "Users worldwide" },
    { value: "10M+", label: "Resumes created" },
    { value: "98%", label: "Success rate" },
    { value: "150+", label: "Countries" },
  ];

  const team = [
    { name: "Alex Rivera", role: "Founder & CEO", image: testimonial1 },
    { name: "Sarah Kim", role: "Head of Design", image: testimonial2 },
    { name: "James Chen", role: "Lead Engineer", image: testimonial3 },
    { name: "Maria Santos", role: "Customer Success", image: testimonial2 },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-primary mb-4">About us</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">
              Helping millions land their dream jobs
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              MetaResume was founded with a simple idea: creating a professional resume 
              shouldn't be complicated or expensive. Today, we're proud to help millions 
              of job seekers around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl lg:text-4xl font-bold mb-1">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-sm font-medium text-primary mb-4">Our Story</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Built by job seekers, for job seekers
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  MetaResume started in 2020 when our founder, frustrated by the 
                  complexity of existing resume tools, decided to build something better.
                </p>
                <p>
                  What began as a side project quickly grew into a platform used by 
                  millions. Our mission is clear: democratize access to professional 
                  resume creation.
                </p>
                <p>
                  Today, we're a small but mighty team dedicated to helping job seekers 
                  put their best foot forward. We believe that a great resume should be 
                  accessible to everyone, not just those who can afford expensive services.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src={aboutTeam} 
                alt="Team collaboration" 
                className="w-full rounded-2xl shadow-lg border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-4">Our Values</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              The principles that guide us
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every decision we make is guided by these core values
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-4">Our Team</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Meet the people behind MetaResume
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A small but mighty team dedicated to your success
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-border"
                />
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default About;

