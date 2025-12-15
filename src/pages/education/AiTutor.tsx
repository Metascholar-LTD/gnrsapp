import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Brain,
  MessageSquare,
  FolderSearch,
  Sparkles,
  ShieldCheck,
  Layers,
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
    title: "Resource Pairings",
    description: "Suggests relevant lecture notes, past questions, or Udemy-style micro lessons.",
    highlights: ["Learning path alignment", "Difficulty bands", "Downloadable notes"],
  },
  {
    icon: ShieldCheck,
    title: "Academic Integrity",
    description: "Grounded outputs with plagiarism guards, reference prompts, and safe completion boundaries.",
    highlights: ["No essay ghostwriting", "Citation reminders", "Bias checks"],
  },
];

const AiTutor = () => (
  <EducationPageLayout
    title="AI Study Tutor"
    description="An ethical, research-grounded tutor that mirrors the clarity of the best Udemy instructors and Elsevier editors."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "AI Tutor" },
    ]}
    heroStats={[
      { label: "Sessions per day", value: "5,200" },
      { label: "Average rating", value: "4.85 / 5" },
      { label: "Fact-check confidence", value: "99.1%" },
      { label: "Languages supported", value: "7" },
    ]}
    heroActions={
      <HeroButton onClick={() => console.log("Launch tutor workspace")}>Launch tutor workspace</HeroButton>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Capabilities"
        title="Your personal study intelligence"
        description="Backed by curated academic corpora and real lecturer review."
      >
        <InfoCardGrid items={tutorFeatures} />
      </EducationSection>

      <EducationSection
        eyebrow="Dialogue design"
        title="Conversations that feel human"
        description="Every prompt is structured to drive deeper thinking."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Socratic prompts", detail: "Tutor responds with probing questions before revealing answers.", icon: Brain },
            { title: "Mode switching", detail: "Toggle between explainer, quizzer, or project reviewer.", icon: Layers },
            { title: "Session memory", detail: "Recalls your previous challenges and adapts follow-up sessions.", icon: MessageSquare },
          ].map((item) => (
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

      <EducationSection
        eyebrow="Quality control"
        title="Guardrails for trust"
        description="Humans remain in the loop."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-8 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Expert reviewers", stat: "48 lecturers", detail: "audit answer quality weekly" },
              { label: "Content refresh", stat: "Every 14 days", detail: "to reflect curriculum updates" },
              { label: "Escalation rate", stat: "<0.6%", detail: "thanks to transparent explanations" },
            ].map((metric) => (
              <div key={metric.label}>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.stat}</p>
                <p className="mt-2 text-sm text-slate-600">{metric.detail}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-8 h-10 rounded-xl border-slate-300">
            <Sparkles className="mr-2 h-4 w-4" />
            Read responsible AI policy
          </Button>
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default AiTutor;

