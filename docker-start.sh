#!/bin/sh
# ===========================================
# Startup Script for BPM USNI Container
# ===========================================

echo "=========================================="
echo "  BPM USNI - Starting Application"
echo "=========================================="
echo ""

# Set working directory
cd /app

# Check if database exists
echo "[1/3] Checking database..."
if [ ! -f /app/db/custom.db ]; then
    echo "      Database not found. Creating new database..."
    npx prisma db push --skip-generate
    echo "      Database created successfully!"
else
    echo "      Database found. Verifying schema..."
    npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || true
    echo "      Database ready!"
fi

# Ensure uploads directory exists with proper permissions
echo "[2/3] Checking uploads directory..."
mkdir -p /app/public/uploads/images /app/public/uploads/documents
echo "      Uploads directory ready!"

# Start the server
echo "[3/3] Starting Next.js server..."
echo "      Host: $HOSTNAME"
echo "      Port: $PORT"
echo ""
echo "=========================================="
echo "  Application is running!"
echo "  Access at: http://<server-ip>:2018"
echo "=========================================="
echo ""

# Execute the Next.js server
exec node server.js
