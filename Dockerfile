# Build Stage
FROM node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* ./

# Use either yarn or npm, whichever lock file is available
# We'll check if yarn.lock exists and use yarn if so
# Otherwise, fall back to npm
RUN if [ -f yarn.lock ]; then \
        yarn install --frozen-lockfile; \
    else \
        npm ci; \
    fi

# Copy the rest of the app
COPY . .

# Build the app
RUN if [ -f yarn.lock ]; then \
        yarn build; \
    else \
        npm run build; \
    fi

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