import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import { Megaphone, CalendarDays, AlertTriangle, ClipboardList, BellRing, Radio } from "lucide-react";

const announcementTypes: InfoCardItem[] = [
  {
    icon: Megaphone,
    title: "Academic Notices",
    description: "Senate updates, registration windows, faculty memos, and timetable shifts with actionable steps.",
    highlights: ["Auto calendar sync", "Department tags", "Read receipts"],
  },
  {
    icon: CalendarDays,
    title: "Events & Experiences",
    description: "Public lectures, innovation fairs, alumni tours, and hackathons with RSVP tracking.",
    highlights: ["Waitlist automation", "Speaker profiles", "Session reminders"],
  },
  {
    icon: AlertTriangle,
    title: "Critical Alerts",
    description: "Security bulletins, weather advisories, and urgent facility notices.",
    highlights: ["Multi-channel broadcast", "SMS fallback", "Incident follow-up"],
  },
];

const CampusAnnouncements = () => (
  <EducationPageLayout
    title="Campus Announcements"
    description="Precision messaging that respects attention spans while keeping every stakeholder aligned."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Campus Announcements" },
    ]}
    heroStats={[
      { label: "Announcements published monthly", value: "120" },
      { label: "Average read-through", value: "87%" },
      { label: "SMS fallback success", value: "99.2%" },
      { label: "Departments onboarded", value: "42" },
    ]}
    heroActions={
      <>
        <HeroButton onClick={() => {}}>Submit announcement</HeroButton>
        <HeroButton onClick={() => {}}>View communications policy</HeroButton>
      </>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Channels"
        title="Curated announcement streams"
        description="Segmented to reduce inbox fatigue."
      >
        <InfoCardGrid items={announcementTypes} />
      </EducationSection>

      <EducationSection
        eyebrow="Workflow"
        title="Editorial guardrails"
        description="Every message goes through a clear pipeline."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Intake", detail: "Submit request, target audience, and urgency tier.", icon: ClipboardList },
            { title: "Review", detail: "Communications desk edits tone, clarity, and CTA quality.", icon: BellRing },
            { title: "Broadcast", detail: "Publish via email, portal, SMS, and campus boards simultaneously.", icon: Radio },
          ].map((step) => (
            <article
              key={step.title}
              className="flex gap-4 rounded-3xl border border-slate-200/70 bg-white px-6 py-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-900">
                <step.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </EducationSection>

      <EducationSection
        eyebrow="Archive"
        title="Searchable history"
        description="Students can look back without sorting emails."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-8 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Keyword search latency", stat: "0.6s", detail: "across 3-year archive" },
              { label: "Retention policy", stat: "36 months", detail: "with GDPR-compliant opt-out" },
              { label: "Accessibility score", stat: "AA+", detail: "thanks to alt text and screen reader testing" },
            ].map((metric) => (
              <div key={metric.label}>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.stat}</p>
                <p className="mt-2 text-sm text-slate-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default CampusAnnouncements;

