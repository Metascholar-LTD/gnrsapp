import { ReactNode, useState } from "react";
import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
} from "lucide-react";

type CourseEntry = {
  id: string;
  course: string;
  credits: number;
  grade: keyof typeof gradeScale;
};

const gradeScale = {
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  F: 0,
};

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const defaultRows: CourseEntry[] = [
  { id: "row-1", course: "Advanced Calculus", credits: 3, grade: "A" },
  { id: "row-2", course: "Thermodynamics", credits: 2, grade: "B+" },
  { id: "row-3", course: "Technical Communication", credits: 2, grade: "A" },
];

const studyTabs = ["Overview", "Course load", "Advisor sync"];

const academicHighlights = [
  {
    label: "Current CGPA",
    value: "3.72",
    delta: "+0.12 vs last term",
    color: "text-emerald-400",
  },
  {
    label: "Credits in progress",
    value: "18",
    delta: "12 core • 6 electives",
    color: "text-sky-300",
  },
  {
    label: "Scholarship readiness",
    value: "On track",
    delta: "Next audit: Apr 22",
    color: "text-amber-300",
  },
];

const focusRoadmap = [
  {
    title: "Midterm Recovery Playbook",
    note: "Boost Thermodynamics by backing off 2 credit labs",
    stat: "Focus hours: 6 / week",
    image: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg",
  },
  {
    title: "Advisor Sync Packet",
    note: "Send CGPA snapshot + attendance proof before Friday",
    stat: "Checklist: 4 of 6 complete",
    image: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg",
  },
  {
    title: "Scholarship Evidence Vault",
    note: "Auto-exported transcripts, rubric & narrative bullets",
    stat: "Updated 2 hours ago",
    image: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392704/portrait-young-woman-with-laptop-hands-outside-school_yktf28.jpg",
  },
];

type HeroButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

const heroButtonClasses =
  "group relative inline-flex items-center gap-1 sm:gap-1.5 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border-2 border-white/40 bg-gradient-to-br from-white/45 via-white/25 to-white/40 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-900 shadow-md transition-all duration-500 hover:scale-[1.02] hover:shadow-white/30 active:scale-95";

const HeroButton = ({ onClick, children }: HeroButtonProps) => (
  <button type="button" onClick={onClick} className={heroButtonClasses}>
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full transition-transform duration-1000 ease-out group-hover:translate-x-full" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <span className="relative z-10 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-slate-900">{children}</span>
  </button>
);

