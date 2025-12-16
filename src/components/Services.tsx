import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HomepageButton } from "@/components/ui/HomepageButton";
import { MEDIA_QUERIES } from "@/lib/breakpoints";

interface ServiceTab {
  id: string;
  icon: string;
  title: string;
  image_url: string | null;
  content_title: string | null;
  description: string | null;
  list_item_1: string | null;
  list_item_2: string | null;
  list_item_3: string | null;
  order_index: number;
}

// Hardcoded tab configuration (titles, icons, button text/links)
const TAB_CONFIG = [
  { icon: 'fa-graduation-cap', title: 'Education Resources', buttonText: 'Explore Education', buttonLink: '/education' },
  { icon: 'fa-briefcase', title: 'Job Opportunities', buttonText: 'Browse Jobs', buttonLink: '/jobs' },
  { icon: 'fa-newspaper', title: 'News & Updates', buttonText: 'Read News', buttonLink: '/news' },
  { icon: 'fa-database', title: 'National Resources', buttonText: 'Learn More', buttonLink: '/contact' },
  { icon: 'fa-tools', title: 'Hands & Skills', buttonText: 'Explore Hands & Skills', buttonLink: '/skilled-workers' },
  { icon: 'fa-folder', title: 'Directories', buttonText: 'Browse Directories', buttonLink: '/directories' },
];

