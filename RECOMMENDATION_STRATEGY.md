# Lecture Notes Recommendation Strategy

## 🎯 **Recommended Approach: Hybrid Scoring Algorithm**

### **Core Strategy: Multi-Factor Scoring**

```typescript
// Calculate recommendation score for each lecture note
const calculateRecommendationScore = (note: LectureNote, userContext?: UserContext) => {
  const now = Date.now();
  const uploadDate = new Date(note.uploadDate).getTime();
  const daysSinceUpload = (now - uploadDate) / (1000 * 60 * 60 * 24);
  
  // 1. Engagement Score (40% weight)
  const engagementScore = (
    (normalize(note.views, 0, 10000) * 0.3) +           // Views normalized
    (normalize(note.downloads, 0, 1000) * 0.5) +        // Downloads (more valuable)
    (normalize(note.views / Math.max(daysSinceUpload, 1), 0, 100) * 0.2) // Views per day
  );
  
  // 2. Quality Score (25% weight)
  const qualityScore = (
    (note.verified ? 1.0 : 0.3) +                       // Verified content
    (note.imageUrl ? 0.2 : 0) +                          // Has thumbnail
    (note.pages >= 10 && note.pages <= 100 ? 0.3 : 0.1) // Optimal page count
  );
  
  // 3. Freshness Score (15% weight)
  const freshnessScore = Math.max(0, 1 - (daysSinceUpload / 365)); // Decay over 1 year
  
  // 4. Relevance Score (20% weight) - if user context available
  let relevanceScore = 0.5; // Default
  if (userContext) {
    if (userContext.preferredFields?.includes(note.faculty)) relevanceScore += 0.3;
    if (userContext.preferredUniversities?.includes(note.universityShort)) relevanceScore += 0.2;
    if (userContext.recentSearches?.some(s => note.title.toLowerCase().includes(s))) relevanceScore += 0.2;
  }
  
  // Final weighted score
  return (
    engagementScore * 0.40 +
    qualityScore * 0.25 +
    freshnessScore * 0.15 +
    relevanceScore * 0.20
  );
};

const normalize = (value: number, min: number, max: number): number => {
  if (max === min) return 0.5;
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
};
```

### **2. Context-Aware Recommendations**

```typescript
// Personalize based on user behavior
const getPersonalizedRecommendations = (
  allNotes: LectureNote[],
  userContext: {
    viewedNotes?: string[];
    downloadedNotes?: string[];
    searchHistory?: string[];
    preferredField?: string;
  }
) => {
  // Collaborative filtering: "Users who viewed X also viewed Y"
  const similarNotes = findSimilarNotes(userContext.viewedNotes || [], allNotes);
  
  // Content-based: Match user's preferred field
  const fieldMatches = allNotes.filter(n => 
    n.faculty === userContext.preferredField
  );
  
  // Trending in user's field
  const trendingInField = getTrendingNotes(
    allNotes.filter(n => n.faculty === userContext.preferredField),
    '7days'
  );
  
  // Combine and deduplicate
  return [...similarNotes, ...fieldMatches, ...trendingInField]
    .filter((note, index, self) => 
      index === self.findIndex(n => n.id === note.id)
    )
    .slice(0, 6);
};
```

### **3. Trending Algorithm**

```typescript
// Identify trending content (velocity-based)
const getTrendingNotes = (notes: LectureNote[], period: '24h' | '7days' | '30days') => {
  const periodMs = {
    '24h': 24 * 60 * 60 * 1000,
    '7days': 7 * 24 * 60 * 60 * 1000,
    '30days': 30 * 24 * 60 * 60 * 1000
  }[period];
  
  const cutoff = Date.now() - periodMs;
  
  return notes
    .map(note => {
      // Calculate velocity (recent activity rate)
      const recentViews = note.views * (note.uploadDate > cutoff ? 1.5 : 0.8);
      const velocity = recentViews / Math.max(1, (Date.now() - new Date(note.uploadDate).getTime()) / periodMs);
      
      return { ...note, velocity };
    })
    .sort((a, b) => b.velocity - a.velocity)
    .slice(0, 6);
};
```

### **4. Diversity Strategy**

