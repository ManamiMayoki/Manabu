# Use Node LTS alpine image
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start Express server
CMD ["npm", "start"]
