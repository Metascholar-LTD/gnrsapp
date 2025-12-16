import { useState, useEffect } from "react";
import { Save, Edit2, X, Plus, Trash2, Search } from "lucide-react";
import { ConfirmationModal } from "@/components/admin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type FAQCategory = 'getting-started' | 'education' | 'jobs' | 'directories' | 'hands-skills';

interface FAQ {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
}

const FAQsManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FAQCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<FAQ>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

  const categoryLabels: Record<FAQCategory, string> = {
    'getting-started': 'Getting Started',
    'education': 'Education',
    'jobs': 'Jobs',
    'directories': 'Directories',
    'hands-skills': 'Hands & Skills',
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Save active tab to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('faqs-active-tab', activeTab);
    }
  }, [activeTab]);

  // Load active tab from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('faqs-active-tab');
      if (saved && (saved === 'all' || Object.keys(categoryLabels).includes(saved))) {
        setActiveTab(saved as FAQCategory | 'all');
      }
    }
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs' as any)
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error);
        toast.error('Failed to load FAQs');
        setLoading(false);
        return;
      }

      if (data) {
        setFaqs((data as any) as FAQ[]);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };


  const startEditing = (faq: FAQ) => {
    setEditing(faq.id);
    setFormData(faq);
  };

  const cancelEditing = () => {
    setEditing(null);
    setFormData({});
  };

  const saveFAQ = async () => {
    if (!formData.question || !formData.answer || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        category: formData.category,
        question: formData.question,
        answer: formData.answer,
      };

      if (editing && faqs.find(f => f.id === editing)) {
        // Update existing FAQ
        const { error } = await supabase
          .from('faqs' as any)
          .update(dataToSave)
          .eq('id', editing);

        if (error) throw error;
        toast.success('FAQ updated successfully');
      } else {
        // Insert new FAQ
        const { error } = await supabase
          .from('faqs' as any)
          .insert(dataToSave)
          .select()
          .single();

        if (error) throw error;
        toast.success('FAQ added successfully');
      }

      setEditing(null);
      setFormData({});
      await fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const deleteFAQ = (id: string) => {
    setFaqToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (faqToDelete !== null) {
      try {
        const { error } = await supabase
          .from('faqs' as any)
          .delete()
          .eq('id', faqToDelete);

        if (error) throw error;

        toast.success('FAQ deleted successfully');
        setFaqToDelete(null);
        setDeleteModalOpen(false);
        await fetchFAQs();
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        toast.error('Failed to delete FAQ');
      }
    }
  };

  const addNewFAQ = (category: FAQCategory) => {
    setEditing('new');
    setFormData({
      category,
      question: '',
      answer: '',
    });
    // Scroll to the new form
    setTimeout(() => {
      const formElement = document.querySelector('.faq-item:last-child');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || faq.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="faq-loading">Loading...</div>;
  }

  return (
    <div className="faq-wrapper">
      <style>{`
        .faq-wrapper { width: 100%; }
        .faq-loading { padding: 2rem; text-align: center; color: #6b7280; }
        .faq-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .faq-header-left { display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 250px; }
        .faq-header-left .faq-btn { white-space: nowrap; }
        .faq-header-right { display: flex; gap: 0.75rem; }
        .faq-search { position: relative; flex: 1; max-width: 400px; }
        .faq-search input { width: 100%; padding: 0.625rem 0.625rem 0.625rem 2.5rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; }
        .faq-search input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .faq-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #6b7280; }
        .faq-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .faq-tabs::-webkit-scrollbar { height: 4px; }
        .faq-tabs::-webkit-scrollbar-track { background: #f3f4f6; }
        .faq-tabs::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
        .faq-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border: none; background: transparent; border-bottom: 2px solid transparent; cursor: pointer; font-size: 0.875rem; font-weight: 500; color: #6b7280; transition: all 0.2s; white-space: nowrap; }
        .faq-tab:hover { color: #374151; background: #f9fafb; }
        .faq-tab.active { color: #2563eb; border-bottom-color: #2563eb; background: transparent; }
        .faq-tab-count { background: #e5e7eb; color: #374151; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .faq-tab.active .faq-tab-count { background: #2563eb; color: #ffffff; }
        .faq-items-container { display: flex; flex-direction: column; gap: 0.75rem; }
        .faq-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; transition: all 0.2s; }
        .faq-btn-primary { background: #2563eb; color: #ffffff; }
        .faq-btn-primary:hover { background: #1d4ed8; }
        .faq-btn-secondary { background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; }
        .faq-btn-secondary:hover { background: #e5e7eb; }
        .faq-item-meta { margin-bottom: 0.5rem; }
        .faq-item-category { display: inline-block; padding: 0.25rem 0.625rem; background: #f3f4f6; color: #6b7280; border-radius: 4px; font-size: 0.75rem; font-weight: 500; }
        .faq-item { border: 1px solid #e5e7eb; border-radius: 6px; background: #ffffff; overflow: hidden; }
        .faq-item-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 1rem; gap: 1rem; }
        .faq-item-content { flex: 1; }
        .faq-item-question { font-size: 0.9375rem; font-weight: 600; color: #111827; margin: 0 0 0.5rem 0; line-height: 1.5; }
        .faq-item-answer { font-size: 0.875rem; color: #6b7280; line-height: 1.6; margin: 0; }
        .faq-item-actions { display: flex; gap: 0.5rem; }
        .faq-icon-btn { display: flex; align-items: center; justify-content: center; padding: 0.5rem; background: transparent; border: none; border-radius: 4px; cursor: pointer; color: #6b7280; transition: all 0.2s; }
        .faq-icon-btn:hover { background: #f3f4f6; color: #111827; }
        .faq-icon-btn-danger:hover { background: #fee2e2; color: #dc2626; }
        .faq-form { padding: 1.25rem; background: #f9fafb; border-top: 1px solid #e5e7eb; }
        .faq-form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .faq-form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .faq-form-group label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .faq-form-group input, .faq-form-group textarea, .faq-form-group select { padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; transition: border-color 0.2s; background: #ffffff; }
        .faq-form-group input:focus, .faq-form-group textarea:focus, .faq-form-group select:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .faq-form-group textarea { resize: vertical; min-height: 120px; }
        .faq-form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem; }
        .faq-add-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; margin: 0.75rem; background: #f3f4f6; border: 1px dashed #d1d5db; border-radius: 6px; cursor: pointer; font-size: 0.875rem; color: #374151; transition: all 0.2s; }
        .faq-add-btn:hover { background: #e5e7eb; border-color: #9ca3af; }
        .faq-empty { padding: 2rem; text-align: center; color: #9ca3af; font-size: 0.875rem; }
        @media (max-width: 768px) {
          .faq-header { flex-direction: column; align-items: stretch; }
          .faq-search { max-width: 100%; }
          .faq-header-right { width: 100%; }
          .faq-tabs { gap: 0.25rem; }
          .faq-tab { padding: 0.625rem 1rem; font-size: 0.8125rem; }
        }
      `}</style>

      <div className="faq-header">
        <div className="faq-header-left">
          <div className="faq-search">
            <Search size={16} className="faq-search-icon" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="faq-btn faq-btn-primary" 
            onClick={() => addNewFAQ(activeTab === 'all' ? 'getting-started' : activeTab)}
            disabled={!!editing}
          >
            <Plus size={16} /> Add New FAQ
          </button>
        </div>
        <div className="faq-header-right">
          <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
            {activeTab === 'all' ? (
              <>Total: {filteredFAQs.length} FAQ{filteredFAQs.length !== 1 ? 's' : ''}</>
            ) : (
              <>{categoryLabels[activeTab]}: {filteredFAQs.length} FAQ{filteredFAQs.length !== 1 ? 's' : ''}</>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="faq-tabs">
        <button
          className={`faq-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>All FAQs</span>
          <span className="faq-tab-count">{faqs.length}</span>
        </button>
        {Object.entries(categoryLabels).map(([categoryKey, categoryLabel]) => {
          const category = categoryKey as FAQCategory;
          const count = faqs.filter(f => f.category === category).length;
          return (
            <button
              key={category}
              className={`faq-tab ${activeTab === category ? 'active' : ''}`}
              onClick={() => setActiveTab(category)}
            >
              <span>{categoryLabel}</span>
              <span className="faq-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* FAQ Items */}
      <div className="faq-items-container">
        {filteredFAQs.length === 0 ? (
          <div className="faq-empty">
            {searchQuery ? 'No FAQs found matching your search.' : `No FAQs in ${activeTab === 'all' ? 'this section' : categoryLabels[activeTab]}.`}
          </div>
        ) : (
          <>
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="faq-item">
                {editing === faq.id ? (
                  <div className="faq-form">
                    <div className="faq-form-grid">
                      <div className="faq-form-group">
                        <label>Category</label>
                        <select
                          value={formData.category || faq.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as FAQCategory })}
                        >
                          {Object.entries(categoryLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="faq-form-group">
                        <label>Question</label>
                        <input
                          type="text"
                          value={formData.question || ''}
                          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                          placeholder="Enter the question"
                        />
                      </div>
                      <div className="faq-form-group">
                        <label>Answer</label>
                        <textarea
                          value={formData.answer || ''}
                          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                          placeholder="Enter the answer"
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="faq-form-actions">
                      <button className="faq-btn faq-btn-secondary" onClick={cancelEditing}>
                        <X size={14} /> Cancel
                      </button>
                       <button className="faq-btn faq-btn-primary" onClick={saveFAQ} disabled={saving}>
                         <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                       </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="faq-item-header">
                      <div className="faq-item-content">
                        <div className="faq-item-meta">
                          <span className="faq-item-category">{categoryLabels[faq.category]}</span>
                        </div>
                        <h4 className="faq-item-question">{faq.question}</h4>
                        <p className="faq-item-answer">{faq.answer}</p>
                      </div>
                      <div className="faq-item-actions">
                        <button className="faq-icon-btn" onClick={() => startEditing(faq)} title="Edit FAQ">
                          <Edit2 size={16} />
                        </button>
                        <button className="faq-icon-btn faq-icon-btn-danger" onClick={() => deleteFAQ(faq.id)} title="Delete FAQ">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {editing && (editing === 'new' || !filteredFAQs.find(f => f.id === editing)) && (
              <div className="faq-item">
                <div className="faq-form">
                  <div className="faq-form-grid">
                    <div className="faq-form-group">
                      <label>Category</label>
                      <select
                        value={formData.category || activeTab !== 'all' ? activeTab : 'getting-started'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as FAQCategory })}
                      >
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="faq-form-group">
                      <label>Question</label>
                      <input
                        type="text"
                        value={formData.question || ''}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="Enter the question"
                      />
                    </div>
                    <div className="faq-form-group">
                      <label>Answer</label>
                      <textarea
                        value={formData.answer || ''}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        placeholder="Enter the answer"
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="faq-form-actions">
                    <button className="faq-btn faq-btn-secondary" onClick={cancelEditing}>
                      <X size={14} /> Cancel
                    </button>
                       <button className="faq-btn faq-btn-primary" onClick={saveFAQ} disabled={saving}>
                         <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                       </button>
                  </div>
                </div>
              </div>
            )}

            {!editing && (
              <button className="faq-add-btn" onClick={() => addNewFAQ(activeTab === 'all' ? 'getting-started' : activeTab)}>
                <Plus size={16} /> Add New FAQ
              </button>
            )}

          </>
        )}
      </div>

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default FAQsManager;

