# Overview of Architecture
Frontend: React or any SPA framework (optional for now)
Backend: Node.js + Express
Database: Azure Cosmos DB (NoSQL)
Storage: Azure Blob Storage (for images/videos)
Hosting: Azure App Service
Authentication: JWT or Azure AD B2C (optional)
# Prerequisites
Azure account: Create one here
Node.js & npm installed
Azure CLI installed (az)
Docker (optional for containerization)
GitHub account (for CI/CD)

# Create Azure Resources
a. Cosmos DB
    Go to Azure Portal → Search "Cosmos DB" → Create
    Choose Core (SQL) API
    Set resource group, account name, region
    After creation, go to Data Explorer:
    Create Database: YogaDB
    Create Containers:
        Users (partition key: /email)
        Classes (/id)
        Schedules (/classId)
        Poses (/style)
        Styles (/name)
        Instructors (/id)

b. Blob Storage (for media)
1. Search "Storage Account" → Create
2. After creation, go to Containers → Create media
3. Set access level to Blob (anonymous read) or use SAS tokens

c. App Service
    Search "App Service" → Create
    Choose Node.js runtime (e.g., Node 18)
    Link to GitHub repo or deploy manually

3. 🧩 Backend Setup (Node.js + Express)
a. Project Structure
bash
yoga-app/
├── app.js
├── routes/
│   ├── users.js
│   ├── classes.js
│   ├── schedules.js
│   ├── poses.js
│   ├── styles.js
│   ├── instructors.js
│   └── media.js
├── models/
│   ├── User.js
│   ├── Class.js
│   ├── Schedule.js
│   ├── Pose.js
│   ├── Style.js
│   ├── Instructor.js
├── middleware/
│   └── auth.js
├── utils/
│   └── blobUpload.js
├── .env
└── package.json

b. Install Dependencies
# bash
    npm init -y
    npm install express @azure/cosmos multer dotenv jsonwebtoken bcryptjs
c. Connect to Cosmos DB
// config/db.js
const { CosmosClient } = require("@azure/cosmos");
const client = new CosmosClient({ endpoint: process.env.COSMOS_ENDPOINT, key: process.env.COSMOS_KEY });
module.exports = client;

4. 👥 User Registration & Auth  
    Use bcryptjs for password hashing
    Use jsonwebtoken for JWT-based auth
    Create /register, /login, /profile routes
    Store users in Users container

5. Classes & Scheduling 
    Classes container: yoga class info (title, description, instructorId)
    Schedules container: date/time slots, linked to classId
    Create endpoints:
        POST /classes
        GET /classes
        POST /schedules
        GET /schedules?classId=...

6. Poses & Styles
    Poses: name, image URL, style
    Styles: name, description
    Endpoints:
        GET /poses?style=...
        POST /poses
        GET /styles

7. Instructor Management
    Instructors: name, bio, image, specialties
        Endpoints:
            GET /instructors
            POST /instructors

8. Upload Images & Videos
    Use multer to handle uploads and Azure Blob SDK to store files:

        const { BlobServiceClient } = require('@azure/storage-blob');
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

    Upload route: POST /upload
    Store media URLs in DB (e.g., pose image, instructor profile)

9. eploy to Azure App Service
a. Zip deploy or GitHub Actions
    Push code to GitHub
    In App Service → Deployment Center → Connect GitHub repo
    Set environment variables in App Service → Configuration:
        COSMOS_ENDPOINT
        COSMOS_KEY
        AZURE_STORAGE_CONNECTION_STRING
        JWT_SECRET

10. Test & Monitor
    Use Postman or Swagger for API testing
    Enable App Insights for logging and performance
    Set up alerts for errors or downtime
