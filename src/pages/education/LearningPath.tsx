import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import { Route, Map, Sparkles, Gauge, Target, ClipboardCheck } from "lucide-react";

const pathFeatures: InfoCardItem[] = [
  {
    icon: Route,
    title: "Milestone Mapping",
    description: "Plot semesters, internships, certifications, and passion projects with dependencies.",
    highlights: ["Drag to reorder", "Milestone owners", "Risk flags"],
  },
  {
    icon: Sparkles,
    title: "AI Guidance",
    description: "Recommends next best actions based on performance, interest, and market data.",
    highlights: ["Confidence scores", "Alternative routes", "Advisor messaging"],
  },
  {
    icon: Gauge,
    title: "Momentum Tracking",
    description: "Visual dashboards for progress, weekly focus, and wellbeing balance.",
    highlights: ["Burnout signals", "Celebration nudges", "Reflection prompts"],
  },
];

const LearningPath = () => (
  <EducationPageLayout
    title="My Learning Path"
    description="Turn aspirations into a living roadmap that blends coursework, certifications, and real-world experience."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Learning Path" },
    ]}
    heroStats={[
      { label: "Active learning paths", value: "6,540" },
      { label: "Average goal completion", value: "82%" },
      { label: "Advisor co-created", value: "64%" },
      { label: "Industry-aligned goals", value: "48%" },
    ]}
    heroActions={
      <HeroButton onClick={() => console.log("Design my roadmap")}>
        Design my roadmap
      </HeroButton>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Capabilities"
        title="Everything you need to plan, execute, and reflect"
        description="Built for ambitious students who treat their education like a product roadmap."
      >
        <InfoCardGrid items={pathFeatures} />
      </EducationSection>

      <EducationSection
        eyebrow="Perspective"
        title="360° view of your journey"
        description="Combine academics, skills, and life pillars."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Academic", detail: "Courses, grades, and projects with prerequisites." },
            { title: "Professional", detail: "Internships, research roles, and leadership experiences." },
            { title: "Personal", detail: "Wellbeing commitments, volunteering, and creative pursuits." },
          ].map((lane) => (
            <article
              key={lane.title}
              className="rounded-3xl border border-slate-200/70 bg-white px-6 py-6 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{lane.title}</p>
              <p className="mt-3 text-sm text-slate-600">{lane.detail}</p>
            </article>
          ))}
        </div>
      </EducationSection>

      <EducationSection
        eyebrow="Accountability"
        title="Stay on course with your support system"
        description="Invite advisors, mentors, and peers."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-8 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Advisor check-ins", detail: "Schedule recurring reviews and track action items.", icon: Map },
              { label: "Goal reviews", detail: "Mark milestones complete with evidence uploads.", icon: ClipboardCheck },
              { label: "Celebration moments", detail: "Automatic shout-outs when big goals land.", icon: Target },
            ].map((item) => (
              <div key={item.label} className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-600">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default LearningPath;

