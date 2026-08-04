# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the Node/Express server
CMD ["node", "index.js"]