# Quality Hooks System

> Automated quality checks that run during agent operations.
> Prevents common mistakes and enforces standards.

---

## Overview

Hooks intercept agent actions and can:
- **Block** dangerous operations
- **Warn** about potential issues
- **Enhance** with additional context
- **Log** for audit trails

---

## Hook Configuration

### Location

Create `.claude/settings.local.json` in your project:

```json
{
  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "Stop": [],
    "UserPromptSubmit": []
  }
}
```

### Hook Structure

```json
{
  "matcher": "ToolName",
  "command": "/path/to/script.sh",
  "timeout": 5000
}
```

---

## Essential Quality Hooks

### 1. Prevent Unread File Edits

Blocks editing files that haven't been read first.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "command": ".claude/hooks/check-file-read.sh"
      }
    ]
  }
}
```

**Script: `.claude/hooks/check-file-read.sh`**
```bash
#!/bin/bash
# Checks if file was read before editing

FILE_PATH="$CLAUDE_TOOL_INPUT_FILE_PATH"

# Check if file exists in read history
if ! grep -q "$FILE_PATH" .claude/read-history.log 2>/dev/null; then
  echo '{"decision": "block", "message": "File not read yet. Please Read the file first before editing."}'
  exit 0
fi

echo '{"decision": "continue"}'
```

### 2. Block Dangerous Git Commands

Prevents destructive git operations.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": ".claude/hooks/block-dangerous-git.sh"
      }
    ]
  }
}
```

**Script: `.claude/hooks/block-dangerous-git.sh`**
```bash
#!/bin/bash

COMMAND="$CLAUDE_TOOL_INPUT_COMMAND"

# Dangerous patterns
if echo "$COMMAND" | grep -qE "git (push.*--force|reset --hard|checkout \.|clean -f|branch -D)"; then
  echo '{"decision": "block", "message": "Blocked: Destructive git command requires explicit user approval."}'
  exit 0
fi

echo '{"decision": "continue"}'
```

### 3. No Secrets in Code

Warns when files might contain secrets.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": ".claude/hooks/check-secrets.sh"
      }
    ]
  }
}
```

**Script: `.claude/hooks/check-secrets.sh`**
```bash
#!/bin/bash

FILE_PATH="$CLAUDE_TOOL_INPUT_FILE_PATH"

# Secret patterns
PATTERNS="(api[_-]?key|secret|password|token|credential|private[_-]?key).*=.*['\"][^'\"]{8,}"

if grep -qEi "$PATTERNS" "$FILE_PATH" 2>/dev/null; then
  echo '{"decision": "continue", "message": "WARNING: Possible secret detected in file. Ensure no actual credentials are committed."}'
  exit 0
fi

echo '{"decision": "continue"}'
```

### 4. Run Linter After Edits

Auto-runs linter after code changes.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": ".claude/hooks/run-linter.sh"
      }
    ]
  }
}
```

**Script: `.claude/hooks/run-linter.sh`**
```bash
#!/bin/bash

FILE_PATH="$CLAUDE_TOOL_INPUT_FILE_PATH"
EXT="${FILE_PATH##*.}"

case "$EXT" in
  ts|tsx|js|jsx)
    OUTPUT=$(npx eslint "$FILE_PATH" 2>&1)
    ;;
  py)
    OUTPUT=$(python -m ruff check "$FILE_PATH" 2>&1)
    ;;
  *)
    echo '{"decision": "continue"}'
    exit 0
    ;;
esac

if [ $? -ne 0 ]; then
  echo "{\"decision\": \"continue\", \"message\": \"Lint issues:\\n$OUTPUT\"}"
else
  echo '{"decision": "continue"}'
fi
```

### 5. Type Check After TypeScript Changes

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": ".claude/hooks/type-check.sh"
      }
    ]
  }
}
```

**Script: `.claude/hooks/type-check.sh`**
```bash
#!/bin/bash

FILE_PATH="$CLAUDE_TOOL_INPUT_FILE_PATH"

# Only for TypeScript files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
  echo '{"decision": "continue"}'
  exit 0
fi

OUTPUT=$(npx tsc --noEmit 2>&1 | head -20)

if [ $? -ne 0 ]; then
  echo "{\"decision\": \"continue\", \"message\": \"Type errors detected:\\n$OUTPUT\"}"
else
  echo '{"decision": "continue"}'
fi
```

### 6. Commit Message Validation

Ensures proper commit message format.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": ".claude/hooks/validate-commit.sh"
      }
    ]
  }
}
```

**Script: `.claude/hooks/validate-commit.sh`**
```bash
#!/bin/bash

COMMAND="$CLAUDE_TOOL_INPUT_COMMAND"

# Check if it's a commit command
if ! echo "$COMMAND" | grep -q "git commit"; then
  echo '{"decision": "continue"}'
  exit 0
fi

# Extract commit message
MSG=$(echo "$COMMAND" | grep -oP '(?<=-m ["\047]).*(?=["\047])')

# Validate format (type: description)
if ! echo "$MSG" | grep -qE "^(feat|fix|refactor|docs|test|chore|style): .+"; then
  echo '{"decision": "block", "message": "Commit message should follow format: type: description\nTypes: feat, fix, refactor, docs, test, chore, style"}'
  exit 0
fi

# Check for Co-Authored-By
if ! echo "$COMMAND" | grep -q "Co-Authored-By"; then
  echo '{"decision": "continue", "message": "Remember to add Co-Authored-By line for Claude contributions."}'
  exit 0
fi

echo '{"decision": "continue"}'
```

