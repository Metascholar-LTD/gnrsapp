import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import {
  Link2,
  Briefcase,
  Award,
  Globe,
  Share2,
  Users,
  Handshake,
  MessageCircle,
} from "lucide-react";

const alumniPrograms: InfoCardItem[] = [
  {
    icon: Handshake,
    title: "Mentor Circles",
    description: "Small-group mentorship anchored by quarterly masterclasses and tailored office hours.",
    highlights: ["Industry-matched pods", "Accountability dashboards", "Shared goal tracking"],
  },
  {
    icon: Briefcase,
    title: "Opportunity Exchange",
    description: "Exclusive job leads, short contracts, and consulting calls sourced directly from alumni leaders.",
    highlights: ["Verified stipends", "Remote + hybrid options", "Fast-track referrals"],
  },
  {
    icon: Award,
    title: "Recognition Board",
    description: "Celebrate alumni impact stories, patents, publications, and social impact ventures.",
    highlights: ["Interactive map", "Media-ready assets", "Nomination workflow"],
  },
];

const AlumniConnect = () => (
  <EducationPageLayout
    title="Alumni Connect"
    description="Bridge current students, recent graduates, and seasoned professionals with purposeful engagements."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Alumni Connect" },
    ]}
    heroStats={[
      { label: "Verified alumni mentors", value: "1,120" },
      { label: "Annual volunteering hours", value: "6,300" },
      { label: "Partner companies", value: "210" },
      { label: "Scholarships funded", value: "₵4.1m" },
    ]}
    heroActions={
      <>
        <HeroButton onClick={() => console.log("Become a mentor")}>
          Become a mentor
        </HeroButton>
        <HeroButton onClick={() => console.log("Submit alumni story")}>
          Submit alumni story
        </HeroButton>
      </>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Programs"
        title="High-touch alumni experiences"
        description="Designed with corporate partners and alumni leaders."
      >
        <InfoCardGrid items={alumniPrograms} />
      </EducationSection>

      <EducationSection
        eyebrow="Global chapters"
        title="Stay connected wherever you are"
        description="Regional leads keep diaspora communities energised."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { region: "Accra", detail: "Monthly salon dinners + policy roundtables." },
            { region: "Kumasi", detail: "Innovation tours + prototyping clinics." },
            { region: "London", detail: "VC insight sessions + recruitment soirees." },
            { region: "Toronto", detail: "Community service drives + career labs." },
          ].map((chapter) => (
            <article
              key={chapter.region}
              className="rounded-3xl border border-slate-200/70 bg-white px-6 py-6 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                <Globe className="h-4 w-4" />
                {chapter.region}
              </div>
              <p className="mt-3 text-sm text-slate-600">{chapter.detail}</p>
            </article>
          ))}
        </div>
      </EducationSection>

      <EducationSection
        eyebrow="Engagement fabric"
        title="Tools that keep alumni relationships alive"
        description="Built-in automations reduce manual admin."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "CRM-grade profiles", detail: "See mentorship history, event attendance, and giving capacity.", icon: Users },
            { title: "Campaign studio", detail: "Launch scholarship or event drives with segmentation controls.", icon: Share2 },
            { title: "Message concierge", detail: "Pre-built copy blocks for invites, thank-yous, and follow-ups.", icon: MessageCircle },
          ].map((item) => (
            <article
              key={item.title}
              className="flex gap-4 rounded-3xl border border-slate-200/70 bg-slate-50 px-6 py-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900">
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
    </div>
  </EducationPageLayout>
);

export default AlumniConnect;

