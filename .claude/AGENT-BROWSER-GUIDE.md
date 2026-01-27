# Agent Browser - Instruction Guide

> AI-optimized browser automation for Claude Code using Vercel Labs' agent-browser CLI.

## Table of Contents

1. [What is Agent Browser?](#what-is-agent-browser)
2. [Quick Start](#quick-start)
3. [Commands Reference](#commands-reference)
4. [The Snapshot Workflow](#the-snapshot-workflow)
5. [Common Tasks](#common-tasks)
6. [Session Management](#session-management)
7. [Authentication](#authentication)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## What is Agent Browser?

Agent Browser is a **headless browser automation CLI** built specifically for AI agents by Vercel Labs. Unlike traditional browser automation tools, it's designed with AI workflows in mind.

### The Core Concept

```
1. Navigate to URL
2. Get snapshot with element refs (@e1, @e2, @e3...)
3. Interact using refs
4. Repeat as needed
```

### Why It Works for AI

- **Deterministic refs**: Elements get stable identifiers (`@e1`, `@e2`) that are fast to reference
- **Accessibility tree**: Snapshots show the page structure optimized for AI comprehension
- **Token efficient**: Compact output designed to fit in context windows
- **Session isolation**: Run multiple parallel browser instances without conflicts

### Agent Browser vs Playwright MCP

| Feature | Agent Browser | Playwright MCP |
|---------|---------------|----------------|
| **Design** | Built for AI agents | General-purpose automation |
| **Element selection** | Refs (`@e1, @e2`) | CSS/XPath selectors |
| **Interface** | CLI commands | MCP protocol |
| **Transparency** | Commands visible in logs | Protocol abstraction |
| **Learning curve** | Simple workflow | Complex API |
| **Output size** | Compact, token-efficient | Verbose JSON |

---

## Quick Start

### Installation

Agent browser is installed globally. Verify with:

```bash
agent-browser --version
```

If not installed:
```bash
npm install -g agent-browser
agent-browser install              # Download Chromium
agent-browser install --with-deps  # Linux: install system deps
```

### Your First Browse

```bash
# 1. Open a page
agent-browser open "https://example.com"

# 2. See what's on the page (interactive elements)
agent-browser snapshot -i

# 3. Click a link (using ref from snapshot)
agent-browser click @e1

# 4. Done? Close the browser
agent-browser close
```

### Using Claude Code Commands

```
/browse https://news.ycombinator.com    # Browse a website
/screenshot https://example.com          # Take a screenshot
/browser-install                         # Install agent-browser
```

---

## Commands Reference

### Navigation

| Command | Description | Example |
|---------|-------------|---------|
| `open <url>` | Open URL in new browser | `agent-browser open "https://google.com"` |
| `goto <url>` | Navigate to URL (same session) | `agent-browser goto "https://google.com/search"` |
| `back` | Go back in history | `agent-browser back` |
| `forward` | Go forward in history | `agent-browser forward` |
| `reload` | Reload current page | `agent-browser reload` |

### Snapshots

| Command | Description | Example |
|---------|-------------|---------|
| `snapshot` | Full page snapshot | `agent-browser snapshot` |
| `snapshot -i` | Interactive elements only | `agent-browser snapshot -i` |
| `snapshot -c` | Compact (remove empties) | `agent-browser snapshot -i -c` |
| `snapshot -d <n>` | Limit depth | `agent-browser snapshot -i -d 3` |
| `snapshot -s <sel>` | Scope to selector | `agent-browser snapshot -i -s "#main"` |

### Element Interaction

| Command | Description | Example |
|---------|-------------|---------|
| `click @eN` | Click element | `agent-browser click @e5` |
| `dblclick @eN` | Double-click | `agent-browser dblclick @e5` |
| `fill @eN "text"` | Fill input field | `agent-browser fill @e3 "hello@example.com"` |
| `type @eN "text"` | Type with key events | `agent-browser type @e3 "search query"` |
| `press <key>` | Press keyboard key | `agent-browser press Enter` |
| `hover @eN` | Hover over element | `agent-browser hover @e7` |
| `select @eN "value"` | Select dropdown option | `agent-browser select @e4 "option1"` |
| `check @eN` | Check checkbox | `agent-browser check @e6` |
| `uncheck @eN` | Uncheck checkbox | `agent-browser uncheck @e6` |

### Content Extraction

| Command | Description | Example |
|---------|-------------|---------|
| `get text <sel>` | Get text content | `agent-browser get text "#article"` |
| `get html <sel>` | Get HTML content | `agent-browser get html "#content"` |
| `get value <sel>` | Get input value | `agent-browser get value "#email"` |
| `get title` | Get page title | `agent-browser get title` |
| `get url` | Get current URL | `agent-browser get url` |
| `get attr <sel> <attr>` | Get attribute | `agent-browser get attr "#link" href` |

### Waiting

| Command | Description | Example |
|---------|-------------|---------|
| `wait <selector>` | Wait for element | `agent-browser wait "#results"` |
| `wait <ms>` | Wait milliseconds | `agent-browser wait 2000` |
| `wait --text "str"` | Wait for text | `agent-browser wait --text "Success"` |
| `wait --load networkidle` | Wait for page load | `agent-browser wait --load networkidle` |

### Screenshots

| Command | Description | Example |
|---------|-------------|---------|
| `screenshot --path <p>` | Full page screenshot | `agent-browser screenshot --path /tmp/page.png` |
| `screenshot -s <sel>` | Element screenshot | `agent-browser screenshot --path /tmp/el.png -s "#hero"` |

### Semantic Locators

Find elements without needing refs first:

| Command | Description | Example |
|---------|-------------|---------|
| `find role <role> click` | By ARIA role | `agent-browser find role button --name "Submit" click` |
| `find text <text> click` | By text content | `agent-browser find text "Learn more" click` |
| `find label <label> fill` | By label | `agent-browser find label "Email" fill "test@example.com"` |
| `find placeholder <ph> fill` | By placeholder | `agent-browser find placeholder "Search..." fill "query"` |
| `find testid <id> click` | By test ID | `agent-browser find testid "submit-btn" click` |

### Browser Management

| Command | Description | Example |
|---------|-------------|---------|
| `close` | Close browser | `agent-browser close` |
| `set viewport <w> <h>` | Set viewport size | `agent-browser set viewport 1920 1080` |
| `set device <name>` | Emulate device | `agent-browser set device "iPhone 14"` |
| `set media dark` | Set color scheme | `agent-browser set media dark` |
| `set offline on` | Enable offline mode | `agent-browser set offline on` |

---

## The Snapshot Workflow

The snapshot is the **most important concept** in agent-browser. It returns the page's accessibility tree with element refs.

### Understanding Refs

When you run `agent-browser snapshot -i`, you get output like:

```
- link "Home" [ref=e1]
- link "About" [ref=e2]
- textbox "Email" [ref=e3]
- textbox "Password" [ref=e4]
- button "Login" [ref=e5]
- link "Forgot password?" [ref=e6]
```

Each `[ref=eN]` is a stable identifier you can use for interactions:

```bash
agent-browser fill @e3 "user@example.com"
agent-browser fill @e4 "mypassword"
agent-browser click @e5
```

### Snapshot Flags

| Flag | Purpose | When to Use |
|------|---------|-------------|
| `-i` | Interactive only | Most tasks (buttons, links, inputs) |
| `-c` | Compact | Large pages with empty containers |
| `-d <n>` | Depth limit | Very nested pages |
| `-s <sel>` | Scope | Focus on specific section |

### Recommended Combinations

```bash
# Default for most pages
agent-browser snapshot -i

# Large/complex pages
agent-browser snapshot -i -c

# Very large pages (news sites, feeds)
agent-browser snapshot -i -c -d 3

# Specific section only
agent-browser snapshot -i -s "#main-content"
```

### When to Re-Snapshot

**Always re-snapshot after:**
- Clicking something that changes the page
- Form submissions
- Navigation
- AJAX content loading

```bash
agent-browser click @e5           # Click "Load More"
agent-browser wait --load networkidle
agent-browser snapshot -i         # Get new refs!
```

---

## Common Tasks

### Login to a Website

```bash
# Navigate
agent-browser open "https://app.example.com/login"
agent-browser wait --load networkidle

# Get form elements
agent-browser snapshot -i

# Fill credentials (use refs from snapshot)
agent-browser fill @e3 "username@example.com"
agent-browser fill @e4 "password123"
agent-browser click @e5

# Wait for redirect
agent-browser wait --load networkidle

# Verify logged in
agent-browser get url
```

### Search and Extract Results

```bash
# Open search page
agent-browser open "https://google.com"
agent-browser snapshot -i

# Type search query
agent-browser fill @e1 "agent browser vercel"
agent-browser press Enter

# Wait for results
agent-browser wait "#search"
agent-browser wait --load networkidle

# Extract results
agent-browser get text "#search"
```

### Fill a Multi-Step Form

```bash
# Step 1: Personal info
agent-browser open "https://form.example.com"
agent-browser snapshot -i
agent-browser fill @e3 "John Doe"
agent-browser fill @e4 "john@example.com"
agent-browser click @e5  # Next button

# Step 2: Address (page changed, re-snapshot!)
agent-browser wait --load networkidle
agent-browser snapshot -i
agent-browser fill @e3 "123 Main St"
agent-browser fill @e4 "New York"
agent-browser select @e5 "NY"
agent-browser click @e6  # Submit
```

### Scrape a Table

```bash
# Navigate to data page
agent-browser open "https://data.example.com/table"
agent-browser wait "#data-table"

# Extract table content
agent-browser get text "#data-table"

# Or get HTML for parsing
agent-browser get html "#data-table" --json
```

### Take Documentation Screenshots

```bash
# Navigate
agent-browser open "https://docs.example.com"
agent-browser wait --load networkidle

# Full page
agent-browser screenshot --path /tmp/docs-full.png

# Specific section
agent-browser screenshot --path /tmp/docs-hero.png -s "#hero"

# Mobile view
agent-browser set device "iPhone 14"
agent-browser screenshot --path /tmp/docs-mobile.png
```

### Monitor for Changes

```bash
# Open page
agent-browser open "https://status.example.com"

# Check for specific text
agent-browser wait --text "All Systems Operational"

# If found, extract status
agent-browser get text "#status-message"
```

---

## Session Management

Sessions allow isolated browser instances with separate cookies, history, and auth state.

### Creating Sessions

```bash
# All commands in same session share state
agent-browser open "https://site1.com" --session project1
agent-browser --session project1 snapshot -i
agent-browser --session project1 click @e3

# Different session for parallel work
agent-browser open "https://site2.com" --session project2
agent-browser --session project2 snapshot -i
```

### Session Benefits

| Use Case | How Sessions Help |
|----------|-------------------|
| Parallel browsing | Run multiple independent browsers |
| Auth isolation | Different accounts in different sessions |
| Testing | Fresh state per test scenario |
| Long-running tasks | Persist state across commands |

### Session Tips

1. **Name sessions meaningfully**: `--session github-review`, `--session slack-monitor`
2. **Close when done**: `agent-browser --session myproject close`
3. **Default session**: Without `--session`, uses a default session

---

## Authentication

### Method 1: Fill Login Form

```bash
agent-browser open "https://app.com/login"
agent-browser snapshot -i
agent-browser fill @e3 "user@example.com"
agent-browser fill @e4 "password"
agent-browser click @e5
agent-browser wait --load networkidle
```

### Method 2: API Token via Headers

```bash
# For APIs or sites that accept Bearer tokens
agent-browser open "https://api.example.com/dashboard" \
  --headers '{"Authorization": "Bearer YOUR_TOKEN_HERE"}'
```

> **Security**: Headers are scoped to the origin—they won't leak to other domains.

### Method 3: Save/Load Auth State

```bash
# After logging in, save the state
agent-browser state save myapp-auth.json

# Later, restore authenticated session
agent-browser state load myapp-auth.json
agent-browser open "https://app.com/dashboard"
```

### Method 4: Set Cookies Directly

```bash
# Set session cookie
agent-browser cookies set "session_id" "abc123xyz" --domain "example.com"

# Verify cookies
agent-browser cookies
```

---

## Best Practices

### 1. Always Snapshot Before Acting

```bash
# Good
agent-browser open "https://example.com"
agent-browser snapshot -i
agent-browser click @e5

# Bad - using old refs or guessing
agent-browser click @e5  # Might not exist!
```

### 2. Wait Appropriately

```bash
# After navigation
agent-browser goto "https://example.com/page2"
agent-browser wait --load networkidle

# After clicks that load content
agent-browser click @e5
agent-browser wait "#new-content"

# After form submissions
agent-browser click @submit
agent-browser wait --text "Success"
```

### 3. Use Compact Snapshots for Large Pages

```bash
# News sites, social feeds, complex apps
agent-browser snapshot -i -c -d 3
```

### 4. Handle Dynamic Content

```bash
# Wait for specific element
agent-browser wait "#dynamic-content"

# Wait for loading to finish
agent-browser wait --load networkidle

# Wait for text to appear
agent-browser wait --text "Results loaded"
```

### 5. Clean Up When Done

```bash
# Always close to free resources
agent-browser close

# Or close specific session
agent-browser --session myproject close
```

### 6. Use JSON Output for Parsing

```bash
# Get structured output
agent-browser snapshot -i --json | jq '.elements'
agent-browser get text "#data" --json
```

### 7. Debug with Headed Mode

```bash
# Show browser window for debugging
agent-browser open "https://example.com" --headed
```

---

## Troubleshooting

### Element Not Found

**Symptom:** `Error: Element @e5 not found`

**Solutions:**
1. Re-run `snapshot -i` to get fresh refs
2. Check if page has changed (AJAX, navigation)
3. Wait for element: `agent-browser wait "#element"`
4. Use semantic locator as fallback: `agent-browser find role button --name "Submit" click`

### Page Not Loading

**Symptom:** Timeout or blank page

**Solutions:**
1. Check URL is correct and accessible
2. Wait longer: `agent-browser wait --load networkidle`
3. Try explicit wait: `agent-browser wait 5000`
4. Check network: `agent-browser set offline off`

### Browser Won't Start

**Symptom:** `Error: Browser failed to launch`

**Solutions:**
1. Re-install Chromium: `agent-browser install`
2. Install Linux deps: `agent-browser install --with-deps`
3. Check disk space for browser cache
4. Try: `npx playwright install chromium`

### Session State Lost

**Symptom:** Logged out unexpectedly, cookies gone

**Solutions:**
1. Use named sessions: `--session myproject`
2. Save auth state: `agent-browser state save auth.json`
3. Check for session timeout on website
4. Re-authenticate and save state

### Slow Performance

**Symptom:** Commands taking too long

**Solutions:**
1. Use compact snapshots: `snapshot -i -c`
2. Limit depth: `snapshot -i -d 3`
3. Scope to section: `snapshot -i -s "#main"`
4. Close unused sessions

### Commands Reference Card

```bash
# NAVIGATION
agent-browser open "URL"              # Open new page
agent-browser goto "URL"              # Navigate (same session)
agent-browser back                    # Go back
agent-browser forward                 # Go forward
agent-browser reload                  # Reload page

# INSPECTION
agent-browser snapshot -i             # Get interactive elements
agent-browser snapshot -i -c          # Compact snapshot
agent-browser get text "selector"     # Extract text
agent-browser get title               # Get page title
agent-browser get url                 # Get current URL

# INTERACTION
agent-browser click @eN               # Click element
agent-browser fill @eN "text"         # Fill input
agent-browser type @eN "text"         # Type with keys
agent-browser press Enter             # Press key
agent-browser select @eN "value"      # Select option

# WAITING
agent-browser wait "#element"         # Wait for element
agent-browser wait --text "string"    # Wait for text
agent-browser wait --load networkidle # Wait for page load
agent-browser wait 2000               # Wait milliseconds

# SCREENSHOTS
agent-browser screenshot --path /tmp/shot.png

# SESSION
agent-browser open "URL" --session name
agent-browser --session name close
agent-browser close                   # Close default session
```

---

## How Agent Browser Fits in Claude Code

### As a Skill

The `browse` skill is loaded when you need browser automation. It provides comprehensive guidance on using agent-browser commands.

### As an Agent

The `web-browser` agent can be invoked via the Task tool for autonomous multi-step browsing:

```
"Use the web-browser agent to research competitor pricing on their website"
```

### As Commands

Quick access via slash commands:
- `/browse <url>` - Browse a website
- `/screenshot <url>` - Take a screenshot
- `/browser-install` - Install agent-browser

---

## References

- [Agent Browser Repository](https://github.com/vercel-labs/agent-browser)
- [Playwright (underlying engine)](https://playwright.dev/)
- [Accessibility Tree](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree)

---

*Guide created for Claude Code Agent Browser integration.*
