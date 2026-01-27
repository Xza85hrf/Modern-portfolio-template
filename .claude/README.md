# Agent Enhancement Kit

> Transform any project into having a world-class AI coding agent.
> Drop these files into your project for expert-level code assistance.

---

## Quick Setup

### 1. Copy Files to Your Project

```bash
# Copy the entire portable-kit to your project
cp -r Agent_Guide/portable-kit/* /path/to/your-project/.claude/

# Or selectively copy what you need
cp CLAUDE.md /path/to/your-project/CLAUDE.md
cp -r portable-kit/*.md /path/to/your-project/Agent_Guide/
```

### 2. Required Files

| File | Location | Purpose |
|------|----------|---------|
| `CLAUDE.md` | Project root | Core agent configuration |
| `CRITICAL-THINKING.md` | `.claude/` or `Agent_Guide/` | Analysis frameworks |
| `SKILLS-MCP-GUIDE.md` | `.claude/` or `Agent_Guide/` | Tool integration |
| `QUALITY-HOOKS.md` | `.claude/` | Hook configurations |
| `ERROR-CATALOG.md` | `.claude/` | Error documentation |
| `CODE-SNIPPETS.md` | `.claude/` | Reusable patterns |

### 3. Set Up Hooks (Optional)

```bash
# Create hooks directory
mkdir -p .claude/hooks

# Copy hook scripts from QUALITY-HOOKS.md
# Make them executable
chmod +x .claude/hooks/*.sh

# Create settings file
cat > .claude/settings.local.json << 'EOF'
{
  "hooks": {
    "PreToolUse": [],
    "PostToolUse": []
  }
}
EOF
```

### 4. Configure MCP Servers (Optional)

Create `.mcp.json` in project root:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    }
  }
}
```

---

## What's Included

### CLAUDE.md - Core Agent Configuration

The brain of the system. Includes:
- Expert programmer identity
- Critical thinking frameworks (5 Whys, STOP→THINK→PLAN→ACT→VERIFY)
- Problem-solving methodology (IDEAL framework)
- Quality standards and checklists
- Up-to-date knowledge protocol (Context7 integration)
- Security and performance mindsets

**Key Feature:** Project-specific section at the bottom for customization.

### CRITICAL-THINKING.md - Analysis Frameworks

Deep dive into analytical methods:
- Socratic questioning
- Root cause analysis (5 Whys, Fishbone)
- Systems thinking
- Decision matrices
- Trade-off analysis
- Debugging protocols (Scientific Method, Binary Search)
- Architecture thinking (C4 Model, ADRs)
- Cognitive bias awareness

### SKILLS-MCP-GUIDE.md - Tool Integration

Complete reference for:
- All MCP servers (Context7, GitHub, Supabase, etc.)
- Built-in skills (/commit, /review-pr, etc.)
- Creating custom skills
- Creating custom agents
- Staying up-to-date with libraries

### QUALITY-HOOKS.md - Automated Checks

Pre-configured hooks for:
- Blocking dangerous git commands
- Detecting secrets in code
- Running linters after edits
- Type checking TypeScript
- Commit message validation
- File size limits
- Test reminders

### ERROR-CATALOG.md - Error Documentation

Template with common errors:
- JavaScript/TypeScript errors
- Python errors
- Database errors
- Git errors
- Network errors
- Build/Deploy errors

**Add project-specific errors as you encounter them.**

### CODE-SNIPPETS.md - Reusable Patterns

Ready-to-use code patterns:
- React components (forms, modals, hooks)
- FastAPI endpoints (CRUD, background tasks)
- Utility functions (debounce, retry, formatting)
- Configuration patterns
- Testing patterns

**Add project-specific patterns as you develop them.**

---

## Customization Guide

### Personalizing CLAUDE.md

Edit the "Project-Specific Section" at the bottom:

```markdown
## Project-Specific Section

### Naming Conventions
- Components: PascalCase
- Files: kebab-case
- Constants: UPPER_SNAKE_CASE

### API Conventions
- RESTful endpoints under /api
- Use Pydantic for validation
- Return {data, error, message} format

### Testing Requirements
- Minimum 80% coverage
- E2E tests for critical flows
```

### Adding Project Errors

When you solve a new error, add it to ERROR-CATALOG.md:

```markdown
### ERROR: [Your error message]

**Symptoms:**
[What happens]

**Cause:**
[Why it happens]

**Solution:**
[How to fix]

**Prevention:**
[How to avoid]
```

### Adding Code Patterns

When you create reusable code, add it to CODE-SNIPPETS.md:

```markdown
### [Pattern Name]

[Description of when to use]

```language
[Code here]
```
```

---

## Best Practices

### 1. Keep CLAUDE.md Updated

As you learn project conventions, add them to the Project-Specific Section.

### 2. Document Errors Immediately

When you solve a tricky error, document it before moving on.

### 3. Extract Patterns

If you write similar code twice, extract it to CODE-SNIPPETS.md.

### 4. Use Context7 Religiously

Before implementing with any library:
1. Resolve library ID
2. Query current documentation
3. Implement with current best practices

### 5. Enable Relevant Hooks

Start with non-blocking hooks (warnings) and graduate to blocking hooks.

---

## File Locations Reference

```
your-project/
├── CLAUDE.md                      # Core agent config (root)
├── .claude/
│   ├── settings.local.json        # Hook configuration
│   ├── hooks/
│   │   ├── block-dangerous-git.sh
│   │   ├── check-secrets.sh
│   │   └── ...
│   └── skills/
│       └── custom-skill.md
├── Agent_Guide/                    # Or .claude/guides/
│   ├── CRITICAL-THINKING.md
│   ├── SKILLS-MCP-GUIDE.md
│   ├── ERROR-CATALOG.md
│   └── CODE-SNIPPETS.md
└── .mcp.json                       # MCP server config
```

---

## Verification Checklist

After setup, verify:

- [ ] CLAUDE.md is in project root
- [ ] Agent can find and read CLAUDE.md
- [ ] MCP servers connect (if configured)
- [ ] Hooks execute (if configured)
- [ ] Context7 resolves libraries

---

## Support

If you encounter issues:

1. Check file locations match expected paths
2. Verify file permissions (especially hooks)
3. Test MCP connections independently
4. Review hook output for errors

---

*Created for world-class AI-assisted software development.*
