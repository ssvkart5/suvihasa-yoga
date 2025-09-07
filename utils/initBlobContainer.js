// initBlobContainer.js
require('dotenv').config({ path: '../.env' }); // adjust path if needed

const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'media';

async function createContainer() {
  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error('Azure Storage connection string not found in environment variables');
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const exists = await containerClient.exists();
  if (!exists) {
    await containerClient.create(); // or 'blob' for public access to blobs only
    console.log(`Container '${containerName}' created successfully.`);
  } else {
    console.log(`Container '${containerName}' already exists.`);
  }
}

createContainer().catch((err) => {
  console.error('Error creating container:', err.message);
});
