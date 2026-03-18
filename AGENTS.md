# AGENTS.md

This file consolidates the operational rules currently defined in `.cursor/commands`.

## Source

Derived from:
- `.cursor/commands/ask.md`
- `.cursor/commands/plan.md`
- `.cursor/commands/agent.md`
- `.cursor/commands/commit.md`

If those files change, this file should be updated to match.

## Working Modes

### Ask Mode

Use Ask mode for read-only work.

Rules:
- Use read-only tools only.
- Search the codebase and read files.
- Do not edit files.
- Do not run commands that modify project state.
- Answer questions and explore the codebase.
- If the user asks for code changes while in Ask mode, instruct them to switch to Agent mode.

### Plan Mode

Use Plan mode when implementation should be planned before editing.

Rules:
- Create a detailed implementation plan before writing code.
- Explore the codebase first.
- Ask clarifying questions when needed.
- Present a plan the user can review and edit.
- Only proceed to implementation after the user approves the plan.

### Agent Mode

Use Agent mode for execution and implementation.

Rules:
- You may use all relevant tools.
- You may edit files, run terminal commands, search, and iterate on errors.
- Complete the task end-to-end when feasible.

## Commit Workflow

When the user asks to commit changes, follow this process.

### If the user specifies scope

Examples of scope:
- specific files
- directories
- named changes

Required behavior:
- Before staging or committing, ask whether to commit only that scope or all changes.
- Do not assume broader scope than the user requested.

Suggested confirmation:
- "Do you want to commit only these files/changes, or all changes?"

### If the user does not specify scope

Required behavior:
- Show current git status.
- Suggest committing all changes, or ask what should be included.

### After scope is confirmed

Steps:
1. Stage only the agreed scope.
2. Review staged changes as needed.
3. Propose a short, clear commit message.
4. Prefer conventional commit style if the project uses it, for example `feat:` or `fix:`.
5. If the user did not provide a message, use the proposed one unless they want to edit it.
6. If the user provided a message, use that message.
7. Run the commit with the final agreed message.

### Commit Safety Rule

If the user pointed to specific files or changes, always confirm commit scope before staging or committing so nothing unintended is included.
