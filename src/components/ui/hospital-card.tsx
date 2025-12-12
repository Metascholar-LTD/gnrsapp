import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, CheckCircle2, Building2, Stethoscope } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  location: string;
  region: string;
  facilityType: string;
  ownership: string;
  services: string[];
  healthInsurance: string[];
  nhisAccredited: boolean;
  phone?: string;
  email?: string;
  description?: string;
  imageUrl: string;
}

interface HospitalCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
> {
  hospital: Hospital;
}

const HospitalCard = React.forwardRef<HTMLDivElement, HospitalCardProps>(
  (
    {
      className,
      hospital,
      ...props
    },
    ref
  ) => {
    const displayedServices = hospital.services.slice(0, 4);
    const remainingServicesCount = hospital.services.length - displayedServices.length;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-[hsl(40_20%_88%)] bg-white text-[hsl(220_30%_15%)] shadow-lg transition-all duration-300 hover:shadow-xl",
          className
        )}
        {...props}
      >
        <div className="flex flex-col">
          {/* Image Section */}
          <div className="relative h-48 w-full overflow-hidden bg-[hsl(40_20%_88%)]">
            <img
              src={hospital.imageUrl}
              alt={hospital.name}
              className="h-full w-full object-cover"
            />
            
            {/* NHIS Badge */}
            {hospital.nhisAccredited && (
              <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-[#0891b2] px-3 py-1.5 shadow-md">
                <CheckCircle2 size={14} className="text-white" />
                <span className="text-xs font-semibold text-white">
                  NHIS
                </span>
              </div>
            )}

            {/* Facility Type Badge */}
            <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 shadow-md">
              <Building2 size={14} className="text-[hsl(220_30%_15%)]" />
              <span className="text-xs font-medium text-[hsl(220_30%_15%)]">
                {hospital.facilityType}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative z-10 flex h-full flex-col p-6">
            {/* Header */}
            <div className="mb-3">
              <div className="mb-2 flex items-center gap-2">
                <MapPin size={14} className="text-[hsl(220_15%_45%)]" />
                <p className="text-xs font-medium text-[hsl(220_15%_45%)] uppercase tracking-wide">
                  {hospital.location}, {hospital.region}
                </p>
              </div>
              <h3 className="mb-2 text-xl font-bold tracking-tight text-[hsl(220_30%_15%)] line-clamp-2">
                {hospital.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[hsl(220_15%_45%)]">
                  {hospital.ownership}
                </span>
              </div>
            </div>

            {/* Description */}
            {hospital.description && (
              <p className="mb-4 line-clamp-2 text-sm text-[hsl(220_20%_40%)] leading-relaxed">
                {hospital.description}
              </p>
            )}

            {/* Services */}
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-1.5">
                <Stethoscope size={14} className="text-[hsl(220_15%_45%)]" />
                <span className="text-xs font-semibold text-[hsl(220_15%_45%)] uppercase tracking-wide">
                  Services
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {displayedServices.map((service, index) => (
                  <span
                    key={index}
                    className="inline-block rounded-md bg-[hsl(40_33%_96%)] px-2 py-1 text-xs font-medium text-[hsl(220_30%_15%)]"
                  >
                    {service}
                  </span>
                ))}
                {remainingServicesCount > 0 && (
                  <span className="inline-block rounded-md bg-[hsl(40_33%_96%)] px-2 py-1 text-xs font-medium text-[hsl(220_20%_40%)]">
                    +{remainingServicesCount} more
                  </span>
                )}
              </div>
            </div>

            {/* Health Insurance */}
            {hospital.healthInsurance.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-[hsl(220_15%_45%)] uppercase tracking-wide">
                  Insurance Accepted:
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {hospital.healthInsurance.slice(0, 3).map((insurance, index) => (
                    <span
                      key={index}
                      className="inline-block rounded-md bg-[#0891b2]/10 px-2 py-1 text-xs font-medium text-[#0891b2]"
                    >
                      {insurance}
                    </span>
                  ))}
                  {hospital.healthInsurance.length > 3 && (
                    <span className="inline-block rounded-md bg-[#0891b2]/10 px-2 py-1 text-xs font-medium text-[#0891b2]">
                      +{hospital.healthInsurance.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Contact Info */}
            {(hospital.phone || hospital.email) && (
              <div className="mb-4 space-y-1.5 border-t border-[hsl(40_20%_88%)] pt-3">
                {hospital.phone && (
                  <div className="flex items-center gap-2 text-xs text-[hsl(220_20%_40%)]">
                    <Phone size={12} />
                    <span>{hospital.phone}</span>
                  </div>
                )}
                {hospital.email && (
                  <div className="flex items-center gap-2 text-xs text-[hsl(220_20%_40%)]">
                    <Mail size={12} />
                    <span className="truncate">{hospital.email}</span>
                  </div>
                )}
              </div>
            )}

            {/* View More Link */}
            <div className="mt-auto flex items-center justify-end pt-2">
              <Link 
                to={`/directories/hospitals/${hospital.id}`} 
                className="group relative inline-block text-sm font-medium text-[hsl(220_30%_15%)] transition-colors duration-300 hover:text-[#0891b2]"
              >
                <motion.span
                  className="relative inline-block pb-1"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  View Details
                  <span
                    className="absolute bottom-0 left-0 h-[2px] bg-[#0891b2] transition-all duration-300 group-hover:bg-[#0e7490]"
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

HospitalCard.displayName = "HospitalCard";

export { HospitalCard };

