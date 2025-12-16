import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Upload, Edit2, X, ChevronDown, ChevronUp } from "lucide-react";

interface ServiceTab {
  id?: string;
  icon: string;
  title: string;
  image_url: string | null;
  content_title: string | null;
  description: string | null;
  list_item_1: string | null;
  list_item_2: string | null;
  list_item_3: string | null;
  button_text: string | null;
  button_link: string | null;
  order_index: number;
}

interface ServicesContent {
  id?: string;
  badge_text: string | null;
  main_title: string | null;
  tabs: ServiceTab[];
}

const ServicesManager = () => {
  const [content, setContent] = useState<ServicesContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ServicesContent>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [expandedTabs, setExpandedTabs] = useState<Record<number, boolean>>(() => {
    // Load from localStorage on initial mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('services-expanded-tabs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return {};
        }
      }
    }
    return {};
  });
  const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchData();
  }, []);

  // Save expandedTabs to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('services-expanded-tabs', JSON.stringify(expandedTabs));
    }
  }, [expandedTabs]);

  const fetchData = async () => {
    try {
      // Fetch service tabs from Supabase
      const { data: tabsData, error: tabsError } = await supabase
        .from('service_tabs' as any)
        .select('*')
        .order('order_index', { ascending: true });

      if (tabsError) {
        console.error('Error fetching service tabs:', tabsError);
        toast.error('Failed to load service tabs data');
        setLoading(false);
        return;
      }

      const servicesContent: ServicesContent = {
        badge_text: null,
        main_title: null,
        tabs: ((tabsData || []) as any[]).map((tab: any) => ({
          id: tab.id,
          icon: tab.icon,
          title: tab.title,
          image_url: tab.image_url,
          content_title: tab.content_title,
          description: tab.description,
          list_item_1: tab.list_item_1,
          list_item_2: tab.list_item_2,
          list_item_3: tab.list_item_3,
          button_text: null, // Not admin controlled
          button_link: null, // Not admin controlled
          order_index: tab.order_index,
        })),
      };

      setContent(servicesContent);
      setFormData(servicesContent);
    } catch (error) {
      console.error('Error fetching services section:', error);
      toast.error('Failed to load services section data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (tabIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tab = formData.tabs?.[tabIndex];
    if (!tab) return;

    setUploading({ ...uploading, [tabIndex]: true });
    const fileExt = file.name.split('.').pop();
    const fileName = `service-tab-${tab.id || tabIndex}-${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        toast.error('Failed to upload image');
        setUploading({ ...uploading, [tabIndex]: false });
        return;
      }

      const { data: urlData } = supabase.storage
        .from('service-images')
        .getPublicUrl(fileName);

      const updatedTabs = formData.tabs?.map((tab, idx) =>
        idx === tabIndex ? { ...tab, image_url: urlData.publicUrl } : tab
      ) || [];

      setFormData({ ...formData, tabs: updatedTabs });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading({ ...uploading, [tabIndex]: false });
    }
  };

  const startEditing = () => {
    setEditing(true);
    if (content) {
      setFormData(content);
      // Initialize expanded state from localStorage or default to all expanded
      const saved = typeof window !== 'undefined' ? localStorage.getItem('services-expanded-tabs') : null;
      if (saved) {
        try {
          const savedState = JSON.parse(saved);
          setExpandedTabs(savedState);
        } catch (e) {
          // If parsing fails, default to all expanded
          const initialExpanded: Record<number, boolean> = {};
          content.tabs?.forEach((_, index) => {
            initialExpanded[index] = true;
          });
          setExpandedTabs(initialExpanded);
        }
      } else {
        // Default to all expanded if no saved state
        const initialExpanded: Record<number, boolean> = {};
        content.tabs?.forEach((_, index) => {
          initialExpanded[index] = true;
        });
        setExpandedTabs(initialExpanded);
      }
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    if (content) {
      setFormData(content);
    }
  };

  const updateTab = (tabIndex: number, updates: Partial<ServiceTab>) => {
    const updatedTabs = formData.tabs?.map((tab, idx) =>
      idx === tabIndex ? { ...tab, ...updates } : tab
    ) || [];
    setFormData({ ...formData, tabs: updatedTabs });
  };

  const toggleTab = (tabIndex: number) => {
    setExpandedTabs(prev => {
      const newState = {
        ...prev,
        [tabIndex]: prev[tabIndex] === undefined ? false : !prev[tabIndex]
      };
      return newState;
    });
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      if (!formData.tabs || formData.tabs.length === 0) {
        toast.error('No tabs to save');
        setSaving(false);
        return;
      }

      // Update each tab - only save admin-controlled fields
      for (let i = 0; i < formData.tabs.length; i++) {
        const tab = formData.tabs[i];
        
        if (!tab.id) {
          toast.error(`Tab ${i + 1} is missing an ID. Please refresh and try again.`);
          setSaving(false);
          return;
        }

        // Only update admin-controlled fields: image_url, content_title, description, list_item_1, list_item_2, list_item_3
        const { error: updateError } = await supabase
          .from('service_tabs' as any)
          .update({
            image_url: tab.image_url,
            content_title: tab.content_title,
            description: tab.description,
            list_item_1: tab.list_item_1,
            list_item_2: tab.list_item_2,
            list_item_3: tab.list_item_3,
          })
          .eq('id', tab.id);

        if (updateError) {
          throw updateError;
        }
      }

      toast.success('Services section saved successfully');
      setEditing(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving services section:', error);
      toast.error('Failed to save services section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="sm-loading">Loading...</div>;
  }

  return (
    <div className="sm-wrapper">
      <style>{`
        .sm-wrapper { width: 100%; }
        .sm-loading { padding: 2rem; text-align: center; color: #6b7280; }
        .sm-section { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .sm-section-title { font-size: 1rem; font-weight: 600; color: #111827; margin: 0 0 1rem 0; }
        .sm-view-mode { width: 100%; }
        .sm-view-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .sm-view-value { font-size: 0.875rem; color: #111827; margin-top: 0.25rem; padding: 0.75rem; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; min-height: 2.5rem; display: flex; align-items: center; }
        .sm-view-value.empty { color: #9ca3af; font-style: italic; }
        .sm-edit-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #2563eb; color: #ffffff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; transition: background 0.2s; }
        .sm-edit-btn:hover { background: #1d4ed8; }
        .sm-form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .sm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .sm-form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .sm-form-group label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .sm-form-group input, .sm-form-group textarea, .sm-form-group select { padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; transition: border-color 0.2s; background: #ffffff; }
        .sm-form-group input:focus, .sm-form-group textarea:focus, .sm-form-group select:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .sm-form-group textarea { resize: vertical; min-height: 100px; }
        .sm-form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
        .sm-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; transition: all 0.2s; }
        .sm-btn-primary { background: #2563eb; color: #ffffff; }
        .sm-btn-primary:hover:not(:disabled) { background: #1d4ed8; }
        .sm-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .sm-btn-secondary { background: #f3f4f6; color: #374151; }
        .sm-btn-secondary:hover { background: #e5e7eb; }
        .sm-upload-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; transition: all 0.2s; }
        .sm-upload-btn:hover:not(:disabled) { background: #e5e7eb; }
        .sm-upload-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .sm-image-preview { margin-top: 0.75rem; }
        .sm-image-preview img { max-width: 100%; max-height: 200px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .sm-tabs-list { display: flex; flex-direction: column; gap: 0; margin-top: 1rem; }
        .sm-tab-item { 
          border: 1px solid #e5e7eb; 
          border-radius: 0; 
          padding: 1.5rem; 
          background: #ffffff;
          position: relative;
        }
        .sm-tab-item:first-child {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .sm-tab-item:last-child {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .sm-tab-item:not(:last-child)::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 1.5rem;
          right: 1.5rem;
          height: 1px;
          background: linear-gradient(to right, transparent, #2563eb, rgba(37, 99, 235, 0.5), #2563eb, transparent);
        }
        .sm-tab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb; cursor: pointer; }
        .sm-tab-title { font-weight: 600; color: #111827; font-size: 1rem; }
        .sm-icon-btn { display: flex; align-items: center; justify-content: center; padding: 0.5rem; background: transparent; border: none; border-radius: 4px; cursor: pointer; color: #6b7280; transition: all 0.2s ease; }
        .sm-icon-btn:hover { background: #f3f4f6; color: #111827; }
        .sm-tab-content { 
          margin-top: 1rem; 
          overflow: hidden;
          transition: max-height 0.3s ease-in-out, opacity 0.2s ease-in-out, margin-top 0.3s ease-in-out;
        }
        .sm-tab-content.collapsed { 
          max-height: 0; 
          margin-top: 0;
          opacity: 0;
          padding: 0;
        }
        .sm-tab-content.expanded { 
          max-height: 5000px; 
          opacity: 1;
        }
        .sm-tab-section { background: #f9fafb; border-radius: 8px; padding: 1rem; margin-top: 1rem; border: 1px solid #e5e7eb; }
        .sm-tab-section-title { font-size: 0.875rem; font-weight: 600; color: #111827; margin-bottom: 0.75rem; }
        @media (max-width: 768px) {
          .sm-form-row { grid-template-columns: 1fr; }
          .sm-view-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>

      {!editing ? (
        <div className="sm-section">
          <div className="sm-view-mode">
            <div className="sm-view-row">
              <div>
                <div className="sm-section-title">Services Section Content</div>
              </div>
              <button className="sm-edit-btn" onClick={startEditing}>
                <Edit2 size={14} /> Edit Content
              </button>
            </div>

            <div className="sm-form-grid">
              <div className="sm-tabs-list">
                <div className="sm-section-title" style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Service Tabs ({formData.tabs?.length || 0})</div>
                {formData.tabs?.map((tab, index) => (
                  <div key={index} className="sm-tab-item">
                    <div className="sm-tab-header">
                      <div className="sm-tab-title">
                        <i className={`fa ${tab.icon} me-2`} style={{ color: '#000000' }}></i>
                        {tab.title || `Tab ${index + 1}`}
                      </div>
                    </div>
                    <div className="sm-tab-content">
                      <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                        <div><strong>Content Title:</strong> {tab.content_title || 'Not set'}</div>
                        <div><strong>Description:</strong> {tab.description ? (tab.description.length > 100 ? `${tab.description.substring(0, 100)}...` : tab.description) : 'Not set'}</div>
                        <div><strong>List Items:</strong> {tab.list_item_1 || 'Not set'}, {tab.list_item_2 || 'Not set'}, {tab.list_item_3 || 'Not set'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="sm-section">
          <div className="sm-section-title">Edit Services Section</div>
          <div className="sm-form-grid">
            <div className="sm-tabs-list">
              <div className="sm-section-title" style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Service Tabs</div>
              {formData.tabs?.map((tab, index) => {
                const isExpanded = expandedTabs[index] !== false; // Default to expanded if not set
                const isEven = index % 2 === 0;
                return (
                <div 
                  key={index} 
                  className="sm-tab-item"
                  style={{ 
                    backgroundColor: isEven ? '#ffffff' : '#f5f5f5' // Alternating: white, whitish grey
                  }}
                >
                  <div 
                    className="sm-tab-header"
                    onClick={(e) => {
                      // Only toggle if clicking on header, not on nested elements
                      if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.sm-tab-title')) {
                        toggleTab(index);
                      }
                    }}
                  >
                    <div className="sm-tab-title">Tab {index + 1}: {tab.title || 'Untitled'}</div>
                    <button
                      className="sm-icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTab(index);
                      }}
                      style={{ marginLeft: 'auto' }}
                      type="button"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  <div className={`sm-tab-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    <div className="sm-form-grid">
                      <div className="sm-form-group">
                        <label>Image URL</label>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          {tab.image_url && (
                            <div className="sm-image-preview" style={{ flexShrink: 0 }}>
                              <img src={tab.image_url} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
                            </div>
                          )}
                          {tab.image_url && (
                            <div style={{ 
                              width: '1px', 
                              height: '60px', 
                              background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2), transparent)',
                              flexShrink: 0
                            }}></div>
                          )}
                          <input
                            type="text"
                            value={tab.image_url || ''}
                            onChange={(e) => updateTab(index, { image_url: e.target.value })}
                            placeholder="Enter image URL or upload an image"
                            style={{ flex: 1 }}
                          />
                          <input
                            ref={(el) => { imageInputRefs.current[index] = el; }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                            style={{ display: 'none' }}
                          />
                          <button
                            className="sm-upload-btn"
                            onClick={() => imageInputRefs.current[index]?.click()}
                            disabled={uploading[index]}
                            style={{ flexShrink: 0 }}
                          >
                            <Upload size={14} /> {uploading[index] ? 'Uploading...' : 'Upload'}
                          </button>
                        </div>
                      </div>
                      <div className="sm-form-group">
                        <label>Content Title (h3 heading)</label>
                        <input
                          type="text"
                          value={tab.content_title || ''}
                          onChange={(e) => updateTab(index, { content_title: e.target.value })}
                          placeholder="e.g., Comprehensive Education Resources"
                        />
                      </div>
                      <div className="sm-form-group">
                        <label>Description</label>
                        <textarea
                          value={tab.description || ''}
                          onChange={(e) => updateTab(index, { description: e.target.value })}
                          placeholder="Main description paragraph"
                          rows={4}
                        />
                      </div>
                      <div className="sm-tab-section">
                        <div className="sm-tab-section-title">List Items</div>
                        <div className="sm-form-group">
                          <label>List Item 1</label>
                          <input
                            type="text"
                            value={tab.list_item_1 || ''}
                            onChange={(e) => updateTab(index, { list_item_1: e.target.value })}
                            placeholder="e.g., Scholarship Opportunities"
                          />
                        </div>
                        <div className="sm-form-group">
                          <label>List Item 2</label>
                          <input
                            type="text"
                            value={tab.list_item_2 || ''}
                            onChange={(e) => updateTab(index, { list_item_2: e.target.value })}
                            placeholder="e.g., Course Listings"
                          />
                        </div>
                        <div className="sm-form-group">
                          <label>List Item 3</label>
                          <input
                            type="text"
                            value={tab.list_item_3 || ''}
                            onChange={(e) => updateTab(index, { list_item_3: e.target.value })}
                            placeholder="e.g., Educational Institutions"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
          <div className="sm-form-actions">
            <button className="sm-btn sm-btn-secondary" onClick={cancelEditing}>
              <X size={14} /> Cancel
            </button>
            <button className="sm-btn sm-btn-primary" onClick={saveContent} disabled={saving}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
