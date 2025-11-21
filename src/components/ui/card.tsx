import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

const destinationCardVariants = cva(
  "relative grid h-full w-full transform-gpu overflow-hidden rounded-xl border shadow-sm transition-all duration-300 ease-in-out group",
  {
    variants: {},
    defaultVariants: {},
  },
);

export interface DestinationCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof destinationCardVariants> {
  imageUrl: string;
  category?: string;
  title?: string;
  children?: React.ReactNode;
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  ({ className, imageUrl, category, title, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(destinationCardVariants({ className }))} {...props}>
        <img
          src={imageUrl}
          alt={title || "Card image"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "https://plus.unsplash.com/premium_photo-1675745323569-01ac2a7f6e13?w=800&auto=format&fit=crop&q=60";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40" />

        <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
          {category && <p className="text-sm font-medium uppercase tracking-wider text-gray-200 mb-2">- {category} -</p>}
          {title && <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl mb-4">{title}</h2>}
          {children}
        </div>
      </div>
    );
  },
);

DestinationCard.displayName = "DestinationCard";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, DestinationCard };
