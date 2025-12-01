import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InitScripts } from "@/components/InitScripts";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { DicedHeroSection } from "@/components/ui/diced-hero-section";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Globe2, Briefcase, BookOpen, Calendar } from "lucide-react";

interface GnpcWindowCard {
  id: string;
  title: string;
  type: string;
  level: string;
  audience: string;
  description: string;
  keyPoints: string[];
  route: string;
}

const gnpcWindows: GnpcWindowCard[] = [
  {
    id: "gnpc-local-undergraduate",
    title: "Local Undergraduate Scholarship",
    type: "Local | Undergraduate",
    level: "Undergraduate (HND / Degree)",
    audience: "Brilliant but needy Ghanaian students starting or continuing first degree locally.",
    description:
      "Supports Ghanaian undergraduates admitted into accredited public tertiary institutions who demonstrate academic promise and financial need.",
    keyPoints: [
      "Ghanaian citizens with admission to a GTEC-accredited institution",
      "First-year or continuing students with minimum GPA 2.0",
      "Credit passes in 6 WASSCE/SSSCE subjects (3 core + 3 electives)",
      "Not already benefiting from another scholarship",
    ],
    route: "/scholarship/gnpc-local-undergraduate",
  },
  {
    id: "gnpc-local-postgraduate",
    title: "Local Postgraduate Scholarship",
    type: "Local | Postgraduate",
    level: "Masters / PhD (Local)",
    audience: "Ghanaian graduates admitted into local postgraduate programmes.",
    description:
      "Targets graduates with at least Second Class Lower who have secured admission into postgraduate programmes in Ghana.",
    keyPoints: [
      "Ghanaian citizenship and admission to public or private tertiary institution in Ghana",
      "At least Second Class Lower in first degree",
      "Priority for STEM, special needs and national development areas",
      "Includes professional capacity-building programmes",
    ],
    route: "/scholarship/gnpc-local-postgraduate",
  },
  {
    id: "gnpc-foreign-postgraduate",
    title: "Foreign Postgraduate Scholarship",
    type: "Foreign | Postgraduate",
    level: "Masters / PhD (Abroad)",
    audience: "Ghanaian graduates pursuing Masters/PhD in foreign universities.",
    description:
      "Provides competitive support for Ghanaians admitted into relevant Masters and PhD programmes abroad, especially in STEM and strategic areas.",
    keyPoints: [
      "Admission offer from a recognised foreign tertiary institution",
      "Second Class Lower (Masters) or relevant postgraduate degree (PhD)",
      "Strong academic and professional recommendations",
      "Priority for STEM, special needs and tuition‑free offers",
    ],
    route: "/scholarship/gnpc-foreign-postgraduate",
  },
  {
    id: "gnpc-capacity-building",
    title: "Capacity Building & Professional Development",
    type: "Capacity Building",
    level: "Short Courses / Professional",
    audience: "Public servants and professionals needing skills upgrade.",
    description:
      "Short-term programmes and certifications to deepen expertise for public servants and professionals supporting the energy sector and wider economy.",
    keyPoints: [
      "Structured for knowledge and skills upgrade",
      "Focus on public servants and key sector professionals",
      "Programmes aligned to national development needs",
      "Strengthens local participation in the petroleum value chain",
    ],
    route: "/scholarship/gnpc-capacity-building",
  },
];

const cardImages: Record<string, string> = {
  "gnpc-local-undergraduate":
    "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg",
  "gnpc-local-postgraduate":
    "https://res.cloudinary.com/dsypclqxk/image/upload/v1763129777/portrait-student-wearing-medical-mask_gokjyh.jpg",
  "gnpc-foreign-postgraduate":
    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1600&auto=format&fit=crop",
  "gnpc-capacity-building":
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
};

