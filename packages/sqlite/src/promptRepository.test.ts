import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createSchema } from './createSchema.js';
import { PromptRepository } from './promptRepository.js';
import { schema } from './schema.js';

describe('PromptRepository', () => {
  let database: Database.Database;
  let repository: PromptRepository;

  beforeEach(() => {
    database = new Database(':memory:');
    createSchema(database, schema);
    repository = new PromptRepository(database);
  });

  afterEach(() => {
    database.close();
  });

  it('saves a prompt', () => {
    const saved = repository.savePrompt({
      rawPrompt: 'Add tests for parser',
      normalizedPrompt: 'add tests for parser',
      promptHash: 'hash-1',
      projectId: 'prompt-memory',
    });

    expect(saved.id).toBeTruthy();
    expect(saved.rawPrompt).toBe('Add tests for parser');
    expect(saved.normalizedPrompt).toBe('add tests for parser');
    expect(saved.promptHash).toBe('hash-1');
    expect(saved.projectId).toBe('prompt-memory');
    expect(saved.createdAt).toBeTruthy();
  });

  it('finds prompts by hash', () => {
    repository.savePrompt({
      rawPrompt: 'Add tests for parser',
      normalizedPrompt: 'add tests for parser',
      promptHash: 'hash-1',
    });

    repository.savePrompt({
      rawPrompt: 'Create sqlite schema',
      normalizedPrompt: 'create sqlite schema',
      promptHash: 'hash-2',
    });

    const matches = repository.findByHash('hash-1');

    expect(matches).toHaveLength(1);
    expect(matches[0].rawPrompt).toBe('Add tests for parser');
  });

  it('returns recent prompts', () => {
    repository.savePrompt({
      rawPrompt: 'First prompt',
      normalizedPrompt: 'first prompt',
      promptHash: 'hash-1',
      createdAt: '2026-01-01T00:00:00.000Z',
    });

    repository.savePrompt({
      rawPrompt: 'Second prompt',
      normalizedPrompt: 'second prompt',
      promptHash: 'hash-2',
      createdAt: '2026-01-02T00:00:00.000Z',
    });

    const recent = repository.findRecentPrompts();

    expect(recent).toHaveLength(2);
    expect(recent[0].rawPrompt).toBe('Second prompt');
  });

  it('limits recent prompts', () => {
    repository.savePrompt({
      rawPrompt: 'First prompt',
      normalizedPrompt: 'first prompt',
      promptHash: 'hash-1',
    });

    repository.savePrompt({
      rawPrompt: 'Second prompt',
      normalizedPrompt: 'second prompt',
      promptHash: 'hash-2',
    });

    const recent = repository.findRecentPrompts(1);

    expect(recent).toHaveLength(1);
  });

  it('finds similar candidates by project', () => {
    repository.savePrompt({
      rawPrompt: 'Prompt A',
      normalizedPrompt: 'prompt a',
      promptHash: 'hash-1',
      projectId: 'project-a',
    });

    repository.savePrompt({
      rawPrompt: 'Prompt B',
      normalizedPrompt: 'prompt b',
      promptHash: 'hash-2',
      projectId: 'project-b',
    });

    const candidates = repository.findSimilarCandidates({
      projectId: 'project-a',
    });

    expect(candidates).toHaveLength(1);
    expect(candidates[0].rawPrompt).toBe('Prompt A');
  });
});