### 7. Prevent Large File Creation

Blocks creating files that are too large.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "command": ".claude/hooks/check-file-size.sh"
      }
    ]
  }
}
```

**Script: `.claude/hooks/check-file-size.sh`**
```bash
#!/bin/bash

CONTENT="$CLAUDE_TOOL_INPUT_CONTENT"
MAX_LINES=500

LINE_COUNT=$(echo "$CONTENT" | wc -l)

if [ "$LINE_COUNT" -gt "$MAX_LINES" ]; then
  echo "{\"decision\": \"block\", \"message\": \"File has $LINE_COUNT lines. Consider splitting into smaller files (max $MAX_LINES lines recommended).\"}"
  exit 0
fi

echo '{"decision": "continue"}'
```

### 8. Test Reminder for Code Changes

Reminds to run tests after significant changes.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "command": ".claude/hooks/test-reminder.sh"
      }
    ]
  }
}
```

**Script: `.claude/hooks/test-reminder.sh`**
```bash
#!/bin/bash

FILE_PATH="$CLAUDE_TOOL_INPUT_FILE_PATH"

# Skip test files
if echo "$FILE_PATH" | grep -qE "\.(test|spec)\.(ts|tsx|js|py)$"; then
  echo '{"decision": "continue"}'
  exit 0
fi

# Check if corresponding test exists
TEST_FILE="${FILE_PATH%.*}.test.${FILE_PATH##*.}"
SPEC_FILE="${FILE_PATH%.*}.spec.${FILE_PATH##*.}"

if [ ! -f "$TEST_FILE" ] && [ ! -f "$SPEC_FILE" ]; then
  echo '{"decision": "continue", "message": "No test file found for this file. Consider adding tests."}'
else
  echo '{"decision": "continue", "message": "Remember to run tests: npm test or pytest"}'
fi
```

---

## Complete Settings Template

**`.claude/settings.local.json`**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": ".claude/hooks/block-dangerous-git.sh",
        "timeout": 5000
      },
      {
        "matcher": "Bash",
        "command": ".claude/hooks/validate-commit.sh",
        "timeout": 5000
      },
      {
        "matcher": "Write",
        "command": ".claude/hooks/check-file-size.sh",
        "timeout": 5000
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": ".claude/hooks/check-secrets.sh",
        "timeout": 5000
      },
      {
        "matcher": "Write|Edit",
        "command": ".claude/hooks/run-linter.sh",
        "timeout": 30000
      },
      {
        "matcher": "Edit",
        "command": ".claude/hooks/test-reminder.sh",
        "timeout": 5000
      }
    ],
    "Stop": [],
    "UserPromptSubmit": []
  }
}
```

---

## Setup Script

**`.claude/hooks/setup.sh`**

Run this to set up hooks for a new project:

```bash
#!/bin/bash

# Create hooks directory
mkdir -p .claude/hooks

# Copy hook scripts
SCRIPTS=(
  "block-dangerous-git.sh"
  "check-secrets.sh"
  "run-linter.sh"
  "type-check.sh"
  "validate-commit.sh"
  "check-file-size.sh"
  "test-reminder.sh"
)

for script in "${SCRIPTS[@]}"; do
  if [ -f ".claude/hooks/$script" ]; then
    chmod +x ".claude/hooks/$script"
    echo "✓ Made $script executable"
  fi
done

echo ""
echo "Hooks setup complete!"
echo "Edit .claude/settings.local.json to enable/disable hooks."
```

---

## Custom Hook Development

### Hook Input Variables

```bash
# Available environment variables:
CLAUDE_TOOL_NAME          # Name of the tool being used
CLAUDE_TOOL_INPUT_*       # Tool input parameters (varies by tool)
CLAUDE_SESSION_ID         # Current session ID
CLAUDE_WORKING_DIR        # Current working directory
```

### Hook Output Format

```json
// Continue execution
{"decision": "continue"}

// Continue with message
{"decision": "continue", "message": "Information for the agent"}

// Block execution
{"decision": "block", "message": "Reason for blocking"}
```

### Testing Hooks

```bash
# Test a hook script manually
export CLAUDE_TOOL_INPUT_COMMAND="git push --force"
./.claude/hooks/block-dangerous-git.sh

# Expected output:
# {"decision": "block", "message": "..."}
```

---

## Hookify Integration

Use `/hookify` to create hooks from conversation:

```
/hookify "Always run tests before committing"
/hookify "Never edit package.json directly"
/hookify "Check for console.log before committing"
```

Manage hookify rules:

```
/hookify:list        # List all rules
/hookify:configure   # Enable/disable rules
/hookify:help        # Get help
```

---

## Best Practices

1. **Keep hooks fast** - Use timeout of 5-30 seconds
2. **Fail open** - If hook fails, default to continue
3. **Be specific** - Use precise matchers
4. **Log sparingly** - Only warn for real issues
5. **Test thoroughly** - Verify hooks work before relying on them

---

*Part of the Agent Enhancement Kit for world-class coding agents.*
