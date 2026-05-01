# Stage 1: Base - Common setup for both Dev and Prod
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package*.json ./

# Stage 2: Development - This is what your docker-compose.dev.yml "target" is looking for
FROM base AS development
# Install ALL dependencies (including devDependencies like drizzle-kit, nodemon, etc.)
RUN npm install
# We do not copy the source code here because your docker-compose file 
# mounts ./src as a volume for hot-reloading.
CMD ["npm", "run", "dev"]

# Stage 3: Production - Optimized, slim stage for deployment
FROM base AS production
# Only install production dependencies
RUN npm ci --only=production
# Copy actual source code into the image for production
COPY . .
CMD ["npm", "start"]