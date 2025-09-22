#!/bin/bash

# n8n-nodes-clay Development Environment Setup
# This script sets up a complete local development environment for testing the Clay community node

set -e

echo "🚀 Setting up n8n development environment for Clay community node..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEV_DIR="$HOME/n8n-clay-dev"
N8N_USER_FOLDER="$DEV_DIR/.n8n"
CLAY_NODE_DIR="$(pwd)"

echo -e "${BLUE}📁 Creating development directory structure...${NC}"

# Create development directory
mkdir -p "$DEV_DIR"
mkdir -p "$N8N_USER_FOLDER"

cd "$DEV_DIR"

echo -e "${BLUE}📦 Installing n8n locally for development...${NC}"

# Initialize package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    cat > package.json << EOF
{
  "name": "n8n-clay-development",
  "version": "1.0.0",
  "description": "Local n8n development environment for Clay community node",
  "private": true,
  "scripts": {
    "start": "N8N_USER_FOLDER=$N8N_USER_FOLDER n8n start --tunnel",
    "start:dev": "N8N_USER_FOLDER=$N8N_USER_FOLDER NODE_ENV=development n8n start --tunnel",
    "start:debug": "N8N_USER_FOLDER=$N8N_USER_FOLDER DEBUG=n8n:* n8n start --tunnel"
  }
}
EOF
fi

# Install n8n locally
echo -e "${YELLOW}Installing n8n (this may take a few minutes)...${NC}"
npm install n8n@latest

echo -e "${BLUE}🔗 Setting up Clay node linking...${NC}"

# Build the Clay node first
cd "$CLAY_NODE_DIR"
echo -e "${YELLOW}Building Clay community node...${NC}"
npm run build

# Link the Clay node globally
echo -e "${YELLOW}Linking Clay node globally...${NC}"
npm link

# Go back to dev environment and link the Clay node
cd "$DEV_DIR"
echo -e "${YELLOW}Linking Clay node to development environment...${NC}"
npm link n8n-nodes-clay

echo -e "${BLUE}⚙️  Configuring n8n development environment...${NC}"

# Create n8n configuration
cat > "$N8N_USER_FOLDER/config" << EOF
{
  "database": {
    "type": "sqlite",
    "sqlite": {
      "database": "$N8N_USER_FOLDER/database.sqlite"
    }
  },
  "nodes": {
    "communityPackages": {
      "enabled": true
    }
  },
  "endpoints": {
    "rest": "rest",
    "webhook": "webhook",
    "webhookWaiting": "webhook-waiting",
    "webhookTest": "webhook-test"
  },
  "security": {
    "basicAuth": {
      "active": false
    }
  }
}
EOF

# Create development scripts
echo -e "${BLUE}📝 Creating development scripts...${NC}"

# Hot reload script
cat > start-dev.sh << 'EOF'
#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

DEV_DIR="$HOME/n8n-clay-dev"
N8N_USER_FOLDER="$DEV_DIR/.n8n"
CLAY_NODE_DIR="$(dirname "$(readlink -f "$0")")/../n8n-nodes-clay"

echo -e "${BLUE}🔄 Starting n8n development server with hot reload...${NC}"
echo -e "${YELLOW}n8n will be available at: http://localhost:5678${NC}"
echo -e "${YELLOW}Tunnel URL will be displayed once n8n starts${NC}"
echo ""
echo -e "${GREEN}Development Tips:${NC}"
echo "• Make changes to your Clay node code"
echo "• Run 'npm run build' in the Clay node directory"
echo "• Restart n8n to see changes (Ctrl+C then run this script again)"
echo "• Check the Clay node appears in the Transform section"
echo ""

cd "$DEV_DIR"

# Set environment variables
export N8N_USER_FOLDER="$N8N_USER_FOLDER"
export NODE_ENV=development

# Start n8n with tunnel for webhook testing
npx n8n start --tunnel
EOF

# Rebuild script
cat > rebuild-clay-node.sh << 'EOF'
#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

CLAY_NODE_DIR="$(find .. -name "n8n-nodes-clay" -type d | head -1)"

if [ -z "$CLAY_NODE_DIR" ]; then
    echo -e "${RED}❌ Could not find n8n-nodes-clay directory${NC}"
    exit 1
fi

echo -e "${BLUE}🔨 Rebuilding Clay community node...${NC}"

cd "$CLAY_NODE_DIR"

# Build the node
echo -e "${YELLOW}Building TypeScript...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Clay node rebuilt successfully!${NC}"
    echo -e "${YELLOW}💡 Restart n8n to see your changes${NC}"
else
    echo -e "${RED}❌ Build failed. Check the errors above.${NC}"
    exit 1
fi
EOF

# Test script
cat > test-clay-node.sh << 'EOF'
#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🧪 Testing Clay community node installation...${NC}"

# Check if Clay node is linked
if npm list n8n-nodes-clay > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Clay node is linked correctly${NC}"
else
    echo -e "${RED}❌ Clay node is not linked${NC}"
    exit 1
fi

# Check if build files exist
CLAY_NODE_DIR="$(find .. -name "n8n-nodes-clay" -type d | head -1)"
if [ -f "$CLAY_NODE_DIR/dist/nodes/ClayApi/ClayApi.node.js" ]; then
    echo -e "${GREEN}✅ Clay node build files exist${NC}"
else
    echo -e "${RED}❌ Clay node build files missing${NC}"
    exit 1
fi

# Check if icons exist
if [ -f "$CLAY_NODE_DIR/dist/nodes/ClayApi/clay.png" ] && [ -f "$CLAY_NODE_DIR/dist/nodes/ClayApi/clay.svg" ]; then
    echo -e "${GREEN}✅ Clay node icons are present${NC}"
else
    echo -e "${YELLOW}⚠️  Some Clay node icons may be missing${NC}"
fi

echo -e "${GREEN}🎉 Clay node appears to be set up correctly!${NC}"
echo -e "${YELLOW}💡 Start n8n with: ./start-dev.sh${NC}"
EOF

# Make scripts executable
chmod +x start-dev.sh
chmod +x rebuild-clay-node.sh
chmod +x test-clay-node.sh

echo -e "${GREEN}✅ Development environment setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. cd $DEV_DIR"
echo "2. ./test-clay-node.sh  # Test the setup"
echo "3. ./start-dev.sh       # Start n8n development server"
echo ""
echo -e "${BLUE}🔧 Development workflow:${NC}"
echo "• Make changes to Clay node code"
echo "• Run: ./rebuild-clay-node.sh"
echo "• Restart n8n to see changes"
echo ""
echo -e "${YELLOW}📁 Development directory: $DEV_DIR${NC}"
echo -e "${YELLOW}🗂️  n8n user folder: $N8N_USER_FOLDER${NC}"
