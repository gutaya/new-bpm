# ===========================================
# Dockerfile for BPM USNI - Pre-built Local
# 
# BUILD LOCAL FIRST:
#   npm install --legacy-peer-deps
#   npx prisma generate
#   npm run build
#
# THEN BUILD DOCKER:
#   docker-compose build
#   docker-compose up -d
#
# Port: 2018
# ===========================================

FROM node:20 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=2018

# Create directories
RUN mkdir -p /app/db /app/public/uploads/images /app/public/uploads/documents

# Copy pre-built application (from local build)
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
COPY prisma ./prisma
COPY node_modules/.prisma ./node_modules/.prisma
COPY node_modules/@prisma ./node_modules/@prisma

# Copy startup script
COPY docker-start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 2018

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:2018/api/identity || exit 1

ENTRYPOINT ["/app/start.sh"]
