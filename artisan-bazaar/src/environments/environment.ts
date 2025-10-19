export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  baseUrl: 'http://localhost:4201',
  backendUrl: 'http://localhost:8000',
  storageUrl: 'http://localhost:8000/storage',

  // API Endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      verifyEmail: '/auth/verify-email',
      logout: '/auth/logout'
    },
    users: {
      list: '/users',
      profile: '/user/profile',
      update: '/user/profile'
    },
    products: {
      list: '/products',
      show: '/products',
      create: '/products',
      update: '/products',
      delete: '/products',
      reviews: '/products/{id}/reviews'
    },
    orders: {
      list: '/orders',
      create: '/orders',
      show: '/orders',
      update: '/orders'
    },
    upload: {
      image: '/upload',
      profileImage: '/upload/profile-image'
    },
    exchangeRates: '/exchange-rates'
  },

  // App Configuration
  app: {
    name: 'Artisan Bazaar',
    version: '1.0.0',
    defaultLanguage: 'en',
    supportedLanguages: [
      'en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'hi', 'ar'
    ],
    itemsPerPage: 12,
    maxFileSize: 2048, // 2MB in KB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
    sessionTimeout: 20 * 60 * 1000, // 20 minutes in milliseconds
    autoSaveInterval: 30 * 1000 // 30 seconds
  },

  // Feature Flags
  features: {
    emailVerification: true,
    multiLanguage: true,
    fileUpload: true,
    orderTracking: true,
    reviews: true,
    messaging: true,
    analytics: true,
    paymentGateway: false, // To be implemented
    notifications: true
  },

  // Security Configuration
  security: {
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  },

  // Development Settings
  debug: {
    enableLogging: true,
    enableApiLogging: true,
    enableErrorReporting: true,
    mockData: false
  }
};
