import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { Button } from "@/components/ui/button";
import {
  HeartHandshake,
  BookOpen,
  Target,
  Shield,
  Timer,
  Sparkles,
  ClipboardCheck,
  MessageSquare,
} from "lucide-react";

const mentorshipTracks: InfoCardItem[] = [
  {
    icon: Target,
    title: "Career Accelerator",
    description: "Goal-oriented mentorship for internships, graduate school, and first roles.",
    highlights: ["Competency gap analysis", "Action plans", "Hiring manager prep"],
  },
  {
    icon: BookOpen,
    title: "Academic Excellence",
    description: "Pair high-performing students with faculty and teaching fellows to master complex courses.",
    highlights: ["Assessment blueprinting", "Research coaching", "Publication reviews"],
  },
  {
    icon: Sparkles,
    title: "Innovation Fellows",
    description: "Entrepreneurial mentorship for product designers, founders, and social innovators.",
    highlights: ["Pitch refinement", "Investor mapping", "Impact metrics"],
  },
];

const Mentorship = () => (
  <EducationPageLayout
    title="Mentorship Programme"
    description="Thoughtfully matched mentor-mentee relationships with structured check-ins and measurable growth."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Mentorship" },
    ]}
    heroStats={[
      { label: "Active mentorship pairs", value: "1,050" },
      { label: "Average match rating", value: "4.9 / 5" },
      { label: "Goal completion", value: "88%" },
      { label: "Mentor retention", value: "93%" },
    ]}
    heroActions={
      <div className="flex flex-col gap-3">
        <Button className="h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-500">
          Apply as mentee
        </Button>
        <Button variant="outline" className="h-11 rounded-xl border-slate-300">
          Volunteer as mentor
        </Button>
      </div>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Tracks"
        title="Choose a mentorship lane"
        description="Each track includes curated resources, conversation prompts, and milestone templates."
      >
        <InfoCardGrid items={mentorshipTracks} />
      </EducationSection>

      <EducationSection
        eyebrow="Guardrails"
        title="Structure with flexibility"
        description="Mentors receive playbooks so sessions stay purposeful."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: "Match intelligence", detail: "Psychometrics + scheduling preferences + focus areas.", icon: HeartHandshake },
            { title: "Progress cadence", detail: "Bi-weekly reflections auto-deliver to both parties.", icon: Timer },
            { title: "Safety & ethics", detail: "Mandatory training + escalation channels protect all members.", icon: Shield },
            { title: "Resource locker", detail: "Conversation starters, templates, and reading packs stay within the workspace.", icon: ClipboardCheck },
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
        eyebrow="Signal loops"
        title="Transparency from day one"
        description="Real-time nudges keep relationships healthy."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-8 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-slate-600">
              <MessageSquare className="h-5 w-5" />
              <span>Structured agendas shared 24 hours before every session</span>
            </div>
            <Button variant="outline" className="h-10 rounded-xl border-slate-300">
              Download mentor guide
            </Button>
          </div>
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default Mentorship;

