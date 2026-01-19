// Cloudinary utility for uploading files and generating thumbnails
// Uses the same configuration as lecture notes upload

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'deydftoe3';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

// Extract thumbnail from file using Cloudinary
// This uploads the file to Cloudinary temporarily to extract thumbnail
// Handles large PDF files (up to 100MB+ as Cloudinary supports)
export const extractThumbnailWithCloudinary = async (
  file: File,
  folder: string = 'lecture-notes'
): Promise<string> => {
  // Validate file size (Cloudinary supports up to 100MB for free tier, 10GB for paid)
  // We'll allow large files and let Cloudinary handle it
  const maxRecommendedSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxRecommendedSize) {
    console.warn(`Large file detected (${(file.size / 1024 / 1024).toFixed(2)}MB). Upload may take longer.`);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  
  // For large files, add timeout and chunk support
  // Cloudinary handles large files automatically, but we increase timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5 minute timeout for large files

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      // Don't set Content-Type header - browser will set it with boundary for FormData
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Upload failed' } }));
      throw new Error(error.error?.message || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    const publicId = data.public_id;

    // Generate thumbnail URL for PDFs (first page)
    let thumbnailUrl = data.secure_url;
    if (file.type === 'application/pdf') {
      // Cloudinary can extract first page of PDF as image
      // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
      // For PDFs, we use the public_id and append .pdf, then Cloudinary converts first page to image
      // ResearchGate-style: 120x160px thumbnail (240x320 for retina), high quality, first page only
      // Using pg_1 transformation to ensure we get the first page
      // Cloudinary automatically handles large PDFs and extracts just the first page efficiently
      thumbnailUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_240,h_320,c_fill,q_auto,f_jpg,dpr_2,pg_1/${publicId}.pdf`;
    } else if (file.type.includes('powerpoint') || file.type.includes('presentation')) {
      // For PPTX, Cloudinary doesn't directly support thumbnail extraction
      // The file will be stored but we can't extract a thumbnail automatically
      // User will need to upload a thumbnail manually
      thumbnailUrl = data.secure_url;
    }

    return thumbnailUrl;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Upload timeout - file is too large or connection is slow. Please try again.');
    }
    
    console.error('Cloudinary thumbnail extraction error:', error);
    throw error;
  }
};

// Generate thumbnail from Supabase Storage PDF URL
// This is useful when PDF is already uploaded to Supabase and we need to generate thumbnail
// Handles large PDFs by streaming and using Cloudinary's efficient processing
export const generateThumbnailFromSupabaseUrl = async (
  pdfUrl: string,
  folder: string = 'articles'
): Promise<string | null> => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  try {
    // Download PDF from Supabase URL with timeout for large files
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5 minute timeout

    const response = await fetch(pdfUrl, {
      signal: controller.signal,
    });
    
    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to download PDF from Supabase: ${response.status} ${response.statusText}`);
    }

    const pdfBlob = await response.blob();
    
    // Check if blob is valid
    if (pdfBlob.size === 0) {
      throw new Error('Downloaded PDF is empty');
    }

    const pdfFile = new File([pdfBlob], 'document.pdf', { type: 'application/pdf' });

    // Use Cloudinary to generate thumbnail (handles large files efficiently)
    const thumbnailUrl = await extractThumbnailWithCloudinary(pdfFile, folder);
    return thumbnailUrl;
  } catch (error: any) {
    if (timeoutId) clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error('Timeout downloading PDF from Supabase URL');
    } else {
      console.error('Error generating thumbnail from Supabase URL:', error);
    }
    return null;
  }
};

// Upload image file to Cloudinary
export const uploadImageToCloudinary = async (
  file: File,
  folder: string = 'lecture-notes/images'
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error: any) {
    console.error('Cloudinary image upload error:', error);
    throw error;
  }
};

