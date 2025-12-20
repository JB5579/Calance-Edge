# Build stage - Use Node 20 for Vite 7 compatibility
FROM node:20-alpine AS build

WORKDIR /app

# Build arguments for environment variables
ARG VITE_API_URL=http://localhost:5000
ARG VITE_ENV=production

# Set environment variables for build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_ENV=${VITE_ENV}

# Copy package files
COPY package*.json ./

# Install dependencies (remove --only=production to get devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application (environment variables are baked in here)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]