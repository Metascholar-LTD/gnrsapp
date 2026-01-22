import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Edit2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Save,
  X,
  Plus,
  Trash2,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  CheckCircle2,
  Loader2,
  User,
  Calendar,
  Building2,
  Link as LinkIcon
} from 'lucide-react';

// Types
interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  current: boolean;
}

interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface UserProfile {
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  avatar?: string;
  coverPhoto?: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: string[];
}

const mockProfile: UserProfile = {
  firstName: 'Kofi',
  lastName: 'Mensah',
  headline: 'Computer Science Student at KNUST',
  bio: 'Passionate about technology and innovation. Currently pursuing a degree in Computer Science with a focus on software development and data science. Looking for opportunities to apply my skills in real-world projects.',
  email: 'kofi.mensah@example.com',
  phone: '+233 24 123 4567',
  location: 'Kumasi, Ghana',
  website: 'https://kofimensah.dev',
  linkedin: 'linkedin.com/in/kofimensah',
  github: 'github.com/kofimensah',
  twitter: 'twitter.com/kofimensah',
  education: [
    {
      id: '1',
      institution: 'Kwame Nkrumah University of Science and Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startYear: '2021',
      endYear: '2025',
      current: true
    },
    {
      id: '2',
      institution: 'Prempeh College',
      degree: 'WASSCE',
      field: 'General Science',
      startYear: '2018',
      endYear: '2021',
      current: false
    }
  ],
  experience: [
    {
      id: '1',
      company: 'Tech Startup Ghana',
      title: 'Software Development Intern',
      location: 'Accra, Ghana',
      startDate: 'Jun 2023',
      endDate: '',
      current: true,
      description: 'Working on web application development using React and Node.js. Contributing to the development of a fintech product.'
    }
  ],
  skills: [
    { id: '1', name: 'JavaScript', level: 'advanced' },
    { id: '2', name: 'Python', level: 'intermediate' },
    { id: '3', name: 'React', level: 'advanced' },
    { id: '4', name: 'Node.js', level: 'intermediate' },
    { id: '5', name: 'SQL', level: 'intermediate' }
  ],
  certifications: ['Google IT Support', 'AWS Cloud Practitioner']
};

const MyProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProfile(mockProfile);
      setLoading(false);
    }, 500);
  }, []);

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#8592a3';
      case 'intermediate': return '#03c3ec';
      case 'advanced': return '#71dd37';
      case 'expert': return '#696cff';
      default: return '#8592a3';
    }
  };

  const getSkillLevelWidth = (level: string) => {
    switch (level) {
      case 'beginner': return '25%';
      case 'intermediate': return '50%';
      case 'advanced': return '75%';
      case 'expert': return '100%';
      default: return '25%';
    }
  };

  // Calculate profile completeness
  const calculateCompleteness = () => {
    if (!profile) return 0;
    let completed = 0;
    const total = 10;
    if (profile.firstName && profile.lastName) completed++;
    if (profile.headline) completed++;
    if (profile.bio) completed++;
    if (profile.email) completed++;
    if (profile.phone) completed++;
    if (profile.location) completed++;
    if (profile.education.length > 0) completed++;
    if (profile.experience.length > 0) completed++;
    if (profile.skills.length > 0) completed++;
    if (profile.linkedin || profile.github) completed++;
    return Math.round((completed / total) * 100);
  };

  if (loading || !profile) {
    return (
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={32} className="mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#78716C', fontFamily: "'Source Sans Pro', sans-serif" }}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const completeness = calculateCompleteness();

  return (
    <div className="container-fluid p-0">
      {/* Cover Photo & Avatar */}
      <div className="card mb-4" style={{ overflow: 'hidden' }}>
        <div style={{
          height: '180px',
          backgroundColor: 'linear-gradient(135deg, #696cff 0%, #03c3ec 100%)',
          background: 'linear-gradient(135deg, #696cff 0%, #03c3ec 100%)',
          position: 'relative'
        }}>
          <button style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#1C1917',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}>
            <Camera size={14} />
            Change Cover
          </button>
        </div>
        <div className="card-body" style={{ paddingTop: '60px', position: 'relative' }}>
          {/* Avatar */}
          <div style={{
            position: 'absolute',
            top: '-60px',
            left: '24px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            padding: '4px'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: 'rgba(105, 108, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#696cff',
              fontSize: '2.5rem',
              fontWeight: 600,
              position: 'relative'
            }}>
              {profile.firstName[0]}{profile.lastName[0]}
              <button style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#696cff',
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
                borderRadius: '50%',
                cursor: 'pointer'
              }}>
                <Camera size={14} />
              </button>
            </div>
          </div>

          <div className="row align-items-start">
            <div className="col-lg-8">
              <h4 style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600, margin: '0 0 4px' }}>
                {profile.firstName} {profile.lastName}
              </h4>
              <p style={{ fontSize: '1rem', color: '#78716C', marginBottom: '12px' }}>{profile.headline}</p>
              <div className="d-flex flex-wrap gap-3" style={{ fontSize: '0.875rem', color: '#78716C' }}>
                <span className="d-flex align-items-center gap-1">
                  <MapPin size={14} />
                  {profile.location}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <Mail size={14} />
                  {profile.email}
                </span>
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#696cff', textDecoration: 'none' }}>
                    <Globe size={14} />
                    Portfolio
                  </a>
                )}
              </div>
            </div>
            <div className="col-lg-4 mt-3 mt-lg-0">
              <div style={{ padding: '16px', backgroundColor: '#FAFAF9', borderRadius: '8px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Profile Completeness</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: completeness >= 80 ? '#71dd37' : completeness >= 50 ? '#ffab00' : '#ff3e1d' }}>
                    {completeness}%
                  </span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#E7E5E4', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${completeness}%`,
                    height: '100%',
                    backgroundColor: completeness >= 80 ? '#71dd37' : completeness >= 50 ? '#ffab00' : '#ff3e1d',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                {completeness < 100 && (
                  <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#78716C' }}>
                    Complete your profile to improve visibility
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* About */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h6 className="card-title m-0">
                <User size={18} style={{ marginRight: '8px' }} />
                About
              </h6>
              <button style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#696cff' }}>
                <Edit2 size={16} />
              </button>
            </div>
            <div className="card-body">
              <p style={{ margin: 0, fontSize: '0.9375rem', color: '#1C1917', lineHeight: 1.7 }}>
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Experience */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h6 className="card-title m-0">
                <Briefcase size={18} style={{ marginRight: '8px' }} />
                Experience
              </h6>
              <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', color: '#696cff', fontSize: '0.8125rem' }}>
                <Plus size={14} />
                Add
              </button>
            </div>
            <div className="card-body">
              {profile.experience.length === 0 ? (
                <p style={{ color: '#78716C', textAlign: 'center', margin: 0 }}>No experience added yet</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {profile.experience.map((exp, index) => (
                    <div key={exp.id} style={{
                      padding: '16px',
                      backgroundColor: '#FAFAF9',
                      borderRadius: '8px',
                      borderLeft: '3px solid #696cff'
                    }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 style={{ margin: '0 0 4px', fontWeight: 600, color: '#1C1917' }}>{exp.title}</h6>
                          <p style={{ margin: '0 0 8px', fontSize: '0.875rem', color: '#78716C' }}>
                            {exp.company} • {exp.location}
                          </p>
                          <p style={{ margin: '0 0 8px', fontSize: '0.8125rem', color: '#A8A29E' }}>
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#1C1917' }}>{exp.description}</p>
                        </div>
                        <button style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#78716C' }}>
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h6 className="card-title m-0">
                <GraduationCap size={18} style={{ marginRight: '8px' }} />
                Education
              </h6>
              <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: '4px 8px', cursor: 'pointer', color: '#696cff', fontSize: '0.8125rem' }}>
                <Plus size={14} />
                Add
              </button>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                {profile.education.map(edu => (
                  <div key={edu.id} style={{
                    padding: '16px',
                    backgroundColor: '#FAFAF9',
                    borderRadius: '8px',
                    borderLeft: '3px solid #03c3ec'
                  }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 style={{ margin: '0 0 4px', fontWeight: 600, color: '#1C1917' }}>{edu.institution}</h6>
                        <p style={{ margin: '0 0 4px', fontSize: '0.875rem', color: '#78716C' }}>
                          {edu.degree} in {edu.field}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#A8A29E' }}>
                          {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                        </p>
                      </div>
                      <button style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#78716C' }}>
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Contact Info */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="card-title m-0">Contact Information</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(105, 108, 255, 0.1)', borderRadius: '8px' }}>
                    <Mail size={16} color="#696cff" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#A8A29E' }}>Email</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#1C1917' }}>{profile.email}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(113, 221, 55, 0.1)', borderRadius: '8px' }}>
                    <Phone size={16} color="#71dd37" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#A8A29E' }}>Phone</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#1C1917' }}>{profile.phone}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 171, 0, 0.1)', borderRadius: '8px' }}>
                    <MapPin size={16} color="#ffab00" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#A8A29E' }}>Location</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#1C1917' }}>{profile.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="card-title m-0">Social Links</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-2">
                {profile.linkedin && (
                  <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#FAFAF9', borderRadius: '6px', textDecoration: 'none', color: '#1C1917' }}>
                    <Linkedin size={18} color="#0077B5" />
                    <span style={{ fontSize: '0.875rem' }}>LinkedIn</span>
                  </a>
                )}
                {profile.github && (
                  <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#FAFAF9', borderRadius: '6px', textDecoration: 'none', color: '#1C1917' }}>
                    <Github size={18} color="#333" />
                    <span style={{ fontSize: '0.875rem' }}>GitHub</span>
                  </a>
                )}
                {profile.twitter && (
                  <a href={`https://${profile.twitter}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#FAFAF9', borderRadius: '6px', textDecoration: 'none', color: '#1C1917' }}>
                    <Twitter size={18} color="#1DA1F2" />
                    <span style={{ fontSize: '0.875rem' }}>Twitter</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h6 className="card-title m-0">Skills</h6>
              <button style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#696cff' }}>
                <Plus size={16} />
              </button>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                {profile.skills.map(skill => (
                  <div key={skill.id}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1C1917' }}>{skill.name}</span>
                      <span style={{ fontSize: '0.75rem', color: getSkillLevelColor(skill.level), textTransform: 'capitalize' }}>{skill.level}</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#F5F5F5', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: getSkillLevelWidth(skill.level),
                        height: '100%',
                        backgroundColor: getSkillLevelColor(skill.level),
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h6 className="card-title m-0">Certifications</h6>
              <button style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#696cff' }}>
                <Plus size={16} />
              </button>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {profile.certifications.map((cert, index) => (
                  <span key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(113, 221, 55, 0.1)',
                    color: '#71dd37',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 500
                  }}>
                    <Award size={14} />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MyProfile;
