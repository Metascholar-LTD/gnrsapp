import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { BackgroundPaths } from '@/components/ui/background-paths';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const ListFacility: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Facility Details
  const [facilityName, setFacilityName] = useState('');
  const [about, setAbout] = useState('');
  const [facilityType, setFacilityType] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownership, setOwnership] = useState('');
  const [nhisAccredited, setNhisAccredited] = useState('');

  // Health Insurance
  const [healthInsurance, setHealthInsurance] = useState<string[]>([]);
  const [otherInsurance, setOtherInsurance] = useState('');

  // Services
  const [services, setServices] = useState<string[]>([]);
  const [otherServices, setOtherServices] = useState('');

  // Specialist Fields
  const [specialistFields, setSpecialistFields] = useState<string[]>([]);
  const [otherSpecialist, setOtherSpecialist] = useState('');

  // Additional
  const [website, setWebsite] = useState('');
  const [operationalHours, setOperationalHours] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const facilityTypes = [
    'Select',
    'Hospital',
    'Clinic',
    'Health Centre',
    'CHPS Compound',
    'Maternity Home',
    'Eye Clinic',
    'Dental Clinic',
    'Diagnostic Centre',
    'Pharmacy',
    'Scan Centre',
    'Laboratory',
    'Tertiary Hospital',
    'Secondary Hospital',
    'Primary Hospital'
  ];

  const regions = [
    'Select',
    'Greater Accra',
    'Ashanti',
    'Western',
    'Eastern',
    'Central',
    'Volta',
    'Northern',
    'Upper East',
    'Upper West',
    'Bono',
    'Ahafo',
    'Bono East',
    'Western North',
    'Oti',
    'Savannah',
    'North East'
  ];

  const ownershipTypes = ['Select', 'Private', 'Government', 'Mission (CHAG)'];
  const nhisOptions = ['Select', 'Yes', 'No'];

  const healthInsuranceOptions = [
    'Medex',
    'Momentum',
    'Glico Health Plan',
    'First Fidelity Health',
    'Premier Health Insurance',
    'Other'
  ];

  const serviceOptions = [
    'General services',
    'Scan',
    'ECG',
    'Antenatal',
    'Pharmacy',
    'Lab',
    'Pediatrics',
    'Surgery',
    'Dental',
    'Eye',
    'Skin',
    'ENT',
    'Other (list)'
  ];

  const specialistOptions = [
    'Gynecologist',
    'Dentist',
    'ENT',
    'Eye specialist',
    'Pediatrics',
    'Urologist',
    'Dermatologist',
    'Surgeon',
    'Physician specialist',
    'Other (list)'
  ];

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Insurance' },
    { number: 3, title: 'Services' },
    { number: 4, title: 'Specialists' },
    { number: 5, title: 'Additional' },
  ];

  const handleInsuranceChange = (insurance: string) => {
    if (insurance === 'Other') {
      if (healthInsurance.includes('Other')) {
        setHealthInsurance(healthInsurance.filter(i => i !== 'Other'));
        setOtherInsurance('');
      } else {
        setHealthInsurance([...healthInsurance, 'Other']);
      }
    } else {
      if (healthInsurance.includes(insurance)) {
        setHealthInsurance(healthInsurance.filter(i => i !== insurance));
      } else {
        setHealthInsurance([...healthInsurance, insurance]);
      }
    }
  };

  const handleServiceChange = (service: string) => {
    if (service === 'Other (list)') {
      if (services.includes('Other (list)')) {
        setServices(services.filter(s => s !== 'Other (list)'));
        setOtherServices('');
      } else {
        setServices([...services, 'Other (list)']);
      }
    } else {
      if (services.includes(service)) {
        setServices(services.filter(s => s !== service));
      } else {
        setServices([...services, service]);
      }
    }
  };

  const handleSpecialistChange = (specialist: string) => {
    if (specialist === 'Other (list)') {
      if (specialistFields.includes('Other (list)')) {
        setSpecialistFields(specialistFields.filter(s => s !== 'Other (list)'));
        setOtherSpecialist('');
      } else {
        setSpecialistFields([...specialistFields, 'Other (list)']);
      }
    } else {
      if (specialistFields.includes(specialist)) {
        setSpecialistFields(specialistFields.filter(s => s !== specialist));
      } else {
        setSpecialistFields([...specialistFields, specialist]);
      }
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(facilityName && about && facilityType && region && district && telephone && address && ownership && nhisAccredited);
      case 2:
        return true; // Insurance is optional
      case 3:
        return true; // Services are optional
      case 4:
        return true; // Specialists are optional
      case 5:
        return true; // Additional info is optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1)) {
      alert('Please fill in all required fields in Basic Info.');
      setCurrentStep(1);
      return;
    }

    console.log('Facility submitted', {
      facilityName,
      about,
      facilityType,
      region,
      district,
      telephone,
      email,
      address,
      ownership,
      nhisAccredited,
      healthInsurance,
      otherInsurance,
      services,
      otherServices,
      specialistFields,
      otherSpecialist,
      website,
      operationalHours,
      images,
      additionalInfo
    });

    alert('Form submitted successfully!');
  };

  const handleClear = () => {
    setFacilityName('');
    setAbout('');
    setFacilityType('');
    setRegion('');
    setDistrict('');
    setTelephone('');
    setEmail('');
    setAddress('');
    setOwnership('');
    setNhisAccredited('');
    setHealthInsurance([]);
    setOtherInsurance('');
    setServices([]);
    setOtherServices('');
    setSpecialistFields([]);
    setOtherSpecialist('');
    setWebsite('');
    setOperationalHours('');
    setImages([]);
    setImagePreviews([]);
    setAdditionalInfo('');
    setCurrentStep(1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages([...images, ...filesArray]);
      
      // Create previews
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews([...imagePreviews, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const isolatedStyles = `
    .list-facility-page {
      min-height: 100vh;
      background: hsl(40 33% 96%);
      position: relative;
    }

    .list-facility-background {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .list-facility-background svg {
      width: 100%;
      height: 100%;
      opacity: 0.5;
    }

    .list-facility-background path {
      stroke: #0891b2;
      stroke-opacity: 0.4;
    }

    .list-facility-content-wrapper {
      min-height: calc(100vh - 80px);
      padding-top: 60px;
      padding-bottom: 4rem;
      position: relative;
      z-index: 1;
    }

    @media (min-width: 768px) {
      .list-facility-content-wrapper {
        padding-top: 70px;
      }
    }

    @media (min-width: 1200px) {
      .list-facility-content-wrapper {
        padding-top: 120px;
      }
    }

    .list-facility-main-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .list-facility-form {
      background: white;
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      position: relative;
      z-index: 1;
    }

    .list-facility-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: hsl(220 30% 15%);
      margin: 0 0 2.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      text-align: center;
    }

    .list-facility-stepper-container {
      margin-bottom: 3rem;
      padding: 1rem 0;
    }

    .list-facility-stepper-item {
      flex: 1;
    }

    .list-facility-stepper-trigger {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .list-facility-stepper-trigger:hover {
      transform: scale(1.05);
    }

    .list-facility-stepper-title {
      font-size: 0.75rem;
      font-weight: 500;
      color: hsl(220 20% 40%);
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      text-align: center;
    }

    [data-state="active"] .list-facility-stepper-title {
      color: hsl(220 30% 15%);
      font-weight: 600;
    }

    [data-state="completed"] .list-facility-stepper-title {
      color: hsl(220 30% 15%);
    }

    .list-facility-step-content {
      min-height: 400px;
    }

    .list-facility-section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: hsl(220 30% 15%);
      margin: 0 0 1.5rem 0;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid hsl(40 20% 88%);
    }

    .list-facility-form-group {
      margin-bottom: 1.5rem;
    }

    .list-facility-form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .list-facility-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: hsl(220 30% 15%);
      margin-bottom: 0.5rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .list-facility-input,
    .list-facility-select,
    .list-facility-textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      transition: all 0.2s;
      background: white;
    }

    .list-facility-input:focus,
    .list-facility-select:focus,
    .list-facility-textarea:focus {
      outline: none;
      border-color: #0891b2;
      box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
    }

    .list-facility-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .list-facility-checkbox-group {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .list-facility-checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .list-facility-checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #0891b2;
      flex-shrink: 0;
    }

    .list-facility-checkbox-label {
      font-size: 0.875rem;
      color: hsl(220 30% 15%);
      cursor: pointer;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }

    .list-facility-other-input {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border: 1px solid hsl(40 20% 88%);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      width: 100%;
      max-width: 400px;
    }

    .list-facility-other-input:focus {
      outline: none;
      border-color: #0891b2;
      box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
    }

    .list-facility-navigation {
      display: flex;
      gap: 1rem;
      margin-top: 2.5rem;
      padding-top: 2rem;
      border-top: 1px solid hsl(40 20% 88%);
    }

    .list-facility-btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .list-facility-btn-previous {
      background: white;
      color: hsl(220 30% 15%);
      border: 1px solid hsl(40 20% 88%);
    }

    .list-facility-btn-previous:hover:not(:disabled) {
      background: hsl(40 20% 98%);
      border-color: #0891b2;
    }

    .list-facility-btn-previous:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .list-facility-btn-next,
    .list-facility-btn-submit {
      background: #0891b2;
      color: white;
      margin-left: auto;
    }

    .list-facility-btn-next:hover,
    .list-facility-btn-submit:hover {
      background: #0e7490;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(8, 145, 178, 0.2);
    }

    .list-facility-btn-clear {
      background: white;
      color: hsl(220 30% 15%);
      border: 1px solid hsl(40 20% 88%);
    }

    .list-facility-btn-clear:hover {
      background: hsl(40 20% 98%);
      border-color: #dc2626;
      color: #dc2626;
    }

    @media (max-width: 768px) {
      .list-facility-main-content {
        padding: 1rem;
      }

      .list-facility-form {
        padding: 1.5rem;
      }

      .list-facility-title {
        font-size: 1.5rem;
      }

      .list-facility-form-row {
        grid-template-columns: 1fr;
      }

      .list-facility-checkbox-group {
        grid-template-columns: 1fr;
      }

      .list-facility-stepper-title {
        font-size: 0.65rem;
      }

      .list-facility-navigation {
        flex-direction: column;
      }

      .list-facility-btn-next,
      .list-facility-btn-submit {
        margin-left: 0;
      }

      .list-facility-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="list-facility-step-content">
            <h2 className="list-facility-section-title">Basic Facility Information</h2>

            <div className="list-facility-form-group">
              <label className="list-facility-label">
                Facility Name<span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                className="list-facility-input"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                required
              />
            </div>

            <div className="list-facility-form-group">
              <label className="list-facility-label">
                About<span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                className="list-facility-textarea"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Provide a brief description of your facility, its mission, specialties, and what makes it unique..."
                required
                style={{ minHeight: '120px' }}
              />
            </div>

            <div className="list-facility-form-row">
              <div className="list-facility-form-group">
                <label className="list-facility-label">
                  Facility Type<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  className="list-facility-select"
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value)}
                  required
                >
                  {facilityTypes.map((type) => (
                    <option key={type} value={type === 'Select' ? '' : type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="list-facility-form-group">
                <label className="list-facility-label">
                  Telephone<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="tel"
                  className="list-facility-input"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="list-facility-form-row">
              <div className="list-facility-form-group">
                <label className="list-facility-label">Email (Optional)</label>
                <input
                  type="email"
                  className="list-facility-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="list-facility-form-row">
              <div className="list-facility-form-group">
                <label className="list-facility-label">
                  Region<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  className="list-facility-select"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                >
                  {regions.map((reg) => (
                    <option key={reg} value={reg === 'Select' ? '' : reg}>
                      {reg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="list-facility-form-group">
                <label className="list-facility-label">
                  District<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  className="list-facility-input"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="list-facility-form-group">
              <label className="list-facility-label">
                Address<span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                className="list-facility-textarea"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

             <div className="list-facility-form-row">
              <div className="list-facility-form-group">
                <label className="list-facility-label">
                  Ownership<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  className="list-facility-select"
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value)}
                  required
                >
                  {ownershipTypes.map((type) => (
                    <option key={type} value={type === 'Select' ? '' : type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="list-facility-form-group">
                <label className="list-facility-label">
                  NHIS Accredited?<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  className="list-facility-select"
                  value={nhisAccredited}
                  onChange={(e) => setNhisAccredited(e.target.value)}
                  required
                >
                  {nhisOptions.map((option) => (
                    <option key={option} value={option === 'Select' ? '' : option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="list-facility-step-content">
            <h2 className="list-facility-section-title">Health Insurance Options</h2>
            <p style={{ fontSize: '0.875rem', color: 'hsl(220 20% 40%)', marginBottom: '1.5rem', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
              Select all health insurance providers accepted at your facility
            </p>
            <div className="list-facility-checkbox-group">
              {healthInsuranceOptions.map((insurance) => (
                <div key={insurance} className="list-facility-checkbox-item">
                  <input
                    type="checkbox"
                    className="list-facility-checkbox"
                    id={`insurance-${insurance}`}
                    checked={healthInsurance.includes(insurance)}
                    onChange={() => handleInsuranceChange(insurance)}
                  />
                  <label
                    htmlFor={`insurance-${insurance}`}
                    className="list-facility-checkbox-label"
                  >
                    {insurance}
                  </label>
                </div>
              ))}
            </div>
            {healthInsurance.includes('Other') && (
              <input
                type="text"
                className="list-facility-other-input"
                placeholder="Please specify other insurance providers..."
                value={otherInsurance}
                onChange={(e) => setOtherInsurance(e.target.value)}
              />
            )}
          </div>
        );

      case 3:
        return (
          <div className="list-facility-step-content">
            <h2 className="list-facility-section-title">Services Offered</h2>
            <p style={{ fontSize: '0.875rem', color: 'hsl(220 20% 40%)', marginBottom: '1.5rem', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
              Select all services available at your facility
            </p>
            <div className="list-facility-checkbox-group">
              {serviceOptions.map((service) => (
                <div key={service} className="list-facility-checkbox-item">
                  <input
                    type="checkbox"
                    className="list-facility-checkbox"
                    id={`service-${service}`}
                    checked={services.includes(service)}
                    onChange={() => handleServiceChange(service)}
                  />
                  <label
                    htmlFor={`service-${service}`}
                    className="list-facility-checkbox-label"
                  >
                    {service}
                  </label>
                </div>
              ))}
            </div>
            {services.includes('Other (list)') && (
              <input
                type="text"
                className="list-facility-other-input"
                placeholder="List other services..."
                value={otherServices}
                onChange={(e) => setOtherServices(e.target.value)}
              />
            )}
          </div>
        );

      case 4:
        return (
          <div className="list-facility-step-content">
            <h2 className="list-facility-section-title">Specialist Fields</h2>
            <p style={{ fontSize: '0.875rem', color: 'hsl(220 20% 40%)', marginBottom: '1.5rem', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
              Select all specialist fields available at your facility
            </p>
            <div className="list-facility-checkbox-group">
              {specialistOptions.map((specialist) => (
                <div key={specialist} className="list-facility-checkbox-item">
                  <input
                    type="checkbox"
                    className="list-facility-checkbox"
                    id={`specialist-${specialist}`}
                    checked={specialistFields.includes(specialist)}
                    onChange={() => handleSpecialistChange(specialist)}
                  />
                  <label
                    htmlFor={`specialist-${specialist}`}
                    className="list-facility-checkbox-label"
                  >
                    {specialist}
                  </label>
                </div>
              ))}
            </div>
            {specialistFields.includes('Other (list)') && (
              <input
                type="text"
                className="list-facility-other-input"
                placeholder="List other specialist fields..."
                value={otherSpecialist}
                onChange={(e) => setOtherSpecialist(e.target.value)}
              />
            )}
          </div>
        );

      case 5:
        return (
          <div className="list-facility-step-content">
            <h2 className="list-facility-section-title">Additional Information</h2>

            <div className="list-facility-form-group">
              <label className="list-facility-label">Website (Optional)</label>
              <input
                type="url"
                className="list-facility-input"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="list-facility-form-group">
              <label className="list-facility-label">Operational Hours (Optional)</label>
              <input
                type="text"
                className="list-facility-input"
                value={operationalHours}
                onChange={(e) => setOperationalHours(e.target.value)}
                placeholder="e.g., Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 2:00 PM, Sun: Closed"
              />
            </div>

            <div className="list-facility-form-group">
              <label className="list-facility-label">Facility Images (Optional)</label>
              <p style={{ fontSize: '0.875rem', color: 'hsl(220 20% 40%)', marginBottom: '0.75rem', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
                You can upload multiple images of your facility. Maximum 10 images.
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="list-facility-input"
                style={{ padding: '0.5rem' }}
                disabled={images.length >= 10}
              />
              {images.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          border: '1px solid hsl(40 20% 88%)'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 'bold'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length >= 10 && (
                <p style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.5rem' }}>
                  Maximum 10 images reached. Remove some images to add more.
                </p>
              )}
            </div>

            <div className="list-facility-form-group">
              <label className="list-facility-label">Additional Information (Optional)</label>
              <textarea
                className="list-facility-textarea"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Any additional details about your facility, special services, etc..."
                style={{ minHeight: '150px' }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="list-facility-page">
      <style>{isolatedStyles}</style>
      <Navigation />

      <div className="list-facility-background">
        <BackgroundPaths title="" />
      </div>

      <div className="list-facility-content-wrapper">
        <div className="list-facility-main-content">
          <div className="list-facility-form">
            <h1 className="list-facility-title">Add Details of Your Facility</h1>

            <div className="list-facility-stepper-container">
              <Stepper value={currentStep} onValueChange={setCurrentStep} orientation="horizontal">
                {steps.map((step, index) => (
                  <StepperItem
                    key={step.number}
                    step={step.number}
                    completed={currentStep > step.number}
                    className="list-facility-stepper-item"
                  >
                    <StepperTrigger className="list-facility-stepper-trigger">
                      <StepperIndicator />
                      <StepperTitle className="list-facility-stepper-title">
                        {step.title}
                      </StepperTitle>
                    </StepperTrigger>
                    {index < steps.length - 1 && <StepperSeparator />}
                  </StepperItem>
                ))}
              </Stepper>
            </div>

            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              <div className="list-facility-navigation">
                <button
                  type="button"
                  className="list-facility-btn list-facility-btn-previous"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                {currentStep === 1 && (
                  <button
                    type="button"
                    className="list-facility-btn list-facility-btn-clear"
                    onClick={handleClear}
                  >
                    Clear All
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    className="list-facility-btn list-facility-btn-next"
                    onClick={handleNext}
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="list-facility-btn list-facility-btn-submit"
                  >
                    Submit
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListFacility;
