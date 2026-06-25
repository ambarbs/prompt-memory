import { describe, expect, it } from 'vitest';
import { hashPrompt } from './hashPrompt.js';

describe('hashPrompt', () => {
  it('returns the same hash for the same prompt', () => {
    const first = hashPrompt('add tests for parser');
    const second = hashPrompt('add tests for parser');

    expect(first).toBe(second);
  });

  it('returns the same hash for whitespace-only differences', () => {
    const first = hashPrompt('  Add   tests for parser  ');
    const second = hashPrompt('add tests for parser');

    expect(first).toBe(second);
  });

  it('returns different hashes for different prompts', () => {
    const first = hashPrompt('add tests for parser');
    const second = hashPrompt('add parser implementation');

    expect(first).not.toBe(second);
  });

  it('respects lowercase option', () => {
    const lowercased = hashPrompt('ADD TESTS FOR PARSER');
    const preservedCase = hashPrompt('ADD TESTS FOR PARSER', {
      lowercase: false,
    });

    expect(lowercased).not.toBe(preservedCase);
  });

  it('returns a sha256 hex digest', () => {
    const hash = hashPrompt('add tests for parser');

    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
