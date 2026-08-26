# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy application source code
COPY . .

# Build Vite client bundle (dist/) and compile Express TypeScript server (dist-server/)
RUN npm run build

# Stage 2: Production Runner for Google Cloud Run
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --only=production --no-audit --no-fund

# Copy built frontend assets and compiled backend server code from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server

# Non-root user for security compliance
USER node

# Expose Cloud Run default port
EXPOSE 8080

# Entrypoint command
CMD ["node", "dist-server/index.js"]
