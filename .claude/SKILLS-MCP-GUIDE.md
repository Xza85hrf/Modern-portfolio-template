# Skills & MCP Integration Guide

> Leverage external tools, stay up-to-date, and create custom capabilities.

---

## Part 1: MCP Servers (Model Context Protocol)

### What Are MCP Servers?

MCP servers extend Claude Code with external capabilities:
- **Documentation access** (Context7)
- **Service integration** (GitHub, Supabase, Stripe)
- **Browser automation** (Playwright)
- **Project management** (Linear, Notion)

### Loading MCP Tools

MCP tools are deferred (not loaded by default). Load them using ToolSearch:

```
# Direct selection (when you know the tool name)
ToolSearch
query: "select:mcp__github__create_pull_request"

# Search by keyword (when unsure)
ToolSearch
query: "github pull request"
```

### Essential MCP Servers

#### Context7 - Documentation Access

**Purpose:** Get up-to-date documentation for any library.

```
# Step 1: Resolve library ID
mcp__plugin_context7_context7__resolve-library-id
libraryName: "react"

# Step 2: Query documentation
mcp__plugin_context7_context7__query-docs
context7CompatibleLibraryID: "/npm/react"
topic: "useEffect cleanup"
```

**When to use Context7:**
- Before implementing with unfamiliar library
- When debugging framework-specific issues
- When checking for breaking changes
- When learning best practices

#### GitHub

```
# Search code across repositories
mcp__github__search_code
q: "useState cleanup"
per_page: 10

# Get issue details
mcp__github__get_issue
owner: "facebook"
repo: "react"
issue_number: 12345

# Create pull request
mcp__github__create_pull_request
owner: "username"
repo: "project"
title: "feat: Add feature"
body: "Description..."
head: "feature-branch"
base: "main"

# List pull requests
mcp__github__list_pull_requests
owner: "username"
repo: "project"
state: "open"
```

#### Supabase

```
# List tables
mcp__plugin_supabase_supabase__list_tables
project_id: "your-project-id"

# Execute SQL
mcp__plugin_supabase_supabase__execute_sql
project_id: "your-project-id"
query: "SELECT * FROM users LIMIT 10"

# Apply migration
mcp__plugin_supabase_supabase__apply_migration
project_id: "your-project-id"
name: "add_user_roles"
query: "ALTER TABLE users ADD COLUMN role TEXT"

# Generate TypeScript types
mcp__plugin_supabase_supabase__generate_typescript_types
project_id: "your-project-id"
```

#### Playwright Browser

```
# Navigate
mcp__plugin_playwright_playwright__browser_navigate
url: "https://example.com"

# Take snapshot (get element refs)
mcp__plugin_playwright_playwright__browser_snapshot

# Click element
mcp__plugin_playwright_playwright__browser_click
element: "@e5"

# Fill form
mcp__plugin_playwright_playwright__browser_fill_form
element: "@e3"
value: "user@example.com"

# Screenshot
mcp__plugin_playwright_playwright__browser_take_screenshot
path: "/tmp/screenshot.png"

# Close browser
mcp__plugin_playwright_playwright__browser_close
```

#### Sentry

```
# Search issues
mcp__plugin_sentry_sentry__search_issues
query: "is:unresolved level:error"
project: "my-project"

# Get issue details
mcp__plugin_sentry_sentry__get_issue_details
issue_id: "12345"

# Analyze with AI
mcp__plugin_sentry_sentry__analyze_issue_with_seer
issue_id: "12345"
```

#### Linear

```
# Create issue
mcp__plugin_linear_linear__create_issue
title: "Bug: Login not working"
description: "Users report..."
teamId: "TEAM-123"

# List issues
mcp__plugin_linear_linear__list_issues
filter: {state: {name: {eq: "In Progress"}}}
```

#### Stripe

```
# List customers
mcp__plugin_stripe_stripe__list_customers
limit: 10

# Search documentation
mcp__plugin_stripe_stripe__search_stripe_documentation
query: "subscription webhooks"
```

#### Notion

```
# Search pages
mcp__plugin_Notion_notion__notion-search
query: "project roadmap"

# Create page
mcp__plugin_Notion_notion__notion-create-pages
parentId: "page-id"
title: "New Page"
content: "Page content..."
```

#### Firebase

```
# List projects
mcp__plugin_firebase_firebase__firebase_list_projects

# Get SDK config
mcp__plugin_firebase_firebase__firebase_get_sdk_config
project_id: "my-project"
app_type: "web"

# Initialize Firebase
mcp__plugin_firebase_firebase__firebase_init
features: ["firestore", "auth", "functions"]
```

#### Serena (Semantic Code)

```
# Get symbol overview
mcp__plugin_serena_serena__get_symbols_overview
relative_path: "src/services/auth.ts"

# Find symbol
mcp__plugin_serena_serena__find_symbol
name_path_pattern: "AuthService/login"
include_body: true

# Replace symbol body
mcp__plugin_serena_serena__replace_symbol_body
name_path: "AuthService/login"
relative_path: "src/services/auth.ts"
new_body: "async login(email: string, password: string) { ... }"

# Find references
mcp__plugin_serena_serena__find_referencing_symbols
name_path: "AuthService"
```

---

## Part 2: Built-in Skills

### Git Skills

```
/commit                    # Create git commit
/commit -m "message"       # Commit with message
/commit-push-pr            # Commit, push, and create PR
```

