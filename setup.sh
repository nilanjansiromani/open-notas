#!/bin/bash

# Open Notas - Quick Setup Script
# This script builds the Chrome extension and provides setup instructions

echo "🚀 Open Notas - Chrome Extension Setup"
echo "======================================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

echo "🔨 Building extension..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful!"
echo ""

echo "📋 Next steps:"
echo "1. Open Chrome and go to: chrome://extensions/"
echo "2. Enable 'Developer mode' (top right)"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'dist' folder from this project"
echo ""
echo "🎉 You're all set! Press Ctrl+Shift+N on any website to open the notes overlay"
echo ""
echo "💡 For development, use: npm run dev"
