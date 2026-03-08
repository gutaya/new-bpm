#!/bin/bash

# ===========================================
# BPM USNI - Docker Startup Script
# ===========================================

set -e

echo "============================================"
echo "  BPM USNI - Docker Deployment"
echo "============================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Docker and Docker Compose are installed."

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p db
mkdir -p public/uploads/images
mkdir -p prisma

# Check if database exists
if [ -f "db/custom.db" ]; then
    print_success "Database found at db/custom.db"
else
    print_warning "Database not found. It will be created automatically."
fi

# Set Docker Compose command
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Parse command line arguments
COMMAND=${1:-"start"}

case "$COMMAND" in
    start)
        print_info "Starting BPM USNI application..."
        print_info "Building Docker image..."
        $COMPOSE_CMD build --no-cache
        
        print_info "Starting containers..."
        $COMPOSE_CMD up -d
        
        print_success "Application started!"
        echo ""
        echo "============================================"
        echo "  Application is running on:"
        echo "  - Local: http://localhost:2018"
        echo "  - Network: http://10.8.0.1:2018"
        echo "============================================"
        echo ""
        print_info "To view logs, run: ./docker.sh logs"
        print_info "To stop, run: ./docker.sh stop"
        ;;
    
    stop)
        print_info "Stopping BPM USNI application..."
        $COMPOSE_CMD down
        print_success "Application stopped."
        ;;
    
    restart)
        print_info "Restarting BPM USNI application..."
        $COMPOSE_CMD down
        $COMPOSE_CMD up -d
        print_success "Application restarted."
        ;;
    
    logs)
        print_info "Showing application logs..."
        $COMPOSE_CMD logs -f
        ;;
    
    build)
        print_info "Building Docker image..."
        $COMPOSE_CMD build --no-cache
        print_success "Build completed."
        ;;
    
    ps)
        print_info "Container status:"
        $COMPOSE_CMD ps
        ;;
    
    shell)
        print_info "Opening shell in container..."
        $COMPOSE_CMD exec bpm-usni /bin/sh
        ;;
    
    db-push)
        print_info "Running Prisma db push..."
        $COMPOSE_CMD exec bpm-usni npx prisma db push
        print_success "Database schema pushed."
        ;;
    
    clean)
        print_warning "This will remove all containers, images, and volumes!"
        read -p "Are you sure? (y/N): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            $COMPOSE_CMD down -v --rmi all
            print_success "Cleanup completed."
        else
            print_info "Cleanup cancelled."
        fi
        ;;
    
    backup)
        BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
        print_info "Creating backup at $BACKUP_DIR..."
        mkdir -p "$BACKUP_DIR"
        cp -r db "$BACKUP_DIR/"
        cp -r public/uploads "$BACKUP_DIR/"
        print_success "Backup completed at $BACKUP_DIR"
        ;;
    
    *)
        echo "Usage: $0 {start|stop|restart|logs|build|ps|shell|db-push|clean|backup}"
        echo ""
        echo "Commands:"
        echo "  start     - Build and start the application"
        echo "  stop      - Stop the application"
        echo "  restart   - Restart the application"
        echo "  logs      - View application logs"
        echo "  build     - Build Docker image"
        echo "  ps        - Show container status"
        echo "  shell     - Open shell in container"
        echo "  db-push   - Run Prisma db push"
        echo "  clean     - Remove all containers, images, and volumes"
        echo "  backup    - Backup database and uploads"
        exit 1
        ;;
esac
