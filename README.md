# Prompt Memory

Prompt Memory is a local-first developer tool for detecting duplicate or near-duplicate AI prompts.

The goal is to help developers answer:

> Have I already asked something like this before, in this project or context?

## Problem

Developers often use multiple AI coding tools across different projects. Prompt history becomes scattered, repeated, and hard to reuse.

This project stores prompt history locally and warns when a new prompt looks similar to a previous one.

## MVP Scope

The current MVP supports:

* prompt normalization
* exact duplicate detection
* fuzzy duplicate detection
* local SQLite storage
* CLI usage
* project/workspace metadata
* listing saved prompts

VS Code integration will come after the CLI MVP is stable.

## Tech Stack

* TypeScript
* Node.js
* pnpm monorepo
* SQLite
* Vitest
* Commander CLI

## Packages

```text
packages/core    - prompt normalization, hashing, matching, scoring
packages/sqlite  - local persistence
packages/cli     - command-line interface
packages/vscode  - future VS Code integration
```

## Installation

Install dependencies:

```bash
pnpm install
```

Build all packages:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

## CLI Usage

The CLI is currently run through the root `pcheck` script:

```bash
pnpm pcheck <command>
```

### Check a prompt

Check whether a prompt already exists or looks similar to a previous prompt:

```bash
pnpm pcheck check "add tests for parser precedence"
```

With a project scope:

```bash
pnpm pcheck check "add tests for parser precedence" --project prompt-memory
```

With a custom similarity threshold:

```bash
pnpm pcheck check "add unit tests for parser operator precedence" --project prompt-memory --threshold 0.6
```

Expected outputs:

```text
No duplicate prompts found.
```

or:

```text
Exact duplicate found.
```

or:

```text
Similar prompts found.
```

### Save a prompt

Save a prompt to local prompt memory:

```bash
pnpm pcheck save "add tests for parser precedence"
```

Save with a project identifier:

```bash
pnpm pcheck save "add tests for parser precedence" --project prompt-memory
```

Save with extra context:

```bash
pnpm pcheck save "add tests for parser precedence" \
  --project prompt-memory \
  --workspace-path ./ \
  --file-path packages/core/src/textSimilarity.ts \
  --branch main
```

If the prompt already exists, it will not be saved again.

### Check and save

Check a prompt and save it only if no duplicate or similar prompt is found:

```bash
pnpm pcheck check "add cli json output support" --project prompt-memory --save
```

This is the preferred workflow for day-to-day usage.

### List saved prompts

List recently saved prompts:

```bash
pnpm pcheck list
```

List prompts for a specific project:

```bash
pnpm pcheck list --project prompt-memory
```

Limit the number of prompts shown:

```bash
pnpm pcheck list --limit 5
```

## Local Database

By default, prompts are stored locally at:

```text
~/.prompt-memory/prompts.sqlite
```

You can provide a custom database path:

```bash
pnpm pcheck check "add tests" --db-path ./tmp/prompts.sqlite
```

## Development Commands

Build all packages:

```bash
pnpm build
```

Run all tests:

```bash
pnpm test
```

Run type checks:

```bash
pnpm typecheck
```

Run the CLI:

```bash
pnpm pcheck check "your prompt here"
```

## Current Status

The project currently has a working CLI MVP:

```text
save → check → list
```

Next planned improvements:

* JSON output for scripting
* better context-aware scoring
* selected code hashing
* git branch auto-detection
* VS Code extension
* embedding-based semantic matching

```
```
