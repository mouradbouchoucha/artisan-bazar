export const environment = {
  production: true,
  apiUrl: 'https://api.artisanbazaar.com/api',
  baseUrl: 'https://artisanbazaar.com',
  backendUrl: 'https://api.artisanbazaar.com',
  storageUrl: 'https://api.artisanbazaar.com/storage',

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
    sessionTimeout: 30 * 60 * 1000, // 30 minutes in production
    autoSaveInterval: 60 * 1000 // 60 seconds in production
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
    paymentGateway: true, // Enable in production
    notifications: true,
    reCaptcha: true, // Enable in production
    ssl: true
  },

  // Security Configuration
  security: {
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxLoginAttempts: 3, // Stricter in production
    lockoutDuration: 30 * 60 * 1000, // 30 minutes in production
    csrfProtection: true,
    httpsOnly: true,
    secureHeaders: true
  },

  // Production Settings
  debug: {
    enableLogging: false, // Disable console logging in production
    enableApiLogging: true, // Keep API logging for monitoring
    enableErrorReporting: true,
    mockData: false
  },

  // Performance Settings
  performance: {
    enableCaching: true,
    cacheExpiry: 5 * 60 * 1000, // 5 minutes
    enableCompression: true,
    enableMinification: true,
    enableLazyLoading: true
  },

  // Monitoring & Analytics
  monitoring: {
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    enableUserAnalytics: true,
    errorReportingUrl: 'https://errors.artisanbazaar.com/api/report',
    analyticsId: 'GA-XXXXXXXXX' // Replace with actual Google Analytics ID
  },

  // Third-party Services
  services: {
    emailService: 'smtp', // or 'sendgrid', 'mailgun', etc.
    paymentGateway: 'stripe', // or 'paypal', 'square', etc.
    storageService: 's3', // or 'cloudinary', 'azure', etc.
    cdnUrl: 'https://cdn.artisanbazaar.com'
  }
};