const CgpaCalculator = () => {
  const [courses, setCourses] = useState<CourseEntry[]>(defaultRows);

  const updateCourse = (id: string, key: keyof CourseEntry, value: string) => {
    setCourses((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: key === "credits" ? Number(value) || 0 : value,
            }
          : item
      )
    );
  };

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: createId(), course: `Course ${prev.length + 1}`, credits: 3, grade: "B" },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses((prev) => (prev.length === 1 ? prev : prev.filter((item) => item.id !== id)));
  };

  const totalCredits = courses.reduce((sum, item) => sum + (item.credits || 0), 0);
  const totalPoints = courses.reduce(
    (sum, item) => sum + (item.credits || 0) * gradeScale[item.grade],
    0
  );
  const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  return (
    <EducationPageLayout
      title="CGPA Calculator"
      description=""
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Education Hub" },
        { label: "CGPA Calculator" },
      ]}
      heroTheme="emerald"
      heroVideo="https://res.cloudinary.com/dsypclqxk/video/upload/v1756304053/consult_ss4dm2.mp4"
      heroStats={[
        { label: "Students tracking CGPA", value: "9,860" },
        { label: "Grade scales supported", value: "4" },
        { label: "Scholarship alerts triggered", value: "1,120" },
        { label: "Advisor interventions", value: "640" },
      ]}
      heroActions={
        <>
          <HeroButton onClick={() => {}}>Export summary</HeroButton>
          <HeroButton onClick={() => {}}>Sync with advisor</HeroButton>
        </>
      }
    >
      <div className="space-y-8 sm:space-y-12 lg:space-y-16">
        <EducationSection
          eyebrow="Workspace inspiration"
          title="Bring research-grade polish to your study tools"
          description="We mocked up a desktop-grade academic cockpit so the CGPA hub feels like a real analytics workstation. Swap in your own panels, embed live calculators, or mirror advisor dashboards."
        >
          <div className="grid items-center gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-[1.05fr_1.2fr]">
            <div className="space-y-6 sm:space-y-8" data-animate="fade-up">
              <div>
                <p className="text-2xl sm:text-3xl font-semibold text-slate-900">Stage your CGPA mission control</p>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
                  The framed mock laptop mirrors what students expect from a premium learning OS:
                  top tabs, live CGPA telemetry, and advisor-ready action cards. Plug in real data
                  feeds or keep it as a hero visual.it immediately tells a story.
                </p>
              </div>
              <dl className="grid gap-4 sm:gap-6 sm:grid-cols-3">
                {[
                  { label: "Advising sessions", value: "24 / month" },
                  { label: "Scholarships tracked", value: "18 active" },
                  { label: "Playbooks", value: "42 templates" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 sm:p-5 shadow-sm">
                    <dt className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-slate-500">{stat.label}</dt>
                    <dd className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500">
                {["Planner", "Scholarships", "Advisor view", "Sync log", "Focus mode"].map((filter) => (
                  <span
                    key={filter}
                    className="rounded-full border border-slate-200/80 bg-white/70 px-3 sm:px-4 py-1 font-medium text-slate-700"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="relative isolate mx-auto w-full max-w-full sm:max-w-[500px] lg:max-w-[680px]"
              data-animate="fade-up"
              data-delay="1"
            >
              <div className="pointer-events-none absolute inset-x-4 sm:inset-x-8 lg:inset-x-10 top-4 sm:top-5 lg:top-6 h-6 sm:h-7 lg:h-8 rounded-full bg-emerald-200/40 blur-2xl" />
              <div className="rounded-[24px] sm:rounded-[28px] lg:rounded-[36px] border border-slate-900/30 bg-gradient-to-b from-slate-950 to-slate-900 p-4 sm:p-5 lg:p-6 text-white shadow-[0_40px_120px_rgba(15,23,42,0.55)]">
                <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 rounded-xl sm:rounded-2xl border border-white/5 bg-slate-950/60 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
                    <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-500" />
                    <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-2 sm:ml-3 text-[10px] sm:text-xs font-semibold tracking-[0.35em] sm:tracking-[0.45em] uppercase text-slate-500 hidden sm:inline">
                      StudyOS
                    </span>
                  </div>
                  <div className="flex flex-1 justify-center gap-1 sm:gap-2 rounded-full bg-slate-900/70 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-slate-400">
                    {studyTabs.map((tab) => (
                      <span key={tab} className="px-1 sm:px-2 py-0.5 text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] text-white/70 first:text-emerald-300">
                        {tab}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
                    <span className="text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] hidden sm:inline">21:45</span>
                    <span className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 rounded-full bg-slate-800" />
                  </div>
                </div>
                <div className="mt-4 sm:mt-5 lg:mt-6 space-y-4 sm:space-y-5">
                  <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:p-5 shadow-inner">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-slate-400">
                      <span>CGPA tracker</span>
                      <span className="text-emerald-300">Live sync</span>
                    </div>
                    <div className="mt-4 sm:mt-5 grid gap-3 sm:gap-4 md:grid-cols-3">
                      {academicHighlights.map((highlight) => (
                        <div
                          key={highlight.label}
                          className="rounded-xl border border-white/10 bg-slate-900/50 p-3 sm:p-4"
                        >
                          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-slate-400">{highlight.label}</p>
                          <p className={`mt-2 sm:mt-3 text-xl sm:text-2xl font-semibold ${highlight.color}`}>{highlight.value}</p>
                          <p className="mt-1 text-xs sm:text-sm text-slate-400">{highlight.delta}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-4 sm:p-5">
                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-slate-400">
                      Focus roadmap
                    </p>
                    <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                      {focusRoadmap.map((item) => (
                        <article
                          key={item.title}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-white/5 bg-slate-950/40 p-3 sm:p-4"
                        >
                          <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl border border-white/15">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base font-semibold text-white">{item.title}</p>
                            <p className="text-xs sm:text-sm text-slate-300 mt-1">{item.note}</p>
                          </div>
                          <div className="rounded-full border border-white/15 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-medium text-slate-200 w-full sm:w-auto text-center sm:text-left">
                            {item.stat}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto mt-4 sm:mt-5 lg:mt-6 h-8 sm:h-9 lg:h-10 w-[85%] sm:w-[83%] lg:w-[82%] rounded-b-[32px] sm:rounded-b-[38px] lg:rounded-b-[44px] border border-slate-900/40 bg-slate-900 shadow-[0_15px_30px_rgba(15,23,42,0.35)]" />
              <div className="mx-auto mt-2 sm:mt-2.5 lg:mt-3 h-2.5 sm:h-2.5 lg:h-3 w-[60%] sm:w-[59%] lg:w-[58%] rounded-full bg-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.45)]" />
              <div className="mx-auto mt-1.5 sm:mt-2 h-1 sm:h-1.5 w-[52%] sm:w-[51%] lg:w-[50%] rounded-full bg-slate-600/80 blur-[1px]" />
            </div>
          </div>
        </EducationSection>

        <div className="relative isolate overflow-hidden rounded-[24px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[56px] border border-white/10 shadow-[0_45px_120px_rgba(10,10,20,0.45)] mx-2 sm:mx-4 md:mx-0" data-animate="fade-up">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=2000&q=80"
            alt="Students collaborating"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#17141e]/85" />
          <EducationSection
            eyebrow="Calculator"
            title="Compute your CGPA in seconds"
            description="Add your courses, credits, and grades. The calculator automatically derives total quality points."
            variant="contrast"
            className="relative z-10 !bg-transparent !bg-none text-white [&::after]:hidden"
          actions={
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <HeroButton onClick={() => setCourses(defaultRows)}>
                Reset rows
              </HeroButton>
              <HeroButton onClick={addCourse}>
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Add course
              </HeroButton>
            </div>
          }
          >
            <div
              className="rounded-[20px] sm:rounded-[24px] md:rounded-[32px] border border-white/20 bg-white/95 p-4 sm:p-5 md:p-6 shadow-[0_30px_80px_rgba(15,23,42,0.25)] backdrop-blur text-slate-900"
            >
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] sm:grid-cols-[3fr_1fr_1fr_auto] gap-2 sm:gap-3 md:gap-4 rounded-xl sm:rounded-2xl bg-slate-50/70 px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-[9px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-slate-700">
                <span className="text-slate-700 truncate">Course title</span>
                <span className="text-slate-700 text-center sm:text-left">Credits</span>
                <span className="text-slate-700 text-center sm:text-left">Grade</span>
                <span />
              </div>
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="grid grid-cols-[2fr_1fr_1fr_auto] sm:grid-cols-[3fr_1fr_1fr_auto] gap-2 sm:gap-3 md:gap-4 rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white p-3 sm:p-4 shadow-sm"
                    data-animate="fade-up"
                    data-delay="1"
                  >
                    <Input
                      value={course.course}
                      onChange={(e) => updateCourse(course.id, "course", e.target.value)}
                      placeholder="Course name"
                      className="h-10 sm:h-11 rounded-lg sm:rounded-xl border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 bg-white"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={course.credits}
                      onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                      className="h-10 sm:h-11 rounded-lg sm:rounded-xl border-slate-200 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 bg-white"
                    />
                    <Select
                      value={course.grade}
                      onValueChange={(value) => updateCourse(course.id, "grade", value as keyof typeof gradeScale)}
                    >
                      <SelectTrigger className="h-10 sm:h-11 rounded-lg sm:rounded-xl border-slate-200 text-sm sm:text-base text-slate-900 bg-white [&>span]:text-slate-900">
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-900">
                        {Object.entries(gradeScale).map(([letter]) => (
                          <SelectItem key={letter} value={letter} className="text-slate-900 focus:bg-slate-100 focus:text-slate-900">
                            {letter}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl text-slate-600 hover:text-red-600 p-0" onClick={() => removeCourse(course.id)} disabled={courses.length === 1}>
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {[
                  { label: "Total credits", value: totalCredits },
                  { label: "Total quality points", value: totalPoints.toFixed(2) },
                  { label: "Current CGPA", value: cgpa },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl sm:rounded-2xl border border-slate-100 bg-white/80 p-4 sm:p-5 shadow-inner transition-transform hover:-translate-y-1"
                    data-animate="fade-up"
                    data-delay="2"
                  >
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-slate-600 font-semibold">{metric.label}</p>
                    <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </EducationSection>
        </div>
      </div>
    </EducationPageLayout>
  );
};

export default CgpaCalculator;

