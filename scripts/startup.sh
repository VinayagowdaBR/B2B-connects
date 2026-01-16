#!/bin/bash
# EC2 Production Startup Script
# Auto-configures IP and starts the application

set -e

echo "=========================================="
echo "B2B App - EC2 Production Startup"
echo "Started at: $(date)"
echo "=========================================="

# Get current public IP
NEW_IP=$(curl -s ifconfig.me || curl -s icanhazip.com || curl -s ipecho.net/plain)
echo "Current Public IP: $NEW_IP"

# App directory
APP_DIR="/home/ubuntu/b2b-app"
cd $APP_DIR

# Read previous IP
OLD_IP_FILE="/var/tmp/b2b_last_ip"
if [ -f "$OLD_IP_FILE" ]; then
    OLD_IP=$(cat $OLD_IP_FILE)
    echo "Previous IP: $OLD_IP"
else
    OLD_IP="localhost"
    echo "First run - no previous IP"
fi

# Check if IP changed
if [ "$NEW_IP" = "$OLD_IP" ]; then
    echo "✅ IP unchanged. Starting containers..."
    docker-compose up -d
    echo "✅ App running at: http://$NEW_IP"
    exit 0
fi

echo "🔄 IP changed from $OLD_IP to $NEW_IP"
echo "Updating configuration..."

# Update .env with new IP
sed -i "s|FRONTEND_URL=http://[^,]*|FRONTEND_URL=http://$NEW_IP|g" .env
sed -i "s|BACKEND_CORS_ORIGINS=http://[^,]*|BACKEND_CORS_ORIGINS=http://$NEW_IP,http://localhost|g" .env
sed -i "s|VITE_API_URL=http://[^:]*:8000|VITE_API_URL=http://$NEW_IP:8000|g" .env
echo "✅ Updated .env"

# Update frontend .env.docker
cat > b2b-saas-frontend/.env.docker << EOF
VITE_API_URL=http://$NEW_IP:8000
VITE_API_BASE_URL=http://$NEW_IP:8000
EOF
echo "✅ Updated frontend .env.docker"

# Save new IP
echo "$NEW_IP" > $OLD_IP_FILE

# Rebuild frontend with new IP
echo "🔨 Rebuilding frontend..."
docker-compose build frontend

# Restart containers
echo "🔄 Starting containers..."
docker-compose down
docker-compose up -d

# Wait for startup
sleep 30

echo ""
echo "=========================================="
echo "✅ B2B App is now running!"
echo ""
echo "Frontend: http://$NEW_IP"
echo "Backend:  http://$NEW_IP:8000"
echo "API Docs: http://$NEW_IP:8000/docs"
echo ""
docker-compose ps
echo "=========================================="
