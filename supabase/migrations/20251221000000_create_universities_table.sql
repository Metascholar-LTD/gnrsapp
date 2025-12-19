-- Create universities table
CREATE TABLE public.universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  name TEXT NOT NULL,
  abbreviation TEXT,
  region TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Public', 'Private')),
  logo TEXT,
  description TEXT NOT NULL,
  website TEXT,
  
  -- Campus and Location
  campus TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Statistics
  student_population TEXT,
  year_established TEXT,
  tuition_fee TEXT,
  admission_cut_off TEXT,
  programs TEXT,
  
  -- Population Percentages
  full_time_percentage INTEGER,
  part_time_percentage INTEGER,
  male_percentage INTEGER,
  female_percentage INTEGER,
  undergraduate_population TEXT,
  
  -- Financial Aid
  acceptance_rate TEXT,
  average_grant_aid TEXT,
  
  -- Program Enrollment (JSONB array of objects: {label, percentage, color})
  program_enrollment JSONB DEFAULT '[]'::JSONB,
  
  -- Academics (JSONB object)
  academics JSONB DEFAULT '{}'::JSONB,
  
  -- Financial Aid (JSONB object)
  financial_aid JSONB DEFAULT '{}'::JSONB,
  
  -- Admissions (JSONB object)
  admissions JSONB DEFAULT '{}'::JSONB,
  
  -- Student Life (JSONB object)
  student_life JSONB DEFAULT '{}'::JSONB,
  
  -- Rankings (JSONB array of objects: {list, position})
  rankings JSONB DEFAULT '[]'::JSONB,
  
  -- Courses (JSONB object: College/Department -> Courses[])
  courses JSONB DEFAULT '{}'::JSONB,
  
  -- Masters Courses (JSONB object: College -> Department -> Courses[])
  masters_courses JSONB DEFAULT '{}'::JSONB,
  
  -- Photos (TEXT array)
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Contact Information (JSONB object)
  contact JSONB DEFAULT '{}'::JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_universities_region ON public.universities(region);
CREATE INDEX idx_universities_type ON public.universities(type);
CREATE INDEX idx_universities_name ON public.universities(name);
CREATE INDEX idx_universities_created_at ON public.universities(created_at DESC);

-- Enable RLS
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- Public read access (universities should be viewable by everyone)
CREATE POLICY "Anyone can view universities" 
ON public.universities FOR SELECT 
USING (true);

-- Admin write policies (will be restricted later with proper auth)
CREATE POLICY "Allow all for universities" 
ON public.universities FOR ALL 
USING (true) WITH CHECK (true);

