# Use official Node.js image
FROM node:22

# Create app directory
WORKDIR /home/site/wwwroot

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]
