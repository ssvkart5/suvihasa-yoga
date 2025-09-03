# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app/server.js

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of your app
COPY . .

# Expose the port Azure expects
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]
