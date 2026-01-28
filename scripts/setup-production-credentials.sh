#!/bin/bash
# =============================================================================
# Production Credentials Setup Script
# =============================================================================
# Generates secure credentials and configures the admin user in the database.
#
# Usage:
#   ./scripts/setup-production-credentials.sh
#
# Prerequisites:
#   - openssl installed
#   - Node.js 18+ installed
#   - Valid DATABASE_URL in .env or passed as argument
# =============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Output file for credentials (git-ignored)
CREDENTIALS_FILE=".env.production.credentials"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Production Credentials Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# -----------------------------------------------------------------------------
# Step 1: Check for DATABASE_URL
# -----------------------------------------------------------------------------
echo -e "${YELLOW}[1/4] Checking database connection...${NC}"

# Try to get DATABASE_URL from multiple sources
if [[ -n "${DATABASE_URL:-}" ]]; then
    DB_URL="$DATABASE_URL"
    echo -e "  Using DATABASE_URL from environment"
elif [[ -f ".env" ]] && grep -q "^DATABASE_URL=" .env; then
    DB_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f2-)
    echo -e "  Using DATABASE_URL from .env file"
elif [[ -f ".env.local" ]] && grep -q "^DATABASE_URL=" .env.local; then
    DB_URL=$(grep "^DATABASE_URL=" .env.local | cut -d '=' -f2-)
    echo -e "  Using DATABASE_URL from .env.local file"
else
    echo -e "${RED}  ERROR: DATABASE_URL not found${NC}"
    echo ""
    echo "  Please provide DATABASE_URL in one of these ways:"
    echo "    1. Set in .env file"
    echo "    2. Set in .env.local file"
    echo "    3. Export as environment variable:"
    echo "       export DATABASE_URL='postgresql://user:pass@host:5432/dbname'"
    echo ""
    exit 1
fi

# Validate DATABASE_URL format (supports both standard and Neon serverless formats)
# Standard: postgresql://user:pass@host:port/db
# Neon: postgresql://user:pass@host/db (port optional, uses 5432)
if [[ ! "$DB_URL" =~ ^postgres(ql)?://[^:]+:[^@]+@[^/]+/.+ ]]; then
    echo -e "${RED}  ERROR: Invalid DATABASE_URL format${NC}"
    echo ""
    echo "  Expected format: postgresql://user:password@host[:port]/database"
    echo "  Examples:"
    echo "    postgresql://myuser:mypass@db.neon.tech:5432/portfolio"
    echo "    postgresql://myuser:mypass@ep-xyz.neon.tech/portfolio"
    echo ""
    echo "  Your value: $DB_URL"
    echo ""
    exit 1
fi

echo -e "${GREEN}  ✓ Database URL validated${NC}"

# -----------------------------------------------------------------------------
# Step 2: Generate secure credentials
# -----------------------------------------------------------------------------
echo ""
echo -e "${YELLOW}[2/4] Generating secure credentials...${NC}"

JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
COOKIE_SECRET=$(openssl rand -base64 32 | tr -d '\n')
ADMIN_PASSWORD=$(openssl rand -base64 18 | tr -d '\n' | head -c 24)

echo -e "${GREEN}  ✓ JWT_SECRET generated (86 chars)${NC}"
echo -e "${GREEN}  ✓ COOKIE_SECRET generated (44 chars)${NC}"
echo -e "${GREEN}  ✓ ADMIN_PASSWORD generated (24 chars)${NC}"

# -----------------------------------------------------------------------------
# Step 3: Run database migration with admin password
# -----------------------------------------------------------------------------
echo ""
echo -e "${YELLOW}[3/4] Configuring admin user in database...${NC}"

# Export for the migration script
export DATABASE_URL="$DB_URL"
export ADMIN_PASSWORD="$ADMIN_PASSWORD"
export NODE_ENV="production"

# Run migration
if npx tsx db/migrate.ts 2>&1; then
    echo -e "${GREEN}  ✓ Admin user configured successfully${NC}"
else
    echo -e "${RED}  ERROR: Migration failed${NC}"
    echo "  Check your DATABASE_URL and try again"
    exit 1
fi

# -----------------------------------------------------------------------------
# Step 4: Save credentials to file
# -----------------------------------------------------------------------------
echo ""
echo -e "${YELLOW}[4/4] Saving credentials...${NC}"

cat > "$CREDENTIALS_FILE" << EOF
# =============================================================================
# Production Credentials - Generated $(date -Iseconds)
# =============================================================================
# IMPORTANT: Add these to your Vercel dashboard (Settings → Environment Variables)
# DO NOT commit this file to git (it's already in .gitignore)
# =============================================================================

# Authentication
JWT_SECRET=$JWT_SECRET
COOKIE_SECRET=$COOKIE_SECRET

# Admin Login
# Username: admin
ADMIN_PASSWORD=$ADMIN_PASSWORD

# Database (already configured)
DATABASE_URL=$DB_URL

# CORS - Update with your actual Vercel domain
ALLOWED_ORIGINS=https://your-app.vercel.app

# External Services (generate new keys for production)
# GITHUB_TOKEN=your_new_github_token
# GEMINI_API_KEY=your_new_gemini_key

# Environment
NODE_ENV=production
EOF

echo -e "${GREEN}  ✓ Credentials saved to ${CREDENTIALS_FILE}${NC}"

# Ensure the file is in .gitignore
if ! grep -q "^\.env\.production\.credentials$" .gitignore 2>/dev/null; then
    echo ".env.production.credentials" >> .gitignore
    echo -e "${GREEN}  ✓ Added to .gitignore${NC}"
fi

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Setup Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${YELLOW}Admin Login Credentials:${NC}"
echo -e "    Username: ${GREEN}admin${NC}"
echo -e "    Password: ${GREEN}$ADMIN_PASSWORD${NC}"
echo ""
echo -e "  ${YELLOW}Next Steps:${NC}"
echo -e "    1. Copy credentials from: ${BLUE}$CREDENTIALS_FILE${NC}"
echo -e "    2. Add to Vercel: ${BLUE}vercel env add${NC} or use dashboard"
echo -e "    3. Update ALLOWED_ORIGINS with your Vercel domain"
echo -e "    4. Generate new GITHUB_TOKEN and GEMINI_API_KEY for production"
echo ""
echo -e "  ${YELLOW}Quick Copy (for Vercel CLI):${NC}"
echo -e "    cat $CREDENTIALS_FILE"
echo ""
