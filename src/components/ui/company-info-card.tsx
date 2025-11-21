import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Users,
  Calendar,
  Globe,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";

interface CompanyInfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  industry: string;
  employees: string;
  founded: string;
  website: string;
  email: string;
  phone: string;
}

const CompanyInfoCard = React.forwardRef<HTMLDivElement, CompanyInfoCardProps>(
  ({ className, industry, employees, founded, website, email, phone, ...props }, ref) => {
    const cardVariants = {
      hidden: { opacity: 0, y: 20, scale: 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring" as const,
          stiffness: 400,
          damping: 25,
          staggerChildren: 0.05,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0 },
    };

    const infoItems = [
      { icon: Briefcase, label: "Industry", value: industry },
      { icon: Users, label: "Employees", value: employees },
      { icon: Calendar, label: "Founded", value: founded },
      { icon: Globe, label: "Website", value: website, isLink: true },
      { icon: Mail, label: "Email", value: email },
      { icon: Phone, label: "Phone", value: phone },
    ];

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-2xl p-6 shadow-lg",
          "bg-gradient-to-br from-white via-slate-50 to-white",
          "border border-slate-200",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        role="region"
        aria-label="Company Information"
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-transparent to-purple-50/30 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
            Company Details
          </h3>

          <div className="space-y-4">
            {/* Industry and Employees on one line */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Industry */}
              <div className="flex items-center gap-3 group flex-1">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-sky-100 transition-colors duration-300 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-slate-600 group-hover:text-sky-600 transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                    Industry
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {industry}
                  </p>
                </div>
              </div>
              
              {/* Vertical Separator */}
              <div className="hidden sm:block h-12 w-px bg-slate-200"></div>
              
              {/* Employees */}
              <div className="flex items-center gap-3 group flex-1">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-sky-100 transition-colors duration-300 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-600 group-hover:text-sky-600 transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                    Employees
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {employees}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Founded and Website on one line */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Founded */}
              <div className="flex items-center gap-3 group flex-1">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-sky-100 transition-colors duration-300 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-600 group-hover:text-sky-600 transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                    Founded
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {founded}
                  </p>
                </div>
              </div>
              
              {/* Vertical Separator */}
              <div className="hidden sm:block h-12 w-px bg-slate-200"></div>
              
              {/* Website */}
              <div className="flex items-center gap-3 group flex-1">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-sky-100 transition-colors duration-300 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-slate-600 group-hover:text-sky-600 transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                    Website
                  </p>
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 transition-colors break-all"
                  >
                    {website}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Email and Phone on one line */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Email */}
              <div className="flex items-center gap-3 group flex-1">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-sky-100 transition-colors duration-300 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-slate-600 group-hover:text-sky-600 transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-slate-900 break-all">
                    {email}
                  </p>
                </div>
              </div>
              
              {/* Vertical Separator */}
              <div className="hidden sm:block h-12 w-px bg-slate-200"></div>
              
              {/* Phone */}
              <div className="flex items-center gap-3 group flex-1">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-sky-100 transition-colors duration-300 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-slate-600 group-hover:text-sky-600 transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                    Phone
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {phone}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }
);

CompanyInfoCard.displayName = "CompanyInfoCard";

export { CompanyInfoCard };

