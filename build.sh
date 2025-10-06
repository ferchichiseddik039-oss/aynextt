#!/bin/bash
echo "🚀 Building frontend..."
cd frontend
npm install
npm run build
echo "📦 Copying build to root..."
cd ..
cp -r frontend/build build
echo "✅ Build completed!"
