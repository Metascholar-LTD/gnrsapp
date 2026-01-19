# PDF Thumbnail Generation System

## Overview
This system automatically generates thumbnail images from the first page of PDF files uploaded for scholarly articles, similar to ResearchGate's preview system.

## How It Works

### 1. **Frontend Generation (Current Implementation)**
When a scholar submits a paper:
- PDF is uploaded to Supabase Storage (`article-pdfs` bucket)
- PDF file is sent to Cloudinary for thumbnail extraction
- Cloudinary extracts the first page and converts it to a high-quality JPEG
- Thumbnail URL is stored in the `articles.thumbnail_url` field
- Thumbnail is displayed on the "All Papers" page

### 2. **Database Schema**
- Added `thumbnail_url` field to `articles` table
- Stores the Cloudinary URL of the generated thumbnail

### 3. **Display**
- The "All Papers" page uses `thumbnail_url` to display PDF previews
- Falls back to placeholder if thumbnail is not available

## Configuration

### Cloudinary Setup
1. Ensure you have Cloudinary account configured
2. Set environment variables:
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`

3. Create an upload preset in Cloudinary:
   - Go to Settings > Upload
   - Create a new unsigned upload preset
   - Enable "Auto-upload" for PDFs
   - Set folder structure: `articles/thumbnails`

### Thumbnail Specifications
- **Dimensions**: 240x320px (120x160px @ 2x DPI for retina displays)
- **Format**: JPEG
- **Quality**: Auto-optimized
- **Source**: First page of PDF only
- **Aspect Ratio**: Maintained with fill crop

## Usage

### For New Submissions
Thumbnails are automatically generated when:
- A scholar submits a new paper via `/scholar/submit-paper`
- PDF file is uploaded

### For Existing Articles
To generate thumbnails for existing articles without thumbnails:

```sql
-- Find articles without thumbnails
SELECT id, title, pdf_url 
FROM articles 
WHERE pdf_url IS NOT NULL 
AND thumbnail_url IS NULL;

-- Then manually trigger thumbnail generation via the frontend
-- or use the Cloudinary API directly
```

## Frontend Integration

### In SubmitPaper Component
```typescript
// Thumbnail is generated automatically during submission
const thumbnailUrl = await extractThumbnailWithCloudinary(pdfFile, 'articles/thumbnails');
```

### In AllPapers Component
```typescript
// Display thumbnail if available
{article.thumbnail_url ? (
  <img src={article.thumbnail_url} alt={article.title} />
) : (
  <FileText /> // Placeholder
)}
```

## Alternative: Server-Side Generation

If you prefer server-side generation, you can use the Supabase Edge Function:

1. Deploy the edge function: `supabase functions deploy generate-pdf-thumbnail`
2. Set up a database trigger to call the function when PDFs are uploaded
3. The function will use PDF.js or similar library to generate thumbnails

## Troubleshooting

### Thumbnails Not Generating
1. Check Cloudinary credentials in environment variables
2. Verify upload preset is configured correctly
3. Check browser console for errors
4. Ensure PDF files are valid and not corrupted

### Thumbnails Not Displaying
1. Verify `thumbnail_url` is stored in database
2. Check if Cloudinary URL is accessible
3. Verify CORS settings if accessing from different domain

## Future Enhancements
- [ ] Batch thumbnail generation for existing articles
- [ ] Support for multiple page previews
- [ ] Thumbnail regeneration on PDF update
- [ ] Server-side generation via Edge Functions
- [ ] Thumbnail caching and optimization
