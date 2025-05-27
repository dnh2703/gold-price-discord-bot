#!/bin/bash

# Validation Script for Discord Gold Bot CI/CD Setup
# This script validates that everything is properly configured

echo "🔍 Validating Discord Gold Bot CI/CD Setup"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track validation status
validation_passed=true

echo ""
echo "1. 📁 Checking Project Structure..."

# Required files
required_files=(
    "package.json"
    "tsconfig.json"
    "nixpacks.toml"
    "src/index.ts"
    "src/index.test.ts"
    ".github/workflows/deploy.yml"
    "RAILWAY_DEPLOYMENT.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✅${NC} $file"
    else
        echo -e "   ${RED}❌${NC} $file (missing)"
        validation_passed=false
    fi
done

echo ""
echo "2. 📦 Checking Dependencies..."

if command -v bun &> /dev/null; then
    echo -e "   ${GREEN}✅${NC} Bun is installed"
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        echo -e "   ${GREEN}✅${NC} Dependencies installed"
    else
        echo -e "   ${YELLOW}⚠️${NC} Dependencies not installed. Run: bun install"
    fi
else
    echo -e "   ${YELLOW}⚠️${NC} Bun not found. Install from: https://bun.sh"
fi

echo ""
echo "3. 🔨 Testing Build Process..."

if bun run build > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅${NC} Build successful"
else
    echo -e "   ${RED}❌${NC} Build failed"
    validation_passed=false
fi

echo ""
echo "4. 🧪 Running Tests..."

if bun test > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅${NC} Tests passed"
else
    echo -e "   ${RED}❌${NC} Tests failed"
    validation_passed=false
fi

echo ""
echo "5. ⚙️ Checking GitHub Actions Workflow..."

workflow_file=".github/workflows/deploy.yml"
if [ -f "$workflow_file" ]; then
    # Check for required workflow components
    if grep -q "railway up --detach" "$workflow_file"; then
        echo -e "   ${GREEN}✅${NC} Railway deployment configured"
    else
        echo -e "   ${RED}❌${NC} Railway deployment not found in workflow"
        validation_passed=false
    fi
    
    if grep -q "RAILWAY_TOKEN" "$workflow_file"; then
        echo -e "   ${GREEN}✅${NC} Railway token reference found"
    else
        echo -e "   ${RED}❌${NC} Railway token not referenced in workflow"
        validation_passed=false
    fi
    
    if grep -q "bun test" "$workflow_file"; then
        echo -e "   ${GREEN}✅${NC} Test step configured"
    else
        echo -e "   ${RED}❌${NC} Test step not found in workflow"
        validation_passed=false
    fi
else
    echo -e "   ${RED}❌${NC} Workflow file missing"
    validation_passed=false
fi

echo ""
echo "6. 🚂 Checking Railway Configuration..."

if [ -f "nixpacks.toml" ]; then
    if grep -q "bun" "nixpacks.toml"; then
        echo -e "   ${GREEN}✅${NC} Bun runtime configured"
    else
        echo -e "   ${YELLOW}⚠️${NC} Bun not specified in nixpacks.toml"
    fi
    
    if grep -q "bun run start" "nixpacks.toml"; then
        echo -e "   ${GREEN}✅${NC} Start command configured"
    else
        echo -e "   ${RED}❌${NC} Start command not found"
        validation_passed=false
    fi
else
    echo -e "   ${RED}❌${NC} nixpacks.toml missing"
    validation_passed=false
fi

echo ""
echo "7. 📚 Checking Documentation..."

if [ -f "RAILWAY_DEPLOYMENT.md" ]; then
    echo -e "   ${GREEN}✅${NC} Railway deployment guide exists"
else
    echo -e "   ${RED}❌${NC} Railway deployment guide missing"
    validation_passed=false
fi

if grep -q "Railway Deployment" "README.md"; then
    echo -e "   ${GREEN}✅${NC} README includes deployment info"
else
    echo -e "   ${YELLOW}⚠️${NC} README missing deployment section"
fi

echo ""
echo "=========================================="

if [ "$validation_passed" = true ]; then
    echo -e "${GREEN}🎉 All validations passed!${NC}"
    echo ""
    echo "✅ Your Discord Gold Bot is ready for CI/CD deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Create a Railway project and connect your GitHub repo"
    echo "2. Set environment variables in Railway dashboard"
    echo "3. Add RAILWAY_TOKEN to GitHub repository secrets"
    echo "4. Push to main branch to trigger deployment"
    echo ""
    echo "📖 See RAILWAY_DEPLOYMENT.md for detailed instructions"
else
    echo -e "${RED}❌ Some validations failed!${NC}"
    echo ""
    echo "Please fix the issues above before deploying."
    echo "Run this script again after making corrections."
fi

echo "" 