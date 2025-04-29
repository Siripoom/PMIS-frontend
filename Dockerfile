# Use Node.js as base image
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install yarn
RUN npm install -g yarn

# Copy package.json and package-lock.json files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM nginx:stable-alpine

# Copy built files from builder stage to nginx serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]