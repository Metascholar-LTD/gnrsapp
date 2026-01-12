# Reviews/Share Your Experience - Database Schema Notes

## Review Form Fields (From SkilledWorkerProfile.tsx)

### Form State Variables:
- `reviewRating` (number, 1-5) - Star rating
- `reviewText` (string, required) - Review content
- `reviewerName` (string, required if not anonymous) - Reviewer's name
- `isAnonymous` (boolean) - Anonymous toggle

### Review Data Structure Needed:

**Table: `worker_reviews`**

#### Required Fields:
- `id` (uuid, primary key)
- `worker_id` (uuid, foreign key → skilled_workers.id)
- `rating` (integer, 1-5) - Star rating
- `review_text` (text) - Review content (required)
- `reviewer_name` (text) - Name or "Anonymous"
- `is_anonymous` (boolean) - Whether review is anonymous
- `created_at` (timestamp) - When review was submitted
- `updated_at` (timestamp) - Last update time

#### Optional Fields (Future):
- `reviewer_email` (text) - For notifications/verification
- `reviewer_avatar` (text) - Avatar URL
- `helpful_count` (integer) - Number of "helpful" votes
- `status` (text) - 'pending', 'approved', 'rejected' (for moderation)
- `admin_notes` (text) - Admin moderation notes

### Validation Rules:
1. `rating` must be between 1 and 5
2. `review_text` is required (cannot be empty)
3. If `is_anonymous` is false, `reviewer_name` is required
4. If `is_anonymous` is true, `reviewer_name` should be set to "Anonymous"

### Relationships:
- One worker can have many reviews (one-to-many)
- Reviews are displayed on worker profile page
- Reviews affect worker's average rating and review count

### Calculated Fields (on worker table):
- `rating` (decimal) - Average of all review ratings
- `reviews` (integer) - Count of all reviews

---

## Implementation Notes:

1. **Review Submission**: When a review is submitted, it should:
   - Insert into `worker_reviews` table
   - Update worker's `rating` (recalculate average)
   - Update worker's `reviews` count
   - If anonymous, set `reviewer_name` to "Anonymous"

2. **Display**: Reviews are displayed on the worker profile page with:
   - Reviewer name (or "Anonymous")
   - Star rating
   - Review text
   - Date posted

3. **Moderation** (Future): Could add admin approval workflow for reviews