export const Services = () => {
  const [tabs, setTabs] = useState<ServiceTab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceTabs();
  }, []);

  const fetchServiceTabs = async () => {
    try {
      const { data, error } = await supabase
        .from('service_tabs' as any)
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching service tabs:', error);
      } else if (data) {
        setTabs((data as any) as ServiceTab[]);
      }
    } catch (error) {
      console.error('Error fetching service tabs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get tab data by icon and title
  const getTabData = (icon: string, title: string): ServiceTab | null => {
    return tabs.find(tab => tab.icon === icon && tab.title === title) || null;
  };

  // Render tab content
  const renderTabContent = (index: number, icon: string, title: string, buttonText: string, buttonLink: string) => {
    const tabData = getTabData(icon, title);
    const imageUrl = tabData?.image_url || '';
    const contentTitle = tabData?.content_title || '';
    const description = tabData?.description || '';
    const listItem1 = tabData?.list_item_1 || '';
    const listItem2 = tabData?.list_item_2 || '';
    const listItem3 = tabData?.list_item_3 || '';

    return (
      <div className={`tab-pane fade ${index === 0 ? 'show active' : ''}`} id={`tab-pane-${index + 1}`}>
        <div className="row g-4">
          <div className="col-md-6" style={{ minHeight: '350px' }}>
            <div className="position-relative h-100">
              {imageUrl && (
                <>
                  <img className="position-absolute rounded w-100 h-100" src={imageUrl}
                    style={{ objectFit: 'cover', filter: 'blur(1px)' }} alt={title} />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '0.375rem',
                    pointerEvents: 'none'
                  }}></div>
                </>
              )}
            </div>
          </div>
          <div className="col-md-6">
            {contentTitle && <h3 className="mb-4">{contentTitle}</h3>}
            {description && <p className="mb-4">{description}</p>}
            {listItem1 && <p><i className="fa fa-check text-primary me-3"></i>{listItem1}</p>}
            {listItem2 && <p><i className="fa fa-check text-primary me-3"></i>{listItem2}</p>}
            {listItem3 && <p><i className="fa fa-check text-primary me-3"></i>{listItem3}</p>}
            <div className="mt-3">
              <HomepageButton to={buttonLink}>{buttonText}</HomepageButton>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div id="services" className="container-fluid service py-5" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Mobile: 0px - 767px */
        @media ${MEDIA_QUERIES.MOBILE} {
          .service .nav .nav-link h5 {
            font-weight: 600 !important;
          }
          .service .tab-pane .col-md-6:first-child {
            display: none !important;
          }
          .service .tab-pane h3.mb-4 {
            font-size: 18px !important;
            padding-bottom: 0 !important;
            margin-bottom: 16px !important;
            position: relative !important;
            display: inline-block !important;
            width: auto !important;
          }
          .service .tab-pane h3.mb-4::after {
            content: '' !important;
            position: absolute !important;
            bottom: -8px !important;
            left: 0 !important;
            width: 60% !important;
            height: 2px !important;
            background: linear-gradient(to right, #2563eb, rgba(37, 99, 235, 0.3)) !important;
            border-radius: 2px !important;
          }
          .service .tab-pane p.mb-4 {
            font-size: 16px !important;
          }
          .service .tab-pane p:not(.mb-4) {
            font-size: 14px !important;
            padding-bottom: 10px !important;
            margin-bottom: 10px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
          }
          .service .tab-pane p:not(.mb-4):last-of-type {
            border-bottom: none !important;
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
          }
          .service .tab-pane .mt-3 {
            margin-top: 1.5rem !important;
          }
        }

        /* Tablet: 768px - 1199px */
        @media ${MEDIA_QUERIES.TABLET} {
          .service .nav .nav-link h5 {
            font-weight: 600 !important;
          }
          .service .tab-pane .col-md-6:first-child {
            display: none !important;
          }
          .service .tab-pane h3.mb-4 {
            font-size: 19px !important;
            padding-bottom: 0 !important;
            margin-bottom: 18px !important;
            position: relative !important;
            display: inline-block !important;
            width: auto !important;
          }
          .service .tab-pane h3.mb-4::after {
            content: '' !important;
            position: absolute !important;
            bottom: -10px !important;
            left: 0 !important;
            width: 60% !important;
            height: 2px !important;
            background: linear-gradient(to right, #2563eb, rgba(37, 99, 235, 0.3)) !important;
            border-radius: 2px !important;
          }
          .service .tab-pane p.mb-4 {
            font-size: 16px !important;
          }
          .service .tab-pane p:not(.mb-4) {
            font-size: 14px !important;
            padding-bottom: 11px !important;
            margin-bottom: 11px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
          }
          .service .tab-pane p:not(.mb-4):last-of-type {
            border-bottom: none !important;
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
          }
          .service .tab-pane .mt-3 {
            margin-top: 1.75rem !important;
          }
        }

        /* Desktop: 1200px - 1599px */
        @media ${MEDIA_QUERIES.DESKTOP} {
          .service .nav .nav-link h5 {
            font-weight: 600 !important;
          }
          .service .tab-pane h3.mb-4 {
            font-size: 20px !important;
            padding-bottom: 0 !important;
            margin-bottom: 20px !important;
            position: relative !important;
            display: inline-block !important;
            width: auto !important;
          }
          .service .tab-pane h3.mb-4::after {
            content: '' !important;
            position: absolute !important;
            bottom: -12px !important;
            left: 0 !important;
            width: 60% !important;
            height: 2px !important;
            background: linear-gradient(to right, #2563eb, rgba(37, 99, 235, 0.3)) !important;
            border-radius: 2px !important;
          }
          .service .tab-pane p.mb-4 {
            font-size: 16px !important;
          }
          .service .tab-pane p:not(.mb-4) {
            font-size: 14px !important;
            padding-bottom: 12px !important;
            margin-bottom: 12px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
          }
          .service .tab-pane p:not(.mb-4):last-of-type {
            border-bottom: none !important;
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
          }
          .service .tab-pane .mt-3 {
            margin-top: 2rem !important;
          }
        }

        /* Large Desktop: 1600px+ */
        @media ${MEDIA_QUERIES.LARGE_DESKTOP} {
          .service .nav .nav-link h5 {
            font-weight: 600 !important;
          }
          .service .tab-pane h3.mb-4 {
            font-size: 20px !important;
            padding-bottom: 0 !important;
            margin-bottom: 20px !important;
            position: relative !important;
            display: inline-block !important;
            width: auto !important;
          }
          .service .tab-pane h3.mb-4::after {
            content: '' !important;
            position: absolute !important;
            bottom: -12px !important;
            left: 0 !important;
            width: 60% !important;
            height: 2px !important;
            background: linear-gradient(to right, #2563eb, rgba(37, 99, 235, 0.3)) !important;
            border-radius: 2px !important;
          }
          .service .tab-pane p.mb-4 {
            font-size: 16px !important;
          }
          .service .tab-pane p:not(.mb-4) {
            font-size: 14px !important;
            padding-bottom: 12px !important;
            margin-bottom: 12px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
          }
          .service .tab-pane p:not(.mb-4):last-of-type {
            border-bottom: none !important;
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
          }
          .service .tab-pane .mt-3 {
            margin-top: 2rem !important;
          }
        }
      `}</style>
      <div id="services" className="container-fluid service py-5" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="container" style={{ maxWidth: '100%', paddingLeft: 'clamp(15px, 5vw, 80px)', paddingRight: 'clamp(15px, 5vw, 80px)' }}>
        <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <p className="d-inline-block border rounded text-primary fw-semi-bold py-1 px-3">Our Services</p>
          <div style={{ 
            width: '100%', 
            height: '1px', 
            backgroundColor: 'rgba(0, 0, 0, 0.1)', 
            margin: '16px auto 24px auto',
            maxWidth: '200px'
          }}></div>
          <h1 className="display-5 mb-5">Comprehensive National Resources For All Ghanaians</h1>
        </div>
        <div className="row g-4 wow fadeInUp" data-wow-delay="0.3s">
          <div className="col-lg-4">
            <div className="nav nav-pills d-flex justify-content-between w-100 h-100 me-4">
              <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4 active" data-bs-toggle="pill" data-bs-target="#tab-pane-1" type="button">
                <h5 className="m-0"><i className="fa fa-graduation-cap me-3" style={{color: '#000000'}}></i>Education Resources</h5>
              </button>
              <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-2" type="button">
                <h5 className="m-0"><i className="fa fa-briefcase me-3" style={{color: '#000000'}}></i>Job Opportunities</h5>
              </button>
              <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-3" type="button">
                <h5 className="m-0"><i className="fa fa-newspaper me-3" style={{color: '#000000'}}></i>News & Updates</h5>
              </button>
              <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-4" type="button">
                <h5 className="m-0"><i className="fa fa-database me-3" style={{color: '#000000'}}></i>National Resources</h5>
              </button>
              <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-4" data-bs-toggle="pill" data-bs-target="#tab-pane-5" type="button">
                <h5 className="m-0"><i className="fa fa-tools me-3" style={{color: '#000000'}}></i>Hands & Skills</h5>
              </button>
              <button className="nav-link w-100 d-flex align-items-center text-start border p-4 mb-0" data-bs-toggle="pill" data-bs-target="#tab-pane-6" type="button">
                <h5 className="m-0"><i className="fa fa-folder me-3" style={{color: '#000000'}}></i>Directories</h5>
              </button>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="tab-content w-100">
              {TAB_CONFIG.map((config, index) => 
                renderTabContent(index, config.icon, config.title, config.buttonText, config.buttonLink)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
