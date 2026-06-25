import { describe, expect, it, vi } from 'vitest';
import { createSchema } from './createSchema.js';

describe('createSchema', () => {
  it('executes the provided schema', () => {
    const database = {
      exec: vi.fn(),
    };

    createSchema(database, 'CREATE TABLE prompts (id TEXT);');

    expect(database.exec).toHaveBeenCalledWith(
      'CREATE TABLE prompts (id TEXT);',
    );
  });
});
