import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useSearchParams } from "react-router-dom";
import { templates, getTemplateById, ResumeTemplate } from "@/data/resume-builder/templates";
import ResumePreview from "@/components/resume-builder/ResumePreview";
import TemplatePreview from "@/components/resume-builder/TemplatePreview";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

const Builder = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("personal");
  const [showPreview, setShowPreview] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  
  // Template
  const templateId = searchParams.get("template") || "executive-pro";
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(() => 
    getTemplateById(templateId)
  );

  useEffect(() => {
    setSelectedTemplate(getTemplateById(templateId));
  }, [templateId]);

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setSearchParams({ template: template.id });
    setTemplateSelectorOpen(false);
    toast({
      title: "Template changed!",
      description: `Now using "${template.name}" template.`,
    });
  };
  
  // Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
    photo: "",
  });

  // Experience
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: "1", company: "", position: "", startDate: "", endDate: "", description: "" },
  ]);

  // Education
  const [education, setEducation] = useState<Education[]>([
    { id: "1", school: "", degree: "", field: "", startDate: "", endDate: "" },
  ]);

  // Skills
  const [skills, setSkills] = useState<string[]>([""]);

  // Languages
  const [languages, setLanguages] = useState<string[]>([""]);

  const sections = [
    { id: "personal", label: "Personal Info" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "languages", label: "Languages" },
  ];

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { id: Date.now().toString(), company: "", position: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
    }
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { id: Date.now().toString(), school: "", degree: "", field: "", startDate: "", endDate: "" },
    ]);
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter((edu) => edu.id !== id));
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
  };

  const addSkill = () => setSkills([...skills, ""]);
  const removeSkill = (index: number) => {
    if (skills.length > 1) setSkills(skills.filter((_, i) => i !== index));
  };
  const updateSkill = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addLanguage = () => setLanguages([...languages, ""]);
  const removeLanguage = (index: number) => {
    if (languages.length > 1) setLanguages(languages.filter((_, i) => i !== index));
  };
  const updateLanguage = (index: number, value: string) => {
    const newLanguages = [...languages];
    newLanguages[index] = value;
    setLanguages(newLanguages);
  };

  const handleDownload = () => {
    toast({
      title: "Downloading PDF...",
      description: "Your resume is being prepared for download.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Resume saved!",
      description: "Your changes have been saved successfully.",
    });
  };

  const resumeData = {
    personalInfo,
    experiences,
    education,
    skills,
    languages,
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col resume-builder-app">
      {/* Header */}
      <header className="bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 xl:px-6 h-16">
          <div className="flex items-center gap-4">
            <Link to="/jobs/cv-builder" className="flex items-center gap-2">
              <span className="font-display text-lg font-bold hidden sm:block">MetaResume</span>
            </Link>
            <span className="text-muted-foreground hidden md:block">/ My Resume</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)} className="xl:hidden">
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button variant="hero" size="sm" onClick={handleDownload}>
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar - Desktop/Tablet Only */}
        <aside className={`w-56 xl:w-64 bg-card border-r border-border/50 flex-shrink-0 hidden md:flex flex-col`}>
          <nav className="flex-1 p-3 md:p-4 space-y-1 overflow-y-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-left transition-all duration-200 text-sm md:text-base ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="truncate">{section.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-3 md:p-4 border-t border-border/50 flex-shrink-0">
            <Sheet open={templateSelectorOpen} onOpenChange={setTemplateSelectorOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="w-full group text-xs md:text-sm">
                  Change Template
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-[380px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="font-display text-lg">Choose Template</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`relative rounded-lg border-2 overflow-hidden transition-all hover:shadow-md ${
                        selectedTemplate.id === template.id
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border/50 hover:border-primary/50"
                      }`}
                    >
                      {selectedTemplate.id === template.id && (
                        <div className="absolute top-1 right-1 z-10 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        </div>
                      )}
                      <div className="aspect-[3/4] bg-muted p-1">
                        <TemplatePreview template={template} />
                      </div>
                      <div className="p-1.5 bg-card border-t border-border/50">
                        <p className="font-medium text-xs truncate">{template.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </aside>

        {/* Mobile Section Nav - Only on Mobile */}
        <div className="md:hidden flex overflow-x-auto border-b border-border/50 bg-card px-3 py-2 gap-2 scrollbar-hide flex-shrink-0">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all flex-shrink-0 ${
                activeSection === section.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        {!showPreview ? (
          <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Editor */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8">
              <div className="max-w-2xl mx-auto w-full">
              {/* Personal Info Section */}
              {activeSection === "personal" && (
                <div className="space-y-4 md:space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-xl md:text-2xl font-bold mb-2">Personal Information</h2>
                    <p className="text-muted-foreground text-sm md:text-base">Start with your basic contact details.</p>
                  </div>
                  <div className="grid gap-3 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={personalInfo.fullName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                      />
                    </div>
                    {/* Photo Upload - Only for Creative Templates */}
                    {selectedTemplate.layout === "creative" && (
                      <div className="space-y-2">
                        <Label>Profile Photo</Label>
                        <div className="flex items-center gap-4">
                          {personalInfo.photo ? (
                            <div className="relative">
                              <img
                                src={personalInfo.photo}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover border-2 border-border"
                              />
                              <button
                                type="button"
                                onClick={() => setPersonalInfo({ ...personalInfo, photo: "" })}
                                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                              >
                              </button>
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                            </div>
                          )}
                          <div className="flex-1">
                            <label htmlFor="photo-upload" className="cursor-pointer">
                              <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                                <span className="text-sm">{personalInfo.photo ? "Change Photo" : "Upload Photo"}</span>
                              </div>
                              <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setPersonalInfo({ ...personalInfo, photo: reader.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 5MB</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 000-0000"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="New York, USA"
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website / LinkedIn</Label>
                        <Input
                          id="website"
                          placeholder="linkedin.com/in/johndoe"
                          value={personalInfo.website}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        placeholder="Write a brief summary about yourself..."
                        rows={4}
                        value={personalInfo.summary}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {activeSection === "experience" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-xl md:text-2xl font-bold mb-2">Work Experience</h2>
                    <p className="text-muted-foreground text-sm md:text-base">Add your relevant work history.</p>
                  </div>
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="p-4 md:p-6 bg-card rounded-xl border border-border/50 space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Experience {index + 1}</h3>
                        {experiences.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)}>
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            placeholder="Job Title"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            placeholder="Present"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe your responsibilities and achievements..."
                          rows={3}
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addExperience} className="w-full">
                    Add Experience
                  </Button>
                </div>
              )}

              {/* Education Section */}
              {activeSection === "education" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-xl md:text-2xl font-bold mb-2">Education</h2>
                    <p className="text-muted-foreground text-sm md:text-base">Add your educational background.</p>
                  </div>
                  {education.map((edu, index) => (
                    <div key={edu.id} className="p-4 md:p-6 bg-card rounded-xl border border-border/50 space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Education {index + 1}</h3>
                        {education.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)}>
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>School / University</Label>
                        <Input
                          placeholder="University Name"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            placeholder="Bachelor's, Master's, etc."
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Field of Study</Label>
                          <Input
                            placeholder="Computer Science"
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addEducation} className="w-full">
                    Add Education
                  </Button>
                </div>
              )}

              {/* Skills Section */}
              {activeSection === "skills" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-xl md:text-2xl font-bold mb-2">Skills</h2>
                    <p className="text-muted-foreground text-sm md:text-base">List your professional skills.</p>
                  </div>
                  <div className="space-y-3">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="e.g., JavaScript, Project Management"
                          value={skill}
                          onChange={(e) => updateSkill(index, e.target.value)}
                        />
                        {skills.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeSkill(index)}>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" onClick={addSkill} className="w-full">
                    Add Skill
                  </Button>
                </div>
              )}

              {/* Languages Section */}
              {activeSection === "languages" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="font-display text-xl md:text-2xl font-bold mb-2">Languages</h2>
                    <p className="text-muted-foreground text-sm md:text-base">Add languages you speak.</p>
                  </div>
                  <div className="space-y-3">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="e.g., English (Native), Spanish (Fluent)"
                          value={lang}
                          onChange={(e) => updateLanguage(index, e.target.value)}
                        />
                        {languages.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeLanguage(index)}>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" onClick={addLanguage} className="w-full">
                    Add Language
                  </Button>
                </div>
              )}
            </div>
          </div>

            {/* Preview - Desktop Only (1200px+) */}
            <div className="hidden xl:block w-[600px] 2xl:w-[700px] bg-muted/50 border-l border-border/50 overflow-y-auto p-6 xl:p-8 flex-shrink-0">
              <ResumePreview template={selectedTemplate} data={resumeData} />
            </div>
          </main>
        ) : (
          /* Mobile/Tablet Preview - Replaces editor when toggled */
          <main className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 bg-muted/50">
              <div className="max-w-full mx-auto">
                <ResumePreview template={selectedTemplate} data={resumeData} compact />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default Builder;

