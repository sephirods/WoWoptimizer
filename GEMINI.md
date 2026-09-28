# Project Rules & Governance

## 1. Modular Architecture & Dynamic Loading (MANDATORY & CORE STANDARD)

- **RECOMMENDED FILE SIZE**: Files should stay under **~1,000 lines of code** for maintainability, clarity, and performance.
- **MODULARIZATION WITH DYNAMIC LOADING**:
  - Keep main pages (e.g. `index.html`, `optimizer.html`) lightweight and clean.
  - Decompose sections and widgets into modular single-responsibility scripts (e.g., `js/ui/dynamic_news.js`, `js/ui/dynamic_footer.js`, `js/ui/tickets_ui.js`).
  - Containers on the page should act as mount points (e.g. `<div id="app-news-container"></div>`), with the JavaScript module dynamically rendering and managing its own DOM, event listeners, and i18n triggers.
- **NO MONOLITHS**: Avoid accumulating massive HTML or JS monoliths into a single file when it can be cleanly structured into reusable, dynamic modules.

## 2. Mobile-First & Responsive Design Standards (MANDATORY)

- **MOBILE-FIRST APPROACH**: Design layouts, buttons, typography, and interactive components mobile-first. Default styling must fit screens from 320px–480px comfortably before scaling up with `sm:`, `md:`, and `lg:`.
- **TOUCH TARGETS & HIT-BOXES**: All clickable elements (buttons, filter tabs, modal close triggers, language selectors) must have minimum touch-friendly targets (`min-h-[38px]`, `px-3`, `py-2`) on mobile.
- **PREVENT HORIZONTAL OVERFLOW**: Ensure `overflow-x: hidden` or appropriate layout constraints (`min-w-0`, `break-words`, `truncate`) on flex items and grids to eliminate horizontal layout breaking on mobile devices.
- **MODAL & DRAWER RESPONSIVENESS**: All modals, popups, and floating sheets must fit mobile viewports (`max-h-[85vh]` to `90vh`, scrollable `overflow-y-auto`, responsive padding `p-4 sm:p-6`).

## 3. Git Operations & Deployment Rules (MANDATORY)

- **READ-ONLY GIT COMMANDS ALLOWED**:
  - Read-only inspection commands (`git status`, `git diff`, `git log`, `git show`, `git branch` [list only]) do NOT require prior approval and can be used freely to check project state.

- **NO MUTATING / STATE-CHANGING GIT COMMANDS WITHOUT USER APPROVAL**:
  - The assistant MUST NEVER execute any command that modifies the Git state (`git commit`, `git add`, `git reset`, `git revert`, `git checkout`, `git clean`, `git merge`, `git rebase`, `git stash`, `git branch -d`, etc.) without explicit, direct authorization from the user.

- **NO GIT PUSH WITHOUT FULL VERIFICATION**:
  - Pushes to remote repositories (`origin/main`, `origin/master`, etc.) are strictly forbidden until the user has performed visual confirmation of all changes, completed personal testing, and explicitly requested a push.

- **NO GIT ROLLBACK OR RESET**:
  - Never run `git reset`, `git revert`, `git checkout .`, or `git clean` without explicit user permission.

- **STRICTLY PROHIBITED TO SUGGEST OR ASK FOR COMMITS/PUSHES (MANDATORY)**:
  - The assistant MUST NEVER ask, suggest, hint, or insist on running `git commit` or `git push` under ANY circumstances.
  - The assistant applies code edits locally and simply confirms what was changed.
  - ONLY when the user explicitly, directly, and on their own initiative orders a commit or push (e.g. "haz commit", "sube los cambios"), may the assistant execute it. Zero prompting from the assistant.

## 4. Workflow Protocol

- Apply edits locally only.
- Present what was modified clearly to the user.
- DO NOT ask to commit or push. Wait silently for the user's explicit command.
- **MANDATORY SCRIPT VERSIONING ON PUSH ONLY (STRICT RULE)**: Script version query parameters (`?v=...`) across HTML files MUST ONLY be incremented/updated when the user explicitly orders a push, NOT on local edits.

## 5. Execution Directives & Interaction Cadence (MANDATORY)

- **MANDATORY TURN 1 RESPONSE & PERMISSION**: The assistant MUST respond to the user on Turn 1 before executing actions, explaining what will be done and requesting permission to proceed. Never execute changes silently.
- **CHECK-IN EVERY 3 TURNS**: Once authorized, provide a clear progress update at least once every 3 turns/actions before continuing, UNLESS the user explicitly states to proceed autonomously until the end.
- **NO SILENT ANALYSIS LOOPS**: Never spend multiple minutes or get trapped in long investigation loops. Report findings directly and maintain constant communication.
- **DIRECT ACTION OVER OVER-VERIFICATION**: Once the root cause is identified and the user approves the solution, apply the code change DIRECTLY. Do NOT launch background test scripts, headless browser simulations, or redundant investigative steps. The user verifies visually in real time; apply and let the user validate.

## 6. Strict Domain Knowledge & Zero Unrequested Game Mechanics Assumptions (MANDATORY)

- **NEVER ASSUME GAME MECHANICS OR INVENT UNREQUESTED RULES**:
  - The assistant is strictly prohibited from assuming, inventing, or hardcoding unrequested game mechanics, class restrictions, artificial item scoring, or priority rules.
  - The user is the sole authority on game mechanics, system requirements, and application behavior.
  - Apply ONLY the exact mathematical rules, constraints, and instructions explicitly provided by the user. Zero unauthorized domain assumptions.
- **MANDATORY GAME CONTEXT (MIDNIGHT SEASON 2 - PATCH 12.1)**:
  - The official expansion, season, and patch of this project is strictly **World of Warcraft: Midnight — Season 2 (Patch 12.1)**.
  - NEVER mention, assume, or reference past expansions (e.g. The War Within, Dragonflight, Shadowlands). All copy, guides, and SEO MUST strictly align with Midnight Season 2 (Patch 12.1).
  - **DEMON HUNTER IN MIDNIGHT**: Demon Hunter has THREE official specializations: **Havoc** (DPS), **Vengeance** (Tank), and **Devourer** (DPS). Never omit Devourer.

## 7. Strict Chat-Only Mode Without Explicit Orders (MANDATORY)

- **CHAT MODE BY DEFAULT**: The assistant is strictly prohibited from invoking any tool, running commands, reading files, or editing code without a direct, textual command from the user.
- **ZERO TOOL CALLS ON CONVERSATIONAL PROMPTS**: If the user asks a question, makes a comment, or gives feedback without explicitly ordering an action, the assistant MUST respond in plain text only. No background inspections, no unprompted git reads, no speculative tool calls.

## 8. Mandatory Bilingual Standard for All Pages, SEO & Schema (MANDATORY)

- **COMPREHENSIVE BILINGUAL SUPPORT (EN & ES)**:
  - Every page, UI element, button, heading, and description MUST be fully translated and integrated into `js/ui/i18n.js` with `data-i18n` (or `data-i18n-html`).
  - **SEO & SOCIAL META MUST BE BILINGUAL**: Include `<link rel="alternate" hreflang="en" ...>`, `<link rel="alternate" hreflang="es" ...>`, and dynamic title/meta description updating when switching languages via `i18n.js`.
  - **SCHEMA.ORG STRUCTURED DATA MUST BE BILINGUAL**: Structured data (JSON-LD) must include bilingual names/descriptions or support multilingual tagging so Google indexes both English and Spanish search queries.

