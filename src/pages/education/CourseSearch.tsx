import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Compass,
  FileBarChart,
  MapPin,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const discoveryPillars: InfoCardItem[] = [
  {
    icon: Filter,
    title: "Precision Filters",
    description:
      "Search by credit load, delivery mode, prerequisite chain, lecture capacity, and assessment style.",
    highlights: ["AI-suggested alternatives", "Faculty availability alerts", "Lab seat counters"],
  },
  {
    icon: Compass,
    title: "Pathway Builder",
    description:
      "Stack courses into minor pathways, exchange programmes, or professional certifications with guardrails.",
    highlights: ["Conflict detection", "Progress tracking", "Advisor notes"],
  },
  {
    icon: FileBarChart,
    title: "Evidence Layer",
    description: "See graduate outcomes, industry alignment, student ratings, and accreditation notes.",
    highlights: ["Career outcomes charts", "Skills heatmaps", "Tooling requirements"],
  },
];

const CourseSearch = () => (
  <EducationPageLayout
    title="Course-Based Search"
    description="Find courses faster with research-grade filters, predictive insights, and clean summaries any dean would sign off."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Course Search" },
    ]}
    heroStats={[
      { label: "Courses indexed", value: "1,240" },
      { label: "Prerequisite graphs", value: "312" },
      { label: "Avg. search time", value: "14s" },
      { label: "Advisor notes", value: "540+" },
    ]}
    heroActions={
      <Button className="h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800">
        Launch search workspace
      </Button>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Discovery"
        title="Intelligent filters for decisive enrolment"
        description="Send students to the right lecture hall with zero guesswork."
      >
        <InfoCardGrid items={discoveryPillars} columns="grid-cols-1 md:grid-cols-3" />
      </EducationSection>

      <EducationSection
        eyebrow="Live indicators"
        title="Real-time logistics"
        description="Every search result shows availability, delivery mode, and compliance status."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            {
              title: "Seat Tracker",
              detail: "Lecture halls, labs, and tutorials update every 15 minutes with waitlist escalation.",
            },
            {
              title: "Location Engine",
              detail: "Google Maps + campus GIS overlay ensures no one gets lost between labs.",
            },
            {
              title: "Assessment Preview",
              detail: "Breakdown of quizzes, labs, projects, and attendance weights curated from official outlines.",
            },
            {
              title: "Tooling Checklist",
              detail: "Software, lab coats, calculators, or field gear—surfaced before registration closes.",
            },
          ].map((tile) => (
            <article
              key={tile.title}
              className="rounded-3xl border border-slate-200/70 bg-white px-6 py-6 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{tile.title}</p>
              <p className="mt-3 text-sm text-slate-700">{tile.detail}</p>
            </article>
          ))}
        </div>
      </EducationSection>

      <EducationSection
        eyebrow="Guided journeys"
        title="Featured pathways"
        description="Curated combos built with departmental advisors."
        actions={
          <Button variant="outline" className="h-11 rounded-xl border-slate-300">
            Download pathway PDF
          </Button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "AI + Data", campus: "UG / KNUST", detail: "Machine learning spine with ethics electives." },
            { title: "Health Informatics", campus: "UCC / UEW", detail: "Cross-listed courses for public health data roles." },
            { title: "Creative Tech", campus: "GIMPA / AIT", detail: "Design systems + product storytelling track." },
          ].map((path) => (
            <div
              key={path.title}
              className="rounded-3xl border border-slate-200/70 px-6 py-6 hover:border-slate-400 transition"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                {path.campus}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{path.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{path.detail}</p>
              <Button variant="ghost" className="mt-5 h-10 px-0 text-slate-900 hover:bg-transparent">
                View recommended sequence
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default CourseSearch;

