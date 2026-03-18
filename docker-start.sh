#!/bin/sh
# ===========================================
# Startup Script for BPM USNI Container
# Port: 2018
# ===========================================

echo "=========================================="
echo "  BPM USNI - Starting Application"
echo "=========================================="
echo ""

cd /app

# Set environment
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export PORT="${PORT:-2018}"
export NODE_ENV="${NODE_ENV:-production}"

# Ensure directories exist
echo "[1/3] Setting up directories..."
mkdir -p /app/db /app/public/uploads/images /app/public/uploads/documents
echo "      Directories ready!"

# Database setup
echo "[2/3] Checking database..."
if [ ! -f /app/db/custom.db ]; then
    echo "      Creating new database..."
    npx prisma db push --skip-generate 2>&1
    echo "      Database created!"
else
    echo "      Database found!"
fi

# Start server
echo "[3/3] Starting server on port $PORT..."
echo ""
echo "=========================================="
echo "  Application Running!"
echo "  URL: http://localhost:$PORT"
echo "=========================================="
echo ""

# Run the standalone server
exec node server.js
