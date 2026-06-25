import { describe, expect, it } from 'vitest';
import { normalizePrompt } from './normalizePrompt.js';

describe('normalizePrompt', () => {
  it('trims leading and trailing whitespace', () => {
    expect(normalizePrompt('  Add tests for parser  ')).toBe(
      'add tests for parser',
    );
  });

  it('collapses repeated spaces and tabs', () => {
    expect(normalizePrompt('Add    tests\tfor   parser')).toBe(
      'add tests for parser',
    );
  });

  it('normalizes Windows line endings', () => {
    expect(normalizePrompt('Add tests\r\nfor parser')).toBe(
      'add tests\nfor parser',
    );
  });

  it('collapses excessive blank lines', () => {
    expect(normalizePrompt('Add tests\n\n\n\nfor parser')).toBe(
      'add tests\n\nfor parser',
    );
  });

  it('lowercases by default', () => {
    expect(normalizePrompt('ADD TESTS FOR PARSER')).toBe(
      'add tests for parser',
    );
  });

  it('can preserve casing when requested', () => {
    expect(normalizePrompt('ADD TESTS FOR PARSER', { lowercase: false })).toBe(
      'ADD TESTS FOR PARSER',
    );
  });
});
