import type { PromptRecord } from '@prompt-memory/sqlite';
import { describe, expect, it } from 'vitest';
import { savePrompt } from './savePrompt.js';

function createPromptRecord(
  overrides: Partial<PromptRecord> = {},
): PromptRecord {
  return {
    id: 'prompt-1',
    rawPrompt: 'Add tests for parser',
    normalizedPrompt: 'add tests for parser',
    promptHash: 'hash-1',
    projectId: 'prompt-memory',
    workspacePath: null,
    filePath: null,
    branchName: null,
    selectedCodeHash: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('savePrompt', () => {
  it('saves a new prompt when no exact duplicate exists', () => {
    const savedRecord = createPromptRecord();

    const repository = {
      findByHash: () => [],
      savePrompt: () => savedRecord,
    };

    const result = savePrompt(repository, {
      prompt: 'Add tests for parser',
      projectId: 'prompt-memory',
    });

    expect(result.status).toBe('saved');
    expect(result.prompt.rawPrompt).toBe('Add tests for parser');
  });

  it('does not save when an exact duplicate exists', () => {
    const existingRecord = createPromptRecord();

    const repository = {
      findByHash: () => [existingRecord],
      savePrompt: () => {
        throw new Error('savePrompt should not be called');
      },
    };

    const result = savePrompt(repository, {
      prompt: 'Add tests for parser',
      projectId: 'prompt-memory',
    });

    expect(result.status).toBe('duplicate');
    expect(result.prompt.id).toBe('prompt-1');
  });
});
