import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import {
  Sparkles,
  UserCheck,
  Target,
  Cpu,
  Award,
  Activity,
  TrendingUp,
  Brain,
} from "lucide-react";

const recommendationLayers: InfoCardItem[] = [
  {
    icon: Sparkles,
    title: "Personalised Signals",
    description: "Blends GPA, preferred learning style, extracurriculars, and time availability.",
    highlights: ["Learning style tagging", "Calendar sync", "Fatigue-aware pacing"],
  },
  {
    icon: Target,
    title: "Career Alignment",
    description: "Maps skills demand from Ghanaian employers, Udemy skill gaps, and LinkedIn hiring data.",
    highlights: ["Skill gap radar", "Industry badges", "Stackable micro-credentials"],
  },
  {
    icon: Cpu,
    title: "AI Mentor",
    description: "Large-language-model powered coach that explains why each course fits your path.",
    highlights: ["Plain-language insights", "Risk warnings", "Alternative suggestions"],
  },
];

const CourseRecommendations = () => (
  <EducationPageLayout
    title="Course Recommendation Engine"
    description="A human-centered recommendation engine that pairs academic goals with verified labour market intelligence."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Course Recommendations" },
    ]}
    heroStats={[
      { label: "Student profiles trained", value: "12,400" },
      { label: "Advisor overrides", value: "< 4%" },
      { label: "Avg. satisfaction score", value: "4.8/5" },
      { label: "Drop rate reduction", value: "31%" },
    ]}
    heroActions={
      <HeroButton onClick={() => {}}>Build my personalised plan</HeroButton>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Engine"
        title="Recommendation intelligence stack"
        description="Data sources are refreshed weekly to stay career-relevant."
      >
        <InfoCardGrid items={recommendationLayers} />
      </EducationSection>

      <EducationSection
        eyebrow="Advisor co-pilot"
        title="Human in the loop"
        description="Faculty and career advisors can tweak or endorse plans with one click."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Advisor console",
              detail: "See rationale, risk indicators, and prerequisite conflicts before approving.",
              icon: UserCheck,
            },
            {
              title: "What-if simulator",
              detail: "Swap courses and recalculate graduation timeline instantly.",
              icon: Activity,
            },
            {
              title: "Performance watchlist",
              detail: "Students receive nudges when engagement drops or grades slip.",
              icon: TrendingUp,
            },
            {
              title: "Wellbeing guardrails",
              detail: "Flags overload, commuting stress, and overlapping lab slots.",
              icon: Brain,
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
        eyebrow="Impact"
        title="Outcome analytics"
        description="Aggregated dashboards prove the engine works."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-6 py-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Graduation velocity", stat: "1.3 semesters faster", detail: "for students following plans" },
              { label: "Internship placement", stat: "+42%", detail: "lift in field-aligned placements" },
              { label: "Scholarship eligibility", stat: "2x increase", detail: "in students meeting GPA thresholds" },
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

export default CourseRecommendations;

