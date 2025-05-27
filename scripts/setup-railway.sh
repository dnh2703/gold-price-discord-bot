#!/bin/bash

# Railway Setup Script for Discord Gold Bot
# This script helps you set up Railway deployment

echo "🚀 Railway Setup for Discord Gold Bot"
echo "======================================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
    
    if [ $? -eq 0 ]; then
        echo "✅ Railway CLI installed successfully!"
    else
        echo "❌ Failed to install Railway CLI. Please install manually:"
        echo "   npm install -g @railway/cli"
        exit 1
    fi
fi

echo ""
echo "📋 Setup Checklist:"
echo "==================="

echo ""
echo "1. 🔑 Railway Project Token"
echo "   - Go to your Railway project dashboard"
echo "   - Navigate to Settings → Tokens"
echo "   - Create a new project token"
echo "   - Add it to GitHub repository secrets as 'RAILWAY_TOKEN'"

echo ""
echo "2. 🌍 Environment Variables in Railway"
echo "   Required variables to set in Railway dashboard:"
echo "   - DISCORD_TOKEN: Your Discord bot token"
echo "   - CHANNEL_ID: Discord channel ID for messages"
echo "   - TIMEZONE: (Optional) Default is 'Asia/Ho_Chi_Minh'"

echo ""
echo "3. 📁 Project Structure Check"
echo "   Checking required files..."

# Check for required files
files_to_check=(
    "nixpacks.toml"
    "package.json"
    "src/index.ts"
    ".github/workflows/deploy.yml"
)

all_files_exist=true

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (missing)"
        all_files_exist=false
    fi
done

echo ""
if [ "$all_files_exist" = true ]; then
    echo "✅ All required files are present!"
else
    echo "❌ Some required files are missing. Please check your project structure."
fi

echo ""
echo "4. 🧪 Test Your Setup"
echo "   Run these commands to verify everything works:"
echo "   - bun install"
echo "   - bun run build"
echo "   - bun test"

echo ""
echo "5. 🚀 Deploy"
echo "   Once everything is set up:"
echo "   - Push your code to the main branch"
echo "   - GitHub Actions will automatically test and deploy to Railway"

echo ""
echo "📖 For detailed instructions, see: RAILWAY_DEPLOYMENT.md"
echo ""
echo "🎉 Setup complete! Your Discord bot is ready for Railway deployment." 