import { LucideIcon } from "lucide-react";

export interface InfoCardItem {
  icon: LucideIcon;
  title: string;
  description: string;
  meta?: string;
  badge?: string;
  highlights?: string[];
}

interface InfoCardGridProps {
  items: InfoCardItem[];
  columns?: string;
}

export const InfoCardGrid = ({
  items,
  columns = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
}: InfoCardGridProps) => {
  return (
    <div className={`grid gap-6 ${columns}`}>
      {items.map((item, index) => (
        <article
          key={item.title}
          className="education-card px-6 py-7 transition-transform duration-500 hover:-translate-y-1.5"
          data-animate="fade-up"
          data-delay={index % 4}
          style={{ animationDelay: `${(index % 4) * 0.05}s` }}
        >
          <div className="flex items-start gap-4">
            <div className="icon-badge flex h-12 w-12 items-center justify-center rounded-2xl text-slate-900 shadow-inner">
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                {item.badge && (
                  <span className="rounded-full bg-amber-100/70 px-3 py-1 text-xs font-medium text-amber-700">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              {item.highlights && (
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {item.highlights.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <span className="h-1 w-4 rounded-full bg-slate-300" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              {item.meta && (
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  {item.meta}
                </p>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

