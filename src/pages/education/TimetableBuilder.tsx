import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Layers,
  RefreshCw,
  AlarmClock,
  Map,
  Share2,
  PenTool,
} from "lucide-react";

const builderFeatures: InfoCardItem[] = [
  {
    icon: Calendar,
    title: "Drag-and-Drop Grid",
    description: "Build weekly and block schedules with conflict detection and colour-coded categories.",
    highlights: ["Keyboard shortcuts", "Template library", "Print-ready export"],
  },
  {
    icon: RefreshCw,
    title: "Auto-Reflow",
    description: "When course times change, schedules adjust while preserving study and work slots.",
    highlights: ["Batch edits", "Priority ranking", "What-if simulations"],
  },
  {
    icon: Layers,
    title: "Multi-Calendar View",
    description: "Stack lectures, tutorials, internships, and personal commitments into layers.",
    highlights: ["Toggle visibility", "Color presets", "Collaboration mode"],
  },
];

const TimetableBuilder = () => (
  <EducationPageLayout
    title="Timetable Builder"
    description="Architect a balanced week with enterprise-grade scheduling intelligence."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Timetable Builder" },
    ]}
    heroStats={[
      { label: "Schedules generated", value: "14,200" },
      { label: "Conflicts prevented", value: "3,180" },
      { label: "Personal events synced", value: "9,450" },
      { label: "Shared planners", value: "2,360" },
    ]}
    heroActions={
      <HeroButton onClick={() => {}}>Launch builder</HeroButton>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Core features"
        title="Plan smarter, not harder"
        description="Inspired by the precision of Elsevier editorial timelines and Udemy cohort planners."
      >
        <InfoCardGrid items={builderFeatures} />
      </EducationSection>

      <EducationSection
        eyebrow="Automation"
        title="Logistics handled for you"
        description="The builder keeps track of everything, so you can focus on learning."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Smart reminders",
              detail: "Adaptive nudges for commutes, room changes, and lab prep.",
              icon: AlarmClock,
            },
            {
              title: "Campus-aware routing",
              detail: "Overlay travel time between lecture halls with buffer suggestions.",
              icon: Map,
            },
            {
              title: "Shareable views",
              detail: "Send your timetable to accountability partners or advisors with one link.",
              icon: Share2,
            },
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
        eyebrow="Template gallery"
        title="Start from best-practice layouts"
        description="Curated by academic advisors across major programmes."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-8 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Engineering", detail: "Lab-heavy schedule with recovery afternoons." },
              { label: "Business & law", detail: "Case prep blocks + moot court rehearsals." },
              { label: "Creative arts", detail: "Studio time with daylight priority and critique slots." },
            ].map((template) => (
              <div key={template.label}>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{template.label}</p>
                <p className="mt-2 text-sm text-slate-600">{template.detail}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-8 h-10 rounded-xl border-slate-300">
            <PenTool className="mr-2 h-4 w-4" />
            Request a custom template
          </Button>
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default TimetableBuilder;

