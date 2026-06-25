import { createHash } from 'node:crypto';
import {
  normalizePrompt,
  type NormalizePromptOptions,
} from './normalizePrompt.js';

export type HashPromptOptions = NormalizePromptOptions;

export function hashPrompt(
  input: string,
  options: HashPromptOptions = {},
): string {
  const normalizedPrompt = normalizePrompt(input, options);

  return createHash('sha256').update(normalizedPrompt).digest('hex');
}
