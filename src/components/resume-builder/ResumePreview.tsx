import { ResumeTemplate } from "@/data/resume-builder/templates";

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
    photo?: string;
  };
  experiences: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  languages: string[];
}

interface ResumePreviewProps {
  template: ResumeTemplate;
  data: ResumeData;
  compact?: boolean;
}

const ResumePreview = ({ template, data, compact = false }: ResumePreviewProps) => {
  const { personalInfo, experiences, education, skills, languages } = data;

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

  const textSize = compact ? {
    name: "text-lg",
    heading: "text-xs",
    body: "text-[10px]",
    small: "text-[9px]",
  } : {
    name: "text-2xl",
    heading: "text-sm",
    body: "text-sm",
    small: "text-xs",
  };

  // Creative Layout with sidebar
  if (template.layout === "creative") {
    return (
      <div className={`bg-white rounded-lg shadow-xl flex min-h-full ${getFontClass()}`}>
        {/* Sidebar */}
        <div 
          className="w-1/3 p-4 text-white"
          style={{ backgroundColor: template.primaryColor }}
        >
          <div className="text-center mb-4">
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName || "Profile"}
                className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-white/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center text-2xl font-bold">
                {personalInfo.fullName.charAt(0) || "?"}
              </div>
            )}
            <h1 className={`${textSize.name} font-bold`}>
              {personalInfo.fullName || "Your Name"}
            </h1>
          </div>
          
          <div className="space-y-4 text-white/90">
            <div className={textSize.small}>
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
              {personalInfo.website && <p>{personalInfo.website}</p>}
            </div>

            {skills.some((s) => s) && (
              <div>
                <h2 className={`${textSize.heading} font-semibold mb-2 uppercase tracking-wide border-b border-white/30 pb-1`}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1">
                  {skills.filter((s) => s).map((skill, i) => (
                    <span key={i} className={`${textSize.small} px-2 py-0.5 bg-white/20 rounded`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {languages.some((l) => l) && (
              <div>
                <h2 className={`${textSize.heading} font-semibold mb-2 uppercase tracking-wide border-b border-white/30 pb-1`}>
                  Languages
                </h2>
                <p className={textSize.small}>
                  {languages.filter((l) => l).join(" • ")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {personalInfo.summary && (
            <div className="mb-4">
              <h2 
                className={`${textSize.heading} font-semibold mb-2 uppercase tracking-wide`}
                style={{ color: template.primaryColor }}
              >
                About Me
              </h2>
              <p className={`${textSize.body} text-gray-600 leading-relaxed`}>{personalInfo.summary}</p>
            </div>
          )}

          {experiences.some((exp) => exp.company || exp.position) && (
            <div className="mb-4">
              <h2 
                className={`${textSize.heading} font-semibold mb-2 uppercase tracking-wide`}
                style={{ color: template.primaryColor }}
              >
                Experience
              </h2>
              <div className="space-y-3">
                {experiences.filter((exp) => exp.company || exp.position).map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`${textSize.body} font-semibold`}>{exp.position || "Position"}</p>
                        <p className={`${textSize.small} text-gray-500`}>{exp.company || "Company"}</p>
                      </div>
                      <p className={`${textSize.small} text-gray-400`}>
                        {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                    </div>
                    {exp.description && (
                      <p className={`${textSize.small} text-gray-600 mt-1`}>{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.some((edu) => edu.school || edu.degree) && (
            <div>
              <h2 
                className={`${textSize.heading} font-semibold mb-2 uppercase tracking-wide`}
                style={{ color: template.primaryColor }}
              >
                Education
              </h2>
              <div className="space-y-2">
                {education.filter((edu) => edu.school || edu.degree).map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <p className={`${textSize.body} font-semibold`}>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                      <p className={`${textSize.small} text-gray-500`}>{edu.school}</p>
                    </div>
                    <p className={`${textSize.small} text-gray-400`}>
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Modern Layout with top header
  if (template.layout === "modern") {
    return (
      <div className={`bg-white rounded-lg shadow-xl min-h-full ${getFontClass()}`}>
        {/* Header */}
        <div 
          className="p-6 text-white text-center"
          style={{ backgroundColor: template.primaryColor }}
        >
          <h1 className={`${textSize.name} font-bold mb-1`}>
            {personalInfo.fullName || "Your Name"}
          </h1>
          <div className={`${textSize.small} opacity-90 flex flex-wrap justify-center gap-3`}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {personalInfo.summary && (
            <div className="mb-5">
              <p className={`${textSize.body} text-gray-600 leading-relaxed text-center`}>{personalInfo.summary}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {experiences.some((exp) => exp.company || exp.position) && (
                <div className="mb-4">
                  <h2 
                    className={`${textSize.heading} font-semibold mb-3 uppercase tracking-wide pb-1`}
                    style={{ color: template.primaryColor, borderBottom: `2px solid ${template.accentColor}` }}
                  >
                    Experience
                  </h2>
                  <div className="space-y-3">
                    {experiences.filter((exp) => exp.company || exp.position).map((exp) => (
                      <div key={exp.id}>
                        <p className={`${textSize.body} font-semibold`}>{exp.position || "Position"}</p>
                        <p className={`${textSize.small} text-gray-500`}>{exp.company} • {exp.startDate} - {exp.endDate || "Present"}</p>
                        {exp.description && (
                          <p className={`${textSize.small} text-gray-600 mt-1`}>{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              {education.some((edu) => edu.school || edu.degree) && (
                <div className="mb-4">
                  <h2 
                    className={`${textSize.heading} font-semibold mb-3 uppercase tracking-wide pb-1`}
                    style={{ color: template.primaryColor, borderBottom: `2px solid ${template.accentColor}` }}
                  >
                    Education
                  </h2>
                  <div className="space-y-2">
                    {education.filter((edu) => edu.school || edu.degree).map((edu) => (
                      <div key={edu.id}>
                        <p className={`${textSize.body} font-semibold`}>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                        <p className={`${textSize.small} text-gray-500`}>{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skills.some((s) => s) && (
                <div className="mb-4">
                  <h2 
                    className={`${textSize.heading} font-semibold mb-2 uppercase tracking-wide pb-1`}
                    style={{ color: template.primaryColor, borderBottom: `2px solid ${template.accentColor}` }}
                  >
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    {skills.filter((s) => s).map((skill, i) => (
                      <span 
                        key={i} 
                        className={`${textSize.small} px-2 py-0.5 rounded-full`}
                        style={{ backgroundColor: `${template.primaryColor}15`, color: template.primaryColor }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {languages.some((l) => l) && (
                <div>
                  <h2 
                    className={`${textSize.heading} font-semibold mb-2 uppercase tracking-wide pb-1`}
                    style={{ color: template.primaryColor, borderBottom: `2px solid ${template.accentColor}` }}
                  >
                    Languages
                  </h2>
                  <p className={`${textSize.small} text-gray-600`}>
                    {languages.filter((l) => l).join(" • ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal Layout
  if (template.layout === "minimal") {
    return (
      <div className={`bg-white rounded-lg shadow-xl p-8 min-h-full ${getFontClass()}`}>
        <div className="text-center mb-6">
          <h1 className={`${textSize.name} font-bold text-gray-900 mb-1`}>
            {personalInfo.fullName || "Your Name"}
          </h1>
          <div className={`${textSize.small} text-gray-500 flex flex-wrap justify-center gap-2`}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>•</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        <div className="h-px mb-6" style={{ backgroundColor: template.primaryColor }} />

        {personalInfo.summary && (
          <div className="mb-6">
            <p className={`${textSize.body} text-gray-600 leading-relaxed`}>{personalInfo.summary}</p>
          </div>
        )}

        {experiences.some((exp) => exp.company || exp.position) && (
          <div className="mb-6">
            <h2 
              className={`${textSize.heading} font-medium mb-3 uppercase tracking-widest`}
              style={{ color: template.primaryColor }}
            >
              Experience
            </h2>
            <div className="space-y-4">
              {experiences.filter((exp) => exp.company || exp.position).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <p className={`${textSize.body} font-medium text-gray-900`}>{exp.position || "Position"}</p>
                    <p className={`${textSize.small} text-gray-400`}>
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                  </div>
                  <p className={`${textSize.small} text-gray-500`}>{exp.company || "Company"}</p>
                  {exp.description && (
                    <p className={`${textSize.small} text-gray-600 mt-1`}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.some((edu) => edu.school || edu.degree) && (
          <div className="mb-6">
            <h2 
              className={`${textSize.heading} font-medium mb-3 uppercase tracking-widest`}
              style={{ color: template.primaryColor }}
            >
              Education
            </h2>
            <div className="space-y-2">
              {education.filter((edu) => edu.school || edu.degree).map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <p className={`${textSize.body} font-medium text-gray-900`}>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                    <p className={`${textSize.small} text-gray-500`}>{edu.school}</p>
                  </div>
                  <p className={`${textSize.small} text-gray-400`}>
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.some((s) => s) && (
          <div className="mb-6">
            <h2 
              className={`${textSize.heading} font-medium mb-2 uppercase tracking-widest`}
              style={{ color: template.primaryColor }}
            >
              Skills
            </h2>
            <p className={`${textSize.body} text-gray-600`}>
              {skills.filter((s) => s).join(" • ")}
            </p>
          </div>
        )}

        {languages.some((l) => l) && (
          <div>
            <h2 
              className={`${textSize.heading} font-medium mb-2 uppercase tracking-widest`}
              style={{ color: template.primaryColor }}
            >
              Languages
            </h2>
            <p className={`${textSize.body} text-gray-600`}>
              {languages.filter((l) => l).join(" • ")}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Classic Layout (default)
  return (
    <div className={`bg-white rounded-lg shadow-xl p-8 min-h-full ${getFontClass()}`}>
      <div className="text-center mb-6 pb-6" style={{ borderBottom: `2px solid ${template.primaryColor}` }}>
        <h1 className={`${textSize.name} font-bold mb-1`} style={{ color: template.primaryColor }}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className={`${textSize.small} text-gray-500 flex flex-wrap justify-center gap-2`}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-6">
          <h2 
            className={`${textSize.heading} font-semibold mb-2 uppercase tracking-wide`}
            style={{ color: template.primaryColor }}
          >
            Professional Summary
          </h2>
          <p className={`${textSize.body} text-gray-600 leading-relaxed`}>{personalInfo.summary}</p>
        </div>
      )}

      {experiences.some((exp) => exp.company || exp.position) && (
        <div className="mb-6">
          <h2 
            className={`${textSize.heading} font-semibold mb-3 uppercase tracking-wide`}
            style={{ color: template.primaryColor }}
          >
            Experience
          </h2>
          <div className="space-y-4">
            {experiences.filter((exp) => exp.company || exp.position).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`${textSize.body} font-semibold`}>{exp.position || "Position"}</p>
                    <p className={`${textSize.small} text-gray-500`}>{exp.company || "Company"}</p>
                  </div>
                  <p className={`${textSize.small} text-gray-400`}>
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                </div>
                {exp.description && (
                  <p className={`${textSize.small} text-gray-600 mt-1`}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.some((edu) => edu.school || edu.degree) && (
        <div className="mb-6">
          <h2 
            className={`${textSize.heading} font-semibold mb-3 uppercase tracking-wide`}
            style={{ color: template.primaryColor }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {education.filter((edu) => edu.school || edu.degree).map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <p className={`${textSize.body} font-semibold`}>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                  <p className={`${textSize.small} text-gray-500`}>{edu.school}</p>
                </div>
                <p className={`${textSize.small} text-gray-400`}>
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.some((s) => s) && (
        <div className="mb-6">
          <h2 
            className={`${textSize.heading} font-semibold mb-2 uppercase tracking-wide`}
            style={{ color: template.primaryColor }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.filter((s) => s).map((skill, i) => (
              <span 
                key={i} 
                className={`${textSize.small} px-2 py-1 rounded`}
                style={{ backgroundColor: `${template.primaryColor}10` }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {languages.some((l) => l) && (
        <div>
          <h2 
            className={`${textSize.heading} font-semibold mb-2 uppercase tracking-wide`}
            style={{ color: template.primaryColor }}
          >
            Languages
          </h2>
          <p className={`${textSize.body} text-gray-600`}>
            {languages.filter((l) => l).join(" • ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;

