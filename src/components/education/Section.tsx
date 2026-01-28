import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "contrast";
  id?: string;
}

export const EducationSection = ({
  title,
  description,
  eyebrow,
  actions,
  children,
  className = "",
  variant = "default",
  id,
}: SectionProps) => {
  const variantClasses = {
    default: "bg-white",
    muted: "education-section-muted",
    contrast: "bg-slate-900 text-white",
  } as const;

  return (
    <section id={id} className={cn("education-section py-16", variantClasses[variant], className)}>
      <div className="container mx-auto px-4 relative z-[1]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow && (
              <p className={cn("text-xs uppercase tracking-[0.3em] text-blue-600 mb-3", variant === "contrast" && "text-amber-200/80")}>
                {eyebrow}
              </p>
            )}
            <h2 className={cn("text-2xl md:text-3xl font-semibold text-slate-900", variant === "contrast" && "text-white")}>
              {title}
            </h2>
            {description && (
              <p className={cn("mt-3 text-base text-slate-600 max-w-3xl", variant === "contrast" && "text-white/80")}>
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
};

