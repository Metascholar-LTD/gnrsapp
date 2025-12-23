import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { generateDirectoryStyles, DIRECTORY_PADDING, MEDIA_QUERIES } from "@/lib/breakpoints";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Share2, 
  Bookmark, 
  ThumbsUp, 
  MoreVertical,
  X,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Play,
  Pause
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface LectureNote {
  id: string;
  title: string;
  field: string;
  university?: string;
  universityShort?: string;
  lecturer: string;
  downloads: number;
  views: number;
  fileSize: number;
  uploadDate: string;
  verified: boolean;
  pages: number;
  imageUrl?: string;
  fileType?: string;
  fileUrl: string;
}

const LectureNoteViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<LectureNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewerUrl, setViewerUrl] = useState<string>("");
  const [loadingPages, setLoadingPages] = useState(false);
  const [recommendedNotes, setRecommendedNotes] = useState<LectureNote[]>([]);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch lecture note
  useEffect(() => {
    if (id) {
      fetchLectureNote();
    }
  }, [id]);

  // Load viewer URL when note is loaded
  useEffect(() => {
    if (note?.fileUrl) {
      loadViewer();
      incrementViews();
    }
  }, [note]);

  const fetchLectureNote = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lecture_notes' as any)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error('Lecture note not found');
      }

      const noteData = data as any;
      const transformed: LectureNote = {
        id: noteData.id,
        title: noteData.title,
        field: noteData.field,
        university: noteData.university || "",
        universityShort: noteData.university_short || "",
        lecturer: noteData.lecturer,
        downloads: noteData.downloads || 0,
        views: noteData.views || 0,
        fileSize: noteData.file_size || 0,
        uploadDate: noteData.upload_date,
        verified: noteData.verified || false,
        pages: noteData.pages || 0,
        imageUrl: noteData.image_url,
        fileType: noteData.file_type,
        fileUrl: noteData.file_url,
      };
      setNote(transformed);
      fetchRecommendedNotes(transformed);
    } catch (error: any) {
      console.error("Error fetching lecture note:", error);
      toast.error("Failed to load lecture note");
      navigate('/education/lecture-notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedNotes = async (currentNote: LectureNote) => {
    try {
      const { data, error } = await supabase
        .from('lecture_notes' as any)
        .select('*')
        .neq('id', currentNote.id)
        .eq('field', currentNote.field)
        .order('views', { ascending: false })
        .limit(5);

      if (!error && data && Array.isArray(data)) {
        const transformed = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          field: item.field,
          university: item.university || "",
          universityShort: item.university_short || "",
          lecturer: item.lecturer,
          downloads: item.downloads || 0,
          views: item.views || 0,
          fileSize: item.file_size || 0,
          uploadDate: item.upload_date,
          verified: item.verified || false,
          pages: item.pages || 0,
          imageUrl: item.image_url,
          fileType: item.file_type,
          fileUrl: item.file_url,
        }));
        setRecommendedNotes(transformed);
      }
    } catch (error) {
      console.error("Error fetching recommended notes:", error);
    }
  };

  const loadViewer = () => {
    if (!note?.fileUrl) return;

    setLoadingPages(true);
    
    try {
      const encodedUrl = encodeURIComponent(note.fileUrl);
      
      if (note.fileType === 'PDF' || note.fileUrl.endsWith('.pdf')) {
        // Use Google Docs Viewer for PDFs
        const viewer = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
        setViewerUrl(viewer);
      } else if (note.fileType === 'PPTX' || note.fileType === 'PPT' || 
                 note.fileUrl.endsWith('.pptx') || note.fileUrl.endsWith('.ppt')) {
        // Use Office Online Viewer for PowerPoint files
        const viewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
        setViewerUrl(viewer);
      } else {
        // Fallback to Google Docs Viewer for other file types
        const viewer = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
        setViewerUrl(viewer);
      }
    } catch (error) {
      console.error("Error loading viewer:", error);
      toast.error("Failed to load document viewer");
    } finally {
      setLoadingPages(false);
    }
  };

  const incrementViews = async () => {
    if (!id) return;
    try {
      await supabase
        .from('lecture_notes' as any)
        .update({ views: (note?.views || 0) + 1 })
        .eq('id', id);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleDownload = async () => {
    if (!note?.fileUrl) return;

    const link = document.createElement('a');
    link.href = note.fileUrl;
    link.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.${note.fileType?.toLowerCase() || 'pdf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Increment downloads
    try {
      await supabase
        .from('lecture_notes' as any)
        .update({ downloads: (note.downloads || 0) + 1 })
        .eq('id', note.id);
      setNote(prev => prev ? { ...prev, downloads: prev.downloads + 1 } : null);
    } catch (error) {
      console.error("Error incrementing downloads:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share && note) {
      navigator.share({
        title: note.title,
        text: `Check out this lecture note: ${note.title}`,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </div>
        <Footer />
      </>
    );
  }

  if (!note) {
    return (
      <>
        <Navigation />
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
          <h2>Lecture note not found</h2>
          <button onClick={() => navigate('/education/lecture-notes')}>Go back</button>
        </div>
        <Footer />
      </>
    );
  }

  const isolatedStyles = `
    .lecture-note-viewer-wrapper {
      min-height: 100vh;
      background-color: #f9fafb;
    }

    .lecture-note-viewer-content {
      max-width: 1400px;
      margin: 0 auto;
    }

    .lecture-viewer-main-container {
      display: flex;
      gap: 2rem;
    }

    ${generateDirectoryStyles('lecture-note-viewer-wrapper', 'lecture-note-viewer-content')}

    /* Responsive layout for viewer container */
    @media ${MEDIA_QUERIES.MOBILE} {
      .lecture-viewer-main-container {
        flex-direction: column;
      }
    }

    @media ${MEDIA_QUERIES.TABLET} {
      .lecture-viewer-main-container {
        flex-direction: column;
      }
    }

    @media ${MEDIA_QUERIES.DESKTOP_AND_UP} {
      .lecture-viewer-main-container {
        flex-direction: row;
      }
    }

    /* Responsive sidebar */
    @media ${MEDIA_QUERIES.MOBILE} {
      .lecture-viewer-sidebar {
        width: 100%;
      }
    }

    @media ${MEDIA_QUERIES.TABLET} {
      .lecture-viewer-sidebar {
        width: 100%;
      }
    }

    @media ${MEDIA_QUERIES.DESKTOP_AND_UP} {
      .lecture-viewer-sidebar {
        width: 300px;
      }
    }
  `;

  return (
    <>
      <style>{isolatedStyles}</style>
      <Navigation />
      <div className="lecture-note-viewer-wrapper">
        {/* Top Bar */}
        <div style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Downloaded {note.downloads.toLocaleString()} times
            </div>
            <div style={{ 
              padding: '0.25rem 0.75rem', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              {note.fileType || 'PDF'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setLiked(!liked)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: liked ? '#3b82f6' : '#374151'
              }}
            >
              <ThumbsUp className="w-4 h-4" style={{ fill: liked ? '#3b82f6' : 'none' }} />
              <span>281</span>
            </button>
            <button
              onClick={() => setSaved(!saved)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              <Bookmark className="w-4 h-4" style={{ fill: saved ? '#f59e0b' : 'none' }} />
              <span>Save</span>
            </button>
            <button
              onClick={handleShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handleDownload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.5rem',
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              style={{
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lecture-note-viewer-content">
          <div style={{ 
            display: 'flex', 
            gap: '2rem',
            flexDirection: 'column'
          }}>
            {/* Document Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                {note.imageUrl && (
                  <img 
                    src={note.imageUrl} 
                    alt="" 
                    style={{ width: '32px', height: '32px', borderRadius: '0.25rem', objectFit: 'cover' }}
                  />
                )}
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Uploaded by {note.lecturer}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>•</span>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {note.fileType || 'PDF'}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>•</span>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {note.views.toLocaleString()} views
                </span>
              </div>
              <h1 style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                fontWeight: 700, 
                color: '#111827',
                margin: 0,
                lineHeight: 1.2
              }}>
                {note.title}
              </h1>
            </div>

            {/* Main Viewer Container */}
            <div style={{ 
              display: 'flex', 
              gap: '2rem',
              flexDirection: window.innerWidth < 1200 ? 'column' : 'row'
            }}>
              {/* Center - Main Viewer */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
                {/* Document Viewer */}
                <div 
                  ref={containerRef}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    position: 'relative',
                    minHeight: '600px',
                    width: '100%',
                    overflow: 'hidden'
                  }}
                >
                  {loadingPages ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                      <div className="spinner" style={{ margin: '0 auto' }} />
                      <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading document...</p>
                    </div>
                  ) : viewerUrl ? (
                    <>
                      <iframe
                        src={viewerUrl}
                        style={{
                          width: '100%',
                          height: '800px',
                          border: 'none',
                          display: 'block'
                        }}
                        title="Document Viewer"
                        allowFullScreen
                      />
                      {/* Fullscreen Button */}
                      <button
                        onClick={() => {
                          if (!isFullscreen) {
                            containerRef.current?.requestFullscreen();
                            setIsFullscreen(true);
                          } else {
                            document.exitFullscreen();
                            setIsFullscreen(false);
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          width: '40px',
                          height: '40px',
                          borderRadius: '0.375rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #e5e7eb',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        title="Fullscreen"
                      >
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                      </button>
                    </>
                  ) : (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                      <p>Unable to load document viewer</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar - Recommended */}
              <div className="lecture-viewer-sidebar" style={{ 
                width: '300px',
                flexShrink: 0 
              }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 700, 
                  marginBottom: '1.5rem',
                  color: '#111827'
                }}>
                  Recommended
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recommendedNotes.map((recNote) => (
                    <div
                      key={recNote.id}
                      onClick={() => navigate(`/education/lecture-notes/${recNote.id}`)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {recNote.imageUrl && (
                        <img
                          src={recNote.imageUrl}
                          alt={recNote.title}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <div style={{ padding: '1rem' }}>
                        <h3 style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          margin: '0 0 0.5rem 0',
                          color: '#111827',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {recNote.title}
                        </h3>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                          by {recNote.lecturer}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {recNote.pages} slides • {recNote.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LectureNoteViewer;

