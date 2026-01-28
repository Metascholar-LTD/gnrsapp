import { useState } from "react";
import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import { Button } from "@/components/ui/button";
import { TutorWorkspace } from "@/components/ai-tutor/TutorWorkspace";
import {
  Bot,
  Brain,
  MessageSquare,
  FolderSearch,
  Sparkles,
  ShieldCheck,
  Layers,
  Flame,
  Target,
  BookOpen,
} from "lucide-react";

const tutorFeatures: InfoCardItem[] = [
  {
    icon: Bot,
    title: "Context-Aware Coaching",
    description: "Understands your syllabus, lecture notes, and current assignments before responding.",
    highlights: ["Citations linked to sources", "Step-by-step reasoning", "Misconception alerts"],
  },
  {
    icon: FolderSearch,
    title: "Smart Material Analysis",
    description: "Upload any study material and get a personalized learning path with topics, subtopics, and key concepts.",
    highlights: ["PDF & Word support", "Topic extraction", "Difficulty assessment"],
  },
  {
    icon: ShieldCheck,
    title: "Active Learning",
    description: "Progressive questions from easy to challenging, with detailed explanations for every answer.",
    highlights: ["Multiple choice & short answer", "Instant feedback", "Concept mastery tracking"],
  },
];

const learningModes = [
  { 
    title: "Teach Me Like I'm 10", 
    detail: "Super simple explanations with fun analogies and everyday examples.", 
    icon: Sparkles 
  },
  { 
    title: "Exam Mode", 
    detail: "Focus on what's likely to be tested with key points and revision strategies.", 
    icon: Target 
  },
  { 
    title: "Deep Conceptual", 
    detail: "Thorough exploration of the 'why' with connections between concepts.", 
    icon: Brain 
  },
];

const AiTutor = () => {
  const [showWorkspace, setShowWorkspace] = useState(false);

  if (showWorkspace) {
    return <TutorWorkspace onClose={() => setShowWorkspace(false)} />;
  }

  return (
    <EducationPageLayout
      title="AI Study Tutor"
      description="Your personal AI teacher that helps you truly understand, not memorize. Upload any material and start learning."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Education Hub" },
        { label: "AI Tutor" },
      ]}
      heroStats={[
        { label: "Learning modes", value: "4" },
        { label: "Average understanding", value: "94%" },
        { label: "Topics supported", value: "Any" },
        { label: "File formats", value: "5+" },
      ]}
      heroActions={
        <HeroButton onClick={() => setShowWorkspace(true)}>
          Launch tutor workspace
        </HeroButton>
      }
    >
      <div className="space-y-16">
        {/* Features section */}
        <EducationSection
          eyebrow="Capabilities"
          title="Your personal study intelligence"
          description="A caring, patient, and highly intelligent teacher that helps you understand any topic."
        >
          <InfoCardGrid items={tutorFeatures} />
        </EducationSection>

        {/* Learning modes section */}
        <EducationSection
          eyebrow="Learning Styles"
          title="Learn the way you prefer"
          description="Choose your learning style and the tutor adapts to your needs."
        >
          <div className="grid gap-6 md:grid-cols-3">
            {learningModes.map((item) => (
              <article
                key={item.title}
                className="flex gap-4 rounded-3xl border border-slate-200/70 bg-white px-6 py-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-900">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </EducationSection>

        {/* Duolingo-inspired features */}
        <div className="-mt-16">
          <section className="education-section py-16 bg-white">
            <div className="container mx-auto px-4 relative z-[1]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Button on the left */}
                <div className="flex-shrink-0">
                  <Button 
                    onClick={() => setShowWorkspace(true)}
                    className="h-12 rounded-xl bg-emerald-600 px-8 text-base font-medium hover:bg-emerald-700 animate-slow-bounce hover:animate-none transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Start Learning Now
                  </Button>
                </div>
                {/* Text on the right */}
                <div className="max-w-3xl lg:text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-600 mb-3">
                    Smart Features
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                    Gamified learning experience
                  </h2>
                  <p className="mt-3 text-base text-slate-600 max-w-3xl lg:ml-auto">
                    Stay motivated with streaks, progress tracking, and achievements.
                  </p>
                </div>
              </div>
              <div className="mt-10">
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-8 py-10">
                  <div className="grid gap-6 md:grid-cols-4">
                    {[
                      { icon: Flame, label: "Daily Streaks", stat: "Track your consistency", detail: "Build study habits with streak tracking" },
                      { icon: Target, label: "Progress Tracking", stat: "Visual progress", detail: "See your mastery grow over time" },
                      { icon: BookOpen, label: "Concept Maps", stat: "Connected learning", detail: "See how topics relate to each other" },
                      { icon: MessageSquare, label: "Session Recaps", stat: "Smart summaries", detail: "Get key takeaways after each session" },
                    ].map((metric) => (
                      <div key={metric.label} className="text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                          <metric.icon className="h-6 w-6 text-black" />
                        </div>
                        <p className="mt-4 font-semibold text-slate-900">{metric.label}</p>
                        <p className="mt-1 text-sm text-slate-600">{metric.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* How it works */}
        <EducationSection
          eyebrow="How it works"
          title="Three simple steps"
          description="Get started in minutes with any study material."
        >
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Upload Material", desc: "Drop your PDF, Word doc, or paste text directly. The tutor analyzes and extracts key topics." },
              { step: "2", title: "Choose Your Style", desc: "Select how you want to learn - simple explanations, exam-focused, or deep conceptual." },
              { step: "3", title: "Learn & Practice", desc: "Chat with your tutor, ask questions, take quizzes, and track your progress." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-black">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </EducationSection>
      </div>
    </EducationPageLayout>
  );
};

export default AiTutor;
