import { useEffect, useState } from "react";
import { HomepageButton } from "@/components/ui/HomepageButton";
import { supabase } from "@/integrations/supabase/client";

interface CarouselSlide {
  id: string;
  image_url: string;
  badge_text: string | null;
  title: string;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  layout_type: string | null;
}

interface CarouselSettings {
  display_type: 'carousel' | 'video';
  video_url: string | null;
}

export const Carousel = () => {
  const [settings, setSettings] = useState<CarouselSettings>({ display_type: 'carousel', video_url: null });
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarouselData();
  }, []);

  const fetchCarouselData = async () => {
    try {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('carousel_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (settingsData) {
        setSettings({
          display_type: settingsData.display_type as 'carousel' | 'video',
          video_url: settingsData.video_url
        });
      }

      // Fetch slides
      const { data: slidesData } = await supabase
        .from('carousel_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (slidesData) {
        setSlides(slidesData);
      }
    } catch (error) {
      console.error('Error fetching carousel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSlide = (slide: CarouselSlide, index: number) => {
    const isActive = index === 0;
    const badgeStyle = {
      color: '#2C2C2C',
      borderColor: 'rgba(252, 209, 22, 0.3)',
      backgroundColor: 'rgba(255, 250, 230, 0.95)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      letterSpacing: '0.5px',
      borderRadius: '12px'
    };

    if (slide.layout_type === 'split') {
      return (
        <div key={slide.id} className={`carousel-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
          <div className="row g-0 h-100">
            <div className="col-lg-6" style={{ position: 'relative', overflow: 'hidden' }}>
              <div className="carousel-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))' }}></div>
              <img src={slide.image_url} alt={slide.title} style={{ filter: 'blur(3px)', objectFit: 'cover', objectPosition: 'center', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }} />
            </div>
            <div className="col-lg-6" style={{ position: 'relative', background: '#F5F5F5' }}>
              <div className="carousel-caption" style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto', bottom: 'auto', display: 'flex', alignItems: 'center', height: '100%', padding: '3rem' }}>
                <div className="w-100">
                  {slide.badge_text && (
                    <p className="d-inline-block border fw-semi-bold py-2 px-4 animated slideInDown" style={badgeStyle}>
                      {slide.badge_text}
                    </p>
                  )}
                  <h1 className="display-1 mb-4 animated slideInDown" style={{ color: '#2C2C2C', fontWeight: '700', lineHeight: '1.2' }}>
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="lead mb-4 animated slideInDown carousel-subtitle" style={{ color: '#555555', fontWeight: '400' }}>
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.button_text && slide.button_link && (
                    <div className="animated slideInDown">
                      <HomepageButton href={slide.button_link}>{slide.button_text}</HomepageButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (slide.layout_type === 'center') {
      return (
        <div key={slide.id} className={`carousel-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
          <div className="carousel-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))' }}></div>
          <img className="w-100" src={slide.image_url} alt={slide.title} style={{ filter: 'blur(3px)', objectFit: 'cover', objectPosition: 'center', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }} />
          <div className="carousel-caption">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-9 text-center">
                  {slide.badge_text && (
                    <p className="d-inline-block border fw-semi-bold py-2 px-4 animated slideInDown" style={badgeStyle}>
                      {slide.badge_text}
                    </p>
                  )}
                  <h1 className="display-1 mb-4 animated slideInDown" style={{ color: '#FFFFFF', textShadow: '3px 3px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 0, 0, 0.6)', fontWeight: '700', lineHeight: '1.2' }}>
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="lead mb-4 animated slideInDown carousel-subtitle" style={{ color: '#FFFFFF', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)', fontWeight: '400' }}>
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.button_text && slide.button_link && (
                    <div className="animated slideInDown">
                      <HomepageButton href={slide.button_link}>{slide.button_text}</HomepageButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default left layout
    return (
      <div key={slide.id} className={`carousel-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
        <div className="carousel-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))' }}></div>
        <img className="w-100" src={slide.image_url} alt={slide.title} style={{ filter: index === 0 ? 'none' : 'blur(3px)', objectFit: 'cover', objectPosition: 'center', height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }} />
        <div className="carousel-caption">
          <div className="container">
            <div className="row justify-content-start">
              <div className="col-lg-8">
                {slide.badge_text && (
                  <p className="d-inline-block border fw-semi-bold py-2 px-4 animated slideInDown" style={badgeStyle}>
                    {slide.badge_text}
                  </p>
                )}
                <h1 className="display-1 mb-4 animated slideInDown" style={index === 0 ? {} : { color: '#FFFFFF', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)', fontWeight: '700' }}>
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="lead mb-4 animated slideInDown carousel-subtitle" style={{ color: '#FFFFFF', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)', fontWeight: '400' }}>
                    {slide.subtitle}
                  </p>
                )}
                {slide.button_text && slide.button_link && (
                  <div className="animated slideInDown">
                    <HomepageButton href={slide.button_link}>{slide.button_text}</HomepageButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid p-0 mb-5" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Video Mode
  if (settings.display_type === 'video' && settings.video_url) {
    return (
      <>
        <style>{`
          .video-hero-container {
            position: relative;
            width: 100%;
            min-height: 100vh;
            overflow: hidden;
          }
          .video-hero-container video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .video-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
            z-index: 1;
          }
          .video-content {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
          }
        `}</style>
        <div className="container-fluid p-0 mb-5 wow fadeIn video-hero-container" data-wow-delay="0.1s">
          <video autoPlay muted loop playsInline>
            <source src={settings.video_url} type="video/mp4" />
          </video>
          <div className="video-overlay"></div>
          <div className="video-content">
            <div className="container text-center">
              {slides.length > 0 && (
                <>
                  {slides[0].badge_text && (
                    <p className="d-inline-block border fw-semi-bold py-2 px-4 animated slideInDown mb-4" style={{
                      color: '#2C2C2C',
                      borderColor: 'rgba(252, 209, 22, 0.3)',
                      backgroundColor: 'rgba(255, 250, 230, 0.95)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      letterSpacing: '0.5px',
                      borderRadius: '12px'
                    }}>
                      {slides[0].badge_text}
                    </p>
                  )}
                  <h1 className="display-1 mb-4 animated slideInDown" style={{
                    color: '#FFFFFF',
                    textShadow: '3px 3px 10px rgba(0, 0, 0, 0.9)',
                    fontWeight: '700'
                  }}>
                    {slides[0].title}
                  </h1>
                  {slides[0].subtitle && (
                    <p className="lead mb-4 animated slideInDown" style={{
                      color: '#FFFFFF',
                      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
                      maxWidth: '800px',
                      margin: '0 auto'
                    }}>
                      {slides[0].subtitle}
                    </p>
                  )}
                  {slides[0].button_text && slides[0].button_link && (
                    <div className="animated slideInDown">
                      <HomepageButton href={slides[0].button_link}>{slides[0].button_text}</HomepageButton>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Carousel Mode
  return (
    <>
      <style>{`
        .carousel-subtitle {
          font-size: 0.875rem;
          line-height: 1.5;
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .carousel-subtitle {
            font-size: 1rem;
            line-height: 1.5;
          }
        }
        @media (min-width: 1024px) and (max-width: 1599px) {
          #header-carousel .carousel-caption > .container {
            padding-top: 6.5rem;
          }
          .carousel-subtitle {
            font-size: 1.125rem;
            line-height: 1.6;
          }
        }
        @media (min-width: 1600px) {
          #header-carousel .carousel-caption > .container {
            padding-top: 12rem;
          }
          .carousel-subtitle {
            font-size: 1.25rem;
            line-height: 1.6;
          }
        }
      `}</style>
      <div className="container-fluid p-0 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner">
            {slides.map((slide, index) => renderSlide(slide, index))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
};
