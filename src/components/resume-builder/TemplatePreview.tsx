import { ResumeTemplate } from "@/data/resume-builder/templates";

interface TemplatePreviewProps {
  template: ResumeTemplate;
}

const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  const getFontClass = () => {
    switch (template.fontStyle) {
      case "serif":
        return "font-serif";
      case "modern":
        return "font-display";
      default:
        return "font-body";
    }
  };

  // Render different preview layouts based on template
  if (template.layout === "creative") {
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-sm flex overflow-hidden">
        {/* Sidebar layout for creative */}
        <div className="flex h-full w-full">
          <div 
            className="w-1/3 p-2 flex flex-col justify-between text-white"
            style={{ backgroundColor: template.primaryColor }}
          >
            <div className="flex flex-col items-center">
              <img 
                src="https://i.pravatar.cc/150?img=47" 
                alt="Sarah Chen" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30 mb-2"
              />
              <div className="text-white font-bold mb-1 text-center text-[7px] leading-tight">Sarah Chen</div>
              <div className="text-white/90 text-center mb-3 text-[5px]">Product Designer</div>
              <div className="space-y-1.5 w-full">
                <div className="text-white/80 text-[4px] text-center">sarah@email.com</div>
                <div className="text-white/80 text-[4px] text-center">+1 234 567 890</div>
                <div className="text-white/80 text-[4px] text-center">New York, NY</div>
              </div>
            </div>
            <div className="space-y-2 mt-auto">
              <div>
                <div className="text-white/90 font-semibold text-[5px] mb-1">SKILLS</div>
                <div className="space-y-0.5">
                  <div className="text-white/80 text-[4px]">• Figma</div>
                  <div className="text-white/80 text-[4px]">• Sketch</div>
                  <div className="text-white/80 text-[4px]">• Adobe XD</div>
                  <div className="text-white/80 text-[4px]">• Prototyping</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-2 flex flex-col justify-between">
            <div className={`${getFontClass()} flex-1 flex flex-col`}>
              <div className="mb-2">
                <div className="font-bold mb-1.5 text-[6px]" style={{ color: template.primaryColor }}>EXPERIENCE</div>
                <div className="mb-2">
                  <div className="font-semibold text-[5.5px] mb-0.5">Senior Product Designer</div>
                  <div className="text-gray-600 text-[4.5px] mb-0.5">TechCorp Inc. • 2020 - Present</div>
                  <div className="text-gray-500 text-[4px] leading-tight">Led design team of 5, created innovative UI/UX solutions for enterprise clients, increased user engagement by 45%</div>
                </div>
                <div className="mb-2">
                  <div className="font-semibold text-[5.5px] mb-0.5">Product Designer</div>
                  <div className="text-gray-600 text-[4.5px] mb-0.5">StartupXYZ • 2018 - 2020</div>
                  <div className="text-gray-500 text-[4px] leading-tight">Designed mobile apps, collaborated with engineering teams</div>
                </div>
                <div>
                  <div className="font-semibold text-[5.5px] mb-0.5">Junior Designer</div>
                  <div className="text-gray-600 text-[4.5px]">Design Studio • 2016 - 2018</div>
                </div>
              </div>
              <div className="mb-2">
                <div className="font-bold mb-1.5 text-[6px]" style={{ color: template.primaryColor }}>EDUCATION</div>
                <div className="mb-1">
                  <div className="text-[5.5px] font-semibold">BFA in Design</div>
                  <div className="text-gray-600 text-[4.5px]">Art Institute of New York • 2012 - 2016</div>
                </div>
              </div>
              <div>
                <div className="font-bold mb-1.5 text-[6px]" style={{ color: template.primaryColor }}>PROJECTS</div>
                <div className="text-[4.5px] text-gray-600">Award-winning mobile app design • Featured in Design Magazine</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.layout === "modern") {
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
        {/* Top header for modern */}
        <div 
          className="p-2 text-center text-white"
          style={{ backgroundColor: template.primaryColor }}
        >
          <div className="font-bold text-[8px] mb-0.5">Michael Johnson</div>
          <div className="text-white/90 text-[5px]">Software Engineer • michael@email.com • +1 234 567 890 • San Francisco, CA</div>
        </div>
        <div className={`flex-1 p-2 flex flex-col justify-between ${getFontClass()}`}>
          <div className="grid grid-cols-2 gap-2 flex-1">
            <div className="flex flex-col">
              <div className="font-bold mb-1 text-[6px]" style={{ color: template.accentColor }}>EXPERIENCE</div>
              <div className="mb-2 flex-1">
                <div className="font-semibold text-[5.5px] mb-0.5">Senior Software Engineer</div>
                <div className="text-gray-600 text-[4.5px] mb-0.5">Google • 2019 - Present</div>
                <div className="text-gray-500 text-[4px] leading-tight mb-2">Built scalable distributed systems serving 10M+ users. Led team of 4 engineers.</div>
                <div className="font-semibold text-[5.5px] mb-0.5">Software Engineer</div>
                <div className="text-gray-600 text-[4.5px] mb-0.5">Microsoft • 2017 - 2019</div>
                <div className="text-gray-500 text-[4px] leading-tight">Developed cloud services, improved performance by 30%</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-bold mb-1 text-[6px]" style={{ color: template.accentColor }}>EDUCATION</div>
              <div className="mb-2">
                <div className="font-semibold text-[5.5px] mb-0.5">BS Computer Science</div>
                <div className="text-gray-600 text-[4.5px]">MIT • 2013 - 2017</div>
                <div className="text-gray-500 text-[4px] mt-0.5">Summa Cum Laude</div>
              </div>
              <div className="font-bold mb-1 text-[6px]" style={{ color: template.accentColor }}>PROJECTS</div>
              <div className="mb-2">
                <div className="text-[4.5px] font-semibold mb-0.5">Open Source Contributor</div>
                <div className="text-gray-600 text-[4px]">Maintained popular React library with 50K+ stars</div>
              </div>
              <div className="font-bold mb-1 text-[6px]" style={{ color: template.accentColor }}>SKILLS</div>
              <div className="flex flex-wrap gap-0.5">
                <span className="text-[4px] px-1 py-0.5 rounded-full" style={{ backgroundColor: `${template.primaryColor}20`, color: template.primaryColor }}>React</span>
                <span className="text-[4px] px-1 py-0.5 rounded-full" style={{ backgroundColor: `${template.primaryColor}20`, color: template.primaryColor }}>TypeScript</span>
                <span className="text-[4px] px-1 py-0.5 rounded-full" style={{ backgroundColor: `${template.primaryColor}20`, color: template.primaryColor }}>Node.js</span>
                <span className="text-[4px] px-1 py-0.5 rounded-full" style={{ backgroundColor: `${template.primaryColor}20`, color: template.primaryColor }}>Python</span>
                <span className="text-[4px] px-1 py-0.5 rounded-full" style={{ backgroundColor: `${template.primaryColor}20`, color: template.primaryColor }}>AWS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.layout === "minimal") {
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
        {/* Clean minimal layout */}
        <div className={`${getFontClass()} text-center p-2 pb-2`}>
          <div className="font-bold text-[8px] mb-0.5">Emily Rodriguez</div>
          <div className="text-gray-600 text-[5px]">Marketing Manager • emily@email.com • +1 234 567 890 • San Francisco, CA</div>
        </div>
        <div className="h-[1px] mx-2 mb-2" style={{ backgroundColor: template.primaryColor }} />
        <div className="flex-1 px-2 pb-2 flex flex-col justify-between space-y-2">
          <div>
            <div className="font-bold mb-1 text-[6px]" style={{ color: template.primaryColor }}>EXPERIENCE</div>
            <div className="mb-2">
              <div className="text-[5.5px] font-semibold mb-0.5">Senior Marketing Manager</div>
              <div className="text-gray-600 text-[4.5px] mb-0.5">Apple Inc. • 2021 - Present</div>
              <div className="text-gray-500 text-[4px] leading-tight">Led global brand campaigns, increased customer engagement by 40%, managed $5M budget</div>
            </div>
            <div className="mb-2">
              <div className="text-[5.5px] font-semibold mb-0.5">Marketing Specialist</div>
              <div className="text-gray-600 text-[4.5px] mb-0.5">Nike • 2019 - 2021</div>
              <div className="text-gray-500 text-[4px] leading-tight">Developed digital marketing strategies, improved conversion rates</div>
            </div>
            <div>
              <div className="text-[5.5px] font-semibold mb-0.5">Marketing Coordinator</div>
              <div className="text-gray-600 text-[4.5px]">Startup Co. • 2017 - 2019</div>
            </div>
          </div>
          <div>
            <div className="font-bold mb-1 text-[6px]" style={{ color: template.primaryColor }}>EDUCATION</div>
            <div className="mb-2">
              <div className="text-[5.5px] font-semibold mb-0.5">MBA in Marketing</div>
              <div className="text-gray-600 text-[4.5px]">Stanford University • 2015 - 2017</div>
            </div>
            <div>
              <div className="font-bold mb-1 text-[6px]" style={{ color: template.primaryColor }}>SKILLS</div>
              <div className="text-[4.5px] text-gray-600 leading-tight">Digital Marketing • Analytics • SEO • Content Strategy • Social Media • Brand Management</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Classic layout (default)
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
      <div className={`${getFontClass()} text-center p-2 pb-2`} style={{ borderBottom: `1px solid ${template.primaryColor}30` }}>
        <div className="font-bold text-[8px] mb-0.5" style={{ color: template.primaryColor }}>David Kim</div>
        <div className="text-gray-600 text-[5px]">Financial Analyst • david@email.com • +1 234 567 890 • Chicago, IL</div>
      </div>
      <div className="flex-1 p-2 flex flex-col justify-between space-y-2">
        <div>
          <div className="font-bold mb-1 text-[6px] uppercase tracking-wide" style={{ color: template.primaryColor, opacity: 0.9 }}>PROFESSIONAL EXPERIENCE</div>
          <div className="mb-2">
            <div className="text-[5.5px] font-semibold mb-0.5">Senior Financial Analyst</div>
            <div className="text-gray-600 text-[4.5px] mb-0.5">Goldman Sachs • 2018 - Present</div>
            <div className="text-gray-500 text-[4px] leading-tight">Financial modeling, risk analysis, portfolio management. Managed $500M portfolio, improved returns by 15%</div>
          </div>
          <div className="mb-2">
            <div className="text-[5.5px] font-semibold mb-0.5">Financial Analyst</div>
            <div className="text-gray-600 text-[4.5px] mb-0.5">JP Morgan • 2016 - 2018</div>
            <div className="text-gray-500 text-[4px] leading-tight">Analyzed market trends, prepared quarterly reports for senior management</div>
          </div>
          <div>
            <div className="text-[5.5px] font-semibold mb-0.5">Junior Analyst</div>
            <div className="text-gray-600 text-[4.5px]">Morgan Stanley • 2014 - 2016</div>
          </div>
        </div>
        <div>
          <div className="font-bold mb-1 text-[6px] uppercase tracking-wide" style={{ color: template.primaryColor, opacity: 0.9 }}>EDUCATION</div>
          <div className="mb-2">
            <div className="text-[5.5px] font-semibold mb-0.5">MBA in Finance</div>
            <div className="text-gray-600 text-[4.5px]">Harvard Business School • 2012 - 2014</div>
            <div className="text-gray-500 text-[4px] mt-0.5">Dean's List, Finance Club President</div>
          </div>
          <div>
            <div className="font-bold mb-1 text-[6px] uppercase tracking-wide" style={{ color: template.primaryColor, opacity: 0.9 }}>KEY SKILLS</div>
            <div className="flex gap-0.5 flex-wrap">
              <span className="text-[4px] px-1 py-0.5 bg-gray-100 rounded text-gray-700">Excel</span>
              <span className="text-[4px] px-1 py-0.5 bg-gray-100 rounded text-gray-700">Bloomberg</span>
              <span className="text-[4px] px-1 py-0.5 bg-gray-100 rounded text-gray-700">SQL</span>
              <span className="text-[4px] px-1 py-0.5 bg-gray-100 rounded text-gray-700">Python</span>
              <span className="text-[4px] px-1 py-0.5 bg-gray-100 rounded text-gray-700">Tableau</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;

