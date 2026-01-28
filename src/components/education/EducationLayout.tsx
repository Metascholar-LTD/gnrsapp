import { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronsRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HeroStat {
  label: string;
  value: string;
}

type HeroTheme = "indigo" | "amber" | "emerald" | "violet" | "slate";

const THEME_SEQUENCE: HeroTheme[] = ["indigo", "amber", "emerald", "violet", "slate"];

const HERO_THEME_IMAGES: Record<HeroTheme, string[]> = {
  indigo: [
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=80",
  ],
  amber: [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=2000&q=80",
  ],
  emerald: [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1503435824048-a799a3a84bf7?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=2000&q=80",
  ],
  violet: [
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1506059612708-99d6c3e27c4c?auto=format&fit=crop&w=2000&q=80",
  ],
  slate: [
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000&q=80",
  ],
};

const sumCharCodes = (value: string) =>
  value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

const deriveTheme = (title: string, override?: HeroTheme): { theme: HeroTheme; signature: number } => {
  if (override) {
    return { theme: override, signature: sumCharCodes(title || override) };
  }

  const signature = sumCharCodes(title || "education");
  const index = signature % THEME_SEQUENCE.length;
  return { theme: THEME_SEQUENCE[index], signature };
};

interface EducationPageLayoutProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  heroStats?: HeroStat[];
  heroActions?: ReactNode;
  heroStatsActions?: ReactNode;
  heroTheme?: HeroTheme;
  heroImage?: string;
  heroVideo?: string;
  heroVideoPoster?: string;
  descriptionClassName?: string;
  children: ReactNode;
}

type HeroStyle = CSSProperties & {
  "--education-hero-image"?: string;
};

export const EducationPageLayout = ({
  title,
  description,
  breadcrumbs,
  heroStats,
  heroActions,
  heroStatsActions,
  heroTheme,
  heroImage,
  heroVideo,
  heroVideoPoster,
  descriptionClassName,
  children,
}: EducationPageLayoutProps) => {
  const { theme: derivedTheme, signature } = deriveTheme(title, heroTheme);
  const themeGallery = HERO_THEME_IMAGES[derivedTheme] ?? HERO_THEME_IMAGES.indigo;
  const galleryImage = themeGallery[signature % themeGallery.length];
  const chosenHero = heroImage || galleryImage;

  const heroStyles: HeroStyle = {
    "--education-hero-image": `url(${chosenHero})`,
  };

  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />

      <header
        className="education-hero border-b border-white/10 pt-28 pb-20 text-white"
        style={heroStyles}
        data-theme={derivedTheme}
      >
        {heroVideo ? (
          <>
            <video
              className="education-hero__video"
              src={heroVideo}
              poster={heroVideoPoster || chosenHero}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
            <div className="education-hero__video-overlay" aria-hidden="true" />
          </>
        ) : null}
        <div className="hero-glow" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumb className="text-white">
            <BreadcrumbList className="text-[11px] uppercase tracking-[0.35em] text-white">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <div className="flex items-center gap-2" key={`${crumb.label}-${index}`}>
                    <BreadcrumbItem>
                      {crumb.href && !isLast ? (
                        <BreadcrumbLink asChild className="hover:text-white">
                          <Link to={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      ) : isLast ? (
                        <BreadcrumbPage className="text-white">{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink className="hover:text-white text-white" href={crumb.href || "#"}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast ? (
                      <BreadcrumbSeparator className="text-white">
                        <ChevronsRight className="h-3.5 w-3.5" />
                      </BreadcrumbSeparator>
                    ) : null}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl space-y-5 text-white">
              <p className="text-xs uppercase tracking-[0.4em] text-white">Education Hub</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white">
                {title}
              </h1>
              <div className="hero-title-separator" aria-hidden="true" />
              <p className={descriptionClassName || "text-lg md:text-xl text-white leading-relaxed"}>{description}</p>
            </div>

            {heroActions && (
              <div className="flex flex-col gap-3">
                {heroActions}
              </div>
            )}
          </div>

          {heroStats && heroStats.length > 0 && (
            <>
              <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="education-stat-card px-6 py-5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-white">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-semibold mt-2 text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              {heroStatsActions && (
                <div className="mt-16 flex justify-center">
                  {heroStatsActions}
                </div>
              )}
            </>
          )}
        </div>
      </header>

      <main className="education-layout bg-white">{children}</main>

      <Footer />
    </>
  );
};

