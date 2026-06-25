import { describe, expect, it } from 'vitest';
import {
  findSimilarPrompts,
  type PromptCandidate,
} from './findSimilarPrompts.js';

describe('findSimilarPrompts', () => {
  const candidates: PromptCandidate[] = [
    {
      id: '1',
      prompt: 'add unit tests for parser operator precedence',
    },
    {
      id: '2',
      prompt: 'create sqlite database schema',
    },
    {
      id: '3',
      prompt: 'add parser precedence tests',
    },
  ];

  it('returns similar prompts above the threshold', () => {
    const matches = findSimilarPrompts(
      'add tests for parser precedence',
      candidates,
      {
        threshold: 0.6,
      },
    );

    expect(matches.map((match) => match.id)).toContain('1');
    expect(matches.map((match) => match.id)).toContain('3');
    expect(matches.map((match) => match.id)).not.toContain('2');
  });

  it('sorts matches by similarity descending', () => {
    const matches = findSimilarPrompts(
      'add parser precedence tests',
      candidates,
      {
        threshold: 0.3,
      },
    );

    expect(matches[0].similarity).toBeGreaterThanOrEqual(matches[1].similarity);
  });

  it('limits results', () => {
    const matches = findSimilarPrompts(
      'add parser precedence tests',
      candidates,
      {
        threshold: 0.3,
        maxResults: 1,
      },
    );

    expect(matches).toHaveLength(1);
  });
});
