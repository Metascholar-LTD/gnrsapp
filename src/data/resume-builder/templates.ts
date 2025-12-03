export interface ResumeTemplate {
  id: string;
  name: string;
  category: string;
  popular: boolean;
  primaryColor: string;
  accentColor: string;
  fontStyle: "serif" | "sans" | "modern";
  layout: "classic" | "modern" | "creative" | "minimal";
}

export const templates: ResumeTemplate[] = [
  {
    id: "executive-pro",
    name: "Executive Pro",
    category: "professional",
    popular: true,
    primaryColor: "hsl(220, 60%, 30%)",
    accentColor: "hsl(220, 60%, 50%)",
    fontStyle: "serif",
    layout: "classic",
  },
  {
    id: "creative-spark",
    name: "Creative Spark",
    category: "creative",
    popular: true,
    primaryColor: "hsl(340, 80%, 55%)",
    accentColor: "hsl(340, 80%, 65%)",
    fontStyle: "modern",
    layout: "creative",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    category: "simple",
    popular: false,
    primaryColor: "hsl(0, 0%, 20%)",
    accentColor: "hsl(0, 0%, 40%)",
    fontStyle: "sans",
    layout: "minimal",
  },
  {
    id: "tech-modern",
    name: "Tech Modern",
    category: "modern",
    popular: true,
    primaryColor: "hsl(200, 100%, 45%)",
    accentColor: "hsl(200, 100%, 60%)",
    fontStyle: "modern",
    layout: "modern",
  },
  {
    id: "academic-cv",
    name: "Academic CV",
    category: "academic",
    popular: false,
    primaryColor: "hsl(25, 70%, 40%)",
    accentColor: "hsl(25, 70%, 55%)",
    fontStyle: "serif",
    layout: "classic",
  },
  {
    id: "bold-impact",
    name: "Bold Impact",
    category: "creative",
    popular: false,
    primaryColor: "hsl(270, 60%, 50%)",
    accentColor: "hsl(270, 60%, 65%)",
    fontStyle: "modern",
    layout: "creative",
  },
  {
    id: "classic-elegance",
    name: "Classic Elegance",
    category: "professional",
    popular: true,
    primaryColor: "hsl(150, 40%, 35%)",
    accentColor: "hsl(150, 40%, 50%)",
    fontStyle: "serif",
    layout: "classic",
  },
  {
    id: "fresh-start",
    name: "Fresh Start",
    category: "simple",
    popular: false,
    primaryColor: "hsl(170, 60%, 40%)",
    accentColor: "hsl(170, 60%, 55%)",
    fontStyle: "sans",
    layout: "minimal",
  },
  {
    id: "corporate-clean",
    name: "Corporate Clean",
    category: "professional",
    popular: false,
    primaryColor: "hsl(210, 50%, 40%)",
    accentColor: "hsl(210, 50%, 55%)",
    fontStyle: "sans",
    layout: "modern",
  },
  {
    id: "designer-pro",
    name: "Designer Pro",
    category: "creative",
    popular: true,
    primaryColor: "hsl(15, 80%, 50%)",
    accentColor: "hsl(15, 80%, 65%)",
    fontStyle: "modern",
    layout: "creative",
  },
  {
    id: "streamlined",
    name: "Streamlined",
    category: "modern",
    popular: false,
    primaryColor: "hsl(240, 50%, 50%)",
    accentColor: "hsl(240, 50%, 65%)",
    fontStyle: "sans",
    layout: "modern",
  },
  {
    id: "research-cv",
    name: "Research CV",
    category: "academic",
    popular: false,
    primaryColor: "hsl(0, 60%, 45%)",
    accentColor: "hsl(0, 60%, 60%)",
    fontStyle: "serif",
    layout: "classic",
  },
];

export const getTemplateById = (id: string): ResumeTemplate => {
  return templates.find((t) => t.id === id) || templates[0];
};

