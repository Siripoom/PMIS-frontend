# Build Stage
FROM node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package.json ./

# Force use npm only
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Production Stage
FROM nginx:stable-alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]