import { describe, expect, it } from 'vitest';
import { calculateTextSimilarity } from './textSimilarity.js';

describe('calculateTextSimilarity', () => {
  it('returns 1 for identical prompts', () => {
    expect(
      calculateTextSimilarity('add tests for parser', 'add tests for parser'),
    ).toBe(1);
  });

  it('normalizes before comparing', () => {
    expect(
      calculateTextSimilarity(
        '  Add   tests for parser  ',
        'add tests for parser',
      ),
    ).toBe(1);
  });

  it('returns a high score for similar prompts', () => {
    const score = calculateTextSimilarity(
      'add tests for parser precedence',
      'add unit tests for parser operator precedence',
    );

    expect(score).toBeGreaterThan(0.7);
  });

  it('returns a low score for unrelated prompts', () => {
    const score = calculateTextSimilarity(
      'add tests for parser precedence',
      'create sqlite database schema',
    );

    expect(score).toBeLessThan(0.5);
  });

  it('returns 0 when one prompt is empty', () => {
    expect(calculateTextSimilarity('', 'add tests')).toBe(0);
  });
});
