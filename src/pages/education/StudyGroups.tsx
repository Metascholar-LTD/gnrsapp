import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import {
  Users2,
  Timer,
  Calendar,
  MapPin,
  Crown,
  MessageCircle,
  Laptop,
} from "lucide-react";

const groupModels: InfoCardItem[] = [
  {
    icon: Users2,
    title: "Micro Pods",
    description: "3–5 learners with matching schedules and learning styles for hyper-focused sessions.",
    highlights: ["Peer accountability", "Shared resource vault", "Goal tracking"],
  },
  {
    icon: Calendar,
    title: "Faculty-led Studios",
    description: "Lecturers host themed sessions for complex topics or exam prep weeks.",
    highlights: ["Structured agendas", "Model answers", "Attendance credits"],
  },
  {
    icon: Laptop,
    title: "Virtual Cohorts",
    description: "Video-first study circles with collaborative whiteboards and note-taking templates.",
    highlights: ["Breakout facilitation", "Auto recordings", "Action recap emails"],
  },
];

const StudyGroups = () => (
  <EducationPageLayout
    title="Study Groups"
    description="Smart matching, precise scheduling, and rich facilitation assets ensure every study session ships results."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Study Groups" },
    ]}
    heroStats={[
      { label: "Active groups", value: "860" },
      { label: "Average attendance", value: "92%" },
      { label: "Weekly study hours logged", value: "3,400" },
      { label: "Peer-led sessions", value: "68%" },
    ]}
    heroActions={
      <>
        <HeroButton onClick={() => console.log("Create a group")}>Create a group</HeroButton>
        <HeroButton onClick={() => console.log("Find an open slot")}>Find an open slot</HeroButton>
      </>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Formats"
        title="Group models for every goal"
        description="Matching considers location, proficiency, and commitment level."
      >
        <InfoCardGrid items={groupModels} />
      </EducationSection>

      <EducationSection
        eyebrow="Operations"
        title="Session logistics made seamless"
        description="No more endless chats to coordinate timing."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Smart scheduler", detail: "Auto-finds overlapping free slots via synced calendars.", icon: Timer },
            { title: "Location concierge", detail: "Books library pods or Zoom rooms with one tap.", icon: MapPin },
            { title: "Facilitator roster", detail: "Rotates leadership duties and shares agenda templates.", icon: Crown },
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
        eyebrow="Insights"
        title="Track commitment and momentum"
        description="Analytics highlight what’s working."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-8 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Average weekly tasks completed", stat: "14", detail: "per micro pod" },
              { label: "Peer review notes shared", stat: "2,300", detail: "across design studios" },
              { label: "Confidence lift", stat: "+37%", detail: "self-reported improvement after 4 sessions" },
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

export default StudyGroups;

