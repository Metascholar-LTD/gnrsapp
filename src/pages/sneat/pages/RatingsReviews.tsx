import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Reply,
  Flag,
  MoreVertical,
  Award,
  Users,
  Calendar,
  BarChart3,
  Loader2,
  Quote,
  Heart,
  CheckCircle2
} from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  service: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  reply?: {
    content: string;
    date: string;
  };
  verified: boolean;
  images?: string[];
}

const RatingsReviews: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReviews(mockReviews);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const mockReviews: Review[] = [
    {
      id: '1',
      customerName: 'Kwame Asante',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      service: 'Plumbing Services',
      rating: 5,
      title: 'Excellent work, highly recommend!',
      content: 'The plumber arrived on time and fixed my burst pipe quickly. Very professional and cleaned up after the work was done. The price was fair and he explained everything clearly. Would definitely use again!',
      date: '2024-01-18',
      helpful: 12,
      verified: true,
      reply: {
        content: 'Thank you so much for your kind words! It was a pleasure helping you. Please don\'t hesitate to reach out if you need any assistance in the future.',
        date: '2024-01-19'
      }
    },
    {
      id: '2',
      customerName: 'Ama Serwaa',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      service: 'Electrical Installation',
      rating: 5,
      title: 'Professional and knowledgeable',
      content: 'Had my entire house rewired and the electrician did an amazing job. He was very knowledgeable and took the time to explain the electrical safety measures. The work was completed on schedule and the quality is excellent.',
      date: '2024-01-15',
      helpful: 8,
      verified: true
    },
    {
      id: '3',
      customerName: 'Kofi Mensah',
      customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      service: 'Carpentry Work',
      rating: 4,
      title: 'Great custom wardrobe',
      content: 'The wardrobe looks beautiful and fits perfectly in my bedroom. Only minor issue was a small delay in completion, but the quality made up for it. The sliding doors work smoothly.',
      date: '2024-01-12',
      helpful: 5,
      verified: true,
      images: ['wardrobe1.jpg', 'wardrobe2.jpg']
    },
    {
      id: '4',
      customerName: 'Akosua Boateng',
      customerAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop',
      service: 'AC Installation',
      rating: 5,
      title: 'Fast and efficient service',
      content: 'My AC was installed within 2 hours and has been working perfectly ever since. The technician was friendly and gave me tips on maintenance. Very happy with the service!',
      date: '2024-01-10',
      helpful: 15,
      verified: true,
      reply: {
        content: 'Thank you for your feedback! Glad to hear the AC is working great. Remember to clean the filters monthly for optimal performance.',
        date: '2024-01-11'
      }
    },
    {
      id: '5',
      customerName: 'Yaw Adjei',
      customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      service: 'Painting Services',
      rating: 3,
      title: 'Decent job, some issues',
      content: 'The painting was done reasonably well, but there were some spots that needed touch-ups. Communication could have been better. Eventually got it sorted out.',
      date: '2024-01-08',
      helpful: 3,
      verified: false
    },
    {
      id: '6',
      customerName: 'Efua Darko',
      customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      service: 'Plumbing Services',
      rating: 5,
      title: 'Saved us in an emergency!',
      content: 'Called late at night for an emergency and they responded within 30 minutes. Fixed our water heater issue quickly. Cannot thank them enough for the prompt service!',
      date: '2024-01-05',
      helpful: 22,
      verified: true
    }
  ];

  const stats = {
    averageRating: 4.5,
    totalReviews: reviews.length,
    fiveStars: reviews.filter(r => r.rating === 5).length,
    fourStars: reviews.filter(r => r.rating === 4).length,
    threeStars: reviews.filter(r => r.rating === 3).length,
    twoStars: reviews.filter(r => r.rating === 2).length,
    oneStars: reviews.filter(r => r.rating === 1).length,
    responseRate: 33,
    recommendationRate: 92
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? '#ffab00' : 'transparent'}
            style={{ color: star <= rating ? '#ffab00' : '#e7e7e8' }}
          />
        ))}
      </div>
    );
  };

  const getRatingPercentage = (count: number) => {
    return reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredReviews = reviews
    .filter(review => {
      const matchesSearch =
        review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  const handleSubmitReply = (reviewId: string) => {
    if (!replyText.trim()) return;

    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? {
            ...review,
            reply: {
              content: replyText,
              date: new Date().toISOString().split('T')[0]
            }
          }
        : review
    ));

    setReplyingTo(null);
    setReplyText('');
  };

  const toggleExpand = (id: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#696cff' }} />
          <p style={{ color: '#8592a3' }}>Loading reviews...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: '#566a7f', fontFamily: 'Crimson Text, serif' }}
          >
            Ratings & Reviews
          </h1>
          <p style={{ color: '#8592a3' }} className="mt-1">
            Manage your customer feedback and reputation
          </p>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Rating Summary Card */}
        <div
          className="bg-white rounded-xl p-6"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#fff4e5' }}
            >
              <Star size={32} fill="#ffab00" style={{ color: '#ffab00' }} />
            </div>
            <div>
              <p className="text-4xl font-bold" style={{ color: '#566a7f' }}>
                {stats.averageRating}
              </p>
              <p className="text-sm" style={{ color: '#8592a3' }}>
                out of 5 stars
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {renderStars(Math.round(stats.averageRating), 20)}
            <span className="text-sm" style={{ color: '#8592a3' }}>
              ({stats.totalReviews} reviews)
            </span>
          </div>
        </div>

        {/* Response Rate Card */}
        <div
          className="bg-white rounded-xl p-6"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#e7f6ff' }}
            >
              <MessageSquare size={32} style={{ color: '#03c3ec' }} />
            </div>
            <div>
              <p className="text-4xl font-bold" style={{ color: '#566a7f' }}>
                {stats.responseRate}%
              </p>
              <p className="text-sm" style={{ color: '#8592a3' }}>
                Response Rate
              </p>
            </div>
          </div>
          <p className="text-sm" style={{ color: '#8592a3' }}>
            <span style={{ color: '#71dd37' }}>↑ 5%</span> from last month
          </p>
        </div>

        {/* Recommendation Rate Card */}
        <div
          className="bg-white rounded-xl p-6"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#e8faef' }}
            >
              <Heart size={32} style={{ color: '#71dd37' }} />
            </div>
            <div>
              <p className="text-4xl font-bold" style={{ color: '#566a7f' }}>
                {stats.recommendationRate}%
              </p>
              <p className="text-sm" style={{ color: '#8592a3' }}>
                Would Recommend
              </p>
            </div>
          </div>
          <p className="text-sm" style={{ color: '#8592a3' }}>
            Based on customer surveys
          </p>
        </div>
      </motion.div>

      {/* Rating Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#566a7f' }}>
          Rating Distribution
        </h2>
        <div className="space-y-3">
          {[
            { stars: 5, count: stats.fiveStars },
            { stars: 4, count: stats.fourStars },
            { stars: 3, count: stats.threeStars },
            { stars: 2, count: stats.twoStars },
            { stars: 1, count: stats.oneStars }
          ].map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm font-medium" style={{ color: '#566a7f' }}>{stars}</span>
                <Star size={14} fill="#ffab00" style={{ color: '#ffab00' }} />
              </div>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e7e7e8' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getRatingPercentage(count)}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: '#ffab00' }}
                />
              </div>
              <span className="text-sm w-12 text-right" style={{ color: '#8592a3' }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#8592a3' }}
          />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{ borderColor: '#e7e7e8', fontSize: '14px' }}
          />
        </div>

        <div className="flex gap-2">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{ borderColor: '#e7e7e8', fontSize: '14px', color: '#566a7f' }}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{ borderColor: '#e7e7e8', fontSize: '14px', color: '#566a7f' }}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </motion.div>

      {/* Reviews List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {filteredReviews.length === 0 ? (
          <div
            className="bg-white rounded-xl p-8 text-center"
            style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
          >
            <Star size={48} className="mx-auto mb-4" style={{ color: '#e7e7e8' }} />
            <p style={{ color: '#8592a3' }}>No reviews found</p>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6"
              style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
            >
              {/* Review Header */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={review.customerAvatar}
                  alt={review.customerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold" style={{ color: '#566a7f' }}>
                          {review.customerName}
                        </h3>
                        {review.verified && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                            style={{ backgroundColor: '#e8faef', color: '#71dd37' }}
                          >
                            <CheckCircle2 size={12} />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: '#8592a3' }}>
                        {review.service}
                      </p>
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <p className="text-xs mt-1" style={{ color: '#8592a3' }}>
                        {formatDate(review.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h4 className="font-medium mb-2" style={{ color: '#566a7f' }}>
                  {review.title}
                </h4>
                <p
                  className={`text-sm leading-relaxed ${
                    !expandedReviews.has(review.id) && review.content.length > 200
                      ? 'line-clamp-3'
                      : ''
                  }`}
                  style={{ color: '#697a8d' }}
                >
                  {review.content}
                </p>
                {review.content.length > 200 && (
                  <button
                    onClick={() => toggleExpand(review.id)}
                    className="text-sm mt-2 flex items-center gap-1"
                    style={{ color: '#696cff' }}
                  >
                    {expandedReviews.has(review.id) ? (
                      <>Show less <ChevronUp size={14} /></>
                    ) : (
                      <>Read more <ChevronDown size={14} /></>
                    )}
                  </button>
                )}
              </div>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center"
                      style={{ backgroundColor: '#f5f5f9' }}
                    >
                      <span className="text-xs" style={{ color: '#8592a3' }}>
                        {img}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#e7e7e8' }}>
                <div className="flex items-center gap-4">
                  <button
                    className="flex items-center gap-1 text-sm transition-colors hover:opacity-80"
                    style={{ color: '#8592a3' }}
                  >
                    <ThumbsUp size={16} />
                    Helpful ({review.helpful})
                  </button>
                  {!review.reply && (
                    <button
                      onClick={() => setReplyingTo(review.id)}
                      className="flex items-center gap-1 text-sm transition-colors"
                      style={{ color: '#696cff' }}
                    >
                      <Reply size={16} />
                      Reply
                    </button>
                  )}
                </div>
                <button
                  className="flex items-center gap-1 text-sm transition-colors hover:opacity-80"
                  style={{ color: '#8592a3' }}
                >
                  <Flag size={16} />
                  Report
                </button>
              </div>

              {/* Existing Reply */}
              {review.reply && (
                <div
                  className="mt-4 p-4 rounded-lg"
                  style={{ backgroundColor: '#f5f5f9' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#696cff' }}
                    >
                      <Quote size={14} style={{ color: 'white' }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#566a7f' }}>
                        Your Response
                      </p>
                      <p className="text-xs" style={{ color: '#8592a3' }}>
                        {formatDate(review.reply.date)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: '#697a8d' }}>
                    {review.reply.content}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === review.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t"
                  style={{ borderColor: '#e7e7e8' }}
                >
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your response to this review..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: '#e7e7e8', fontSize: '14px' }}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="px-4 py-2 rounded-lg text-sm transition-colors"
                      style={{ color: '#8592a3' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmitReply(review.id)}
                      disabled={!replyText.trim()}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: replyText.trim() ? '#696cff' : '#e7e7e8',
                        color: replyText.trim() ? 'white' : '#8592a3'
                      }}
                    >
                      Post Reply
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pro Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-xl flex-shrink-0"
            style={{ backgroundColor: '#696cff15' }}
          >
            <Award size={24} style={{ color: '#696cff' }} />
          </div>
          <div>
            <h3 className="font-semibold mb-2" style={{ color: '#566a7f' }}>
              Tips to Improve Your Ratings
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#697a8d' }}>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#71dd37' }} />
                <span>Respond to all reviews within 24 hours - it shows you care</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#71dd37' }} />
                <span>Ask satisfied customers to leave a review after completed work</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#71dd37' }} />
                <span>Address negative feedback professionally and offer solutions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#71dd37' }} />
                <span>Maintain consistent quality to build a strong reputation</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RatingsReviews;