import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/resume-builder/layout/Layout";
import { Input } from "@/components/ui/input";
import { templates as templateData } from "@/data/resume-builder/templates";
import TemplatePreview from "@/components/resume-builder/TemplatePreview";

const Templates = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All" },
    { id: "professional", label: "Professional" },
    { id: "creative", label: "Creative" },
    { id: "simple", label: "Simple" },
    { id: "modern", label: "Modern" },
  ];

  const filteredTemplates = templateData.filter((template) => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-20 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Resume Templates
            </h1>
            <p className="text-muted-foreground mb-8">
              50+ professionally designed templates. ATS-friendly and fully customizable.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4 border-b border-border sticky top-16 lg:top-20 bg-background z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors"
              >
                {template.popular && (
                  <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    Popular
                  </div>
                )}
                
                {/* Template Preview */}
                <div className="aspect-[3/4] bg-muted p-3 relative">
                  <TemplatePreview template={template} />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-secondary/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/jobs/cv-builder/builder?template=${template.id}`}>
                      <Button size="sm">
                        Use Template
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Template Info */}
                <div className="p-4">
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{template.category}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No templates found. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Can't decide? Start with any template
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You can always change your template later. Your content stays the same.
          </p>
          <Link to="/join" state={{ from: "/jobs/cv-builder/builder" }}>
            <Button size="lg">
              Start Building Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Templates;

