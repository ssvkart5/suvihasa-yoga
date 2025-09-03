require('dotenv').config(); // Load .env variables

const requiredEnvVars = ['MONGO_URI', 'PORT'];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Warning: Missing required environment variable: ${key}`);
  }
});

module.exports = {
  mongoUri: process.env.MONGO_URI || process.env.DB_URL,
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Optional: Add more env vars here as needed
  jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
  blobStorageUrl: process.env.BLOB_STORAGE_URL || '',
  cosmosDbName: process.env.COSMOS_DB_NAME || 'suvihasa-yoga',
};