```typescript
// Ensure variety in recommendations
const getDiverseRecommendations = (notes: LectureNote[]) => {
  const scored = notes.map(note => ({
    note,
    score: calculateRecommendationScore(note)
  })).sort((a, b) => b.score - a.score);
  
  const selected: LectureNote[] = [];
  const usedFields = new Set<string>();
  const usedUniversities = new Set<string>();
  
  // Select top items with diversity constraints
  for (const { note } of scored) {
    if (selected.length >= 6) break;
    
    // Ensure diversity: max 2 from same field, max 2 from same university
    const fieldCount = Array.from(usedFields).filter(f => f === note.faculty).length;
    const uniCount = Array.from(usedUniversities).filter(u => u === note.universityShort).length;
    
    if (fieldCount < 2 && uniCount < 2) {
      selected.push(note);
      usedFields.add(note.faculty);
      usedUniversities.add(note.universityShort);
    }
  }
  
  // Fill remaining slots if needed
  if (selected.length < 6) {
    const remaining = scored
      .filter(({ note }) => !selected.find(s => s.id === note.id))
      .slice(0, 6 - selected.length)
      .map(({ note }) => note);
    selected.push(...remaining);
  }
  
  return selected;
};
```

### **5. Time-Based Strategies**

```typescript
// Different strategies for different times
const getTimeBasedRecommendations = (notes: LectureNote[]) => {
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  
  // Morning (6-12): Fresh content, study materials
  if (hour >= 6 && hour < 12) {
    return getFreshContent(notes, '7days')
      .filter(n => n.verified)
      .slice(0, 6);
  }
  
  // Afternoon (12-18): Popular, trending
  if (hour >= 12 && hour < 18) {
    return getTrendingNotes(notes, '24h').slice(0, 6);
  }
  
  // Evening (18-24): Comprehensive, high-quality
  if (hour >= 18) {
    return notes
      .filter(n => n.verified && n.pages >= 20)
      .sort((a, b) => calculateRecommendationScore(b) - calculateRecommendationScore(a))
      .slice(0, 6);
  }
  
  // Night (0-6): Evergreen content
  return notes
    .filter(n => n.verified && n.views > 100)
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 6);
};
```

### **6. A/B Testing Framework**

```typescript
// Test different strategies
const getRecommendations = (notes: LectureNote[], userId?: string) => {
  // Assign user to test group (consistent via hash)
  const testGroup = userId 
    ? (parseInt(userId.slice(-1), 16) % 4) 
    : Math.floor(Math.random() * 4);
  
  switch (testGroup) {
    case 0: return getHybridScoring(notes);      // Control: Current views-based
    case 1: return getDiverseRecommendations(notes); // Test A: Diversity
    case 2: return getTrendingNotes(notes, '7days'); // Test B: Trending
    case 3: return getPersonalizedRecommendations(notes, getUserContext(userId)); // Test C: Personalized
    default: return getHybridScoring(notes);
  }
};
```

## 📊 **Implementation Priority**

### **Phase 1 (Quick Win - Implement Now)**
1. ✅ Hybrid scoring algorithm (replace simple views sort)
2. ✅ Diversity enforcement (max 2 per field/university)
3. ✅ Verified content boost

### **Phase 2 (Short-term)**
1. Freshness decay (favor recent uploads)
2. Trending algorithm (velocity-based)
3. Engagement metrics (downloads weighted higher than views)

### **Phase 3 (Long-term)**
1. User behavior tracking (viewed/downloaded history)
2. Collaborative filtering
3. A/B testing framework
4. Real-time personalization

## 🎨 **UI Enhancements**

```typescript
// Show why items are recommended
const getRecommendationReason = (note: LectureNote, score: number) => {
  if (note.verified && note.downloads > 100) return "🔥 Highly Rated";
  if (note.views > 1000) return "⭐ Popular Choice";
  if (isRecent(note.uploadDate)) return "✨ Just Added";
  if (note.downloads / note.views > 0.3) return "💯 High Quality";
  return "📚 Recommended for You";
};
```

## 📈 **Metrics to Track**

1. **Click-through rate** on recommended items
2. **Conversion rate** (view → download)
3. **Engagement time** on recommended content
4. **User satisfaction** (implicit: bookmark, share)
5. **Diversity metrics** (field/university distribution)

## 🔧 **Quick Implementation**

Replace the current simple sort with:

```typescript
const recommendedNotes = useMemo(() => {
  return getDiverseRecommendations(lectureNotes);
}, [lectureNotes]);
```

This gives you immediate improvement with minimal code changes!

