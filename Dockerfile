# Use Node.js LTS base image
FROM node:22

# Set working directory inside the container
WORKDIR /home/site/wwwroot/server/index.js

# Copy package files and install dependencies first (for caching)
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port Azure expects
EXPOSE 8080

# Start the server (adjust if your entry point is different)
CMD ["node", "index.js"]
