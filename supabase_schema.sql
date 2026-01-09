-- ============================================
-- SUPABASE DATABASE SCHEMA FOR JOBS & COMPANIES
-- ============================================
-- This file contains the complete schema and seed data
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. CREATE COMPANIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  industry TEXT,
  employees TEXT,
  founded TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CREATE JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  company_logo TEXT,
  title TEXT NOT NULL,
  description TEXT,
  description_paragraphs JSONB DEFAULT '[]'::jsonb,
  impact_paragraphs JSONB DEFAULT '[]'::jsonb,
  impact_highlights JSONB DEFAULT '[]'::jsonb,
  field_ops_groups JSONB DEFAULT '[]'::jsonb,
  skills_formal_qualifications JSONB DEFAULT '[]'::jsonb,
  skills_additional_knowledge JSONB DEFAULT '[]'::jsonb,
  skills_experience JSONB DEFAULT '[]'::jsonb,
  skills_technical JSONB DEFAULT '[]'::jsonb,
  behavioral_attributes JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  culture_paragraphs JSONB DEFAULT '[]'::jsonb,
  opportunity_paragraphs JSONB DEFAULT '[]'::jsonb,
  job_category TEXT,
  industry TEXT,
  education_level TEXT,
  experience_level TEXT,
  contract_type TEXT,
  region TEXT,
  city TEXT,
  date DATE DEFAULT CURRENT_DATE,
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  salary TEXT,
  image_url TEXT,
  application_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_verified ON jobs(verified);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured);
CREATE INDEX IF NOT EXISTS idx_jobs_region ON jobs(region);
CREATE INDEX IF NOT EXISTS idx_jobs_contract_type ON jobs(contract_type);
CREATE INDEX IF NOT EXISTS idx_jobs_education_level ON jobs(education_level);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_job_category ON jobs(job_category);
CREATE INDEX IF NOT EXISTS idx_companies_featured ON companies(featured);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);

