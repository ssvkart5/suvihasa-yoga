# Use Node.js LTS base image
FROM node:22

# Set working directory to the root of your app
WORKDIR /home/site/wwwroot

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port Azure expects
EXPOSE 8080

# Start the server (adjust if your entry point is different)
CMD ["node", "server/index.js"]