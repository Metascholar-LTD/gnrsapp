import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { MapPin, GraduationCap, Globe2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScholarshipCardProps extends Omit<HTMLMotionProps<"div">, "ref" | "children"> {
  imageUrl: string;
  imageAlt: string;
  type: string;
  title: string;
  tag: string;
  location: string;
  description: string;
  bullets: string[];
  statusNote: string;
  isForeign?: boolean;
  href?: string;
  imageLeft?: boolean; // Controls if image is on left or right
}

const ScholarshipCard = React.forwardRef<HTMLDivElement, ScholarshipCardProps>(
  (
    {
      className,
      imageUrl,
      imageAlt,
      type,
      title,
      tag,
      location,
      description,
      bullets,
      statusNote,
      isForeign = false,
      href,
      imageLeft = true,
      ...props
    },
    ref
  ) => {
    const Component = href ? motion.a : motion.div;

    return (
      <Component
        ref={ref as any}
        href={href}
        className={cn(
          "group flex flex-col md:flex-row overflow-hidden rounded-3xl border border-slate-200 bg-white text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg",
          !imageLeft && "md:flex-row-reverse",
          className
        )}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...(props as any)}
      >
        {/* Image Section */}
        <div className="relative md:w-2/5 w-full h-64 md:h-auto overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          {/* Gradient overlay for location readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Location Badge on Image */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-white/20 shadow-lg">
              <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-900">{location}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center p-6 md:p-8 md:w-3/5 space-y-5">
          {/* Type Badge */}
          <div className="flex items-center gap-2">
            {isForeign ? (
              <Globe2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <GraduationCap className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            )}
            <span className="text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-emerald-700">
              {type}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            {title}
          </h3>

          {/* Tag */}
          <p className="text-base md:text-lg text-emerald-700 font-medium">{tag}</p>

          {/* Description */}
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">{description}</p>

          {/* Bullets */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm md:text-base font-semibold text-slate-600">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span>What this window typically covers</span>
            </div>
            <ul className="space-y-2 text-sm md:text-base text-slate-700 leading-relaxed">
              {bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Status Note */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">{statusNote}</p>
          </div>
        </div>
      </Component>
    );
  }
);

ScholarshipCard.displayName = "ScholarshipCard";

export { ScholarshipCard };

