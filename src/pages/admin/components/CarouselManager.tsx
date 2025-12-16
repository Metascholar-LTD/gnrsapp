import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, GripVertical, Upload, Video, Image, Save, Edit2, X, Check } from "lucide-react";

interface CarouselSlide {
  id: string;
  image_url: string;
  badge_text: string | null;
  title: string;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  display_order: number;
  is_active: boolean;
  layout_type: string | null;
}

interface CarouselSettings {
  id: string;
  display_type: 'carousel' | 'video';
  video_url: string | null;
}

const CarouselManager = () => {
  const [settings, setSettings] = useState<CarouselSettings | null>(null);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CarouselSlide>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: settingsData } = await supabase
        .from('carousel_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (settingsData) {
        setSettings(settingsData as CarouselSettings);
      }

      const { data: slidesData } = await supabase
        .from('carousel_slides')
        .select('*')
        .order('display_order', { ascending: true });

      if (slidesData) {
        setSlides(slidesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load carousel data');
    } finally {
      setLoading(false);
    }
  };

  const toggleDisplayType = async () => {
    if (!settings) return;
    setSaving(true);
    const newType = settings.display_type === 'carousel' ? 'video' : 'carousel';
    
    const { error } = await supabase
      .from('carousel_settings')
      .update({ display_type: newType })
      .eq('id', settings.id);

    if (error) {
      toast.error('Failed to update display type');
    } else {
      setSettings({ ...settings, display_type: newType });
      toast.success(`Switched to ${newType} mode`);
    }
    setSaving(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `hero-video-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('carousel-videos')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error('Failed to upload video');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('carousel-videos')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('carousel_settings')
      .update({ video_url: urlData.publicUrl })
      .eq('id', settings.id);

    if (updateError) {
      toast.error('Failed to save video URL');
    } else {
      setSettings({ ...settings, video_url: urlData.publicUrl });
      toast.success('Video uploaded successfully');
    }
    setUploading(false);
  };

  const handleImageUpload = async (slideId: string, file: File) => {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `slide-${slideId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('carousel-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error('Failed to upload image');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('carousel-images')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('carousel_slides')
      .update({ image_url: urlData.publicUrl })
      .eq('id', slideId);

    if (updateError) {
      toast.error('Failed to save image URL');
    } else {
      setSlides(slides.map(s => s.id === slideId ? { ...s, image_url: urlData.publicUrl } : s));
      toast.success('Image uploaded successfully');
    }
    setUploading(false);
  };

  const addNewSlide = async () => {
    const maxOrder = Math.max(...slides.map(s => s.display_order), 0);
    const newSlide = {
      image_url: '/img/carousel-1.jpg',
      badge_text: 'Welcome to GNRS',
      title: 'New Slide Title',
      subtitle: null,
      button_text: 'Learn More',
      button_link: '#about',
      display_order: maxOrder + 1,
      is_active: true,
      layout_type: 'left'
    };

    const { data, error } = await supabase
      .from('carousel_slides')
      .insert(newSlide)
      .select()
      .single();

    if (error) {
      toast.error('Failed to add slide');
    } else if (data) {
      setSlides([...slides, data]);
      setEditingSlide(data.id);
      setEditForm(data);
      toast.success('Slide added');
    }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    const { error } = await supabase
      .from('carousel_slides')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete slide');
    } else {
      setSlides(slides.filter(s => s.id !== id));
      toast.success('Slide deleted');
    }
  };

  const toggleSlideActive = async (slide: CarouselSlide) => {
    const { error } = await supabase
      .from('carousel_slides')
      .update({ is_active: !slide.is_active })
      .eq('id', slide.id);

    if (error) {
      toast.error('Failed to update slide');
    } else {
      setSlides(slides.map(s => s.id === slide.id ? { ...s, is_active: !s.is_active } : s));
    }
  };

  const startEditing = (slide: CarouselSlide) => {
    setEditingSlide(slide.id);
    setEditForm(slide);
  };

  const cancelEditing = () => {
    setEditingSlide(null);
    setEditForm({});
  };

  const saveSlide = async () => {
    if (!editingSlide) return;
    setSaving(true);

    const { error } = await supabase
      .from('carousel_slides')
      .update({
        badge_text: editForm.badge_text,
        title: editForm.title,
        subtitle: editForm.subtitle,
        button_text: editForm.button_text,
        button_link: editForm.button_link,
        layout_type: editForm.layout_type
      })
      .eq('id', editingSlide);

    if (error) {
      toast.error('Failed to save changes');
    } else {
      setSlides(slides.map(s => s.id === editingSlide ? { ...s, ...editForm } : s));
      setEditingSlide(null);
      setEditForm({});
      toast.success('Slide saved');
    }
    setSaving(false);
  };

  const moveSlide = async (slideId: string, direction: 'up' | 'down') => {
    const index = slides.findIndex(s => s.id === slideId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === slides.length - 1)) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newSlides = [...slides];
    const temp = newSlides[index].display_order;
    newSlides[index].display_order = newSlides[newIndex].display_order;
    newSlides[newIndex].display_order = temp;

    await supabase.from('carousel_slides').update({ display_order: newSlides[index].display_order }).eq('id', newSlides[index].id);
    await supabase.from('carousel_slides').update({ display_order: newSlides[newIndex].display_order }).eq('id', newSlides[newIndex].id);

    newSlides.sort((a, b) => a.display_order - b.display_order);
    setSlides(newSlides);
  };

  if (loading) {
    return <div className="cm-loading">Loading...</div>;
  }

  return (
    <div className="cm-wrapper">
      <style>{`
        .cm-wrapper { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .cm-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .cm-section-title { font-size: 1rem; font-weight: 600; color: #111827; margin: 0 0 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .cm-toggle-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .cm-toggle-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
        .cm-toggle-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
        .cm-toggle-btn.inactive { background: #f3f4f6; color: #6b7280; border-color: #e5e7eb; }
        .cm-toggle-btn.inactive:hover { border-color: #2563eb; color: #2563eb; }
        .cm-video-preview { margin-top: 1rem; }
        .cm-video-preview video { max-width: 100%; max-height: 200px; border-radius: 8px; }
        .cm-upload-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; font-size: 0.875rem; transition: all 0.2s; }
        .cm-upload-btn:hover { background: #e5e7eb; }
        .cm-upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .cm-slides-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .cm-add-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; }
        .cm-add-btn:hover { background: #1d4ed8; }
        .cm-slide-card { border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 1rem; overflow: hidden; }
        .cm-slide-card.inactive { opacity: 0.6; }
        .cm-slide-header { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
        .cm-slide-thumb { width: 80px; height: 50px; object-fit: cover; border-radius: 4px; }
        .cm-slide-title { flex: 1; font-weight: 500; font-size: 0.875rem; color: #111827; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cm-slide-actions { display: flex; gap: 0.5rem; }
        .cm-icon-btn { padding: 0.375rem; background: none; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .cm-icon-btn:hover { background: #f3f4f6; }
        .cm-icon-btn.danger:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
        .cm-icon-btn.success { background: #dcfce7; border-color: #86efac; color: #16a34a; }
        .cm-slide-body { padding: 1rem; }
        .cm-form-grid { display: grid; gap: 1rem; }
        .cm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 640px) { .cm-form-row { grid-template-columns: 1fr; } }
        .cm-form-group { display: flex; flex-direction: column; gap: 0.375rem; }
        .cm-form-group label { font-size: 0.75rem; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .cm-form-group input, .cm-form-group textarea, .cm-form-group select { padding: 0.625rem; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 0.875rem; transition: border-color 0.2s; }
        .cm-form-group input:focus, .cm-form-group textarea:focus, .cm-form-group select:focus { outline: none; border-color: #2563eb; }
        .cm-form-group textarea { resize: vertical; min-height: 60px; }
        .cm-form-actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; }
        .cm-btn { padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 0.375rem; transition: all 0.2s; }
        .cm-btn-primary { background: #2563eb; color: white; border: none; }
        .cm-btn-primary:hover { background: #1d4ed8; }
        .cm-btn-secondary { background: white; color: #374151; border: 1px solid #e5e7eb; }
        .cm-btn-secondary:hover { background: #f9fafb; }
        .cm-checkbox { display: flex; align-items: center; gap: 0.5rem; }
        .cm-checkbox input { width: 1rem; height: 1rem; }
        .cm-loading { padding: 2rem; text-align: center; color: #6b7280; }
        .cm-image-upload { position: relative; }
        .cm-image-upload-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; border-radius: 4px; cursor: pointer; }
        .cm-image-upload:hover .cm-image-upload-overlay { opacity: 1; }
        .cm-move-btns { display: flex; flex-direction: column; gap: 2px; }
        .cm-move-btn { padding: 2px 4px; background: #f3f4f6; border: 1px solid #e5e7eb; cursor: pointer; font-size: 10px; line-height: 1; }
        .cm-move-btn:hover { background: #e5e7eb; }
      `}</style>

      {/* Display Type Toggle */}
      <div className="cm-section">
        <h3 className="cm-section-title">
          {settings?.display_type === 'video' ? <Video size={18} /> : <Image size={18} />}
          Display Mode
        </h3>
        <div className="cm-toggle-row">
          <button
            className={`cm-toggle-btn ${settings?.display_type === 'carousel' ? 'active' : 'inactive'}`}
            onClick={toggleDisplayType}
            disabled={saving}
          >
            <Image size={16} /> Carousel
          </button>
          <button
            className={`cm-toggle-btn ${settings?.display_type === 'video' ? 'active' : 'inactive'}`}
            onClick={toggleDisplayType}
            disabled={saving}
          >
            <Video size={16} /> Video
          </button>
        </div>

        {settings?.display_type === 'video' && (
          <div className="cm-video-preview">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              style={{ display: 'none' }}
            />
            <button
              className="cm-upload-btn"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
            {settings.video_url && (
              <video src={settings.video_url} controls style={{ marginTop: '0.5rem' }} />
            )}
          </div>
        )}
      </div>

      {/* Slides Management */}
      <div className="cm-section">
        <div className="cm-slides-header">
          <h3 className="cm-section-title" style={{ margin: 0 }}>
            <Image size={18} /> Carousel Slides
          </h3>
          <button className="cm-add-btn" onClick={addNewSlide}>
            <Plus size={14} /> Add Slide
          </button>
        </div>

        {slides.map((slide, index) => (
          <div key={slide.id} className={`cm-slide-card ${!slide.is_active ? 'inactive' : ''}`}>
            <div className="cm-slide-header">
              <div className="cm-move-btns">
                <button className="cm-move-btn" onClick={() => moveSlide(slide.id, 'up')} disabled={index === 0}>▲</button>
                <button className="cm-move-btn" onClick={() => moveSlide(slide.id, 'down')} disabled={index === slides.length - 1}>▼</button>
              </div>
              <div className="cm-image-upload">
                <img src={slide.image_url} alt="" className="cm-slide-thumb" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(slide.id, e.target.files[0])}
                  style={{ display: 'none' }}
                  id={`img-upload-${slide.id}`}
                />
                <label htmlFor={`img-upload-${slide.id}`} className="cm-image-upload-overlay">
                  <Upload size={16} color="white" />
                </label>
              </div>
              <span className="cm-slide-title">{slide.title}</span>
              <div className="cm-slide-actions">
                <button
                  className={`cm-icon-btn ${slide.is_active ? 'success' : ''}`}
                  onClick={() => toggleSlideActive(slide)}
                  title={slide.is_active ? 'Active' : 'Inactive'}
                >
                  <Check size={14} />
                </button>
                {editingSlide !== slide.id && (
                  <button className="cm-icon-btn" onClick={() => startEditing(slide)} title="Edit">
                    <Edit2 size={14} />
                  </button>
                )}
                <button className="cm-icon-btn danger" onClick={() => deleteSlide(slide.id)} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {editingSlide === slide.id && (
              <div className="cm-slide-body">
                <div className="cm-form-grid">
                  <div className="cm-form-row">
                    <div className="cm-form-group">
                      <label>Badge Text</label>
                      <input
                        type="text"
                        value={editForm.badge_text || ''}
                        onChange={(e) => setEditForm({ ...editForm, badge_text: e.target.value })}
                        placeholder="e.g., Welcome to GNRS"
                      />
                    </div>
                    <div className="cm-form-group">
                      <label>Layout</label>
                      <select
                        value={editForm.layout_type || 'left'}
                        onChange={(e) => setEditForm({ ...editForm, layout_type: e.target.value })}
                      >
                        <option value="left">Left Aligned</option>
                        <option value="center">Center</option>
                        <option value="split">Split View</option>
                      </select>
                    </div>
                  </div>
                  <div className="cm-form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Main headline"
                    />
                  </div>
                  <div className="cm-form-group">
                    <label>Subtitle</label>
                    <textarea
                      value={editForm.subtitle || ''}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                      placeholder="Optional description text"
                    />
                  </div>
                  <div className="cm-form-row">
                    <div className="cm-form-group">
                      <label>Button Text</label>
                      <input
                        type="text"
                        value={editForm.button_text || ''}
                        onChange={(e) => setEditForm({ ...editForm, button_text: e.target.value })}
                        placeholder="e.g., Learn More"
                      />
                    </div>
                    <div className="cm-form-group">
                      <label>Button Link</label>
                      <input
                        type="text"
                        value={editForm.button_link || ''}
                        onChange={(e) => setEditForm({ ...editForm, button_link: e.target.value })}
                        placeholder="e.g., #about or /page"
                      />
                    </div>
                  </div>
                </div>
                <div className="cm-form-actions">
                  <button className="cm-btn cm-btn-secondary" onClick={cancelEditing}>
                    <X size={14} /> Cancel
                  </button>
                  <button className="cm-btn cm-btn-primary" onClick={saveSlide} disabled={saving}>
                    <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselManager;
