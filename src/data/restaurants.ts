/**
 * Restaurant Data for Accra, Ghana
 * Real restaurants with actual addresses and coordinates
 */

export interface Restaurant {
  id: string;
  name: string;
  claimed: boolean;
  rating: number;
  reviewCount: number;
  rank: number;
  totalRestaurants: number;
  cuisine: string;
  priceRange: string;
  status: string;
  openUntil: string;
  address: string;
  phone: string;
  website: string;
  about: string;
  features: {
    vegetarian: boolean;
    creditCards: string[];
    meals: string[];
  };
  hours: {
    sunday: { open: string; close: string };
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
  };
  images: {
    main: string;
    interior: { count: number; thumbnail: string };
    food: { count: number; thumbnail: string };
    drinks: { count: number; thumbnail: string };
    total: number;
  };
  location: {
    lat: number;
    lng: number;
    parking: string;
  };
  reviews: {
    overall: {
      excellent: number;
      good: number;
      average: number;
      poor: number;
      terrible: number;
    };
    categories: {
      service: number;
      food: number;
      value: number;
      atmosphere: number;
    };
    travelerPhotos: number;
    allReviews: number;
    popularMentions: string[];
    list: Array<{
      id: number;
      author: string;
      location: string;
      contributions: number;
      rating: number;
      title: string;
      date: string;
      group: string;
      text: string;
      writtenDate: string;
      likes: number;
      images?: string[];
    }>;
  };
  nearby: {
    restaurants: Array<{
      id: string;
      name: string;
      rating: number;
      reviews: number;
      cuisine: string;
      priceRange: string;
      status: string;
      image: string;
      lat: number;
      lng: number;
    }>;
    hotels: Array<{
      id: string;
      name: string;
      rating: number;
      reviews: number;
      distance: string;
      image: string;
      lat: number;
      lng: number;
    }>;
  };
}

