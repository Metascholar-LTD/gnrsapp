import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle2, Building2, Stethoscope, Globe } from 'lucide-react';
import ImageGallery from '@/components/ui/image-gallery';

const HospitalView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock hospital data - replace with actual API call
  // Data structure matches ListFacility form fields
  const hospitals: Record<string, any> = {
    '1': {
      id: '1',
      facilityName: 'Korle Bu Teaching Hospital',
      about: 'Korle Bu Teaching Hospital is Ghana\'s premier tertiary healthcare facility and the largest teaching hospital in the country. Established in 1923, it serves as a referral center for complex medical cases from across Ghana and neighboring countries. The hospital offers a wide range of specialized medical services including surgery, emergency care, pediatrics, maternity services, and various diagnostic and treatment facilities.',
      facilityType: 'Tertiary Hospital',
      region: 'Greater Accra',
      district: 'Korle Klottey',
      telephone: '+233 302 665 401',
      email: 'info@kbth.gov.gh',
      address: 'Korle Bu, Accra, Ghana',
      ownership: 'Government',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS', 'Medex', 'Momentum'],
      otherInsurance: '',
      services: ['General services', 'Surgery', 'Pediatrics', 'Maternity', 'Lab'],
      otherServices: '',
      specialistFields: ['Surgeon', 'Physician specialist', 'Gynecologist', 'Pediatrics'],
      otherSpecialist: '',
      website: 'https://www.kbth.gov.gh',
      operationalHours: '24/7',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: 'The hospital operates 24/7 and provides comprehensive emergency services.'
    },
    '2': {
      id: '2',
      facilityName: 'Komfo Anokye Teaching Hospital',
      about: 'Komfo Anokye Teaching Hospital is a major teaching hospital located in Kumasi, serving the Ashanti Region and beyond. The hospital provides comprehensive healthcare services including specialized medical care, surgical procedures, emergency services, and various diagnostic facilities.',
      facilityType: 'Tertiary Hospital',
      region: 'Ashanti',
      district: 'Kumasi Metropolitan',
      telephone: '+233 322 020 225',
      email: 'info@kath.gov.gh',
      address: 'Kumasi, Ashanti Region, Ghana',
      ownership: 'Government',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS', 'Medex', 'Glico Health Plan'],
      otherInsurance: '',
      services: ['General services', 'Surgery', 'Pediatrics', 'Maternity', 'Lab'],
      otherServices: '',
      specialistFields: ['Surgeon', 'Physician specialist'],
      otherSpecialist: '',
      website: '',
      operationalHours: '24/7',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: ''
    },
    '3': {
      id: '3',
      facilityName: '37 Military Hospital',
      about: '37 Military Hospital is a government-owned military hospital that provides healthcare services to military personnel, their families, and civilians. The hospital offers comprehensive medical services including emergency care, surgery, pediatrics, and maternity services.',
      facilityType: 'Tertiary Hospital',
      region: 'Greater Accra',
      district: 'Korle Klottey',
      telephone: '+233 302 775 441',
      address: '37 Military Hospital, Accra, Ghana',
      ownership: 'Government',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS', 'Medex'],
      otherInsurance: '',
      services: ['General services', 'Surgery', 'Pediatrics', 'Maternity', 'Lab'],
      otherServices: '',
      specialistFields: ['Surgeon', 'Physician specialist'],
      otherSpecialist: '',
      website: '',
      operationalHours: '24/7',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: ''
    },
    '4': {
      id: '4',
      facilityName: 'Nyaho Medical Centre',
      about: 'Nyaho Medical Centre is a private medical facility located in East Legon, Accra. The hospital is known for its modern facilities and comprehensive healthcare services. It offers a wide range of medical services including emergency care, pediatrics, maternity services, laboratory services, radiology, and various diagnostic procedures.',
      facilityType: 'Secondary Hospital',
      region: 'Greater Accra',
      district: 'La Nkwantanang Madina',
      telephone: '+233 302 544 000',
      email: 'info@nyahomedical.com',
      address: 'East Legon, Accra, Ghana',
      ownership: 'Private',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS', 'Medex', 'Momentum', 'Glico Health Plan', 'Nationwide'],
      otherInsurance: '',
      services: ['General services', 'Pediatrics', 'Maternity', 'Lab', 'Scan', 'ECG'],
      otherServices: '',
      specialistFields: ['Dentist', 'Eye specialist', 'Pediatrics'],
      otherSpecialist: '',
      website: 'https://www.nyahomedical.com',
      operationalHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 2:00 PM',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: 'Modern facilities with state-of-the-art equipment.'
    },
    '5': {
      id: '5',
      facilityName: 'Lister Hospital',
      about: 'Lister Hospital is a well-established private hospital in Accra providing quality healthcare services. The hospital offers general medical services, surgery, emergency care, maternity services, and laboratory facilities.',
      facilityType: 'Secondary Hospital',
      region: 'Greater Accra',
      district: 'Korle Klottey',
      telephone: '+233 302 780 000',
      address: 'Accra, Ghana',
      ownership: 'Private',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS', 'Medex', 'Momentum'],
      otherInsurance: '',
      services: ['General services', 'Surgery', 'Maternity', 'Lab'],
      otherServices: '',
      specialistFields: ['Surgeon'],
      otherSpecialist: '',
      website: '',
      operationalHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: ''
    },
    '6': {
      id: '6',
      facilityName: 'Tamale Teaching Hospital',
      about: 'Tamale Teaching Hospital is a major healthcare facility serving the Northern Region and surrounding areas. The hospital provides comprehensive medical services including surgery, emergency care, pediatrics, maternity services, and laboratory facilities.',
      facilityType: 'Tertiary Hospital',
      region: 'Northern',
      district: 'Tamale Metropolitan',
      telephone: '+233 372 022 200',
      address: 'Tamale, Northern Region, Ghana',
      ownership: 'Government',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS', 'Medex'],
      otherInsurance: '',
      services: ['General services', 'Surgery', 'Pediatrics', 'Maternity', 'Lab'],
      otherServices: '',
      specialistFields: ['Surgeon', 'Physician specialist'],
      otherSpecialist: '',
      website: '',
      operationalHours: '24/7',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: ''
    },
    '7': {
      id: '7',
      facilityName: 'Cape Coast Teaching Hospital',
      about: 'Cape Coast Teaching Hospital is a teaching hospital providing healthcare services to the Central Region. The hospital offers general medical services, surgery, emergency care, pediatrics, and maternity services.',
      facilityType: 'Tertiary Hospital',
      region: 'Central',
      district: 'Cape Coast Metropolitan',
      telephone: '+233 332 132 000',
      address: 'Cape Coast, Central Region, Ghana',
      ownership: 'Government',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS'],
      otherInsurance: '',
      services: ['General services', 'Surgery', 'Pediatrics', 'Maternity'],
      otherServices: '',
      specialistFields: ['Surgeon'],
      otherSpecialist: '',
      website: '',
      operationalHours: '24/7',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: ''
    },
    '8': {
      id: '8',
      facilityName: 'Ridge Hospital',
      about: 'Ridge Hospital is a government hospital providing essential healthcare services to the Accra community. The hospital offers general medical services, emergency care, maternity services, pediatrics, and laboratory facilities.',
      facilityType: 'Secondary Hospital',
      region: 'Greater Accra',
      district: 'Korle Klottey',
      telephone: '+233 302 664 698',
      address: 'Ridge, Accra, Ghana',
      ownership: 'Government',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS', 'Medex'],
      otherInsurance: '',
      services: ['General services', 'Maternity', 'Pediatrics', 'Lab'],
      otherServices: '',
      specialistFields: ['Pediatrics'],
      otherSpecialist: '',
      website: '',
      operationalHours: '24/7',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: ''
    },
    '9': {
      id: '9',
      facilityName: 'Trust Hospital',
      about: 'Trust Hospital is a private hospital located in Osu, Accra, known for quality healthcare and modern facilities. The hospital offers general medical services, emergency care, maternity services, laboratory services, and various diagnostic procedures including scans and ECG.',
      facilityType: 'Secondary Hospital',
      region: 'Greater Accra',
      district: 'Korle Klottey',
      telephone: '+233 302 776 000',
      address: 'Osu, Accra, Ghana',
      ownership: 'Private',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS', 'Medex', 'Momentum', 'Glico Health Plan'],
      otherInsurance: '',
      services: ['General services', 'Maternity', 'Lab', 'Scan', 'ECG'],
      otherServices: '',
      specialistFields: ['Eye specialist', 'Dentist'],
      otherSpecialist: '',
      website: '',
      operationalHours: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: ''
    },
    '10': {
      id: '10',
      facilityName: 'Ho Teaching Hospital',
      about: 'Ho Teaching Hospital is a teaching hospital serving the Volta Region. The hospital provides comprehensive medical services including surgery, emergency care, pediatrics, and maternity services.',
      facilityType: 'Tertiary Hospital',
      region: 'Volta',
      district: 'Ho Municipal',
      telephone: '+233 362 026 000',
      address: 'Ho, Volta Region, Ghana',
      ownership: 'Government',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS'],
      otherInsurance: '',
      services: ['General services', 'Surgery', 'Pediatrics', 'Maternity'],
      otherServices: '',
      specialistFields: ['Surgeon', 'Physician specialist'],
      otherSpecialist: '',
      website: '',
      operationalHours: '24/7',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: ''
    },
    '11': {
      id: '11',
      facilityName: 'Sunyani Regional Hospital',
      about: 'Sunyani Regional Hospital is a regional hospital providing healthcare services to the Bono Region. The hospital offers general medical services, emergency care, maternity services, pediatrics, and laboratory facilities.',
      facilityType: 'Secondary Hospital',
      region: 'Bono',
      district: 'Sunyani Municipal',
      telephone: '+233 352 027 000',
      address: 'Sunyani, Bono Region, Ghana',
      ownership: 'Government',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS', 'Medex'],
      otherInsurance: '',
      services: ['General services', 'Maternity', 'Pediatrics', 'Lab'],
      otherServices: '',
      specialistFields: ['Pediatrics'],
      otherSpecialist: '',
      website: '',
      operationalHours: '24/7',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: ''
    },
    '12': {
      id: '12',
      facilityName: 'FOCOS Orthopedic Hospital',
      about: 'FOCOS Orthopedic Hospital is a specialized orthopedic hospital providing advanced bone and joint care. The hospital focuses on orthopedic surgery and related medical services, offering specialized care for bone and joint conditions.',
      facilityType: 'Hospital',
      region: 'Greater Accra',
      district: 'Ga East',
      telephone: '+233 302 501 000',
      address: 'Pantang, Accra, Ghana',
      ownership: 'Private',
      nhisAccredited: 'Yes',
      healthInsurance: ['NHIS', 'Medex', 'Momentum'],
      otherInsurance: '',
      services: ['Surgery', 'General services', 'Lab'],
      otherServices: '',
      specialistFields: ['Surgeon'],
      otherSpecialist: '',
      website: 'https://www.focoshospital.org',
      operationalHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
      images: [
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545946/african-american-therapist-doctor-listening-patient-lungs-using-stethoscope-discussing-medical-expertise-with-therapist-sick-young-woman-resting-bed-recovering-after-surgery-hospital-ward_qutl9o.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765545939/person-with-chronic-disability-waiting-room-health-center-facility-wheelchair-user-waiting-attend-checkup-appointment-man-with-physcal-impairment-doing-consultation-medical-clinic_dghczc.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546351/portrait-happy-african-american-woman-surgeon-standing-operating-room-ready-work-patient-female-medical-worker-surgical-uniform-operation-theater_50_ptzzde.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546154/nurse-measuring-patient-blood-pressure_50_lfzvtp.jpg',
        'https://res.cloudinary.com/dsypclqxk/image/upload/v1765546620/interior-view-operating-room_50_vv6we3.jpg'
      ],
      additionalInfo: 'Specialized in orthopedic surgery and bone care.'
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
            <h1 className="hospital-view-title">{hospital.facilityName}</h1>
            <div className="hospital-view-location">
              <MapPin size={18} />
              <span>{hospital.district}, {hospital.region}</span>
            </div>
            <div className="hospital-view-badges">
              <div className="hospital-view-badge">
                <Building2 size={16} />
                {hospital.facilityType}
              </div>
              <div className="hospital-view-badge">
                {hospital.ownership}
              </div>
              {hospital.nhisAccredited === 'Yes' && (
                <div className="hospital-view-badge nhis">
                  <CheckCircle2 size={16} />
                  NHIS Accredited
                </div>
              )}
            </div>
          </div>

          {hospital.images && hospital.images.length > 0 && (
            <ImageGallery
              images={hospital.images}
            />
          )}

          <div className="hospital-view-grid">
            <div>
              <div className="hospital-view-section">
                <h2 className="hospital-view-section-title">
                  <Stethoscope size={20} />
                  About
                </h2>
                <p className="hospital-view-description">
                  {hospital.about}
                </p>
              </div>

              <div className="hospital-view-section" style={{ marginTop: '2rem' }}>
                <h2 className="hospital-view-section-title">
                  <Stethoscope size={20} />
                  Services Offered
                </h2>
                <div className="hospital-view-services-grid">
                  {hospital.services && hospital.services.map((service: string, index: number) => (
                    <div key={index} className="hospital-view-service">
                      <CheckCircle2 size={16} className="text-[#0891b2]" />
                      {service}
                    </div>
                  ))}
                  {hospital.otherServices && (
                    <div className="hospital-view-service">
                      <CheckCircle2 size={16} className="text-[#0891b2]" />
                      {hospital.otherServices}
                    </div>
                  )}
                </div>
              </div>

              {hospital.specialistFields && hospital.specialistFields.length > 0 && (
                <div className="hospital-view-section" style={{ marginTop: '2rem' }}>
                  <h2 className="hospital-view-section-title">
                    <Stethoscope size={20} />
                    Specialist Fields
                  </h2>
                  <div className="hospital-view-services-grid">
                    {hospital.specialistFields.map((specialist: string, index: number) => (
                      <div key={index} className="hospital-view-service">
                        <CheckCircle2 size={16} className="text-[#0891b2]" />
                        {specialist}
                      </div>
                    ))}
                    {hospital.otherSpecialist && (
                      <div className="hospital-view-service">
                        <CheckCircle2 size={16} className="text-[#0891b2]" />
                        {hospital.otherSpecialist}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="hospital-view-section">
                <h2 className="hospital-view-section-title">Contact Information</h2>
                {hospital.telephone && (
                  <div className="hospital-view-contact-item">
                    <Phone size={18} />
                    <a href={`tel:${hospital.telephone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {hospital.telephone}
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
                {hospital.website && (
                  <div className="hospital-view-contact-item">
                    <Globe size={18} />
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      {hospital.website}
                    </a>
                  </div>
                )}
                <div className="hospital-view-contact-item">
                  <MapPin size={18} />
                  <span>{hospital.address}</span>
                </div>
              </div>

              <div className="hospital-view-section" style={{ marginTop: '2rem' }}>
                <h2 className="hospital-view-section-title">Facility Information</h2>
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
                    <span className="hospital-view-info-label">Region</span>
                    <span>{hospital.region}</span>
                  </div>
                  <div className="hospital-view-info-item">
                    <span className="hospital-view-info-label">District</span>
                    <span>{hospital.district}</span>
                  </div>
                  <div className="hospital-view-info-item">
                    <span className="hospital-view-info-label">NHIS Accredited</span>
                    <span>{hospital.nhisAccredited}</span>
                  </div>
                  {hospital.operationalHours && (
                    <div className="hospital-view-info-item">
                      <span className="hospital-view-info-label">Operational Hours</span>
                      <span>{hospital.operationalHours}</span>
                    </div>
                  )}
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
                    {hospital.otherInsurance && (
                      <span className="hospital-view-insurance-badge">
                        {hospital.otherInsurance}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {hospital.additionalInfo && (
                <div className="hospital-view-section" style={{ marginTop: '2rem' }}>
                  <h2 className="hospital-view-section-title">Additional Information</h2>
                  <p className="hospital-view-description">
                    {hospital.additionalInfo}
                  </p>
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


