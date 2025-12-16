import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Upload, Edit2, X } from "lucide-react";

interface AboutContent {
  id: string;
  video_url: string | null;
  badge_text: string | null;
  title: string | null;
  description: string | null;
  story_content: string | null;
  mission_content: string | null;
  vision_content: string | null;
}

const AboutManager = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<AboutContent>>({});
  const [uploading, setUploading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('about_section')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setContent(data as AboutContent);
        setFormData(data);
      } else {
        // Initialize with default values
        const defaultData: Partial<AboutContent> = {
          video_url: 'https://res.cloudinary.com/dsypclqxk/video/upload/v1763129131/5400711_Coll_wavebreak_People_3840x2160_ufldaq.mp4',
          badge_text: 'About Us',
          title: 'Empowering Ghana Through Accessible National Resources',
          description: 'The Ghana National Resource System (GNRS) is a comprehensive platform designed to connect Ghanaians with essential resources including education opportunities, job listings, news updates, and national information. Our mission is to make vital resources easily accessible to all citizens, fostering national development and individual growth.',
          story_content: 'The Ghana National Resource System was established to bridge the gap between Ghanaians and essential national resources. Recognizing the need for a centralized platform that provides easy access to education, employment opportunities, and national information, GNRS was created to serve as a one-stop portal for all resource needs.\n\nThrough continuous innovation and collaboration with educational institutions, employers, and government agencies, we strive to create a more connected and informed Ghana where every citizen has access to the resources they need to succeed.',
          mission_content: 'Our mission is to provide a comprehensive, user-friendly platform that connects all Ghanaians with essential national resources including education opportunities, job listings, news updates, and government services.\n\nWe are committed to promoting transparency, accessibility, and efficiency in resource distribution, ensuring that every Ghanaian can access the information and opportunities they need to thrive in today\'s society.',
          vision_content: 'Our vision is to become the leading national resource platform in Ghana, recognized for excellence in connecting citizens with opportunities and information that drive personal and national development.\n\nWe envision a future where every Ghanaian, regardless of location or background, can easily access education, employment, and information resources through our integrated platform, contributing to a more prosperous and informed nation.',
        };
        setFormData(defaultData);
      }
    } catch (error) {
      console.error('Error fetching about section:', error);
      toast.error('Failed to load about section data');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `about-video-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('about-videos')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error('Failed to upload video');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('about-videos')
      .getPublicUrl(fileName);

    setFormData({ ...formData, video_url: urlData.publicUrl });
    toast.success('Video uploaded successfully');
    setUploading(false);
  };

  const startEditing = () => {
    setEditing(true);
    if (content) {
      setFormData(content);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    if (content) {
      setFormData(content);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      if (content?.id) {
        // Update existing
        const { error } = await supabase
          .from('about_section')
          .update(formData)
          .eq('id', content.id);

        if (error) throw error;
        toast.success('About section updated successfully');
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('about_section')
          .insert(formData)
          .select()
          .single();

        if (error) throw error;
        setContent(data as AboutContent);
        toast.success('About section created successfully');
      }
      setEditing(false);
      await fetchData();
    } catch (error: any) {
      console.error('Error saving about section:', error);
      toast.error(error.message || 'Failed to save about section');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return <div className="am-loading">Loading...</div>;
  }

  return (
    <div className="am-wrapper">
      <style>{`
        .am-wrapper { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .am-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .am-section-title { font-size: 1rem; font-weight: 600; color: #111827; margin: 0 0 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .am-view-mode { padding: 1rem; background: #f9fafb; border-radius: 6px; }
        .am-view-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .am-view-label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .am-view-value { font-size: 0.875rem; color: #111827; margin-top: 0.25rem; padding: 0.75rem; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; min-height: 2.5rem; display: flex; align-items: center; }
        .am-view-value.empty { color: #9ca3af; font-style: italic; }
        .am-edit-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; }
        .am-edit-btn:hover { background: #1d4ed8; }
        .am-form-grid { display: grid; gap: 1.5rem; }
        .am-form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .am-form-group label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .am-tab-section .am-form-group { gap: 0.5rem; margin-top: 1rem; }
        .am-tab-section .am-form-group:first-of-type { margin-top: 0; }
        .am-form-group input, .am-form-group textarea, .am-form-group select { padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; transition: border-color 0.2s; background: #ffffff; }
        .am-form-group input:focus, .am-form-group textarea:focus, .am-form-group select:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .am-form-group textarea { resize: vertical; min-height: 100px; }
        .am-form-group input:hover, .am-form-group textarea:hover, .am-form-group select:hover { border-color: #9ca3af; }
        .am-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 640px) { .am-form-row { grid-template-columns: 1fr; } }
        .am-form-actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
        .am-btn { padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 0.375rem; transition: all 0.2s; }
        .am-btn-primary { background: #2563eb; color: white; border: none; }
        .am-btn-primary:hover { background: #1d4ed8; }
        .am-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .am-btn-secondary { background: white; color: #374151; border: 1px solid #e5e7eb; }
        .am-btn-secondary:hover { background: #f9fafb; }
        .am-upload-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; font-size: 0.875rem; transition: all 0.2s; }
        .am-upload-btn:hover { background: #e5e7eb; }
        .am-upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .am-video-preview { margin-top: 0.5rem; }
        .am-video-preview video { max-width: 100%; max-height: 200px; border-radius: 8px; }
        .am-tab-section { background: #f9fafb; border-radius: 8px; padding: 1rem; margin-top: 1rem; border: 1px solid #e5e7eb; }
        .am-tab-section-title { font-size: 0.875rem; font-weight: 600; color: #111827; margin-bottom: 0.75rem; }
        .am-loading { padding: 2rem; text-align: center; color: #6b7280; }
      `}</style>

      {!editing ? (
        <div className="am-section">
          <div className="am-view-mode">
            <div className="am-view-row">
              <div>
                <div className="am-section-title">About Section Content</div>
              </div>
              <button className="am-edit-btn" onClick={startEditing}>
                <Edit2 size={14} /> Edit Content
              </button>
            </div>

            <div className="am-form-grid">
              <div className="am-form-group">
                <label>Video URL</label>
                <div className="am-view-value">{formData.video_url || <span className="empty">Not set</span>}</div>
                {formData.video_url && (
                  <div className="am-video-preview">
                    <video src={formData.video_url} controls style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '6px' }} />
                  </div>
                )}
              </div>

              <div className="am-form-row">
                <div className="am-form-group">
                  <label>Badge Text</label>
                  <div className="am-view-value">{formData.badge_text || <span className="empty">Not set</span>}</div>
                </div>
                <div className="am-form-group">
                  <label>Title</label>
                  <div className="am-view-value">{formData.title || <span className="empty">Not set</span>}</div>
                </div>
              </div>

              <div className="am-form-group">
                <label>Description</label>
                <div className="am-view-value">{formData.description || <span className="empty">Not set</span>}</div>
              </div>

              <div className="am-tab-section">
                <div className="am-tab-section-title">Tabbed Content</div>
                <div className="am-form-group">
                  <label>Story Content</label>
                  <div className="am-view-value" style={{ whiteSpace: 'pre-wrap' }}>{formData.story_content || <span className="empty">Not set</span>}</div>
                </div>
                <div className="am-form-group">
                  <label>Mission Content</label>
                  <div className="am-view-value" style={{ whiteSpace: 'pre-wrap' }}>{formData.mission_content || <span className="empty">Not set</span>}</div>
                </div>
                <div className="am-form-group">
                  <label>Vision Content</label>
                  <div className="am-view-value" style={{ whiteSpace: 'pre-wrap' }}>{formData.vision_content || <span className="empty">Not set</span>}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="am-section">
          <div className="am-section-title">Edit About Section</div>
          
          <div className="am-form-grid">
            <div className="am-form-group">
              <label>Video URL</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <input
                  type="text"
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="Enter video URL or upload a video"
                  style={{ flex: 1 }}
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ display: 'none' }}
                />
                <button
                  className="am-upload-btn"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={uploading}
                  style={{ flexShrink: 0 }}
                >
                  <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
              </div>
              {formData.video_url && (
                <div className="am-video-preview">
                  <video src={formData.video_url} controls style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            <div className="am-form-row">
              <div className="am-form-group">
                <label>Badge Text</label>
                <input
                  type="text"
                  value={formData.badge_text || ''}
                  onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                  placeholder="e.g., About Us"
                />
              </div>
              <div className="am-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Main heading"
                />
              </div>
            </div>

            <div className="am-form-group">
              <label>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Main description paragraph"
                rows={4}
              />
            </div>

            <div className="am-tab-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div className="am-tab-section-title">Tabbed Content</div>
                <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>Tip: Press Enter twice to create paragraph breaks</small>
              </div>
              
              <div className="am-form-group">
                <label>Story Content</label>
                <textarea
                  value={formData.story_content || ''}
                  onChange={(e) => setFormData({ ...formData, story_content: e.target.value })}
                  placeholder="Enter the Story content. Use line breaks to create paragraphs."
                  rows={6}
                  style={{ whiteSpace: 'pre-wrap' }}
                />
              </div>

              <div className="am-form-group">
                <label>Mission Content</label>
                <textarea
                  value={formData.mission_content || ''}
                  onChange={(e) => setFormData({ ...formData, mission_content: e.target.value })}
                  placeholder="Enter the Mission content. Use line breaks to create paragraphs."
                  rows={6}
                  style={{ whiteSpace: 'pre-wrap' }}
                />
              </div>

              <div className="am-form-group">
                <label>Vision Content</label>
                <textarea
                  value={formData.vision_content || ''}
                  onChange={(e) => setFormData({ ...formData, vision_content: e.target.value })}
                  placeholder="Enter the Vision content. Use line breaks to create paragraphs."
                  rows={6}
                  style={{ whiteSpace: 'pre-wrap' }}
                />
              </div>
            </div>
          </div>

          <div className="am-form-actions">
            <button className="am-btn am-btn-secondary" onClick={cancelEditing}>
              <X size={14} /> Cancel
            </button>
            <button className="am-btn am-btn-primary" onClick={saveContent} disabled={saving}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutManager;