### Code Review Skills

```
/code-review               # Review current changes
/review-pr 123             # Review specific PR
```

### Deployment Skills

```
/deploy                    # Deploy to Vercel
/setup                     # Setup Vercel project
/logs                      # View deployment logs
```

### Feature Development

```
/feature-dev               # Guided feature development
```

### Stripe Skills

```
/test-cards                # Show test card numbers
/explain-error CARD_DECLINED  # Explain error codes
```

### Notion Skills

```
/notion-search "query"     # Search Notion
/notion-create-task        # Create task
/notion-find "title"       # Find page
```

### Sentry Skills

```
/seer "query"              # Ask about Sentry environment
/getIssues                 # Get recent issues
```

### Plugin Development

```
/create-plugin             # Create new plugin
/skill-development         # Create skills
/agent-development         # Create agents
/hook-development          # Create hooks
```

---

## Part 3: Creating Custom Skills

### Skill File Structure

Create `.claude/skills/my-skill.md`:

```markdown
---
name: my-skill
description: Brief description for when to invoke
---

# My Custom Skill

## Purpose
[What this skill does]

## Steps
1. First step
2. Second step

## Examples
[Usage examples]
```

### Example: Project Setup Skill

**`.claude/skills/setup-project.md`**

```markdown
---
name: setup-project
description: Initialize a new project with best practices
---

# Project Setup Skill

## Purpose
Set up a new project with:
- Git initialization
- Package manager setup
- Linting/formatting configuration
- Testing framework
- CI/CD basics

## Steps

### 1. Determine Project Type
Ask user:
- Language (TypeScript, Python, Go, etc.)
- Framework (React, FastAPI, etc.)
- Package manager preference

### 2. Initialize Repository
```bash
git init
echo "node_modules/\n.env\n.env.local" > .gitignore
```

### 3. Package Setup
For Node.js:
```bash
npm init -y
npm install -D typescript eslint prettier
```

For Python:
```bash
python -m venv venv
pip install ruff pytest
```

### 4. Configuration Files
Create:
- .eslintrc.js or pyproject.toml
- .prettierrc
- tsconfig.json (if TypeScript)

### 5. Testing Setup
Install and configure testing framework.

### 6. Create README
Generate README.md with:
- Project description
- Setup instructions
- Available scripts
```

### Invoking Custom Skills

```
/setup-project
```

---

## Part 4: Staying Up-to-Date

### The Knowledge Refresh Protocol

**Before implementing with any library:**

```
1. CHECK VERSION
   - Read package.json/requirements.txt
   - Note current version

2. QUERY CONTEXT7
   - Resolve library ID
   - Query for relevant topic
   - Check for version-specific docs

3. WEB SEARCH IF NEEDED
   - Recent changes/announcements
   - Security advisories
   - Community best practices

4. IMPLEMENT
   - Use patterns from current docs
   - Avoid deprecated features
```

### Example Workflow

```
Task: Implement form validation with React Hook Form

Step 1: Check version
Read package.json → react-hook-form: ^7.48.0

Step 2: Query Context7
ToolSearch "select:mcp__plugin_context7_context7__resolve-library-id"
→ libraryName: "react-hook-form"
→ Returns: "/npm/react-hook-form"

mcp__plugin_context7_context7__query-docs
→ context7CompatibleLibraryID: "/npm/react-hook-form"
→ topic: "form validation register"
→ Returns: Current API documentation

Step 3: Implement using current patterns
```

### Deprecation Checking

```
When Context7 or web search reveals deprecation:

1. Note the deprecated API
2. Find the replacement
3. Update implementation
4. Add comment explaining migration if partial
```

---

## Part 5: Agent Development

### Creating Custom Agents

**`.claude/agents/database-optimizer.md`**

```markdown
---
name: database-optimizer
description: Analyze and optimize database performance
tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# Database Optimizer Agent

## Purpose
Analyze database queries and suggest optimizations.

## System Prompt
You are a database optimization expert. Your task is to:
1. Find slow queries in the codebase
2. Analyze query patterns
3. Suggest indexes
4. Identify N+1 problems
5. Recommend query rewrites

## Process
1. Search for database query files
2. Analyze query patterns
3. Check for missing indexes
4. Look for N+1 patterns
5. Generate optimization report
```

### Invoking Agents via Task Tool

```
Task tool:
  subagent_type: "general-purpose"
  prompt: "Analyze the database queries in this project and suggest optimizations"
```

---

## Part 6: MCP Server Configuration

### Adding MCP Servers

In `.mcp.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

### Environment Variables

Create `.env` for tokens (don't commit!):

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxx
```

---

## Quick Reference

### MCP Tool Selection

```
Documentation  → Context7
Git operations → GitHub MCP or gh CLI
Database       → Supabase, Firebase
Payments       → Stripe
Monitoring     → Sentry
PM Tools       → Linear, Notion
Browser        → Playwright
Code Analysis  → Serena
```

### Skill Invocation

```
/skill-name           # Run skill
/skill-name args      # With arguments
```

### Context7 Pattern

```
1. ToolSearch "select:mcp__plugin_context7_context7__resolve-library-id"
2. Call with libraryName
3. ToolSearch "select:mcp__plugin_context7_context7__query-docs"
4. Call with ID and topic
```

---

*Part of the Agent Enhancement Kit for world-class coding agents.*
