import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import { Button } from "@/components/ui/button";
import {
  BookOpenCheck,
  Calculator,
  FlaskConical,
  Languages,
  NotebookPen,
  ShieldCheck,
  Download,
  FileSearch,
  Clock8,
} from "lucide-react";

const subjectCollections: InfoCardItem[] = [
  {
    icon: Calculator,
    title: "Core Mathematics",
    description:
      "Past questions for SHS 1–3, arranged by topic with annotated solutions and alternative approaches for tricks-heavy items.",
    meta: "220 curated sets • Updated October 2025",
    highlights: ["WAEC trends summary", "Speed drills for paper 2", "Marking scheme annotations"],
  },
  {
    icon: FlaskConical,
    title: "Integrated Science",
    description:
      "Structured by thematic areas (energy, ecosystem, health science) with lab-based short answers and experiment walkthroughs.",
    meta: "184 curated sets • Verified with MoE syllabus",
    highlights: ["Experiment diagrams", "50+ structured objective packs", "Examiner hint cards"],
  },
  {
    icon: Languages,
    title: "English Language",
    description:
      "Essay prompts, comprehension passages, and summary practice with scoring rubrics that highlight tone, diction, and cohesion.",
    meta: "156 curated sets • 32 listening comprehension scripts",
    highlights: ["Task-based rubrics", "Lexis refreshers", "Audio transcripts"],
  },
  {
    icon: NotebookPen,
    title: "Social Studies",
    description:
      "Nationalism, governance, and civic education packs paired with contemporary case studies for real-life application questions.",
    meta: "142 curated sets • BECE focus modules",
    highlights: ["Thematic flashcards", "Data-response drills", "Community action prompts"],
  },
  {
    icon: BookOpenCheck,
    title: "Elective Mastery",
    description:
      "Special collections for Physics, Chemistry, Biology, Literature, Financial Accounting, French, and Technical subjects.",
    meta: "11 elective clusters • 420 solved questions",
    highlights: ["Lab-grade illustrations", "Contextual essays", "Structured working notes"],
  },
  {
    icon: ShieldCheck,
    title: "Exam Readiness Kits",
    description:
      "Full mock papers with invigilator-ready scripts, answer booklets, and invigilation timing for weekend revision camps.",
    meta: "24 complete kits • 6-week refresh schedule",
    highlights: ["Editable invigilator sheets", "Standardized scoring guide", "Reflection checklist"],
  },
];

const releaseCycle = [
  {
    label: "Weekly Refresh",
    detail: "New question banks drop every Monday 05:30 GMT with QA review notes and flagging reports.",
  },
  {
    label: "Mid-Term Spotlight",
    detail: "High-demand subjects get additional context packs aligned with regional mock themes.",
  },
  {
    label: "Exam Season Surge",
    detail: "Daily digest with predictive prompts, scoring scripts, and infographic reminders for candidates.",
  },
];

const ShsBeceQuestions = () => {
  return (
    <EducationPageLayout
      title="SHS & BECE Past Questions"
      description="Trusted exam banks curated with WAEC examiners, model answers, and structured revision plans that mirror elite prep schools in Ghana."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Education Hub" },
        { label: "SHS & BECE Past Questions" },
      ]}
      heroTheme="amber"
      heroImage="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80"
      heroStats={[
        { label: "Exam Sets", value: "520+" },
        { label: "Subjects Covered", value: "18" },
        { label: "Verified Solutions", value: "1,940" },
        { label: "Avg. Monthly Downloads", value: "32K" },
      ]}
      heroActions={
        <>
          <HeroButton onClick={() => console.log("Download latest master pack")}>Download latest master pack</HeroButton>
          <HeroButton onClick={() => console.log("View marking schemes")}>View marking schemes</HeroButton>
        </>
      }
    >
      <div className="space-y-16">
        <EducationSection
          eyebrow="Curriculum coverage"
          title="Structured libraries for every paper type"
          description="Resources are grouped by learning objectives, difficulty band, and WAEC taxonomy level."
        >
          <InfoCardGrid items={subjectCollections} />
        </EducationSection>

        <EducationSection
          eyebrow="Readiness flows"
          title="Guided revision routes for schools and study circles"
          description="Blend topic mastery with timed simulations and reflective journals."
          variant="muted"
          actions={
            <Button>
              Export 6-week plan
            </Button>
          }
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Weekday Sprint",
                items: [
                  "30-minute core concept recaps",
                  "Objective drills with instant scoring",
                  "Evening reflective prompts",
                ],
              },
              {
                title: "Weekend Deep Dive",
                items: [
                  "Full-length mock under timed conditions",
                  "Peer review for essays and practicals",
                  "Mentor feedback with action points",
                ],
              },
              {
                title: "Community Support",
                items: [
                  "Audio explainers for tricky scripts",
                  "WhatsApp-ready infographics",
                  "Guardian briefing kits",
                ],
              },
            ].map((module, index) => (
              <div
                key={module.title}
                className="education-card px-6 py-6"
                data-animate="fade-up"
                data-delay={index}
              >
                <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {module.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </EducationSection>

        <EducationSection
          eyebrow="Operations"
          title="Release cadence and quality guardrails"
          description="Every upload is scanned for clarity, syllabus accuracy, and formatting before publication."
          variant="contrast"
        >
          <div className="rounded-3xl border border-white/30 bg-white/10 px-6 py-8 shadow-lg shadow-black/30 backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-white">
              <div className="flex items-center gap-3 text-white/80">
                <Clock8 className="h-5 w-5" />
                <span>Coordinated by Academic Quality Lab</span>
              </div>
              <div className="flex gap-3">
                <span className="rounded-full border border-emerald-300/60 bg-emerald-100/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                  No leak policy
                </span>
                <span className="rounded-full border border-amber-300/60 bg-amber-100/20 px-3 py-1 text-xs font-semibold text-amber-100">
                  4x peer review
                </span>
              </div>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {releaseCycle.map((stage) => (
                <div key={stage.label} className="border-l-2 border-white/50 pl-4" data-animate="fade-up">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                    {stage.label}
                  </p>
                  <p className="mt-2 text-base text-white/90">{stage.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </EducationSection>
      </div>
    </EducationPageLayout>
  );
};

export default ShsBeceQuestions;

