import { EducationPageLayout } from "@/components/education/EducationLayout";
import { EducationSection } from "@/components/education/Section";
import { InfoCardGrid, InfoCardItem } from "@/components/education/InfoCardGrid";
import { HeroButton } from "@/components/education/HeroButton";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Users,
  Shield,
  Sparkles,
  ThumbsUp,
  BookOpen,
  BellRing,
} from "lucide-react";

const forumSpaces: InfoCardItem[] = [
  {
    icon: MessageCircle,
    title: "Course Hubs",
    description: "Threaded discussions tied to each course with pinned resources and staff responses.",
    highlights: ["Markdown + LaTeX support", "Best answer markers", "Transcript search"],
  },
  {
    icon: Users,
    title: "Communities of Practice",
    description: "Cross-campus communities for research areas, interests, and career guilds.",
    highlights: ["Monthly syncs", "Shared labs", "Mentor badges"],
  },
  {
    icon: Shield,
    title: "Moderated Channels",
    description: "Safety-first moderation, real-name policy, and AI-assisted flagging keep discourse respectful.",
    highlights: ["Code of conduct", "24/7 escalation", "Crisis response playbook"],
  },
];

const DiscussionForums = () => (
  <EducationPageLayout
    title="Discussion Forums"
    description="Premium, noise-free forums where lecturers, tutors, and students collaborate in real time."
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Education Hub" },
      { label: "Discussion Forums" },
    ]}
    heroStats={[
      { label: "Monthly contributors", value: "18K" },
      { label: "Courses covered", value: "420" },
      { label: "Resolved questions", value: "72K" },
      { label: "Average response time", value: "23 mins" },
    ]}
    heroActions={
      <HeroButton onClick={() => console.log("Join a featured discussion")}>
        Join a featured discussion
      </HeroButton>
    }
  >
    <div className="space-y-16">
      <EducationSection
        eyebrow="Communities"
        title="Spaces built for academic rigor"
        description="Every forum inherits course metadata for smarter search and tagging."
      >
        <InfoCardGrid items={forumSpaces} />
      </EducationSection>

      <EducationSection
        eyebrow="Engagement design"
        title="Proof of participation"
        description="Students earn meaningful recognition, not vanity metrics."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Scholarly badges", detail: "Badges only unlock after peer review or staff endorsement.", icon: Sparkles },
            { title: "Insightful votes", detail: "Weighted upvotes from faculty count higher in ranking algorithms.", icon: ThumbsUp },
            { title: "Reading lists", detail: "Threads can be converted into annotated reading lists for revision.", icon: BookOpen },
          ].map((feature) => (
            <article
              key={feature.title}
              className="flex gap-4 rounded-3xl border border-slate-200/70 bg-white px-6 py-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-900">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </EducationSection>

      <EducationSection
        eyebrow="Signal routing"
        title="Never miss what matters"
        description="Notifications are precise and unobtrusive."
      >
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 px-8 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-slate-600">
              <BellRing className="h-5 w-5" />
              <span>Digest delivered at 07:00 GMT daily</span>
            </div>
            <Button variant="outline" className="h-10 rounded-xl border-slate-300">
              Configure alerts
            </Button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { label: "Course watch", detail: "Only alerts you when your lecturer posts." },
              { label: "Keyword radar", detail: "Follow tags like ‘thesis’, ‘lab safety’, or ‘funding call’." },
              { label: "Study buddy", detail: "Instant ping when your accountability partner completes a task." },
            ].map((rule) => (
              <div key={rule.label}>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{rule.label}</p>
                <p className="mt-2 text-sm text-slate-600">{rule.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </EducationSection>
    </div>
  </EducationPageLayout>
);

export default DiscussionForums;

