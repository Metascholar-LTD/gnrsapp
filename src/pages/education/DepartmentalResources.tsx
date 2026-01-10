import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import {
  Building2,
  Microscope,
  Stethoscope,
  CircuitBoard,
  Landmark,
  Palette,
  FolderOpen,
  Link2,
} from "lucide-react";

const departmentClusters: InfoCardItem[] = [
  {
    icon: CircuitBoard,
    title: "Engineering & Technology",
    description: "Lab manuals, CAD libraries, version-controlled project templates, and safety certifications.",
    meta: "58 labs • 210 SOPs",
  },
  {
    icon: Microscope,
    title: "Science Colleges",
    description: "Wet lab booking, reagent inventories, instrument calibration logs, and data notebooks.",
    meta: "114 instruments • 24/7 monitoring",
  },
  {
    icon: Stethoscope,
    title: "Health & Allied Sciences",
    description: "Clinical rotation trackers, patient simulation scripts, and ethics board approvals.",
    meta: "36 teaching hospitals",
  },
  {
    icon: Landmark,
    title: "Business & Governance",
    description: "Case libraries, financial datasets, policy briefs, and boardroom-ready slide decks.",
    meta: "420 curated cases",
  },
  {
    icon: Palette,
    title: "Creative & Liberal Arts",
    description: "Studio booking, critique rubrics, anthology packs, and grant application kits.",
    meta: "18 studios • 95 prompts",
  },
  {
    icon: Building2,
    title: "Education & Humanities",
    description: "Practice teaching playbooks, inclusive pedagogy guides, and assessment moderation files.",
    meta: "Faculty-owned wiki",
  },
];

const DepartmentalResources = () => (
  <EducationPageLayout
    title="Departmental Resources"
    description="Give every department a command centre for assets, labs, and academic protocols."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Departmental Resources" },
    ]}
    heroStats={[
      { label: "Departments onboarded", value: "64" },
      { label: "Resource items", value: "3,420" },
      { label: "Active faculty editors", value: "310" },
      { label: "Average request turnaround", value: "6h" },
    ]}
    heroActions={
      <>
        <HeroButton onClick={() => {}}>Launch departmental portal</HeroButton>
        <HeroButton onClick={() => {}}>Submit new resource</HeroButton>
      </>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Clusters"
        title="Tailored collections for each faculty"
        description="Resources stay evergreen with quarterly audits."
      >
        <InfoCardGrid items={departmentClusters} />
      </EducationSection>

      <EducationSection
        eyebrow="Requests"
        title="One queue, zero bottlenecks"
        description="Departments can log requests and track approvals."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-white px-6 py-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Equipment servicing", detail: "Auto-notify technicians before calibration expires." },
              { label: "Curriculum changes", detail: "Version control for syllabi with Senate-ready exports." },
              { label: "Visiting lecturer packs", detail: "Attach NDAs, slides, and timetable slots in one link." },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{item.label}</p>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </EducationSection>

      <EducationSection
        eyebrow="Integrations"
        title="Connected knowledge"
        description="APIs bridge SharePoint, Drive, and local NAS systems."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            { title: "Document mirror", detail: "Auto-sync policies from Google Drive with retention policies.", icon: FolderOpen },
            { title: "Data lake hooks", detail: "Expose lab data to PowerBI dashboards without duplication.", icon: Link2 },
          ].map((integration) => (
            <article
              key={integration.title}
              className="flex gap-4 rounded-3xl border border-slate-200/70 bg-slate-50 px-6 py-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900">
                <integration.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{integration.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{integration.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default DepartmentalResources;

