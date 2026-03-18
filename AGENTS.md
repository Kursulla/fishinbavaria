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

## Architecture And Boundaries

Architectural discipline is mandatory.

Rules:
- Prefer feature-based structure over type-based global structure.
- Organize code primarily by domain, feature, or application capability.
- Avoid large cross-app folders that collect unrelated components, hooks, utilities, or modules from many domains into one place.
- Each feature/domaine directory should own its relevant parts, for example `components`, `data`, `hooks`, `services`, `utils`, or similar subfolders only when they make sense for that feature.
- Keep files scoped to the feature they belong to unless they are truly shared across the application.
- Extract code into a shared/common location only when it is genuinely cross-feature, stable, and not just temporarily reused by two places.
- When adding new code, first ask which feature/domain owns it, then place it under that feature.
- When refactoring, prefer moving code closer to its feature boundary instead of expanding generic top-level buckets.
- Preserve clear boundaries between UI components, pages, repositories, services, utilities, modules, and data/storage logic.
- Follow SRP strictly: each component, function, class, or module should do one specific job.
- Follow SOLID principles when introducing or changing structure.
- Do not mix unrelated responsibilities into the same unit just because it is convenient.
- UI components must stay focused on presentation and local interaction behavior; avoid coupling them to storage, persistence, repository concerns, or unrelated domain logic.
- Keep data access, state persistence, caching, side effects, and business rules in the appropriate layer.
- Prefer moving cross-cutting or reusable logic into dedicated modules, hooks, services, repositories, or utilities instead of embedding it into presentation components.
- If a proposed change would blur boundaries, choose a cleaner design even if it takes slightly more work.
- When touching existing code that already violates these rules, avoid making it worse; improve separation when reasonably possible within the scope of the task.

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
