#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# Portfolio Setup Script
# Interactive wizard for configuring your portfolio
# ═══════════════════════════════════════════════════════════════════════════

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print colored output
print_header() {
    echo -e "\n${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}\n"
}

print_step() {
    echo -e "${BLUE}→${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Welcome message
clear
print_header "Portfolio Template Setup Wizard"
echo "This wizard will help you set up your portfolio."
echo "Press Ctrl+C at any time to cancel."
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    print_warning ".env file already exists."
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
        print_step "Keeping existing .env file"
    else
        cp .env.template .env
        print_success "Created new .env from template"
    fi
else
    cp .env.template .env
    print_success "Created .env from template"
fi

# Check if portfolio.config.ts needs to be created
if [ ! -f "portfolio.config.ts" ]; then
    cp portfolio.config.sample.ts portfolio.config.ts
    print_success "Created portfolio.config.ts from sample"
fi

print_header "Personal Information"

# Get user information
read -p "Your full name: " full_name
if [ -z "$full_name" ]; then
    full_name="Alex Johnson"
    print_warning "Using default: $full_name"
fi

# Extract first name
first_name=$(echo "$full_name" | awk '{print $1}')

read -p "Your email: " email
if [ -z "$email" ]; then
    email="alex@example.com"
    print_warning "Using default: $email"
fi

read -p "Your location (city, country): " location
if [ -z "$location" ]; then
    location="San Francisco, CA"
    print_warning "Using default: $location"
fi

read -p "Your professional title: " title
if [ -z "$title" ]; then
    title="Full Stack Developer"
    print_warning "Using default: $title"
fi

print_header "Social Links (optional)"

read -p "GitHub username: " github_username
read -p "LinkedIn URL: " linkedin_url
read -p "Twitter/X URL: " twitter_url

print_header "Updating Configuration"

# Update portfolio.config.ts with sed
if [ -n "$full_name" ]; then
    sed -i.bak "s/name: \"Alex Johnson\"/name: \"$full_name\"/" portfolio.config.ts
    sed -i.bak "s/firstName: \"Alex\"/firstName: \"$first_name\"/" portfolio.config.ts
fi

if [ -n "$email" ]; then
    sed -i.bak "s/email: \"alex@example.com\"/email: \"$email\"/" portfolio.config.ts
fi

if [ -n "$location" ]; then
    sed -i.bak "s/location: \"San Francisco, CA\"/location: \"$location\"/" portfolio.config.ts
fi

if [ -n "$title" ]; then
    sed -i.bak "s/title: \"Full Stack Developer\"/title: \"$title\"/" portfolio.config.ts
fi

if [ -n "$github_username" ]; then
    sed -i.bak "s|github: \"https://github.com/alexjohnson\"|github: \"https://github.com/$github_username\"|" portfolio.config.ts
    sed -i.bak "s/username: \"alexjohnson\"/username: \"$github_username\"/" portfolio.config.ts
    # Also update .env
    sed -i.bak "s/GITHUB_USERNAME=your_github_username/GITHUB_USERNAME=$github_username/" .env
fi

if [ -n "$linkedin_url" ]; then
    sed -i.bak "s|linkedin: \"https://linkedin.com/in/alexjohnson\"|linkedin: \"$linkedin_url\"|" portfolio.config.ts
fi

if [ -n "$twitter_url" ]; then
    sed -i.bak "s|twitter: \"https://twitter.com/alexjohnson\"|twitter: \"$twitter_url\"|" portfolio.config.ts
fi

# Clean up backup files
rm -f portfolio.config.ts.bak .env.bak

print_success "Configuration updated"

print_header "Security Setup"

# Generate secrets if not already set
jwt_secret=$(openssl rand -base64 64 2>/dev/null | tr -d '\n' || echo "")
cookie_secret=$(openssl rand -base64 32 2>/dev/null | tr -d '\n' || echo "")
admin_password=$(openssl rand -base64 18 2>/dev/null | tr -d '\n' || echo "")

if [ -n "$jwt_secret" ]; then
    sed -i.bak "s|JWT_SECRET=your_jwt_secret_at_least_64_characters_long|JWT_SECRET=$jwt_secret|" .env
    print_success "Generated JWT secret"
fi

if [ -n "$cookie_secret" ]; then
    sed -i.bak "s|COOKIE_SECRET=your_cookie_secret_at_least_32_characters|COOKIE_SECRET=$cookie_secret|" .env
    print_success "Generated cookie secret"
fi

if [ -n "$admin_password" ]; then
    sed -i.bak "s|ADMIN_PASSWORD=your_admin_password_here|ADMIN_PASSWORD=$admin_password|" .env
    print_success "Generated admin password"
    echo ""
    echo -e "${YELLOW}IMPORTANT: Save your admin password:${NC}"
    echo -e "${GREEN}$admin_password${NC}"
    echo ""
fi

rm -f .env.bak

print_header "Database Setup"

echo "You need a PostgreSQL database for this portfolio."
echo "Recommended services:"
echo "  - Neon (neon.tech) - Free tier available"
echo "  - Supabase (supabase.com) - Free tier available"
echo "  - Local PostgreSQL"
echo ""

read -p "Enter your DATABASE_URL (or press Enter to skip): " database_url

if [ -n "$database_url" ]; then
    sed -i.bak "s|DATABASE_URL=postgresql://user:password@host:port/dbname|DATABASE_URL=$database_url|" .env
    rm -f .env.bak
    print_success "Database URL configured"
else
    print_warning "Remember to configure DATABASE_URL in .env before starting"
fi

print_header "Setup Complete!"

echo -e "Your portfolio is configured. Next steps:\n"
echo -e "1. ${BLUE}Configure database${NC}"
echo "   Edit .env and set your DATABASE_URL if not done"
echo ""
echo -e "2. ${BLUE}Initialize database${NC}"
echo "   npm run db:push"
echo "   npm run db:seed-sample  # Optional: add demo content"
echo ""
echo -e "3. ${BLUE}Start development server${NC}"
echo "   npm run dev"
echo ""
echo -e "4. ${BLUE}Customize your portfolio${NC}"
echo "   Edit portfolio.config.ts for more customization"
echo "   Use admin dashboard at /admin to manage content"
echo ""

if [ -n "$admin_password" ]; then
    echo -e "${YELLOW}Admin Dashboard Password:${NC} $admin_password"
    echo ""
fi

echo -e "${GREEN}Happy coding!${NC}"
