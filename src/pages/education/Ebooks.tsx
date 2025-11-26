import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import {
  Library,
  Globe,
  Layers,
  BookMarked,
  LineChart,
  Shield,
  CloudDownload,
  Server,
} from "lucide-react";

const ebookShelves: InfoCardItem[] = [
  {
    icon: Globe,
    title: "Global Open Textbooks",
    description: "Peer-reviewed OER titles from Elsevier, OpenStax, MIT Press, and African Journals Online.",
    meta: "132 textbooks • DOI verified",
    highlights: ["Interactive figures", "Instructor slides", "Question banks"],
  },
  {
    icon: BookMarked,
    title: "Ghana Curriculum Companions",
    description: "Locally authored e-books aligned to NAB, NCTE, and NaCCA guidelines with campus adoption notes.",
    meta: "68 titles • Multi-campus license",
    highlights: ["Case-based learning", "Local data sets", "Community practice prompts"],
  },
  {
    icon: LineChart,
    title: "Industry Briefings",
    description: "Reports, whitepapers, and playbooks for finance, energy, agritech, and public policy briefs.",
    meta: "96 publications • Updated quarterly",
    highlights: ["Executive summaries", "Infographics", "Suggested discussion questions"],
  },
  {
    icon: Layers,
    title: "Micro-PDF Kits",
    description: "15–30 page guides for labs, field work, software tutorials, and professional certifications.",
    meta: "210 kits • Mobile optimised",
    highlights: ["Checklist templates", "Glossaries", "Embedded practice files"],
  },
  {
    icon: Library,
    title: "Reader Clubs",
    description: "Curated reading pathways with pacing guides, reflection prompts, and facilitator notes.",
    meta: "12 multidisciplinary clubs",
    highlights: ["Session outlines", "Audio companions", "Assessment rubrics"],
  },
  {
    icon: Shield,
    title: "Rights & Compliance",
    description: "Legal readiness, academic integrity, data protection, and research ethics bundles.",
    meta: "18 compliance kits",
    highlights: ["Policy explainers", "Checklist dashboards", "Sample reports"],
  },
];

const accessModels = [
  { label: "Unlimited campus seats", detail: "Single sign-on with auto seat recycling every 24 hours." },
  { label: "Offline first", detail: "Download-later queue with watermarking and recall reminders." },
  { label: "Annotation sync", detail: "Highlighting and shared notes across cohorts with instructor moderation." },
];

const Ebooks = () => (
  <EducationPageLayout
    title="E-books & Training Resources"
    description=""
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "E-books Library" },
    ]}
    heroStats={[
      { label: "Titles licensed", value: "506" },
      { label: "Avg. monthly readers", value: "41K" },
      { label: "Interactive workbooks", value: "78" },
      { label: "Faculty curated lists", value: "132" },
    ]}
    heroActions={
      <>
        <HeroButton onClick={() => console.log("Launch library portal")}>Launch library portal</HeroButton>
        <HeroButton onClick={() => console.log("Request institutional license")}>Request institutional license</HeroButton>
      </>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Shelving logic"
        title="Collections engineered for deep focus"
        description="Clean metadata, DOI sync, and faculty-approved abstracts keep browsing frictionless."
      >
        <InfoCardGrid items={ebookShelves} />
      </EducationSection>

      <EducationSection
        eyebrow="Access model"
        title="Seamless reading experiences"
        description="Responsive readers with low-bandwidth fallback ensure performance even on campus Wi-Fi."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {accessModels.map((model) => (
            <div key={model.label} className="rounded-3xl border border-slate-200/70 px-6 py-6">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{model.label}</p>
              <p className="mt-3 text-base text-slate-700">{model.detail}</p>
            </div>
          ))}
        </div>
      </EducationSection>

      <EducationSection
        eyebrow="Infrastructure"
        title="Archival-grade delivery"
        description="Files are mirrored across object storage and on-prem caches for continuity."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-6 py-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: CloudDownload,
                heading: "Adaptive downloads",
                body: "Smart compression with retina-quality charts and auto-cleanup reminders.",
              },
              {
                icon: Server,
                heading: "Redundant hosting",
                body: "Multi-region storage with 99.9% uptime and daily checksum verification.",
              },
              {
                icon: Library,
                heading: "Discovery layer",
                body: "AI search with course tags, faculty picks, and personalised recommendations.",
              },
            ].map((item) => (
              <div key={item.heading} className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{item.heading}</h4>
                  <p className="mt-2 text-sm text-slate-600">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default Ebooks;

