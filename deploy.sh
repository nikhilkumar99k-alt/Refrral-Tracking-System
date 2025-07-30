#!/bin/bash

# Deployment script for Referral Tracking System
echo "🚀 Starting deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build the application
echo "🔨 Building application..."
npm run build

# Create logs directory if it doesn't exist
mkdir -p logs

# Restart the application with PM2
echo "🔄 Restarting application with PM2..."
pm2 restart ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Show status
echo "📊 PM2 Status:"
pm2 status

# Show recent logs
echo "📋 Recent logs:"
pm2 logs referral-tracking-system --lines 5

echo "✅ Deployment completed successfully!" 