import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Download, MessageSquare } from 'lucide-react';

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Placeholder data - will be replaced with actual data later
  const application = {
    id: id || '1',
    candidateName: 'John Mensah',
    candidateEmail: 'john.mensah@email.com',
    candidatePhone: '+233 24 123 4567',
    jobTitle: 'Senior Marketing Manager',
    status: 'pending',
    appliedDate: '2024-01-20',
    location: 'Accra, Greater Accra',
    experience: '5 years',
    education: 'Bachelor\'s Degree in Marketing',
    skills: ['Digital Marketing', 'Analytics', 'Strategy', 'SEO', 'Content Creation'],
    coverLetter: 'Dear Hiring Manager,\n\nI am writing to express my strong interest in the Senior Marketing Manager position. With over 5 years of experience in digital marketing and a proven track record of driving successful campaigns, I am confident that I would be a valuable addition to your team.\n\nIn my previous role, I successfully increased brand awareness by 40% and generated over 500 qualified leads per month through strategic marketing initiatives. I am particularly excited about the opportunity to bring my expertise in analytics and SEO to help drive your company\'s growth.\n\nThank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your needs.\n\nBest regards,\nJohn Mensah',
    resumeUrl: '#',
    portfolioUrl: '#'
  };

  return (
    <>
      <style>{`
        .ad-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .ad-header {
          margin-bottom: 2rem;
        }

        .ad-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #696cff;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9375rem;
          margin-bottom: 1rem;
          transition: color 0.2s ease;
        }

        .ad-back-link:hover {
          color: #5a5de0;
        }

        .ad-title {
          font-size: 2rem;
          font-weight: 700;
          color: #141522;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ad-subtitle {
          font-size: 1rem;
          color: #8592a3;
          margin: 0.5rem 0 0 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ad-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .ad-main {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ad-section {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .ad-section-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #141522;
          margin: 0 0 1rem 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ad-section-content {
          color: #54577A;
          font-size: 0.9375rem;
          line-height: 1.6;
          white-space: pre-wrap;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ad-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ad-info-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .ad-info-title {
          font-size: 1rem;
          font-weight: 700;
          color: #141522;
          margin: 0 0 1rem 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ad-info-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #eceef1;
        }

        .ad-info-item:last-child {
          border-bottom: none;
        }

        .ad-info-icon {
          width: 1.125rem;
          height: 1.125rem;
          color: #8592a3;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .ad-info-text {
          flex: 1;
          font-size: 0.9375rem;
          color: #54577A;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ad-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .ad-skill-tag {
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 500;
          background: #f5f5f9;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ad-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ad-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #e5e7eb;
          background: #fff;
          color: #141522;
          text-decoration: none;
        }

        .ad-action-btn:hover {
          background: #f5f5f9;
          border-color: #696cff;
          color: #696cff;
        }

        .ad-action-btn-primary {
          background: #696cff;
          color: #fff;
          border-color: #696cff;
        }

        .ad-action-btn-primary:hover {
          background: #5a5de0;
          border-color: #5a5de0;
        }

        @media (max-width: 768px) {
          .ad-content {
            grid-template-columns: 1fr;
          }

          .ad-page {
            padding: 1rem;
          }
        }
      `}</style>
      <div className="ad-page">
        <div className="ad-header">
          <Link to="/employer/applications/all" className="ad-back-link">
            <ArrowLeft size={18} />
            Back to Applications
          </Link>
          <h1 className="ad-title">{application.candidateName}</h1>
          <p className="ad-subtitle">{application.jobTitle}</p>
        </div>

        <div className="ad-content">
          <div className="ad-main">
            <div className="ad-section">
              <h2 className="ad-section-title">Cover Letter</h2>
              <div className="ad-section-content">{application.coverLetter}</div>
            </div>

            <div className="ad-section">
              <h2 className="ad-section-title">Experience</h2>
              <div className="ad-section-content">{application.experience}</div>
            </div>

            <div className="ad-section">
              <h2 className="ad-section-title">Education</h2>
              <div className="ad-section-content">{application.education}</div>
            </div>
          </div>

          <div className="ad-sidebar">
            <div className="ad-info-card">
              <h3 className="ad-info-title">Contact Information</h3>
              <div className="ad-info-item">
                <Mail className="ad-info-icon" />
                <span className="ad-info-text">{application.candidateEmail}</span>
              </div>
              <div className="ad-info-item">
                <Phone className="ad-info-icon" />
                <span className="ad-info-text">{application.candidatePhone}</span>
              </div>
              <div className="ad-info-item">
                <MapPin className="ad-info-icon" />
                <span className="ad-info-text">{application.location}</span>
              </div>
              <div className="ad-info-item">
                <Calendar className="ad-info-icon" />
                <span className="ad-info-text">Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="ad-info-card">
              <h3 className="ad-info-title">Skills</h3>
              <div className="ad-skills">
                {application.skills.map((skill, idx) => (
                  <span key={idx} className="ad-skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="ad-info-card">
              <h3 className="ad-info-title">Actions</h3>
              <div className="ad-actions">
                <a href={application.resumeUrl} className="ad-action-btn">
                  <Download size={18} />
                  Download Resume
                </a>
                <a href={application.portfolioUrl} className="ad-action-btn">
                  View Portfolio
                </a>
                <button className="ad-action-btn">
                  <MessageSquare size={18} />
                  Send Message
                </button>
                <button className="ad-action-btn-primary">
                  Shortlist Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationDetail;
