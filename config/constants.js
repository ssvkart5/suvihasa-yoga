// App-wide constants

module.exports = {
  APP_NAME: 'Suvihasa Yoga',
  PORT: process.env.PORT || 8080,

  // MongoDB
  DB: {
    URI: process.env.MONGO_URI || process.env.DB_URL,
    OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    },
  },

  // User roles
  ROLES: {
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    STUDENT: 'student',
  },

  // Class scheduling
  CLASS: {
    MAX_CAPACITY: 30,
    DEFAULT_DURATION_MIN: 60,
  },

  // Media
  MEDIA: {
    MAX_FILE_SIZE_MB: 10,
    SUPPORTED_TYPES: ['image/jpeg', 'image/png', 'video/mp4'],
  },

  // Security
  AUTH: {
    TOKEN_EXPIRY: '2h',
    SALT_ROUNDS: 10,
  },
};
