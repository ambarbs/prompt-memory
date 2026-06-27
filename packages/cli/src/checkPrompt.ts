import {
  findSimilarPrompts,
  hashPrompt,
  normalizePrompt,
  type PromptCandidate,
  type SimilarPromptMatch,
} from '@prompt-memory/core';
import type { PromptRepository, PromptRecord } from '@prompt-memory/sqlite';

type CheckPromptRepository = Pick<
  PromptRepository,
  'findByHash' | 'findSimilarCandidates'
>;

export type CheckPromptInput = {
  prompt: string;
  projectId?: string;
  threshold?: number;
  maxResults?: number;
};

export type CheckPromptResult = {
  normalizedPrompt: string;
  promptHash: string;
  exactMatches: PromptRecord[];
  similarMatches: SimilarPromptMatch[];
};

export function checkPrompt(
  repository: CheckPromptRepository,
  input: CheckPromptInput,
): CheckPromptResult {
  const normalizedPrompt = normalizePrompt(input.prompt);
  const promptHash = hashPrompt(input.prompt);

  const exactMatches = repository.findByHash(promptHash);

  const candidates = repository.findSimilarCandidates({
    projectId: input.projectId,
    limit: 100,
  });

  const candidatePrompts: PromptCandidate[] = candidates
    .filter((candidate) => candidate.promptHash !== promptHash)
    .map((candidate) => ({
      id: candidate.id,
      prompt: candidate.rawPrompt,
      createdAt: candidate.createdAt,
      metadata: {
        projectId: candidate.projectId,
        filePath: candidate.filePath,
        branchName: candidate.branchName,
      },
    }));

  const similarMatches = findSimilarPrompts(input.prompt, candidatePrompts, {
    threshold: input.threshold ?? 0.75,
    maxResults: input.maxResults ?? 5,
  });

  return {
    normalizedPrompt,
    promptHash,
    exactMatches,
    similarMatches,
  };
}
