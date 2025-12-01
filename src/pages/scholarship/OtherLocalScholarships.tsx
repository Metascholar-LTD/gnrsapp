import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { ScholarshipCard } from "@/components/ui/scholarship-card";
import { motion } from "framer-motion";
import {
  Calendar,
  Globe2,
  Building2,
  Sparkles,
} from "lucide-react";

const heroSlides = [
  {
    title: "Brilliant but Needy Support",
    image:
      "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg",
  },
  {
    title: "Local Tertiary Funding",
    image:
      "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg",
  },
  {
    title: "District-Level Access",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Foreign Study Opportunities",
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1600&auto=format&fit=crop",
  },
];

const scholarshipTypes = [
  {
    id: "national-merit",
    title: "National Merit Scholarships",
    type: "Local | Merit & Need-Based",
    tag: "For top-performing Ghanaian students",
    location: "Ghana · All Regions",
    description:
      "Core national scholarship awards for brilliant but needy Ghanaians at the tertiary level. Focused on academic excellence, leadership potential and equity across districts.",
    bullets: [
      "Targets high-performing students from SHS into tertiary",
      "Supports students in accredited public and private institutions",
      "Considers both academic records and financial need",
      "Aligns with Ghana’s long-term human capital development goals",
    ],
    statusNote: "Announced periodically by the Ghana Scholarships Secretariat.",
    image:
      "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg",
  },
  {
    id: "local-tertiary",
    title: "Local Tertiary Scholarships",
    type: "Local | Tertiary",
    tag: "Study within Ghana",
    location: "Universities, Technical Universities, Colleges",
    description:
      "Covers tuition and approved academic-related costs for students attending accredited tertiary institutions within Ghana.",
    bullets: [
      "Open to students in NAB / GTEC accredited institutions",
      "Includes universities, technical universities and polytechnics",
      "Also covers nursing, teacher training and agriculture colleges",
      "Continuing & fresh students apply within specific annual windows",
    ],
    statusNote:
      "Continuing students: 1 April – 15 May · Late-admitted new students: 1–30 September (per official schedule).",
    image:
      "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392517/medium-shot-students-classroom_bn5nbl.jpg",
  },
  {
    id: "district-level",
    title: "District-Level Scholarships",
    type: "Local | District-Managed",
    tag: "Decentralised support",
    location: "District Scholarship Committees",
    description:
      "A decentralised scholarship system where applicants are vetted, interviewed and selected at the district level to ensure fairness and inclusion.",
    bullets: [
      "Applications tied to your district of residence or schooling",
      "District panels conduct interviews and shortlisting",
      "Details verified directly with your institution",
      "Designed to spread opportunity beyond major cities",
    ],
    statusNote:
      "Applicants complete online processes and appear before district interview panels.",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "foreign-tertiary",
    title: "Foreign Tertiary Scholarships",
    type: "Foreign | Bilateral & Competitive",
    tag: "Study abroad, return to lead",
    location: "Partner Countries & Institutions",
    description:
      "Scholarship offers received under Bilateral Cooperation Agreements for Ghanaian students to pursue undergraduate and postgraduate studies abroad.",
    bullets: [
      "Managed in partnership with Ministry of Foreign Affairs & Regional Integration",
      "Publicity via Scholarships Secretariat website and national media",
      "Includes interviews and committee-based selection",
      "Awarding country gives final approval and issues offers",
    ],
    statusNote:
      "Calls are published on the official Scholarships Secretariat website when available.",
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1600&auto=format&fit=crop",
  },
];

const CarouselHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = heroSlides[activeIndex];

  return (
    <div className="relative w-full h-72 md:h-80 lg:h-96 rounded-3xl overflow-hidden bg-slate-900/40 border border-emerald-500/30">
      <motion.img
        key={current.image}
        src={current.image}
        alt={current.title}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-950/20 to-transparent" />
      <div className="relative h-full flex flex-col justify-between p-5 md:p-6 lg:p-7">
        <div className="space-y-2 max-w-xs">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Spotlight Window
          </p>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-50 leading-tight">
            {current.title}
          </h2>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-6 bg-emerald-400"
                    : "w-2 bg-slate-500/70 hover:bg-emerald-300/70"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-100/80 font-medium">
            <span>
              {activeIndex + 1} / {heroSlides.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OtherLocalScholarships = () => {
  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />

      {/* Hero Section with Carousel */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 45%, #16a34a 110%)",
          paddingTop: "140px",
          paddingBottom: "100px",
        }}
      >
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] gap-10 items-center">
            {/* Left: Text */}
            <div className="text-left space-y-5 max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-block text-sm font-semibold tracking-[0.18em] uppercase text-emerald-200"
              >
                Ghana Scholarships Secretariat
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-50"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-100 via-emerald-200 to-emerald-500">
                  Other Local Scholarships
                </span>
              </motion.h1>
              <motion.hr
                initial={{ width: 0 }}
                animate={{ width: "6rem" }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="h-1 bg-emerald-400 border-none rounded-full"
              />
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg text-slate-100/90 leading-relaxed"
              >
                Explore the core scholarship types coordinated by the Ghana
                Scholarships Secretariat – from national merit awards and local
                tertiary funding to foreign study offers and district-level
                support across all regions.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-semibold rounded-full px-6"
                  onClick={() => {
                    const el = document.getElementById(
                      "ghana-scholarship-types",
                    );
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Scholarship Types
                </Button>
              </motion.div>
            </div>

            {/* Right: Image Carousel */}
            <CarouselHero />
          </div>
        </div>
      </section>

      {/* Scholarship Types Grid */}
      <section
        id="ghana-scholarship-types"
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
              Core Scholarship Types
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
            >
              These are the headline scholarship windows coordinated by the Ghana
              Scholarships Secretariat, with a fair and decentralised selection
              process across all districts.
            </motion.p>
          </div>

          <div className="space-y-0">
            {scholarshipTypes.map((item, index) => (
              <React.Fragment key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className={index > 0 ? "pt-8" : ""}
                >
                  <ScholarshipCard
                    imageUrl={item.image}
                    imageAlt={item.title}
                    type={item.type}
                    title={item.title}
                    tag={item.tag}
                    location={item.location}
                    description={item.description}
                    bullets={item.bullets}
                    statusNote={item.statusNote}
                    isForeign={item.id === "foreign-tertiary"}
                    imageLeft={index % 2 === 0} // Alternate: even index = image left, odd = image right
                  />
                </motion.div>
                {index < scholarshipTypes.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (index + 1) * 0.1 + 0.2 }}
                    className="relative py-8"
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <div className="bg-white px-4">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply – Local Tertiary */}
      <section className="relative py-16 bg-slate-900 overflow-hidden">
        {/* Background image */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764604068/2772283308_22f3134c01_b_ymb7aw.jpg"
            alt="Ghana Scholarships Secretariat"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-0">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.9fr)] gap-8 items-start">
            {/* About the Secretariat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900/40 p-6 md:p-8 space-y-4"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-300 px-4 py-1.5 text-xs md:text-sm font-semibold uppercase tracking-[0.16em]">
                <Sparkles className="h-4 w-4" />
                <span>About the Secretariat</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-50 flex items-center gap-3 leading-tight">
                <Building2 className="h-7 w-7 md:h-8 md:w-8 text-emerald-400 flex-shrink-0" />
                Ghana Scholarships Secretariat
              </h2>
              <p className="text-base md:text-lg text-slate-200/90 leading-relaxed">
                Established in 1960 under the Office of the President, the Ghana
                Scholarships Secretariat has a clear mandate: to award
                scholarships to brilliant but needy Ghanaians and ensure equitable
                access to higher education locally and abroad.
              </p>
              <p className="text-base md:text-lg text-slate-200/90 leading-relaxed">
                Through national merit awards, local and foreign tertiary
                scholarships and district-level schemes, the Secretariat supports
                Ghana&apos;s vision of building a knowledgeable, skilled and
                globally competitive workforce.
              </p>
            </motion.div>

            {/* 4 Easy Steps – Local Tertiary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 md:p-8 space-y-4"
            >
              <h3 className="flex items-center gap-2 text-lg md:text-xl lg:text-2xl font-semibold text-slate-50 mb-2">
                <Calendar className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                4 Easy Steps – Local Tertiary Scholarship
              </h3>
              <ol className="space-y-4 text-sm md:text-base text-slate-200 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-emerald-300 text-lg flex-shrink-0">1.</span>
                  <span>
                    Open the official portal at{" "}
                    <button
                      type="button"
                      onClick={() =>
                        window.open("https://scholarships.gov.gh", "_blank")
                      }
                      className="underline decoration-emerald-400 underline-offset-2 hover:text-emerald-300 font-medium"
                    >
                      scholarships.gov.gh
                    </button>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-emerald-300 text-lg flex-shrink-0">2.</span>
                  <span>
                    Create an account using the registration code shared with your
                    institution at the start of the academic year.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-emerald-300 text-lg flex-shrink-0">3.</span>
                  <span>
                    Complete the online form and upload your admission letter,
                    academic transcripts and relevant certificates.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-emerald-300 text-lg flex-shrink-0">4.</span>
                  <span>
                    Take the online aptitude test and attend the selection interview
                    scheduled in your chosen district.
                  </span>
                </li>
              </ol>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed mt-4 pt-4 border-t border-slate-700/50">
                Continuing students typically apply between{" "}
                <span className="font-semibold text-slate-100">
                  1 April – 15 May
                </span>{" "}
                each academic year, while new students with late admission may
                apply between{" "}
                <span className="font-semibold text-slate-100">
                  1 – 30 September
                </span>
                , based on official announcements.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default OtherLocalScholarships;