const GnpcScholarships = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string>(gnpcWindows[0]?.id);
  const activeWindow =
    gnpcWindows.find((window) => window.id === activeId) ?? gnpcWindows[0];

  return (
    <>
      <InitScripts />
      <Spinner />
      <Navigation />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #041b24 0%, #063144 100%)",
          paddingTop: "140px",
          paddingBottom: "100px",
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <DicedHeroSection
            topText="GNPC Foundation Scholarship Scheme"
            mainText="Developing Ghana’s Energy Talent"
            subMainText="GNPC’s scholarship scheme exists to develop the skills Ghana needs for its nascent petroleum industry and the broader economy — from brilliant but needy undergraduates to capacity-building programmes for experienced professionals."
            buttonText="Explore GNPC Scholarship Windows"
            slides={[
              {
                title: "Local University Scholars",
                image:
                  "https://res.cloudinary.com/dsypclqxk/image/upload/v1763392532/group-young-afro-american-female-students-dressed-black-graduation-gown-campus-as-background_gmnltc.jpg",
              },
              {
                title: "STEM & Health Professionals",
                image:
                  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
              },
              {
                title: "Global Postgraduate Exposure",
                image:
                  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1600&auto=format&fit=crop",
              },
              {
                title: "Capacity Building for Public Servants",
                image:
                  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
              },
            ]}
            onMainButtonClick={() => {
              const el = document.getElementById("gnpc-windows");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            onGridImageClick={() => {
              const el = document.getElementById("gnpc-windows");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            topTextStyle={{
              color: "#facc6b",
              fontSize: "1.125rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
            mainTextStyle={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              gradient: "linear-gradient(135deg, #facc6b, #fef9c3)",
              color: "#ffffff",
            }}
            subMainTextStyle={{
              color: "rgba(255, 255, 255, 0.92)",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              maxWidth: "640px",
            }}
            buttonStyle={{
              backgroundColor: "#facc6b",
              color: "#05222f",
              borderRadius: "0.75rem",
              hoverColor: "#fde68a",
              hoverForeground: "#02141c",
            }}
            separatorColor="#facc6b"
            maxContentWidth="1400px"
            mobileBreakpoint={1024}
            fontFamily="'Source Sans Pro', system-ui, sans-serif"
            backgroundColor="transparent"
          />
        </div>
      </section>

      {/* Windows Grid */}
      <section
        id="gnpc-windows"
        className="py-16 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="container mx-auto px-4 max-w-6xl relative">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3"
            >
              GNPC Scholarship Windows
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base"
            >
              Explore the main GNPC Foundation scholarship windows created to build
              Ghana’s petroleum and national development talent pipeline.
            </motion.p>
          </div>

          {/* Two-column layout: left sidebar menu + vertical separator + scholarship content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_auto_minmax(0,2.5fr)] gap-6 lg:gap-8 items-start">
            {/* Left sidebar menu */}
            <aside className="lg:pr-2">
              <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  GNPC Windows
                </p>
                {gnpcWindows.map((window) => (
                  <button
                    key={window.id}
                    onClick={() => setActiveId(window.id)}
                    className={`w-full text-left rounded-2xl px-4 py-2.5 text-xs md:text-sm font-semibold border transition-all duration-200 ${
                      activeId === window.id
                        ? "bg-[#facc6b] text-[#05222f] border-[#facc6b] shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-[#facc6b] hover:text-[#05222f]"
                    }`}
                  >
                    {window.title}
                  </button>
                ))}
              </div>
            </aside>

            {/* Vertical separator on large screens */}
            <div className="hidden lg:block w-px bg-slate-200 self-stretch" />

            {/* Active window large card (right side, like GETFund cards) */}
            <motion.article
              key={activeWindow.id}
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="group h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Image header */}
              <div className="relative h-48 md:h-64 overflow-hidden">
                <img
                  src={
                    cardImages[activeWindow.id] ??
                    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1600&auto=format&fit=crop"
                  }
                  alt={activeWindow.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/40">
                      {activeWindow.id === "gnpc-foreign-postgraduate" ? (
                        <Globe2 className="h-5 w-5 text-[#facc6b]" />
                      ) : activeWindow.id === "gnpc-capacity-building" ? (
                        <Briefcase className="h-5 w-5 text-[#facc6b]" />
                      ) : (
                        <GraduationCap className="h-5 w-5 text-[#facc6b]" />
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#fef9c3] mb-1">
                        {activeWindow.type}
                      </p>
                      <h3 className="text-sm md:text-lg font-semibold leading-snug text-white">
                        {activeWindow.title}
                      </h3>
                    </div>
                  </div>
                  <div className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium whitespace-nowrap self-start md:self-auto">
                    GNPC Window · {activeWindow.level}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-4 p-6 md:p-8">
                <p className="text-xs md:text-sm text-slate-600 max-w-3xl">
                  {activeWindow.description}
                </p>

                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
                    <BookOpen className="h-3.5 w-3.5 text-[#facc6b]" />
                    <span>Key selection highlights</span>
                  </div>
                  <ul className="space-y-1.5 text-xs md:text-sm text-slate-700">
                    {activeWindow.keyPoints.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#facc6b]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-end gap-3 border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="h-8 rounded-xl bg-[#facc6b] hover:bg-[#fde68a] text-[#05222f] text-xs font-semibold px-4"
                      onClick={() => navigate(activeWindow.route)}
                    >
                      View full details
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>

          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-12 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-6 py-6 md:px-8 md:py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800 mb-1">
                Ready to apply?
              </p>
              <p className="text-sm md:text-base text-slate-700 max-w-xl">
                Review the detailed requirements on each GNPC scholarship window, then
                follow the official portal and application guidelines for the specific
                academic year.
              </p>
            </div>
             <Button
               size="lg"
               className="bg-[#05222f] hover:bg-[#02141c] text-white font-semibold rounded-xl px-6 whitespace-nowrap"
               onClick={() =>
                 window.open("https://www.gnpcghana.com/gnpc-foundation", "_blank")
               }
             >
              Visit GNPC Scholarship Portal
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default GnpcScholarships;


