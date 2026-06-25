import { calculateTextSimilarity } from './textSimilarity.js';

export type PromptCandidate = {
  id: string;
  prompt: string;
  createdAt?: string;
  metadata?: Record<string, unknown>;
};

export type SimilarPromptMatch = PromptCandidate & {
  similarity: number;
};

export type FindSimilarPromptsOptions = {
  threshold?: number;
  maxResults?: number;
};

export function findSimilarPrompts(
  prompt: string,
  candidates: PromptCandidate[],
  options: FindSimilarPromptsOptions = {},
): SimilarPromptMatch[] {
  const { threshold = 0.75, maxResults = 5 } = options;

  return candidates
    .map((candidate) => ({
      ...candidate,
      similarity: calculateTextSimilarity(prompt, candidate.prompt),
    }))
    .filter((candidate) => candidate.similarity >= threshold)
    .sort((first, second) => second.similarity - first.similarity)
    .slice(0, maxResults);
}
