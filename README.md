# Prompt Memory

Prompt Memory is a local-first developer tool for detecting duplicate or near-duplicate AI prompts.

The goal is to help developers answer:

> Have I already asked something like this before, in this project or context?

## Problem

Developers often use multiple AI coding tools across different projects. Prompt history becomes scattered, repeated, and hard to reuse.

This project aims to store prompt history locally and warn when a new prompt looks similar to a previous one.

## MVP Scope

The first MVP will support:

- prompt normalization
- exact duplicate detection
- fuzzy duplicate detection
- local SQLite storage
- CLI usage
- project/workspace metadata

VS Code integration will come after the CLI MVP is working.

## Tech Stack

- TypeScript
- Node.js
- pnpm monorepo
- SQLite
- Vitest
- Commander CLI
- VS Code Extension API later

## Planned Packages

```text
packages/core    - prompt normalization, hashing, matching, scoring
packages/sqlite  - local persistence
packages/cli     - command-line interface
packages/vscode  - VS Code integration