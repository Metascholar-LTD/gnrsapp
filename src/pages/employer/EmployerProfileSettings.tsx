// ============================================================================
// EMPLOYER PROFILE SETTINGS PAGE
// ============================================================================
// Profile editing page for employers
// Includes profile image upload to Supabase Storage
// ============================================================================

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Upload, 
  User, 
  Mail,
  Phone,
  Building2,
  Save,
  Loader2,
  Image as ImageIcon,
  Briefcase
} from 'lucide-react';

const EmployerProfileSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    bio: '',
    profile_image: '',
  });

  // Load profile
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to view your profile');
        return;
      }

      // Load employer profile
      const { data: profileData, error: profileError } = await supabase
        .from('employers' as any)
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || session.user.user_metadata?.full_name || '',
          email: profileData.email || session.user.email || '',
          phone: profileData.phone || '',
          company_name: profileData.company_name || '',
          bio: profileData.bio || '',
          profile_image: profileData.profile_image || '',
        });
      } else {
        // Create basic profile if doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('employers' as any)
          .insert({
            user_id: session.user.id,
            full_name: session.user.user_metadata?.full_name || 
                      session.user.user_metadata?.name || 
                      session.user.email?.split('@')[0] || 
                      null,
            email: session.user.email || null,
            company_name: session.user.user_metadata?.full_name || 'My Company',
          })
          .select()
          .single();

        if (createError) throw createError;
        
        if (newProfile) {
          setProfile(newProfile);
          setFormData(prev => ({
            ...prev,
            full_name: newProfile.full_name || '',
            email: newProfile.email || session.user.email || '',
            company_name: newProfile.company_name || '',
          }));
        }
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to upload images');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `employers/${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Delete old image if exists
      if (formData.profile_image) {
        try {
          // Extract the file path from the full URL
          const urlParts = formData.profile_image.split('/');
          const publicIndex = urlParts.findIndex(part => part === 'public');
          if (publicIndex !== -1 && publicIndex < urlParts.length - 1) {
            const pathAfterPublic = urlParts.slice(publicIndex + 1);
            if (pathAfterPublic.length >= 2) {
              const oldFilePath = pathAfterPublic.slice(1).join('/');
              await supabase.storage
                .from('profile-images')
                .remove([oldFilePath]);
            }
          }
        } catch (error) {
          // Ignore deletion errors
          console.warn('Could not delete old image:', error);
        }
      }

      setFormData(prev => ({ ...prev, profile_image: publicUrl }));
      toast.success('Profile image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to update your profile');
        return;
      }

      // Update employer profile
      const { error } = await supabase
        .from('employers' as any)
        .update({
          full_name: formData.full_name || null,
          email: formData.email || null,
          phone: formData.phone || null,
          company_name: formData.company_name || null,
          bio: formData.bio || null,
          profile_image: formData.profile_image || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      // Also update auth user metadata if full_name changed
      if (formData.full_name) {
        await supabase.auth.updateUser({
          data: { full_name: formData.full_name }
        });
      }

      toast.success('Profile updated successfully');
      await loadProfile();
      
      // Dispatch event to notify other components of profile update
      window.dispatchEvent(new CustomEvent('employerProfileUpdated'));
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#696cff' }} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        .eps-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .eps-header {
          margin-bottom: 2rem;
        }

        .eps-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #141522;
          margin: 0;
        }

        .eps-subtitle {
          font-size: 0.9375rem;
          color: #54577A;
          margin: 0.5rem 0 0 0;
        }

        .eps-card {
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .eps-section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #141522;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .eps-section-title svg {
          color: #696cff;
        }

        .eps-form-group {
          margin-bottom: 1.5rem;
        }

        .eps-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #54577A;
          margin-bottom: 0.5rem;
        }

        .eps-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .eps-input:focus {
          outline: none;
          border-color: #696cff;
          box-shadow: 0 0 0 3px rgba(105, 108, 255, 0.1);
        }

        .eps-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d9dee3;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #141522;
          font-family: 'Plus Jakarta Sans', sans-serif;
          resize: vertical;
          min-height: 100px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .eps-textarea:focus {
          outline: none;
          border-color: #696cff;
          box-shadow: 0 0 0 3px rgba(105, 108, 255, 0.1);
        }

        .eps-profile-image-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .eps-profile-image {
          width: 128px;
          height: 128px;
          border-radius: 0.75rem;
          object-fit: cover;
          border: 2px solid #e5e7eb;
        }

        .eps-profile-image-placeholder {
          width: 128px;
          height: 128px;
          border-radius: 0.75rem;
          background: #f5f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #e5e7eb;
        }

        .eps-upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #696cff;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .eps-upload-btn:hover:not(:disabled) {
          background: #5a5de0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(105, 108, 255, 0.3);
        }

        .eps-upload-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .eps-upload-hint {
          font-size: 0.8125rem;
          color: #8592a3;
          margin-top: 0.5rem;
        }

        .eps-save-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 2rem;
          background: #696cff;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .eps-save-btn:hover:not(:disabled) {
          background: #5a5de0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(105, 108, 255, 0.3);
        }

        .eps-save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .eps-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="eps-page">
        {/* Header */}
        <div className="eps-header">
          <h1 className="eps-title">Profile Settings</h1>
          <p className="eps-subtitle">Manage your employer profile and personal information</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Image Section */}
          <div className="eps-card">
            <h2 className="eps-section-title">
              <ImageIcon size={20} />
              Profile Image
            </h2>
            
            <div className="eps-profile-image-section">
              <div>
                {formData.profile_image ? (
                  <img
                    src={formData.profile_image}
                    alt="Profile"
                    className="eps-profile-image"
                  />
                ) : (
                  <div className="eps-profile-image-placeholder">
                    <User size={48} style={{ color: '#8592a3' }} />
                  </div>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                  />
                  <span className="eps-upload-btn" style={{ display: 'inline-flex' }}>
                    {uploadingImage ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        {formData.profile_image ? 'Change Image' : 'Upload Image'}
                      </>
                    )}
                  </span>
                </label>
                <p className="eps-upload-hint">
                  JPG, PNG or GIF. Max size 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="eps-card">
            <h2 className="eps-section-title">
              <User size={20} />
              Personal Information
            </h2>
            
            <div className="eps-form-group">
              <label className="eps-label">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="eps-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="eps-form-group">
              <label className="eps-label">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="eps-input"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="eps-form-group">
              <label className="eps-label">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="eps-input"
                placeholder="+233 XX XXX XXXX"
              />
            </div>

            <div className="eps-form-group">
              <label className="eps-label">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="eps-textarea"
                placeholder="Tell us about yourself and your professional background"
                rows={4}
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="eps-card">
            <h2 className="eps-section-title">
              <Building2 size={20} />
              Company Information
            </h2>
            
            <div className="eps-form-group">
              <label className="eps-label">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                className="eps-input"
                placeholder="Your company name"
              />
              <p style={{ fontSize: '0.8125rem', color: '#8592a3', marginTop: '0.5rem' }}>
                This is your default company name. You can manage your company details in the Company Management section.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="eps-actions">
            <button
              type="submit"
              disabled={saving}
              className="eps-save-btn"
            >
              {saving ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerProfileSettings;
