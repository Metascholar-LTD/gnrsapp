// Cloudinary utility for uploading files and generating thumbnails

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'deydftoe3';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

// Extract thumbnail from file using Cloudinary
// This uploads the file to Cloudinary temporarily to extract thumbnail
export const extractThumbnailWithCloudinary = async (
  file: File,
  folder: string = 'lecture-notes'
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();
    const publicId = data.public_id;

    // Generate thumbnail URL for PDFs (first page)
    let thumbnailUrl = data.secure_url;
    if (file.type === 'application/pdf') {
      // Cloudinary can extract first page of PDF as image
      // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
      // For PDFs, we use the public_id and append .pdf, then Cloudinary converts first page to image
      thumbnailUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,h_600,c_fill,q_auto,f_jpg/${publicId}.pdf`;
    } else if (file.type.includes('powerpoint') || file.type.includes('presentation')) {
      // For PPTX, Cloudinary doesn't directly support thumbnail extraction
      // The file will be stored but we can't extract a thumbnail automatically
      // User will need to upload a thumbnail manually
      thumbnailUrl = data.secure_url;
    }

    return thumbnailUrl;
  } catch (error: any) {
    console.error('Cloudinary thumbnail extraction error:', error);
    throw error;
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

