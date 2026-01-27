# Ralph Loop - Instruction Guide

> An iterative AI development methodology for Claude Code based on Geoffrey Huntley's Ralph Wiggum technique.

## Table of Contents

1. [What is Ralph Loop?](#what-is-ralph-loop)
2. [Quick Start](#quick-start)
3. [Commands Reference](#commands-reference)
4. [Creating Effective PRDs](#creating-effective-prds)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## What is Ralph Loop?

Ralph Loop is an **iterative development pattern** where the same prompt is fed to Claude repeatedly until a task is complete. Each iteration:

1. Claude receives the **same prompt**
2. Works on the task, modifying files
3. Attempts to complete/exit
4. Stop hook intercepts and re-injects the prompt
5. Claude sees its **previous work** in the files
6. Continues improving until completion criteria met

### The Core Concept

```
while not complete:
    claude receives prompt
    claude sees previous work in files
    claude makes progress
    claude outputs completion promise (or continues)
```

### Why It Works

- **Self-reference through files**: Claude sees its own previous changes
- **Git history as memory**: Commits preserve progress across iterations
- **Deterministic failures**: Predictable failure modes enable systematic prompt tuning
- **Incremental progress**: Each iteration builds on the last

---

## Quick Start

### Starting a Ralph Loop

```
/ralph-loop "Your task description" --max-iterations 10 --completion-promise "DONE"
```

**Example - Adding a feature:**
```
/ralph-loop "Add dark mode toggle to Settings page. Update theme context, add toggle component, persist preference to localStorage. Output <promise>DARK MODE COMPLETE</promise> when working." --max-iterations 15 --completion-promise "DARK MODE COMPLETE"
```

### Canceling a Loop

```
/cancel-ralph
```

This stops the loop immediately and reports how many iterations ran.

---

## Commands Reference

### /ralph-loop

Start an iterative development loop.

**Syntax:**
```
/ralph-loop "<PROMPT>" [OPTIONS]
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `--max-iterations <n>` | Maximum iterations before auto-stop | 10 |
| `--completion-promise <text>` | Text that signals task completion | "COMPLETE" |

**Examples:**

```bash
# Simple task
/ralph-loop "Fix the login bug in auth.ts" --max-iterations 5

# Complex feature with custom completion signal
/ralph-loop "Implement user profile editing with validation" --max-iterations 20 --completion-promise "PROFILE FEATURE DONE"

# Refactoring task
/ralph-loop "Refactor the API client to use async/await instead of callbacks" --completion-promise "REFACTOR COMPLETE"
```

### /cancel-ralph

Cancel the currently running Ralph loop.

**Syntax:**
```
/cancel-ralph
```

**When to use:**
- Task is stuck in a loop
- You realize the prompt needs adjustment
- You want to take manual control

---

## Creating Effective PRDs

Ralph works best with well-structured Product Requirements Documents (PRDs). Each task should be **small enough to complete in one iteration**.

### PRD Structure

```markdown
# Feature: [Name]

## Goal
[One sentence describing the objective]

## User Stories

### US-001: [Small Task Title]
**Description:** As a [user], I want [feature] so that [benefit].

**Acceptance Criteria:**
- [ ] Specific, verifiable criterion
- [ ] Another criterion
- [ ] Tests pass
- [ ] [For UI] Verify visually works

### US-002: [Next Small Task]
...
```

### Right-Sized Tasks

**Good (completable in one iteration):**
- Add a database column and migration
- Add a UI component to an existing page
- Update a function with new logic
- Add a filter dropdown to a list
- Fix a specific bug

**Too Big (split these):**
- "Build the entire dashboard" → Split into schema, queries, components, filters
- "Add authentication" → Split into schema, middleware, login UI, session handling
- "Refactor the API" → Split into one story per endpoint

### Task Ordering

Order by dependencies:
1. **Database/Schema** changes first
2. **Backend/API** logic second
3. **UI components** that use the backend third
4. **Integration/polish** last

### Writing Acceptance Criteria

**Good (verifiable):**
- "Add `status` column with values: pending, active, done"
- "Button shows confirmation dialog before delete"
- "Filter dropdown has options: All, Active, Completed"
- "API returns 401 for unauthenticated requests"

**Bad (vague):**
- "Works correctly"
- "Good user experience"
- "Handles edge cases"
- "Is performant"

---

## Best Practices

### 1. Clear Completion Signals

Always define what "done" looks like:

```
/ralph-loop "Add logout button to header. Output <promise>LOGOUT DONE</promise> when clicking it clears session and redirects to login." --completion-promise "LOGOUT DONE"
```

### 2. Include Quality Checks in Prompt

```
/ralph-loop "Fix type errors in utils.ts. Run 'npm run typecheck' after each change. Output <promise>TYPES FIXED</promise> when no errors." --max-iterations 10
```

### 3. Set Reasonable Iteration Limits

| Task Complexity | Suggested Max Iterations |
|-----------------|--------------------------|
| Simple bug fix | 3-5 |
| Small feature | 5-10 |
| Medium feature | 10-15 |
| Complex refactor | 15-25 |

### 4. Use Git for Safety

Ralph works with your git repository. Before starting:
- Commit or stash current work
- Create a feature branch
- Review changes after loop completes

### 5. Prompt Engineering Tips

**Be specific:**
```
# Bad
"Fix the bug"

# Good
"Fix the null pointer error in UserService.getProfile() that occurs when user.email is undefined. Add null check and return empty string fallback."
```

**Include context:**
```
# Bad
"Add tests"

# Good
"Add unit tests for the calculateTotal function in cart.ts. Test: empty cart returns 0, single item returns item price, multiple items returns sum, discount code reduces total by percentage."
```

---

## Troubleshooting

### Loop Not Stopping

**Symptom:** Ralph keeps iterating even though task seems complete.

**Solutions:**
1. Check the completion promise matches exactly (case-sensitive)
2. Ensure Claude outputs the `<promise>` tag format: `<promise>YOUR TEXT</promise>`
3. Use `/cancel-ralph` and adjust the prompt

### Task Not Making Progress

**Symptom:** Each iteration does the same thing or undoes previous work.

**Solutions:**
1. Make the task smaller and more specific
2. Add explicit steps to the prompt
3. Include "do not revert previous changes" in prompt
4. Check if there's a fundamental blocker (missing dependency, wrong approach)

### Context Getting Too Large

**Symptom:** Claude seems confused or forgets earlier context.

**Solutions:**
1. Reduce max iterations
2. Use `/cancel-ralph` and restart with refined prompt
3. Commit progress and start fresh loop for remaining work

### Prompt Examples That Work Well

**Bug fixing:**
```
/ralph-loop "The login form submits twice when clicking the button rapidly. Add debouncing or disable button during submission. Test by clicking rapidly. Output <promise>BUG FIXED</promise> when double-submit prevented." --max-iterations 5
```

**Feature implementation:**
```
/ralph-loop "Add pagination to the users table. Requirements: 10 items per page, prev/next buttons, current page indicator, disable buttons at boundaries. Output <promise>PAGINATION DONE</promise> when all requirements met." --max-iterations 12
```

**Refactoring:**
```
/ralph-loop "Convert UserContext from class component to functional component with hooks. Maintain all existing functionality. Run tests after changes. Output <promise>REFACTOR COMPLETE</promise> when tests pass." --max-iterations 8
```

---

## How It Differs from Original Ralph

| Aspect | Original Ralph (Amp) | Claude Code Ralph Loop |
|--------|---------------------|------------------------|
| Execution | Spawns separate Amp instances | Stop hook in same session |
| State file | `prd.json` + `progress.txt` | `.claude/.ralph-loop.local.md` |
| Memory | Fresh context each iteration | Continuous session context |
| Trigger | Bash script loop | Skill + hook system |

---

## References

- [Geoffrey Huntley's Ralph Article](https://ghuntley.com/ralph/)
- [Original Ralph Repository](https://github.com/snarktank/ralph)
- [Ralph Orchestrator](https://github.com/mikeyobrien/ralph-orchestrator)

---

*Guide created for Claude Code Ralph Loop integration.*
