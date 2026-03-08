# ===========================================
# Dockerfile for BPM USNI - Next.js Application
# ===========================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files
COPY package.json bun.lock* package-lock.json* yarn.lock* ./

# Install dependencies using npm (more compatible with Docker)
RUN npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=2018

# Create necessary directories
RUN mkdir -p /app/db /app/public/uploads/images /app/.next

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy node_modules for Prisma
COPY --from=builder /app/node_modules ./node_modules

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Starting BPM USNI Application..."' >> /app/start.sh && \
    echo 'echo "Checking database..."' >> /app/start.sh && \
    echo 'if [ ! -f /app/db/custom.db ]; then' >> /app/start.sh && \
    echo '  echo "Database not found, running migrations..."' >> /app/start.sh && \
    echo '  npx prisma db push --skip-generate' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'echo "Starting server on $HOSTNAME:$PORT"' >> /app/start.sh && \
    echo 'exec node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port
EXPOSE 2018

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:2018/api/identity || exit 1

# Start the application
CMD ["/app/start.sh"]
