#!/bin/bash
# ===========================================
# Build Script for BPM USNI Docker
# Port: 2018
# ===========================================

echo "=========================================="
echo "  BPM USNI - Docker Build Script"
echo "=========================================="
echo ""

# Step 1: Install dependencies
echo "[1/4] Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed!"
    exit 1
fi
echo "      Done!"
echo ""

# Step 2: Generate Prisma client
echo "[2/4] Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "ERROR: Prisma generate failed!"
    exit 1
fi
echo "      Done!"
echo ""

# Step 3: Build Next.js
echo "[3/4] Building Next.js application..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi
echo "      Done!"
echo ""

# Step 4: Build Docker image
echo "[4/4] Building Docker image..."
docker-compose build
if [ $? -ne 0 ]; then
    echo "ERROR: Docker build failed!"
    exit 1
fi
echo "      Done!"
echo ""

echo "=========================================="
echo "  BUILD SUCCESSFUL!"
echo "=========================================="
echo ""
echo "To start the container:"
echo "  docker-compose up -d"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop:"
echo "  docker-compose down"
echo ""
