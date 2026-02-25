---
description: Commit changes – with optional scope; confirm scope when user specifies files
---

When the user asks to commit:

1. **If they give direction** (e.g. specific files, paths, or which changes to include):
   - Before staging or committing, ask: "Do you want to commit only these files/changes, or all changes?"
   - Proceed with staging and commit based on their answer (only the specified scope, or everything).

2. **If they don't specify what to commit**:
   - Show current status (e.g. `git status`) and suggest committing all changes, or ask what they want to include.

3. **Then**:
   - Stage the agreed scope (`git add` only those paths or `git add -A` for all).
   - **Propose a commit message**: Based on the staged changes (e.g. from `git diff --staged` or file names), suggest a short, clear commit message (conventional style if the project uses it, e.g. `feat:`, `fix:`). Show the proposed message to the user.
   - If they didn't provide a message: use your proposed message unless they want to edit it. If they gave a message, use that.
   - Run `git commit` with the final message.

Always confirm the commit scope when the user has pointed at specific files or changes, so nothing unintended gets committed.
