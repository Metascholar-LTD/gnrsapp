import React, { useState } from 'react';
import {
  Users,
  Search,
  Star,
  Mail,
  Phone,
  Download,
  MessageSquare,
  MapPin,
  Briefcase,
  X
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  matchScore: number;
  shortlistedDate: string;
}

const CandidatesShortlist: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [candidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'John Mensah',
      email: 'john.mensah@email.com',
      phone: '+233 24 123 4567',
      location: 'Accra, Greater Accra',
      experience: '5 years',
      skills: ['Marketing', 'Digital Strategy', 'Analytics'],
      matchScore: 92,
      shortlistedDate: '2024-01-20'
    },
    {
      id: '2',
      name: 'Ama Asante',
      email: 'ama.asante@email.com',
      phone: '+233 20 987 6543',
      location: 'Kumasi, Ashanti',
      experience: '3 years',
      skills: ['React', 'TypeScript', 'Node.js'],
      matchScore: 88,
      shortlistedDate: '2024-01-18'
    }
  ]);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <style>{`
        .ec-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ec-header {
          margin-bottom: 2rem;
        }

        .ec-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #141522;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ec-subtitle {
          font-size: 0.9375rem;
          color: #54577A;
          margin: 0.5rem 0 0 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ec-card {
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4);
          overflow: hidden;
        }

        .ec-search-wrapper {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .ec-search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .ec-search-input:focus {
          outline: none;
          border-color: #696cff;
          box-shadow: 0 0 0 3px rgba(105, 108, 255, 0.1);
        }

        .ec-search-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: #8592a3;
        }

        .ec-candidates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .ec-candidate-card {
          padding: 1.5rem;
          border: 1px solid #eceef1;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .ec-candidate-card:hover {
          border-color: #696cff;
          box-shadow: 0 2px 8px rgba(105, 108, 255, 0.1);
        }

        .ec-candidate-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .ec-candidate-name {
          font-size: 1rem;
          font-weight: 600;
          color: #141522;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ec-match-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(113, 221, 55, 0.1);
          color: #71dd37;
        }

        .ec-candidate-contact {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.8125rem;
          color: #8592a3;
        }

        .ec-contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ec-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .ec-skill-tag {
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          background: #f5f5f9;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ec-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .ec-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.8125rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #d9dee3;
          background: #fff;
          color: #141522;
        }

        .ec-action-btn:hover {
          background: #f5f5f9;
          border-color: #696cff;
          color: #696cff;
        }

        .ec-action-btn-primary {
          background: #696cff;
          color: #fff;
          border-color: #696cff;
        }

        .ec-action-btn-primary:hover {
          background: #5a5de0;
          border-color: #5a5de0;
        }

        .ec-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: #8592a3;
        }
      `}</style>
      <div className="ec-page">
        <div className="ec-header">
          <h1 className="ec-title">Shortlisted Candidates</h1>
          <p className="ec-subtitle">Manage your shortlisted candidates</p>
        </div>

        <div className="ec-card">
          <div style={{ padding: '1.5rem' }}>
            <div className="ec-search-wrapper">
              <Search className="ec-search-icon" size={16} />
              <input
                type="text"
                className="ec-search-input"
                placeholder="Search candidates by name or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="ec-empty">
                <Users size={48} style={{ margin: '0 auto 1rem', color: '#d9dee3' }} />
                <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No candidates found</p>
                <p style={{ fontSize: '0.875rem' }}>Try adjusting your search</p>
              </div>
            ) : (
              <div className="ec-candidates-grid">
                {filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className="ec-candidate-card">
                    <div className="ec-candidate-header">
                      <h3 className="ec-candidate-name">{candidate.name}</h3>
                      <div className="ec-match-badge">
                        <Star size={12} />
                        {candidate.matchScore}%
                      </div>
                    </div>
                    <div className="ec-candidate-contact">
                      <div className="ec-contact-item">
                        <Mail size={14} />
                        {candidate.email}
                      </div>
                      <div className="ec-contact-item">
                        <Phone size={14} />
                        {candidate.phone}
                      </div>
                      <div className="ec-contact-item">
                        <MapPin size={14} />
                        {candidate.location}
                      </div>
                      <div className="ec-contact-item">
                        <Briefcase size={14} />
                        {candidate.experience} experience
                      </div>
                    </div>
                    <div className="ec-skills">
                      {candidate.skills.map((skill, idx) => (
                        <span key={idx} className="ec-skill-tag">{skill}</span>
                      ))}
                    </div>
                    <div className="ec-actions">
                      <button className="ec-action-btn-primary">
                        <MessageSquare size={14} />
                        Message
                      </button>
                      <button className="ec-action-btn">
                        <Download size={14} />
                        CV
                      </button>
                      <button className="ec-action-btn" style={{ color: '#ff3e1d', borderColor: '#ff3e1d' }}>
                        <X size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidatesShortlist;
