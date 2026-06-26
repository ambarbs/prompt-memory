#!/usr/bin/env node

import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { Command } from 'commander';
import { openPromptRepository } from '@prompt-memory/sqlite';
import { checkPrompt } from './checkPrompt.js';

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
  .action(
    (
      prompt: string,
      options: {
        project?: string;
        dbPath: string;
        threshold: string;
      },
    ) => {
      mkdirSync(dirname(options.dbPath), { recursive: true });

      const repository = openPromptRepository(options.dbPath);

      const result = checkPrompt(repository, {
        prompt,
        projectId: options.project,
        threshold: Number(options.threshold),
      });

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

      console.log('No duplicate prompts found.');
    },
  );

program.parse();
