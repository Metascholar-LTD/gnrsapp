import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Edit2, X } from "lucide-react";

interface WhyChooseUsContent {
  id?: string;
  title: string | null;
  description: string | null;
  fast_executions_description: string | null;
  guide_support_description: string | null;
  financial_secure_description: string | null;
}

const WhyChooseUsManager = () => {
  const [content, setContent] = useState<WhyChooseUsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<WhyChooseUsContent>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('why_choose_us_section' as any)
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching why choose us section:', error);
        toast.error('Failed to load why choose us section data');
        setLoading(false);
        return;
      }

      if (data) {
        const contentData: WhyChooseUsContent = {
          id: (data as any).id,
          title: (data as any).title,
          description: (data as any).description,
          fast_executions_description: (data as any).fast_executions_description,
          guide_support_description: (data as any).guide_support_description,
          financial_secure_description: (data as any).financial_secure_description,
        };
        setContent(contentData);
        setFormData(contentData);
      } else {
        // If no data exists, use defaults
        const defaultData: WhyChooseUsContent = {
          title: 'Few Reasons Why People Choosing Us!',
          description: 'The Ghana National Resource System (GNRS) stands out as the premier platform for accessing essential national resources. We provide comprehensive, reliable, and accessible services that connect every Ghanaian with opportunities for education, employment, and national information. Our commitment to excellence and user satisfaction makes us the trusted choice for millions of citizens across Ghana.',
          fast_executions_description: 'Our platform delivers quick and efficient access to resources. Whether you\'re searching for educational opportunities, job listings, or national information, we ensure rapid response times and streamlined processes that save you valuable time.',
          guide_support_description: 'Our dedicated support team is always ready to assist you. From navigating the platform to finding specific resources, we provide comprehensive guidance and support to ensure you have the best experience accessing national resources.',
          financial_secure_description: 'All our services are completely free and secure. We ensure the highest standards of data protection and privacy, giving you peace of mind while accessing valuable national resources without any financial concerns.',
        };
        setContent(defaultData);
        setFormData(defaultData);
      }
    } catch (error) {
      console.error('Error fetching why choose us section:', error);
      toast.error('Failed to load why choose us section data');
    } finally {
      setLoading(false);
    }
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
      const dataToSave = {
        title: formData.title,
        description: formData.description,
        fast_executions_description: formData.fast_executions_description,
        guide_support_description: formData.guide_support_description,
        financial_secure_description: formData.financial_secure_description,
      };

      if (content?.id) {
        // Update existing record
        const { error } = await supabase
          .from('why_choose_us_section' as any)
          .update(dataToSave)
          .eq('id', content.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('why_choose_us_section' as any)
          .insert(dataToSave)
          .select()
          .single();

        if (error) throw error;
      }

      toast.success('Why Choose Us section saved successfully');
      setEditing(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving why choose us section:', error);
      toast.error('Failed to save why choose us section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="wcu-loading">Loading...</div>;
  }

  return (
    <div className="wcu-wrapper">
      <style>{`
        .wcu-wrapper { width: 100%; }
        .wcu-loading { padding: 2rem; text-align: center; color: #6b7280; }
        .wcu-section { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .wcu-section-title { font-size: 1rem; font-weight: 600; color: #111827; margin: 0 0 1rem 0; }
        .wcu-view-mode { width: 100%; }
        .wcu-view-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .wcu-view-value { font-size: 0.875rem; color: #111827; margin-top: 0.25rem; padding: 0.75rem; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; min-height: 2.5rem; display: flex; align-items: center; }
        .wcu-view-value.empty { color: #9ca3af; font-style: italic; }
        .wcu-edit-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #2563eb; color: #ffffff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; transition: background 0.2s; }
        .wcu-edit-btn:hover { background: #1d4ed8; }
        .wcu-form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .wcu-form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .wcu-form-group label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .wcu-form-group input, .wcu-form-group textarea { padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; transition: border-color 0.2s; background: #ffffff; }
        .wcu-form-group input:focus, .wcu-form-group textarea:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .wcu-form-group textarea { resize: vertical; min-height: 100px; }
        .wcu-form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
        .wcu-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; transition: all 0.2s; }
        .wcu-btn-primary { background: #2563eb; color: #ffffff; }
        .wcu-btn-primary:hover:not(:disabled) { background: #1d4ed8; }
        .wcu-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .wcu-btn-secondary { background: #f3f4f6; color: #374151; }
        .wcu-btn-secondary:hover { background: #e5e7eb; }
        .wcu-cards-section { border: 1px solid #e5e7eb; border-radius: 6px; padding: 1.5rem; margin-top: 1.5rem; background: #f9fafb; }
        .wcu-cards-section-title { font-size: 0.875rem; font-weight: 600; color: #111827; margin-bottom: 1rem; }
        .wcu-card-item { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 1rem; margin-bottom: 1rem; }
        .wcu-card-item:last-child { margin-bottom: 0; }
        .wcu-card-item-title { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
      `}</style>

      {!editing ? (
        <div className="wcu-section">
          <div className="wcu-view-mode">
            <div className="wcu-view-row">
              <div>
                <div className="wcu-section-title">Why Choose Us Section Content</div>
              </div>
              <button className="wcu-edit-btn" onClick={startEditing}>
                <Edit2 size={14} /> Edit Content
              </button>
            </div>

            <div className="wcu-form-grid">
              <div className="wcu-form-group">
                <label>Main Title</label>
                <div className="wcu-view-value">{formData.title || <span className="empty">Not set</span>}</div>
              </div>

              <div className="wcu-form-group">
                <label>Description</label>
                <div className="wcu-view-value" style={{ whiteSpace: 'pre-wrap', minHeight: 'auto', padding: '0.75rem' }}>{formData.description || <span className="empty">Not set</span>}</div>
              </div>

              <div className="wcu-cards-section">
                <div className="wcu-cards-section-title">Feature Cards</div>
                
                <div className="wcu-card-item">
                  <div className="wcu-card-item-title">Card 1: Fast Executions</div>
                  <div className="wcu-form-group" style={{ marginTop: '0.5rem' }}>
                    <label>Description</label>
                    <div className="wcu-view-value" style={{ whiteSpace: 'pre-wrap', minHeight: 'auto', padding: '0.75rem' }}>{formData.fast_executions_description || <span className="empty">Not set</span>}</div>
                  </div>
                </div>

                <div className="wcu-card-item">
                  <div className="wcu-card-item-title">Card 2: Guide & Support</div>
                  <div className="wcu-form-group" style={{ marginTop: '0.5rem' }}>
                    <label>Description</label>
                    <div className="wcu-view-value" style={{ whiteSpace: 'pre-wrap', minHeight: 'auto', padding: '0.75rem' }}>{formData.guide_support_description || <span className="empty">Not set</span>}</div>
                  </div>
                </div>

                <div className="wcu-card-item">
                  <div className="wcu-card-item-title">Card 3: Financial Secure</div>
                  <div className="wcu-form-group" style={{ marginTop: '0.5rem' }}>
                    <label>Description</label>
                    <div className="wcu-view-value" style={{ whiteSpace: 'pre-wrap', minHeight: 'auto', padding: '0.75rem' }}>{formData.financial_secure_description || <span className="empty">Not set</span>}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="wcu-section">
          <div className="wcu-section-title">Edit Why Choose Us Section</div>
          <div className="wcu-form-grid">
            <div className="wcu-form-group">
              <label>Main Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Few Reasons Why People Choosing Us!"
              />
            </div>

            <div className="wcu-form-group">
              <label>Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Main description paragraph"
                rows={4}
              />
            </div>

            <div className="wcu-cards-section">
              <div className="wcu-cards-section-title">Feature Cards</div>
              
              <div className="wcu-card-item">
                <div className="wcu-card-item-title">Card 1: Fast Executions</div>
                <div className="wcu-form-group" style={{ marginTop: '0.5rem' }}>
                  <label>Description</label>
                  <textarea
                    value={formData.fast_executions_description || ''}
                    onChange={(e) => setFormData({ ...formData, fast_executions_description: e.target.value })}
                    placeholder="Card description"
                    rows={3}
                  />
                </div>
              </div>

              <div className="wcu-card-item">
                <div className="wcu-card-item-title">Card 2: Guide & Support</div>
                <div className="wcu-form-group" style={{ marginTop: '0.5rem' }}>
                  <label>Description</label>
                  <textarea
                    value={formData.guide_support_description || ''}
                    onChange={(e) => setFormData({ ...formData, guide_support_description: e.target.value })}
                    placeholder="Card description"
                    rows={3}
                  />
                </div>
              </div>

              <div className="wcu-card-item">
                <div className="wcu-card-item-title">Card 3: Financial Secure</div>
                <div className="wcu-form-group" style={{ marginTop: '0.5rem' }}>
                  <label>Description</label>
                  <textarea
                    value={formData.financial_secure_description || ''}
                    onChange={(e) => setFormData({ ...formData, financial_secure_description: e.target.value })}
                    placeholder="Card description"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="wcu-form-actions">
            <button className="wcu-btn wcu-btn-secondary" onClick={cancelEditing}>
              <X size={14} /> Cancel
            </button>
            <button className="wcu-btn wcu-btn-primary" onClick={saveContent} disabled={saving}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhyChooseUsManager;

