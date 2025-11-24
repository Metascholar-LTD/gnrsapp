import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { Button } from "@/components/ui/button";
import { Bookmark, Folder, Share, Cloud, Lock, Tag } from "lucide-react";

const resourceFeatures: InfoCardItem[] = [
  {
    icon: Bookmark,
    title: "Save Anything",
    description: "Lecture notes, past questions, e-books, and forum posts live in one clean space.",
    highlights: ["One-click saving", "Automatic tagging", "Preview cards"],
  },
  {
    icon: Folder,
    title: "Collections",
    description: "Organise resources by semester, course, or project with cover art and descriptions.",
    highlights: ["Nested folders", "Timeline view", "Shared access"],
  },
  {
    icon: Share,
    title: "Collaborative Shelves",
    description: "Invite study partners or mentors to curated shelves with view or edit permissions.",
    highlights: ["Activity log", "Comment threads", "Version history"],
  },
];

const MyResources = () => (
  <EducationPageLayout
    title="My Saved Resources"
    description="A private workspace that keeps premium study materials tidy, secure, and ready to share."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "My Resources" },
    ]}
    heroStats={[
      { label: "Average resources saved", value: "124 / student" },
      { label: "Shared shelves", value: "2,140" },
      { label: "Cloud sync uptime", value: "99.9%" },
      { label: "Storage provided", value: "15GB" },
    ]}
    heroActions={
      <Button className="h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-500">
        Organise my library
      </Button>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Features"
        title="Carry your study archive everywhere"
        description="Files stay synced across devices with rich metadata."
      >
        <InfoCardGrid items={resourceFeatures} />
      </EducationSection>

      <EducationSection
        eyebrow="Metadata intelligence"
        title="Smarter discovery"
        description="Tags, filters, and quick search keep you efficient."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Auto-tagging", detail: "Detects course codes, faculties, and exam types automatically.", icon: Tag },
            { title: "Versioning", detail: "Keeps past iterations of notes or solutions accessible.", icon: Cloud },
            { title: "Privacy controls", detail: "Lock sensitive notes with passcodes or two-factor unlock.", icon: Lock },
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
        eyebrow="Sharing"
        title="Effortless collaboration"
        description="Give your team access with proper controls."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-8 py-10">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Link sharing", detail: "Generate expiring links with download/report options." },
              { label: "Mentor reviews", detail: "Mentors can annotate PDF or video resources inline." },
              { label: "Export bundles", detail: "Package collections into zipped study kits with one click." },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{item.label}</p>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default MyResources;

