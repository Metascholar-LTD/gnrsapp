import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { DicedHeroSection } from "@/components/ui/diced-hero-section";
import { motion } from "framer-motion";
import { GraduationCap, Globe2, BookOpen, Calendar } from "lucide-react";

const applicationCategories = [
  {
    id: "local-undergraduate",
    title: "Local Undergraduate Scholarship Application",
    description:
      "Support for Ghana-based undergraduate studies at accredited public tertiary institutions.",
    type: "Local | Undergraduate",
    color: "from-[#fef4e6] to-[#fde3c2]",
    bullets: [
      "Bachelor's Programme",
      "Higher National Diploma (HND)",
      "Diploma",
      "Certificate Programmes (1 year and above)",
      "Bachelor of Laws (LLB)",
      "Graduate Entry Medical Programme (GEMP)",
    ],
    status: "Closed",
  },
  {
    id: "local-postgraduate",
    title: "Local Postgraduate Scholarship Application",
    description:
      "Funding for postgraduate studies (Masters, PhD and professional programmes) within Ghana.",
    type: "Local | Postgraduate",
    color: "from-[#fef3ff] to-[#f5e5ff]",
    bullets: [
      "Doctor of Philosophy (PhD)",
      "Master's Programme",
      "Professional Law Course (Ghana Law School)",
      "Master of Laws (LLM)",
      "Postgraduate Diploma",
    ],
    status: "Closed",
  },
  {
    id: "foreign-postgraduate",
    title: "Foreign Postgraduate Scholarship Application",
    description:
      "Limited funding support for postgraduate studies in accredited foreign universities.",
    type: "Foreign | Postgraduate",
    color: "from-[#e9f5ff] to-[#d8ecff]",
    bullets: ["Doctor of Philosophy (PhD)", "Master's Programme"],
    status: "Closed",
  },
];
const cardImages: Record<string, string> = {
  "local-undergraduate":
    "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg",
  "local-postgraduate":
    "https://res.cloudinary.com/dsypclqxk/image/upload/v1763129777/portrait-student-wearing-medical-mask_gokjyh.jpg",
  "foreign-postgraduate":
    "https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=1600&auto=format&fit=crop",
};