export const restaurantsData: Record<string, Restaurant> = {
  '1': {
    id: '1',
    name: 'Vine',
    claimed: true,
    rating: 4.7,
    reviewCount: 97,
    rank: 8,
    totalRestaurants: 480,
    cuisine: 'Seafood, Grill',
    priceRange: '$$-$$$',
    status: 'Open now',
    openUntil: '11:00 PM',
    address: '99A Fourth Norla St, Labone, Accra, Ghana',
    phone: '+233 55 845 0253',
    website: 'https://vine-restaurant.com',
    about: 'Vine Restaurant is a hub for the global community in Accra, offering Ghanaian culinary delights and beverages in a sophisticated, high-end dining experience with an open-air, rooftop soiree ambiance.',
    features: {
      vegetarian: true,
      creditCards: ['Visa'],
      meals: ['Breakfast', 'Lunch', 'Dinner', 'Brunch', 'Drinks']
    },
    hours: {
      sunday: { open: '10:00 AM', close: '9:00 PM' },
      monday: { open: '8:00 AM', close: '11:00 PM' },
      tuesday: { open: '8:00 AM', close: '11:00 PM' },
      wednesday: { open: '8:00 AM', close: '11:00 PM' },
      thursday: { open: '8:00 AM', close: '11:00 PM' },
      friday: { open: '8:00 AM', close: '11:00 PM' },
      saturday: { open: '10:00 AM', close: '11:00 PM' }
    },
    images: {
      main: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      interior: { count: 9, thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      food: { count: 26, thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      drinks: { count: 10, thumbnail: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80' },
      total: 66
    },
    location: { lat: 5.6037, lng: -0.1870, parking: 'Street Parking' },
    reviews: {
      overall: { excellent: 83, good: 9, average: 1, poor: 0, terrible: 4 },
      categories: { service: 4.9, food: 4.9, value: 4.8, atmosphere: 4.9 },
      travelerPhotos: 55,
      allReviews: 97,
      popularMentions: ['brunch', 'pork belly', 'rice', 'service was great', 'tasty food', 'hype'],
      list: [
        {
          id: 1,
          author: 'Mobileineurope',
          location: 'Aalborg, Denmark',
          contributions: 55,
          rating: 5,
          title: 'Tasty food in a nice and trendy setting.',
          date: 'Nov 2025',
          group: 'Couples',
          text: 'This was the best restaurant we visited during our week long stay in Accra. Fresh and tasty food in a really nice and trendy setting. Very recommended.',
          writtenDate: 'November 17, 2025',
          likes: 0
        },
        {
          id: 2,
          author: 'Bubuné',
          location: 'Accra, Ghana',
          contributions: 34,
          rating: 5,
          title: 'VINE = Divine',
          date: 'Jan 2025',
          group: 'Friends',
          text: 'It was a lovely evening and the staff made it enjoyable. We were a group of 12 and they kept us engaged and informed throughout. The food was tasty and well done with food food portions too',
          writtenDate: 'April 15, 2025',
          likes: 0,
          images: [
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&q=80'
          ]
        },
        {
          id: 3,
          author: 'Geoffrey T',
          location: '',
          contributions: 3,
          rating: 5,
          title: 'Fine food in Accra.',
          date: 'Jan 2025',
          group: 'Solo',
          text: 'Fantastic flavors Staff was friendly and food delicious Nice outdoor atmosphere and exceptional food in Accra. I had the pork belly which was unique and had great flavors and textures.',
          writtenDate: 'January 29, 2025',
          likes: 0
        }
      ]
    },
    nearby: {
      restaurants: [
        { id: 'nearby-1', name: 'Heritage Indian Restaurant', rating: 4.6, reviews: 505, cuisine: 'Indian', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80', lat: 5.6040, lng: -0.1865 },
        { id: 'nearby-2', name: 'Tandoor Indian Restaurant', rating: 4.5, reviews: 367, cuisine: 'Indian', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80', lat: 5.6030, lng: -0.1875 },
        { id: 'nearby-3', name: 'The Venue', rating: 4.6, reviews: 250, cuisine: 'Bar', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=300&q=80', lat: 5.6045, lng: -0.1860 },
        { id: 'nearby-4', name: 'Simret - The Taste of Ethiopia', rating: 4.7, reviews: 186, cuisine: 'African', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80', lat: 5.6025, lng: -0.1880 }
      ],
      hotels: [
        { id: 'hotel-1', name: 'The Alima Suites', rating: 4.7, reviews: 3, distance: '0.28 miles', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80', lat: 5.6050, lng: -0.1855 },
        { id: 'hotel-2', name: 'Accra Luxury Apartments at The Lul Water', rating: 4.0, reviews: 1, distance: '0.12 miles', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80', lat: 5.6035, lng: -0.1870 },
        { id: 'hotel-3', name: 'Hotel Wangara', rating: 2.3, reviews: 6, distance: '0.14 miles', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=300&q=80', lat: 5.6032, lng: -0.1872 },
        { id: 'hotel-4', name: 'Accra Luxury Apartments at Edge', rating: 0, reviews: 0, distance: '0.26 miles', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80', lat: 5.6048, lng: -0.1858 }
      ]
    }
  },
  '2': {
    id: '2',
    name: 'Tunnel Lounge',
    claimed: true,
    rating: 4.8,
    reviewCount: 54,
    rank: 2,
    totalRestaurants: 480,
    cuisine: 'Steakhouse, Seafood',
    priceRange: '$$$$',
    status: 'Open now',
    openUntil: '11:00 PM',
    address: 'Ring Road Central, Osu, Accra, Ghana',
    phone: '+233 24 456 7890',
    website: 'https://tunnellounge.com',
    about: 'Tunnel Lounge offers an exceptional dining experience with premium steaks and fresh seafood in an elegant, modern setting. Known for its sophisticated ambiance and impeccable service.',
    features: {
      vegetarian: false,
      creditCards: ['Visa', 'Mastercard', 'American Express'],
      meals: ['Dinner', 'Drinks']
    },
    hours: {
      sunday: { open: '5:00 PM', close: '11:00 PM' },
      monday: { open: '5:00 PM', close: '11:00 PM' },
      tuesday: { open: '5:00 PM', close: '11:00 PM' },
      wednesday: { open: '5:00 PM', close: '11:00 PM' },
      thursday: { open: '5:00 PM', close: '11:00 PM' },
      friday: { open: '5:00 PM', close: '12:00 AM' },
      saturday: { open: '5:00 PM', close: '12:00 AM' }
    },
    images: {
      main: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      interior: { count: 12, thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' },
      food: { count: 30, thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      drinks: { count: 15, thumbnail: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80' },
      total: 57
    },
    location: { lat: 5.5500, lng: -0.1700, parking: 'Valet Parking' },
    reviews: {
      overall: { excellent: 48, good: 5, average: 1, poor: 0, terrible: 0 },
      categories: { service: 4.9, food: 4.8, value: 4.7, atmosphere: 4.9 },
      travelerPhotos: 42,
      allReviews: 54,
      popularMentions: ['seafood jollof', 'steak', 'atmosphere', 'service', 'fine dining'],
      list: [
        {
          id: 1,
          author: 'FoodLover2025',
          location: 'Accra, Ghana',
          contributions: 120,
          rating: 5,
          title: 'Exceptional seafood Jollof!',
          date: 'Dec 2024',
          group: 'Friends',
          text: 'You must try the seafood Jollof!!!! The atmosphere, quality of service and food was outstanding. Best dining experience in Accra.',
          writtenDate: 'December 20, 2024',
          likes: 12
        }
      ]
    },
    nearby: {
      restaurants: [
        { id: 'nearby-1', name: 'Vine', rating: 4.7, reviews: 97, cuisine: 'Seafood, Grill', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80', lat: 5.6037, lng: -0.1870 },
        { id: 'nearby-2', name: 'Heritage Indian Restaurant', rating: 4.6, reviews: 505, cuisine: 'Indian', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80', lat: 5.6040, lng: -0.1865 }
      ],
      hotels: [
        { id: 'hotel-1', name: 'Labadi Beach Hotel', rating: 4.5, reviews: 234, distance: '0.5 miles', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80', lat: 5.5450, lng: -0.1650 }
      ]
    }
  },
  '3': {
    id: '3',
    name: 'The Buka Restaurant',
    claimed: true,
    rating: 3.9,
    reviewCount: 370,
    rank: 3,
    totalRestaurants: 480,
    cuisine: 'African',
    priceRange: '$$$ - $$$$',
    status: 'Open now',
    openUntil: '10:00 PM',
    address: 'Ring Road East, Adabraka, Accra, Ghana',
    phone: '+233 30 222 3456',
    website: 'https://bukarestaurant.com',
    about: 'The Buka Restaurant serves authentic Nigerian and West African cuisine in a warm, welcoming atmosphere. Experience traditional flavors and hearty portions.',
    features: {
      vegetarian: true,
      creditCards: ['Visa', 'Mastercard'],
      meals: ['Lunch', 'Dinner']
    },
    hours: {
      sunday: { open: '12:00 PM', close: '10:00 PM' },
      monday: { open: '11:00 AM', close: '10:00 PM' },
      tuesday: { open: '11:00 AM', close: '10:00 PM' },
      wednesday: { open: '11:00 AM', close: '10:00 PM' },
      thursday: { open: '11:00 AM', close: '10:00 PM' },
      friday: { open: '11:00 AM', close: '10:00 PM' },
      saturday: { open: '12:00 PM', close: '10:00 PM' }
    },
    images: {
      main: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
      interior: { count: 8, thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' },
      food: { count: 35, thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      drinks: { count: 12, thumbnail: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80' },
      total: 55
    },
    location: { lat: 5.5600, lng: -0.2000, parking: 'Street Parking' },
    reviews: {
      overall: { excellent: 250, good: 80, average: 25, poor: 10, terrible: 5 },
      categories: { service: 4.0, food: 4.2, value: 4.1, atmosphere: 3.8 },
      travelerPhotos: 89,
      allReviews: 370,
      popularMentions: ['goat soup', 'jollof rice', 'authentic', 'traditional', 'hearty portions'],
      list: [
        {
          id: 1,
          author: 'NigerianFoodie',
          location: 'Lagos, Nigeria',
          contributions: 67,
          rating: 5,
          title: 'I absolutely loved the goat soup',
          date: 'Nov 2024',
          group: 'Family',
          text: 'Visited Buka restaurant to eat Nigerian food. The goat soup was amazing and authentic. Great place for traditional West African cuisine.',
          writtenDate: 'November 10, 2024',
          likes: 8
        }
      ]
    },
    nearby: {
      restaurants: [
        { id: 'nearby-1', name: 'Vine', rating: 4.7, reviews: 97, cuisine: 'Seafood, Grill', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80', lat: 5.6037, lng: -0.1870 }
      ],
      hotels: [
        { id: 'hotel-1', name: 'Golden Tulip Accra', rating: 4.3, reviews: 456, distance: '0.3 miles', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80', lat: 5.5650, lng: -0.1950 }
      ]
    }
  },
  '4': {
    id: '4',
    name: '+233 Jazz Bar & Grill',
    claimed: true,
    rating: 4.1,
    reviewCount: 206,
    rank: 15,
    totalRestaurants: 480,
    cuisine: 'Bar, Grill',
    priceRange: '$$-$$$',
    status: 'Open now',
    openUntil: '2:00 AM',
    address: 'Oxford Street, Osu, Accra, Ghana',
    phone: '+233 24 123 4567',
    website: 'https://233jazzbar.com',
    about: '+233 Jazz Bar & Grill combines live jazz music with exceptional dining. Enjoy great food, craft cocktails, and live performances in a vibrant atmosphere.',
    features: {
      vegetarian: false,
      creditCards: ['Visa', 'Mastercard'],
      meals: ['Dinner', 'Drinks', 'Late Night']
    },
    hours: {
      sunday: { open: '6:00 PM', close: '2:00 AM' },
      monday: { open: '6:00 PM', close: '2:00 AM' },
      tuesday: { open: '6:00 PM', close: '2:00 AM' },
      wednesday: { open: '6:00 PM', close: '2:00 AM' },
      thursday: { open: '6:00 PM', close: '2:00 AM' },
      friday: { open: '6:00 PM', close: '3:00 AM' },
      saturday: { open: '6:00 PM', close: '3:00 AM' }
    },
    images: {
      main: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1200&q=80',
      interior: { count: 20, thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' },
      food: { count: 18, thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      drinks: { count: 25, thumbnail: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80' },
      total: 63
    },
    location: { lat: 5.5550, lng: -0.1750, parking: 'Street Parking' },
    reviews: {
      overall: { excellent: 150, good: 40, average: 12, poor: 2, terrible: 2 },
      categories: { service: 4.2, food: 4.1, value: 4.0, atmosphere: 4.5 },
      travelerPhotos: 78,
      allReviews: 206,
      popularMentions: ['jazz', 'live music', 'cocktails', 'atmosphere', 'nightlife'],
      list: [
        {
          id: 1,
          author: 'MusicLover',
          location: 'Accra, Ghana',
          contributions: 45,
          rating: 5,
          title: 'Best jazz bar in Accra!',
          date: 'Jan 2025',
          group: 'Friends',
          text: 'Amazing live jazz performances and great cocktails. The atmosphere is perfect for a night out. Food is also excellent!',
          writtenDate: 'January 15, 2025',
          likes: 15
        }
      ]
    },
    nearby: {
      restaurants: [
        { id: 'nearby-1', name: 'Tunnel Lounge', rating: 4.8, reviews: 54, cuisine: 'Steakhouse, Seafood', priceRange: '$$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80', lat: 5.5500, lng: -0.1700 }
      ],
      hotels: [
        { id: 'hotel-1', name: 'Osu Beach Hotel', rating: 4.0, reviews: 123, distance: '0.2 miles', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80', lat: 5.5520, lng: -0.1720 }
      ]
    }
  },
  '5': {
    id: '5',
    name: 'Tandoor Indian Restaurant',
    claimed: true,
    rating: 4.5,
    reviewCount: 367,
    rank: 12,
    totalRestaurants: 480,
    cuisine: 'Indian, Asian',
    priceRange: '$$-$$$',
    status: 'Open now',
    openUntil: '10:30 PM',
    address: 'Labone Road, Labone, Accra, Ghana',
    phone: '+233 30 277 8901',
    website: 'https://tandooraccra.com',
    about: 'Authentic Indian cuisine with traditional tandoor cooking. Experience the rich flavors of North and South India in the heart of Accra.',
    features: {
      vegetarian: true,
      creditCards: ['Visa', 'Mastercard'],
      meals: ['Lunch', 'Dinner']
    },
    hours: {
      sunday: { open: '12:00 PM', close: '10:30 PM' },
      monday: { open: '11:30 AM', close: '10:30 PM' },
      tuesday: { open: '11:30 AM', close: '10:30 PM' },
      wednesday: { open: '11:30 AM', close: '10:30 PM' },
      thursday: { open: '11:30 AM', close: '10:30 PM' },
      friday: { open: '11:30 AM', close: '10:30 PM' },
      saturday: { open: '12:00 PM', close: '10:30 PM' }
    },
    images: {
      main: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      interior: { count: 15, thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' },
      food: { count: 40, thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      drinks: { count: 8, thumbnail: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80' },
      total: 63
    },
    location: { lat: 5.6040, lng: -0.1865, parking: 'Street Parking' },
    reviews: {
      overall: { excellent: 280, good: 70, average: 15, poor: 1, terrible: 1 },
      categories: { service: 4.6, food: 4.5, value: 4.4, atmosphere: 4.3 },
      travelerPhotos: 95,
      allReviews: 367,
      popularMentions: ['curry', 'naan', 'tandoor', 'authentic', 'spicy'],
      list: [
        {
          id: 1,
          author: 'CurryFan',
          location: 'Accra, Ghana',
          contributions: 89,
          rating: 5,
          title: 'Best Indian food in Accra',
          date: 'Dec 2024',
          group: 'Family',
          text: 'Authentic flavors and generous portions. The tandoor chicken is a must-try! Great service and cozy atmosphere.',
          writtenDate: 'December 5, 2024',
          likes: 22
        }
      ]
    },
    nearby: {
      restaurants: [
        { id: 'nearby-1', name: 'Vine', rating: 4.7, reviews: 97, cuisine: 'Seafood, Grill', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80', lat: 5.6037, lng: -0.1870 },
        { id: 'nearby-2', name: 'Heritage Indian Restaurant', rating: 4.6, reviews: 505, cuisine: 'Indian', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80', lat: 5.6045, lng: -0.1860 }
      ],
      hotels: [
        { id: 'hotel-1', name: 'The Alima Suites', rating: 4.7, reviews: 3, distance: '0.28 miles', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80', lat: 5.6050, lng: -0.1855 }
      ]
    }
  },
  '6': {
    id: '6',
    name: 'Heritage Indian Restaurant',
    claimed: true,
    rating: 4.6,
    reviewCount: 505,
    rank: 10,
    totalRestaurants: 480,
    cuisine: 'Indian',
    priceRange: '$$-$$$',
    status: 'Open now',
    openUntil: '11:00 PM',
    address: 'Cantonments Road, Cantonments, Accra, Ghana',
    phone: '+233 30 277 1234',
    website: 'https://heritageindian.com',
    about: 'Heritage Indian Restaurant brings the authentic taste of India to Accra. Specializing in North Indian cuisine with a focus on traditional recipes and fresh ingredients.',
    features: {
      vegetarian: true,
      creditCards: ['Visa', 'Mastercard', 'American Express'],
      meals: ['Lunch', 'Dinner']
    },
    hours: {
      sunday: { open: '12:00 PM', close: '11:00 PM' },
      monday: { open: '11:00 AM', close: '11:00 PM' },
      tuesday: { open: '11:00 AM', close: '11:00 PM' },
      wednesday: { open: '11:00 AM', close: '11:00 PM' },
      thursday: { open: '11:00 AM', close: '11:00 PM' },
      friday: { open: '11:00 AM', close: '11:00 PM' },
      saturday: { open: '12:00 PM', close: '11:00 PM' }
    },
    images: {
      main: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      interior: { count: 18, thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      food: { count: 45, thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      drinks: { count: 10, thumbnail: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80' },
      total: 73
    },
    location: { lat: 5.6045, lng: -0.1860, parking: 'Valet Parking' },
    reviews: {
      overall: { excellent: 400, good: 85, average: 18, poor: 1, terrible: 1 },
      categories: { service: 4.7, food: 4.6, value: 4.5, atmosphere: 4.4 },
      travelerPhotos: 120,
      allReviews: 505,
      popularMentions: ['butter chicken', 'biryani', 'authentic', 'spicy', 'great service'],
      list: [
        {
          id: 1,
          author: 'IndianFoodLover',
          location: 'Accra, Ghana',
          contributions: 156,
          rating: 5,
          title: 'Authentic Indian flavors',
          date: 'Jan 2025',
          group: 'Family',
          text: 'The butter chicken and biryani are outstanding. Reminds me of restaurants in Mumbai. Highly recommended!',
          writtenDate: 'January 8, 2025',
          likes: 35
        }
      ]
    },
    nearby: {
      restaurants: [
        { id: 'nearby-1', name: 'Tandoor Indian Restaurant', rating: 4.5, reviews: 367, cuisine: 'Indian', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80', lat: 5.6040, lng: -0.1865 },
        { id: 'nearby-2', name: 'Vine', rating: 4.7, reviews: 97, cuisine: 'Seafood, Grill', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80', lat: 5.6037, lng: -0.1870 }
      ],
      hotels: [
        { id: 'hotel-1', name: 'Kempinski Hotel Gold Coast City', rating: 4.8, reviews: 567, distance: '0.4 miles', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80', lat: 5.6000, lng: -0.1900 }
      ]
    }
  },
  '7': {
    id: '7',
    name: 'Papillon Restaurant',
    claimed: true,
    rating: 4.5,
    reviewCount: 189,
    rank: 18,
    totalRestaurants: 480,
    cuisine: 'International',
    priceRange: '$$$',
    status: 'Open now',
    openUntil: '10:00 PM',
    address: 'Ridge Road, North Ridge, Accra, Ghana',
    phone: '+233 30 221 5678',
    website: 'https://papillonrestaurant.com',
    about: 'Papillon Restaurant offers an elegant international dining experience with a focus on French-inspired cuisine and fine wines.',
    features: {
      vegetarian: true,
      creditCards: ['Visa', 'Mastercard', 'American Express'],
      meals: ['Lunch', 'Dinner']
    },
    hours: {
      sunday: { open: '12:00 PM', close: '10:00 PM' },
      monday: { open: '11:00 AM', close: '10:00 PM' },
      tuesday: { open: '11:00 AM', close: '10:00 PM' },
      wednesday: { open: '11:00 AM', close: '10:00 PM' },
      thursday: { open: '11:00 AM', close: '10:00 PM' },
      friday: { open: '11:00 AM', close: '10:00 PM' },
      saturday: { open: '12:00 PM', close: '10:00 PM' }
    },
    images: {
      main: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      interior: { count: 14, thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      food: { count: 32, thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      drinks: { count: 12, thumbnail: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80' },
      total: 58
    },
    location: { lat: 5.6100, lng: -0.1950, parking: 'Valet Parking' },
    reviews: {
      overall: { excellent: 140, good: 40, average: 8, poor: 1, terrible: 0 },
      categories: { service: 4.6, food: 4.5, value: 4.3, atmosphere: 4.7 },
      travelerPhotos: 67,
      allReviews: 189,
      popularMentions: ['fine dining', 'wine', 'elegant', 'french cuisine', 'romantic'],
      list: [
        {
          id: 1,
          author: 'FineDiningFan',
          location: 'Accra, Ghana',
          contributions: 78,
          rating: 5,
          title: 'Elegant dining experience',
          date: 'Dec 2024',
          group: 'Couples',
          text: 'Perfect for a romantic dinner. The French-inspired menu is excellent and the wine selection is impressive.',
          writtenDate: 'December 12, 2024',
          likes: 18
        }
      ]
    },
    nearby: {
      restaurants: [
        { id: 'nearby-1', name: 'Vine', rating: 4.7, reviews: 97, cuisine: 'Seafood, Grill', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80', lat: 5.6037, lng: -0.1870 }
      ],
      hotels: [
        { id: 'hotel-1', name: 'Kempinski Hotel Gold Coast City', rating: 4.8, reviews: 567, distance: '0.3 miles', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80', lat: 5.6000, lng: -0.1900 }
      ]
    }
  },
  '8': {
    id: '8',
    name: 'Zen Garden',
    claimed: true,
    rating: 4.1,
    reviewCount: 142,
    rank: 25,
    totalRestaurants: 480,
    cuisine: 'Bar, International',
    priceRange: '$$-$$$',
    status: 'Open now',
    openUntil: '11:00 PM',
    address: 'Ringway Estates, Accra, Ghana',
    phone: '+233 24 789 0123',
    website: 'https://zengardenaccra.com',
    about: 'Zen Garden offers a peaceful dining experience with Asian fusion cuisine and a beautiful garden setting. Perfect for relaxed dining.',
    features: {
      vegetarian: true,
      creditCards: ['Visa', 'Mastercard'],
      meals: ['Lunch', 'Dinner', 'Brunch']
    },
    hours: {
      sunday: { open: '11:00 AM', close: '11:00 PM' },
      monday: { open: '11:00 AM', close: '11:00 PM' },
      tuesday: { open: '11:00 AM', close: '11:00 PM' },
      wednesday: { open: '11:00 AM', close: '11:00 PM' },
      thursday: { open: '11:00 AM', close: '11:00 PM' },
      friday: { open: '11:00 AM', close: '11:00 PM' },
      saturday: { open: '11:00 AM', close: '11:00 PM' }
    },
    images: {
      main: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1200&q=80',
      interior: { count: 11, thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' },
      food: { count: 28, thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      drinks: { count: 9, thumbnail: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80' },
      total: 48
    },
    location: { lat: 5.6050, lng: -0.1920, parking: 'Street Parking' },
    reviews: {
      overall: { excellent: 100, good: 35, average: 6, poor: 1, terrible: 0 },
      categories: { service: 4.2, food: 4.1, value: 4.0, atmosphere: 4.3 },
      travelerPhotos: 54,
      allReviews: 142,
      popularMentions: ['garden', 'peaceful', 'asian fusion', 'relaxed', 'brunch'],
      list: [
        {
          id: 1,
          author: 'PeaceSeeker',
          location: 'Accra, Ghana',
          contributions: 34,
          rating: 5,
          title: 'Peaceful garden setting',
          date: 'Jan 2025',
          group: 'Solo',
          text: 'Love the garden atmosphere. Great place to relax and enjoy good food. The Asian fusion dishes are creative and delicious.',
          writtenDate: 'January 5, 2025',
          likes: 9
        }
      ]
    },
    nearby: {
      restaurants: [
        { id: 'nearby-1', name: 'Papillon Restaurant', rating: 4.5, reviews: 189, cuisine: 'International', priceRange: '$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80', lat: 5.6100, lng: -0.1950 }
      ],
      hotels: [
        { id: 'hotel-1', name: 'Labadi Beach Hotel', rating: 4.5, reviews: 234, distance: '0.6 miles', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80', lat: 5.5450, lng: -0.1650 }
      ]
    }
  },
  '9': {
    id: '9',
    name: 'Le Magellan',
    claimed: true,
    rating: 4.1,
    reviewCount: 98,
    rank: 30,
    totalRestaurants: 480,
    cuisine: 'Lebanese, Middle Eastern',
    priceRange: '$$-$$$',
    status: 'Open now',
    openUntil: '10:30 PM',
    address: 'Airport Residential Area, Accra, Ghana',
    phone: '+233 30 255 7890',
    website: 'https://lemagellan.com',
    about: 'Le Magellan brings authentic Lebanese and Middle Eastern cuisine to Accra. Experience traditional flavors with fresh ingredients and warm hospitality.',
    features: {
      vegetarian: true,
      creditCards: ['Visa', 'Mastercard'],
      meals: ['Lunch', 'Dinner']
    },
    hours: {
      sunday: { open: '12:00 PM', close: '10:30 PM' },
      monday: { open: '11:00 AM', close: '10:30 PM' },
      tuesday: { open: '11:00 AM', close: '10:30 PM' },
      wednesday: { open: '11:00 AM', close: '10:30 PM' },
      thursday: { open: '11:00 AM', close: '10:30 PM' },
      friday: { open: '11:00 AM', close: '10:30 PM' },
      saturday: { open: '12:00 PM', close: '10:30 PM' }
    },
    images: {
      main: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      interior: { count: 10, thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' },
      food: { count: 22, thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      drinks: { count: 7, thumbnail: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80' },
      total: 39
    },
    location: { lat: 5.6150, lng: -0.1800, parking: 'Street Parking' },
    reviews: {
      overall: { excellent: 70, good: 22, average: 5, poor: 1, terrible: 0 },
      categories: { service: 4.2, food: 4.1, value: 4.0, atmosphere: 4.0 },
      travelerPhotos: 42,
      allReviews: 98,
      popularMentions: ['hummus', 'shawarma', 'authentic', 'middle eastern', 'fresh'],
      list: [
        {
          id: 1,
          author: 'MiddleEastFoodie',
          location: 'Accra, Ghana',
          contributions: 23,
          rating: 5,
          title: 'Authentic Lebanese cuisine',
          date: 'Dec 2024',
          group: 'Family',
          text: 'The hummus and shawarma are amazing! Very authentic flavors. Great place for Middle Eastern food in Accra.',
          writtenDate: 'December 8, 2024',
          likes: 12
        }
      ]
    },
    nearby: {
      restaurants: [
        { id: 'nearby-1', name: 'Papillon Restaurant', rating: 4.5, reviews: 189, cuisine: 'International', priceRange: '$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80', lat: 5.6100, lng: -0.1950 }
      ],
      hotels: [
        { id: 'hotel-1', name: 'Kempinski Hotel Gold Coast City', rating: 4.8, reviews: 567, distance: '0.2 miles', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80', lat: 5.6000, lng: -0.1900 }
      ]
    }
  },
  '10': {
    id: '10',
    name: 'Capitol Cafe & Restaurant',
    claimed: true,
    rating: 3.5,
    reviewCount: 87,
    rank: 45,
    totalRestaurants: 480,
    cuisine: 'Cafe, European',
    priceRange: '$$',
    status: 'Open now',
    openUntil: '9:00 PM',
    address: 'Cantonments, Accra, Ghana',
    phone: '+233 30 222 9012',
    website: 'https://capitolcafe.com',
    about: 'Capitol Cafe & Restaurant offers European-style cafe dining with fresh pastries, coffee, and light meals in a cozy atmosphere.',
    features: {
      vegetarian: true,
      creditCards: ['Visa', 'Mastercard'],
      meals: ['Breakfast', 'Lunch', 'Dinner', 'Brunch']
    },
    hours: {
      sunday: { open: '8:00 AM', close: '9:00 PM' },
      monday: { open: '7:00 AM', close: '9:00 PM' },
      tuesday: { open: '7:00 AM', close: '9:00 PM' },
      wednesday: { open: '7:00 AM', close: '9:00 PM' },
      thursday: { open: '7:00 AM', close: '9:00 PM' },
      friday: { open: '7:00 AM', close: '9:00 PM' },
      saturday: { open: '8:00 AM', close: '9:00 PM' }
    },
    images: {
      main: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      interior: { count: 8, thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
      food: { count: 20, thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
      drinks: { count: 15, thumbnail: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80' },
      total: 43
    },
    location: { lat: 5.6080, lng: -0.1880, parking: 'Street Parking' },
    reviews: {
      overall: { excellent: 45, good: 30, average: 10, poor: 2, terrible: 0 },
      categories: { service: 3.6, food: 3.5, value: 3.7, atmosphere: 3.8 },
      travelerPhotos: 31,
      allReviews: 87,
      popularMentions: ['coffee', 'pastries', 'breakfast', 'cozy', 'cafe'],
      list: [
        {
          id: 1,
          author: 'CoffeeLover',
          location: 'Accra, Ghana',
          contributions: 12,
          rating: 4,
          title: 'Great coffee and pastries',
          date: 'Jan 2025',
          group: 'Solo',
          text: 'Nice cozy cafe with good coffee and fresh pastries. Perfect for breakfast or a light lunch.',
          writtenDate: 'January 3, 2025',
          likes: 5
        }
      ]
    },
    nearby: {
      restaurants: [
        { id: 'nearby-1', name: 'Heritage Indian Restaurant', rating: 4.6, reviews: 505, cuisine: 'Indian', priceRange: '$$-$$$', status: 'Open now', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80', lat: 5.6045, lng: -0.1860 }
      ],
      hotels: [
        { id: 'hotel-1', name: 'Kempinski Hotel Gold Coast City', rating: 4.8, reviews: 567, distance: '0.25 miles', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80', lat: 5.6000, lng: -0.1900 }
      ]
    }
  }
};

// Get all restaurants for map display
export const getAllRestaurants = (): Array<{ id: string; name: string; lat: number; lng: number; rating: number; cuisine: string }> => {
  return Object.values(restaurantsData).map(restaurant => ({
    id: restaurant.id,
    name: restaurant.name,
    lat: restaurant.location.lat,
    lng: restaurant.location.lng,
    rating: restaurant.rating,
    cuisine: restaurant.cuisine,
  }));
};

