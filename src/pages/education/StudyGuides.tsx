import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import { Button } from "@/components/ui/button";
import {
  BookmarkCheck,
  GraduationCap,
  PenTool,
  Target,
  Brain,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const guideTracks: InfoCardItem[] = [
  {
    icon: Target,
    title: "Assessment Playbooks",
    description:
      "Step-by-step guidance for navigating continuous assessment, mid-semester tests, and finals with structured checkpoints.",
    meta: "Week-by-week milestones",
    highlights: ["Formative vs summative tracking", "Reflection prompts", "Rubric crosswalks"],
  },
  {
    icon: GraduationCap,
    title: "Professional Pathways",
    description:
      "Curated guides for medicine, law, engineering, agriculture, and creative arts with reading ladders and mentorship touchpoints.",
    meta: "12 discipline kits",
    highlights: ["Recommended journals", "Competency heat maps", "Interview warm-ups"],
  },
  {
    icon: PenTool,
    title: "Writing Studios",
    description:
      "Modular templates for research papers, lab reports, policy briefs, and reflective journals built by faculty editors.",
    meta: "Reusable Notion + Docs bundles",
    highlights: ["Citation cues", "Voice and tone cues", "Assessment-ready layouts"],
  },
  {
    icon: Brain,
    title: "Cognitive Boosters",
    description:
      "Micro-guides for active recall, spaced repetition, dual coding, and retrieval practice adapted for Ghanaian curricula.",
    meta: "Neuro-backed strategies",
    highlights: ["5-minute drills", "Day-before heuristics", "Exam anxiety toolkit"],
  },
  {
    icon: BookmarkCheck,
    title: "Campus Survival",
    description:
      "Orientation-ready guides with faculty contacts, lab booking procedures, and quick compliance checklists.",
    meta: "Per campus blueprint",
    highlights: ["Emergency contacts", "Facility hours", "Digital request links"],
  },
  {
    icon: Sparkles,
    title: "Innovation Pods",
    description:
      "Design-thinking prompts and hackathon-ready briefs with problem statements drawn from national priority areas.",
    meta: "18 challenge banks",
    highlights: ["Research scaffolds", "Pitch decks", "Impact metrics tables"],
  },
];

const StudyGuides = () => (
  <EducationPageLayout
    title="Study Guides & Tutorials"
    description="Publisher-grade guides crafted with lecturers, instructional designers, and industry mentors to make every study hour intentional."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Study Guides" },
    ]}
    heroStats={[
      { label: "Disciplines", value: "24" },
      { label: "Contributor Lecturers", value: "78" },
      { label: "PDF + Interactive Kits", value: "310" },
      { label: "Avg. Completion Rate", value: "86%" },
    ]}
    heroActions={
      <HeroButton onClick={() => console.log("Browse editorial calendar")}>
        Browse editorial calendar
      </HeroButton>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Collections"
        title="Guides organised by learning intent"
        description="Every guide includes time estimates, prerequisite knowledge, formative checks, and faculty-approved references."
      >
        <InfoCardGrid items={guideTracks} />
      </EducationSection>

      <EducationSection
        eyebrow="Tutorial pipelines"
        title="Multi-format delivery for any study rhythm"
        description="Choose how you learn—short visual explainers, asynchronous cohorts, or live faculty clinics."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Self-Paced Capsules",
              detail: "8–12 minute clips with transcripts, glossary, and recall checks embedded in-line.",
              meta: "Best for: Solo revision",
            },
            {
              title: "Cohort Labs",
              detail: "4-week guided cohorts led by teaching assistants with weekly submission windows.",
              meta: "Best for: Collaborative learning",
            },
            {
              title: "Faculty Clinics",
              detail: "Live 45-minute Q&A with lecturers, annotated whiteboards, and downloadable cases.",
              meta: "Best for: Advanced clarification",
            },
          ].map((option) => (
            <article
              key={option.title}
              className="h-full rounded-3xl border border-slate-200/70 bg-white px-6 py-8 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{option.meta}</p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{option.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{option.detail}</p>
              <Button variant="ghost" className="mt-6 h-10 px-0 text-slate-900 hover:bg-transparent">
                Explore format
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </article>
          ))}
        </div>
      </EducationSection>

      <EducationSection
        eyebrow="Quality assurance"
        title="Editorial promise"
        description="Every guide is co-signed by subject leads and benchmarked against Udemy-style UX heuristics."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-8 py-10">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                heading: "Instructional Design Lab",
                points: ["Storyboard review", "Accessibility audit", "Assessment validation"],
              },
              {
                heading: "Faculty Council",
                points: ["Reading list vetting", "Learning outcomes alignment", "Rubric harmonisation"],
              },
              {
                heading: "Student Advisory Board",
                points: ["Pilot feedback loops", "Clarity testing", "Engagement heuristics"],
              },
            ].map((lane) => (
              <div key={lane.heading}>
                <h4 className="text-lg font-semibold text-slate-900">{lane.heading}</h4>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {lane.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-500" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default StudyGuides;

