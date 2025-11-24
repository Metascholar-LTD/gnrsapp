import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { Button } from "@/components/ui/button";
import { Bell, Clock, CalendarCheck, PhoneCall, Inbox } from "lucide-react";

const notificationModes: InfoCardItem[] = [
  {
    icon: Bell,
    title: "Smart Push",
    description: "Personalised notifications that factor in time zones, study schedules, and do-not-disturb windows.",
    highlights: ["Priority scoring", "Batching logic", "Read receipts"],
  },
  {
    icon: Clock,
    title: "Deadline Radar",
    description: "Assignments, registration, scholarship, and library return deadlines in one consolidated feed.",
    highlights: ["Outlook + Google sync", "Severity labels", "Auto reminders"],
  },
  {
    icon: PhoneCall,
    title: "Escalation Calls",
    description: "Critical academic alerts (probation, missing prerequisites) trigger advisor phone calls.",
    highlights: ["Call scripts", "Outcome logging", "Follow-up tasks"],
  },
];

const AcademicNotifications = () => (
  <EducationPageLayout
    title="Academic Notifications"
    description="Sophisticated notification controls keep learners informed without overwhelming them."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Academic Notifications" },
    ]}
    heroStats={[
      { label: "On-time submissions", value: "+34%" },
      { label: "Average weekly nudges", value: "4.2" },
      { label: "Opt-out rate", value: "<1%" },
      { label: "Advisor interventions", value: "98% within 24h" },
    ]}
    heroActions={
      <Button className="h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800">
        Personalise notifications
      </Button>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Channels"
        title="Notification styles that respect focus"
        description="Each alert carries a clear CTA."
      >
        <InfoCardGrid items={notificationModes} />
      </EducationSection>

      <EducationSection
        eyebrow="Digest"
        title="Daily academic inbox"
        description="Delivered at 06:30 GMT with a clean summary."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-white px-8 py-10 shadow-sm">
          <div className="flex items-center gap-3 text-slate-600">
            <Inbox className="h-5 w-5" />
            <span>Includes deadlines, meeting invites, and recommended study actions.</span>
          </div>
        </div>
      </EducationSection>

      <EducationSection
        eyebrow="Controls"
        title="Students stay in charge"
        description="Transparency builds trust."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: "Mute windows", detail: "Pause alerts during exams or travel." },
            { title: "Channel mix", detail: "Choose push, email, SMS, or WhatsApp per alert type." },
          ].map((control) => (
            <article
              key={control.title}
              className="rounded-3xl border border-slate-200/70 bg-slate-50 px-6 py-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{control.title}</p>
              <p className="mt-2 text-sm text-slate-600">{control.detail}</p>
            </article>
          ))}
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default AcademicNotifications;

