import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HotelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hotelId: string;
  name: string;
  location: string;
  rating?: number;
  description?: string;
  imageUrl: string;
  images?: string[]; // Array of images for navigation
  amenities?: string[];
}

const HotelCard = React.forwardRef<HTMLDivElement, HotelCardProps>(
  (
    {
      className,
      hotelId,
      name,
      location,
      rating,
      description,
      imageUrl,
      images,
      amenities,
      ...props
    },
    ref
  ) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);

    // Combine imageUrl with images array, using imageUrl as first image if images array exists
    const allImages = images && images.length > 0 ? images : [imageUrl];
    const hasMultipleImages = allImages.length > 1;

    const goToPrevious = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    const goToNext = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-2xl border border-[hsl(40_20%_88%)] bg-white text-[hsl(220_30%_15%)] shadow-lg",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <div className="flex flex-col">
          {/* Image Section - Top */}
          <div className="relative h-48 w-full overflow-hidden">
            <motion.img
              key={currentImageIndex}
              src={allImages[currentImageIndex]}
              alt={`${name} - Image ${currentImageIndex + 1}`}
              className="h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Rating Badge - Top Right */}
            {rating && (
              <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 shadow-md">
                <span className="text-sm font-semibold text-[hsl(220_30%_15%)]">
                  {rating}
                </span>
                <span className="text-yellow-500 text-sm">★</span>
              </div>
            )}
            
            {/* Image Navigation Buttons - Only show on hover and if multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrevious}
                  className={cn(
                    "absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[hsl(220_30%_15%)] shadow-md transition-all duration-200 hover:bg-white hover:scale-110",
                    isHovered ? "opacity-100" : "opacity-0"
                  )}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={goToNext}
                  className={cn(
                    "absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[hsl(220_30%_15%)] shadow-md transition-all duration-200 hover:bg-white hover:scale-110",
                    isHovered ? "opacity-100" : "opacity-0"
                  )}
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
                
                {/* Image Indicators */}
                <div className={cn(
                  "absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 transition-opacity duration-200",
                  isHovered ? "opacity-100" : "opacity-0"
                )}>
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-200",
                        index === currentImageIndex
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/60 hover:bg-white/80"
                      )}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Text Content Section - Bottom */}
          <div className="relative z-10 flex h-full flex-col p-6">
            <div className="mb-3">
              <p className="mb-1 text-xs font-medium text-[hsl(220_15%_45%)] uppercase tracking-wide">
                {location}
              </p>
              <h3 className="mb-2 text-xl font-bold tracking-tight text-[hsl(220_30%_15%)] line-clamp-2">
                {name}
              </h3>
            </div>

            {description && (
              <p className="mb-4 line-clamp-2 text-sm text-[hsl(220_20%_40%)] leading-relaxed">
                {description}
              </p>
            )}

            <div className="mt-auto flex items-center justify-end">
              <Link 
                to={`/directories/hotels/${hotelId}`} 
                className="group relative inline-block text-sm font-medium text-[hsl(220_30%_15%)] transition-colors duration-300 hover:text-[hsl(220_20%_40%)]"
              >
                <motion.span
                  className="relative inline-block pb-1"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  View More
                  <span
                    className="absolute bottom-0 left-0 h-[2px] bg-[#60a5fa] transition-all duration-300 group-hover:bg-[#3b82f6]"
                    style={{
                      width: 'calc(100% + 14px)',
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                    }}
                  />
                </motion.span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

HotelCard.displayName = "HotelCard";

export { HotelCard };

