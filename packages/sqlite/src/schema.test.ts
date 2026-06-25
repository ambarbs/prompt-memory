import { describe, expect, it } from 'vitest';
import { schema } from './schema.js';

describe('schema', () => {
  it('creates the prompts table', () => {
    expect(schema).toContain('CREATE TABLE IF NOT EXISTS prompts');
  });

  it('includes prompt hash index', () => {
    expect(schema).toContain('idx_prompts_prompt_hash');
  });

  it('includes project index', () => {
    expect(schema).toContain('idx_prompts_project_id');
  });

  it('includes created_at index', () => {
    expect(schema).toContain('idx_prompts_created_at');
  });
});
