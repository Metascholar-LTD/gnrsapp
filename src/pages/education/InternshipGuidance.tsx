import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import {
  Briefcase,
  Map,
  Users,
  FileText,
  Building,
  MessageCircle,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";

const guidanceTracks: InfoCardItem[] = [
  {
    icon: Map,
    title: "Industry Playbooks",
    description: "Sector-specific preparation tracks with competency benchmarks, tool stacks, and case files.",
    highlights: ["Banking + fintech", "Health + biotech", "Creative economy", "Public policy"],
  },
  {
    icon: Users,
    title: "Mentor Triads",
    description: "Every student is matched with an alumni mentor, faculty advisor, and career coach.",
    highlights: ["Weekly office hours", "Feedback loops", "Escalation support"],
  },
  {
    icon: FileText,
    title: "Portfolio Studio",
    description: "Resume, cover letter, and micro-portfolio templates styled for Ghanaian recruiters and global firms.",
    highlights: ["ATS-ready layouts", "Storytelling prompts", "Impact metrics"],
  },
  {
    icon: Briefcase,
    title: "Interview Lab",
    description: "Interactive simulations, business case prompts, and field-specific technical drills.",
    highlights: ["Live coaching", "Recorded feedback", "Suggested improvement plans"],
  },
  {
    icon: Building,
    title: "Placement Radar",
    description: "Exclusive leads from corporate partners with verified stipends and clear role definitions.",
    highlights: ["Weekly drop", "Diversity-first placements", "Contract review support"],
  },
  {
    icon: MessageCircle,
    title: "Wellness Desk",
    description: "Onboarding guides, housing tips, commute planners, and conflict mediation hotlines.",
    highlights: ["24/7 helpline", "Emergency check-ins", "Return-to-campus debriefs"],
  },
];

const InternshipGuidance = () => (
  <EducationPageLayout
    title="Internship & Project Guidance"
    description="A concierge-style programme that takes students from application to impact."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Internship Guidance" },
    ]}
    heroStats={[
      { label: "Partner companies", value: "210" },
      { label: "Placement success", value: "91%" },
      { label: "Stipend compliance", value: "100%" },
      { label: "Feedback submitted", value: "1,540" },
    ]}
    heroActions={
      <>
        <HeroButton onClick={() => console.log("Refer a company")}>Refer a company</HeroButton>
      </>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Program pillars"
        title="Holistic guidance from day zero"
        description="Each track is tailored to academic level and specialisation."
      >
        <InfoCardGrid items={guidanceTracks} />
      </EducationSection>

      <EducationSection
        eyebrow="Timeline"
        title="Six-phase journey"
        description="Clear checkpoints keep everyone aligned."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-white px-6 py-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { phase: "01", title: "Discovery", detail: "Skill scan, internship preference mapping, and mentor matching." },
              { phase: "02", title: "Branding", detail: "Portfolio refresh, LinkedIn audit, and storytelling prep." },
              { phase: "03", title: "Applications", detail: "Shortlist curation, submission tracking, and referral tapping." },
              { phase: "04", title: "Interviews", detail: "Mock interviews, confidence coaching, and recruiter Q&A." },
              { phase: "05", title: "Onsite support", detail: "Weekly check-ins, issue escalation, and wellness monitoring." },
              { phase: "06", title: "Reflection", detail: "Impact presentation, credit validation, and sequel planning." },
            ].map((milestone) => (
              <div key={milestone.phase} className="border-l-2 border-slate-900/80 pl-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {milestone.phase} // {milestone.title}
                </p>
                <p className="mt-2 text-sm text-slate-600">{milestone.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </EducationSection>

      <EducationSection
        eyebrow="Governance"
        title="Assurance for students and employers"
        description="Transparency builds trust."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: "Availability tracker", detail: "Calendars auto-sync to avoid clashes with lectures.", icon: CalendarClock },
            { title: "Contract compliance", detail: "Legal team reviews clauses before signatures.", icon: CheckCircle2 },
          ].map((item) => (
            <article
              key={item.title}
              className="flex gap-4 rounded-3xl border border-slate-200/70 bg-slate-50 px-6 py-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900">
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
    </div>
  </EducationPageLayout>
);

export default InternshipGuidance;

