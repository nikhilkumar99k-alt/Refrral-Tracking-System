#!/bin/bash

echo "🧪 Starting test server..."

# Kill any existing process on port 3000
echo "🛑 Stopping any existing process on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Start the test server
echo "🚀 Starting test server..."
node test-server.js &
TEST_SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Test the endpoints
echo "🧪 Testing endpoints..."
curl -s http://localhost:3000/ | head -1
echo ""

curl -s http://localhost:3000/health | jq . 2>/dev/null || curl -s http://localhost:3000/health
echo ""

# Stop the test server
echo "🛑 Stopping test server..."
kill $TEST_SERVER_PID 2>/dev/null || true

echo "✅ Test completed!" 