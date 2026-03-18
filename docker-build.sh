#!/bin/bash
# ===========================================
# Docker Build Script for BPM USNI
# ===========================================

echo "=========================================="
echo "  Building BPM USNI for Docker"
echo "=========================================="
echo ""

# Step 1: Build the Next.js application locally
echo "[1/3] Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi
echo "      Build completed!"
echo ""

# Step 2: Copy static files to standalone folder
echo "[2/3] Copying static files..."
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
echo "      Static files copied!"
echo ""

# Step 3: Build Docker image
echo "[3/3] Building Docker image..."
docker-compose build --no-cache

if [ $? -ne 0 ]; then
    echo "ERROR: Docker build failed!"
    exit 1
fi

echo ""
echo "=========================================="
echo "  Build completed successfully!"
echo "=========================================="
echo ""
echo "To start the container, run:"
echo "  docker-compose up -d"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