const GetFundScholarships = () => {
  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />

      {/* Hero Section - reuse scholarship hero layout */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #243137 0%, #1a2529 100%)",
          paddingTop: "140px",
          paddingBottom: "100px",
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <DicedHeroSection
            topText="Ghana Education Trust Fund"
            mainText="GETFund Scholarships"
            subMainText="View the main GETFund scholarship windows for Ghanaian students. Understand the local and foreign postgraduate options before you continue to the official GETFund portal to apply."
            buttonText="View Application Windows"
            slides={[
              {
                title: "Local Undergraduate Support",
                image:
                  "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg",
              },
              {
                title: "Local Postgraduate Scholars",
                image:
                   "https://res.cloudinary.com/dsypclqxk/image/upload/v1764581971/1f49c024-37ba-4314-84c6-94fda319fef7.png",
              },
              {
                title: "Foreign Study Opportunities",
                image:
                  "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392704/portrait-young-woman-with-laptop-hands-outside-school_yktf28.jpg",
              },
              {
                title: "Public Tertiary Institutions",
                image:
                  "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392935/19234_tbfzs9.jpg",
              },
            ]}
            onMainButtonClick={() => {
              const el = document.getElementById("getfund-applications");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            onGridImageHover={() => {}}
            onGridImageClick={() => {
              const el = document.getElementById("getfund-applications");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            topTextStyle={{
              color: "#bd9f67",
              fontSize: "1.125rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
            mainTextStyle={{
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              gradient: "linear-gradient(135deg, #bd9f67, #f3ddaa)",
              color: "#ffffff",
            }}
            subMainTextStyle={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              maxWidth: "620px",
            }}
            buttonStyle={{
              backgroundColor: "#bd9f67",
              color: "#243137",
              borderRadius: "0.75rem",
              hoverColor: "#d4b87a",
              hoverForeground: "#1a2529",
            }}
            separatorColor="#bd9f67"
            maxContentWidth="1400px"
            mobileBreakpoint={1024}
            fontFamily="'Source Sans Pro', system-ui, sans-serif"
            backgroundColor="transparent"
          />
        </div>
      </section>

      {/* Applications Grid */}
      <section
        id="getfund-applications"
        className="py-16 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3"
            >
              GETFund Scholarship Windows
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base"
            >
              These are the main application categories you&apos;ll see on the
              official GETFund portal. Use them as a guide to understand which
              window fits your study plans.
            </motion.p>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {applicationCategories.map((category, index) => {
               const imageUrl =
                 cardImages[category.id] ??
                 "https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=1600&auto=format&fit=crop";

               const isForeign = category.id === "foreign-postgraduate";

               return (
                 <motion.article
                   key={category.id}
                   initial={{ opacity: 0, y: 20, scale: 0.97 }}
                   whileInView={{ opacity: 1, y: 0, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.45, delay: index * 0.08 }}
                   className="group h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                 >
                   {/* Image header */}
                   <div className="relative h-40 overflow-hidden">
                     <img
                       src={imageUrl}
                       alt={category.title}
                       className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                     <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3 text-xs text-slate-100">
                       <div className="flex items-center gap-2">
                         {isForeign ? (
                           <Globe2 className="h-4 w-4 text-[#facc6b]" />
                         ) : (
                           <GraduationCap className="h-4 w-4 text-[#facc6b]" />
                         )}
                         <span className="font-semibold tracking-[0.18em] uppercase">
                           {category.type}
                         </span>
                       </div>
                       <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium">
                         {category.status}
                       </span>
                     </div>
                   </div>

                   {/* Content */}
                   <div className="flex flex-col gap-4 p-6 pt-5">
                     <div>
                       <h3 className="mb-1 text-lg md:text-xl font-semibold text-slate-900">
                         {category.title}
                       </h3>
                       <p className="text-xs md:text-sm text-slate-600">
                         {category.description}
                       </p>
                     </div>

                     <div>
                       <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                         <BookOpen className="h-3.5 w-3.5 text-[#bd9f67]" />
                         <span>Programmes covered</span>
                       </div>
                       <ul className="space-y-1.5 text-xs md:text-sm text-slate-700">
                         {category.bullets.map((item) => (
                           <li
                             key={item}
                             className="flex items-start gap-2"
                           >
                             <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#bd9f67]" />
                             <span>{item}</span>
                           </li>
                         ))}
                       </ul>
                     </div>

                     <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                       <span>
                         Window:{" "}
                         {isForeign
                           ? "Foreign postgraduate support"
                           : category.id === "local-undergraduate"
                           ? "Local undergraduate support"
                           : "Local postgraduate support"}
                       </span>
                       <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                         <Calendar className="h-3.5 w-3.5" />
                         {category.status}
                       </span>
                     </div>
                   </div>
                 </motion.article>
               );
             })}
           </div>

           {/* Official site call-to-action */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.4, delay: 0.1 }}
             className="mt-12 rounded-2xl border border-amber-100 bg-amber-50/70 px-6 py-6 md:px-8 md:py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
           >
             <div>
               <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700 mb-1">
                 Next step
               </p>
               <p className="text-sm md:text-base text-slate-700 max-w-xl">
                 When you are ready to apply, continue on the official Ghana Education Trust Fund website to read the latest instructions and submit your application.
               </p>
             </div>
             <Button
               size="lg"
               className="bg-[#bd9f67] hover:bg-[#d4b87a] text-[#243137] font-semibold rounded-xl px-6 whitespace-nowrap"
               onClick={() =>
                 window.open("https://scholarships.getfund.gov.gh/", "_blank")
               }
             >
               Visit Official GETFund Site
             </Button>
           </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default GetFundScholarships;


