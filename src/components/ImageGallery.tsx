import React from 'react';
import SphereImageGrid, { ImageData } from '@/components/ui/img-sphere';
import { Sparkles, Users, BookOpen, Briefcase, Newspaper, Database } from 'lucide-react';

// Ghana-related images from Unsplash - diverse, high-quality images
const BASE_IMAGES: Omit<ImageData, 'id'>[] = [
  {
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Ghana Education",
    title: "Education Excellence",
    description: "Access world-class educational resources and opportunities across Ghana."
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Professional Development",
    title: "Career Growth",
    description: "Discover career opportunities and professional development programs."
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Ghana Culture",
    title: "Cultural Heritage",
    description: "Explore the rich cultural heritage and traditions of Ghana."
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Team Collaboration",
    title: "Community Building",
    description: "Join a community of learners, professionals, and innovators."
  },
  {
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Business Growth",
    title: "Economic Development",
    description: "Supporting business growth and economic development initiatives."
  },
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Modern Infrastructure",
    title: "Modern Infrastructure",
    description: "Accessing resources through modern digital infrastructure."
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Technology Innovation",
    title: "Tech Innovation",
    description: "Embracing technology and innovation for national progress."
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Networking",
    title: "Professional Network",
    description: "Connect with professionals and expand your network."
  },
  {
    src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Learning",
    title: "Continuous Learning",
    description: "Access educational resources for lifelong learning."
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Success",
    title: "Achievement",
    description: "Celebrating success stories and achievements across Ghana."
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Digital Resources",
    title: "Digital Access",
    description: "Digital resources accessible to all Ghanaians."
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=800",
    alt: "Empowerment",
    title: "Empowerment",
    description: "Empowering citizens through accessible resources."
  }
];

// Generate more images by repeating the base set for better sphere coverage
const IMAGES: ImageData[] = [];
for (let i = 0; i < 50; i++) {
  const baseIndex = i % BASE_IMAGES.length;
  const baseImage = BASE_IMAGES[baseIndex];
  IMAGES.push({
    id: `img-${i + 1}`,
    ...baseImage,
    alt: `${baseImage.alt} (${Math.floor(i / BASE_IMAGES.length) + 1})`
  });
}

