#!/usr/bin/env node

import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { Command } from 'commander';
import { openPromptRepository } from '@prompt-memory/sqlite';
import { checkPrompt } from './checkPrompt.js';
import { savePrompt } from './savePrompt.js';

const defaultDatabasePath = join(homedir(), '.prompt-memory', 'prompts.sqlite');

const program = new Command();

program
  .name('pcheck')
  .description('Prompt memory and duplicate prompt checker')
  .version('0.1.0');

program
  .command('check')
  .description('Check whether a prompt looks like a duplicate')
  .argument('<prompt>', 'Prompt text to check')
  .option('-p, --project <projectId>', 'Project/workspace identifier')
  .option('-d, --db-path <path>', 'SQLite database path', defaultDatabasePath)
  .option('-t, --threshold <number>', 'Similarity threshold', '0.75')
  .option('--save', 'Save the prompt if no duplicate is found')
  .option('--json', 'Print result as JSON')
  .action(
    (
      prompt: string,
      options: {
        project?: string;
        dbPath: string;
        threshold: string;
        save?: boolean;
        json?: boolean;
      },
    ) => {
      mkdirSync(dirname(options.dbPath), { recursive: true });

      const repository = openPromptRepository(options.dbPath);

      const result = checkPrompt(repository, {
        prompt,
        projectId: options.project,
        threshold: Number(options.threshold),
      });

      if (options.json) {
        const status =
          result.exactMatches.length > 0
            ? 'exact_duplicate'
            : result.similarMatches.length > 0
              ? 'similar_found'
              : 'no_match';

        console.log(
          JSON.stringify(
            {
              status,
              prompt,
              projectId: options.project ?? null,
              normalizedPrompt: result.normalizedPrompt,
              promptHash: result.promptHash,
              exactMatches: result.exactMatches,
              similarMatches: result.similarMatches,
            },
            null,
            2,
          ),
        );

        if (status !== 'no_match') {
          process.exitCode = 1;
        }

        return;
      }
      if (result.exactMatches.length > 0) {
        console.log('Exact duplicate found.\n');

        for (const match of result.exactMatches) {
          console.log(`- ${match.rawPrompt}`);
          console.log(`  Created: ${match.createdAt}`);

          if (match.projectId) {
            console.log(`  Project: ${match.projectId}`);
          }

          console.log('');
        }

        process.exitCode = 1;
        return;
      }

      if (result.similarMatches.length > 0) {
        console.log('Similar prompts found.\n');

        for (const match of result.similarMatches) {
          console.log(`- ${match.prompt}`);
          console.log(`  Similarity: ${Math.round(match.similarity * 100)}%`);

          if (match.createdAt) {
            console.log(`  Created: ${match.createdAt}`);
          }

          const projectId = match.metadata?.projectId;

          if (typeof projectId === 'string' && projectId.length > 0) {
            console.log(`  Project: ${projectId}`);
          }

          console.log('');
        }

        process.exitCode = 1;
        return;
      }

      if (options.save) {
        const saved = savePrompt(repository, {
          prompt,
          projectId: options.project,
        });

        if (saved.status === 'saved') {
          console.log('No duplicate prompts found.');
          console.log('Prompt saved.');
          console.log(`ID: ${saved.prompt.id}`);
          console.log(`Created: ${saved.prompt.createdAt}`);

          if (saved.prompt.projectId) {
            console.log(`Project: ${saved.prompt.projectId}`);
          }

          return;
        }

        console.log('Prompt already exists.');
        console.log(`ID: ${saved.prompt.id}`);
        console.log(`Created: ${saved.prompt.createdAt}`);
        return;
      }

      console.log('No duplicate prompts found.');
    },
  );

program
  .command('save')
  .description('Save a prompt to local prompt memory')
  .argument('<prompt>', 'Prompt text to save')
  .option('-p, --project <projectId>', 'Project/workspace identifier')
  .option('-d, --db-path <path>', 'SQLite database path', defaultDatabasePath)
  .option('--workspace-path <path>', 'Workspace path')
  .option('--file-path <path>', 'Related file path')
  .option('--branch <branchName>', 'Git branch name')
  .option('--selected-code-hash <hash>', 'Hash of selected code context')
  .option('--json', 'Print result as JSON')
  .action(
    (
      prompt: string,
      options: {
        project?: string;
        dbPath: string;
        workspacePath?: string;
        filePath?: string;
        branch?: string;
        selectedCodeHash?: string;
        json?: boolean;
      },
    ) => {
      mkdirSync(dirname(options.dbPath), { recursive: true });

      const repository = openPromptRepository(options.dbPath);

      const result = savePrompt(repository, {
        prompt,
        projectId: options.project,
        workspacePath: options.workspacePath,
        filePath: options.filePath,
        branchName: options.branch,
        selectedCodeHash: options.selectedCodeHash,
      });

      if (options.json) {
        console.log(
          JSON.stringify(
            {
              status: result.status,
              prompt: result.prompt,
            },
            null,
            2,
          ),
        );

        return;
      }

      if (result.status === 'duplicate') {
        console.log('Prompt already exists.');
        console.log(`ID: ${result.prompt.id}`);
        console.log(`Created: ${result.prompt.createdAt}`);

        if (result.prompt.projectId) {
          console.log(`Project: ${result.prompt.projectId}`);
        }

        return;
      }

      console.log('Prompt saved.');
      console.log(`ID: ${result.prompt.id}`);
      console.log(`Created: ${result.prompt.createdAt}`);

      if (result.prompt.projectId) {
        console.log(`Project: ${result.prompt.projectId}`);
      }
    },
  );

program
  .command('list')
  .description('List recently saved prompts')
  .option('-p, --project <projectId>', 'Project/workspace identifier')
  .option('-d, --db-path <path>', 'SQLite database path', defaultDatabasePath)
  .option('-l, --limit <number>', 'Number of prompts to show', '10')
  .option('--json', 'Print result as JSON')
  .action(
    (options: {
      project?: string;
      dbPath: string;
      limit: string;
      json?: boolean;
    }) => {
      mkdirSync(dirname(options.dbPath), { recursive: true });

      const repository = openPromptRepository(options.dbPath);
      const limit = Number(options.limit);

      const prompts = options.project
        ? repository.findSimilarCandidates({
            projectId: options.project,
            limit,
          })
        : repository.findRecentPrompts(limit);

      if (options.json) {
        console.log(
          JSON.stringify(
            {
              status: 'ok',
              count: prompts.length,
              prompts,
            },
            null,
            2,
          ),
        );

        return;
      }

      if (prompts.length === 0) {
        console.log('No prompts found.');
        return;
      }

      for (const prompt of prompts) {
        console.log(`- ${prompt.rawPrompt}`);
        console.log(`  ID: ${prompt.id}`);
        console.log(`  Created: ${prompt.createdAt}`);

        if (prompt.projectId) {
          console.log(`  Project: ${prompt.projectId}`);
        }

        if (prompt.filePath) {
          console.log(`  File: ${prompt.filePath}`);
        }

        if (prompt.branchName) {
          console.log(`  Branch: ${prompt.branchName}`);
        }

        console.log('');
      }
    },
  );

program.parse();
