import React from 'react';
import { Building2 } from 'lucide-react';

interface University {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
}

const universities: University[] = [
  { 
    id: "ug", 
    name: "University of Ghana", 
    shortName: "UG",
    logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379495/46600902-ca9e-407d-9392-06a45b9d9b1a.png"
  },
  { 
    id: "knust", 
    name: "Kwame Nkrumah University of Science and Technology", 
    shortName: "KNUST",
    logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379648/e9c10d56-1f3e-4151-8123-93d77fefe7aa.png"
  },
  { 
    id: "ucc", 
    name: "University of Cape Coast", 
    shortName: "UCC",
    logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379582/9c190837-92c2-4230-b205-4ab9f0c8c6a1.png"
  },
  { 
    id: "uew", 
    name: "University of Education, Winneba", 
    shortName: "UEW",
    logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379251/673184a4-9fd7-433b-b33e-ab7871fa5a1b.png"
  },
  { 
    id: "umat", 
    name: "University of Mines and Technology", 
    shortName: "UMaT",
    logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1759428982/WhatsApp_Image_2025-10-02_at_15.46.11_f720a723_lzrtfp.jpg"
  },
  { 
    id: "uds", 
    name: "University for Development Studies", 
    shortName: "UDS",
    logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379766/0a0d9027-8f25-4d2f-a291-8fae7914dec3.png"
  },
  { 
    id: "gimpa", 
    name: "Ghana Institute of Management and Public Administration", 
    shortName: "GIMPA",
    logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1763379384/9c8b41be-3e40-4ee3-8ae5-8951832cd82c.png"
  },
  { id: "ashesi", name: "Ashesi University", shortName: "Ashesi" },
  { 
    id: "cug", 
    name: "Catholic University of Ghana", 
    shortName: "CUG",
    logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1756722559/catholic-university-ghana-logo_onhrgj.jpg"
  },
  { 
    id: "puc", 
    name: "Pentecost University College", 
    shortName: "PUC",
    logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1756722725/OIP_czwzp0.webp"
  },
  { 
    id: "uenr", 
    name: "University of Energy and Natural Resources", 
    shortName: "UENR",
    logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1758510525/download_uxkc4q.jpg"
  },
  { 
    id: "ait", 
    name: "Accra Institute of Technology", 
    shortName: "AIT",
    logo: "https://res.cloudinary.com/dsypclqxk/image/upload/v1759428988/WhatsApp_Image_2025-10-02_at_15.47.06_33dd4bda_pj0a6t.jpg"
  },
];

// Duplicate the array for seamless loop
const duplicatedUniversities = [...universities, ...universities];

export const PartneringUniversities = () => {
  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Partnering Universities
          </h2>
          <p className="text-lg text-slate-600">
            Trusted by leading institutions across Ghana
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

          {/* Scrolling container */}
          <div className="flex animate-scroll group" style={{ animationPlayState: 'running' }} onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'} onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}>
            {duplicatedUniversities.map((university, index) => (
              <div
                key={`${university.id}-${index}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                <div className="flex flex-col items-center justify-center px-6 py-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow min-w-[200px]">
                  <div className="w-16 h-16 rounded-lg bg-slate-50 flex items-center justify-center mb-3 overflow-hidden">
                    {university.logo ? (
                      <img 
                        src={university.logo} 
                        alt={university.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-slate-600" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-slate-900 text-sm mb-1">
                      {university.shortName}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-2">
                      {university.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