export const ImageGallery = () => {
  return (
    <div 
      id="gallery" 
      className="container-fluid py-5 position-relative overflow-hidden"
      style={{ 
        backgroundColor: '#EEEEEE',
        position: 'relative'
      }}
    >
      {/* Animated background elements */}
      <div 
        className="position-absolute"
        style={{
          top: '-50%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(252, 209, 22, 0.08) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
          zIndex: 0
        }}
      />
      <div 
        className="position-absolute"
        style={{
          bottom: '-30%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.06) 0%, transparent 70%)',
          animation: 'float 25s ease-in-out infinite reverse',
          zIndex: 0
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="container position-relative" style={{ 
        maxWidth: '100%', 
        paddingLeft: 'clamp(15px, 5vw, 80px)', 
        paddingRight: 'clamp(15px, 5vw, 80px)',
        zIndex: 1
      }}>
        <div className="row g-5 align-items-center">
          {/* Left Side - Content */}
          <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.1s">
            <div className="mb-4">
              <span 
                className="d-inline-flex align-items-center fw-semi-bold"
                style={{
                  padding: '8px 20px',
                  backgroundColor: 'rgba(252, 209, 22, 0.08)',
                  border: '1px solid rgba(252, 209, 22, 0.2)',
                  borderRadius: '30px',
                  color: '#2C2C2C',
                  fontSize: '0.875rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                <Sparkles className="me-2" size={16} style={{ color: '#2C2C2C' }} />
                Interactive Gallery
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '1px', 
              backgroundColor: 'rgba(44, 44, 44, 0.1)', 
              marginBottom: '24px',
              maxWidth: '200px'
            }}></div>
            <h1 
              className="display-5 mb-4"
              style={{
                color: '#2C2C2C',
                fontWeight: 700,
                lineHeight: '1.2',
                letterSpacing: '-0.5px'
              }}
            >
              Explore Our Resources in 3D
            </h1>
            
            <p 
              className="mb-5"
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.8',
                color: 'rgba(44, 44, 44, 0.85)'
              }}
            >
              Discover the diverse range of resources, opportunities, and services available through the Ghana National Resource System. Drag to rotate and click any image to learn more.
            </p>

            {/* Feature Icons */}
            <div className="row g-4 mb-4">
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 107, 107, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255, 107, 107, 0.2)'
                    }}
                  >
                    <BookOpen className="text-danger" size={20} />
                  </div>
                  <div>
                    <h6 style={{ color: '#2C2C2C', marginBottom: '4px', fontSize: '0.9rem' }}>Education</h6>
                    <p style={{ color: 'rgba(44, 44, 44, 0.7)', fontSize: '0.8rem', margin: 0 }}>Learning Resources</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(78, 205, 196, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(78, 205, 196, 0.25)'
                    }}
                  >
                    <Briefcase className="text-info" size={20} />
                  </div>
                  <div>
                    <h6 style={{ color: '#2C2C2C', marginBottom: '4px', fontSize: '0.9rem' }}>Jobs</h6>
                    <p style={{ color: 'rgba(44, 44, 44, 0.7)', fontSize: '0.8rem', margin: 0 }}>Career Opportunities</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(252, 209, 22, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(252, 209, 22, 0.25)'
                    }}
                  >
                    <Newspaper className="text-warning" size={20} />
                  </div>
                  <div>
                    <h6 style={{ color: '#2C2C2C', marginBottom: '4px', fontSize: '0.9rem' }}>News</h6>
                    <p style={{ color: 'rgba(44, 44, 44, 0.7)', fontSize: '0.8rem', margin: 0 }}>Latest Updates</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-start">
                  <div 
                    className="flex-shrink-0 me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(139, 69, 19, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(139, 69, 19, 0.25)'
                    }}
                  >
                    <Database className="text-warning" size={20} style={{ color: '#8B4513' }} />
                  </div>
                  <div>
                    <h6 style={{ color: '#2C2C2C', marginBottom: '4px', fontSize: '0.9rem' }}>Resources</h6>
                    <p style={{ color: 'rgba(44, 44, 44, 0.7)', fontSize: '0.8rem', margin: 0 }}>National Data</p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="d-inline-flex align-items-center px-4 py-3 rounded"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Users className="me-2" size={20} style={{ color: '#FCD116' }} />
              <span style={{ color: '#2C2C2C', fontSize: '0.95rem' }}>
                <strong style={{ color: '#2C2C2C' }}>50+</strong> Resource Categories
              </span>
            </div>
          </div>

          {/* Right Side - 3D Sphere */}
          <div className="col-lg-7 wow fadeInUp" data-wow-delay="0.3s">
            <div className="d-flex justify-content-center align-items-center position-relative">
              {/* Decorative circles */}
              <div 
                className="position-absolute"
                style={{
                  width: '700px',
                  height: '700px',
                  borderRadius: '50%',
                  border: '2px solid rgba(252, 209, 22, 0.15)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0,
                  animation: 'pulse-glow 3s ease-in-out infinite'
                }}
              />
              <div 
                className="position-absolute"
                style={{
                  width: '650px',
                  height: '650px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 107, 107, 0.12)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0
                }}
              />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <SphereImageGrid
                  images={IMAGES}
                  containerSize={600}
                  sphereRadius={220}
                  dragSensitivity={0.8}
                  momentumDecay={0.96}
                  maxRotationSpeed={6}
                  baseImageScale={0.14}
                  hoverScale={1.3}
                  perspective={1200}
                  autoRotate={true}
                  autoRotateSpeed={0.2}
                  className="mx-auto"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center mt-4">
              <p 
                className="mb-0"
                style={{
                  color: 'rgba(44, 44, 44, 0.65)',
                  fontSize: '0.875rem',
                  fontStyle: 'italic'
                }}
              >
                💡 Drag to rotate • Click to view details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

