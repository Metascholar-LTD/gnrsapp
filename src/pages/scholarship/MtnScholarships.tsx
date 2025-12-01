import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { DicedHeroSection } from "@/components/ui/diced-hero-section";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Info,
  MapPin,
  Calendar,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const MtnScholarships = () => {
  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />

      {/* Hero - MTN theme */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #111827 0%, #020617 40%, #ffcb05 120%)",
          paddingTop: "140px",
          paddingBottom: "96px",
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <DicedHeroSection
            topText="MTN Ghana Foundation"
            mainText="Bright Scholarship"
            subMainText="MTN Ghana Foundation’s Bright Scholarship supports brilliant but needy Ghanaians at public tertiary institutions and in technical & vocational skills training. Discover what you need to know before applying."
            buttonText="View Scholarship Overview"
            slides={[
              {
                title: "Bright Scholarship Beneficiaries",
                image:
                  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop",
              },
              {
                title: "STEM & ICT Focus",
                image:
                  "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1600&auto=format&fit=crop",
              },
              {
                title: "Inclusive Opportunities",
                image:
                  "https://res.cloudinary.com/dsypclqxk/image/upload/v1764598119/compressed_attractive-young-black-european-man-winter-clothing-typing-text-message-his-mobile-standing-night-city-setting-joyful-dark-skinned-male-reading-sms_bdgidu.jpg",
              },
              {
                title: "Technical & Vocational Tracks",
                image:
                  "https://res.cloudinary.com/dsypclqxk/image/upload/v1764597983/compressed_young-man-dressed-yellow-holding-phone-coffee-cup_puiiii.jpg",
              },
            ]}
            onMainButtonClick={() => {
              const el = document.getElementById("mtn-overview");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            onGridImageClick={() => {
              const el = document.getElementById("mtn-overview");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            topTextStyle={{
              color: "#ffcb05",
              fontSize: "1.05rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
            mainTextStyle={{
              fontSize: "clamp(2.6rem, 5vw, 4.6rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              gradient: "linear-gradient(135deg, #fffbeb, #ffcb05)",
              color: "#f9fafb",
            }}
            subMainTextStyle={{
              color: "rgba(249, 250, 251, 0.92)",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              maxWidth: "640px",
            }}
            buttonStyle={{
              backgroundColor: "#ffcb05",
              color: "#111827",
              borderRadius: "9999px",
              hoverColor: "#facc15",
              hoverForeground: "#020617",
            }}
            separatorColor="#ffcb05"
            maxContentWidth="1400px"
            mobileBreakpoint={1024}
            fontFamily="'Source Sans Pro', system-ui, sans-serif"
            backgroundColor="transparent"
          />
        </div>
      </section>

      {/* Main content */}
      <section
        id="mtn-overview"
        className="relative py-16"
      >
        {/* Video background for entire content section (not hero) */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <video
            className="h-full w-full object-cover blur-sm"
            src="https://res.cloudinary.com/dsypclqxk/video/upload/v1764600796/1474295_People_Lifestyle_3840x2160_mtl9et.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Primary MTN scholarship card - styled similar to Browse Jobs featured card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div
              className="group relative bg-white rounded-2xl p-4 sm:p-6 border-4 border-yellow-400 cursor-pointer transform transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl"
              onClick={() =>
                (window.location.href = "/scholarship/mtn-bright-scholarship")
              }
            >
              {/* Featured Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 transition-transform duration-500 ease-out group-hover:scale-110">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-bold shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  MTN BRIGHT
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-yellow-400 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 ease-out" />

              {/* "Logo" block using your MTN image */}
              <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center mb-4 transform transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 shadow-md group-hover:shadow-xl overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dsypclqxk/image/upload/v1764597983/compressed_young-man-dressed-yellow-holding-phone-coffee-cup_puiiii.jpg"
                  alt="MTN Bright Scholarship"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors duration-500 ease-out">
                MTN Ghana Foundation Bright Scholarship
              </h2>

              {/* Meta text */}
              <p className="text-xs text-slate-500 mb-3 transition-colors duration-500 ease-out group-hover:text-slate-600">
                Need-based | Undergraduate &amp; TVET | Ghana
              </p>

              {/* Key info row */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-700">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-900">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Brilliant but needy Ghanaians</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-800">
                  <BookOpen className="w-3.5 h-3.5 text-yellow-500" />
                  <span>ICT, Engineering, AI &amp; Data</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-yellow-500" />
                  <span>1 Feb – 31 May 2025</span>
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-all duration-500 ease-out group-hover:bg-yellow-400 group-hover:scale-110">
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-black transform transition-all duration-500 ease-out group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>

          {/* Intro row */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1.7fr)] gap-8 mb-10 items-start">
            {/* Left: About & meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-4"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-black text-amber-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>What you need to know</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                About the MTN Ghana Foundation Scholarship
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                For nearly two decades, the MTN Foundation has supported thousands of
                brilliant but needy students across Africa. In Ghana, the MTN Ghana
                Foundation Bright Scholarship continues this legacy by funding
                first-degree students and candidates in technical and vocational
                training at public tertiary institutions.
              </p>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                The scheme is aimed at developing future-ready skills in critical areas
                such as ICT, engineering and data analytics, while also ensuring
                equitable regional and gender representation across the country.
              </p>
            </motion.div>

            {/* Right: Quick facts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 via-amber-50 to-white shadow-sm p-6 md:p-7 space-y-4"
            >
              <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-slate-900">
                <Info className="h-5 w-5 text-yellow-500" />
                Scholarship Snapshot
              </h3>
              <div className="space-y-3 text-xs md:text-sm text-slate-800">
                <div className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Level / Field of Study</p>
                    <p>
                      First-degree students at Ghanaian public tertiary institutions and
                      candidates pursuing vocational or technical skills training, with
                      priority for ICT, Computer Science, Engineering, Artificial
                      Intelligence and Data Analytics.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Eligible Nationality</p>
                    <p>Ghanaian citizens only (brilliant but needy).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Application Window</p>
                    <p>1st February 2025 – 31st May 2025 via the MTN portal.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Requirements and key sections pulled into detailed view page (see ScholarshipView) */}

          {/* Help / clarification */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-6 md:px-8 md:py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                Further clarification or assistance
              </p>
              <p className="text-xs md:text-sm text-slate-700">
                For official instructions, required documents and contact channels, use
                the MTN Bright Scholarship portal and helplines provided there.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-[#ffcb05] hover:bg-[#facc15] text-black font-semibold rounded-full px-6 whitespace-nowrap"
              onClick={() =>
                window.open("https://scholarship.mtn.com.gh", "_blank")
              }
            >
              Go to MTN Scholarship Portal
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default MtnScholarships;


