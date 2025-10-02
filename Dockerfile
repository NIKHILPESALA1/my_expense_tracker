# Use official Node.js LTS slim image
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching)
COPY app/package*.json ./app/

# Set working directory inside app folder
WORKDIR /usr/src/app/app

# Copy the rest of the app (including routes)
COPY app/ ./

# Install dependencies (production only)
RUN npm ci --production

# Expose the port the app runs on
EXPOSE 8083

# Start the app
CMD ["node", "app.js"]
