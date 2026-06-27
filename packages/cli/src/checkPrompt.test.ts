import type { PromptRecord } from '@prompt-memory/sqlite';
import { describe, expect, it } from 'vitest';
import { checkPrompt } from './checkPrompt.js';

function createPromptRecord(
  overrides: Partial<PromptRecord> = {},
): PromptRecord {
  return {
    id: 'prompt-1',
    rawPrompt: 'Add tests for parser precedence',
    normalizedPrompt: 'add tests for parser precedence',
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

describe('checkPrompt', () => {
  it('returns exact matches by hash', () => {
    const existingRecord = createPromptRecord();

    const repository = {
      findByHash: () => [existingRecord],
      findSimilarCandidates: () => [],
    };

    const result = checkPrompt(repository, {
      prompt: 'Add tests for parser precedence',
      projectId: 'prompt-memory',
    });

    expect(result.exactMatches).toHaveLength(1);
    expect(result.similarMatches).toHaveLength(0);
  });

  it('returns similar matches when no exact duplicate exists', () => {
    const candidate = createPromptRecord({
      id: 'prompt-2',
      rawPrompt: 'Add unit tests for parser operator precedence',
      promptHash: 'different-hash',
    });

    const repository = {
      findByHash: () => [],
      findSimilarCandidates: () => [candidate],
    };

    const result = checkPrompt(repository, {
      prompt: 'Add tests for parser precedence',
      projectId: 'prompt-memory',
      threshold: 0.6,
    });

    expect(result.exactMatches).toHaveLength(0);
    expect(result.similarMatches).toHaveLength(1);
    expect(result.similarMatches[0].id).toBe('prompt-2');
  });

  it('returns no matches when nothing is similar', () => {
    const candidate = createPromptRecord({
      id: 'prompt-2',
      rawPrompt: 'Create SQLite database schema',
      promptHash: 'different-hash',
    });

    const repository = {
      findByHash: () => [],
      findSimilarCandidates: () => [candidate],
    };

    const result = checkPrompt(repository, {
      prompt: 'Add tests for parser precedence',
      projectId: 'prompt-memory',
      threshold: 0.75,
    });

    expect(result.exactMatches).toHaveLength(0);
    expect(result.similarMatches).toHaveLength(0);
  });
});
