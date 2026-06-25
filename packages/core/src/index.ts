export { normalizePrompt } from './normalizePrompt.js';
export type { NormalizePromptOptions } from './normalizePrompt.js';

export { hashPrompt } from './hashPrompt.js';
export type { HashPromptOptions } from './hashPrompt.js';

export { calculateTextSimilarity } from './textSimilarity.js';
export type { TextSimilarityOptions } from './textSimilarity.js';

export { findSimilarPrompts } from './findSimilarPrompts.js';
export type {
  FindSimilarPromptsOptions,
  PromptCandidate,
  SimilarPromptMatch,
} from './findSimilarPrompts.js';

export const version = '0.1.0';
