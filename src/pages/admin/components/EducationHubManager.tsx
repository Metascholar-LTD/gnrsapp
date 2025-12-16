import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit2, Save, X, Upload, Image as ImageIcon } from "lucide-react";

interface EducationHubImage {
  id: string;
  step_id: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

const defaultImages: EducationHubImage[] = [
  {
    id: "",
    step_id: "01",
    image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=600&fit=crop&q=80&auto=format",
    created_at: "",
    updated_at: "",
  },
  {
    id: "",
    step_id: "02",
    image_url: "https://res.cloudinary.com/dsypclqxk/image/upload/v1756304758/finance_fgi2jq.jpg",
    created_at: "",
    updated_at: "",
  },
  {
    id: "",
    step_id: "03",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=600&fit=crop&q=80&auto=format",
    created_at: "",
    updated_at: "",
  },
  {
    id: "",
    step_id: "04",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=600&fit=crop&q=80&auto=format",
    created_at: "",
    updated_at: "",
  },
];

export default function EducationHubManager() {
  const [images, setImages] = useState<EducationHubImage[]>(defaultImages);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('education_hub_images' as any)
        .select('*')
        .order('step_id', { ascending: true });

      if (error) {
        console.error('Error fetching education hub images:', error);
        // Use default images if fetch fails
        setImages(defaultImages);
      } else if (data && data.length > 0) {
        // Ensure we have all 4 steps
        const fetchedImages = data as any as EducationHubImage[];
        const stepIds = ['01', '02', '03', '04'];
        const completeImages = stepIds.map(stepId => {
          const found = fetchedImages.find(img => img.step_id === stepId);
          return found || defaultImages.find(img => img.step_id === stepId)!;
        });
        setImages(completeImages);
      } else {
        setImages(defaultImages);
      }
    } catch (error) {
      console.error('Error fetching education hub images:', error);
      setImages(defaultImages);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (stepId: string, file: File) => {
    if (!file) return;

    setUploading(prev => ({ ...prev, [stepId]: true }));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `education-hub-${stepId}-${Date.now()}.${fileExt}`;
      const filePath = `education-hub/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('education-hub-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('education-hub-images')
        .getPublicUrl(filePath);

      // Update the image URL in state
      setImages(prev => prev.map(img => 
        img.step_id === stepId ? { ...img, image_url: publicUrl } : img
      ));

      // Save to database
      const existingImage = images.find(img => img.step_id === stepId);
      
      if (existingImage && existingImage.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from('education_hub_images' as any)
          .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
          .eq('step_id', stepId);

        if (updateError) throw updateError;
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('education_hub_images' as any)
          .insert({ step_id: stepId, image_url: publicUrl });

        if (insertError) throw insertError;
      }

      toast.success(`Image for Step ${stepId} uploaded successfully`);
      await fetchImages();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(prev => ({ ...prev, [stepId]: false }));
    }
  };

  const handleSaveUrl = async (stepId: string, url: string) => {
    try {
      const existingImage = images.find(img => img.step_id === stepId);
      
      if (existingImage && existingImage.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from('education_hub_images' as any)
          .update({ image_url: url, updated_at: new Date().toISOString() })
          .eq('step_id', stepId);

        if (updateError) throw updateError;
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('education_hub_images' as any)
          .insert({ step_id: stepId, image_url: url });

        if (insertError) throw insertError;
      }

      setImages(prev => prev.map(img => 
        img.step_id === stepId ? { ...img, image_url: url } : img
      ));

      setEditingStep(null);
      toast.success(`Image URL for Step ${stepId} saved successfully`);
      await fetchImages();
    } catch (error: any) {
      console.error('Error saving image URL:', error);
      toast.error(`Failed to save image URL: ${error.message}`);
    }
  };

  const getStepTitle = (stepId: string) => {
    const titles: Record<string, string> = {
      '01': 'Academic Resources',
      '02': 'Learning Tools',
      '03': 'Community & Support',
      '04': 'Career Development',
    };
    return titles[stepId] || `Step ${stepId}`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">
          Education Hub Phone Mockup Images
        </h4>
        <p className="text-sm text-gray-600 mb-6">
          Manage the images displayed in the phone mockup for each step. Only the images are controlled here - all text, steppers, and phone structure remain unchanged.
        </p>

        <div className="space-y-6">
          {images.map((image) => (
            <div
              key={image.step_id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-semibold text-gray-900">
                    Step {image.step_id}: {getStepTitle(image.step_id)}
                  </h5>
                </div>
              </div>

              <div className="flex items-start gap-4">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  {image.image_url ? (
                    <img
                      src={image.image_url}
                      alt={`Step ${image.step_id}`}
                      className="w-32 h-64 object-cover rounded-lg border border-gray-300"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-32 h-64 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Image URL Input and Upload */}
                <div className="flex-1 space-y-3">
                  <div className="border-t border-gray-300 pt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    {editingStep === image.step_id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={image.image_url || ''}
                          onChange={(e) => {
                            setImages(prev => prev.map(img =>
                              img.step_id === image.step_id
                                ? { ...img, image_url: e.target.value }
                                : img
                            ));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter image URL"
                        />
                        <button
                          onClick={() => handleSaveUrl(image.step_id, image.image_url || '')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
                        >
                          <Save size={16} />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingStep(null);
                            fetchImages();
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2 text-sm"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={image.image_url || ''}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                        />
                        <button
                          onClick={() => setEditingStep(image.step_id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Image
                    </label>
                    <input
                      ref={(el) => {
                        imageInputRefs.current[image.step_id] = el;
                      }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(image.step_id, file);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      onClick={() => imageInputRefs.current[image.step_id]?.click()}
                      disabled={uploading[image.step_id]}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload size={16} />
                      {uploading[image.step_id] ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

