import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { Button } from "@/components/ui/button";
import {
  Microscope,
  FileSearch,
  Database,
  Beaker,
  GitBranch,
  ShieldCheck,
  Globe2,
  Activity,
} from "lucide-react";

const researchStacks: InfoCardItem[] = [
  {
    icon: FileSearch,
    title: "Literature Intelligence",
    description: "Semantic search across Elsevier, PubMed, AJOL, and institutional repositories with AI summarisation.",
    highlights: ["Citation graph", "Methodology clustering", "Auto alerts"],
  },
  {
    icon: Database,
    title: "Data Workbench",
    description: "Secure Jupyter + RStudio pods with GPU support, dataset catalogues, and compliance-ready storage.",
    highlights: ["Versioned datasets", "Notebook templates", "Audit trails"],
  },
  {
    icon: Beaker,
    title: "Lab Companion",
    description: "Digital lab notebooks, reagent trackers, equipment booking, and IoT sensor feeds.",
    highlights: ["21 CFR part 11 mode", "Signature capture", "Anomaly detection"],
  },
  {
    icon: GitBranch,
    title: "Collaboration Hub",
    description: "Git-backed repositories, protocol libraries, and shared review boards for multi-campus teams.",
    highlights: ["Reviewer workflows", "Project Kanban", "Risk register"],
  },
  {
    icon: ShieldCheck,
    title: "Ethics & Compliance",
    description: "IRB templates, consent form generators, and protocol deviation logging with approval timelines.",
    highlights: ["Auto reminders", "Escalation paths", "Approval vault"],
  },
  {
    icon: Globe2,
    title: "Impact Showcases",
    description: "Research profiles, citation trackers, media kits, and partnership-ready summaries.",
    highlights: ["Altmetric scoring", "Press-ready blurbs", "Investor snapshots"],
  },
];

const ResearchTools = () => (
  <EducationPageLayout
    title="Integrated Research Tools"
    description="Equip researchers with enterprise-grade infrastructure while keeping workflows elegant."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Research Tools" },
    ]}
    heroStats={[
      { label: "Active projects", value: "860" },
      { label: "Data sets catalogued", value: "4.6TB" },
      { label: "Ethics approvals this quarter", value: "128" },
      { label: "Average onboarding time", value: "2 days" },
    ]}
    heroActions={
      <div className="flex flex-col gap-3">
        <Button className="h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-500">
          Request research workspace
        </Button>
        <Button variant="outline" className="h-11 rounded-xl border-slate-300">
          Schedule onboarding call
        </Button>
      </div>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Stacks"
        title="A toolchain for every research stage"
        description="Mix and match modules without touching an IT ticket."
      >
        <InfoCardGrid items={researchStacks} />
      </EducationSection>

      <EducationSection
        eyebrow="Observability"
        title="Project telemetry at a glance"
        description="Dashboards aggregate milestones, burn rate, and compliance signals."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-8 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Milestones hit on time", stat: "92%", detail: "teams stay ahead of grant schedules" },
              { label: "Data compliance score", stat: "98.6%", detail: "thanks to auto-enforced retention rules" },
              { label: "Collaboration velocity", stat: "1.8x", detail: "increase in cross-campus publications" },
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

      <EducationSection
        eyebrow="Support"
        title="Research enablement concierge"
        description="Specialists pair with labs to unblock anything from procurement to publication."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Methodology review", body: "Independent statisticians stress-test sample sizes and analysis plans." },
            { title: "Data stewardship", body: "Governance officers ensure storage, sharing, and anonymisation meet mandates." },
            { title: "Impact storytelling", body: "Communications squad shapes grant updates and stakeholder briefings." },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-200/70 bg-white px-6 py-6 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{item.title}</p>
              <p className="mt-3 text-sm text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default ResearchTools;

