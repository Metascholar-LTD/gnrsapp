// ============================================================================
// SUPABASE EDGE FUNCTION: Generate PDF Thumbnail
// ============================================================================
// Automatically generates a thumbnail from the first page of a PDF
// Similar to ResearchGate's PDF preview system
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Parse request body
    const { pdfUrl, articleId, bucketName = 'articles' } = await req.json();

    if (!pdfUrl || !articleId) {
      return new Response(
        JSON.stringify({ error: 'Missing pdfUrl or articleId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Generating thumbnail for PDF: ${pdfUrl}, Article ID: ${articleId}`);

    // Download PDF from Supabase Storage
    const pdfPath = pdfUrl.split('/storage/v1/object/public/')[1]?.split('/').slice(1).join('/') || 
                    pdfUrl.split(`${bucketName}/`)[1];
    
    if (!pdfPath) {
      throw new Error('Could not extract PDF path from URL');
    }

    const { data: pdfData, error: downloadError } = await supabaseClient.storage
      .from(bucketName)
      .download(pdfPath);

    if (downloadError || !pdfData) {
      throw new Error(`Failed to download PDF: ${downloadError?.message}`);
    }

    // Convert PDF to ArrayBuffer
    const pdfArrayBuffer = await pdfData.arrayBuffer();

    // Call external PDF thumbnail service (using pdf-lib and canvas via API)
    // For production, you can use a service like:
    // 1. Cloudinary (already in use)
    // 2. PDF.js + Canvas API
    // 3. Custom Node.js service
    
    // Option 1: Use Cloudinary if available
    const cloudinaryCloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const cloudinaryApiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const cloudinaryApiSecret = Deno.env.get('CLOUDINARY_API_SECRET');

    let thumbnailUrl: string | null = null;

    if (cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret) {
      // Upload PDF to Cloudinary and generate thumbnail
      const formData = new FormData();
      const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
      formData.append('file', pdfBlob, 'document.pdf');
      formData.append('upload_preset', 'pdf_thumbnails'); // You'll need to create this preset
      formData.append('format', 'png');
      formData.append('pages', '1'); // First page only
      formData.append('density', '200'); // 200 DPI

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (cloudinaryResponse.ok) {
        const cloudinaryData = await cloudinaryResponse.json();
        thumbnailUrl = cloudinaryData.secure_url;
        console.log('Thumbnail generated via Cloudinary:', thumbnailUrl);
      }
    }

    // Option 2: Use PDF.js + Canvas (requires Deno canvas support)
    // This is a fallback if Cloudinary is not available
    if (!thumbnailUrl) {
      // For now, we'll use a placeholder approach
      // In production, you'd use pdfjs-dist with canvas
      console.log('Cloudinary not available, using placeholder approach');
      
      // You can implement PDF.js rendering here if Deno supports it
      // For now, we'll return a placeholder URL that the frontend can handle
      thumbnailUrl = null; // Will trigger placeholder in frontend
    }

    // Update article with thumbnail URL
    if (thumbnailUrl) {
      const { error: updateError } = await supabaseClient
        .from('articles')
        .update({ thumbnail_url: thumbnailUrl })
        .eq('id', articleId);

      if (updateError) {
        console.error('Error updating article with thumbnail:', updateError);
        // Don't fail the request, just log the error
      } else {
        console.log('Article updated with thumbnail URL');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        thumbnailUrl,
        message: thumbnailUrl ? 'Thumbnail generated successfully' : 'Thumbnail generation skipped (service not configured)'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate thumbnail',
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