-- ============================================
-- 4. CREATE UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. CREATE TRIGGERS FOR UPDATED_AT
-- ============================================
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. INSERT COMPANIES (All existing companies from pages)
-- ============================================
INSERT INTO companies (name, logo_url, description, industry, employees, founded, website, email, phone, location, featured) VALUES
('WESTERN GOVERNORS UNIVERSITY', 'https://logo.clearbit.com/wgu.edu', 'Western Governors University (WGU) is a leading online university committed to providing accessible, affordable, and high-quality education. We empower students to achieve their educational and career goals through competency-based learning.', 'Education', '1001-5000', '1997', 'https://www.wgu.edu', 'careers@wgu.edu', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('Microsoft', 'https://logo.clearbit.com/microsoft.com', 'Microsoft is a technology company empowering every person and organization on the planet to achieve more.', 'Technology', '1001-5000', '2005', 'https://microsoft.com', 'careers@microsoft.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', true),
('Adidas', 'https://logo.clearbit.com/adidas.com', 'Adidas is a German multinational corporation, founded and headquartered in Herzogenaurach, Germany, that designs and manufactures shoes, clothing and accessories.', 'Retail & Fashion', '1001-5000', '1949', 'https://adidas.com', 'careers@adidas.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('Nike', 'https://logo.clearbit.com/nike.com', 'Nike, Inc. is an American multinational corporation that is engaged in the design, development, manufacturing, and worldwide marketing and sales of footwear, apparel, equipment, accessories, and services.', 'Retail & Fashion', '1001-5000', '1964', 'https://nike.com', 'careers@nike.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('Apple', 'https://logo.clearbit.com/apple.com', 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services.', 'Technology', '5001-10000', '1976', 'https://apple.com', 'careers@apple.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('Google', 'https://logo.clearbit.com/google.com', 'Google''s mission is to organize the world''s information and make it universally accessible and useful.', 'Technology', '5001-10000', '2008', 'https://google.com', 'careers@google.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('Amazon', 'https://logo.clearbit.com/amazon.com', 'Amazon is committed to being Earth''s most customer-centric company, where people can find and discover anything they might want to buy online.', 'E-commerce & Cloud', '10000+', '1994', 'https://amazon.com', 'careers@amazon.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('Meta', 'https://logo.clearbit.com/meta.com', 'Meta builds technologies that help people connect, find communities, and grow businesses.', 'Technology', '10000+', '2004', 'https://meta.com', 'careers@meta.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('Tesla', 'https://logo.clearbit.com/tesla.com', 'Tesla''s mission is to accelerate the world''s transition to sustainable energy through increasingly affordable electric vehicles and energy products.', 'Automotive & Energy', '1001-5000', '2003', 'https://tesla.com', 'careers@tesla.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('Netflix', 'https://logo.clearbit.com/netflix.com', 'Netflix is the world''s leading streaming entertainment service with over 200 million paid memberships in over 190 countries.', 'Entertainment', '1001-5000', '1997', 'https://netflix.com', 'careers@netflix.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('Finance Corp', 'https://cdn.simpleicons.org/visa/1A1F71', 'Finance Corp is a leading financial services company providing comprehensive financial solutions and advisory services to businesses and individuals.', 'Finance', '501-1000', '2010', 'https://financecorp.com', 'careers@financecorp.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('Tech Solutions', 'https://cdn.simpleicons.org/google/4285F4', 'Tech Solutions is a technology consulting firm specializing in business intelligence, data analytics, and digital transformation services.', 'Technology', '101-500', '2015', 'https://techsolutions.com', 'careers@techsolutions.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('Consulting Group', 'https://cdn.simpleicons.org/accenture/A100FF', 'Consulting Group provides strategic business consulting services, helping organizations achieve their goals through expert advice and innovative solutions.', 'Consulting', '501-1000', '2012', 'https://consultinggroup.com', 'careers@consultinggroup.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('COLI LINK GHANA LIMITED', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop&auto=format', 'COLI LINK GHANA LIMITED is a leading telecommunications and network infrastructure company providing Wi-Fi connectivity and technical support services across Ghana.', 'Telecom', '101-500', '2018', 'https://colilink.com', 'careers@colilink.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false),
('N.C.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop&auto=format', 'N.C. is a confidential organization focused on mental health and well-being initiatives, building innovative solutions to help people reduce stress and prevent burnout.', 'Health, pharmacy, hospitals, medical equipment', '51-100', '2020', 'https://example.com', 'careers@nc.com', '+233 XX XXX XXXX', 'Greater Accra, Ghana', false)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 7. INSERT JOBS (All existing jobs from AllJobs.tsx)
-- ============================================
-- Note: We'll use the company name to find the company_id
DO $$
DECLARE
  wgu_id UUID;
  ms_id UUID;
  adidas_id UUID;
  nike_id UUID;
  apple_id UUID;
  google_id UUID;
  amazon_id UUID;
  meta_id UUID;
  tesla_id UUID;
  netflix_id UUID;
  finance_id UUID;
  tech_id UUID;
  consulting_id UUID;
  coli_id UUID;
  nc_id UUID;
BEGIN
  -- Get company IDs
  SELECT id INTO wgu_id FROM companies WHERE name = 'WESTERN GOVERNORS UNIVERSITY';
  SELECT id INTO ms_id FROM companies WHERE name = 'Microsoft';
  SELECT id INTO adidas_id FROM companies WHERE name = 'Adidas';
  SELECT id INTO nike_id FROM companies WHERE name = 'Nike';
  SELECT id INTO apple_id FROM companies WHERE name = 'Apple';
  SELECT id INTO google_id FROM companies WHERE name = 'Google';
  SELECT id INTO amazon_id FROM companies WHERE name = 'Amazon';
  SELECT id INTO meta_id FROM companies WHERE name = 'Meta';
  SELECT id INTO tesla_id FROM companies WHERE name = 'Tesla';
  SELECT id INTO netflix_id FROM companies WHERE name = 'Netflix';
  SELECT id INTO finance_id FROM companies WHERE name = 'Finance Corp';
  SELECT id INTO tech_id FROM companies WHERE name = 'Tech Solutions';
  SELECT id INTO consulting_id FROM companies WHERE name = 'Consulting Group';
  SELECT id INTO coli_id FROM companies WHERE name = 'COLI LINK GHANA LIMITED';
  SELECT id INTO nc_id FROM companies WHERE name = 'N.C.';

  -- WESTERN GOVERNORS UNIVERSITY Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (wgu_id, 'WESTERN GOVERNORS UNIVERSITY', 'https://logo.clearbit.com/wgu.edu', 'Marketing Manager- Accra', 'Western Governors University (WGU) is seeking an experienced and innovative Marketing Manager to lead the development and execution of marketing strategies that promote the university''s mission and offerings. This remote position plays a pivotal role in enhancing WGU''s brand presence, driving student enrollment, and supporting the university''s growth in Ghana and across Africa.', '["Marketing", "Strategy", "Digital Marketing", "Brand Management", "Communication"]'::jsonb, 'Master', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'East Legon', '2025-11-19', true, true, 'Marketing, communication', 'Education, training'),
  (wgu_id, 'WESTERN GOVERNORS UNIVERSITY', 'https://logo.clearbit.com/wgu.edu', 'Student Success Coordinator', 'Join WGU as a Student Success Coordinator to support and guide students throughout their educational journey. You''ll work closely with students to ensure they achieve their academic goals and have a positive learning experience.', '["Student Services", "Counseling", "Education", "Communication"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-18', true, false, 'Services', 'Education, training'),
  (wgu_id, 'WESTERN GOVERNORS UNIVERSITY', 'https://logo.clearbit.com/wgu.edu', 'IT Support Specialist', 'WGU is looking for an IT Support Specialist to provide technical assistance to students and staff, ensuring smooth operation of our online learning platform and systems.', '["IT Support", "Technical Troubleshooting", "Customer Service"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-17', true, false, 'IT, new technologies', 'Education, training');

  -- Microsoft Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (ms_id, 'Microsoft', 'https://logo.clearbit.com/microsoft.com', 'Software Engineer', 'Microsoft is seeking a talented Software Engineer to join our development team. You''ll work on cutting-edge cloud technologies and help build solutions that empower millions of users worldwide.', '["C#", ".NET", "Azure", "Software Development", "Cloud Computing"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-20', true, false, 'IT, new technologies', 'IT, software engineering, Internet'),
  (ms_id, 'Microsoft', 'https://logo.clearbit.com/microsoft.com', 'Cloud Solutions Architect', 'Join Microsoft as a Cloud Solutions Architect and help businesses transform their operations using Azure cloud services. You''ll design scalable solutions and work with enterprise clients.', '["Azure", "Cloud Architecture", "Solution Design", "Enterprise Solutions"]'::jsonb, 'Master', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-19', true, false, 'IT, new technologies', 'IT, software engineering, Internet'),
  (ms_id, 'Microsoft', 'https://logo.clearbit.com/microsoft.com', 'Product Manager', 'Microsoft is looking for a Product Manager to drive product strategy and development for our enterprise software solutions in the African market.', '["Product Management", "Strategy", "Agile", "Business Analysis"]'::jsonb, 'Master', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-18', true, false, 'Management', 'IT, software engineering, Internet');

  -- Adidas Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (adidas_id, 'Adidas', 'https://logo.clearbit.com/adidas.com', 'Retail Store Manager', 'Adidas is seeking an experienced Retail Store Manager to lead our flagship store in Accra. You''ll be responsible for driving sales, managing staff, and ensuring exceptional customer experience.', '["Retail Management", "Sales", "Team Leadership", "Customer Service"]'::jsonb, 'Bachelor', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-20', true, false, 'Sales', 'Distribution, selling, wholesale'),
  (adidas_id, 'Adidas', 'https://logo.clearbit.com/adidas.com', 'Marketing Coordinator', 'Join Adidas as a Marketing Coordinator to support marketing campaigns and brand initiatives across Ghana. You''ll work on digital marketing, events, and brand partnerships.', '["Marketing", "Digital Marketing", "Brand Management", "Events"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-19', true, false, 'Marketing, communication', 'Distribution, selling, wholesale'),
  (adidas_id, 'Adidas', 'https://logo.clearbit.com/adidas.com', 'Supply Chain Analyst', 'Adidas is looking for a Supply Chain Analyst to optimize our logistics and distribution operations in West Africa.', '["Supply Chain", "Logistics", "Data Analysis", "Operations"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Tema', '2025-11-18', true, false, 'Transport, logistics', 'Distribution, selling, wholesale');

  -- Nike Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (nike_id, 'Nike', 'https://logo.clearbit.com/nike.com', 'Brand Marketing Manager', 'Nike is seeking a Brand Marketing Manager to develop and execute marketing strategies that connect with athletes and sports enthusiasts across Ghana.', '["Brand Marketing", "Sports Marketing", "Digital Marketing", "Strategy"]'::jsonb, 'Bachelor', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-20', true, false, 'Marketing, communication', 'Distribution, selling, wholesale'),
  (nike_id, 'Nike', 'https://logo.clearbit.com/nike.com', 'Retail Operations Specialist', 'Join Nike as a Retail Operations Specialist to ensure smooth operations across our retail locations and optimize the customer shopping experience.', '["Retail Operations", "Operations Management", "Process Improvement"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-19', true, false, 'Sales', 'Distribution, selling, wholesale');

  -- Apple Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (apple_id, 'Apple', 'https://logo.clearbit.com/apple.com', 'iOS Developer', 'Apple is looking for an iOS Developer to create innovative mobile applications. You''ll work with cutting-edge technologies and help build apps that millions of users love.', '["iOS Development", "Swift", "Objective-C", "Mobile Development"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-20', true, false, 'IT, new technologies', 'IT, software engineering, Internet'),
  (apple_id, 'Apple', 'https://logo.clearbit.com/apple.com', 'Customer Experience Specialist', 'Join Apple as a Customer Experience Specialist to provide exceptional support to customers and help them get the most out of their Apple products.', '["Customer Service", "Technical Support", "Communication"]'::jsonb, 'High school', 'Less than 2 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-19', true, false, 'Services', 'IT, software engineering, Internet'),
  (apple_id, 'Apple', 'https://logo.clearbit.com/apple.com', 'Sales Manager', 'Apple is seeking a Sales Manager to lead our sales team and drive revenue growth in the Ghana market.', '["Sales Management", "Team Leadership", "Business Development"]'::jsonb, 'Bachelor', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-18', true, false, 'Sales', 'IT, software engineering, Internet');

  -- Google Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (google_id, 'Google', 'https://logo.clearbit.com/google.com', 'Software Engineer - Backend', 'Google is looking for a Backend Software Engineer to build scalable systems and services that power Google''s products used by billions of people.', '["Backend Development", "Python", "Java", "Distributed Systems"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-20', true, false, 'IT, new technologies', 'IT, software engineering, Internet'),
  (google_id, 'Google', 'https://logo.clearbit.com/google.com', 'Product Marketing Manager', 'Join Google as a Product Marketing Manager to drive product adoption and market growth for Google''s suite of products in Africa.', '["Product Marketing", "Go-to-Market Strategy", "Analytics"]'::jsonb, 'Master', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-19', true, false, 'Marketing, communication', 'IT, software engineering, Internet'),
  (google_id, 'Google', 'https://logo.clearbit.com/google.com', 'UX Designer', 'Google is seeking a UX Designer to create intuitive and beautiful user experiences for our products. You''ll work closely with engineers and product managers.', '["UX Design", "UI Design", "User Research", "Prototyping"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-18', true, false, 'IT, new technologies', 'IT, software engineering, Internet');

  -- Amazon Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (amazon_id, 'Amazon', 'https://logo.clearbit.com/amazon.com', 'Software Development Engineer', 'Amazon is looking for a Software Development Engineer to build and maintain systems that power our e-commerce platform serving customers across Africa.', '["Software Development", "Java", "AWS", "System Design"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-20', true, false, 'IT, new technologies', 'IT, software engineering, Internet'),
  (amazon_id, 'Amazon', 'https://logo.clearbit.com/amazon.com', 'Operations Manager', 'Join Amazon as an Operations Manager to oversee fulfillment center operations and ensure efficient delivery of orders to customers.', '["Operations Management", "Logistics", "Process Optimization"]'::jsonb, 'Bachelor', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'Tema', '2025-11-19', true, false, 'Transport, logistics', 'Distribution, selling, wholesale'),
  (amazon_id, 'Amazon', 'https://logo.clearbit.com/amazon.com', 'Business Development Manager', 'Amazon is seeking a Business Development Manager to identify and develop partnerships with sellers and businesses in Ghana.', '["Business Development", "Partnerships", "Sales", "Negotiation"]'::jsonb, 'Bachelor', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-18', true, false, 'Sales', 'Distribution, selling, wholesale');

  -- Meta Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (meta_id, 'Meta', 'https://logo.clearbit.com/meta.com', 'Frontend Engineer', 'Meta is looking for a Frontend Engineer to build user interfaces for our social media platforms. You''ll work with React and modern web technologies.', '["React", "JavaScript", "TypeScript", "Frontend Development"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-20', true, false, 'IT, new technologies', 'IT, software engineering, Internet'),
  (meta_id, 'Meta', 'https://logo.clearbit.com/meta.com', 'Data Scientist', 'Join Meta as a Data Scientist to analyze user behavior, build machine learning models, and provide insights that drive product decisions.', '["Data Science", "Machine Learning", "Python", "Statistics"]'::jsonb, 'Master', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-19', true, false, 'IT, new technologies', 'IT, software engineering, Internet');

  -- Tesla Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (tesla_id, 'Tesla', 'https://logo.clearbit.com/tesla.com', 'Electrical Engineer', 'Tesla is seeking an Electrical Engineer to work on electric vehicle charging infrastructure and energy solutions in Ghana.', '["Electrical Engineering", "Power Systems", "Renewable Energy"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-20', true, false, 'R&D, project management', 'Electricity, water, gas, nuclear, energy'),
  (tesla_id, 'Tesla', 'https://logo.clearbit.com/tesla.com', 'Sales Advisor', 'Join Tesla as a Sales Advisor to help customers discover and purchase our electric vehicles and energy products.', '["Sales", "Customer Service", "Product Knowledge"]'::jsonb, 'Bachelor', 'Less than 2 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-19', true, false, 'Sales', 'Motor, transportation equipment, reparation');

  -- Netflix Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (netflix_id, 'Netflix', 'https://logo.clearbit.com/netflix.com', 'Content Acquisition Manager', 'Netflix is looking for a Content Acquisition Manager to identify and acquire local content for our streaming platform in Africa.', '["Content Acquisition", "Media", "Negotiation", "Entertainment Industry"]'::jsonb, 'Bachelor', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-20', true, false, 'Marketing, communication', 'Marketing, communication, media'),
  (netflix_id, 'Netflix', 'https://logo.clearbit.com/netflix.com', 'Marketing Manager', 'Join Netflix as a Marketing Manager to develop and execute marketing campaigns that grow our subscriber base in Ghana.', '["Marketing", "Digital Marketing", "Campaign Management", "Brand Marketing"]'::jsonb, 'Bachelor', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'Accra', '2025-11-19', true, false, 'Marketing, communication', 'Marketing, communication, media');

  -- Finance Corp Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (finance_id, 'Finance Corp', 'https://cdn.simpleicons.org/visa/1A1F71', 'Accounts and Finance Analyst', 'We are looking for an Accounts and Finance Analyst to join our client''s team. The ideal candidate will be responsible for financial analysis, budgeting, and reporting.', '["Accounting", "Budgeting", "Controlling", "Finance", "Financial Statements", "Internal Control", "Investment", "Risk Management"]'::jsonb, 'Bachelor', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'East Legon', '2025-11-19', true, false, 'Accounting, controlling, finance', 'Banking, insurance, finance');

  -- Tech Solutions Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (tech_id, 'Tech Solutions', 'https://cdn.simpleicons.org/google/4285F4', 'Business Information Analyst', 'We are looking for a Business Information Analyst to join our client''s team. The role involves analyzing business data and providing insights to support decision-making.', '["Communication", "Marketing", "Marketing Communication"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'East Legon', '2025-11-19', true, false, 'Marketing, communication', 'IT, software engineering, Internet');

  -- Consulting Group Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (consulting_id, 'Consulting Group', 'https://cdn.simpleicons.org/accenture/A100FF', 'Business Consultant', 'We are looking for an experienced Business Consultant to provide strategic advice and solutions to our clients.', '["Strategy", "Consulting", "Business Analysis", "Project Management"]'::jsonb, 'Master', '5 to 10 years', 'Permanent contract', 'Greater Accra', 'East Legon', '2025-11-19', true, false, 'Management', 'Advice, audit, accounting');

  -- COLI LINK GHANA LIMITED Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (coli_id, 'COLI LINK GHANA LIMITED', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop&auto=format', 'Field Network Technician', 'We are looking for a Field Network Technician. Responsibilities: Survey, Install and Setup Wi-Fi connection for customers of the company. Troubleshoot connectivity and hardware issues of customers of the company. Submit Field Technical Report on jobs daily. Respond promptly to reports forwarded', '["Networking", "Technical Support", "Wi-Fi", "Hardware Troubleshooting", "Field Service"]'::jsonb, 'HND', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'East Legon', '2025-11-19', true, false, 'IT, new technologies', 'Telecom');

  -- N.C. Jobs
  INSERT INTO jobs (company_id, company, company_logo, title, description, skills, education_level, experience_level, contract_type, region, city, date, verified, featured, job_category, industry) VALUES
  (nc_id, 'N.C.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop&auto=format', 'Operations and Project Assistant', 'Operations & Project Assistant (Ghana) Help us bring calm and clarity to the world - starting in Ghana. We''re building something that matters: a global method to help people reduce stress, prevent burnout, and take back control of their mental well-being. Our first pilot starts in Ghana - and we need your help to make it successful.', '["Operations", "Project Management", "Administration", "Mental Health", "Coordination"]'::jsonb, 'Bachelor', '2 to 5 years', 'Permanent contract', 'Greater Accra', 'East Legon', '2025-10-21', true, false, 'Management', 'Health, pharmacy, hospitals, medical equipment');

END $$;

-- ============================================
-- 8. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. CREATE RLS POLICIES (Public read, authenticated write)
-- ============================================
-- Allow public read access
CREATE POLICY "Public can read companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Public can read jobs" ON jobs FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (for admin)
CREATE POLICY "Authenticated users can manage companies" ON companies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage jobs" ON jobs FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 10. CREATE FUNCTION TO UPDATE JOB COUNT
-- ============================================
CREATE OR REPLACE FUNCTION update_company_job_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE companies
  SET updated_at = NOW()
  WHERE id = COALESCE(NEW.company_id, OLD.company_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update company when jobs change
DROP TRIGGER IF EXISTS trigger_update_company_on_job_change ON jobs;
CREATE TRIGGER trigger_update_company_on_job_change
  AFTER INSERT OR UPDATE OR DELETE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_company_job_count();

-- ============================================
-- 11. CREATE INTERNSHIPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT,
  description TEXT,
  description_paragraphs JSONB DEFAULT '[]'::jsonb,
  impact_paragraphs JSONB DEFAULT '[]'::jsonb,
  impact_highlights JSONB DEFAULT '[]'::jsonb,
  field_ops_groups JSONB DEFAULT '[]'::jsonb,
  skills_formal_qualifications JSONB DEFAULT '[]'::jsonb,
  skills_additional_knowledge JSONB DEFAULT '[]'::jsonb,
  skills_experience JSONB DEFAULT '[]'::jsonb,
  skills_technical JSONB DEFAULT '[]'::jsonb,
  behavioral_attributes JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  culture_paragraphs JSONB DEFAULT '[]'::jsonb,
  opportunity_paragraphs JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  duration TEXT,
  type TEXT,
  stipend TEXT,
  requirements JSONB DEFAULT '[]'::jsonb,
  posted DATE DEFAULT CURRENT_DATE,
  image_url TEXT,
  application_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. CREATE NSS PROGRAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS nss_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  description_paragraphs JSONB DEFAULT '[]'::jsonb,
  impact_paragraphs JSONB DEFAULT '[]'::jsonb,
  impact_highlights JSONB DEFAULT '[]'::jsonb,
  field_ops_groups JSONB DEFAULT '[]'::jsonb,
  skills_formal_qualifications JSONB DEFAULT '[]'::jsonb,
  skills_additional_knowledge JSONB DEFAULT '[]'::jsonb,
  skills_experience JSONB DEFAULT '[]'::jsonb,
  skills_technical JSONB DEFAULT '[]'::jsonb,
  behavioral_attributes JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  culture_paragraphs JSONB DEFAULT '[]'::jsonb,
  opportunity_paragraphs JSONB DEFAULT '[]'::jsonb,
  duration TEXT,
  locations JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  icon TEXT,
  color TEXT,
  text_color TEXT,
  image_url TEXT,
  application_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. CREATE GRADUATE PROGRAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS graduate_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  type TEXT,
  duration TEXT,
  salary TEXT,
  posted DATE DEFAULT CURRENT_DATE,
  description TEXT,
  description_paragraphs JSONB DEFAULT '[]'::jsonb,
  impact_paragraphs JSONB DEFAULT '[]'::jsonb,
  impact_highlights JSONB DEFAULT '[]'::jsonb,
  field_ops_groups JSONB DEFAULT '[]'::jsonb,
  skills_formal_qualifications JSONB DEFAULT '[]'::jsonb,
  skills_additional_knowledge JSONB DEFAULT '[]'::jsonb,
  skills_experience JSONB DEFAULT '[]'::jsonb,
  skills_technical JSONB DEFAULT '[]'::jsonb,
  behavioral_attributes JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  culture_paragraphs JSONB DEFAULT '[]'::jsonb,
  opportunity_paragraphs JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  application_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. CREATE YEA PROGRAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS yea_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  description_paragraphs JSONB DEFAULT '[]'::jsonb,
  impact_paragraphs JSONB DEFAULT '[]'::jsonb,
  impact_highlights JSONB DEFAULT '[]'::jsonb,
  field_ops_groups JSONB DEFAULT '[]'::jsonb,
  skills_formal_qualifications JSONB DEFAULT '[]'::jsonb,
  skills_additional_knowledge JSONB DEFAULT '[]'::jsonb,
  skills_experience JSONB DEFAULT '[]'::jsonb,
  skills_technical JSONB DEFAULT '[]'::jsonb,
  behavioral_attributes JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  culture_paragraphs JSONB DEFAULT '[]'::jsonb,
  opportunity_paragraphs JSONB DEFAULT '[]'::jsonb,
  duration TEXT,
  stipend TEXT,
  locations JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  icon TEXT,
  color TEXT,
  text_color TEXT,
  image_url TEXT,
  application_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 15. CREATE INDEXES FOR NEW TABLES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_internships_location ON internships(location);
CREATE INDEX IF NOT EXISTS idx_internships_type ON internships(type);
CREATE INDEX IF NOT EXISTS idx_nss_programs_duration ON nss_programs(duration);
CREATE INDEX IF NOT EXISTS idx_graduate_programs_company ON graduate_programs(company);
CREATE INDEX IF NOT EXISTS idx_graduate_programs_type ON graduate_programs(type);
CREATE INDEX IF NOT EXISTS idx_yea_programs_duration ON yea_programs(duration);

-- ============================================
-- 16. CREATE TRIGGERS FOR NEW TABLES
-- ============================================
DROP TRIGGER IF EXISTS update_internships_updated_at ON internships;
CREATE TRIGGER update_internships_updated_at
  BEFORE UPDATE ON internships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_nss_programs_updated_at ON nss_programs;
CREATE TRIGGER update_nss_programs_updated_at
  BEFORE UPDATE ON nss_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_graduate_programs_updated_at ON graduate_programs;
CREATE TRIGGER update_graduate_programs_updated_at
  BEFORE UPDATE ON graduate_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_yea_programs_updated_at ON yea_programs;
CREATE TRIGGER update_yea_programs_updated_at
  BEFORE UPDATE ON yea_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 17. INSERT SAMPLE INTERNSHIPS
-- ============================================
INSERT INTO internships (title, company, company_logo, description, skills, location, duration, type, stipend, requirements, posted, image_url) VALUES
('Software Development Intern', 'Tech Solutions Ghana', 'https://logo.clearbit.com/techsolutions.com', 'Join our dynamic team to develop innovative software solutions. Work on real projects, learn from experienced developers, and build your portfolio.', '["JavaScript", "React", "Node.js", "Git"]'::jsonb, 'Accra, Greater Accra', '3-6 months', 'Full-time', 'GHS 1,200/month', '["Computer Science student", "Basic programming knowledge", "Portfolio preferred"]'::jsonb, '2025-11-18', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop'),
('Marketing Communications Intern', 'Digital Marketing Agency', 'https://logo.clearbit.com/marketing.com', 'Gain hands-on experience in digital marketing, content creation, and social media management. Perfect for marketing and communications students.', '["Social Media", "Content Writing", "Analytics", "Design"]'::jsonb, 'Kumasi, Ashanti', '4 months', 'Part-time', 'GHS 800/month', '["Marketing/Communications student", "Creative mindset", "Social media savvy"]'::jsonb, '2025-11-15', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'),
('Finance & Accounting Intern', 'First National Bank', 'https://logo.clearbit.com/fnb.com', 'Work alongside finance professionals, assist with financial analysis, and learn banking operations. Ideal for finance and accounting majors.', '["Excel", "Financial Analysis", "Accounting", "Reporting"]'::jsonb, 'Accra, Greater Accra', '6 months', 'Full-time', 'GHS 1,500/month', '["Finance/Accounting student", "Strong analytical skills", "Attention to detail"]'::jsonb, '2025-11-10', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop');

-- ============================================
-- 18. INSERT SAMPLE NSS PROGRAMS
-- ============================================
INSERT INTO nss_programs (title, description, duration, locations, requirements, benefits, icon, color, text_color, image_url) VALUES
('Teaching Service', 'Serve as a teacher in public schools across Ghana, making a meaningful impact on students'' education and future.', '12 months', '["All Regions", "Urban & Rural"]'::jsonb, '["Education degree", "Teaching certification preferred", "Passion for education"]'::jsonb, '["Professional development", "Teaching experience", "Community impact", "Stipend provided"]'::jsonb, 'GraduationCap', 'bg-blue-50 border-blue-200', 'text-blue-900', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop'),
('Health Service', 'Work in healthcare facilities across Ghana, supporting medical professionals and serving communities in need.', '12 months', '["All Regions", "Hospitals & Clinics"]'::jsonb, '["Health-related degree", "Medical certification", "Compassion for patients"]'::jsonb, '["Healthcare experience", "Professional growth", "Community service", "Stipend provided"]'::jsonb, 'Shield', 'bg-red-50 border-red-200', 'text-red-900', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&auto=format&fit=crop'),
('Administrative Service', 'Support government and public sector operations, gaining valuable administrative and organizational experience.', '12 months', '["All Regions", "Government Offices"]'::jsonb, '["Any degree", "Organizational skills", "Computer literacy"]'::jsonb, '["Administrative experience", "Government exposure", "Professional network", "Stipend provided"]'::jsonb, 'Building2', 'bg-emerald-50 border-emerald-200', 'text-emerald-900', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop');

-- ============================================
-- 19. INSERT SAMPLE GRADUATE PROGRAMS
-- ============================================
INSERT INTO graduate_programs (title, company, location, type, duration, salary, posted, description, skills, requirements, benefits, image_url) VALUES
('Management Trainee Program', 'First National Bank', 'Accra, Greater Accra', 'Full-time', '18 months', 'Competitive', '2025-11-16', 'Join our prestigious management trainee program designed for fresh graduates. Receive comprehensive training, mentorship, and fast-track career development opportunities.', '["Leadership", "Analytical Thinking", "Communication", "Problem Solving"]'::jsonb, '["First Class or Second Class Upper degree", "Strong leadership potential", "Excellent communication skills", "Age: 25-28 years"]'::jsonb, '["Comprehensive training program", "Mentorship from senior executives", "Career progression opportunities", "Competitive salary and benefits"]'::jsonb, 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop'),
('Graduate Engineering Program', 'Ghana Engineering Corporation', 'Kumasi, Ashanti', 'Full-time', '24 months', 'GHS 3,500 - 4,500', '2025-11-10', 'Launch your engineering career with our structured graduate program. Work on real projects, develop technical expertise, and build a strong professional foundation.', '["Engineering", "Project Management", "Technical Design", "CAD"]'::jsonb, '["Engineering degree (Civil, Mechanical, Electrical)", "Minimum 2:1 classification", "Professional registration preferred", "Strong technical skills"]'::jsonb, '["Hands-on project experience", "Professional development", "Technical training", "Industry certifications"]'::jsonb, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop'),
('Graduate Analyst Program', 'Tech Solutions Ghana', 'Accra, Greater Accra', 'Full-time', '12 months', 'GHS 2,800 - 3,500', '2025-11-05', 'Perfect for fresh graduates interested in data analysis, business intelligence, and technology. Develop analytical skills and work with cutting-edge tools.', '["Data Analysis", "SQL", "Excel", "Business Intelligence"]'::jsonb, '["Degree in IT, Mathematics, Statistics, or related field", "Strong analytical skills", "Proficiency in Excel and SQL", "Problem-solving mindset"]'::jsonb, '["Data analytics training", "Exposure to modern tools", "Mentorship program", "Career advancement"]'::jsonb, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop');

-- ============================================
-- 20. INSERT SAMPLE YEA PROGRAMS
-- ============================================
INSERT INTO yea_programs (title, description, duration, stipend, locations, requirements, benefits, icon, color, text_color, image_url) VALUES
('Youth in Afforestation', 'Join the national afforestation program and contribute to environmental conservation while earning a stable income.', '12-24 months', 'GHS 1,200/month', '["All Regions", "Forest Reserves"]'::jsonb, '["Ages 18-35", "Basic education", "Physical fitness", "Interest in environmental conservation"]'::jsonb, '["Environmental impact", "Skill development", "Stable income", "Community service"]'::jsonb, '🌳', 'bg-emerald-50 border-emerald-200', 'text-emerald-900', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop'),
('Youth in Sanitation', 'Work in waste management and sanitation, keeping communities clean while developing valuable skills.', '12 months', 'GHS 1,000/month', '["Urban Areas", "Municipalities"]'::jsonb, '["Ages 18-35", "Willingness to work", "Physical fitness", "Team player"]'::jsonb, '["Community service", "Regular income", "Skill training", "Job security"]'::jsonb, '🧹', 'bg-blue-50 border-blue-200', 'text-blue-900', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop'),
('Youth in Construction', 'Gain hands-on experience in construction and infrastructure development while earning a competitive stipend.', '12-18 months', 'GHS 1,400/month', '["All Regions", "Construction Sites"]'::jsonb, '["Ages 18-35", "Physical fitness", "Willingness to learn", "Safety conscious"]'::jsonb, '["Construction skills", "Certification opportunities", "Stable income", "Career advancement"]'::jsonb, '🏗️', 'bg-amber-50 border-amber-200', 'text-amber-900', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop');

-- ============================================
-- 21. ENABLE RLS FOR NEW TABLES
-- ============================================
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE nss_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE graduate_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE yea_programs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 22. CREATE RLS POLICIES FOR NEW TABLES
-- ============================================
CREATE POLICY "Public can read internships" ON internships FOR SELECT USING (true);
CREATE POLICY "Public can read nss_programs" ON nss_programs FOR SELECT USING (true);
CREATE POLICY "Public can read graduate_programs" ON graduate_programs FOR SELECT USING (true);
CREATE POLICY "Public can read yea_programs" ON yea_programs FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage internships" ON internships FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage nss_programs" ON nss_programs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage graduate_programs" ON graduate_programs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage yea_programs" ON yea_programs FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- COMPLETE!
-- ============================================
-- The database is now set up with:
-- - Companies table with 15 companies
-- - Jobs table with 29 jobs (including 2 from BrowseJobs page)
-- - Internships table with 3 sample internships
-- - NSS Programs table with 3 sample programs
-- - Graduate Programs table with 3 sample programs
-- - YEA Programs table with 3 sample programs
-- - Proper indexes for performance
-- - RLS policies for security
-- - Triggers for automatic updates
