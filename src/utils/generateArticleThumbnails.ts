// ============================================================================
// UTILITY: Generate Thumbnails for Existing Articles
// ============================================================================
// This utility can be used to batch-generate thumbnails for articles
// that were submitted before thumbnail generation was implemented
// ============================================================================

import { supabase } from '@/integrations/supabase/client';
import { generateThumbnailFromSupabaseUrl } from './cloudinary';

/**
 * Generate thumbnails for articles that don't have them
 * @param articleIds Optional array of article IDs to process. If not provided, processes all articles without thumbnails
 * @param onProgress Optional callback for progress updates
 * @returns Promise with results
 */
export const generateThumbnailsForArticles = async (
  articleIds?: string[],
  onProgress?: (current: number, total: number, articleId: string) => void
): Promise<{ success: number; failed: number; errors: Array<{ articleId: string; error: string }> }> => {
  try {
    // Get articles without thumbnails
    let query = supabase
      .from('articles' as any)
      .select('id, pdf_url, thumbnail_url')
      .not('pdf_url', 'is', null)
      .or('thumbnail_url.is.null,thumbnail_url.eq.');

    if (articleIds && articleIds.length > 0) {
      query = query.in('id', articleIds);
    }

    const { data: articles, error } = await query;

    if (error) throw error;
    if (!articles || articles.length === 0) {
      return { success: 0, failed: 0, errors: [] };
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ articleId: string; error: string }>,
    };

    // Process each article
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      
      if (onProgress) {
        onProgress(i + 1, articles.length, article.id);
      }

      try {
        if (!article.pdf_url) {
          results.failed++;
          results.errors.push({
            articleId: article.id,
            error: 'No PDF URL',
          });
          continue;
        }

        // Generate thumbnail from PDF URL
        const thumbnailUrl = await generateThumbnailFromSupabaseUrl(article.pdf_url, 'articles/thumbnails');

        if (!thumbnailUrl) {
          results.failed++;
          results.errors.push({
            articleId: article.id,
            error: 'Failed to generate thumbnail',
          });
          continue;
        }

        // Update article with thumbnail URL
        const { error: updateError } = await supabase
          .from('articles' as any)
          .update({ thumbnail_url: thumbnailUrl })
          .eq('id', article.id);

        if (updateError) {
          results.failed++;
          results.errors.push({
            articleId: article.id,
            error: updateError.message,
          });
        } else {
          results.success++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          articleId: article.id,
          error: error.message || 'Unknown error',
        });
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  } catch (error: any) {
    console.error('Error generating thumbnails:', error);
    throw error;
  }
};
