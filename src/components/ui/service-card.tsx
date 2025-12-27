import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

// CVA for card variants
const cardVariants = cva(
  "relative flex flex-col justify-between w-full p-4 overflow-hidden rounded-xl shadow-sm transition-shadow duration-300 ease-in-out group hover:shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-slate-50 text-slate-900 border border-slate-200/60 hover:border-slate-300/50",
        blue: "bg-slate-50/90 text-slate-900 border border-slate-200/50 hover:border-slate-300/60",
        gray: "bg-slate-100/70 text-slate-900 border border-slate-300/40 hover:border-slate-400/50",
        red: "bg-slate-50/80 text-slate-900 border border-slate-200/40 hover:border-slate-300/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ServiceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * The main title of the card.
   */
  title: string;
  /**
   * The URL the card's link should point to.
   */
  href: string;
  /**
   * The source URL for the decorative image.
   */
  imgSrc: string;
  /**
   * The alt text for the decorative image, for accessibility.
   */
  imgAlt: string;
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ className, variant, title, href, imgSrc, imgAlt, ...props }, ref) => {
    
    // Animation variants for Framer Motion
    const cardAnimation = {
      hover: {
        scale: 1.02,
        transition: { duration: 0.3 },
      },
    };

    const imageAnimation = {
      hover: {
        scale: 1.1,
        rotate: 3,
        x: 10,
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    };
    
    const arrowAnimation = {
        hover: {
            x: 5,
            transition: { duration: 0.3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" as const },
        }
    }

    return (
      <motion.div
        className={cn(cardVariants({ variant, className }))}
        ref={ref}
        variants={cardAnimation}
        whileHover="hover"
        {...props}
      >
        <div className="relative z-10 flex flex-col h-full">
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <a
            href={href}
            aria-label={`Learn more about ${title}`}
            className="mt-auto flex items-center text-xs font-semibold text-slate-700 hover:text-slate-900 group-hover:underline transition-colors"
          >
            DOWNLOAD
            <motion.div variants={arrowAnimation}>
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </motion.div>
          </a>
        </div>
        
        <motion.img
          src={imgSrc}
          alt={imgAlt}
          className="absolute -right-6 -bottom-6 w-32 h-32 object-contain opacity-90 group-hover:opacity-100"
          variants={imageAnimation}
        />
      </motion.div>
    );
  }
);
ServiceCard.displayName = "ServiceCard";

export { ServiceCard };

