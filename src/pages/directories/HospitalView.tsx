import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle2, Building2, Stethoscope, Clock } from 'lucide-react';

const HospitalView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock hospital data - replace with actual API call
  const hospitals: Record<string, any> = {
    '1': {
      id: '1',
      name: 'Korle Bu Teaching Hospital',
      location: 'Korle Bu, Accra',
      region: 'Greater Accra',
      address: 'Korle Bu, Accra, Ghana',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity', 'Laboratory', 'Radiology', 'Cardiology', 'Neurology', 'Oncology'],
      healthInsurance: ['NHIS', 'Medex', 'Momentum'],
      nhisAccredited: true,
      phone: '+233 302 665 401',
      email: 'info@kbth.gov.gh',
      description: 'Ghana\'s premier tertiary healthcare facility providing comprehensive medical services.',
      fullDescription: 'Korle Bu Teaching Hospital is Ghana\'s premier tertiary healthcare facility and the largest teaching hospital in the country. Established in 1923, it serves as a referral center for complex medical cases from across Ghana and neighboring countries. The hospital offers a wide range of specialized medical services including surgery, emergency care, pediatrics, maternity services, and various diagnostic and treatment facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: '24/7',
      emergencyServices: true
    },
    '2': {
      id: '2',
      name: 'Komfo Anokye Teaching Hospital',
      location: 'Kumasi',
      region: 'Ashanti',
      address: 'Kumasi, Ashanti Region, Ghana',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity', 'Laboratory', 'Cardiology'],
      healthInsurance: ['NHIS', 'Medex', 'Glico Health Plan'],
      nhisAccredited: true,
      phone: '+233 322 020 225',
      description: 'Major teaching hospital in the Ashanti Region providing advanced medical care.',
      fullDescription: 'Komfo Anokye Teaching Hospital is a major teaching hospital located in Kumasi, serving the Ashanti Region and beyond. The hospital provides comprehensive healthcare services including specialized medical care, surgical procedures, emergency services, and various diagnostic facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: '24/7',
      emergencyServices: true
    },
    '3': {
      id: '3',
      name: '37 Military Hospital',
      location: '37, Accra',
      region: 'Greater Accra',
      address: '37 Military Hospital, Accra, Ghana',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity', 'Laboratory'],
      healthInsurance: ['NHIS', 'Medex'],
      nhisAccredited: true,
      phone: '+233 302 775 441',
      description: 'Military hospital providing quality healthcare services to military personnel and civilians.',
      fullDescription: '37 Military Hospital is a government-owned military hospital that provides healthcare services to military personnel, their families, and civilians. The hospital offers comprehensive medical services including emergency care, surgery, pediatrics, and maternity services.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: '24/7',
      emergencyServices: true
    },
    '4': {
      id: '4',
      name: 'Nyaho Medical Centre',
      location: 'East Legon, Accra',
      region: 'Greater Accra',
      address: 'East Legon, Accra, Ghana',
      facilityType: 'Secondary Hospital',
      ownership: 'Private',
      services: ['General Services', 'Emergency', 'Pediatrics', 'Maternity', 'Laboratory', 'Radiology', 'Scan', 'ECG'],
      healthInsurance: ['NHIS', 'Medex', 'Momentum', 'Glico Health Plan', 'Nationwide'],
      nhisAccredited: true,
      phone: '+233 302 544 000',
      email: 'info@nyahomedical.com',
      description: 'Private medical facility offering comprehensive healthcare services with modern equipment.',
      fullDescription: 'Nyaho Medical Centre is a private medical facility located in East Legon, Accra. The hospital is known for its modern facilities and comprehensive healthcare services. It offers a wide range of medical services including emergency care, pediatrics, maternity services, laboratory services, radiology, and various diagnostic procedures.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: '24/7',
      emergencyServices: true
    },
    '5': {
      id: '5',
      name: 'Lister Hospital',
      location: 'Accra',
      region: 'Greater Accra',
      address: 'Accra, Ghana',
      facilityType: 'Secondary Hospital',
      ownership: 'Private',
      services: ['General Services', 'Surgery', 'Emergency', 'Maternity', 'Laboratory'],
      healthInsurance: ['NHIS', 'Medex', 'Momentum'],
      nhisAccredited: true,
      phone: '+233 302 780 000',
      description: 'Well-established private hospital providing quality healthcare services.',
      fullDescription: 'Lister Hospital is a well-established private hospital in Accra providing quality healthcare services. The hospital offers general medical services, surgery, emergency care, maternity services, and laboratory facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: '24/7',
      emergencyServices: true
    },
    '6': {
      id: '6',
      name: 'Tamale Teaching Hospital',
      location: 'Tamale',
      region: 'Northern',
      address: 'Tamale, Northern Region, Ghana',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity', 'Laboratory'],
      healthInsurance: ['NHIS', 'Medex'],
      nhisAccredited: true,
      phone: '+233 372 022 200',
      description: 'Major healthcare facility serving the Northern Region and beyond.',
      fullDescription: 'Tamale Teaching Hospital is a major healthcare facility serving the Northern Region and surrounding areas. The hospital provides comprehensive medical services including surgery, emergency care, pediatrics, maternity services, and laboratory facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: '24/7',
      emergencyServices: true
    },
    '7': {
      id: '7',
      name: 'Cape Coast Teaching Hospital',
      location: 'Cape Coast',
      region: 'Central',
      address: 'Cape Coast, Central Region, Ghana',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      phone: '+233 332 132 000',
      description: 'Teaching hospital providing healthcare services to the Central Region.',
      fullDescription: 'Cape Coast Teaching Hospital is a teaching hospital providing healthcare services to the Central Region. The hospital offers general medical services, surgery, emergency care, pediatrics, and maternity services.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: '24/7',
      emergencyServices: true
    },
    '8': {
      id: '8',
      name: 'Ridge Hospital',
      location: 'Ridge, Accra',
      region: 'Greater Accra',
      address: 'Ridge, Accra, Ghana',
      facilityType: 'Secondary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Emergency', 'Maternity', 'Pediatrics', 'Laboratory'],
      healthInsurance: ['NHIS', 'Medex'],
      nhisAccredited: true,
      phone: '+233 302 664 698',
      description: 'Government hospital providing essential healthcare services.',
      fullDescription: 'Ridge Hospital is a government hospital providing essential healthcare services to the Accra community. The hospital offers general medical services, emergency care, maternity services, pediatrics, and laboratory facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: '24/7',
      emergencyServices: true
    },
    '9': {
      id: '9',
      name: 'Trust Hospital',
      location: 'Osu, Accra',
      region: 'Greater Accra',
      address: 'Osu, Accra, Ghana',
      facilityType: 'Secondary Hospital',
      ownership: 'Private',
      services: ['General Services', 'Emergency', 'Maternity', 'Laboratory', 'Scan', 'ECG'],
      healthInsurance: ['NHIS', 'Medex', 'Momentum', 'Glico Health Plan'],
      nhisAccredited: true,
      phone: '+233 302 776 000',
      description: 'Private hospital known for quality healthcare and modern facilities.',
      fullDescription: 'Trust Hospital is a private hospital located in Osu, Accra, known for quality healthcare and modern facilities. The hospital offers general medical services, emergency care, maternity services, laboratory services, and various diagnostic procedures including scans and ECG.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: '24/7',
      emergencyServices: true
    },
    '10': {
      id: '10',
      name: 'Ho Teaching Hospital',
      location: 'Ho',
      region: 'Volta',
      address: 'Ho, Volta Region, Ghana',
      facilityType: 'Tertiary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Surgery', 'Emergency', 'Pediatrics', 'Maternity'],
      healthInsurance: ['NHIS'],
      nhisAccredited: true,
      phone: '+233 362 026 000',
      description: 'Teaching hospital serving the Volta Region.',
      fullDescription: 'Ho Teaching Hospital is a teaching hospital serving the Volta Region. The hospital provides comprehensive medical services including surgery, emergency care, pediatrics, and maternity services.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: '24/7',
      emergencyServices: true
    },
    '11': {
      id: '11',
      name: 'Sunyani Regional Hospital',
      location: 'Sunyani',
      region: 'Bono',
      address: 'Sunyani, Bono Region, Ghana',
      facilityType: 'Secondary Hospital',
      ownership: 'Government',
      services: ['General Services', 'Emergency', 'Maternity', 'Pediatrics', 'Laboratory'],
      healthInsurance: ['NHIS', 'Medex'],
      nhisAccredited: true,
      phone: '+233 352 027 000',
      description: 'Regional hospital providing healthcare services to the Bono Region.',
      fullDescription: 'Sunyani Regional Hospital is a regional hospital providing healthcare services to the Bono Region. The hospital offers general medical services, emergency care, maternity services, pediatrics, and laboratory facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: '24/7',
      emergencyServices: true
    },
    '12': {
      id: '12',
      name: 'FOCOS Orthopedic Hospital',
      location: 'Pantang, Accra',
      region: 'Greater Accra',
      address: 'Pantang, Accra, Ghana',
      facilityType: 'Specialist Hospital',
      ownership: 'Private',
      services: ['Surgery', 'General Services', 'Laboratory', 'Radiology'],
      healthInsurance: ['NHIS', 'Medex', 'Momentum'],
      nhisAccredited: true,
      phone: '+233 302 501 000',
      description: 'Specialized orthopedic hospital providing advanced bone and joint care.',
      fullDescription: 'FOCOS Orthopedic Hospital is a specialized orthopedic hospital providing advanced bone and joint care. The hospital focuses on orthopedic surgery and related medical services, offering specialized care for bone and joint conditions.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      operatingHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
      emergencyServices: false
    }
  };

  const hospital = hospitals[id || '1'];

  if (!hospital) {
    return (
      <div>
        <Navigation />
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Hospital not found</p>
          <Button onClick={() => navigate('/directories/hospitals')}>Back to Hospitals</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isolatedStyles = `
    .hospital-view-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
    }

    .hospital-view-content-wrapper {
      min-height: calc(100vh - 80px);
    }

    .hospital-view-main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hospital-view-back-button {
      margin-bottom: 2rem;
    }

    .hospital-view-header {
      margin-bottom: 2rem;
    }

    .hospital-view-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 0.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .hospital-view-location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: hsl(220 20% 40%);
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    .hospital-view-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .hospital-view-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: white;
      border: 1.5px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      color: hsl(220 30% 15%);
      font-weight: 500;
    }

    .hospital-view-badge.nhis {
      background: #0891b2;
      color: white;
      border-color: #0891b2;
    }

    .hospital-view-hero-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: 1rem;
      margin-bottom: 2rem;
    }

    .hospital-view-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .hospital-view-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid hsl(40 20% 88%);
    }

    .hospital-view-section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 1rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .hospital-view-description {
      color: hsl(220 20% 40%);
      line-height: 1.7;
      font-size: 1rem;
    }

    .hospital-view-services-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .hospital-view-service {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: hsl(40 33% 96%);
      border-radius: 0.5rem;
      color: hsl(220 30% 15%);
      font-size: 0.95rem;
    }

    .hospital-view-contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      color: hsl(220 20% 40%);
    }

    .hospital-view-info-box {
      background: hsl(40 20% 90%);
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .hospital-view-info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid hsl(40 20% 88%);
      color: hsl(220 20% 40%);
    }

    .hospital-view-info-item:last-child {
      border-bottom: none;
    }

    .hospital-view-info-label {
      font-weight: 500;
      color: hsl(220 30% 15%);
    }

    .hospital-view-insurance-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .hospital-view-insurance-badge {
      padding: 0.5rem 0.75rem;
      background: #0891b2;
      color: white;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Mobile: 0px - 767px */
    @media (max-width: 767px) {
      .hospital-view-content-wrapper {
        padding-top: 60px;
      }

      .hospital-view-main-content {
        padding: 1rem;
      }

      .hospital-view-grid {
        grid-template-columns: 1fr;
      }

      .hospital-view-title {
        font-size: 2rem;
      }

      .hospital-view-hero-image {
        height: 300px;
      }

      .hospital-view-services-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Tablet: 768px - 1199px */
    @media (min-width: 768px) and (max-width: 1199px) {
      .hospital-view-content-wrapper {
        padding-top: 70px;
      }

      .hospital-view-main-content {
        padding: 1.5rem;
      }

      .hospital-view-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Desktop: 1200px - 1599px */
    @media (min-width: 1200px) and (max-width: 1599px) {
      .hospital-view-content-wrapper {
        padding-top: 120px;
      }

      .hospital-view-main-content {
        padding: 2rem;
      }
    }

    /* Large Desktop: 1600px+ */
    @media (min-width: 1600px) {
      .hospital-view-content-wrapper {
        padding-top: 120px;
      }

      .hospital-view-main-content {
        padding: 2rem clamp(2rem, 5vw, 4rem);
      }
    }
  `;

  return (
    <div className="hospital-view-page">
      <style>{isolatedStyles}</style>
      <Navigation />
      
      <div className="hospital-view-content-wrapper">
        <div className="hospital-view-main-content">
          <div className="hospital-view-back-button">
            <Button
              variant="ghost"
              onClick={() => navigate('/directories/hospitals')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={18} />
              Back to Hospitals
            </Button>
          </div>

          <div className="hospital-view-header">
            <h1 className="hospital-view-title">{hospital.name}</h1>
            <div className="hospital-view-location">
              <MapPin size={18} />
              <span>{hospital.location}, {hospital.region}</span>
            </div>
            <div className="hospital-view-badges">
              <div className="hospital-view-badge">
                <Building2 size={16} />
                {hospital.facilityType}
              </div>
              <div className="hospital-view-badge">
                {hospital.ownership}
              </div>
              {hospital.nhisAccredited && (
                <div className="hospital-view-badge nhis">
                  <CheckCircle2 size={16} />
                  NHIS Accredited
                </div>
              )}
            </div>
          </div>

          <img
            src={hospital.imageUrl}
            alt={hospital.name}
            className="hospital-view-hero-image"
          />

          <div className="hospital-view-grid">
            <div>
              <div className="hospital-view-section">
                <h2 className="hospital-view-section-title">
                  <Stethoscope size={20} />
                  About
                </h2>
                <p className="hospital-view-description">
                  {hospital.fullDescription || hospital.description}
                </p>
              </div>

              <div className="hospital-view-section" style={{ marginTop: '2rem' }}>
                <h2 className="hospital-view-section-title">
                  <Stethoscope size={20} />
                  Services Offered
                </h2>
                <div className="hospital-view-services-grid">
                  {hospital.services.map((service: string, index: number) => (
                    <div key={index} className="hospital-view-service">
                      <CheckCircle2 size={16} className="text-[#0891b2]" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="hospital-view-section">
                <h2 className="hospital-view-section-title">Contact Information</h2>
                {hospital.phone && (
                  <div className="hospital-view-contact-item">
                    <Phone size={18} />
                    <a href={`tel:${hospital.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {hospital.phone}
                    </a>
                  </div>
                )}
                {hospital.email && (
                  <div className="hospital-view-contact-item">
                    <Mail size={18} />
                    <a href={`mailto:${hospital.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {hospital.email}
                    </a>
                  </div>
                )}
                <div className="hospital-view-contact-item">
                  <MapPin size={18} />
                  <span>{hospital.address}</span>
                </div>
              </div>

              <div className="hospital-view-section" style={{ marginTop: '2rem' }}>
                <h2 className="hospital-view-section-title">Hospital Information</h2>
                <div className="hospital-view-info-box">
                  <div className="hospital-view-info-item">
                    <span className="hospital-view-info-label">Facility Type</span>
                    <span>{hospital.facilityType}</span>
                  </div>
                  <div className="hospital-view-info-item">
                    <span className="hospital-view-info-label">Ownership</span>
                    <span>{hospital.ownership}</span>
                  </div>
                  <div className="hospital-view-info-item">
                    <span className="hospital-view-info-label">Operating Hours</span>
                    <span>{hospital.operatingHours}</span>
                  </div>
                  <div className="hospital-view-info-item">
                    <span className="hospital-view-info-label">Emergency Services</span>
                    <span>{hospital.emergencyServices ? 'Available' : 'Not Available'}</span>
                  </div>
                </div>
              </div>

              {hospital.healthInsurance && hospital.healthInsurance.length > 0 && (
                <div className="hospital-view-section" style={{ marginTop: '2rem' }}>
                  <h2 className="hospital-view-section-title">Health Insurance Accepted</h2>
                  <div className="hospital-view-insurance-badges">
                    {hospital.healthInsurance.map((insurance: string, index: number) => (
                      <span key={index} className="hospital-view-insurance-badge">
                        {insurance}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HospitalView;