-- Create generic function to update updated_at timestamp (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at on universities
CREATE TRIGGER update_universities_updated_at
BEFORE UPDATE ON public.universities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert KNUST (Kwame Nkrumah University of Science and Technology) as initial data
INSERT INTO public.universities (
  name,
  abbreviation,
  region,
  type,
  logo,
  description,
  website,
  campus,
  student_population,
  year_established,
  tuition_fee,
  admission_cut_off,
  programs,
  full_time_percentage,
  part_time_percentage,
  male_percentage,
  female_percentage,
  undergraduate_population,
  acceptance_rate,
  average_grant_aid,
  program_enrollment,
  academics,
  financial_aid,
  admissions,
  student_life,
  rankings,
  courses,
  masters_courses,
  photos,
  contact
) VALUES (
  'Kwame Nkrumah University of Science and Technology',
  'KNUST',
  'Ashanti',
  'Public',
  'https://res.cloudinary.com/dsypclqxk/image/upload/v1763379648/e9c10d56-1f3e-4151-8123-93d77fefe7aa.png',
  'KNUST is a public university located in Kumasi, Ghana. It focuses on science and technology education and is one of the leading universities in Africa. The university is known for its strong engineering, technology, and applied sciences programs.',
  'www.knust.edu.gh',
  ARRAY['Kumasi'],
  '35,000+',
  '1952',
  'GHS 2,200 - 4,200',
  'Aggregate 6-26',
  '80+ Programs',
  85,
  15,
  55,
  45,
  '30,000',
  NULL,
  NULL,
  '[]'::JSONB,
  '{
    "studentFacultyRatio": null,
    "graduationRate": null,
    "retentionRate": null
  }'::JSONB,
  '{
    "averageAid": null,
    "aidPercentage": null,
    "scholarshipAvailability": null
  }'::JSONB,
  '{
    "acceptanceRate": null,
    "yieldRate": null,
    "satRange": null,
    "actRange": null
  }'::JSONB,
  '{
    "campusHousing": null,
    "clubsAndOrganizations": null,
    "athletics": null
  }'::JSONB,
  '[]'::JSONB,
  '{
    "College of Humanities and Social Sciences": ["Economics", "Sociology", "English", "History", "Linguistics", "BA Political Studies", "Culture and Tourism", "BA Communication Studies", "Akan Language and Culture", "Geography and Rural Development", "French and Francophone", "Religious Studies", "BA Economics (Parallel)", "BA Geography and Rural Development (Parallel)", "BA Sociology (Parallel)", "BA Social Work (Parallel)", "BA History (Parallel)", "BA Political Studies (Parallel)", "BA French (Parallel)", "BA Culture and Tourism (Parallel)", "BA English (Parallel)", "BA Religious Studies (Parallel)", "BSc Business Administration", "BSc Business Administration (Parallel)", "LLB (4 years for WASSCE/SSSCE/GBCE and Equivalent Holders)", "LLB Part-Time (4 years for Degree Holders only)", "BA Akan"],
    "School of Business": ["Business Administration (Accounting/Banking and Finance)", "Business Administration (Marketing/International)", "Business Administration (Hospitality and Tourism Management)", "Business Administration (Logistic and Supply Chain)"],
    "Faculty of Art": ["Fashion Design", "Publishing Studies", "Painting & Sculpture", "Communication Design (Graphic Design)", "Ceramic Design and Technology", "Textile Design and Technology", "Integrated Rural Art and Industry", "Metalsmithing and Jewelry Technology"],
    "College of Art and Built Environment": ["Architecture", "Real Estate", "Land Economy", "Development Planning", "Quantity Surveying and Construction Economics (Building Technology)", "Construction Technology and Management (Building Technology)", "Human Settlement Planning", "BFA Painting and Sculpture", "BA Communication Design (Graphic Design)", "BA Industrial Art (Ceramics, Metal Work, Textiles, and Fashion Design)", "BA Integrated Rural Art and Industry", "BA Publishing Studies (Book Industry)", "BA Integrated Rural Art and Industry (Parallel)", "BA Publishing Studies (Parallel)", "BA Communication Design (Parallel)", "BFA Painting and Sculpture (Parallel)"],
    "College of Science": ["BSc Biochemistry", "BSc Chemistry", "BSc Mathematics", "BSc Statistics", "BSc Physics", "BSc Actuarial Science", "BSc Environmental Science", "BSc Biological Science", "BSc Food and Technology", "BSc Computer Science (Parallel)", "BSc Meteorology and Climate Science", "Doctor of Optometry (OD), Six (6) years"],
    "College of Health Sciences": ["BSc Nursing", "BSc Midwifery", "BSc Herbal Medicine", "BSc Midwifery (Sandwich Programmes)", "BSc Emergency Nursing (Fee-Paying only)", "BSc Medical Laboratory Technology", "Pharm D (Doctor of Pharmacy) Six (6) Years", "BSc Human Biology (Medicine): to be followed by 3-year Clinical Programme leading to MB ChB Degree", "BSc Disability & Rehabilitation Studies (opened to Candidates with General Science, General Arts, Business, Visual Arts and Vocational/ Home Economics background)", "DVM (Doctor of Veterinary Medicine) 6 years", "BSc Dental Surgery (three year of BSc Human Biology to be followed by a year Clinical study leading to the award of BDS Degree) (fee paying only)"],
    "College of Agriculture and Natural Resources": ["Agribusiness Management", "Forest Resources Technology", "Aquaculture & Water Resources Management", "Natural Resources Management", "Post Harvest Technology", "BSc Dairy and Meat Science", "BSc Landscape Design and Management", "BSc Agricultural Biotechnology", "BSc Agriculture"],
    "College of Engineering": ["Civil Engineering", "Materials Engineering", "Computer Engineering", "Electrical & Electronic Engineering", "Mechanical Engineering", "Geomatic Engineering (Geodetic Engineering)", "Aerospace Engineering", "Petroleum Engineering", "Telecommunication Engineering", "Geological Engineering", "Biomedical Engineering", "Petrochemical Engineering", "Metallurgical Engineering", "BSc Chemical Engineering"],
    "Distance Education/Learning Undergraduate Programmes": ["BA Sociology", "BSc Information Technology", "BSc Statistics", "BSc Agriculture", "BSc Actuarial Science", "BSc Computer Science", "BSc Quantity Surveying and Construction Economics", "Construction Technology Management", "Information Technology", "BA Social Work", "BSc Construction Technology Management", "BSc Business Administration (7 Options available)", "Diploma in Architectural Technology", "Diploma in Business Administration", "Diploma in Information Technology", "Diploma in Horticulture", "Diploma in Mechanical Engineering", "Diploma in Computer Network Engineering", "Diploma in Disability and Rehabilitation"]
  }'::JSONB,
  '{
    "College of Agriculture and Natural Resources": {
      "Department of Animal Science": ["Master of Philosophy (Animal Breeding and Genetics)", "Master of Philosophy (Reproductive Physiology)", "Master of Philosophy (Animal Nutrition)", "Master of Philosophy (Meat Science)"],
      "Department of Crop and Soil Sciences": ["Master of Philosophy (Agronomy)", "Master of Philosophy (Agronomy [Crop Physiology])", "Master of Philosophy (Crop Protection [Entomology])", "Master of Philosophy (Crop Protection [Nematology])", "Master of Philosophy (Crop Protection [Plant Pathology])", "Master of Philosophy (Crop Protection [Plant Virology])", "Master of Philosophy (Plant Breeding)", "Master of Philosophy (Soil Science)"],
      "Department of Horticulture": ["Master of Philosophy (Postharvest Technology)", "Master of Philosophy (Seed Science and Technology)", "Master of Philosophy (Fruit Crops Production)", "Master of Philosophy (Landscape Studies)", "Master of Philosophy (Vegetable Crops Production)", "Master of Philosophy (Floriculture)"],
      "Department of Agricultural Economics, Agribusiness and Extension": ["Master of Philosophy (Agribusiness Management)", "Master of Philosophy (Agricultural Economics)", "Master of Philosophy (Agricultural Extension and Development Communication)", "Master of Philosophy (Sustainable and Integrated Rural Development in Africa)", "Master of Science (Agribusiness Management)", "Master of Science (Agricultural Extension and Development Communication)"],
      "Department of Wildlife and Range Management": ["Master of Philosophy (Wildlife and Range Management)", "Master of Science (Geo-Information Science for Natural Resources Management)"],
      "Department of Silviculture and Forest Management": ["Master of Philosophy (Natural Resources and Environmental Governance)", "Master of Philosophy (Silviculture and Forest Management)"],
      "Department of Agroforestry": ["Master of Philosophy (Agroforestry)"],
      "Department of Wood Science and Technology Management": ["Master of Science (Packaging Technology and Management)", "Master of Philosophy (Wood Science and Technology)"],
      "Department of Fisheries and Watershed Management": ["Master of Philosophy (Aquaculture and Environment)", "Master of Philosophy (Fisheries Management)", "Master of Philosophy (Watershed Management)"]
    },
    "College of Humanities and Social Sciences": {
      "Faculty of Law": ["Master of Laws (LLM)"],
      "Department of Economics": ["Master of Science (Economics)", "Master of Philosophy (Economics)"],
      "Department of Modern Languages": ["Master of Philosophy (French)"],
      "Department of English": ["Master of Philosophy in (English)"],
      "Department of Geography and Rural Development": ["Master of Science (Geography and Sustainable Development)", "Master of Philosophy (Geography and Rural Development)"],
      "Department of Religious Studies": ["Master of Art (Religious Studies)", "Master of Philosophy (Religious Studies)"],
      "Department of Sociology and Social Work": ["Master of Art (Sociology)", "Master of Philosophy (Sociology)"],
      "Department of History and Political Studies": ["Master of Art (Asante History)", "Master of Public Administration", "Master of Art (Chieftaincy and Traditional Leadership Studies)", "Master of Philosophy (Chieftaincy and Traditional Leadership Studies)", "Master of Philosophy in (Historical Studies)", "Master of Philosophy in (Political Science)"]
    },
    "School of Business": {
      "KNUST School of Business (KSB)": ["Master of Business Administration (Accounting)", "Master of Business Administration (Finance)", "Master of Business Administration (Marketing)", "Master of Business Administration (Strategic Management and Consulting)", "Master of Business Administration (Human Resource Management)", "Master of Business Administration (Logistics and Supply Chain Management)", "Master of Business Administration (Management and Organizational Development)", "Master of Science (Marketing)", "Master of Science (Logistics and Supply Chain Management)", "Master of Science (Management and Human Resource Strategy)", "Master of Science (Accounting and Finance)", "Master of Science (Finance)", "Master of Science (Procurement and Supply Chain Management)", "Master of Science (Corporate Governance and Strategic Leadership)", "Master of Science (Air Transportation and Aviation Management)", "Master of Science (Business and Data Analytics)", "Master of Philosophy (Business and Management [Accounting])", "Master of Philosophy (Business and Management [Finance])", "Master of Philosophy (Business and Management [Marketing])", "Master of Philosophy (Business and Management [Strategic Management and Consulting])", "Master of Philosophy (Business and Management [Human Resource Management])", "Master of Philosophy (Business and Management [Logistics and Supply Chain Management])", "Master of Philosophy (Business and Management [Management and Organizational Development])", "Master of Philosophy (Logistics and Supply Chain Management)", "Master of Philosophy (Procurement and Supply Chain Management)", "Master of Philosophy (Management and Human Resource Management (Top-Up))"]
    },
    "College of Art and Built Environment": {
      "Department of Architecture": ["Master of Philosophy (Architectural Studies)", "Master of Science (Architecture (Top-Up))", "Master of Architecture"],
      "Department of Construction Technology and Management": ["Master of Science (Construction Management)", "Master of Science (Procurement Management)", "Master of Science (Project Management)", "Master of Philosophy (Construction Management)", "Master of Philosophy (Procurement Management)", "Master of Philosophy (Project Management)"],
      "Department of Planning": ["Master of Science (Development Planning and Management)", "Master of Science (Development Policy and Planning)", "Master of Science (Transportation Planning)", "Master of Science (Development Studies)", "Master of Science (Planning)", "Master of Philosophy (Development Planning and Management)", "Master of Philosophy (Development Policy and Planning)", "Master of Philosophy (Development Studies)", "Master of Philosophy (Planning)", "Master of Philosophy (Urban Management Studies)"],
      "Department of Land Economy": ["Master of Science (Land Governance and Policy)", "Master of Science (Facilities Management)"],
      "Department of Educational Innovations in Science and Technology": ["Master of Philosophy Art Education", "MA African Art and Culture", "Master of Philosophy African Art and Culture"],
      "Department of Teacher Education": ["Master of Philosophy (Educational Planning and Administration)", "Master of Philosophy (Language Education)", "Master of Philosophy (Science Education)", "Master of Philosophy (Mathematics Education)", "Master of Philosophy (ICT Education)", "Master of Education (Educational Planning and Administration) – Sandwich", "Master of Education (Language Education) – Sandwich", "Master of Education (Science Education) – Sandwich", "Master of Education (Mathematics Education) – Sandwich", "Master of Education (ICT Education) – Sandwich"],
      "Department of Painting and Sculpture": ["Master of Fine Art (Painting)", "Master of Fine Art (Sculpture)", "Master of Fine Art (Painting and Sculpture)"],
      "Department of Industrial Art": ["Master of Fine Art (Ceramics)", "Master of Fine Art (Jewellery and Metalsmithing)", "Master of Fine Art (Textiles Design)", "Master of Philosophy (Integrated Art)", "Master of Philosophy (Fashion Design Technology)", "Master of Philosophy (Textile Design Technology)"],
      "Department of Communication Design": ["Master of Communication Design", "Master of Philosophy (Communication Design)"]
    },
    "College of Health Sciences": {
      "Department of Pharmaceutics": ["Master of Science (Pharmaceutical Technology)", "Master of Philosophy (Pharmaceutics)", "Master of Philosophy (Pharmaceutical Microbiology)"],
      "Department of Pharmacognosy": ["Master of Philosophy (Pharmacognosy)"],
      "Department of Pharmaceutical Chemistry": ["Master of Philosophy (Pharmaceutical Chemistry)"],
      "Department of Pharmacy Practice": ["Master of Science (Clinical Pharmacy)", "Master of Philosophy (Clinical Pharmacy)"],
      "Department of Pharmacology": ["Master of Philosophy (Pharmacology)", "Master of Philosophy (Clinical Pharmacology)"],
      "Department of Nursing": ["Master of Science (Clinical Nursing)", "Master of Philosophy (Nursing)"],
      "Department of Medical Diagnostics": ["Master of Philosophy (Haematology)"],
      "Department of Molecular Medicine": ["Master of Philosophy (Chemical Pathology)", "Master of Philosophy (Molecular Medicine)", "Master of Philosophy (Immunology)"],
      "Department of Clinical Microbiology": ["Master of Philosophy (Clinical Microbiology)"],
      "Department of Anatomy": ["Master of Philosophy (Human Anatomy and Cell Biology)", "Master of Philosophy (Human Anatomy and Forensic Science)", "Master of Philosophy (Human Anatomy and Cell Biology [Morphological Diagnostics])", "Master of Philosophy (Mortuary Science and Management)"],
      "Department of Physiology": ["Master of Philosophy (Physiology)"],
      "School of Public Health": ["Master of Science (Health Education and Promotion)", "Master of Science (Population and Reproductive Health)", "Master of Science (Occupational and Environmental Health & Safety)", "Master of Science (Health Services Planning and Management)", "Master of Public Health (Health Education and Promotion)", "Master of Public Health (Population and Reproductive Health)", "Master of Public Health (Occupational and Environmental Health & Safety)", "Master of Public Health Health Services Planning and Management)", "Master of Philosophy (Disability, Rehabilitation and Development)", "Master of Philosophy (Health Systems Research and Management)", "Master of Philosophy (Field Epidemiology and Biostatistics)"]
    },
    "College of Science": {
      "Department of Biochemistry and Biotechnology": ["Master of Science (Biotechnology)", "Master of Science (Biodata Analytics and Computational Genomics)", "Master of Philosophy (Biodata Analytics and Computational Genomics)", "Master of Philosophy (Human Nutrition and Dietetics)", "Master of Philosophy (Biochemistry)", "Master of Philosophy (Biotechnology)"],
      "Department of Theoretical and Applied Biology": ["Master of Philosophy (Environmental Science)", "Master of Philosophy (Parasitology)", "Master of Philosophy (Ecology)", "Master of Philosophy (Entomology)", "Master of Philosophy (Animal and Plant Physiology)", "Master of Philosophy (Microbiology)", "Master of Philosophy (Plant Pathology)", "Master of Philosophy (Reproductive Biology)", "Master of Philosophy (Animal and Plant Systematics)", "Master of Philosophy (Molecular Biology)", "Master of Philosophy (Fish and Fisheries Science)"],
      "Department of Food Science and Technology": ["Master of Science (Food Science and Technology)", "Master of Philosophy (Food Science and Technology)"],
      "Department of Chemistry": ["Master of Philosophy Chemistry", "Master of Philosophy Organic and Natural Products", "Master of Philosophy Analytical Chemistry", "Master of Philosophy Environmental Chemistry", "Master of Philosophy Physical Chemistry", "Master of Philosophy Inorganic Chemistry", "Master of Philosophy Polymer Science and Technology"],
      "Department of Physics": ["Master of Philosophy Geophysics", "Master of Philosophy/Doctor of Philosophy Materials Science", "Master of Philosophy/Doctor of Philosophy in Solid State Physics", "Master of Philosophy/Doctor of Philosophy Meteorology and Climate Science", "Master of Philosophy/Doctor of Philosophy Environmental Physics", "Master of Philosophy Nano Science and Technology", "Master of Science Petroleum Geophysics"],
      "Department of Mathematics": ["Master of Philosophy Pure Mathematics", "Master of Philosophy Applied Mathematics"],
      "Department of Statistics and Actuarial Science": ["Master of Philosophy Mathematical Statistics", "Master of Philosophy Actuarial Science"],
      "Department of Computer Science": ["Master of Science Cyber-Security and Digital Forensics", "Master of Philosophy Cyber-Security and Digital Forensics", "Master of Science Computer Science", "Master of Philosophy Computer Science", "Master of Science Information Technology", "Master of Philosophy Information Technology"],
      "Department of Optometry and Visual Science": ["Master of Philosophy Vision Science"]
    },
    "College of Engineering": {
      "Department of Civil Engineering": ["Master of Science Geotechnical Engineering", "Master of Philosophy Geotechnical Engineering", "Master of Science Road and Transportation Engineering", "Master of Philosophy Road and Transportation Engineering", "Master of Science Water Resources Engineering and Management", "Master of Philosophy Water Resources Engineering and Management", "Master of Science Water Supply and Environmental Sanitation", "Master of Philosophy Water Supply and Environmental Sanitation", "Master of Science Structural Engineering", "Master of Philosophy Structural Engineering"],
      "Department of Geomatic Engineering": ["Master of Science/Master of Philosophy Geomatic Engineering", "Master of Philosophy Geographic Information System (GIS)"],
      "Department of Electrical/Electronic Engineering": ["Master of Philosophy Telecommunications Engineering", "Master of Philosophy Power Systems Engineering"],
      "Department of Computer Engineering": ["Master of Philosophy Computer Engineering"],
      "Department of Chemical Engineering": ["Master of Philosophy Chemical Engineering"],
      "Department of Materials Engineering": ["Master of Philosophy Environmental Resources Management", "Master of Science Materials Engineering", "Master of Philosophy Materials Engineering"],
      "Department of Agricultural and Biosystems Engineering": ["Master of Science Agricultural Machinery Engineering", "Master of Science Agro-Environmental Engineering", "Master of Science Bioengineering", "Master of Science Food and Post-Harvest Engineering", "Master of Science Soil and Water Engineering", "Master of Philosophy Agricultural Machinery Engineering", "Master of Philosophy Agro-Environmental Engineering", "Master of Philosophy Bioengineering", "Master of Philosophy Food and Post-Harvest Engineering", "Master of Philosophy Soil and Water Engineering", "Master of Philosophy Intellectual Property (MIP)"],
      "Department of Mechanical Engineering": ["Master of Science Mechanical Engineering", "Master of Philosophy Mechanical Engineering", "Master of Science Renewable Energy Technologies"],
      "Department of Geological Engineering": ["Master of Science Geophysical Engineering", "Master of Philosophy Geological Engineering"]
    }
  }'::JSONB,
  ARRAY[]::TEXT[],
  '{
    "address": null,
    "phone": null,
    "email": null,
    "facebook": null,
    "twitter": null,
    "linkedin": null,
    "youtube": null,
    "instagram": null
  }'::JSONB
);

